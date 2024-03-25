import {
  useAddress,
  useBalanceForAddress,
  useContract,
  useContractRead,
  useDisconnect,
} from "@thirdweb-dev/react";

import { Bitcoin } from "lucide-react";
import { ACCOUNT_FACTORY_ADDRESS } from "../lib/constants";
import CreateUsernameForm from "./create-username-form";
import SendFunds from "./send-funds";
import { Button } from "./ui/button";

export default function Connected() {
  const disconnect = useDisconnect();

  const address = useAddress();
  const { contract: accountFactory } = useContract(ACCOUNT_FACTORY_ADDRESS);

  const { data: hasUsername } = useContractRead(accountFactory, "hasUsername", [
    address,
  ]);

  const { data: usernameOfAccount } = useContractRead(
    accountFactory,
    "usernameOfAccount",
    [address]
  );

  const { data: tokenBalance } = useBalanceForAddress(address!);

  if (!hasUsername)
    return (
      <CreateUsernameForm address={address} accountFactory={accountFactory} />
    );

  return (
    <div className="bg-zinc-200 p-12 max-w-xl w-full rounded-lg space-y-4">
      <div className="flex justify-center items-center space-x-1 mb-8">
        <Bitcoin className="w-6 h-6"></Bitcoin>
        <h1 className="font-bold text-xl">wkwkcash</h1>
      </div>

      <div className="flex flex-row justify-between items-center">
        <h1>Welcome {usernameOfAccount}</h1>
        <Button
          onClick={async () => {
            await disconnect();
          }}
        >
          Sign Out
        </Button>
      </div>

      <div>
        <h3>Balance</h3>
        <p className="font-bold text-2xl">
          {tokenBalance?.displayValue} {tokenBalance?.symbol}
        </p>
      </div>

      <SendFunds />
    </div>
  );
}
