import {
  SmartWalletConfigOptions,
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import { Toaster } from "../components/ui/toaster";
import { ACCOUNT_FACTORY_ADDRESS } from "../lib/constants";
import "../styles/globals.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "sepolia";

const smartWalletConfig: SmartWalletConfigOptions = {
  factoryAddress: ACCOUNT_FACTORY_ADDRESS,
  gasless: true,
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[smartWallet(embeddedWallet(), smartWalletConfig)]}
    >
      <Component {...pageProps} />
      <Toaster />
    </ThirdwebProvider>
  );
}

export default MyApp;
