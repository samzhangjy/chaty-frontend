import { defaultLocale } from "@/config/locales";
import login from "@/features/user/login";
import register from "@/features/user/register";
import useUser from "@/hooks/useUser";
import { isFailedResponse } from "@/utils/baseResponse";
import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { GetStaticProps } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const { t } = useTranslation("auth");
  const { t: et } = useTranslation("server-errors");
  const router = useRouter();
  const { user, mutate, isLoading } = useUser();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      email: "",
      repeatPassword: "",
    },
    validate: {
      username: isNotEmpty(t("register.errors.username-empty")),
      password: (value) => {
        if (!value) return t("register.errors.password-empty");
        if (value.length < 8) return t("register.errors.password-too-short", { minLength: 8 });
        return null;
      },
      email: isEmail(t("register.errors.email-not-valid")),
      repeatPassword: (value, { password }) =>
        value === password ? null : t("register.errors.repeat-password-mismatch"),
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = async ({ username, email, password }: typeof form.values) => {
    const { data, hasFetchError } = await register({ username, email, password });

    if (hasFetchError) {
      notifications.show({
        title: t("register.errors.register-failed"),
        message: t("register.errors.fetch-error"),
        color: "red",
      });
      return;
    }

    if (isFailedResponse(data)) {
      notifications.show({ title: t("register.errors.register-failed"), message: et(data.errorCode), color: "red" });
      return;
    }

    const { data: loginData, hasFetchError: loginHasFetchError } = await login({
      password,
      username,
      rememberMe: true,
    });

    if (loginHasFetchError) {
      notifications.show({
        title: t("login.errors.login-failed"),
        message: t("login.errors.fetch-error"),
        color: "red",
      });
      return;
    }

    if (isFailedResponse(loginData)) {
      notifications.show({ title: t("login.errors.login-failed"), message: et(loginData.errorCode), color: "red" });
      return;
    }

    await mutate();
    notifications.show({ message: t("register.errors.register-success"), color: "green" });
    router.push("/");
  };

  if (user) {
    router.push("/");
    return <></>;
  }

  return (
    <>
      <Head>
        <title>{`${t("register.title")} - Chaty`}</title>
      </Head>
      <Container size={420} my={80}>
        <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 700 })}>
          {t("register.heading")}
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          <Trans i18nKey="register.to-login" t={t}>
            Already have an account?{" "}
            <Anchor size="sm" component={Link} href="/auth/login">
              Sign in
            </Anchor>
          </Trans>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label={t("register.labels.username")}
              placeholder={t("register.labels.username") as string}
              withAsterisk
              {...form.getInputProps("username")}
            />
            <TextInput
              label={t("register.labels.email")}
              placeholder={t("register.labels.email") as string}
              withAsterisk
              mt="md"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label={t("register.labels.password")}
              placeholder={t("register.labels.password") as string}
              withAsterisk
              mt="md"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label={t("register.labels.repeat-password")}
              placeholder={t("register.labels.repeat-password") as string}
              withAsterisk
              mt="md"
              {...form.getInputProps("repeatPassword")}
            />
            <Button fullWidth mt="xl" type="submit" disabled={!form.isValid()} loading={isLoading}>
              {t("register.action")}
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

export default RegisterPage;
