import { type DefaultResponse, createApiRouter } from '@/lib/api';
import { authenticated } from '@/lib/middlewares/authenticated';
import { prisma } from '@/lib/prisma';
import type { Collection } from '@prisma/client';
import { z } from 'zod';

const { router, handle } =
  createApiRouter<DefaultResponse<Collection[] | Collection>>();

export const collectionBodySchema = z.object({
  name: z.string().min(1).max(255),
});

router
  .use(authenticated)
  .get(async (req, res) => {
    if (!req.session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const collections = await prisma.collection.findMany({
      where: { userId: req.session.user.id },
    });

    res.json({ data: collections });
  })
  .post(async (req, res) => {
    if (!req.session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const parsed = collectionBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(422).json({ error: parsed.error.errors });
    }

    const collection = await prisma.collection.create({
      data: {
        name: parsed.data.name,
        userId: req.session.user.id,
      },
    });

    res.json({ data: collection });
  });

export default handle();
