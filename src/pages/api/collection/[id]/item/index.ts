import { type DefaultResponse, createApiRouter } from '@/lib/api';
import { authenticated } from '@/lib/middlewares/authenticated';
import { prisma } from '@/lib/prisma';
import type { Item } from '@prisma/client';
import { z } from 'zod';

const { router, handle } = createApiRouter<DefaultResponse<Item[] | Item>>();

export const itemBodySchema = z.object({
  question: z.string().max(255),
  answer: z.string().max(1000),
});

router
  .use(authenticated)
  .get(async (req, res) => {
    if (!req.session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const items = await prisma.item.findMany({
      where: { collectionId: req.query.id as string },
    });

    res.json({ data: items });
  })
  .post(async (req, res) => {
    if (!req.session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const parsed = itemBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(422).json({ error: parsed.error.errors });
    }

    const item = await prisma.item.create({
      data: {
        question: parsed.data.question,
        answer: parsed.data.answer,
        collectionId: req.query.id as string,
      },
    });

    res.json({ data: item });
  });

export default handle();
