'use client';

import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import {
  checkValues,
  getVerifiedFromLocalStorage,
  storeValues,
} from '@/scripts/check-user-auth';
import { UserProfile } from '@/scripts/types/dashboard';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Label } from '@radix-ui/react-label';
import { Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// TODO: Add password confirmation, API ROUTES

const SignUp = () => {
  // if (process.browser) {
  //   const alreadyLoggedIn: boolean = checkValues();
  //   const userVerified: boolean = getVerifiedFromLocalStorage()
  //   if (userVerified) {
  //     if (alreadyLoggedIn) {
  //       window.location.href = '/dashboard';
  //     }
  //   }
  // }

  const [loading, setLoading] = useState(false);
  const [checkbox, setCheckbox] = useState(false);

  async function signUpUser() {
    setLoading(true);

    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const confirmPassword = document.getElementById(
      'confirmpassword',
    ) as HTMLInputElement;
    const UserName = document.getElementById('UserName') as HTMLInputElement;
    const Name = document.getElementById('Name') as HTMLInputElement;

    if (!checkbox) {
      toast({
        title: 'Error',
        type: 'foreground',
        variant: 'destructive',
        description: 'Please accept the terms and conditions',
      });
      return;
    }

    if (password.value !== confirmPassword.value) {
      alert('Passwords do not match');
      return;
    }

    const data = {
      email: email.value,
      password: password.value,
      name: Name.value,
      username: UserName.value,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include',
        },
      );
      console.log('response made', JSON.stringify(data));

      if (response.status === 403) {
        toast({
          title: 'Error',
          description: 'Email or username already exists',
        });
      }
      if (process.browser) {
        if (response.status === 201) {
          console.log('success');
          const user: UserProfile = await response.json();
          console.log(user);
          if (process.browser) {
            const valueStored = storeValues(
              user.token,
              user.id.toString(),
              user.photo,
              false,
            );
            if (valueStored) {
              window.location.href = `${process.env.NEXT_PUBLIC_CLIENT_URL}/signup/verify/`;
            } else {
              toast({
                title: 'Error',
                description: 'Unable to store values',
              });
            }
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'Unable to create account, email or username may not be unique, password may be weak',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className=" lg:w-8/12 md:w-8/12 sm:w-8/12">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            <GithubIcon className="mr-2 h-4 w-4" />
            Github NOT WORKING
          </Button>
          <Button variant="outline">
            Google NOT WORKING
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div> */}
        <div className="grid gap-2">
          <Label htmlFor="text">Name</Label>
          <Input id="Name" type="string" placeholder="John Doe" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="text">UserName</Label>
          <Input id="UserName" type="string" placeholder="JohnDoe_1" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john.doe@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="*******" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Confirm Password</Label>
          <Input id="confirmpassword" type="password" placeholder="*******" />
        </div>
        <div className="items-top flex space-x-2">
          <Checkbox
            id="terms1"
            onCheckedChange={(checked: CheckedState) =>
              setCheckbox(checked === true)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
            <p className="text-sm text-muted-foreground">
              You agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
        <div>
          <Link href={'/signin'}> Already have an account? </Link>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => signUpUser()} className="w-full">
          {loading ? (
            <Loader2 className=" animate-spin" />
          ) : (
            <>
              Create Account <LogIn className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
