import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Receipt } from '../../api/types';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api`;

async function deleteReceipt(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/receipts/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete receipt');
  }
}

export function useDeleteReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReceipt,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['receipts'] });
      const previous = queryClient.getQueryData<Receipt[]>(['receipts']);
      queryClient.setQueryData<Receipt[]>(['receipts'], (old = []) =>
        old.filter((r) => r.id !== id),
      );
      return { previous };
    },
    onError: (_e, _id, context) => {
      if (context?.previous) queryClient.setQueryData(['receipts'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
    },
  });
}