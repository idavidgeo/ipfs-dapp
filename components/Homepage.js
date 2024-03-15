import { useAccount } from "wagmi";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  return (
    <main className="px-4 text-white text-center flex flex-col items-center justify-center grow ">
      {address && isConnected ? (
        <h2>
          Connected wallet <code className="border rounded-lg py-1 px-2 border-neutral-500 bg-neutral-600">{address}</code>
        </h2>
      ) : (
        <h2>Please connect and sign in.</h2>
      )}
    </main>
  );
}
