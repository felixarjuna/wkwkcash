import {
  SmartWallet,
  useAddress,
  useDisconnect,
  useWallet,
} from "@thirdweb-dev/react";
import { NextPage } from "next";

import Connected from "../components/connected";
import Login from "../components/login";
import { Button } from "../components/ui/button";

const Home: NextPage = () => {
  const address = useAddress();
  const wallet = useWallet();

  console.log(address);
  console.log(wallet);

  const disconnect = useDisconnect();

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="w-full max-w-7xl p-12 flex flex-col justify-center items-center h-full">
        {address ? (
          wallet instanceof SmartWallet ? (
            <Connected />
          ) : (
            <div>
              <p>Connecting...</p>
              <Button onClick={async () => await disconnect()}>
                Disconnect
              </Button>
            </div>
          )
        ) : (
          <Login />
        )}
      </div>
    </main>
  );
};

export default Home;
