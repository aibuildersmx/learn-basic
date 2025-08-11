"use client";

import { Card } from "@/components/ui/card";
import GoogleAuth from "@/components/auth/GoogleAuth";

export default function LogIn() {
  return (
    <Card className="w-full max-w-md p-8 space-y-6 border-2 border-foreground bg-background text-foreground">
      <p className="text-2xl font-bold text-center">Log In</p>
      <GoogleAuth showOneTap={false} />
    </Card>
  );
}
