'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Share2, Download, X as XIcon, Link2, Check, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { getQuestionById } from '@/src/features/questions/queries';
import {
  getAnswerCardImageUrl,
  getSiteHost,
  SHARE_FORMATS,
  buildShareCaption,
  buildWhatsappUrl,
  buildXUrl,
  getAnswerShareUrl,
  truncateForCard,
  type ShareFormat,
} from '@/lib/share-card';

import styles from './ShareAnswerCard.module.scss';

type Props = {
  answerId: string;
  questionId: string;
  answerText: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

const FORMAT_ORDER: ShareFormat[] = ['square', 'story', 'landscape'];

export default function ShareAnswerCard({
  answerId,
  questionId,
  answerText,
  onClick,
  onKeyDown,
}: Props) {
  const t = useTranslations('Questions.ShareCard');
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ShareFormat>('square');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const [questionText, setQuestionText] = useState<string | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const answerUrl = getAnswerShareUrl(answerId);
  const imageUrl = getAnswerCardImageUrl(answerId, format, locale);

  const caption = questionText
    ? buildShareCaption({
        question: questionText,
        answerExcerpt: truncateForCard(answerText, 180),
        answerUrl,
        ctaText: t('caption.cta', { site: getSiteHost() }),
      })
    : null;

  const captionReady = !!caption && !questionLoading && !questionError;

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function'
    );
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDialog();
    };

    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  async function loadQuestion() {
    if (questionText || questionLoading) return;

    setQuestionLoading(true);
    setQuestionError(false);

    try {
      const question = await getQuestionById(questionId);

      if (!question) {
        setQuestionError(true);
        return;
      }

      setQuestionText(question.text);
    } catch (err) {
      console.error('Error fetching question for share card:', err);
      setQuestionError(true);
    } finally {
      setQuestionLoading(false);
    }
  }

  function handleTriggerClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onClick?.(event);

    setOpen(true);
    setImageLoaded(false);
    void loadQuestion();
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onKeyDown?.(event);
  }

  function closeDialog() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleRetryQuestion() {
    setQuestionError(false);
    void loadQuestion();
  }

  async function handleNativeShare() {
    if (!caption) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'oneqdaily.png', { type: blob.type });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: caption,
          url: answerUrl,
        });
        return;
      }

      await navigator.share({ text: caption, url: answerUrl });
    } catch {
      // El usuario canceló el share sheet, no hacemos nada.
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(answerUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard no disponible.
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        aria-label={t('trigger')}
        aria-busy={open && questionLoading}
      >
        {open && questionLoading ? (
          <Loader2 size={14} strokeWidth={1.8} className={styles.spin} aria-hidden="true" />
        ) : (
          <Share2 size={14} strokeWidth={1.8} aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          className={styles.overlay}
          role="presentation"
          onClick={(event) => {
            event.stopPropagation();
            closeDialog();
          }}
        >
          <div
            ref={dialogRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-busy={questionLoading}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <header className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                {t('title')}
              </h2>

              <button
                type="button"
                className={styles.close}
                onClick={closeDialog}
                aria-label={t('close')}
              >
                <XIcon size={16} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </header>

            <div className={styles.formatSwitch} role="tablist" aria-label={t('formatLabel')}>
              {FORMAT_ORDER.map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={format === key}
                  className={`${styles.formatOption} ${format === key ? styles.active : ''}`}
                  onClick={() => {
                    setFormat(key);
                    setImageLoaded(false);
                  }}
                >
                  {t(`formats.${key}`)}
                </button>
              ))}
            </div>

            <div
              className={styles.previewWrapper}
              style={{
                aspectRatio: `${SHARE_FORMATS[format].width} / ${SHARE_FORMATS[format].height}`,
              }}
            >
              {!imageLoaded && (
                <div className={styles.skeleton}>
                  <Loader2 size={22} strokeWidth={1.8} className={styles.spin} aria-hidden="true" />
                </div>
              )}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={t('previewAlt')}
                className={styles.previewImage}
                style={{ opacity: imageLoaded ? 1 : 0 }}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {questionError && !questionLoading && (
              <div className={styles.statusBarError} role="alert">
                <span>{t('captionError')}</span>
                <button type="button" className={styles.retryButton} onClick={handleRetryQuestion}>
                  {t('retry')}
                </button>
              </div>
            )}

            <div className={styles.actions}>
              {canNativeShare && (
                <button
                  type="button"
                  className={styles.primaryAction}
                  onClick={handleNativeShare}
                  disabled={!captionReady}
                >
                  <span>{t('shareNative')}</span>
                </button>
              )}

              
              <a  href={imageUrl}
                download={`oneqdaily-${answerId}.png`}
                className={styles.secondaryAction}
              >
                <span>{t('download')}</span>
              </a>
            </div>

            <div className={styles.socialRow}>
              
              <a  href={captionReady ? buildWhatsappUrl(caption) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialButton} ${!captionReady ? styles.disabled : ''}`}
                aria-disabled={!captionReady}
                onClick={(event) => {
                  if (!captionReady) event.preventDefault();
                }}
              >
                {t('whatsapp')}
              </a>

              
              <a  href={captionReady ? buildXUrl(caption, answerUrl) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialButton} ${!captionReady ? styles.disabled : ''}`}
                aria-disabled={!captionReady}
                onClick={(event) => {
                  if (!captionReady) event.preventDefault();
                }}
              >
                {t('x')}
              </a>

              <button type="button" className={styles.socialButton} onClick={handleCopyLink}>
                {copied ? (
                  <>
                    {t('copied')}
                  </>
                ) : (
                  <>
                    {t('copyLink')}
                  </>
                )}
              </button>
            </div>

            <p className={styles.instagramHint}>{t('instagramHint')}</p>
          </div>
        </div>
      )}
    </>
  );
}