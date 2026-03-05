import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, User } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * ReviewChat - Chat component for TTU3 review discussion
 * Used by mahasiswa, pembimbing, and reviewer
 *
 * @param {string} mahasiswaId - The mahasiswa ID (for dosen view)
 * @param {string} role - 'mahasiswa' | 'dosen'
 * @param {string} currentUserId - Current user's ID
 */
export default function ReviewChat({ mahasiswaId, role = "mahasiswa", currentUserId }) {
  const [comments, setComments] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);
  const pollRef = useRef(null);

  const token = localStorage.getItem("sita_token");

  const getEndpoint = () => {
    if (role === "mahasiswa") {
      return `${API}/api/mahasiswa/review-comments`;
    }
    return `${API}/api/dosen/mahasiswa/${mahasiswaId}/review-comments`;
  };

  const loadComments = async () => {
    try {
      const res = await fetch(getEndpoint(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json().catch(() => ({}));
      if (result.success) {
        setComments(result.data || []);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // Poll every 10 seconds for new comments
    pollRef.current = setInterval(loadComments, 10000);
    return () => clearInterval(pollRef.current);
  }, [mahasiswaId]);

  useEffect(() => {
    // Auto-scroll to bottom when new comments arrive
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const res = await fetch(getEndpoint(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage.trim() }),
      });
      const result = await res.json().catch(() => ({}));
      if (result.success) {
        setNewMessage("");
        await loadComments();
      } else {
        alert(result.error || "Gagal mengirim komentar");
      }
    } catch {
      alert("Gagal menghubungi server");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRoleBadge = (senderRole) => {
    switch (senderRole) {
      case "reviewer":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700">
            Reviewer
          </span>
        );
      case "pembimbing":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
            Pembimbing
          </span>
        );
      case "mahasiswa":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-700">
            Mahasiswa
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleColor = (senderRole) => {
    switch (senderRole) {
      case "reviewer":
        return "bg-purple-50 border-purple-200";
      case "pembimbing":
        return "bg-blue-50 border-blue-200";
      case "mahasiswa":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const isOwnMessage = (comment) => {
    return comment.sender_id === currentUserId;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#0B2F7F] to-[#1a4fc4] px-5 py-3 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold text-sm">Diskusi Review TTU 3</h3>
        <span className="text-white/60 text-xs ml-auto">
          {comments.length} pesan
        </span>
      </div>

      {/* Messages area */}
      <div className="h-80 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50/50">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            <div className="animate-spin w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full mr-2"></div>
            Memuat pesan...
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">Belum ada pesan</p>
            <p className="text-xs mt-1">Mulai diskusi tentang review TTU 3</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`flex ${isOwnMessage(comment) ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2.5 border ${
                  isOwnMessage(comment)
                    ? "bg-[#0B2F7F] text-white border-[#0B2F7F] rounded-br-sm"
                    : `${getRoleColor(comment.sender_role)} rounded-bl-sm`
                }`}
              >
                {!isOwnMessage(comment) && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${isOwnMessage(comment) ? "text-white/80" : "text-slate-700"}`}>
                      {comment.sender_name}
                    </span>
                    {getRoleBadge(comment.sender_role)}
                  </div>
                )}
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isOwnMessage(comment) ? "text-white" : "text-slate-700"}`}>
                  {comment.message}
                </p>
                <p className={`text-[10px] mt-1 ${isOwnMessage(comment) ? "text-white/50" : "text-slate-400"}`}>
                  {new Date(comment.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 px-4 py-3 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pesan..."
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2F7F]/30 focus:border-[#0B2F7F] transition-all"
            style={{ maxHeight: "100px" }}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="flex items-center justify-center w-10 h-10 bg-[#0B2F7F] text-white rounded-xl hover:bg-[#0a2666] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {sending ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 px-1">
          Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}
