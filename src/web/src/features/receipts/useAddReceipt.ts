import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Receipt } from '../../api/types';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api`;

export type NewReceipt = {
  merchant: string;
  total: number;
  currency: string;
  purchasedOn: string;
};

async function postReceipt(input: NewReceipt): Promise<Receipt> {
  const response = await fetch(`${BASE_URL}/receipts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error('Failed to save receipt');
  }
  return response.json();
}

export function useAddReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReceipt,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['receipts'] });
      const previous = queryClient.getQueryData<Receipt[]>(['receipts']);
      const optimistic: Receipt = { id: `temp-${Date.now()}`, ...input };
      queryClient.setQueryData<Receipt[]>(['receipts'], (old = []) => [...old, optimistic]);
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['receipts'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
    },
  });
}