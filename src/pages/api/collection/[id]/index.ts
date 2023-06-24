import { type DefaultResponse, createApiRouter } from '@/lib/api';
import { authenticated } from '@/lib/middlewares/authenticated';
import { prisma } from '@/lib/prisma';
import type { Collection } from '@prisma/client';
import { isNil, omitBy } from 'lodash-es';
import { z } from 'zod';

const { router, handle } = createApiRouter<DefaultResponse<Collection>>();

export const collectionBodySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  document: z.record(z.any()).optional(),
  public: z.boolean().optional(),
});

router
  .use(authenticated)
  .get(async (req, res) => {
    if (!req.session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.query.id) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const collection = await prisma.collection.findFirst({
      where: { id: req.query.id as string },
      include: {
        items: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!collection) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (req.session.user.id !== collection.userId && !collection.public) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ data: collection });
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

    const parsed = collectionBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(422).json({ error: parsed.error.errors });
    }

    await prisma.collection.update({
      data: omitBy(parsed.data, isNil),
      where: {
        id: req.query.id as string,
      },
    });

    res.json({ message: 'Updated' });
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

    await prisma.collection.delete({
      where: {
        id: req.query.id as string,
      },
    });

    res.json({ message: 'Deleted' });
  });

export default handle();
