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
    });

    if (!collection) {
      return res.status(404).json({ error: 'Not found' });
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

    const parsed = collectionBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(422).json({ error: parsed.error.errors });
    }

    const collection = await prisma.collection.update({
      data: omitBy(
        {
          name: parsed.data.name,
          document: parsed.data.document,
        },
        isNil,
      ),
      where: {
        id: req.query.id as string,
      },
    });

    res.json({ data: collection });
  })
  .delete(async (req, res) => {
    if (!req.session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.query.id) {
      return res.status(400).json({ error: 'Bad request' });
    }

    await prisma.collection.delete({
      where: {
        id: req.query.id as string,
      },
    });

    res.json({ message: 'Deleted' });
  });

export default handle();
