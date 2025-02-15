import { ThemeProvider } from "next-themes";
import "../assets/scss/globals.scss";
import "../assets/scss/theme.scss";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
