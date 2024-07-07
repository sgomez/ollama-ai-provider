import { EmptyResponseBodyError } from '@ai-sdk/provider'
import {
  extractResponseHeaders,
  ParseResult,
  ResponseHandler,
  safeParseJSON,
} from '@ai-sdk/provider-utils'
import { ZodSchema } from 'zod'

import { TextLineStream } from '@/utils/text-line-stream'

export const createJsonStreamResponseHandler =
  <T>(
    chunkSchema: ZodSchema<T>,
  ): ResponseHandler<ReadableStream<ParseResult<T>>> =>
  async ({ response }: { response: Response }) => {
    const responseHeaders = extractResponseHeaders(response)

    if (response.body === null) {
      throw new EmptyResponseBodyError({})
    }

    return {
      responseHeaders,
      value: response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new TextLineStream())
        .pipeThrough(
          new TransformStream<string, ParseResult<T>>({
            transform(chunkText, controller) {
              controller.enqueue(
                safeParseJSON({
                  schema: chunkSchema,
                  text: chunkText,
                }),
              )
            },
          }),
        ),
    }
  }
