export class TextLineStream extends TransformStream<string, string> {
  private buffer = ''

  constructor() {
    super({
      flush: (controller) => {
        if (this.buffer.length === 0) return

        controller.enqueue(this.buffer)
      },
      transform: (chunkText, controller) => {
        chunkText = this.buffer + chunkText

        while (true) {
          const EOL = chunkText.indexOf('\n')

          if (EOL === -1) break

          controller.enqueue(chunkText.slice(0, EOL))
          chunkText = chunkText.slice(EOL + 1)
        }

        this.buffer = chunkText
      },
    })
  }
}
