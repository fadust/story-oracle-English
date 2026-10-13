export const ENGLISH_OUTPUT_RULE = 'Write all explanations, summaries, generated narrative, plans, and character descriptions in English, even when the supplied context uses another language. Preserve proper names exactly, including spelling, accents, apostrophes, and capitalization. Keep JSON keys, enum values, IDs, macros, variable paths, parser markers, and verbatim evidence unchanged. Do not translate user data or invent an English alias for a character.';

export function englishOutputMessages(messages) {
  if (!Array.isArray(messages)) return messages;
  if (messages.some(message => typeof message?.content === 'string' && message.content.includes(ENGLISH_OUTPUT_RULE))) return messages;
  return [{ role: 'system', content: ENGLISH_OUTPUT_RULE }, ...messages];
}
