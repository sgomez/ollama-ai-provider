# ollama-ai-provider

Vercel AI Provider for running Large Language Models locally using Ollama

> **Note: This module is under development and may contain errors and frequent incompatible changes.**

## Installation

The Ollama provider is available in the `ollama-ai-provider` module. You can install it with

```bash
npm i ollama-ai-provider
```

## Provider Instance

You can import the default provider instance `ollama` from `ollama-ai-provider`:

```ts
import { ollama } from 'ollama-ai-provider';
```

If you need a customized setup, you can import `createOllama` from `ollama-ai-provider` and create a provider instance with your settings:

```ts
import { createOllama } from 'ollama-ai-provider';

const ollama = createOllama({
  // custom settings
});
```

You can use the following optional settings to customize the Mistral provider instance:

- **baseURL** _string_

  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `http://localhost:11434/api`.

- **headers** _Record<string,string>_

  Custom headers to include in the requests.


## Models

The first argument is the model id, e.g. `phi3`.

```ts
const model = mistral('phi3');
```
