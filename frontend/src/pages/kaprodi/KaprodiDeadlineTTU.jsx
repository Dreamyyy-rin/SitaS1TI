import React, { useState, useEffect } from "react";
import { Save, Calendar, FileText, CheckCircle2 } from "lucide-react";
import DeadlineCard from "../../components/kaprodi/DeadlineCard";
import DeadlineSummaryTable from "../../components/kaprodi/DeadlineSummaryTable";
import SuccessToast from "../../components/shared/SuccessToast";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const KaprodiDeadlineTTU = () => {
  const [deadlines, setDeadlines] = useState({
    ttu1: { date: "" },
    ttu2: { date: "" },
    ttu3: { date: "" },
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("sita_token");
    if (!token) return;
    fetch(`${API}/api/kaprodi/deadlines`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.deadlines) {
          setDeadlines(res.data.deadlines);
        }
      })
      .catch(() => {});
  }, []);

  const ttuStages = [
    {
      key: "ttu1",
      title: "TTU 1",
      subtitle: "Ujian Proposal",
      description:
        "Tahap pengujian proposal penelitian mahasiswa. Mahasiswa akan mempresentasikan ide penelitian mereka.",
      color: "blue",
      icon: FileText,
    },
    {
      key: "ttu2",
      title: "TTU 2",
      subtitle: "Ujian Hasil",
      description:
        "Tahap pengujian kemajuan penelitian. Mahasiswa menunjukkan progress dan hasil sementara penelitian.",
      color: "purple",
      icon: Calendar,
    },
    {
      key: "ttu3",
      title: "TTU 3",
      subtitle: "Ujian Review",
      description:
        "Tahap akhir pengujian skripsi. Mahasiswa mempresentasikan hasil penelitian lengkap.",
      color: "green",
      icon: CheckCircle2,
    },
  ];

  const handleDateChange = (stage, value) => {
    setDeadlines((prev) => ({
      ...prev,
      [stage]: { ...prev[stage], date: value },
    }));
  };

  const handleDescriptionChange = (stage, value) => {
    setDeadlines((prev) => ({
      ...prev,
      [stage]: { ...prev[stage], description: value },
    }));
  };

  const isApproaching = (dateString) => {
    if (!dateString) return false;
    const deadline = new Date(dateString);
    const today = new Date();
    const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return daysUntil > 0 && daysUntil <= 30;
  };

  const isPassed = (dateString) => {
    if (!dateString) return false;
    const deadline = new Date(dateString);
    const today = new Date();
    return deadline < today;
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return null;
    const deadline = new Date(dateString);
    const today = new Date();
    const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return daysUntil;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("sita_token");
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/kaprodi/deadlines`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deadlines),
      });
      const data = await res.json();
      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(data.message || "Gagal menyimpan deadline");
      }
    } catch {
      alert("Gagal menghubungi server");
    } finally {
      setSaving(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        iconBg: "bg-blue-100",
        button: "bg-blue-600 hover:bg-blue-700",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        iconBg: "bg-purple-100",
        button: "bg-purple-600 hover:bg-purple-700",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        iconBg: "bg-green-100",
        button: "bg-green-600 hover:bg-green-700",
      },
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {ttuStages.map((stage) => {
            const colors = getColorClasses(stage.color);
            const deadline = deadlines[stage.key];
            const daysUntil = getDaysUntil(deadline.date);
            const isWarning = isApproaching(deadline.date);
            const isDanger = isPassed(deadline.date);

            return (
              <DeadlineCard
                key={stage.key}
                stage={stage}
                deadline={deadline}
                daysUntil={daysUntil}
                isWarning={isWarning}
                isDanger={isDanger}
                colors={colors}
                onDateChange={handleDateChange}
                formatDate={formatDate}
              />
            );
          })}
        </div>

        <DeadlineSummaryTable
          ttuStages={ttuStages}
          deadlines={deadlines}
          getDaysUntil={getDaysUntil}
          isApproaching={isApproaching}
          isPassed={isPassed}
          formatDate={formatDate}
          getColorClasses={getColorClasses}
        />

        <div className="sticky bottom-6 flex justify-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#0B2F7F] text-white rounded-2xl font-bold text-lg shadow-2xl hover:bg-blue-800 transition-all duration-200 disabled:opacity-50"
          >
            <Save className="w-6 h-6" />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        <SuccessToast show={showSuccess} />
      </div>
    </div>
  );
};

export default KaprodiDeadlineTTU;
