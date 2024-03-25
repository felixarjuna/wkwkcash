import { useAddress, useBalanceForAddress } from "@thirdweb-dev/react";

import SendFundsDialog from "./send-funds-dialog";

export default function SendFunds() {
  const address = useAddress();

  const { data: tokenBalance } = useBalanceForAddress(address!);

  return <SendFundsDialog tokenBalance={tokenBalance} />;
}
