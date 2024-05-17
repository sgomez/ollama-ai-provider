import { createJsonErrorResponseHandler } from '@ai-sdk/provider-utils'
import { z } from 'zod'

const ollamaErrorDataSchema = z.object({
  error: z.object({
    code: z.string().nullable(),
    message: z.string(),
    param: z.any().nullable(),
    type: z.string(),
  }),
})

export type OllamaErrorData = z.infer<typeof ollamaErrorDataSchema>

export const ollamaFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: ollamaErrorDataSchema,
  errorToMessage: (data) => data.error.message,
})
