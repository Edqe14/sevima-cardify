import '@/styles/globals.scss';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { mantineCache, theme } from '@/lib/mantine';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { IconContext } from '@phosphor-icons/react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <IconContext.Provider
        value={{
          size: 16,
          weight: 'bold',
        }}
      >
        <MantineProvider
          withCSSVariables
          withGlobalStyles
          emotionCache={mantineCache}
          theme={theme}
        >
          <ModalsProvider
            modalProps={{
              centered: true,
            }}
          >
            <Notifications />
            <Component {...pageProps} />
          </ModalsProvider>
        </MantineProvider>
      </IconContext.Provider>
    </SessionProvider>
  );
}
