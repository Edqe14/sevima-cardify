import { OpenAI } from "openai";
import { sleep } from "./sleep";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'asdada',
  baseURL: process.env.OPENAI_API_URL ?? 'https://api.openai.com/v1',
});

type GeneratedQA = {
  items: {
    question: string;
    answer: string;
  }[];
}

export const generateQA = async (text: string, tries = 0, max = 3): Promise<GeneratedQA | null> => {
  if (tries >= max) {
    return null;
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a question & answer bot generator and you will follow the correct output JSON template, and fill the provided "{{#}}" accordingly. Try to make the answers simple and short but still informative.'
      },
      {
        role: 'user',
        content: `
          The following is a text that needs to be summarized and formatted as question and answer pairs.
        
          Text: ${text}
        
          json
          {
            "items": [${new Array(10).fill(0).map(
              () => `{
                "question": "{{#}}",
                "answer": "{{#}}"
              }`
            ).join(',\n')}]
          }
        `
      }
    ]
  });

  const [output] = completion.choices;
  if (!output) {
    return null;
  }

  const cleaned = output.message?.content
    ?.replace(/```json\n/g, '')
    .replace(/```/g, '');
  if (!cleaned) return null;

  try {
    return JSON.parse(cleaned) as GeneratedQA;
  } catch {
    return null;
  }
}