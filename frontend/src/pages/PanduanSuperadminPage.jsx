import React from "react";
import { BookOpen, UserCheck, Users, AlertCircle, Shield } from "lucide-react";

const PanduanSuperadminPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-600" />
          Panduan Superadmin
        </h1>
        <p className="text-gray-600 mt-1">
          Panduan lengkap penggunaan sistem manajemen SITA S1 TI
        </p>
      </div>

      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-blue-900 mb-2">
              Selamat Datang, Superadmin!
            </h2>
            <p className="text-blue-800 text-sm leading-relaxed">
              Sebagai superadmin, Anda memiliki akses penuh untuk mengelola
              seluruh data pengguna dalam sistem SITA S1 TI. Silakan gunakan
              panduan berikut untuk memaksimalkan penggunaan sistem.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Dashboard
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            Dashboard adalah halaman utama yang menampilkan ringkasan statistik
            sistem:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Total Dosen:</strong> Jumlah keseluruhan dosen yang
              terdaftar
            </li>
            <li>
              <strong>Total Mahasiswa:</strong> Jumlah keseluruhan mahasiswa
              yang terdaftar
            </li>
            <li>
              <strong>User Aktif:</strong> Jumlah pengguna dengan status aktif
            </li>
          </ul>
          <p className="mt-3">
            Anda juga dapat mengakses menu manajemen secara cepat melalui tombol
            "Kelola Dosen" dan "Kelola Mahasiswa" di dashboard.
          </p>
        </div>
      </div>

      {/* Manajemen Dosen Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-600" />
          Manajemen Dosen
        </h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              1. Menambah Dosen Baru
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Klik tombol "Tambah Dosen" di pojok kanan atas</li>
              <li>Isi formulir dengan data lengkap dosen</li>
              <li>Pastikan NIP diisi dengan benar</li>
              <li>Tentukan status (Aktif/Nonaktif)</li>
              <li>Masukkan password untuk akun dosen</li>
              <li>Klik "Simpan" untuk menyimpan data</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              2. Edit Data Dosen
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Gunakan kolom pencarian untuk menemukan dosen</li>
              <li>Klik tombol "Edit" pada baris dosen yang ingin diubah</li>
              <li>Ubah data yang diperlukan</li>
              <li>
                Untuk mereset password: isi kolom "Password Baru". Kosongkan
                jika tidak ingin mengubah password
              </li>
              <li>Klik "Simpan" untuk menyimpan perubahan</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              3. Hapus Data Dosen
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Klik tombol "Hapus" pada baris dosen yang ingin dihapus</li>
              <li>Pilih jenis penghapusan:</li>
              <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                <li>
                  <strong>Soft Delete:</strong> Nonaktifkan dosen (data tetap
                  ada, dapat diaktifkan kembali)
                </li>
                <li>
                  <strong>Hard Delete:</strong> Hapus permanen (data terhapus
                  selamanya)
                </li>
              </ul>
              <li>Konfirmasi penghapusan</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              4. Pencarian Dosen
            </h4>
            <p>
              Gunakan kolom pencarian untuk mencari dosen berdasarkan{" "}
              <strong>nama</strong> atau <strong>NIP</strong>. Hasil pencarian
              akan ditampilkan secara real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Manajemen Mahasiswa Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          Manajemen Mahasiswa
        </h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              1. Menambah Mahasiswa Baru
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Klik tombol "Tambah Mahasiswa" di pojok kanan atas</li>
              <li>Isi formulir dengan data lengkap mahasiswa</li>
              <li>Pastikan NIM diisi dengan benar</li>
              <li>Pilih Program Studi</li>
              <li>Tentukan status (Aktif/Nonaktif)</li>
              <li>Masukkan password untuk akun mahasiswa</li>
              <li>Klik "Simpan" untuk menyimpan data</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              2. Edit Data Mahasiswa
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Gunakan kolom pencarian untuk menemukan mahasiswa</li>
              <li>Klik tombol "Edit" pada baris mahasiswa yang ingin diubah</li>
              <li>Ubah data yang diperlukan</li>
              <li>
                Untuk mereset password: isi kolom "Password Baru". Kosongkan
                jika tidak ingin mengubah password
              </li>
              <li>Klik "Simpan" untuk menyimpan perubahan</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              3. Hapus Data Mahasiswa
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Klik tombol "Hapus" pada baris mahasiswa yang ingin dihapus
              </li>
              <li>Pilih jenis penghapusan:</li>
              <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                <li>
                  <strong>Soft Delete:</strong> Nonaktifkan mahasiswa (data
                  tetap ada)
                </li>
                <li>
                  <strong>Hard Delete:</strong> Hapus permanen (data terhapus
                  selamanya)
                </li>
              </ul>
              <li>Konfirmasi penghapusan</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              4. Pencarian Mahasiswa
            </h4>
            <p>
              Gunakan kolom pencarian untuk mencari mahasiswa berdasarkan{" "}
              <strong>nama</strong>, <strong>NIM</strong>, atau{" "}
              <strong>Program Studi</strong>. Hasil pencarian akan ditampilkan
              secara real-time.
            </p>
          </div>
        </div>
      </div>

     
      <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
              Tips & Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>
                ✓ Gunakan <strong>Soft Delete</strong> untuk penghapusan
                sementara, sehingga data dapat dipulihkan jika diperlukan
              </li>
              <li>
                ✓ Pastikan password yang dibuat aman dan mudah diingat oleh
                pengguna
              </li>
              <li>
                ✓ Verifikasi data sebelum menyimpan untuk menghindari kesalahan
              </li>
              <li>
                ✓ Gunakan fitur pencarian untuk menemukan data dengan cepat
              </li>
              <li>
                ✓ Perhatikan status pengguna (Aktif/Nonaktif) saat mengelola
                akun
              </li>
              <li>
                ✓ Lakukan backup data secara berkala untuk keamanan sistem
              </li>
            </ul>
          </div>
        </div>
      </div>

      
     
    </div>
  );
};

export default PanduanSuperadminPage;
