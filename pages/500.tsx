import { InternalServerError } from "@/components/Errors";
import { defaultLocale } from "@/config/locales";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const InternalServerErrorPage = () => {
  const { t } = useTranslation("errors");

  return (
    <>
      <Head>
        <title>{t("500.title")} - Chaty</title>
      </Head>
      <InternalServerError />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, ["errors"])),
  },
});

export default InternalServerErrorPage;
