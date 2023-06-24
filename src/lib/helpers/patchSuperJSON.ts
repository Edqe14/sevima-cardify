import { NextApiResponse } from 'next';
import SuperJSON from 'superjson';

export const patchSuperJSON = (res: NextApiResponse) => {
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(SuperJSON.stringify(data));
  };
};
