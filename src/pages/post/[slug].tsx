import { GetStaticPaths } from 'next';
import { RichText } from 'prismic-dom';
import { ParsedUrlQuery } from 'querystring';
import { Fragment, useMemo } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';
import { PrismicRichText } from '@prismicio/react';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: [];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const formattedPost = {
    ...post,
    first_publication_date: format(
      new Date(post.first_publication_date),
      "dd MMM' 'yyyy",
      {
        locale: ptBR,
      }
    ),
  };

  const readingTime = useMemo(
    () =>
      post.data.content.reduce((acc, content) => {
        const textBody = RichText.asText(content.body);
        const split = textBody.split(' ');
        const numberOfWords = split.length;

        const result = Math.ceil(numberOfWords / 200);
        return acc + result;
      }, 0),
    [post.data.content]
  );

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Header />

      <main>
        <img className={styles.heroImage} src={post.data.banner.url} alt="" />

        <div className={`${commonStyles.maxWidth} ${styles.content}`}>
          <h1>{formattedPost.data.title}</h1>
          <div className={commonStyles.footerPostData}>
            <time>
              <FiCalendar />
              {formattedPost.first_publication_date}
            </time>
            <span>
              <FiUser />
              {formattedPost.data.author}
            </span>
            <span>
              <FiClock />
              {readingTime} min
            </span>
          </div>

          <div className={styles.postContent}>
            {formattedPost.data.content.map(item => (
              <Fragment key={item.heading}>
                <h2>{item.heading}</h2>

                <div className={styles.postBody}>
                  <PrismicRichText field={item.body} />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ previewData }) => {
  const prismic = getPrismicClient({ previewData });
  const response = await prismic.getByType('posts', { pageSize: 2 });

  const paths = response.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ previewData, params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({ previewData });
  const post = await prismic.getByUID('posts', String(slug));

  return {
    props: {
      post,
    },
  };
};
