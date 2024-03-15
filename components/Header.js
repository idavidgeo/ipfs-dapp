import { Connector, useConnect } from "wagmi";
import { useAccount, useDisconnect, useBalance, useEnsAvatar, useEnsName } from "wagmi";
import ClientPortal from "@/components/ClientPortal";
import { useEffect, useState } from "react";

export default function Header({ className = "" }) {
  const [showPortal, setShowPortal] = useState(false);

  const { connectors, connectAsync } = useConnect();
  const { address, isConnected, isConnecting } = useAccount();
  const { data } = useBalance({ address: address });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    console.log("bal: ", data);
  }, [data]);

  function onAttempConnect(connector) {
    connectAsync({ connector })
      .then(() => setShowPortal(false))
      .catch(() => console.error("Failed connecting to wallet"));
  }
  return (
    <>
      <header className="flex justify-between items-center shadow px-4 py-2">
        <h1 className="text-white font-bold ">ipfs-dapp</h1>
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            <span className="text-white text-xs bg-neutral-600 font-bold px-4 p-2 rounded-full shadow">
              {data?.formatted + " " + data?.symbol} • {address.slice(0, 6)}
            </span>

            <button onClick={disconnect} className="active:[&>svg]:drop-shadow-none hover:[&>svg]:opacity-80">
              <svg className="fill-red-500 drop-shadow" width="30" height="30" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.5 16.084l-1.403 1.416-4.09-4.096-4.102 4.096-1.405-1.405 4.093-4.092-4.093-4.098 1.405-1.405 4.088 4.089 4.091-4.089 1.416 1.403-4.092 4.087 4.092 4.094z" />
              </svg>
            </button>
          </div>
        ) : (
          <button onClick={() => setShowPortal(true)} className="text-white text-xs bg-neutral-600 hover:opacity-80 active:shadow-none font-bold px-4 p-2 rounded-full shadow">
            Connect
          </button>
        )}
      </header>

      {/* Portal for wallet connector selection  */}
      <ClientPortal show={showPortal}>
        <div onClick={() => setShowPortal(false)} className="animate-slideFromBottom absolute inset-0 z-50 p-4 w-full flex flex-col justify-end items-center">
          <div onClick={(e) => e.stopPropagation()} className="bg-neutral-600 relative rounded-3xl p-4 shadow-xl flex flex-col max-w-sm w-full gap-4 items-center">
            <button onClick={() => setShowPortal(false)} className="absolute right-5 hover:opacity-80">
              <svg className=" fill-neutral-500" width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.5 16.084l-1.403 1.416-4.09-4.096-4.102 4.096-1.405-1.405 4.093-4.092-4.093-4.098 1.405-1.405 4.088 4.089 4.091-4.089 1.416 1.403-4.092 4.087 4.092 4.094z" />
              </svg>
            </button>
            <span className="text-white text-sm font-bold">Select Wallet</span>
            <div className="flex flex-col gap-2 text-white">
              {connectors &&
                connectors.map((connector) => (
                  <button key={connector.uid} onClick={() => onAttempConnect(connector)}>
                    {connector.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </ClientPortal>
    </>
  );
}
