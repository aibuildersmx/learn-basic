"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/supabase";

export function useUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const client = createClient();
      const {
        data: { user },
      } = await client.auth.getUser();
      return user;
    },
    staleTime: 5 * 60 * 1000,
  });
}
