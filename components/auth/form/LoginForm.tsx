"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CardWrapper } from "@/components/auth/card/CardWrapper";
import { loginSchema } from "@/lib/schemas";
import { FormError } from "@/components/auth/form/FormError";
import { FormSuccess } from "@/components/auth/form/FormSuccess";
import { useLoginQuery } from "@/lib/query/mutations";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const params = useSearchParams();
  const urlError =
    params.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with another provider"
      : "";

  const { mutateAsync: loginAction, isPending } = useLoginQuery();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const response = await loginAction(values);
    if (response) {
      if (response?.status === 400) {
        setErrorMessage(response.message);
      } else if (response.status === 200) {
        setSuccessMessage(response?.message);
      }
    }
  }

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input disabled={isPending} type="password" {...field} />
                </FormControl>
                <Button
                  asChild
                  variant={"link"}
                  className="-translate-x-3 "
                  size={"sm"}
                >
                  <Link href="/reset">Forgot Password?</Link>
                </Button>
              </FormItem>
            )}
          />
          <FormError label={errorMessage || urlError} />
          <FormSuccess label={successMessage} />

          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-neutral-700"
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
