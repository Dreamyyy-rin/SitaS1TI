import React, { createContext, useContext, useState } from "react";

const TTUContext = createContext();

export const useTTU = () => {
  const context = useContext(TTUContext);
  if (!context) {
    throw new Error("useTTU must be used within TTUProvider");
  }
  return context;
};

export const TTUProvider = ({ children }) => {

  const [currentStage, setCurrentStage] = useState(1);


  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: "lecturer",
      type: "text",
      content: "Selamat datang! Silakan upload draf TTU Anda untuk tahap 1.",
      timestamp: new Date("2026-02-01T10:00:00"),
    },
    {
      id: 2,
      sender: "student",
      type: "text",
      content: "Terima kasih, Pak. Saya akan segera upload.",
      timestamp: new Date("2026-02-01T10:15:00"),
    },
  ]);

  // Currently submitted file for current stage
  const [submittedFile, setSubmittedFile] = useState(null);

  // Add message to chat history
  const addMessage = (message) => {
    const newMessage = {
      id: chatHistory.length + 1,
      timestamp: new Date(),
      ...message,
    };
    setChatHistory((prev) => [...prev, newMessage]);
    return newMessage;
  };

  // Submit file (adds to chat and marks as submitted)
  const submitFile = (file) => {
    setSubmittedFile(file);
    addMessage({
      sender: "student",
      type: "file",
      content: file.name,
      fileData: file,
    });
  };

  // Cancel submission
  const cancelSubmission = () => {
    setSubmittedFile(null);
  };

  // Move to next stage
  const nextStage = () => {
    if (currentStage < 3) {
      setCurrentStage(currentStage + 1);
      setSubmittedFile(null);
    }
  };

  const value = {
    currentStage,
    setCurrentStage,
    chatHistory,
    setChatHistory,
    submittedFile,
    setSubmittedFile,
    addMessage,
    submitFile,
    cancelSubmission,
    nextStage,
  };

  return <TTUContext.Provider value={value}>{children}</TTUContext.Provider>;
};
