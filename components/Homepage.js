import { useAuthContext } from "@/context/auth";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const user = useAuthContext();
  return (
    <section className="px-4 text-white text-center flex flex-col items-center justify-center grow ">
      {address && isConnected ? (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-stone-400">Connected wallet</span> <code className="border text-xs rounded-lg py-1 px-2 border-neutral-500 bg-neutral-600">{address}</code>
          {!user ? (
            <p>Please sign in to use dApp</p>
          ) : (
            <Link className="text-white text-xs bg-blue-600 hover:opacity-80 active:shadow-none font-bold px-4 p-2 rounded-full shadow select-none hideBtnHighlight" href="/dapp">
              Go to dApp
            </Link>
          )}
        </div>
      ) : (
        <h2>Please connect and sign in.</h2>
      )}
    </section>
  );
}
