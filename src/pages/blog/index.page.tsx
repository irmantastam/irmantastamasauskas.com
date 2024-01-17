import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';

import { getServerSideTranslations } from './../utils/get-serverside-translations';

import { ArticleTileGrid } from '@src/components/features/article';
import { SeoFields } from '@src/components/features/seo';
import { Container } from '@src/components/shared/container';
import { PageBlogPostOrder } from '@src/lib/__generated/sdk';
import { client, previewClient } from '@src/lib/client';
import { revalidateDuration } from '@src/pages/utils/constants';

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  const posts = useContentfulLiveUpdates(props.posts);

  if (!posts) return;

  return (
    <>
      <SeoFields
        __typename="ComponentSeo"
        noindex={true}
        nofollow={true}
        pageTitle="Irmantas Tamašauskas | Blog"
      />

      <Container className="my-8  md:mb-10 lg:mb-16">
        <h2 className="mb-4 md:mb-6">{t('landingPage.latestArticles')}</h2>
        <ArticleTileGrid className="md:grid-cols-2 lg:grid-cols-3" articles={posts} />
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, draftMode: preview }) => {
  try {
    const gqlClient = preview ? previewClient : client;

    const blogPostsData = await gqlClient.pageBlogPostCollection({
      limit: 10,
      locale,
      order: PageBlogPostOrder.PublishedDateDesc,
      preview,
    });
    const posts = blogPostsData.pageBlogPostCollection?.items;

    return {
      revalidate: revalidateDuration,
      props: {
        previewActive: !!preview,
        ...(await getServerSideTranslations(locale)),
        posts,
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
