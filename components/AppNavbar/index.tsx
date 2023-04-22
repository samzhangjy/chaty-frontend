import logout from "@/features/user/logout";
import useUser from "@/hooks/useUser";
import { getUserAvatar } from "@/utils/avatar";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Group,
  Header,
  Navbar,
  Popover,
  Skeleton,
  Space,
  Text,
  Title,
  Tooltip,
  Transition,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconLogout, IconMoon, IconSun, IconUsers, IconUsersPlus, IconX } from "@tabler/icons-react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import ChatyLogo from "../ChatyLogo";
import useStyles from "./styles";
import Link from "next/link";

export type AppNavbarProps = {
  subNavbarContent?: ReactNode;
  title?: string;
  children: ReactNode;
  subNavbarOpened: boolean;
  setSubNavbarOpened: (v: boolean) => void;
};

const AppNavbar = ({ subNavbarContent, subNavbarOpened, setSubNavbarOpened, title, children }: AppNavbarProps) => {
  const { classes, cx } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { t: ct } = useTranslation("common");
  const { t } = useTranslation("app");

  const mainLinksData = [
    { icon: IconUsers, label: t("nav.tabs.groups"), id: "groups", link: "/app" },
    { icon: IconUsersPlus, label: t("nav.tabs.create-group"), id: "create-group", link: "/app/create-group" },
  ];

  const [active, setActive] = useState(mainLinksData[0].id);

  const mainLinks = mainLinksData.map((link) => (
    <Tooltip label={link.label} position="right" withArrow transitionProps={{ duration: 0 }} key={link.id}>
      <UnstyledButton
        onClick={() => {
          setActive(link.id);
        }}
        component={Link}
        href={link.link}
        className={cx(classes.mainLink, { [classes.mainLinkActive]: link.id === active })}
      >
        <link.icon size="1.4rem" stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  const mantineTheme = useMantineTheme();

  const isOnMobile = useMediaQuery(`(max-width: ${mantineTheme.breakpoints.sm})`);
  const { user, isLoading, mutate } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/auth/login");
    }
  });

  const UserAction = ({
    icon,
    children,
    variant = "default",
    onClick,
  }: {
    icon: ReactNode;
    children: ReactNode;
    variant?: "default" | "danger";
    onClick?: () => void;
  }) => (
    <UnstyledButton
      className={cx(classes.userAction, variant === "danger" && classes.userActionDanger)}
      onClick={onClick}
    >
      <Group>
        {icon}
        <Text size="sm">{children}</Text>
      </Group>
    </UnstyledButton>
  );

  const SubNavbar = ({ styles }: { styles?: CSSProperties }) => (
    <Navbar height="calc(100vh - 60px)" width={{ sm: subNavbarContent ? 350 : 60 }} style={styles}>
      <Navbar.Section grow className={classes.wrapper}>
        <div className={classes.aside}>{mainLinks}</div>
        {subNavbarContent && <div className={classes.main}>{subNavbarContent}</div>}
      </Navbar.Section>
      <Navbar.Section className={classes.userContainer}>
        <div className={classes.wrapper}>
          <Popover width={250} position="right-end" shadow="sm" disabled={isLoading}>
            <Popover.Target>
              <UnstyledButton className={cx(classes.user)}>
                <Skeleton circle height={36} visible={isLoading}>
                  <Avatar src={getUserAvatar(user!)} radius="xl" size={36} />
                </Skeleton>
              </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown>
              <Group spacing="md">
                <Avatar src={getUserAvatar(user!)} radius="xl" size={30} />
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {user?.username}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {user?.email}
                  </Text>
                </Box>
              </Group>
              <Space h="md" />
              <UserAction
                icon={<IconLogout size={16} />}
                variant="danger"
                onClick={async () => {
                  logout();
                  await mutate();
                  notifications.show({ message: t("nav.actions.logout-success"), color: "green" });
                  router.push("/");
                }}
              >
                {t("nav.actions.logout")}
              </UserAction>
            </Popover.Dropdown>
          </Popover>
        </div>
      </Navbar.Section>
    </Navbar>
  );

  return (
    <>
      <AppShell
        fixed
        header={
          <Header fixed height={60}>
            <Group spacing={0}>
              <div className={classes.logo} onClick={() => isOnMobile && setSubNavbarOpened(!subNavbarOpened)}>
                {isOnMobile ? (
                  <>
                    <Transition mounted={subNavbarOpened} transition="slide-right" duration={300} timingFunction="ease">
                      {(styles) => <IconX style={{ ...styles, position: "absolute", marginTop: "2px" }} />}
                    </Transition>
                    <Transition
                      mounted={!subNavbarOpened}
                      transition="slide-right"
                      duration={300}
                      timingFunction="ease"
                    >
                      {(styles) => (
                        <ChatyLogo variant="logo-transparent" size={30} style={{ ...styles, position: "absolute" }} />
                      )}
                    </Transition>
                  </>
                ) : (
                  <ChatyLogo variant="logo-transparent" size={30} />
                )}
              </div>
              <div className={classes.header}>
                <Group position="apart">
                  <Title order={4}>{title ?? mainLinksData.find((link) => link.id === active)?.label}</Title>
                  <Tooltip label={colorScheme === "dark" ? ct("nav.to-light") : ct("nav.to-dark")}>
                    <ActionIcon onClick={() => toggleColorScheme(colorScheme === "dark" ? "light" : "dark")}>
                      {colorScheme === "dark" ? <IconSun size="1rem" /> : <IconMoon size="1rem" />}
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </div>
            </Group>
          </Header>
        }
        navbar={
          isOnMobile ? (
            <Transition mounted={subNavbarOpened} transition="slide-right" duration={400} timingFunction="ease">
              {(styles) => <SubNavbar styles={styles} />}
            </Transition>
          ) : (
            <SubNavbar />
          )
        }
        padding={0}
      >
        {children}
      </AppShell>
    </>
  );
};

export default AppNavbar;
