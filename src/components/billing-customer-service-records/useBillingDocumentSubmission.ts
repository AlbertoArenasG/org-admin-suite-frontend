'use client';

import type {
  CustomerServiceRecordDocumentSubmissionItem,
  CustomerServiceRecordDocumentSubmitResult,
} from '@/components/customer-service-records/CustomerServiceRecordDocumentForm';
import {
  createBillingPaymentComplement,
  updateBillingPaymentComplement,
  updateBillingPurchaseOrder,
  uploadBillingCustomerServiceRecordFiles,
} from '@/features/billing-customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';

type Submission = {
  items: CustomerServiceRecordDocumentSubmissionItem[];
  referenceNumber?: string | null;
};

export function useBillingDocumentSubmission(recordId: string) {
  const dispatch = useAppDispatch();

  const collectFileIds = async (items: CustomerServiceRecordDocumentSubmissionItem[]) => {
    const pending = items.flatMap((item) => (item.kind === 'pending' ? [item.file] : []));
    const uploaded = pending.length
      ? await dispatch(uploadBillingCustomerServiceRecordFiles({ files: pending })).unwrap()
      : [];
    let uploadedIndex = 0;
    return items.map((item) =>
      item.kind === 'existing' ? item.fileId : uploaded[uploadedIndex++].fileId
    );
  };

  const savePurchaseOrder = async ({
    items,
    referenceNumber,
  }: Submission): Promise<CustomerServiceRecordDocumentSubmitResult> => {
    const fileIds = await collectFileIds(items);
    const result = await dispatch(
      updateBillingPurchaseOrder({ recordId, referenceNumber: referenceNumber ?? null, fileIds })
    ).unwrap();
    return {
      files: result.record.purchaseOrder.files,
      referenceNumber: result.record.purchaseOrder.referenceNumber,
      message: result.message,
    };
  };

  const saveComplement = async (
    complementId: string | null,
    { items, referenceNumber }: Submission
  ): Promise<CustomerServiceRecordDocumentSubmitResult> => {
    const fileIds = await collectFileIds(items);
    const result = complementId
      ? await dispatch(
          updateBillingPaymentComplement({
            recordId,
            complementId,
            referenceNumber: referenceNumber ?? null,
            fileIds,
          })
        ).unwrap()
      : await dispatch(
          createBillingPaymentComplement({
            recordId,
            referenceNumber: referenceNumber ?? null,
            fileIds,
          })
        ).unwrap();
    const complement = complementId
      ? result.record.invoice.paymentComplements.find((item) => item.complementId === complementId)
      : result.record.invoice.paymentComplements.at(-1);
    if (!complement) throw new Error('No se pudo confirmar el complemento guardado');
    return {
      files: complement.files,
      referenceNumber: complement.referenceNumber,
      message: result.message,
    };
  };

  return { savePurchaseOrder, saveComplement };
}
