import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/seo/config';
import { SITE_MODE } from '@/config/site';
import { getAllQuestions, getPublicAnswerIds } from '@/src/features/questions/queries';

const STATIC_ROUTES: {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
}[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/questions', changeFrequency: 'daily', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/how-it-works', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
];

function withAlternates(path: string) {
  return Object.fromEntries(
    routing.locales.map((loc) => [loc, `${SITE_URL}/${loc}${path}`])
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (SITE_MODE !== 'live') {
    return [];
  }

  const lastModified = new Date();

  const staticEntries = STATIC_ROUTES.flatMap(({ path, changeFrequency, priority }) => {
    const suffix = path === '/' ? '' : path;

    return routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${suffix}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: withAlternates(suffix) },
    }));
  });

  const [questions, publicAnswers] = await Promise.all([
    getAllQuestions(),
    getPublicAnswerIds(),
  ]);

  const questionEntries = questions.flatMap((question) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/questions/${question.id}`,
      lastModified: new Date(question.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
      alternates: { languages: withAlternates(`/questions/${question.id}`) },
    }))
  );

  // TODO: paginate and revalidate for optimization
  const answerEntries = publicAnswers.flatMap(({ id, created_at }) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/answers/${id}`,
      lastModified: new Date(created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
      alternates: { languages: withAlternates(`/answers/${id}`) },
    }))
  );

  return [...staticEntries, ...questionEntries, ...answerEntries];
}