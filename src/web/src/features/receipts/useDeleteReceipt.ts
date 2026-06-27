import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Receipt } from '../../api/types';
import { receiptsApi } from '../../api/client';

export function useDeleteReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => receiptsApi.remove(id),
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