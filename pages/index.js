import Image from "next/image";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
});

const Homepage = dynamic(() => import("@/components/Homepage"), {
  ssr: false,
});

export default function Home() {
  return (
    <Layout>
      {/* Wallet connect logic all in header  */}
      <Header />

      <Homepage />
    </Layout>
  );
}
