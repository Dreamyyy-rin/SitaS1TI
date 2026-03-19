import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default function ReviewChat({
  mahasiswaId,
  role = "mahasiswa",
  currentUserId,
  disableAutoScroll = false,
  title = "Diskusi Bimbingan",
}) {
  const [comments, setComments] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  
  
  const scrollContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const pollRef = useRef(null);
  const lastCountRef = useRef(0);
  const didInitialScroll = useRef(false);

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
    didInitialScroll.current = false;
    pollRef.current = setInterval(loadComments, 10000);
    return () => clearInterval(pollRef.current);
  }, [mahasiswaId]);

 
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

   
    if (comments.length > 0) {
      const isNewMessage = comments.length > lastCountRef.current;
      
      if (!didInitialScroll.current || (isNewMessage && !disableAutoScroll)) {
        
        setTimeout(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: didInitialScroll.current ? "smooth" : "auto",
          });
        }, 100);

        if (!didInitialScroll.current) didInitialScroll.current = true;
      }
    }
    lastCountRef.current = comments.length;
  }, [comments, disableAutoScroll]);

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
      }
    } catch {
      console.error("Gagal menghubungi server");
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
    const badges = {
      reviewer: "bg-purple-100 text-purple-700",
      pembimbing: "bg-blue-100 text-blue-700",
      mahasiswa: "bg-green-100 text-green-700",
    };
    const label = { reviewer: "Peninjau", pembimbing: "Pembimbing", mahasiswa: "Mahasiswa" };
    return senderRole in badges ? (
      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${badges[senderRole]}`}>
        {label[senderRole]}
      </span>
    ) : null;
  };

  const getRoleColor = (senderRole) => {
    const colors = {
      reviewer: "bg-purple-50 border-purple-200",
      pembimbing: "bg-blue-50 border-blue-200",
      mahasiswa: "bg-green-50 border-green-200",
    };
    return colors[senderRole] || "bg-gray-50 border-gray-200";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col w-full">
      <div className="bg-gradient-to-r from-[#0B2F7F] to-[#1a4fc4] px-5 py-3 flex items-center gap-2 flex-shrink-0">
        <MessageCircle className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        <span className="text-white/60 text-xs ml-auto">{comments.length} pesan</span>
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-y-auto px-4 py-3 space-y-3 bg-slate-50/50"
        style={{ height: "384px" }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            <div className="animate-spin w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full mr-2"></div>
            Memuat pesan...
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">Belum ada pesan</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isOwn = comment.sender_id === currentUserId;
            return (
              <div key={comment._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-4 py-2.5 border ${
                  isOwn ? "bg-[#0B2F7F] text-white border-[#0B2F7F] rounded-br-sm" 
                  : `${getRoleColor(comment.sender_role)} rounded-bl-sm`
                }`}>
                  {!isOwn && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700">{comment.sender_name}</span>
                      {getRoleBadge(comment.sender_role)}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.message}</p>
                  <p className={`text-[10px] mt-1 ${isOwn ? "text-white/50" : "text-slate-400"}`}>
                    {new Date(comment.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-slate-200 px-4 py-3 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pesan..."
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2F7F]/30"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="flex items-center justify-center w-10 h-10 bg-[#0B2F7F] text-white rounded-xl hover:bg-[#0a2666] disabled:bg-slate-300 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}