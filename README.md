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

### Tested models and capabilities

This provider is capable of generating and streaming text and objects. It does not
support function calling (tools). Object generation may fail depending 
on the model used and the schema used.

At least it has been verified to work on the following models:

| Model      | Image input        | Object generation  | Tool usage         | Tool streaming |
|------------|--------------------|--------------------|--------------------|----------------|
| llama2     | :x:                | :white_check_mark: | :x:                | :x:            | 
| llama3     | :x:                | :white_check_mark: | :x:                | :x:            | 
| llava      | :white_check_mark: | :white_check_mark: | :x:                | :x:            | 
| mistral    | :x:                | :white_check_mark: | :x:                | :x:            | 
| mixtral    | :x:                | :white_check_mark: | :white_check_mark: | :x:            | 
| openhermes | :x:                | :white_check_mark: | :white_check_mark: | :x:            | 
| phi3       | :x:                | :white_check_mark: | :x:                | :x:            | 

### Caveats

* Some models have been found to be slow when streaming objects. See https://github.com/ollama/ollama/issues/3851
* The use of tools is not supported by the Ollama API and has been simulated with system prompt injection, so the behavior
depending on the model can be erratic.
* This library is highly experimental and can change constantly. All releases will be of type MAJOR following the
0.MAJOR.MINOR scheme. Only bugs and model updates will be released as MINOR.
