"use client";

import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import GoogleAuth from "../auth/GoogleAuth";

const PurchaseButton = () => {
  const { data: user, isLoading } = useUser();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoading || !user) {
      return;
    }
    const checkoutUrl = `https://buy.polar.sh/${process.env.NEXT_PUBLIC_POLAR_CHECKOUT_ID}?customer_email=${user.email}`;
    window.location.href = checkoutUrl;
  };

  if (!user) {
    return <GoogleAuth showOneTap={false} />;
  }

  return (
    <Button
      onClick={handleClick}
      className="w-fit"
      variant="outline"
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Purchase"}
    </Button>
  );
};

export default PurchaseButton;
