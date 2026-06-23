import { requestJson } from "@/services/api";

export interface DealerRecord {
  id: number;
  full_name: string;
  city: string;
  address: string;
  zip: string;
  state: string;
}

export interface DealerReview {
  sentiment: "positive" | "negative" | "neutral";
  review: string;
  name: string;
  car_make?: string;
  car_model?: string;
  car_year?: string;
}

export interface CarModelRecord {
  CarMake: string;
  CarModel: string;
}

export interface PostReviewPayload {
  name: string;
  dealership: string;
  review: string;
  purchase: boolean;
  purchase_date: string;
  car_make: string;
  car_model: string;
  car_year: string;
}

interface DealersResponse {
  status: number;
  dealers: DealerRecord[];
}

interface DealerResponse {
  status: number;
  dealer: DealerRecord[];
}

interface ReviewsResponse {
  status: number;
  reviews: DealerReview[];
}

interface CarModelsResponse {
  CarModels: CarModelRecord[];
}

interface MutationResponse {
  status?: number;
  error?: string;
}

export async function getDealers() {
  const data = await requestJson<DealersResponse>("/djangoapp/get_dealers", {
    method: "GET",
  });

  if (data.status !== 200) {
    throw new Error("Failed to fetch dealers.");
  }

  return Array.from(data.dealers ?? []);
}

export async function getDealer(id: string) {
  const data = await requestJson<DealerResponse>(`/djangoapp/dealer/${id}`, {
    method: "GET",
  });

  if (data.status !== 200 || !data.dealer?.length) {
    throw new Error("Dealer not found.");
  }

  return data.dealer[0];
}

export async function getDealerReviews(id: string) {
  const data = await requestJson<ReviewsResponse>(
    `/djangoapp/reviews/dealer/${id}`,
    {
      method: "GET",
    },
  );

  if (data.status !== 200) {
    throw new Error("Failed to fetch reviews.");
  }

  return Array.from(data.reviews ?? []);
}

export async function getCarModels() {
  const data = await requestJson<CarModelsResponse>("/djangoapp/get_cars", {
    method: "GET",
  });

  return Array.from(data.CarModels ?? []);
}

export async function postDealerReview(payload: PostReviewPayload) {
  const data = await requestJson<MutationResponse>("/djangoapp/add_review", {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (data.status !== 200) {
    throw new Error(data.error ?? "Failed to post review.");
  }

  return data;
}
