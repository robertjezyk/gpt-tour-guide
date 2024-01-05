"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  generateChateResponse,
  fetchUserTokensById,
  subtractTokens,
} from "@/utils/actions";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

export const Chat = () => {
  const { userId } = useAuth();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (userMessage) => {
      const memberTokens = await fetchUserTokensById(userId);
      if (memberTokens < 100) {
        toast.error("Token balance too low...");
        return;
      }
      const response = await generateChateResponse([...messages, userMessage]);
      if (!response) {
        toast.error("Something went wrong");
        return;
      }
      setMessages((prev) => [...prev, response.message]);
      const newTokens = await subtractTokens(userId, response.tokens);
      toast.success(`${newTokens} tokens remaining`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = { role: "user", content: text };
    mutate(query);
    setMessages((prev) => [...prev, query]);
    setText("");
  };

  return (
    <>
      <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
        <div>
          {messages.map(({ role, content }, index) => {
            const avatar = role == "user" ? "👤" : "🤖";
            const bcg = role == "user" ? "bg-base-200" : "bg-base-100";

            return (
              <div
                key={index}
                className={`${bcg} flex py-6 -mx-8 px-8 text-xl leading-loose border-b border-base-300`}
              >
                <span className="mr-4">{avatar}</span>
                <p className="max-w-3xl">{content}</p>
              </div>
            );
          })}
          {isPending ? <span className="loading" /> : null}
        </div>
        <form onSubmit={handleSubmit} className="max-w-4xl pt-12">
          <div className="join w-full">
            <input
              type="text"
              placeholder="Message Tour Guide"
              className="input input-bordered join-item w-full"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <button
              className="btn btn-primary join-item"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Please wait..." : "ask question"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
