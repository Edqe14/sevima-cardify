import { type DefaultResponse, createApiRouter } from '@/lib/api';
import { authenticated } from '@/lib/middlewares/authenticated';
import { prisma } from '@/lib/prisma';

import { Node } from '@tiptap/pm/model';
import { getSchema } from '@tiptap/core';
import { editorExtensions } from '@/components/TextEditor';
import { Configuration, OpenAIApi } from 'openai';
import { env } from '@/lib/env.mjs';
import { assistant, gen, gpt3, map, system, user } from 'salutejs';

const { router, handle } = createApiRouter<DefaultResponse<string>>();
const schema = getSchema([...editorExtensions]);
// const openai = new OpenAIApi(
//   new Configuration({
//     apiKey: env.OPENAI_KEY,
//   }),
// );

const agent = gpt3<{ text: string }>(({ params }) => [
  system`The user-provided content that need to be summarized and transformed to a "question? answer" format. The answers must be concise and short as possible.`,
  user`
    Here is my text:
    ---
    ${params.text}
    ---
  `,
  map(
    'items',
    new Array(10)
      .fill(0)
      .map(() => [
        assistant`${gen('answer', { maxTokens: 150, temperature: 0.7 })}`,
      ]),
  ),
]);

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

  const node = Node.fromJSON(schema, content);
  const text = node.textContent;

  const completion = await agent({
    text,
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const answer = completion.data.choices[0].message!.content!;
  console.log(completion);

  res.json({ data: completion });
});

export default handle();
