import { Anchor, Button, Container, Text, Title } from "@mantine/core";
import { Dots } from "./Dots";
import useStyles from "./styles";
import { Trans, useTranslation } from "next-i18next";
import Link from "next/link";

const HeroBanner = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("home");
  const { t: ct } = useTranslation("common");

  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          <Trans i18nKey="banner.heading" t={t}>
            The
            <Text component="span" className={classes.highlight} inherit>
              Ultimate
            </Text>
            Chat Platform
          </Trans>
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" color="dimmed" className={classes.description}>
            <Trans i18nKey="banner.description" t={t}>
              Powered by amazing technologies such as{" "}
              <Anchor href="https://nestjs.com/" target="_blank">
                Nestjs
              </Anchor>
              and
              <Anchor href="https://nextjs.org/" target="_blank">
                Nextjs
              </Anchor>
              , Chaty recreates basic functionalities of WeChat with less than 2k lines of code. Backed with full open
              source community, Chaty can do more than ever.
            </Trans>
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            className={classes.control}
            size="lg"
            variant="default"
            color="gray"
            component={Link}
            href="/auth/login"
          >
            {t("banner.actions.login")}
          </Button>
          <Button className={classes.control} size="lg" component={Link} href="/auth/register">
            {t("banner.actions.register")}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default HeroBanner;
