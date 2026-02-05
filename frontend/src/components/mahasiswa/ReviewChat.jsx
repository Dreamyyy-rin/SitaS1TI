import React, { useState, useRef, useEffect } from "react";
import { Send, FileText, Download, User, GraduationCap } from "lucide-react";
import { useTTU } from "../../contexts/TTUContext";

const ReviewChat = ({ student }) => {
  const { chatHistory, addMessage, currentStage } = useTTU();
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addMessage({
        sender: "student",
        type: "text",
        content: newMessage.trim(),
      });
      setNewMessage("");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeStr = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (date.toDateString() === today.toDateString()) {
      return `Hari ini, ${timeStr}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Kemarin, ${timeStr}`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDownloadFile = (message) => {
    alert(
      `Download: ${message.content}\n\nIn production, this would trigger a file download.`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Review & Bimbingan - TTU {currentStage}
            </h2>
            <p className="text-gray-600">
              Riwayat komunikasi dan review dokumen TTU dengan dosen pembimbing
            </p>
          </div>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm border border-blue-100">
            Tahap {currentStage} dari 3
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Dosen Pembimbing</p>
            <p className="text-base font-semibold text-gray-900">
              {student?.supervisor || "Belum ditetapkan"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[550px]">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
        >
          {chatHistory.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Belum ada riwayat chat</p>
                <p className="text-sm text-gray-400 mt-1">
                  Mulai percakapan dengan mengirim pesan
                </p>
              </div>
            </div>
          ) : (
            chatHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "student" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[75%] ${
                    message.sender === "student"
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.sender === "student"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {message.sender === "student" ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <GraduationCap className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === "student"
                          ? "bg-blue-600 text-white rounded-tr-sm"
                          : "bg-white text-gray-900 rounded-tl-sm shadow-sm border border-gray-100"
                      }`}
                    >
                      {message.type === "text" ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <div
                            className={`flex items-center gap-3 p-3 rounded-lg ${
                              message.sender === "student"
                                ? "bg-blue-700/50"
                                : "bg-gray-50"
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                message.sender === "student"
                                  ? "bg-white/20"
                                  : "bg-blue-100"
                              }`}
                            >
                              <FileText
                                className={`w-5 h-5 ${
                                  message.sender === "student"
                                    ? "text-white"
                                    : "text-blue-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${
                                  message.sender === "student"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {message.content}
                              </p>
                              {message.fileData && (
                                <p
                                  className={`text-xs ${
                                    message.sender === "student"
                                      ? "text-blue-100"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {formatFileSize(message.fileData.size)}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownloadFile(message)}
                            className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-colors ${
                              message.sender === "student"
                                ? "bg-white/10 hover:bg-white/20 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-xs text-gray-500 mt-1.5 px-1 ${
                        message.sender === "student"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan Anda..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                newMessage.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
              Kirim
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 px-1">
            Tekan Enter untuk mengirim pesan
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewChat;
