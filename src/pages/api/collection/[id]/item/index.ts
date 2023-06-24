import { type DefaultResponse, createApiRouter } from '@/lib/api';
import { authenticated } from '@/lib/middlewares/authenticated';
import { prisma } from '@/lib/prisma';
import type { Item } from '@prisma/client';
import { z } from 'zod';

const { router, handle } = createApiRouter<DefaultResponse<Item[] | Item>>();

export const itemBodySchema = z.object({
  question: z.string().max(255).default(''),
  answer: z.string().max(1000).default(''),
});

router
  .use(authenticated)
  .get(async (req, res) => {
    if (!req.session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const collection = await prisma.collection.findFirst({
      where: { id: req.query.id as string },
    });

    if (!collection) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (req.session.user.id !== collection.userId && !collection.public) {
      return res.status(403).json({ error: 'Forbidden' });
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

    const collection = await prisma.collection.findFirst({
      where: { id: req.query.id as string },
    });

    if (!collection) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (req.session.user.id !== collection.userId && !collection.public) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const parsed = itemBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(422).json({ error: parsed.error.errors });
    }

    const count = await prisma.item.count({
      where: { collectionId: req.query.id as string },
    });

    const item = await prisma.item.create({
      data: {
        question: parsed.data.question,
        answer: parsed.data.answer,
        order: count - 1,
        collectionId: req.query.id as string,
      },
    });

    res.json({ data: item });
  });

export default handle();
