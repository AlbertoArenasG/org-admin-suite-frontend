'use client';

import { useEffect, useRef, useState } from 'react';

import type { MutationFeedback, MutationRecovery } from '@/components/feedback';
import type { ResourceFormMode } from '@/components/resource-form';
import type { CustomerServiceRecordAttachment } from '@/features/customer-service-records';

const SUCCESS_FEEDBACK_DURATION_MS = 800;

export type CustomerServiceRecordDocumentDraftItem =
  | { attachment: CustomerServiceRecordAttachment; id: string; kind: 'existing' }
  | { file: File; id: string; kind: 'pending' };

export function createExistingAttachmentItems(files: CustomerServiceRecordAttachment[]) {
  return files.map((attachment, index) => ({
    attachment,
    id: `existing-${attachment.fileId}-${index}`,
    kind: 'existing' as const,
  }));
}

export function createPendingAttachmentItems(files: File[]) {
  return files.map((file) => ({
    file,
    id: `pending-${crypto.randomUUID()}`,
    kind: 'pending' as const,
  }));
}

export function useCustomerServiceRecordDocumentDraft({
  canUpdate,
  files,
  initialReferenceNumber,
}: {
  canUpdate: boolean;
  files: CustomerServiceRecordAttachment[];
  initialReferenceNumber: string | null;
}) {
  const [mode, setMode] = useState<ResourceFormMode>('read');
  const [animateReadTransition, setAnimateReadTransition] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState(initialReferenceNumber ?? '');
  const [attachmentItems, setAttachmentItems] = useState<CustomerServiceRecordDocumentDraftItem[]>(
    () => createExistingAttachmentItems(files)
  );
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [mutationFeedback, setMutationFeedback] = useState<MutationFeedback>();
  const [mutationRecovery, setMutationRecovery] = useState<MutationRecovery>();
  const [partialSaved, setPartialSaved] = useState(false);
  const successTimeoutRef = useRef<number | null>(null);
  const isReadOnly = mode === 'read';

  useEffect(() => {
    if (!isReadOnly) return;
    setAttachmentItems(createExistingAttachmentItems(files));
    setReferenceNumber(initialReferenceNumber ?? '');
  }, [files, initialReferenceNumber, isReadOnly]);

  useEffect(() => {
    if (!canUpdate) setMode('read');
  }, [canUpdate]);

  useEffect(
    () => () => {
      if (successTimeoutRef.current !== null) window.clearTimeout(successTimeoutRef.current);
    },
    []
  );

  const resetDraft = () => {
    if (successTimeoutRef.current !== null) window.clearTimeout(successTimeoutRef.current);
    setAttachmentItems(createExistingAttachmentItems(files));
    setReferenceNumber(initialReferenceNumber ?? '');
    setMutationFeedback(undefined);
    setMutationRecovery(undefined);
    setPartialSaved(false);
    setAnimateReadTransition(true);
    setMode('read');
  };

  const beginEdit = () => {
    setAnimateReadTransition(false);
    setMode('edit');
  };

  const applyPersisted = (value: {
    files: CustomerServiceRecordAttachment[];
    referenceNumber?: string | null;
  }) => {
    setAttachmentItems(createExistingAttachmentItems(value.files));
    setReferenceNumber(value.referenceNumber ?? '');
  };

  const finishSuccess = (title: string) => {
    setPartialSaved(false);
    setMutationRecovery(undefined);
    setMutationFeedback({ status: 'success', title });
    successTimeoutRef.current = window.setTimeout(() => {
      setAnimateReadTransition(true);
      setMode('read');
      setMutationFeedback(undefined);
      successTimeoutRef.current = null;
    }, SUCCESS_FEEDBACK_DURATION_MS);
  };

  return {
    mode,
    isReadOnly,
    animateReadTransition,
    referenceNumber,
    setReferenceNumber,
    attachmentItems,
    setAttachmentItems,
    attachmentDialogOpen,
    setAttachmentDialogOpen,
    mutationFeedback,
    setMutationFeedback,
    mutationRecovery,
    setMutationRecovery,
    partialSaved,
    setPartialSaved,
    resetDraft,
    beginEdit,
    applyPersisted,
    finishSuccess,
  };
}
