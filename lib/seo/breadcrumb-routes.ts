export type CrumbKey =
  | 'home'
  | 'questions'
  | 'question'
  | 'answered'
  | 'answer'
  | 'profile'
  | 'about'
  | 'howItWorks'
  | 'faq'
  | 'privacy'
  | 'terms';

export type Crumb = { key: CrumbKey; href?: string };

const HOME: Crumb = { key: 'home', href: '/' };
const QUESTIONS: Crumb = { key: 'questions', href: '/questions' };

export const BREADCRUMB_ROUTES: { pattern: RegExp; trail: Crumb[] }[] = [
  { pattern: /^\/questions$/, trail: [HOME, { key: 'questions' }] },
  { pattern: /^\/questions\/answered$/, trail: [HOME, QUESTIONS, { key: 'answered' }] },
  { pattern: /^\/questions\/[^/]+$/, trail: [HOME, QUESTIONS, { key: 'question' }] },
  { pattern: /^\/answers\/[^/]+$/, trail: [HOME, { key: 'answer' }] },
  { pattern: /^\/profile$/, trail: [HOME, { key: 'profile' }] },
  { pattern: /^\/about$/, trail: [HOME, { key: 'about' }] },
  { pattern: /^\/how-it-works$/, trail: [HOME, { key: 'howItWorks' }] },
  { pattern: /^\/faq$/, trail: [HOME, { key: 'faq' }] },
  { pattern: /^\/privacy$/, trail: [HOME, { key: 'privacy' }] },
  { pattern: /^\/terms$/, trail: [HOME, { key: 'terms' }] },
];

export function getBreadcrumbTrail(path: string): Crumb[] | undefined {
  return BREADCRUMB_ROUTES.find(({ pattern }) => pattern.test(path))?.trail;
}