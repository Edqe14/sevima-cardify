import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import type { DefaultResponse } from '../api';

export const authenticated = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponse>,
  next: () => void,
) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.session = session;

  return next();
};
