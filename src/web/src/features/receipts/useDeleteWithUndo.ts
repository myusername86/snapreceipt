import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Receipt } from '../../api/types';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api`;
const UNDO_MS = 5000;

async function serverDelete(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/receipts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete receipt');
}

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
    void serverDelete(receipt.id)
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