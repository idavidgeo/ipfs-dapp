import { WagmiProvider } from "wagmi";
import { config } from "@/utils/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/globals.css";
import { AuthContextProvider, useSetAuthContext } from "@/context/auth";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </WagmiProvider>
    </AuthContextProvider>
  );
}
