import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'

// A remark‑lint plugin: it walks all `heading` nodes and
// complains if they don’t follow Sentence case.
export default function remarkLintHeadingSentenceCase() {
  return (tree, file) => {
    visit(tree, 'heading', node => {
      const text = toString(node)
      if (!text) return

      // 1) First character must be uppercase
      if (!/^[A-Z]/.test(text)) {
        file.message(
          `Heading should start with an uppercase letter (Sentence case): "${text}"`,
          node
        )
      }

      // 2) No other word should start uppercase
      const words = text.split(/\s+/)
      for (let i = 1; i < words.length; i++) {
        if (/^[A-Z]/.test(words[i])) {
          file.message(
            `Only the first word of a sentence‑case heading may be capitalized: "${words[i]}"`,
            node
          )
        }
      }
    })
  }
}

