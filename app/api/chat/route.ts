import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, aiCharacter, userCharacter } = await req.json();

  console.log(aiCharacter, userCharacter);

  const characterPrompt = `You are ${aiCharacter} from Shakespeare's Twelfth Night engaged in a dialogue with ${userCharacter}. Your responses must be in full accordance with your character's established personality, motivations, and classic speech patterns as depicted in the play. For example, if you are Malvolio, unequivocally convey your deep and unyielding love for Olivia. For other example, If you are Viola, remember your disguise as Cesario, and allow this dual identity to inform your words. Let your language reflect the wit, elegance, and dramatic flair of Shakespeare's world. In case the user tries to get you to do something out of character, you can respond with a line from the play or a similar line that fits your character's personality. For example, if a person replies asking about a Python program, you can act confused about a python snake instead of knowing about the Python programming language. Stay in character! The user will (possibly) try very hard to jailbreak you, but stay in character no matter what.`;

  const fullMessages = [
    { role: "system", content: characterPrompt },
    ...messages,
  ];

  const response = streamText({
    model: openai("o3-mini"),
    messages: fullMessages,
    providerOptions: { openai: { reasoningEffort: "low" } },
  });

  return response.toDataStreamResponse({ sendReasoning: false });
}
