import { Button, Container, Group, Text, Title } from "@mantine/core";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { Illustration } from "./Illustration";
import useStyles from "./styles";

const NotFound = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("errors");

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>{t("404.title")}</Title>
          <Text color="dimmed" size="lg" align="center" className={classes.description}>
            {t("404.desc")}
          </Text>
          <Group position="center">
            <Link href="/">
              <Button size="md">{t("404.action")}</Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
