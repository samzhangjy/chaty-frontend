import RouterTransition from "@/components/RouterTransition";
import store from "@/store";
import "@/styles/globals.css";
import { ColorScheme, ColorSchemeProvider, MantineProvider, MantineThemeOverride } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { NextPage } from "next";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { ReactElement, useEffect, useState } from "react";
import { Provider } from "react-redux";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const preferredColorScheme = useColorScheme();
  const getLayout = Component.getLayout || ((page) => page);

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
    <Provider store={store}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={colorScheme === "light" ? lightTheme : darkTheme}>
          <Notifications />
          <RouterTransition />
          {getLayout(<Component {...pageProps} />)}
        </MantineProvider>
      </ColorSchemeProvider>
    </Provider>
  );
};

export default appWithTranslation(App);
