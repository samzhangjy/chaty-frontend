import { Image, useMantineColorScheme } from "@mantine/core";
import useStyles from "./styles";
import { CSSProperties } from "react";

export type ChatyLogoProps = {
  variant?: "logo-background" | "logo-text" | "logo-transparent" | "text-slogan";
  size?: "xl" | "lg" | "md" | "sm" | "xs" | number;
  style?: CSSProperties;
};

const logoSizes = {
  "logo-background": {
    xs: 30,
    sm: 40,
    md: 50,
    lg: 60,
    xl: 70,
  },
  "logo-text": {
    xs: 90,
    sm: 100,
    md: 110,
    lg: 120,
    xl: 130,
  },
  "logo-transparent": {
    xs: 30,
    sm: 40,
    md: 50,
    lg: 60,
    xl: 70,
  },
  "text-slogan": {
    xs: 200,
    sm: 250,
    md: 300,
    lg: 350,
    xl: 400,
  },
};

const ChatyLogo = ({ variant = "logo-background", size = "md", style }: ChatyLogoProps) => {
  const theme = useMantineColorScheme();
  const logoSrc = `/assets/logo/${theme.colorScheme}/${variant}.svg`;
  const { classes } = useStyles();
  return (
    <Image
      src={logoSrc}
      alt="Chaty logo"
      maw={typeof size === "number" ? size : logoSizes[variant][size]}
      className={classes.logo}
      style={style}
    />
  );
};

export default ChatyLogo;
