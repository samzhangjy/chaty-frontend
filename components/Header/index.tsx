import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  Header as BaseHeader,
  HoverCard,
  rem,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBolt,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconHelp,
  IconMoon,
  IconSun,
  IconWorldWww,
} from "@tabler/icons-react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import ChatyLogo from "../ChatyLogo";
import useStyles from "./styles";

const Header = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const { t } = useTranslation("common");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const data = [
    {
      icon: IconCode,
      title: t("nav.features.details.open-source.name"),
      description: t("nav.features.details.open-source.desc"),
    },
    {
      icon: IconCoin,
      title: t("nav.features.details.free.name"),
      description: t("nav.features.details.free.desc"),
    },
    {
      icon: IconFingerprint,
      title: t("nav.features.details.secure.name"),
      description: t("nav.features.details.secure.desc"),
    },
    {
      icon: IconBolt,
      title: t("nav.features.details.fast.name"),
      description: t("nav.features.details.fast.desc"),
    },
    {
      icon: IconWorldWww,
      title: t("nav.features.details.web-based.name"),
      description: t("nav.features.details.web-based.desc"),
    },
    {
      icon: IconHelp,
      title: t("nav.features.details.full-support.name"),
      description: t("nav.features.details.full-support.desc"),
    },
  ];

  const links = data.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box pb={120}>
      <BaseHeader height={60} px="md">
        <Group position="apart" sx={{ height: "100%" }}>
          <Group>
            <ChatyLogo variant="logo-transparent" />
            <Text size="md" weight={600}>
              Chaty
            </Text>
          </Group>

          <Group sx={{ height: "100%" }} spacing={0} className={classes.hiddenMobile}>
            <Link href="/" className={classes.link}>
              {t("nav.home")}
            </Link>
            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      {t("nav.features.name")}
                    </Box>
                    <IconChevronDown size={16} color={theme.fn.primaryColor()} />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                <Group position="apart" px="md">
                  <Text fw={500}>{t("nav.features.name")}</Text>
                </Group>

                <Divider my="sm" mx="-md" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group position="apart">
                    <div>
                      <Text fw={500} fz="sm">
                        {t("nav.features.try")}
                      </Text>
                      <Text size="xs" color="dimmed">
                        {t("nav.features.try-desc")}
                      </Text>
                    </div>
                    <Button variant="default">{t("nav.features.try")}</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>

          <Group className={classes.hiddenMobile}>
            <Button variant="default">{t("auth.login")}</Button>
            <Button>{t("auth.register")}</Button>
            <Tooltip label={colorScheme === "dark" ? t("nav.to-light") : t("nav.to-dark")}>
              <ActionIcon onClick={() => toggleColorScheme(colorScheme === "dark" ? "light" : "dark")}>
                {colorScheme === "dark" ? <IconSun size="1rem" /> : <IconMoon size="1rem" />}
              </ActionIcon>
            </Tooltip>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
        </Group>
      </BaseHeader>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <Link href="/" className={classes.link}>
            {t("nav.home")}
          </Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                {t("nav.features.name")}
              </Box>
              <IconChevronDown size={16} color={theme.fn.primaryColor()} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>

          <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <Group position="center" grow pb="xl" px="md">
            <Button variant="default">{t("auth.login")}</Button>
            <Button>{t("auth.register")}</Button>
          </Group>
          <Group grow pb="xl" px="md">
            <Button variant="subtle" onClick={() => toggleColorScheme(colorScheme === "dark" ? "light" : "dark")}>
              <Group>
                {colorScheme === "dark" ? <IconSun size="1rem" /> : <IconMoon size="1rem" />}
                <Text>{colorScheme === "dark" ? t("nav.to-light") : t("nav.to-dark")}</Text>
              </Group>
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Header;
