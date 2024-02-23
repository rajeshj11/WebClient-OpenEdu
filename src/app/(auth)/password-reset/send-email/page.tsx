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
import { useRouter } from "next/navigation";

const resetFormSchema = z.object({
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email()
});

type ResetFormValues = z.infer<typeof resetFormSchema>;

interface Response {
  status: number;
  message: string;
}
const SendResetMail = () => {
  const router = useRouter();
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    mode: 'onChange',
  });

  async function onSubmit({email:userEmail}: ResetFormValues) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/password/forgot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userEmail})
        },
      );
      const response: Response = await res.json();

      if (response.status >= 400 && response.status <= 500) {
        toast({
          title: response?.status.toString(),
          description: response.message,
          type: 'foreground',
          variant: 'destructive',
        });
        return;
      } else if (response.status === 200) {
        toast({
          title: response.message,
        });
        router.push(`/password-reset?email=${userEmail}`);
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
          Enter your email below to Reset the Password
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 relative">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="OpenEdu@Example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendResetMail;
