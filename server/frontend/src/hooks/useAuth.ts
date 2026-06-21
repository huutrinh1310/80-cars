import { useMutation } from "@tanstack/react-query";

import {
  login,
  logout,
  register,
  type LoginPayload,
  type RegisterPayload,
} from "@/services/auth.service";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logout,
  });
}