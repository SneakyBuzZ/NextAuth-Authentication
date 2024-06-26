"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/schemas";
import { useRegisterQuery } from "@/lib/query/mutations";
import { useState } from "react";
import { FormError } from "@/components/auth/form/FormError";
import { FormSuccess } from "@/components/auth/form/FormSuccess";

const RegisterForm = () => {
  const { mutateAsync: registerAction, isPending, error } = useRegisterQuery();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const response = await registerAction(values);
    if (response.status === 400) {
      setErrorMessage(response.message);
    } else if (response.status === 200) {
      setSuccessMessage(response?.message);
    }
  }
  return (
    <>
      {" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
              </FormItem>
            )}
          />
          <FormError label={errorMessage} />
          <FormSuccess label={successMessage} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-neutral-700 translate-y-1"
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
