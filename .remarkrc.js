import mdx          from 'remark-mdx'
import lint         from 'remark-lint'
import presetGuide  from 'remark-preset-lint-markdown-style-guide'
import headingStyle from 'remark-lint-heading-style'
import sentenceCase from './tools/remark-lint-heading-sentence-case.js'

export default {
  plugins: [
    remarkMdx,                                   // parse .mdx
    [remarkLint, { /* show only errors */ }],    // enable linting
    [headingStyle, 'atx'],                       // ensure all headings use `#` style :contentReference[oaicite:0]{index=0}
    headingSentenceCase                          // our custom sentence‑case rule :contentReference[oaicite:1]{index=1}
  ]
}

