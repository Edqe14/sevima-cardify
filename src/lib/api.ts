import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import SuperJSON from 'superjson';
import { patchSuperJSON } from './helpers/patchSuperJSON';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DefaultResponse<T = any> {
  error?: string | object;
  data?: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createApiRouter = <Data extends DefaultResponse>() => {
  const router = createRouter<NextApiRequest, NextApiResponse<Data>>();

  // Patch SuperJSON to support Next.js API routes
  router.use((_, res, next) => {
    patchSuperJSON(res);
    next();
  });

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

export const fetcher = async <T = unknown>(
  key: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> =>
  fetch(key, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
    .then((res) => res.text())
    .then((value) => SuperJSON.parse(value));
