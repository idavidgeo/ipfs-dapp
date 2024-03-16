import Image from "next/image";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import Upload from "@/components/Upload";
import Files from "@/components/Files";

const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
});

export default function FilesPage() {
  return (
    <Layout>
      {/* Wallet connect logic all in header  */}
      <Header />

      <main className="grow flex flex-col items-center justify-center gap-4">
        <Files />
        <Upload />
      </main>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { cookies } = context.req;
  const token = cookies.authCookie;

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}
