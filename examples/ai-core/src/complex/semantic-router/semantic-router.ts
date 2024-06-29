import {
  cosineSimilarity,
  embed,
  Embedding,
  EmbeddingModel,
  embedMany,
} from 'ai'

export interface Route<NAME extends string> {
  name: NAME
  values: string[]
}

/**
 * Routes values based on their distance to the values from a set of clusters.
 * When the distance is below a certain threshold, the value is classified as belonging to the route,
 * and the route name is returned. Otherwise, the value is classified as null.
 */
export class SemanticRouter<ROUTES extends Array<Route<string>>> {
  readonly routes: ROUTES
  readonly embeddingModel: EmbeddingModel<string>
  readonly similarityThreshold: number

  private routeValues:
    | Array<{ embedding: Embedding; routeName: string; routeValue: string }>
    | undefined

  constructor({
    embeddingModel,
    routes,
    similarityThreshold,
  }: {
    embeddingModel: EmbeddingModel<string>
    routes: ROUTES
    similarityThreshold: number
  }) {
    this.routes = routes
    this.embeddingModel = embeddingModel
    this.similarityThreshold = similarityThreshold
  }

  private async getRouteValues(): Promise<
    Array<{ embedding: Embedding; routeName: string; routeValue: string }>
  > {
    if (this.routeValues !== undefined) {
      return this.routeValues
    }

    this.routeValues = []

    for (const route of this.routes) {
      const { embeddings } = await embedMany({
        model: this.embeddingModel,
        values: route.values,
      })

      for (const [index, embedding] of embeddings.entries()) {
        this.routeValues.push({
          embedding: embedding,
          routeName: route.name,
          routeValue: route.values[index],
        })
      }
    }

    return this.routeValues
  }

  async route(value: string) {
    const { embedding } = await embed({ model: this.embeddingModel, value })
    const routeValues = await this.getRouteValues()

    const allMatches: Array<{
      routeName: string
      routeValue: string
      similarity: number
    }> = []

    for (const routeValue of routeValues) {
      const similarity = cosineSimilarity(embedding, routeValue.embedding)

      if (similarity >= this.similarityThreshold) {
        allMatches.push({
          routeName: routeValue.routeName,
          routeValue: routeValue.routeValue,
          similarity,
        })
      }
    }

    // sort (highest similarity first)
    allMatches.sort((a, b) => b.similarity - a.similarity)

    return allMatches.length > 0
      ? (allMatches[0].routeName as unknown as RouteNames<ROUTES>)
      : null
  }
}

type RouteNames<ROUTES> = ROUTES extends Array<Route<infer NAME>> ? NAME : never
