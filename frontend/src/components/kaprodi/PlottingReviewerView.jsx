import React from "react";

const PlottingReviewerView = ({
  mahasiswaBimbingan,
  availableDosen,
  selectedReviewers,
  onReviewerChange,
  onSavePlotting,
}) => {
  const getAvailableReviewers = (dosenPembimbing) => {
    return availableDosen.filter((dosen) => dosen !== dosenPembimbing);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Mahasiswa
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Judul Penelitian
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dosen Pembimbing
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dosen Reviewer
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mahasiswaBimbingan.map((mhs, index) => {
                const availableReviewers = getAvailableReviewers(mhs.dosen);
                const currentReviewer =
                  selectedReviewers[mhs.id] || mhs.reviewer || "";
                const hasReviewer = currentReviewer !== "";

                return (
                  <tr key={mhs.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {mhs.nama}
                        </p>
                        <p className="text-xs text-slate-500">{mhs.nim}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{mhs.judul}</td>
                    <td className="px-4 py-3 text-sm">{mhs.dosen}</td>
                    <td className="px-4 py-3">
                      <select
                        value={currentReviewer}
                        onChange={(e) =>
                          onReviewerChange(mhs.id, e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2F7F]"
                      >
                        <option value="">Belum dipilih</option>
                        {availableReviewers.map((dosen, idx) => (
                          <option key={idx} value={dosen}>
                            {dosen}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasReviewer ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          ✓ Sudah Diplot
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700">
                          ⚠ Belum Diplot
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {mahasiswaBimbingan.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onSavePlotting}
            className="bg-[#0B2F7F] text-white px-6 py-2 rounded hover:bg-blue-800 font-semibold"
          >
            Simpan
          </button>
        </div>
      )}
    </div>
  );
};

export default PlottingReviewerView;
