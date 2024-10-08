.SILENT:
.DEFAULT_GOAL := all

define RUN_EXAMPLE_TARGET
	echo -- examples/$(subst _,/,$(1))
	pnpm tsx src/$(subst _,/,$(1)).ts
endef

all: complex embed embed-many registry generate-object generate-text stream-object stream-text telemetry

# complex
.PHONY: complex complex-run complex-all semantic-router_main
complex: complex-run complex-all
complex-run:
	echo - examples/complex:
complex-all: semantic-router_main
semantic-router_main:
	$(call RUN_EXAMPLE_TARGET,complex/$@)


# embed
.PHONY: embed embed-run embed-all embed_ollama
embed: embed-run embed-all
embed-run:
	echo - examples/embed:
embed-all: embed_ollama
embed_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)


# embed-many
.PHONY: embed-many embed-many-run embed-many-all embed-many_ollama
embed-many: embed-many-run embed-many-all
embed-many-run:
	echo - examples/embed-many:
embed-many-all: embed-many_ollama embed-many_ollama-cosine-similarity
embed-many_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)
embed-many_ollama-cosine-similarity:
	$(call RUN_EXAMPLE_TARGET,$@)


# middleware
.PHONY: middleware middleware-run middleware-all middleware_generate-text-cache-middleware middleware_generate-text-log-middleware middleware_stream-text-log-middleware middleware_stream-text-rag-middleware
middleware: middleware-run middleware-all
middleware-run:
	echo - examples/middleware:
middleware-all: middleware_generate-text-cache-middleware middleware_generate-text-log-middleware middleware_stream-text-log-middleware middleware_stream-text-rag-middleware
middleware_generate-text-cache-middleware:
	$(call RUN_EXAMPLE_TARGET,$@)
middleware_generate-text-log-middleware:
	$(call RUN_EXAMPLE_TARGET,$@)
middleware_stream-text-log-middleware:
	$(call RUN_EXAMPLE_TARGET,$@)
middleware_stream-text-rag-middleware:
	$(call RUN_EXAMPLE_TARGET,$@)


# registry
.PHONY: registry registry-run registry-all registry_embed registry_stream-text registry_stream-multimodal
registry: registry-run registry-all
registry-run:
	echo - examples/registry:
registry-all: registry_embed registry_stream-text registry_stream-multimodal
registry_embed:
	$(call RUN_EXAMPLE_TARGET,$@)
registry_stream-text:
	$(call RUN_EXAMPLE_TARGET,$@)
registry_stream-multimodal:
	$(call RUN_EXAMPLE_TARGET,$@)



# generate-object
.PHONY: generate-object generate-object-run generate-object-all generate-object_ollama generate-object_ollama-array generate-object_ollama-date-parsing generate-object_ollama-enum generate-object_ollama-full-result generate-object_ollama-json generate-object_ollama-multimodal generate-object_ollama-no-schema generate-object_ollama-raw-json-schema generate-object_ollama-tool
generate-object: generate-object-run generate-object-all
generate-object-run:
	echo - examples/generate-object:
generate-object-all: generate-object_ollama generate-object_ollama-array generate-object_ollama-date-parsing generate-object_ollama-enum generate-object_ollama-full-result generate-object_ollama-json generate-object_ollama-multimodal generate-object_ollama-no-schema generate-object_ollama-raw-json-schema generate-object_ollama-tool
generate-object_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-array:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-date-parsing:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-enum:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-full-result:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-json:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-multimodal:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-no-schema:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-raw-json-schema:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-tool:
	$(call RUN_EXAMPLE_TARGET,$@)


# generate-text
.PHONY: generate-text generate-text-run generate-text-all generate-text_ollama generate-text_ollama-completion generate-text_ollama-completion-chat generate-text_ollama-custom-fetch generate-text_ollama-custom-headers generate-text_ollama-full-result generate-text_ollama-log-metadata-middleware generate-text_ollama-multi-step generate-text_ollama-multimodal generate-text_ollama-multimodal-base64 generate-text_ollama-multimodal-url generate-text_ollama-system-message-a generate-text_ollama-system-message-b generate-text_ollama-tool-call generate-text_ollama-tool-call-raw-json-schema
generate-text: generate-text-run generate-text-all
generate-text-run:
	echo - examples/generate-text:
