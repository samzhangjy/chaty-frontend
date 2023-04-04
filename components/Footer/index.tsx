import { Anchor, Container, Divider, Group, Text } from "@mantine/core";
import { useTranslation } from "next-i18next";
import ChatyLogo from "../ChatyLogo";
import useStyles from "./styles";

const Footer = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("common");

  const links = [
    {
      link: "https://github.com/samzhangjy/chaty",
      label: "GitHub",
    },
  ];

  const items = links.map((link) => (
    <Anchor<"a"> color="dimmed" key={link.label} href={link.link} target="_blank" size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <ChatyLogo size="md" variant="logo-text" />
        <Group>
          <Group className={classes.links}>{items}</Group>
          <Divider orientation="vertical" />
          <Text color="dimmed" size="sm">
            &copy; {new Date().getFullYear()} Sam Zhang. {t("footer.copyright")}
          </Text>
        </Group>
      </Container>
    </div>
  );
};

export default Footer;
