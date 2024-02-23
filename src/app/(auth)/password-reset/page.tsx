'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { UserProfile } from '@/interfaces/dashboard';
import { storeValues } from '@/scripts/check-user-auth';
import { useSearchParams } from "next/navigation";


const resetFormSchema = z.object({
    code: z.string(),
    password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .max(30, {
      message: 'Password must not be longer than 30 characters.',
    }),
});

type ResetFormValues = z.infer<typeof resetFormSchema>;

interface Response {
  status: number;
  message: string;
}
const Reset = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '' 
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    mode: 'onChange',
  });

  async function onSubmit({code, password}: ResetFormValues) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/password/forgot/confirm/${email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'          },
          body: JSON.stringify({code, newPassword: password}),
        },
      );
      const response:Response  = await res.json();
      if (response.status >= 400 && response.status <= 500) {
        toast({
          title: response.status.toString(),
          description: response.message,
          type: 'foreground',
          variant: 'destructive',
        });
        return;
      } else if (response.status === 200) {
          toast({
            title: response.message,
          });
      }
    } catch {
      toast({
        title: 'ERROR: 500',
        description: 'Something Went Wrong. Try again later',
      });
    }
  }

  return (
    <Card className=" lg:w-8/12 md:w-8/12 sm:w-8/12">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email below to Reset the
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input  id="code" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input  id="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Reset</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Reset;
