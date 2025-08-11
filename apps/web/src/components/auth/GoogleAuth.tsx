"use client";

import Script from "next/script";
import { useRef } from "react";
import { createClient } from "@/lib/supabase/supabase";
import type { CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface GoogleAuthProps {
  showOneTap?: boolean;
  showButton?: boolean;
}

export default function GoogleAuth({
  showOneTap = false,
  showButton = true,
}: GoogleAuthProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleGoogleResponse = async (response: CredentialResponse) => {
    try {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });
      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.refresh();
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  const initializeGoogle = () => {
    (async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        console.warn(
          "Google Client ID not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local file"
        );
        return;
      }

      if (showOneTap) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          router.refresh();
          return;
        }
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        use_fedcm_for_prompt: true,
      });

      if (showButton && buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          shape: "rectangular",
          theme: "outline",
          size: "large",
          text: "continue_with",
          logo_alignment: "left",
          width: "300",
          locale: "en",
        });
      }

      if (showOneTap) {
        window.google.accounts.id.prompt();
      }
    })();
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onReady={initializeGoogle}
      />
      {showButton && (
        <div className="w-[300px] h-[41px] rounded-[5px] overflow-hidden mx-auto">
          <div ref={buttonRef} />
        </div>
      )}
    </>
  );
}
