# Ollama Provider for the Vercel AI SDK

The **[Ollama Provider](https://github.com/sgomez/ollama-ai-provider)** for the [Vercel AI SDK](https://sdk.vercel.ai/docs)
contains language model support for the Ollama APIs and embedding model support for the Ollama embeddings API.

## Requirements

This provider requires Ollama >= 0.5.0

## Setup

The Ollama provider is available in the `ollama-ai-provider` module. You can install it with

```bash
npm i ollama-ai-provider
```

## Provider Instance

You can import the default provider instance `ollama` from `ollama-ai-provider`:

```ts
import { ollama } from 'ollama-ai-provider';
```

## Example

```ts
import { ollama } from 'ollama-ai-provider';
import { generateText } from 'ai';

const { text } = await generateText({
  model: ollama('phi3'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Documentation

Please check out the **[Ollama provider documentation](https://github.com/sgomez/ollama-ai-provider)** for more information.
