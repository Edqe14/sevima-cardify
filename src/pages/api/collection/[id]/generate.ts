import { type DefaultResponse, createApiRouter } from '@/lib/api';
import { authenticated } from '@/lib/middlewares/authenticated';
import { prisma } from '@/lib/prisma';
import type { Collection } from '@prisma/client';
import { Schema } from '@tiptap/pm/model';
import { Transform } from '@tiptap/pm/transform';

const { router, handle } = createApiRouter<DefaultResponse<Collection>>();

router.use(authenticated).post(async (req, res) => {
  if (!req.session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.query.id) {
    return res.status(400).json({ error: 'Bad request' });
  }

  if (!req.query.confirm) {
    return res.status(400).json({
      message:
        'This action is destructive, please provide "confirm" parameter to continue',
    });
  }

  const collection = await prisma.collection.findFirst({
    where: { id: req.query.id as string },
    select: {
      userId: true,
      document: true,
    },
  });

  if (!collection) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.session.user.id !== collection.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const content = collection.document;

  if (!content) {
    return res.status(422).json({ error: 'No document' });
  }

  const transform = new Schema(content);

  console.log(transform);

  res.json({ data: collection });
});

export default handle();
