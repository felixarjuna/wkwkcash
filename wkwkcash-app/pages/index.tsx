import {
  SmartWallet,
  useAddress,
  useConnectionStatus,
  useWallet,
} from "@thirdweb-dev/react";
import { NextPage } from "next";

import { Loader2 } from "lucide-react";
import Connected from "../components/connected";
import Login from "../components/login";

const Home: NextPage = () => {
  const status = useConnectionStatus();

  const address = useAddress();
  const wallet = useWallet();

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="w-full max-w-7xl p-12 flex flex-col justify-center items-center h-full">
        {address ? (
          wallet instanceof SmartWallet ? (
            <Connected />
          ) : (
            <p>Connecting...</p>
          )
        ) : null}

        {status === "unknown" || status === "connecting" ? (
          <div className="space-x-2 flex items-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p>Connecting wallet...</p>
          </div>
        ) : null}
        {status === "disconnected" ? <Login /> : null}
      </div>
    </main>
  );
};

export default Home;
