.SILENT:
.DEFAULT_GOAL := all

define RUN_EXAMPLE_TARGET
	echo -- examples/$(subst _,/,$(1))
	pnpm tsx src/$(subst _,/,$(1)).ts
endef

all: complex embed embed-many generate-object generate-text stream-object stream-text

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
embed-many-all: embed-many_ollama
embed-many_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)


# generate-object
.PHONY: generate-object generate-object-run generate-object-all generate-object_ollama generate-object_ollama-full-json generate-object_ollama-json generate-object_ollama-multimodal generate-object_ollama-tool
generate-object: generate-object-run generate-object-all
generate-object-run:
	echo - examples/generate-object:
generate-object-all: generate-object_ollama generate-object_ollama-full-json generate-object_ollama-json generate-object_ollama-multimodal generate-object_ollama-tool
generate-object_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-full-json:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-json:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-multimodal:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-object_ollama-tool:
	$(call RUN_EXAMPLE_TARGET,$@)


# generate-text
.PHONY: generate-text generate-text-run generate-text-all generate-text_ollama generate-text_ollama-completion generate-text_ollama-completion-chat generate-text_ollama-multimodal generate-text_ollama-multimodal-base64 generate-text_ollama-multimodal-url generate-text_ollama-system-message-a generate-text_ollama-system-message-b generate-text_ollama-tool-call
generate-text: generate-text-run generate-text-all
generate-text-run:
	echo - examples/generate-text:
generate-text-all: generate-text_ollama generate-text_ollama-completion generate-text_ollama-completion-chat generate-text_ollama-multimodal generate-text_ollama-multimodal-base64 generate-text_ollama-system-message-a generate-text_ollama-system-message-b generate-text_ollama-tool-call
generate-text_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-completion:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-completion-chat:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-multimodal:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-multimodal-base64:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-multimodal-url: # manual, not supported
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-system-message-a:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-system-message-b:
	$(call RUN_EXAMPLE_TARGET,$@)
generate-text_ollama-tool-call:
	$(call RUN_EXAMPLE_TARGET,$@)


# stream-object
.PHONY: stream-object stream-object-run stream-object-all stream-object_ollama stream-object_ollama-fullstream stream-object_ollama-json stream-object_ollama-tool
stream-object: stream-object-run stream-object-all
stream-object-run:
	echo - examples/stream-object:
stream-object-all: stream-object_ollama stream-object_ollama-fullstream stream-object_ollama-json stream-object_ollama-tool
stream-object_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-fullstream:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-json:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-object_ollama-tool:
	$(call RUN_EXAMPLE_TARGET,$@)


# stream-text
.PHONY: stream-text stream-text-run stream-text-all stream-text_ollama stream-text_ollama-abort stream-text_ollama-completion stream-text_ollama-completion-chat stream-text_ollama-reader
stream-text: stream-text-run stream-text-all
stream-text-run:
	echo - examples/stream-text:
stream-text-all: stream-text_ollama stream-text_ollama-abort stream-text_ollama-completion stream-text_ollama-completion-chat stream-text_ollama-fullstream stream-text_ollama-reader
stream-text_ollama:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-abort:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-chatbot: # manual
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-completion:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-completion-chat:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-fullstream:
	$(call RUN_EXAMPLE_TARGET,$@)
stream-text_ollama-reader:
	$(call RUN_EXAMPLE_TARGET,$@)

