import { Button, Container, Group, Text, Title } from "@mantine/core";
import { useTranslation } from "next-i18next";
import useStyles from "./styles";

const InternalServerError = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("errors");

  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>500</div>
        <Title className={classes.title}>{t("500.title")}</Title>
        <Text size="lg" align="center" className={classes.description}>
          {t("500.desc")}
        </Text>
        <Group position="center">
          <Button variant="white" size="md" onClick={() => window.location.reload()}>
            {t("500.action")}
          </Button>
        </Group>
      </Container>
    </div>
  );
};

export default InternalServerError;
