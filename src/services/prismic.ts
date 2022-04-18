import * as prismic from '@prismicio/client';
import { HttpRequestLike } from '@prismicio/client';
import * as prismicNext from '@prismicio/next';

import sm from '../../sm.json';

export interface PreviewDataProps {
  previewData?: any;
  req?: HttpRequestLike;
}

export const createClient = (config: PreviewDataProps): prismic.Client => {
  const client = prismic.createClient(sm.apiEndpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
};
