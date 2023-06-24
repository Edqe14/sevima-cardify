import { type DefaultResponse, createApiRouter } from '@/lib/api';
import { authenticated } from '@/lib/middlewares/authenticated';
import { prisma } from '@/lib/prisma';
import type { Item } from '@prisma/client';
import { isNil, omitBy } from 'lodash-es';
import { z } from 'zod';

const { router, handle } = createApiRouter<DefaultResponse<Item>>();

export const itemBodySchema = z.object({
  question: z.string().max(255).optional(),
  answer: z.string().max(1000).optional(),
});

router
  .use(authenticated)
  .get(async (req, res) => {
    if (!req.session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.query.id || !req.query.tId) {
      return res.status(400).json({ error: 'Bad request' });
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

    const item = await prisma.item.findFirst({
      where: { id: req.query.tId as string },
    });

    if (!item) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ data: item });
  })
  .put(async (req, res) => {
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

    const parsed = itemBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(422).json({ error: parsed.error.errors });
    }

    try {
      await prisma.item.update({
        data: omitBy(parsed.data, isNil),
        where: {
          id: req.query.tId as string,
        },
      });

      res.json({ message: 'Updated' });
    } catch {
      return res.status(404).json({ error: 'Not found' });
    }
  })
  .delete(async (req, res) => {
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

    try {
      await prisma.item.delete({
        where: {
          id: req.query.tId as string,
        },
      });

      res.json({ message: 'Deleted' });
    } catch {
      return res.status(404).json({ error: 'Not found' });
    }
  });

export default handle();
