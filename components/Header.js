/* eslint-disable react-hooks/exhaustive-deps */
import { Connector, useConnect } from "wagmi";
import { useAccount, useDisconnect, useBalance, useEnsAvatar, useEnsName, useSignMessage } from "wagmi";
import ClientPortal from "@/components/ClientPortal";
import { useEffect, useState } from "react";
import { useAuthContext, useSetAuthContext } from "@/context/auth";
import Spinner from "./Misc/Spinner";
import axios from "axios";
import cookie from "js-cookie";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

export default function Header({ className = "" }) {
  const [showPortal, setShowPortal] = useState(false);

  // Wallet
  const { connectors, connectAsync } = useConnect();
  const { address, isConnected, isConnecting } = useAccount();
  const { data: ethBalance } = useBalance({ address: address });
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  // Auth
  const [isSigningIn, setIsSigningIn] = useState();
  const user = useAuthContext();
  const setUser = useSetAuthContext();
  const router = useRouter();

  // On page land, check for existing signedin user
  // Verify it's the same user that is connected, else sign out
  //
  useEffect(() => {
    const retriveUserSession = cookie.get("sessionCookie");
    const retriveAddress = jwt.decode(retriveUserSession)?.address;
    if (retriveAddress && address) {
      // console.log("Comparing", retriveAddress, address.toLowerCase());
      if (retriveAddress !== address.toLowerCase()) {
        console.log("Signed in user and wallet mismatch, signing out...");
        onSignOut();
      }
      console.log("Signed in user: ", retriveAddress);
      setUser(retriveAddress);
    }
  }, [address, isSigningIn]);

  async function onSignIn() {
    try {
      setIsSigningIn(true);
      // Get unique nonce to sign and save user as unverifed
      const getNonce = await axios.get("/api/auth/nonce?address=" + address);

      // Sign nonce - wallet action
      const signedMsg = await signMessageAsync({ message: `Signing in using nonce: ${getNonce.data.nonce}` });

      // Run sig against same nonce since user is already saved as unverified
      const attemptSignIn = await axios.post("/api/auth/signin", { address, signature: signedMsg });

      // client and http only cookie now active

      setIsSigningIn(false); // Triggers effect that checks for user cookie
      console.log("Signed in: ", attemptSignIn);
    } catch (e) {
      console.error("error signing in: ", e);
    }
  }

  function onSignOut() {
    if (!user) {
      return;
    }
    axios
      .post("/api/auth/signout") // Auth and Session Cookies are nullified and expired
      .then(({ data }) => {
        setUser(undefined); // Clear user context
        disconnect(); // Disconnect wallet as well.
        console.log("Signed out: ", data);
        router.push("/");
      });
  }

  function onConnect(connector) {
    connectAsync({ connector })
      .then(() => setShowPortal(false))
      .catch(() => {
        console.error("Failed connecting to wallet");
        window.alert("No injected wallet detected. Make sure a wallet extension is installed.");
      });
  }
  return (
    <>
      <header className="flex justify-between items-center shadow h-[48px] px-4 py-2">
        {/* Left Header Logo */}
        <h1 className="text-white font-bold ">ipfs-dapp</h1>

        {/* Right Header Wallet/Profile status */}
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            {!user && (
              <button
                title="Sign In with your wallet"
                disabled={isConnecting}
                onClick={onSignIn}
                className="text-white text-xs bg-blue-600 hover:opacity-80 active:shadow-none font-bold px-4 p-2 rounded-full shadow select-none hideBtnHighlight"
              >
                {isSigningIn ? <Spinner className="size-4" /> : <>Sign In</>}
              </button>
            )}

            {ethBalance ? (
              <span title={address} className="text-white text-xs bg-neutral-600 font-bold px-4 p-2 rounded-full shadow">
                {ethBalance.formatted + " " + ethBalance.symbol} • {address.slice(0, 6)}
              </span>
            ) : (
              <span className=" bg-neutral-600 px-4 p-2 rounded-full shadow">
                <div className="animate-pulse rounded bg-white/50 h-3 w-8" />
              </span>
            )}

            {user ? (
              <button
                title="Sign Out"
                onClick={onSignOut}
                className="text-white text-xs bg-red-600 hover:opacity-80 active:shadow-none font-bold px-4 p-2 rounded-full shadow select-none hideBtnHighlight"
              >
                Sign Out
              </button>
            ) : (
              <button title="Disconnect Wallet" onClick={disconnect} className="active:[&>svg]:drop-shadow-none hover:[&>svg]:opacity-80 select-none hideBtnHighlight">
                <svg className="fill-red-500 drop-shadow" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.5 16.084l-1.403 1.416-4.09-4.096-4.102 4.096-1.405-1.405 4.093-4.092-4.093-4.098 1.405-1.405 4.088 4.089 4.091-4.089 1.416 1.403-4.092 4.087 4.092 4.094z" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <button
            title="Connect Wallet"
            disabled={isConnecting}
            onClick={() => setShowPortal(true)}
            className="text-white text-xs bg-neutral-600 hover:opacity-80 active:shadow-none font-bold px-4 p-2 rounded-full shadow select-none hideBtnHighlight"
          >
            {isConnecting ? <Spinner className="size-4" /> : <>Connect</>}
          </button>
        )}
      </header>

      {/* Portal for wallet connector selection  */}
      <ClientPortal show={showPortal}>
        <div onClick={() => setShowPortal(false)} className="absolute inset-0 z-50 p-4 w-full flex flex-col justify-end items-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-slideFromBottom  bg-neutral-600 relative rounded-3xl p-4 shadow-xl flex flex-col max-w-sm w-full gap-4 items-center"
          >
            <button onClick={() => setShowPortal(false)} className="absolute right-5 hover:opacity-80 select-none hideBtnHighlight">
              <svg className=" fill-neutral-500" width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.5 16.084l-1.403 1.416-4.09-4.096-4.102 4.096-1.405-1.405 4.093-4.092-4.093-4.098 1.405-1.405 4.088 4.089 4.091-4.089 1.416 1.403-4.092 4.087 4.092 4.094z" />
              </svg>
            </button>
            <span className="text-white text-sm font-bold">Select Wallet</span>
            <div className="flex flex-col gap-2 text-white">
              {connectors &&
                connectors.map((connector) => (
                  <button key={connector.uid} onClick={() => onConnect(connector)}>
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
