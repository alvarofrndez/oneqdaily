export type ShareFormat = 'square' | 'story' | 'landscape';

export const SHARE_FORMATS: Record<
  ShareFormat,
  {
    width: number;
    height: number;
    maxAnswerChars: number;
  }
> = {
  square: {
    width: 1080,
    height: 1080,
    maxAnswerChars: 280,
  },
  story: {
    width: 1080,
    height: 1920,
    maxAnswerChars: 420,
  },
  landscape: {
    width: 1200,
    height: 675,
    maxAnswerChars: 200,
  },
};

export function truncateForCard(
  text: string,
  maxChars: number,
): string {
  const clean = text.replace(/\s+/g, ' ').trim();

  if (clean.length <= maxChars) {
    return clean;
  }

  const cut = clean.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  const end = lastSpace > 0 ? lastSpace : maxChars;

  return `${cut.slice(0, end).trimEnd()}…`;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oneqdaily.com';

export function getSiteHost(): string {
  return new URL(SITE_URL).host;
}

type CaptionInput = {
  question: string;
  answerExcerpt: string;
  answerUrl: string;

  /**
   * Texto ya traducido por quien llama (client o server),
   * p. ej. t('caption.cta', { site }).
   */
  ctaText: string;
};

export function buildShareCaption({
  question,
  answerExcerpt,
  answerUrl,
  ctaText,
}: CaptionInput): string {
  return [
    `💭 ${question}`,
    '',
    `"${answerExcerpt}"`,
    '',
    `${ctaText} ${answerUrl}`,
  ].join('\n');
}

export function buildWhatsappUrl(caption: string): string {
  return `https://wa.me/?text=${encodeURIComponent(caption)}`;
}

export function buildXUrl(
  caption: string,
  url: string,
): string {
  const params = new URLSearchParams({
    text: caption,
    url,
  });

  return `https://x.com/intent/tweet?${params.toString()}`;
}

export function getAnswerCardImageUrl(
  answerId: string,
  format: ShareFormat,
  locale: string,
): string {
  return `/api/og/answer/${answerId}?format=${format}&locale=${encodeURIComponent(locale)}`;
}

export function getAnswerShareUrl(answerId: string): string {
  return `${SITE_URL}/answers/${answerId}`;
}