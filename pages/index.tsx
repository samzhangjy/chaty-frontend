import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import { defaultLocale } from "@/config/locales";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const Home = () => {
  const { t } = useTranslation("home");
  return (
    <>
      <Head>
        <title>{t("title")} - Chaty</title>
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
