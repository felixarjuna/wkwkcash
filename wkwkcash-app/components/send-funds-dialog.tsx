import { zodResolver } from "@hookform/resolvers/zod";
import { useContract, useSDK } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ACCOUNT_FACTORY_ADDRESS,
  EMPTY_WALLET_ADDRESS,
} from "../lib/constants";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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

const SendFundsSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  amount: z.coerce.number(),
});

type SendFundsDialogProps = {
  tokenBalance:
    | {
        symbol: string;
        value: BigNumber;
        name: string;
        decimals: number;
        displayValue: string;
      }
    | undefined;
};

export default function SendFundsDialog({
  tokenBalance,
}: SendFundsDialogProps) {
  // state to track the transaction
  const [isSending, setIsSending] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof SendFundsSchema>>({
    resolver: zodResolver(SendFundsSchema),
  });

  const { contract: accountFactory } = useContract(ACCOUNT_FACTORY_ADDRESS);
  const sdk = useSDK();
  async function sendFunds(data: z.infer<typeof SendFundsSchema>) {
    if (data.amount === 0) {
      toast({
        variant: "destructive",
        title: "Amount not specified!",
        description: "You haven't specify any amount to send.",
      });
      return;
    }

    if (data.amount > Number(tokenBalance?.displayValue)) {
      toast({
        variant: "destructive",
        title: "Insufficient funds!",
        description: "You don't have enough balance to send the funds.",
      });
      return;
    }

    try {
      setIsSending(true);
      // validate receiver address
      const receiver = await accountFactory?.call("accountOfUsername", [
        data.username,
      ]);
      if (receiver === EMPTY_WALLET_ADDRESS) {
        toast({
          variant: "destructive",
          title: "Receiver not found!",
          description: "The receiver address you specified does not exist.",
        });
        return;
      }

      // transfer funds
      await sdk?.wallet.transfer(receiver, data.amount);
      toast({
        title: "Transaction sent!",
        description: `Funds successfully sent to ${receiver}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error,
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Send funds</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send funds</DialogTitle>
          <DialogDescription>
            Let&apos;s transfer some funds to your friend💲
          </DialogDescription>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(sendFunds)} className="space-y-4">
              <div className="mt-4">
                <h3>Balance</h3>
                <p className="font-bold text-2xl">
                  {tokenBalance?.displayValue} {tokenBalance?.symbol}
                </p>
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                defaultValue={0}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} step={0.01} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSending}>
                {isSending ? (
                  <div className="flex space-x-2 items-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p>Sending funds ...</p>
                  </div>
                ) : (
                  <p>Send funds</p>
                )}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
