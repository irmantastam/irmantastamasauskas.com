import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { getServerSideTranslations } from './utils/get-serverside-translations';

import { Facebook, Github, Instagram, Linkedin, Quora, Resume, Youtube } from '@icons/index';
import { ArticleHero, ArticleImage, ArticleContent } from '@src/components/features/article';
import { SeoFields } from '@src/components/features/seo';
import { Container } from '@src/components/shared/container';
import { client, previewClient } from '@src/lib/client';
import { revalidateDuration } from '@src/pages/utils/constants';
import { dynamicBlurDataUrl } from '@src/pages/utils/dynamicBlurDataUrl';

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const page = useContentfulLiveUpdates(props.page);

  const [theme, setTheme] = useState('');

  useEffect(() => {
    setTheme(resolvedTheme || '');
  }, [resolvedTheme]);

  return (
    <>
      {page.seoFields && <SeoFields {...page.seoFields} />}

      {page.featuredBlogPost && (
        <Container className="mb-8">
          <Link href={`/blog/${page.featuredBlogPost.slug}`}>
            <ArticleHero article={page.featuredBlogPost} />
          </Link>
        </Container>
      )}

      <Container className="text-center">
        {page.image && (
          <Container className="mb-8 max-w-xs p-0">
            <ArticleImage
              image={page.image}
              className="aspect-square rounded-full object-cover object-[55%] contrast-[110%] sepia-[25%]"
              priority
            />
          </Container>
        )}

        {page.greeting && (
          <Container className="mb-4 p-0">
            <h1>{page.greeting}</h1>
          </Container>
        )}

        {page.content && (
          <Container className="mb-10 max-w-xs p-0 [&_p]:my-2 [&_b]:font-semibold">
            <ArticleContent article={page} />
          </Container>
        )}

        <Container className="p-0">
          <h2 className="mb-2">{t('landingPage.reachMe')}</h2>
          <ul className="mb-10 flex flex-wrap justify-center gap-1">
            <li>
              <Link
                href="https://www.linkedin.com/in/irmantas-tama%C5%A1auskas-6589272a6"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <Linkedin className="transition-transform hover:-translate-y-0.5" />
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/irmantastam"
                target="_blank"
                rel="noopener noreferrer"
                title="Github"
              >
                <Github
                  fill={theme === 'dark' ? '#b5b5b5' : undefined}
                  className="transition-transform hover:-translate-y-0.5"
                />
              </Link>
            </li>
            <li>
              <a
                href="https://www.facebook.com/irmantas.tamasauskas.73"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
              >
                <Facebook className="transition-transform hover:-translate-y-0.5" />
              </a>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/@irmantastamasauskas"
                target="_blank"
                rel="noopener noreferrer"
                title="Youtube"
              >
                <Youtube className="transition-transform hover:-translate-y-0.5" />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com/irmantastamasauskas"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <Instagram className="transition-transform hover:-translate-y-0.5" />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.quora.com/profile/Irmantas-Tama%C5%A1auskas"
                target="_blank"
                rel="noopener noreferrer"
                title="Quora"
              >
                <Quora className="transition-transform hover:-translate-y-0.5" />
              </Link>
            </li>
          </ul>
        </Container>

        <Container className="mb-4">
          <Link
            href="/resume"
            target="_blank"
            rel="noopener"
            title={t('landingPage.resume')}
            className="inline-flex items-center gap-2 font-semibold hover:underline"
          >
            <Resume /> {t('landingPage.readCv')}
          </Link>
        </Container>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, draftMode: preview }) => {
  try {
    const gqlClient = preview ? previewClient : client;

    const landingPageData = await gqlClient.pageLanding({ locale, preview });
    const page = landingPageData.pageLandingCollection?.items[0];

    if (!page) {
      return {
        revalidate: revalidateDuration,
        notFound: true,
      };
    }

    return {
      revalidate: revalidateDuration,
      props: {
        previewActive: !!preview,
        ...(await getServerSideTranslations(locale)),
        page: {
          ...page,
          ...(page.image
            ? {
                image: {
                  ...page.image,
                  image: {
                    ...page.image?.image,
                    blurHash: page.image?.image?.url
                      ? await dynamicBlurDataUrl(page.image.image.url)
                      : '',
                  },
                },
              }
            : {}),
        },
      },
    };
  } catch {
    return {
      revalidate: revalidateDuration,
      notFound: true,
    };
  }
};

export default Page;
