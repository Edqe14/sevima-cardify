import { type DefaultResponse, createApiRouter } from '@/lib/api';
import { authenticated } from '@/lib/middlewares/authenticated';
import { prisma } from '@/lib/prisma';

import { Node } from '@tiptap/pm/model';
import { getSchema } from '@tiptap/core';
import { editorExtensions } from '@/components/TextEditor';
import { createHash } from 'crypto';
import { kv } from '@vercel/kv';
import { generateQA } from '@/lib/helpers/generateQA';

const { router, handle } = createApiRouter<DefaultResponse<string>>();
const schema = getSchema([...editorExtensions]);

type GeneratedMapped = { question: string; answer: string }[];

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
      id: true,
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

  const node = Node.fromJSON(schema, content);
  const text = node.textContent;

  const hash = createHash('sha256').update(text).digest('hex');
  let cached = await kv.get<GeneratedMapped>(hash);

  if (!cached) {
    try {
      const completion = await generateQA(text);

      if (!completion) {
        return res.status(422).json({ error: 'Failed to generate' });
      }

      await kv.set(hash, completion.items);
      await kv.expire(hash, 10 * 60);

      cached = completion.items;
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  await prisma.$transaction([
    prisma.item.deleteMany({
      where: { collectionId: collection.id },
    }),
    prisma.item.createMany({
      data: cached.map((item, i) => ({
        question: item.question,
        answer: item.answer,
        order: i,
        collectionId: collection.id,
      })),
      skipDuplicates: true,
    }),
  ]);

  res.json({ message: 'Generated' });
});

export default handle();
