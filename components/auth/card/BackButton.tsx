"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  label: string;
  href: string;
}

export const BackButton = ({ label, href }: BackButtonProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(href);
  };
  return (
    <>
      <form
        action={handleClick}
        className="w-full flex items-center justify-center text-md"
      >
        <Button type="submit" variant="link">
          {label}
        </Button>
      </form>
    </>
  );
};
