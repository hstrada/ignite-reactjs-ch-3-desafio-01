import { GetStaticProps } from 'next';

import { createClient, PreviewDataProps } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home(): JSX.Element {
  return (
    <>
      <h1>hello</h1>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const prismic = createClient({ previewData });
  const response = await prismic.getByType('posts', { pageSize: 2 });

  console.log(response, 'response');

  return {
    props: {},
  };
};
