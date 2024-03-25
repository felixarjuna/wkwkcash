import { zodResolver } from "@hookform/resolvers/zod";
import { SmartContract, useSDK } from "@thirdweb-dev/react";
import { Bitcoin, Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EMPTY_WALLET_ADDRESS } from "../lib/constants";
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

const CreateUsernameSchema = z.object({
  username: z.string(),
});

type CreateUsernameFormProps = {
  address?: string;
  accountFactory?: SmartContract;
};

export default function CreateUsernameForm({
  address,
  accountFactory,
}: CreateUsernameFormProps) {
  const form = useForm<z.infer<typeof CreateUsernameSchema>>({
    resolver: zodResolver(CreateUsernameSchema),
  });

  const [isRegistering, setIsRegistering] = React.useState<boolean>(false);

  const sdk = useSDK();
  const handleCreateUsername = async ({
    username,
  }: z.infer<typeof CreateUsernameSchema>) => {
    try {
      const usernameAccount = await accountFactory?.call("accountOfUsername", [
        username,
      ]);
      if (usernameAccount === EMPTY_WALLET_ADDRESS) {
        setIsRegistering(true);

        const accountContract = await sdk?.getContract(address!);
        await accountContract?.call("register", [username]);
        toast({
          title: "Registration success!",
          description: "Your username has been successfully registered.",
        });

        setIsRegistering(false);
      } else
        toast({
          type: "desctructive",
          title: "Registration failed!",
          description: "Username is already taken.",
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-zinc-200 p-12 max-w-xl w-full rounded-lg space-y-8">
      <div className="flex justify-center items-center space-x-1">
        <Bitcoin className="w-6 h-6"></Bitcoin>
        <h1 className="font-bold text-xl">wkwkcash</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateUsername)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {isRegistering ? (
              <div className="space-x-2 flex items-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p>Registering username...</p>
              </div>
            ) : (
              <p>Register username</p>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
