import React, { useEffect, useRef, useState } from "react";
import Upload from "./Upload";
import { IKImage } from "imagekitio-react";
import model from "../lib/gemini";
import Markdown from "react-markdown";

const NewPrompt = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const endRef = useRef(null);

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    generationConfig: {
      // maxOutputTokens: 1000,
    },
  });

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [question, answer, img.dbData]);

  const addMessage = async (text) => {
    setQuestion(text);
    setAnswer(""); // Clear the previous answer stored in the state
    try {
      let accumulatedText = "";
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );

      // Stream each chunk as it arrives
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        // Update the answer state progressively
        setAnswer((prev) => prev + chunkText);
      }

      // Optionally, finalize the img state if needed
      setImg({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
      });
    } catch (error) {
      setAnswer("Oops! Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;
    addMessage(text);
    e.target.text.value = "";
  };

  return (
    <>
      {img.isLoading && <div className="text-white">Loading image...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
          className="mx-auto my-4 rounded-lg"
        />
      )}
      {question && (
        <div className="message user animate-slideIn">{question}</div>
      )}

      {answer && (
        <div className="message ai animate-slideIn">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      <div className="endChat pb-24" ref={endRef}></div>
      <form
        className="newForm w-11/12 md:w-2/3 lg:w-1/2 mx-auto bottom-4 left-1/2 transform -translate-x-1/2 bg-[#2c2937] rounded-full flex items-center gap-4  px-2 shadow-lg absolute"
        onSubmit={handleSubmit}
      >
        <Upload setImg={setImg} />
        <input type="file" multiple={false} id="file" hidden />
        <input
          className="flex-1 p-3 border-none outline-none bg-transparent text-[#ececec] placeholder-gray-500"
          name="text"
          type="text"
          placeholder="Ask me anything..."
          autoComplete="off"
        />
        <button
          className="rounded-full bg-[#605e68] p-[10px] flex items-center justify-center cursor-pointer hover:bg-[#4f4c56] transition-all duration-200"
          type="submit"
        >
          <img src="/arrow.png" className="w-4 h-4" alt="Send" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
