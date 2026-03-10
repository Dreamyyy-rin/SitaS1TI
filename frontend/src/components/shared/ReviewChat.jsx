import React, { useState, useEffect, useRef, useMemo } from "react";
import { Send, MessageCircle, User, FileText, Download } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/**
 * ReviewChat - Chat/comment component
 * @param {string} mahasiswaId - The mahasiswa ID (for dosen view)
 * @param {string} role - 'mahasiswa' | 'dosen'
 * @param {string} currentUserId - Current user's ID
 * @param {string} chatType - 'bimbingan' | 'review' (default: 'review')
 * @param {string} title - Custom header title
 */
export default function ReviewChat({
  mahasiswaId,
  role = "mahasiswa",
  currentUserId,
  chatType = "review",
  title,
  showFiles = false,
  mahasiswaInfo = null,
  pembimbingInfo = null,
  fullHeight = false,
}) {
  const [comments, setComments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const pollRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const token = localStorage.getItem("sita_token");

  const getEndpoint = (method = "GET") => {
    const param = `chat_type=${chatType}`;
    if (role === "mahasiswa") {
      return method === "GET"
        ? `${API}/api/mahasiswa/review-comments?${param}`
        : `${API}/api/mahasiswa/review-comments`;
    }
    return method === "GET"
      ? `${API}/api/dosen/mahasiswa/${mahasiswaId}/review-comments?${param}`
      : `${API}/api/dosen/mahasiswa/${mahasiswaId}/review-comments`;
  };

  const loadComments = async () => {
    try {
      const res = await fetch(getEndpoint("GET"), {
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

  const loadSubmissions = async () => {
    if (!showFiles) return;
    try {
      let url;
      if (role === "dosen" && mahasiswaId) {
        url = `${API}/api/dosen/mahasiswa/${mahasiswaId}/submissions`;
      } else if (role === "mahasiswa") {
        url = `${API}/api/mahasiswa/submissions`;
      } else {
        return;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json().catch(() => ({}));
      if (result.success) setSubmissions(result.data || []);
    } catch {}
  };

  // Merge chat messages + file submissions into one sorted timeline
  const timeline = useMemo(() => {
    const msgs = comments.map((c) => ({ ...c, _item_type: "message" }));
    const files = showFiles
      ? submissions
          .filter((s) => {
            if (chatType === "bimbingan") return s.ttu_number !== "ttu_3";
            if (chatType === "review") return s.ttu_number === "ttu_3";
            return true;
          })
          .map((s) => ({
            _id: `file-${s._id}`,
            _item_type: "file",
            file_id: s._id,
            file_name: s.file_name,
            ttu_number: s.ttu_number,
            status: s.status,
            sender_role: "mahasiswa",
            sender_name: "Mahasiswa",
            sender_id: "__file__",
            created_at: s.uploaded_at,
          }))
      : [];
    return [...msgs, ...files].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );
  }, [comments, submissions, showFiles, chatType]);

  // Scroll to bottom helper - only scroll chat container, not the page
  const scrollToBottom = (behavior = "smooth") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  };

  // Detect if user scrolled up
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setUserScrolledUp(!isAtBottom);
  };

  useEffect(() => {
    loadComments();
    loadSubmissions();
    // Poll every 10 seconds for new comments
    pollRef.current = setInterval(() => {
      loadComments();
      loadSubmissions();
    }, 10000);
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mahasiswaId, chatType]);

  // Auto-scroll when chat first opens
  useEffect(() => {
    if (!loading && timeline.length > 0) {
      scrollToBottom("auto");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, timeline]);

  // Scroll to bottom when new message arrives (only if not scrolled up)
  useEffect(() => {
    if (!userScrolledUp && timeline.length > 0) {
      scrollToBottom("smooth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline.length, userScrolledUp]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const res = await fetch(getEndpoint("POST"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          chat_type: chatType,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (result.success) {
        setNewMessage("");
        await loadComments();
        // Always scroll to bottom after sending
        setUserScrolledUp(false);
        setTimeout(() => scrollToBottom("smooth"), 100);
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

  const FILE_STATUS_LABEL = {
    approved: "Disetujui",
    reviewed: "Ditinjau",
    rejected: "Ditolak",
    submitted: "Diajukan",
  };
  const FILE_STATUS_COLOR = {
    approved: "text-green-600",
    reviewed: "text-blue-600",
    rejected: "text-red-500",
    submitted: "text-yellow-600",
  };

  const getRoleBadge = (senderRole) => {
    switch (senderRole) {
      case "reviewer":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700">
            Peninjau
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
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${fullHeight ? "flex flex-col h-[calc(100vh-280px)]" : ""}`}
    >
      <div className="bg-gradient-to-r from-[#0B2F7F] to-[#1a4fc4] px-5 py-3">
        {pembimbingInfo ? (
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <MessageCircle className="w-4 h-4 text-white/80" />
                <span className="text-white font-bold text-sm">
                  {pembimbingInfo.nama}
                </span>
              </div>
              <p className="text-white/70 text-xs">
                {pembimbingInfo.nidn || pembimbingInfo.nip || "-"}
              </p>
            </div>
            <span className="text-white/60 text-xs flex-shrink-0 mt-1">
              {comments.length} pesan
            </span>
          </div>
        ) : mahasiswaInfo ? (
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <MessageCircle className="w-4 h-4 text-white/80" />
                <span className="text-white font-bold text-sm">
                  {mahasiswaInfo.nama}
                </span>
              </div>
              <p className="text-white/70 text-xs">{mahasiswaInfo.nim}</p>
              {mahasiswaInfo.judul && mahasiswaInfo.judul !== "-" && (
                <p className="text-white/60 text-xs mt-0.5 line-clamp-1">
                  {mahasiswaInfo.judul}
                </p>
              )}
            </div>
            <span className="text-white/60 text-xs flex-shrink-0 mt-1">
              {comments.length} pesan
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold text-sm">
              {title ||
                (chatType === "bimbingan"
                  ? "Kolom Pesan Bimbingan"
                  : "Komentar TTU 3")}
            </h3>
            <span className="text-white/60 text-xs ml-auto">
              {comments.length} pesan
            </span>
          </div>
        )}
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`overflow-y-auto px-4 py-3 space-y-3 bg-slate-50/50 ${fullHeight ? "flex-1" : "h-80"}`}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            <div className="animate-spin w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full mr-2"></div>
            Memuat pesan...
          </div>
        ) : timeline.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">Belum ada pesan</p>
            <p className="text-xs mt-1">
              Mulai diskusi tentang tugas talenta unggul anda.
            </p>
          </div>
        ) : (
          timeline.map((item) => {
            if (item._item_type === "file") {
              // WhatsApp-style file bubble (always from mahasiswa = incoming/left)
              return (
                <div key={item._id} className="flex justify-start">
                  <div className="max-w-[80%] rounded-xl rounded-bl-sm px-3 py-2.5 border bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-700">
                        {item.sender_name}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-700">
                        Mahasiswa
                      </span>
                    </div>
                    <a
                      href={`${API}/api/${role}/submissions/${item.file_id}/download?token=${token}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 bg-white rounded-lg p-2.5 border border-emerald-200 hover:bg-emerald-50 transition-colors group"
                    >
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {item.file_name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase">
                          {item.ttu_number?.replace("_", " ")}
                          {item.status && (
                            <span
                              className={`ml-1 ${FILE_STATUS_COLOR[item.status] || "text-slate-500"}`}
                            >
                              · {FILE_STATUS_LABEL[item.status] || item.status}
                            </span>
                          )}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    </a>
                    <p className="text-[10px] mt-1 text-slate-400">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            }

            // Regular text message
            const own = isOwnMessage(item);
            return (
              <div
                key={item._id}
                className={`flex ${own ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 border ${
                    own
                      ? "bg-[#0B2F7F] text-white border-[#0B2F7F] rounded-br-sm"
                      : `${getRoleColor(item.sender_role)} rounded-bl-sm`
                  }`}
                >
                  {!own && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700">
                        {item.sender_name}
                      </span>
                      {getRoleBadge(item.sender_role)}
                    </div>
                  )}
                  <p
                    className={`text-sm leading-relaxed whitespace-pre-wrap ${own ? "text-white" : "text-slate-700"}`}
                  >
                    {item.message}
                  </p>
                  <p
                    className={`text-[10px] mt-1 ${own ? "text-white/50" : "text-slate-400"}`}
                  >
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
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
