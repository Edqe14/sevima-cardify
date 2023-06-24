import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DefaultResponse<T = any> {
  error?: string | object;
  data?: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createApiRouter = <Data extends DefaultResponse>() => {
  const router = createRouter<NextApiRequest, NextApiResponse<Data>>();

  const handle = () =>
    router.handler({
      onError: (err, _, res) => {
        // eslint-disable-next-line no-console
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' } as Data);
      },
    });

  return { router, handle };
};
