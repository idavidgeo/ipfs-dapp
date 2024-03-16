import Head from "next/head";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function Layout({ children, className = "", title = "ipfs-dapp" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        {/* Meta, SEO and favicon still here  */}
      </Head>
      <div className={`flex relative flex-col bg-neutral-700 min-h-[screen] min-h-[100svh] min-h-[-webkit-fill-available] ${className} ${poppins.className}`}>{children}</div>
    </>
  );
}
