import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Urbanist } from 'next/font/google';
import './utils/globals.css';
import '@contentful/live-preview/style.css';
import { useRouter } from 'next/router';

import { Layout } from '@src/components/templates/layout';

const urbanist = Urbanist({ subsets: ['latin'], variable: '--font-urbanist' });

const App = ({ Component, pageProps }: AppProps) => {
  const { locale } = useRouter();
  return (
    <ContentfulLivePreviewProvider
      enableInspectorMode={pageProps.previewActive}
      enableLiveUpdates={pageProps.previewActive}
      locale={locale || 'en-US'}
    >
      <ThemeProvider attribute="class">
        <>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
          <main className={`${urbanist.variable} font-sans`}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </main>
          <div id="portal" className={`${urbanist.variable} font-sans`} />
        </>
      </ThemeProvider>
    </ContentfulLivePreviewProvider>
  );
};

export default appWithTranslation(App);