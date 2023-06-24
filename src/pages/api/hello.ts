// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { type DefaultResponse, createApiRouter } from '@/lib/api';

type Data = DefaultResponse & {
  name: string;
};

const { router, handle } = createApiRouter<Data>();

router.get((req, res) => {
  res.json({ name: 'Joe Doe' });
});

export default handle();
