'use client';

import { useEffect, useState } from 'react';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  createBillingRecordComment,
  fetchBillingRecordComments,
  type BillingCustomerServiceRecord,
  type BillingComment,
} from '@/features/billing-customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type Props = { canUpdate: boolean; record: BillingCustomerServiceRecord };

export function BillingCustomerServiceRecordCommentsSection({ canUpdate, record }: Props) {
  const { t, i18n } = useTranslationHydrated('billingCustomerServiceRecords');
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.billingCustomerServiceRecords.comments);
  const recordId = record.customerServiceRecordId;
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState<BillingComment['visibility']>('INTERNAL');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    void dispatch(fetchBillingRecordComments({ recordId }));
  }, [dispatch, recordId]);

  const submit = async () => {
    if (!text.trim()) return;
    setPending(true);
    setError(null);
    try {
      await dispatch(
        createBillingRecordComment({ recordId, text: text.trim(), visibility })
      ).unwrap();
      setText('');
      void dispatch(fetchBillingRecordComments({ recordId, page: 1 }));
    } catch (reason) {
      setError(
        typeof reason === 'object' && reason !== null && 'message' in reason
          ? String(reason.message)
          : t('comments.error')
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <section id="billing-comments" tabIndex={-1} className="scroll-mt-24 md:scroll-mt-5">
      <ResourceFormFrame
        title={t('comments.title')}
        mode="read"
        headerDensity="compact"
        surface={{ base: 'bare', md: 'card' }}
        contentSurface={{ base: 'bare', md: 'inset' }}
        density={{ base: 'compact', md: 'comfortable' }}
        dividers="hidden"
      >
        <ResourceFormSection surface="bare">
          {canUpdate ? (
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void submit();
              }}
            >
              <div className="space-y-1">
                <label htmlFor="billing-comment-text" className="text-sm font-medium">
                  {t('comments.text')}
                </label>
                <Textarea
                  id="billing-comment-text"
                  value={text}
                  maxLength={5000}
                  disabled={pending}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1">
                  <label htmlFor="billing-comment-visibility" className="text-sm font-medium">
                    {t('comments.visibility')}
                  </label>
                  <select
                    id="billing-comment-visibility"
                    className="block h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                    value={visibility}
                    onChange={(event) =>
                      setVisibility(event.target.value as BillingComment['visibility'])
                    }
                    disabled={pending}
                  >
                    <option value="INTERNAL">{t('comments.internal')}</option>
                    <option value="EXTERNAL">{t('comments.external')}</option>
                  </select>
                </div>
                <Button type="submit" size="sm" loading={pending} disabled={!text.trim()}>
                  {t('comments.add')}
                </Button>
              </div>
              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </form>
          ) : null}
          <div className="mt-4 space-y-3">
            {comments.recordId === recordId && comments.status === 'loading' ? (
              <p className="text-sm text-muted-foreground">{t('comments.loading')}</p>
            ) : null}
            {comments.recordId === recordId && comments.status === 'failed' ? (
              <div role="alert" className="space-y-2 text-sm text-destructive">
                <p>{comments.error ?? t('comments.error')}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    void dispatch(fetchBillingRecordComments({ recordId, page: comments.page }))
                  }
                >
                  {t('actions.retry')}
                </Button>
              </div>
            ) : null}
            {comments.recordId === recordId &&
            comments.status === 'succeeded' &&
            comments.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('comments.empty')}</p>
            ) : null}
            {comments.recordId === recordId &&
              comments.items.map((item) => (
                <article key={item.commentId} className="rounded-lg border border-border p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>
                      {item.visibility === 'INTERNAL'
                        ? t('comments.internal')
                        : t('comments.external')}
                    </span>
                    <time dateTime={item.createdAt}>
                      {new Intl.DateTimeFormat(i18n.language, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }).format(new Date(item.createdAt))}
                    </time>
                  </div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    {t('comments.author')}: {item.createdBy}
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm">{item.text}</p>
                </article>
              ))}
            {comments.recordId === recordId && comments.totalPages > 1 ? (
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={comments.page <= 1 || comments.status === 'loading'}
                  onClick={() =>
                    void dispatch(fetchBillingRecordComments({ recordId, page: comments.page - 1 }))
                  }
                >
                  {t('comments.previous')}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {comments.page} / {comments.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={comments.page >= comments.totalPages || comments.status === 'loading'}
                  onClick={() =>
                    void dispatch(fetchBillingRecordComments({ recordId, page: comments.page + 1 }))
                  }
                >
                  {t('comments.next')}
                </Button>
              </div>
            ) : null}
          </div>
        </ResourceFormSection>
      </ResourceFormFrame>
    </section>
  );
}
