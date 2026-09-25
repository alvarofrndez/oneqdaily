import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAnswerById } from '@/src/features/questions/queries';
import { formatDateKey } from '@/lib/time';
import { LOGO_ACCENT_COLOR } from '@/lib/logo';
import { SHARE_FORMATS, truncateForCard, type ShareFormat } from '@/lib/share-card';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);

  if (!match) throw new Error(`Not found the font ${family}`);

  const fontResponse = await fetch(match[1]);
  return fontResponse.arrayBuffer();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const formatParam = searchParams.get('format') as ShareFormat | null;
    const format: ShareFormat = formatParam && formatParam in SHARE_FORMATS ? formatParam : 'square';
    const { width, height, maxAnswerChars } = SHARE_FORMATS[format];

    const requestedLocale = searchParams.get('locale');
    const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

    const t = await getTranslations({ locale, namespace: 'Questions.ShareCard.og' });

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const result = await getAnswerById(id);

    if (!result) {
        return new Response('Answer not found', { status: 404 });
    }

    const { answer, question } = result;

    if (answer.visibility !== 'public' && answer.user_id !== user?.id) {
        return new Response('Forbidden', { status: 403 });
    }

    const answerExcerpt = truncateForCard(answer.answer_text, maxAnswerChars);

    const authorName = answer.profiles?.username ?? t('anonymousAuthor');
    const questionDate = formatDateKey(question.display_date, locale); // antes 'es' fijo
    const answerDate = formatDateKey(answer.created_at.slice(0, 10), locale); // antes 'es' fijo
    const siteLabel = t('siteLabel');
    const tagline = t('tagline');

    const fontText = `${question.text}${answerExcerpt}${authorName}${questionDate}${answerDate}${siteLabel}${tagline}`;

    const [sansRegular, sansMedium, mono] = await Promise.all([
        loadGoogleFont('DM+Sans', 400, fontText),
        loadGoogleFont('DM+Sans', 600, fontText),
        loadGoogleFont('DM+Mono', 500, fontText),
    ]);

    const isStory = format === 'story';

    return new ImageResponse(
        (
        <div
            style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: isStory ? '96px 72px' : '72px',
            backgroundColor: '#ffffff',
            fontFamily: 'DM Sans',
            }}
        >
            {/* Header: fecha de la pregunta */}
            <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: 'DM Mono',
                fontSize: 28,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#8c8c8c',
            }}
            >
            <div
                style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: LOGO_ACCENT_COLOR,
                display: 'flex',
                }}
            />
            {questionDate}
            </div>

            {/* Pregunta */}
            <div
            style={{
                display: 'flex',
                fontFamily: 'DM Sans',
                fontWeight: 600,
                fontSize: isStory ? 56 : 48,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: '#171717',
            }}
            >
            {question.text}
            </div>

            {/* Respuesta */}
            <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                paddingLeft: 32,
                borderLeft: `4px solid ${LOGO_ACCENT_COLOR}`,
            }}
            >
            <div
                style={{
                display: 'flex',
                fontFamily: 'DM Sans',
                fontWeight: 400,
                fontSize: isStory ? 40 : 34,
                lineHeight: 1.45,
                color: '#3a3a3a',
                }}
            >
                “{answerExcerpt}”
            </div>

            <div
                style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'DM Mono',
                fontSize: 26,
                color: '#8c8c8c',
                }}
            >
                <span>@{authorName}</span>
                <span>{answerDate}</span>
            </div>
            </div>

            {/* Footer / branding */}
            <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 32,
                borderTop: '2px solid #e5e5e5',
                fontFamily: 'DM Mono',
                fontSize: 24,
                color: '#171717',
            }}
            >
                <span>{siteLabel}</span>
                <span style={{ color: LOGO_ACCENT_COLOR }}>{tagline}</span>
            </div>
        </div>
        ),
        {
            width,
            height,
            fonts: [
                { name: 'DM Sans', data: sansRegular, weight: 400, style: 'normal' },
                { name: 'DM Sans', data: sansMedium, weight: 600, style: 'normal' },
                { name: 'DM Mono', data: mono, weight: 500, style: 'normal' },
            ],
            headers: {
                'Cache-Control': answer.visibility === 'public'
                ? 'public, max-age=3600'
                : 'private, no-store',
            },
        }
    );
}