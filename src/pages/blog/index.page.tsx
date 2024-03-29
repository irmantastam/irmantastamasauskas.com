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
import { dynamicBlurDataUrl } from '@src/pages/utils/dynamicBlurDataUrl';

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
        pageTitle={t('blog.title')}
        pageDescription={t('blog.description')}
      />

      <Container className="my-8  md:mb-10 lg:mb-16">
        <h2 className="mb-4 md:mb-6">{t('blog.latestArticles')}</h2>
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

    const getPosts = async () =>
      Promise.all(
        posts?.map(async item => ({
          ...item,
          ...(item?.__typename === 'PageBlogPost'
            ? {
                featuredImage: {
                  ...item?.featuredImage,
                  blurHash: await dynamicBlurDataUrl(item?.featuredImage?.url || ''),
                },
              }
            : {}),
        })) as any,
      );

    return {
      revalidate: revalidateDuration,
      props: {
        previewActive: !!preview,
        ...(await getServerSideTranslations(locale)),
        posts: await getPosts(),
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
