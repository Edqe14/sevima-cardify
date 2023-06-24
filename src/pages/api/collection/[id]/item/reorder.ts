import { type DefaultResponse, createApiRouter } from '@/lib/api';
import { authenticated } from '@/lib/middlewares/authenticated';
import { prisma } from '@/lib/prisma';
import type { Item } from '@prisma/client';
import { z } from 'zod';

const { router, handle } = createApiRouter<DefaultResponse<Item>>();

export const itemsBodySchema = z.array(
  z.object({
    id: z.string(),
    order: z.number(),
  }),
);

router.use(authenticated).put(async (req, res) => {
  if (!req.session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.query.id) {
    return res.status(400).json({ error: 'Bad request' });
  }

  const collection = await prisma.collection.findFirst({
    where: { id: req.query.id as string },
    select: {
      userId: true,
      public: true,
    },
  });

  if (!collection) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.session.user.id !== collection.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const parsed = itemsBodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(422).json({ error: parsed.error.errors });
  }

  try {
    await prisma.$transaction(
      parsed.data.map((item) =>
        prisma.item.update({
          data: {
            order: item.order,
          },
          where: {
            id: item.id,
          },
        }),
      ),
    );

    res.json({ message: 'Updated' });
  } catch {
    return res.status(404).json({ error: 'Not found' });
  }
});

export default handle();
