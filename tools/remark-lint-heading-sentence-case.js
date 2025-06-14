import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

// A remark‑lint plugin: it walks all `heading` nodes and
// complains if they don't follow Sentence case.
export default function remarkLintHeadingSentenceCase() {
  return (tree, file) => {
    visit(tree, "heading", (node) => {
      const text = toString(node);
      if (!text) return;

      // Allow certain technical terms and proper nouns to remain capitalized
      const allowedCapitalizedWords = [
        "API",
        "APIs",
        "MCP",
        "I",
        "ID",
        "AgentRank",
        "Recall",
        "Agent",
        "RecallAgentToolkit",
        "RecallNetwork",
        "AgentToolkit",
        "Portal",
        "Hub",
        "Toolkit",
        "Competition",
        "Competitions",
        "GitHub",
        "SDK",
        "CLI",
        "AI",
        "OAuth",
        "JWT",
        "REST",
        "OpenAI",
        "Claude",
        "GPT",
        "LLM",
        "LLMs",
        "DALL-E",
        "LangChain",
        "Mastra",
        "Eliza",
        "Cursor",
        "macOS",
        "Windows",
        "Linux",
        "Ubuntu",
        "TypeScript",
        "Python",
        "MinIO",
        "Vercel",
        "AI SDK",
        "S3",
        "IPC",
        "Filecoin",
        "IPFS",
        "URL",
        "WebSocket",
        "ETH",
        "SOL",
        "Setup",
        "Configure",
        "Desktop",
        "Local",
        "Registration",
        "Live",
        "Key",
        "Private",
        "Format",
        "Invalid",
      ];

      // Check if this is frontmatter content
      if (text.includes("title:") || text.includes("description:") || text.includes("keywords:")) {
        // Extract and check title field specifically
        const titleMatch = text.match(/title:\s*(.+?)(?:\n|$)/i);
        if (titleMatch) {
          let titleText = titleMatch[1].trim();

          // Remove quotes if present
          titleText = titleText.replace(/^["']|["']$/g, "");

          // Check if this is a numbered title (e.g., "title: 5. Build the portfolio")
          const numberedTitleMatch = titleText.match(/^(\d+)\.\s+(.+)$/);

          if (numberedTitleMatch) {
            // For numbered titles, check sentence case starting after the number and period
            const headingText = numberedTitleMatch[2];

            // First character after number should be uppercase
            if (!/^[A-Z]/.test(headingText)) {
              file.message(
                `Title should have first letter capitalized after the number: "title: ${titleText}"`,
                node
              );
            }

            // Check other words in the numbered title
            const words = headingText.split(/\s+/);
            for (let i = 1; i < words.length; i++) {
              const word = words[i];
              if (allowedCapitalizedWords.includes(word)) continue;
              if (
                word.includes(".") ||
                word.includes("-") ||
                word.includes("_") ||
                /^\d+$/.test(word)
              )
                continue;

              const cleanWord = word.replace(/[^\w]/g, "");
              if (allowedCapitalizedWords.includes(cleanWord)) continue;

              if (/^[A-Z]/.test(word)) {
                file.message(
                  `Only the first word of a sentence‑case title may be capitalized (unless it's a proper noun or technical term): "${word}" in "title: ${titleText}"`,
                  node
                );
              }
            }
          } else {
            // For regular titles, apply sentence case rules
            // First character must be uppercase
            if (!/^[A-Z]/.test(titleText)) {
              file.message(
                `Title should start with an uppercase letter (Sentence case): "title: ${titleText}"`,
                node
              );
            }

            // Check other words for improper capitalization
            const words = titleText.split(/\s+/);
            for (let i = 1; i < words.length; i++) {
              const word = words[i];
              if (allowedCapitalizedWords.includes(word)) continue;
              if (
                word.includes(".") ||
                word.includes("-") ||
                word.includes("_") ||
                /^\d+$/.test(word)
              )
                continue;

              const cleanWord = word.replace(/[^\w]/g, "");
              if (allowedCapitalizedWords.includes(cleanWord)) continue;

              if (/^[A-Z]/.test(word)) {
                file.message(
                  `Only the first word of a sentence‑case title may be capitalized (unless it's a proper noun or technical term): "${word}" in "title: ${titleText}"`,
                  node
                );
              }
            }
          }
        }
        return; // Exit early for frontmatter
      }

      // Skip headings that are all caps (likely acronyms)
      if (text === text.toUpperCase()) return;

      // Check if this is a numbered heading (e.g., "1. Some heading text")
      const numberedHeadingMatch = text.match(/^(\d+)\.\s+(.+)$/);

      if (numberedHeadingMatch) {
        // For numbered headings, check sentence case starting after the number and period
        const headingText = numberedHeadingMatch[2];

        // First character after number should be uppercase
        if (!/^[A-Z]/.test(headingText)) {
          file.message(
            `Numbered heading should have first letter capitalized after the number: "${text}"`,
            node
          );
        }

        // Check other words in the numbered heading
        const words = headingText.split(/\s+/);
        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          // Skip if it's an allowed capitalized word
          if (allowedCapitalizedWords.includes(word)) continue;

          // Skip if it's a word with mixed case that might be a technical term
          if (word.includes(".") || word.includes("-") || word.includes("_") || /^\d+$/.test(word))
            continue;

          // Skip words that end with punctuation (like "Desktop?" or "Recall?")
          const cleanWord = word.replace(/[^\w]/g, "");
          if (allowedCapitalizedWords.includes(cleanWord)) continue;

          if (/^[A-Z]/.test(word)) {
            file.message(
              `Only the first word of a sentence‑case heading may be capitalized (unless it's a proper noun or technical term): "${word}" in "${text}"`,
              node
            );
          }
        }
        return; // Exit early for numbered headings
      }

      // For non-numbered headings, apply regular sentence case rules
      // 1) First character must be uppercase
      if (!/^[A-Z]/.test(text)) {
        file.message(
          `Heading should start with an uppercase letter (Sentence case): "${text}"`,
          node
        );
      }

      // 2) Check other words for improper capitalization
      const words = text.split(/\s+/);
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        // Skip if it's an allowed capitalized word
        if (allowedCapitalizedWords.includes(word)) continue;

        // Skip if it's a word with mixed case that might be a technical term
        if (word.includes(".") || word.includes("-") || word.includes("_") || /^\d+$/.test(word))
          continue;

        // Skip words that end with punctuation (like "Desktop?" or "Recall?")
        const cleanWord = word.replace(/[^\w]/g, "");
        if (allowedCapitalizedWords.includes(cleanWord)) continue;

        if (/^[A-Z]/.test(word)) {
          file.message(
            `Only the first word of a sentence‑case heading may be capitalized (unless it's a proper noun or technical term): "${word}" in "${text}"`,
            node
          );
        }
      }
    });
  };
}
