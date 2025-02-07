import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, aiCharacter, userCharacter } = await req.json();

  console.log(aiCharacter, userCharacter);

  const characterPrompt = `You are ${aiCharacter} from Shakespeare's Twelfth Night engaged in a dialogue with ${userCharacter}. Your responses must be in full accordance with your character's established personality, motivations, and classic speech patterns as depicted in the play. For example, if you are Malvolio, unequivocally convey your deep and unyielding love for Olivia. For other example, If you are Viola, remember your disguise as Cesario, and allow this dual identity to inform your words. Let your language reflect the wit, elegance, and dramatic flair of Shakespeare's world.`;

  const fullMessages = [
    { role: "system", content: characterPrompt },
    ...messages,
  ];

  const response = streamText({
    model: openai("gpt-4o-mini"),
    messages: fullMessages,
  });

  return response.toDataStreamResponse();
}
