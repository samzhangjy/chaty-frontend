import "@/styles/globals.css";
import { ColorScheme, ColorSchemeProvider, GlobalStyles, MantineProvider, MantineThemeOverride } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

const App = ({ Component, pageProps }: AppProps) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const preferredColorScheme = useColorScheme();

  useEffect(() => {
    setColorScheme(preferredColorScheme);
  }, [preferredColorScheme]);

  const lightTheme: MantineThemeOverride = {
    colorScheme: "light",
    primaryColor: "indigo",
  };

  const darkTheme: MantineThemeOverride = {
    colorScheme: "dark",
    primaryColor: "indigo",
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={colorScheme === "light" ? lightTheme : darkTheme}>
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default appWithTranslation(App);
