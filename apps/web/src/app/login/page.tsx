"use client";

import LogIn from "@/components/auth/LogIn";
import User from "@/components/auth/User";
import { useUser } from "@/hooks/use-user";

export default function LoginPage() {
  const { data: user } = useUser();

  if (user) {
    return <User />;
  }

  return (
    <div className="flex items-center justify-center">
      <LogIn />
    </div>
  );
}
