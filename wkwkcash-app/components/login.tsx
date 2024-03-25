import { zodResolver } from "@hookform/resolvers/zod";
import {
  embeddedWallet,
  smartWallet,
  useConnect,
  useEmbeddedWallet,
} from "@thirdweb-dev/react";
import { ArrowLeft, Bitcoin, Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ACCOUNT_FACTORY_ADDRESS } from "../lib/constants";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

const LoginSchema = z.object({
  email: z.string().email(),
});

type LoginState = "init" | "sending_email" | "email_verification" | "connected";

const EmailVerificationSchema = z.object({
  verificationCode: z.string(),
});

export default function Login() {
  // state of the login
  const [state, setState] = React.useState<LoginState>("init");

  // email
  const [email, setEmail] = React.useState<string>("");

  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);

  const { connect, sendVerificationEmail } = useEmbeddedWallet();

  const connectSmartWallet = useConnect();
  const smartWalletConfig = smartWallet(embeddedWallet(), {
    factoryAddress: ACCOUNT_FACTORY_ADDRESS,
    gasless: true,
  });

  const handleEmailEntered = async ({ email }: z.infer<typeof LoginSchema>) => {
    setState("sending_email");
    setEmail(email);
    await sendVerificationEmail({ email });
    setState("email_verification");
  };

  const handleEmailVerification = async ({
    verificationCode,
  }: z.infer<typeof EmailVerificationSchema>) => {
    setIsVerifying(true);
    try {
      const personalWallet = await connect({
        strategy: "email_verification",
        email,
        verificationCode,
      });

      const smartWallet = await connectSmartWallet(smartWalletConfig, {
        personalWallet: personalWallet,
        chainId: 11155111,
      });

      const isDeployed = await smartWallet.isDeployed();
      if (!isDeployed) await smartWallet.deploy();
      toast({
        title: "Verification success!",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const verificationForm = useForm<z.infer<typeof EmailVerificationSchema>>({
    resolver: zodResolver(EmailVerificationSchema),
  });

  if (state === "sending_email") {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <p>Sending OTP email...</p>
      </div>
    );
  }

  if (state === "email_verification") {
    return (
      <div className="bg-zinc-200 p-12 max-w-xl w-full rounded-lg space-y-8">
        <div className="flex justify-center items-center space-x-1">
          <Bitcoin className="w-6 h-6"></Bitcoin>
          <h1 className="font-bold text-xl">wkwkcash</h1>
        </div>

        <Form {...verificationForm}>
          <form
            onSubmit={verificationForm.handleSubmit(handleEmailVerification)}
            className="space-y-4"
          >
            <FormField
              control={verificationForm.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter verification code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isVerifying ? (
                <div className="flex space-x-2 items-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p>Verifying...</p>
                </div>
              ) : (
                <p>Verify</p>
              )}
            </Button>

            <Button
              variant={"ghost"}
              onClick={() => setState("init")}
              className="space-x-2 flex items-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <p>Go Back</p>
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="bg-zinc-200 p-12 max-w-xl w-full rounded-lg space-y-8">
      <div className="flex justify-center items-center space-x-1">
        <Bitcoin className="w-6 h-6"></Bitcoin>
        <h1 className="font-bold text-xl">wkwkcash</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleEmailEntered)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
