import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import { defaultLocale } from "@/config/locales";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useAppSelector } from "@/hooks/store";
import { selectUser } from "@/features/user/userSlice";
import { useRouter } from "next/router";

const Home = () => {
  const { t } = useTranslation("home");
  const user = useAppSelector(selectUser);
  const router = useRouter();

  if (user) {
    router.push("/app");
    return <></>;
  }

  return (
    <>
      <Head>
        <title>{`${t("title")} - Chaty`}</title>
      </Head>
      <Header />
      <HeroBanner />
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, ["home", "common"])),
  },
});

export default Home;
