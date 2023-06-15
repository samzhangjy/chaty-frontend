import AppNavbar from "@/components/AppNavbar";
import { defaultLocale } from "@/config/locales";
import createGroup from "@/features/group/createGroup";
import { selectCurrentGroup, setCurrentGroup } from "@/features/group/groupSlice";
import { selectUser } from "@/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import User from "@/types/user";
import { getUserAvatar } from "@/utils/avatar";
import { isFailedResponse } from "@/utils/baseResponse";
import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Container,
  Group,
  MultiSelect,
  MultiSelectValueProps,
  Paper,
  Text,
  TextInput,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, forwardRef, useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";

const useStyles = createStyles((theme) => ({
  messageScroll: {
    display: "flex",
    flexDirection: "column-reverse",
    padding: `${theme.spacing.xl} ${theme.spacing.xl} 0 ${theme.spacing.xl}`,
    marginBottom: 140,
  },

  messageScrollWrapper: {
    height: `calc(100vh - 60px)`,
    overflow: "auto",
    display: "flex",
    flexDirection: "column-reverse",
  },
}));

interface UserSelectItemProps extends React.ComponentPropsWithoutRef<"div"> {
  avatar: string;
  username: string;
  email: string;
}

const MemberSelectItem = forwardRef<HTMLDivElement, UserSelectItemProps>(
  ({ avatar, username, email, ...others }: UserSelectItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={avatar} />

        <div>
          <Text>{username}</Text>
          <Text size="xs" color="dimmed">
            {email}
          </Text>
        </div>
      </Group>
    </div>
  )
);
MemberSelectItem.displayName = "MemberSelectItem";

const AppCreateGroupPage: NextPageWithLayout = () => {
  const { t } = useTranslation("app");
  const { t: et } = useTranslation("server-errors");
  const router = useRouter();
  const currentUser = useAppSelector(selectUser);
  const form = useForm({
    initialValues: {
      name: "",
      members: [] as string[],
    },
    validate: {
      name: isNotEmpty(t("errors.create-group.name-empty")),
    },
    validateInputOnBlur: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const MemberSelectValue = ({
    value,
    label,
    onRemove,
    classNames,
    ...others
  }: MultiSelectValueProps & { value: string }) => (
    <div {...others}>
      <Box
        sx={(theme) => ({
          display: "flex",
          cursor: "default",
          alignItems: "center",
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
          paddingLeft: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          height: rem(30),
        })}
      >
        <Box mr={8}>
          <Avatar src={getUserAvatar({ username: label } as User)} size={20} radius="xl" />
        </Box>
        <Box sx={{ lineHeight: 1, fontSize: rem(12) }}>{label}</Box>

        <CloseButton
          onMouseDown={onRemove}
          variant="transparent"
          size={22}
          iconSize={14}
          tabIndex={-1}
          disabled={value === currentUser?.id.toString()}
        />
      </Box>
    </div>
  );

  const handleSubmit = async ({ name, members }: typeof form.values) => {
    console.log(members);
    setIsLoading(true);
    const { data, hasFetchError } = await createGroup({ name, members: members.map((member) => parseInt(member)) });
    setIsLoading(false);
    if (hasFetchError) {
      notifications.show({
        title: t("errors.create-group.creation-failed"),
        message: t("errors.create-group.fetch-error"),
        color: "red",
      });
      return;
    }
    if (isFailedResponse(data)) {
      notifications.show({
        title: t("errors.create-group.creation-failed"),
        message: et(data.errorCode),
        color: "red",
      });
      return;
    }
    notifications.show({ message: t("errors.create-group.creation-success"), color: "green" });
    router.push(`/app?groupId=${data.group.id}`);
  };

  return (
    <>
      <Head>
        <title>Chaty</title>
      </Head>
      <Container size={420} my={80}>
        <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 700 })}>
          {t("main.create-group.title")}
        </Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label={t("main.create-group.labels.name")}
              placeholder={t("main.create-group.labels.name") as string}
              withAsterisk
              {...form.getInputProps("name")}
            />

            <MultiSelect
              label={t("main.create-group.labels.members")}
              placeholder={t("main.create-group.labels.members") + ""}
              itemComponent={MemberSelectItem}
              valueComponent={MemberSelectValue}
              data={[
                {
                  avatar: getUserAvatar(currentUser!),
                  username: currentUser?.username,
                  label: currentUser?.username,
                  email: currentUser?.email,
                  value: currentUser?.id?.toString() as string,
                  group: t("main.create-group.labels.select-me").toString(),
                  disabled: true,
                },
              ]}
              searchable
              nothingFound={t("main.create-group.labels.select-not-found")}
              maxDropdownHeight={400}
              filter={(value, selected, item) =>
                !selected &&
                (item.label?.toLowerCase()?.includes(value.toLowerCase().trim()) ||
                  item.email?.toLowerCase()?.includes(value.toLowerCase().trim()))
              }
              mt="lg"
              withAsterisk
              {...form.getInputProps("members")}
            />
            <Button fullWidth mt="xl" type="submit" disabled={!form.isValid()} loading={isLoading}>
              {t("main.create-group.action")}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, ["common", "app", "server-errors"])),
  },
});

const Navbar = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation("app");
  const [subNavbarOpened, setSubNavbarOpened] = useState(false);

  return (
    <AppNavbar
      subNavbarOpened={subNavbarOpened}
      setSubNavbarOpened={setSubNavbarOpened}
      title={t("main.create-group.title").toString()}
    >
      {children}
    </AppNavbar>
  );
};

const AppLayout = (page: ReactNode) => {
  return <Navbar>{page}</Navbar>;
};

AppCreateGroupPage.getLayout = AppLayout;

export default AppCreateGroupPage;
