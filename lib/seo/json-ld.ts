// lib/seo/json-ld.ts
import { SITE_URL, SITE_NAME } from './config';

const X_URL = process.env.NEXT_PUBLIC_X_URL ?? 'https://x.com/oneqdaily';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-light.svg`,
    sameAs: [X_URL],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function webPageJsonLd(input: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    ...input,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type QAPageInput = {
  url: string;
  questionText: string;
  datePublished: string;
  answers: { text: string; datePublished: string; authorName?: string }[];
};

export function qaPageJsonLd({ url, questionText, datePublished, answers }: QAPageInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: questionText,
      text: questionText,
      url,
      datePublished,
      answerCount: answers.length,
      ...(answers.length > 0 && {
        suggestedAnswer: answers.map((answer) => ({
          '@type': 'Answer',
          text: answer.text,
          datePublished: answer.datePublished,
          ...(answer.authorName && {
            author: { '@type': 'Person', name: answer.authorName },
          }),
        })),
      }),
    },
  };
}

type DiscussionPostingInput = {
  url: string;
  headline: string;
  text: string;
  datePublished: string;
  authorName?: string;
};

export function discussionForumPostingJsonLd({
  url,
  headline,
  text,
  datePublished,
  authorName,
}: DiscussionPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    '@id': url,
    url,
    headline,
    text,
    datePublished,
    author: authorName
      ? { '@type': 'Person', name: authorName }
      : { '@type': 'Organization', name: SITE_NAME },
  };
}

type FaqItem = { question: string; answer: string };

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}