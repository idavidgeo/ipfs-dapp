import Image from "next/image";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import Upload from "@/components/Upload";
import Files from "@/components/Files";
import { useEffect, useState } from "react";
import axios from "axios";

const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
});

export default function DappPage() {
  const [files, setFiles] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Very very ineffective - TODO: need cache layer for cacheThenFetch policy
  useEffect(() => {
    if (!files) {
      getUploadedFiles();
    }
  }, []);

  function getUploadedFiles() {
    setIsLoading(true);
    axios.get("/api/secure/listUploads").then(({ data }) => {
      setFiles(data.files);
      setIsLoading(false);
    });
  }

  return (
    <Layout>
      {/* Wallet connect logic all in header  */}
      <Header />

      <main className="grow flex flex-col items-center my-4 gap-4">
        <Files uploaded={files} isLoading={isLoading} />
        <Upload isLoading={isLoading} setIsLoading={setIsLoading} triggerRefetech={() => getUploadedFiles()} />
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
