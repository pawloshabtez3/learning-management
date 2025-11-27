/**
 * Template-based summary generation fallback
 * Used when GPT4All is unavailable
 */

export function generateTemplateSummary(content: string): string {
  if (!content || content.trim().length === 0) {
    return 'No content available to summarize.';
  }

  // Split content into sentences
  const sentences = content
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sentences.length === 0) {
    return `Summary: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''}`;
  }

  // Extract key points (first 5 meaningful sentences)
  const keyPoints = sentences.slice(0, 5);

  // Build summary
  const summary = [
    '## Key Points',
    '',
    ...keyPoints.map((point) => `• ${point}`),
    '',
    `_This summary was generated using template-based extraction from ${sentences.length} sentences._`,
  ].join('\n');

  return summary;
}

/**
 * Extract key terms from content for summary enhancement
 */
export function extractKeyTerms(content: string): string[] {
  // Common words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
    'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'if', 'or',
    'because', 'until', 'while', 'this', 'that', 'these', 'those', 'it',
  ]);

  // Extract words and filter
  const words = content
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach((word) => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Sort by frequency and return top terms
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}
