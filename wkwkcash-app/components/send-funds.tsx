import { useAddress, useBalanceForAddress } from "@thirdweb-dev/react";

import SendFundsDialog from "./send-funds-dialog";

export default function SendFunds() {
  const address = useAddress();

  const { data: tokenBalance, refetch } = useBalanceForAddress(address!);

  const refreshWallet = () => {
    refetch();
  };

  return (
    <SendFundsDialog
      tokenBalance={tokenBalance}
      refreshWallet={refreshWallet}
    />
  );
}
