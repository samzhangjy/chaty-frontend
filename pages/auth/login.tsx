import { defaultLocale } from "@/config/locales";
import login from "@/features/user/login";
import useUser from "@/hooks/useUser";
import { isFailedResponse } from "@/utils/baseResponse";
import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { GetStaticProps } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const LoginPage = () => {
  const { t } = useTranslation("auth");
  const { t: et } = useTranslation("server-errors");
  const router = useRouter();
  const { user, mutate, isLoading } = useUser();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      rememberMe: true,
    },
    validate: {
      username: isNotEmpty(t("login.errors.username-empty")),
      password: isNotEmpty(t("login.errors.password-empty")),
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = async ({ username, password, rememberMe }: typeof form.values) => {
    const { data, hasFetchError } = await login({ username, password, rememberMe });
    if (hasFetchError) {
      notifications.show({
        title: t("login.errors.login-failed"),
        message: t("login.errors.fetch-error"),
        color: "red",
      });
      return;
    }
    if (isFailedResponse(data)) {
      notifications.show({ title: t("login.errors.login-failed"), message: et(data.errorCode), color: "red" });
      return;
    }
    await mutate();
    notifications.show({ message: t("login.errors.login-success", { user: username }), color: "green" });
    router.push("/");
  };

  if (user) {
    router.push("/");
    return <></>;
  }

  return (
    <>
      <Head>
        <title>{`${t("login.title")} - Chaty`}</title>
      </Head>
      <Container size={420} my={80}>
        <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 700 })}>
          {t("login.heading")}
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          <Trans i18nKey="login.to-register" t={t}>
            Do not have an account yet?{" "}
            <Anchor size="sm" component={Link} href="/auth/register">
              Create account
            </Anchor>
          </Trans>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label={t("login.labels.username")}
              placeholder={t("login.labels.username") as string}
              withAsterisk
              {...form.getInputProps("username")}
            />
            <PasswordInput
              label={t("login.labels.password")}
              placeholder={t("login.labels.password") as string}
              withAsterisk
              mt="md"
              {...form.getInputProps("password")}
            />
            <Group position="apart" mt="lg">
              <Checkbox
                label={t("login.labels.remember-me")}
                {...form.getInputProps("rememberMe", { type: "checkbox" })}
              />
            </Group>
            <Button fullWidth mt="xl" type="submit" disabled={!form.isValid()} loading={isLoading}>
              {t("login.action")}
            </Button>
          </form>
        </Paper>

        <Group position="center" mt={50}>
          <ActionIcon size="xl" component={Link} href="/">
            <IconArrowLeft size={20} stroke={2} />
          </ActionIcon>
        </Group>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, ["auth", "server-errors"])),
  },
});

export default LoginPage;
