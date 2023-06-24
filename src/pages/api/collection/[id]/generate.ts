import { type DefaultResponse, createApiRouter } from '@/lib/api';
import { authenticated } from '@/lib/middlewares/authenticated';
import { prisma } from '@/lib/prisma';

import { Node } from '@tiptap/pm/model';
import { getSchema } from '@tiptap/core';
import { editorExtensions } from '@/components/TextEditor';
import { davinci } from 'salutejs';
import { createHash } from 'crypto';
import { kv } from '@vercel/kv';

const { router, handle } = createApiRouter<DefaultResponse<string>>();
const schema = getSchema([...editorExtensions]);

type Generated = { question: string[]; answer: string[] };
type GeneratedMapped = { question: string; answer: string }[];

const agent = davinci<{ text: string }, Generated>(
  ({ params, ai, gen }) => ai`
  The following is a text that needs to be summarized and formatted as question and answer pairs.

  Text: ${params.text}

  json
  {
    "items": [${new Array(10).fill(0).map(
      () => ai`{
      "question": "${gen('question', {
        maxTokens: 80,
        temperature: 0,
        topP: 1,
      })}",
      "answer": "${gen('answer', { maxTokens: 200 })}"
    },`,
    )}]
  }
`,
);

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
    const completion = await agent({
      text,
    });

    const mapped = completion.question.map((question, i) => ({
      question,
      answer: completion.answer[i],
    }));

    await kv.set(hash, mapped);
    await kv.expire(hash, 10 * 60);

    cached = mapped;
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
