"use client";

import { createClient } from "@/lib/supabase/supabase";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";

export default function User() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  async function signOut() {
    await createClient().auth.signOut();
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  }

  if (user) {
    return (
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md p-8 space-y-6 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-background">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20 border-2">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-xl font-bold">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="text-center space-y-2">
                <p className="font-semibold text-foreground">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="text-sm">
                <span className="font-semibold text-foreground">User ID:</span>
                <p className="text-xs text-gray-600 break-all">{user.id}</p>
              </div>
            </div>

            <form className="pt-4">
              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-none border-2 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                onClick={() => {
                  signOut();
                  queryClient.invalidateQueries({ queryKey: ["currentUser"] });
                }}
              >
                Sign Out
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }
}
