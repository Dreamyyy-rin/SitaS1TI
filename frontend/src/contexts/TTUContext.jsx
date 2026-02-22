import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const TTUContext = createContext();

export const useTTU = () => {
  const context = useContext(TTUContext);
  if (!context) {
    throw new Error("useTTU must be used within TTUProvider");
  }
  return context;
};

export const TTUProvider = ({ children }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const [currentStage, setCurrentStage] = useState(1);
  const [ttuStatus, setTtuStatus] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submittedFile, setSubmittedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const getToken = () => localStorage.getItem("sita_token");

  // Load profile to get ttu_status and compute current stage
  const loadTTUStatus = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const [profileRes, subsRes] = await Promise.all([
        fetch(`${baseUrl}/api/mahasiswa/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/mahasiswa/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const profileResult = await profileRes.json().catch(() => ({}));
      const subsResult = await subsRes.json().catch(() => ({}));

      if (profileResult.success && profileResult.data) {
        const ttu = profileResult.data.ttu_status || {};
        setTtuStatus(ttu);

        // Compute current stage
        if (ttu.ttu_3?.status === "approved") {
          setCurrentStage(3); // completed
        } else if (ttu.ttu_2?.status === "approved") {
          setCurrentStage(3);
        } else if (ttu.ttu_1?.status === "approved") {
          setCurrentStage(2);
        } else {
          setCurrentStage(1);
        }

        // Check if there's already a submitted file for current stage
        const stageKey = `ttu_${ttu.ttu_2?.status === "approved" ? 3 : ttu.ttu_1?.status === "approved" ? 2 : 1}`;
        const stageStatus = ttu[stageKey]?.status;
        if (stageStatus === "submitted" || stageStatus === "reviewed") {
          // Find the submission for this stage
          const stageSub = (subsResult.data || []).find(s => s.ttu_number === stageKey);
          if (stageSub) {
            setSubmittedFile({
              name: stageSub.file_name,
              size: stageSub.file_size,
              submission_id: stageSub._id,
              status: stageSub.status,
            });
          }
        } else {
          setSubmittedFile(null);
        }
      }

      if (subsResult.success) {
        setSubmissions(subsResult.data || []);
      }
    } catch (err) {
      console.error("Failed to load TTU status:", err);
    }
  }, [baseUrl]);

  useEffect(() => {
    loadTTUStatus();
  }, [loadTTUStatus]);

  // Upload file to real backend API
  const submitFile = async (fileData) => {
    const ttuNumber = `ttu_${currentStage}`;
    const token = getToken();
    if (!token || !fileData?.file) return;

    try {
      setIsUploading(true);
      setUploadError("");
      const formData = new FormData();
      formData.append("file", fileData.file);

      const response = await fetch(`${baseUrl}/api/mahasiswa/upload/${ttuNumber}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.error || "Gagal mengupload file");
      }

      setSubmittedFile({
        name: fileData.name,
        size: fileData.size,
        submission_id: result.data?.submission_id,
        status: "submitted",
      });

      // Reload TTU status
      await loadTTUStatus();
      return true;
    } catch (err) {
      setUploadError(err.message || "Gagal mengupload file");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const cancelSubmission = () => {
    setSubmittedFile(null);
  };

  const nextStage = () => {
    if (currentStage < 3) {
      setCurrentStage(currentStage + 1);
      setSubmittedFile(null);
    }
  };

  const value = {
    currentStage,
    setCurrentStage,
    ttuStatus,
    submissions,
    submittedFile,
    setSubmittedFile,
    submitFile,
    cancelSubmission,
    nextStage,
    isUploading,
    uploadError,
    loadTTUStatus,
  };

  return <TTUContext.Provider value={value}>{children}</TTUContext.Provider>;
};
