import { GetStaticProps } from 'next';
import { Head } from 'next/document';
import Link from 'next/link';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient, PreviewDataProps } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  previewData: PreviewDataProps;
}

const formatPost = (posts: Post[]): Post[] => {
  const result = posts.map(item => ({
    ...item,
    first_publication_date: format(
      new Date(item.first_publication_date),
      "dd MMM' 'yyyy",
      {
        locale: ptBR,
      }
    ),
  }));
  return result;
};

export default function Home({ postsPagination }): JSX.Element {
  const formattedPosts = formatPost(postsPagination.results);
  const [posts, setPosts] = useState(formattedPosts);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleNextPage(): Promise<void> {
    if (!nextPage) return;

    const response = await fetch(nextPage);

    const data = await response.json();

    const newPosts = formatPost(data.results);

    setPosts([...posts, ...newPosts]);

    setNextPage(data.next_page);
  }

  return (
    <>
      <div className={`${commonStyles.maxWidth} ${styles.container}`}>
        <Header />

        <main className={styles.content}>
          <div className={styles.posts}>
            {posts?.map(item => (
              <Link key={item.uid} href={`post/${item.uid}`}>
                <a className={styles.post}>
                  <strong>{item.data.title}</strong>
                  <p>{item.data.subtitle}</p>
                  <div className={commonStyles.footerPostData}>
                    <time>
                      <FiCalendar />
                      {item.first_publication_date}
                    </time>
                    <span>
                      <FiUser />
                      {item.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </div>

          {nextPage && (
            <button
              type="button"
              className={styles.button}
              onClick={handleNextPage}
            >
              Carregar mais posts
            </button>
          )}
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const prismic = getPrismicClient({ previewData });
  const response = await prismic.getByType('posts', { pageSize: 2 });

  const posts = response.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  const postsPagination = {
    results: posts,
    next_page: response.next_page,
  };

  return {
    props: { postsPagination },
  };
};
