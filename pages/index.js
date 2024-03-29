import Image from "next/image";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import Upload from "@/components/Upload";
import Files from "@/components/Files";

const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
});

const Homepage = dynamic(() => import("@/components/Homepage"), {
  ssr: false,
});

export default function IndexPage() {
  return (
    <Layout>
      {/* Wallet connect logic all in header  */}
      <Header />

      <main className="grow flex flex-col items-center justify-center gap-4">
        <Homepage />
      </main>
    </Layout>
  );
}
