"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react"; // Add ArrowLeft import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

const characters = [
  "Viola",
  "Orsino",
  "Olivia",
  "Sebastian",
  "Malvolio",
  "Sir Toby Belch",
  "Maria",
  "Feste",
  "Sir Andrew Aguecheek",
  "Fabian",
  "Antonio",
  "Curio",
];

export default function TwelfthNightChat() {
  const [userCharacter, setUserCharacter] = useState("");
  const [aiCharacter, setAiCharacter] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const scrollAreaRef = useRef(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: { aiCharacter, userCharacter },
    });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const startChat = () => {
    if (userCharacter && aiCharacter && userCharacter !== aiCharacter) {
      setChatStarted(true);
    }
  };

  if (!chatStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <Card className="w-[350px] bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">
              Twelfth Night Chat by Zayd Krunz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300">
                Select your character:
              </label>
              <Select
                onValueChange={(value) => {
                  setUserCharacter(value);
                  if (value === aiCharacter) {
                    setAiCharacter("");
                  }
                }}
              >
                <SelectTrigger className="bg-zinc-700 text-white border-zinc-600">
                  <SelectValue placeholder="Choose a character" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                  {characters.map((char) => (
                    <SelectItem key={char} value={char}>
                      {char}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300">
                Select a character to chat with:
              </label>
              <Select onValueChange={setAiCharacter}>
                <SelectTrigger className="bg-zinc-700 text-white border-zinc-600">
                  <SelectValue placeholder="Choose a character" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                  {characters
                    .filter((char) => char !== userCharacter)
                    .map((char) => (
                      <SelectItem key={char} value={char}>
                        {char}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={startChat}
              disabled={
                !userCharacter || !aiCharacter || userCharacter === aiCharacter
              }
              className="bg-purple-600 hover:bg-purple-700 transform transition-transform active:translate-y-1 shadow-lg active:shadow-md"
            >
              Start Chat
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 p-4">
      <Card className="w-[600px] bg-zinc-800 border-zinc-700">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Button
            onClick={() => setChatStarted(false)}
            className="bg-zinc-700 hover:bg-zinc-600 transform transition-transform active:translate-y-1 shadow-lg active:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <CardTitle className="text-white text-xl">
            Twelfth Night Chat by Zayd Krunz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea ref={scrollAreaRef} className="h-[500px] pr-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`${m.role === "user" ? "text-right" : "text-left"} mb-1`}
                >
                  <span className="text-sm text-zinc-400">
                    {m.role === "user" ? userCharacter : aiCharacter}
                  </span>
                </div>
                <span
                  className={`inline-block p-2 rounded-lg ${
                    m.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-700 text-white"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 text-left">
                <span className="inline-block p-2 rounded-lg bg-zinc-700">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </span>
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={`${userCharacter}, say something...`}
              disabled={isLoading}
              className="bg-zinc-700 text-white border-zinc-600"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 transform transition-transform active:translate-y-1 shadow-lg active:shadow-md"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
