'use client';

import { useRef } from 'react';

import type {
  CustomerServiceRecordDocumentSubmissionItem,
  CustomerServiceRecordDocumentSubmitIntent,
  CustomerServiceRecordDocumentSubmitResult,
} from '@/components/customer-service-records/CustomerServiceRecordDocumentForm';
import {
  fetchBillingCustomerServiceRecordDetail,
  markBillingCustomerServiceRecordInvoiced,
  updateBillingCustomerServiceRecordInvoice,
  uploadBillingCustomerServiceRecordFiles,
  type BillingCustomerServiceRecord,
} from '@/features/billing-customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type ConfirmedInvoice = {
  record: BillingCustomerServiceRecord;
  message: string | null;
};

function toResult({
  record,
  message,
}: ConfirmedInvoice): CustomerServiceRecordDocumentSubmitResult {
  return { files: record.invoice.files, referenceNumber: record.invoice.referenceNumber, message };
}

function invoiceMatches(
  record: BillingCustomerServiceRecord,
  referenceNumber: string | null,
  fileIds: string[]
) {
  return (
    record.invoice.referenceNumber === referenceNumber &&
    record.invoice.files.length === fileIds.length &&
    record.invoice.files.every((file, index) => file.fileId === fileIds[index])
  );
}

export function useBillingCustomerServiceRecordInvoiceWorkflow(recordId: string) {
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated('billingCustomerServiceRecords');
  const verificationRequiredRef = useRef(false);
  const confirmedInvoiceRef = useRef<ConfirmedInvoice | null>(null);

  const verifyCurrentRecord = async () => {
    const record = await dispatch(fetchBillingCustomerServiceRecordDetail({ recordId })).unwrap();
    verificationRequiredRef.current = false;
    return record;
  };

  const markAfterInvoiceSaved = async (
    confirmedInvoice: ConfirmedInvoice
  ): Promise<CustomerServiceRecordDocumentSubmitResult> => {
    try {
      const result = await dispatch(
        markBillingCustomerServiceRecordInvoiced({ recordId })
      ).unwrap();
      confirmedInvoiceRef.current = null;
      verificationRequiredRef.current = false;
      return toResult(result);
    } catch {
      verificationRequiredRef.current = true;
      try {
        const current = await verifyCurrentRecord();
        if (current.billingStatus.code === 'INVOICED') {
          confirmedInvoiceRef.current = null;
          return toResult({ record: current, message: t('invoice.invoiced') });
        }
        if (
          !invoiceMatches(
            current,
            confirmedInvoice.record.invoice.referenceNumber,
            confirmedInvoice.record.invoice.files.map((file) => file.fileId)
          )
        ) {
          confirmedInvoiceRef.current = confirmedInvoice;
          return {
            ...toResult({ record: current, message: confirmedInvoice.message }),
            partial: {
              message: t('invoice.invoiceChanged'),
              guidance: t('invoice.invoiceChangedGuidance'),
            },
          };
        }
        confirmedInvoiceRef.current = { record: current, message: confirmedInvoice.message };
        return {
          ...toResult({ record: current, message: confirmedInvoice.message }),
          partial: {
            message: t('invoice.savedButUnmarked'),
            guidance: t('invoice.retryMarkGuidance'),
          },
        };
      } catch {
        return {
          ...toResult(confirmedInvoice),
          partial: {
            message: t('invoice.savedButUnverified'),
            guidance: t('invoice.verifyBeforeRetry'),
          },
        };
      }
    }
  };

  const saveInvoice = async ({
    items,
    referenceNumber,
    intent,
  }: {
    items: CustomerServiceRecordDocumentSubmissionItem[];
    referenceNumber?: string | null;
    intent: CustomerServiceRecordDocumentSubmitIntent;
  }): Promise<CustomerServiceRecordDocumentSubmitResult> => {
    if (verificationRequiredRef.current) {
      const current = await verifyCurrentRecord();
      if (intent === 'save-and-mark' && current.billingStatus.code !== 'SUBMITTED')
        throw new Error(t('invoice.statusChanged'));
    }
    const pendingFiles = items.flatMap((item) => (item.kind === 'pending' ? [item.file] : []));
    const uploaded = pendingFiles.length
      ? await dispatch(uploadBillingCustomerServiceRecordFiles({ files: pendingFiles })).unwrap()
      : [];
    let pendingIndex = 0;
    const fileIds = items.map((item) =>
      item.kind === 'existing' ? item.fileId : uploaded[pendingIndex++].fileId
    );

    let confirmedInvoice: ConfirmedInvoice;
    try {
      confirmedInvoice = await dispatch(
        updateBillingCustomerServiceRecordInvoice({
          recordId,
          referenceNumber: referenceNumber ?? null,
          fileIds,
        })
      ).unwrap();
    } catch (error) {
      const status =
        typeof error === 'object' && error !== null && 'status' in error
          ? (error as { status: number | null }).status
          : null;
      if (status === null || status === 409) {
        verificationRequiredRef.current = true;
        try {
          const current = await verifyCurrentRecord();
          if (invoiceMatches(current, referenceNumber ?? null, fileIds)) {
            confirmedInvoice = { record: current, message: t('invoice.savedAfterVerification') };
          } else {
            throw error;
          }
        } catch {
          /* Keep verification required for the next attempt. */
          verificationRequiredRef.current = true;
          throw error;
        }
      } else {
        throw error;
      }
    }

    confirmedInvoiceRef.current = confirmedInvoice;
    if (intent === 'save') {
      confirmedInvoiceRef.current = null;
      return toResult(confirmedInvoice);
    }
    if (confirmedInvoice.record.billingStatus.code === 'INVOICED') {
      confirmedInvoiceRef.current = null;
      return toResult({ record: confirmedInvoice.record, message: t('invoice.invoiced') });
    }
    return markAfterInvoiceSaved(confirmedInvoice);
  };

  const retryMark = async (): Promise<CustomerServiceRecordDocumentSubmitResult> => {
    if (!confirmedInvoiceRef.current) throw new Error(t('invoice.noPendingMark'));
    const current = await verifyCurrentRecord();
    if (current.billingStatus.code === 'INVOICED') {
      confirmedInvoiceRef.current = null;
      return toResult({ record: current, message: t('invoice.invoiced') });
    }
    if (current.billingStatus.code !== 'SUBMITTED') {
      throw new Error(t('invoice.statusChanged'));
    }
    if (
      !invoiceMatches(
        current,
        confirmedInvoiceRef.current.record.invoice.referenceNumber,
        confirmedInvoiceRef.current.record.invoice.files.map((file) => file.fileId)
      )
    ) {
      throw new Error(t('invoice.invoiceChanged'));
    }
    return markAfterInvoiceSaved({ record: current, message: confirmedInvoiceRef.current.message });
  };

  return { saveInvoice, retryMark };
}
