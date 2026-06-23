import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCarModels,
  getDealer,
  getDealerReviews,
  getDealers,
  postDealerReview,
  type PostReviewPayload,
} from "@/services/dealers.service";

export function useDealers() {
  return useQuery({
    queryKey: ["dealers"],
    queryFn: getDealers,
  });
}

export function useDealer(id?: string) {
  return useQuery({
    queryKey: ["dealer", id],
    queryFn: () => getDealer(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useDealerReviews(id?: string) {
  return useQuery({
    queryKey: ["dealer-reviews", id],
    queryFn: () => getDealerReviews(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useCarModels() {
  return useQuery({
    queryKey: ["car-models"],
    queryFn: getCarModels,
  });
}

export function usePostReviewMutation(dealerId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PostReviewPayload) => postDealerReview(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dealer-reviews", dealerId],
      });
    },
  });
}
