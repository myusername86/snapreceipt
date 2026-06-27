import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Receipt } from '../../api/types';
import { receiptsApi } from '../../api/client';

const UNDO_MS = 5000;

export function useDeleteWithUndo() {
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<Receipt | null>(null);
  const timerRef = useRef<number | null>(null);

  function removeFromCache(id: string) {
    queryClient.setQueryData<Receipt[]>(['receipts'], (old = []) =>
      old.filter((r) => r.id !== id),
    );
  }

  function restoreToCache(receipt: Receipt) {
    queryClient.setQueryData<Receipt[]>(['receipts'], (old = []) =>
      old.some((r) => r.id === receipt.id) ? old : [...old, receipt],
    );
  }

  function commit(receipt: Receipt) {
    void receiptsApi
      .remove(receipt.id)
      .then(() => queryClient.invalidateQueries({ queryKey: ['receipts'] }))
      .catch(() => restoreToCache(receipt));
  }

  function requestDelete(receipt: Receipt) {
    // If a previous delete is still counting down, commit it now.
    if (pending && timerRef.current) {
      window.clearTimeout(timerRef.current);
      commit(pending);
    }

    removeFromCache(receipt.id); // optimistic hide
    setPending(receipt);         // show the toast

    timerRef.current = window.setTimeout(() => {
      commit(receipt);
      setPending(null);
      timerRef.current = null;
    }, UNDO_MS);
  }

  function undo() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pending) {
      restoreToCache(pending);
      setPending(null);
    }
  }

  return { pending, requestDelete, undo };
}