generate-text-all: generate-text_ollama generate-text_ollama-completion generate-text_ollama-completion-chat generate-text_ollama-custom-fetch generate-text_ollama-custom-headers generate-text_ollama-full-result generate-text_ollama-log-metadata-middleware generate-text_ollama-multi-step generate-text_ollama-multimodal generate-text_ollama-multimodal-base64 generate-text_ollama-multimodal-url generate-text_ollama-system-message-a generate-text_ollama-system-message-b generate-text_ollama-tool-call generate-text_ollama-tool-call-raw-json-schema
generate-text_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-completion:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-completion-chat:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-custom-fetch:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-custom-headers:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-full-result:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-log-metadata-middleware:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-multi-step:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-multimodal:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-multimodal-base64:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-multimodal-url:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-system-message-a:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-system-message-b:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-tool-call:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-tool-call-raw-json-schema:
	$(call RUN_EXAMPLE_TARGET,$@)


# stream-object
.PHONY: stream-object stream-object-run stream-object-all stream-object_ollama stream-object_ollama-array stream-object_ollama-fullstream stream-object_ollama-json stream-object_ollama-no-schema stream-object_ollama-object stream-object_ollama-on-finish stream-object_ollama-raw-json-schema stream-object_ollama-token-usage stream-object_ollama-tool
stream-object: stream-object-run stream-object-all
stream-object-run:
	echo - examples/stream-object:
stream-object-all: stream-object_ollama stream-object_ollama-array stream-object_ollama-fullstream stream-object_ollama-json stream-object_ollama-no-schema stream-object_ollama-object stream-object_ollama-on-finish stream-object_ollama-raw-json-schema stream-object_ollama-token-usage stream-object_ollama-tool
stream-object_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-array:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-fullstream:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-json:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-no-schema:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-object:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-on-finish:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-raw-json-schema:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-token-usage:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-tool:
	$(call RUN_EXAMPLE_TARGET,$@)

# stream-text
.PHONY: stream-text stream-text-run stream-text-all stream-text_ollama stream-text_ollama-abort stream-text_ollama-chatbot stream-text_ollama-chatbot-with-tools stream-text_ollama-completion stream-text_ollama-completion-chat stream-text_ollama-custom-fetch-inject-error stream-text_ollama-fullstream stream-text_ollama-fullstream-raw stream-text_ollama-ollama-on-chunk stream-text_ollama-ollama-on-chunk-tool-call-streaming stream-text_ollama-on-finish stream-text_ollama-reader stream-text_ollama-response stream-text_ollama-tool-call-raw-json-schema
stream-text: stream-text-run stream-text-all
stream-text-run:
	echo - examples/stream-text:
stream-text-all: stream-text_ollama stream-text_ollama-abort stream-text_ollama-chatbot stream-text_ollama-chatbot-with-tools stream-text_ollama-completion stream-text_ollama-completion-chat stream-text_ollama-custom-fetch-inject-error stream-text_ollama-fullstream stream-text_ollama-fullstream-raw stream-text_ollama-ollama-on-chunk stream-text_ollama-ollama-on-chunk-tool-call-streaming  stream-text_ollama-on-finish stream-text_ollama-reader stream-text_ollama-response stream-text_ollama-tool-call-raw-json-schema
stream-text_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-abort:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-chatbot:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-chatbot-with-tools:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-completion:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-completion-chat:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-custom-fetch-inject-error:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-fullstream:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-fullstream-raw:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-ollama-on-chunk:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-ollama-on-chunk-tool-call-streaming:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-on-finish:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-reader:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-response:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-tool-call-raw-json-schema:
	$(call RUN_EXAMPLE_TARGET,$@)

# telemetry
.PHONY: telemetry telemetry-run telemetry-all telemetry_generate-object telemetry_generate-text telemetry_generate-text-tool-call telemetry_stream-object telemetry_stream-text
telemetry: telemetry-run telemetry-all
telemetry-run:
	echo - examples/telemetry:
telemetry-all: telemetry_generate-object telemetry_generate-text telemetry_generate-text-tool-call telemetry_stream-object telemetry_stream-text
telemetry_generate-object:
	$(call RUN_EXAMPLE_TARGET,$@)
telemetry_generate-text:
	$(call RUN_EXAMPLE_TARGET,$@)
telemetry_generate-text-tool-call:
	$(call RUN_EXAMPLE_TARGET,$@)
telemetry_stream-object:
	$(call RUN_EXAMPLE_TARGET,$@)
telemetry_stream-text:
	$(call RUN_EXAMPLE_TARGET,$@)
