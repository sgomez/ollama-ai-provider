# ollama-ai-provider

Vercel AI Provider for running Large Language Models locally using Ollama.

## Requirements

This provider requires Ollama >= 0.5.0

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

You can use the following optional settings to customize the Ollama provider instance:

- **baseURL** _string_

  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `http://localhost:11434/api`.

- **headers** _Record<string,string>_

  Custom headers to include in the requests.


## Models

The first argument is the model id, e.g. `phi3`.

```ts
const model = ollama('phi3');
```

## Examples

Inside the `examples` folder, you will find some example projects to see how the provider works. Each folder 
has its own README with the usage description.

## Tested models and capabilities

This provider is capable of generating and streaming text and objects. Object generation may fail depending 
on the model used and the schema used.

At least it has been tested with the following features:

| Image input        | Object generation  | Tool usage         | Tool streaming |
|--------------------|--------------------|--------------------|----------------|
| :white_check_mark: | :white_check_mark: | :white_check_mark: | :warning:      | 

### Image input

You need to use any model with visual understanding. These are tested:

* llava
* llava-llama3
* llava-phi3
* llama3.2-vision
* moondream

Ollama does not support URLs, but the ai-sdk is able to download the file and send it to the model.

### Object generation

> This feature is unstable with some models


Some models are better than others. Also, there is a bug in Ollama that sometimes causes the JSON generation to be slow or
end with an error. In my tests, I detected this behavior with llama3 and phi3 models more than others like
`openhermes` and `mistral`, but you can experiment with them too.

More info about the bugs:

* https://github.com/ollama/ollama/issues/3851
* https://github.com/ollama/ollama/pull/3785

Remember that Ollama and this module are free software, so be patient.

### Tool usage (no streaming)

Ollama has introduced support for tooling, enabling models to interact with external tools more seamlessly. Please, see the [list of models with tooling support](https://ollama.com/search?c=tools) in the Ollama site.

Caveats:

1. Object-tool mode may not work with certain models.
2. Errors may still occur due to model limitations, tool integration issues, or other factors. Unfortunately, they may be inherent to the model’s design or implementation, and there may not be a way to resolve them fully

### Tool streaming

> This feature is not completed and unstable

Ollama tooling does not support it in streams, but this provider can detect tool responses.

You can disable this experimental feature with `` setting:

```ts
ollama("model", {
  experimentalStreamTools: false,
})
```

### Intercepting Fetch Requests

This provider supports [Intercepting Fetch Requests](https://sdk.vercel.ai/examples/providers/intercepting-fetch-requests).

### Provider Management

> Provider management is an experimental feature

This provider supports [Provider Management](https://sdk.vercel.ai/docs/ai-sdk-core/provider-management).
