# User Management (React)

Aplikasi manajemen pengguna dengan React, React Router, dan Vite. Awalnya tugas Praktikum Pemrograman Web Semester 5, lalu dikembangkan menjadi aplikasi yang bisa dipakai penuh.

**Demo live:** https://user-management-naufal.vercel.app  
Akun demo: `admin@demo.com` / `admin123`

## Fitur

- Registrasi dengan validasi (nama, format email, email unik, panjang password, konfirmasi password, persetujuan syarat)
- Login dengan pesan error yang jelas, tombol lihat/sembunyikan password, dan sesi yang tersimpan
- Dashboard: statistik pengguna, pencarian, filter peran, tambah/edit/hapus pengguna lewat modal
- Hak akses: hanya Admin yang bisa mengubah data; akun sendiri tidak bisa dihapus atau diturunkan perannya
- Rute terlindungi (`/dashboard`), redirect otomatis dari `/`, dan halaman 404
- Responsif untuk HP

Data disimpan di `localStorage` browser (tanpa backend), jadi setiap pengunjung punya data demo sendiri.

## Menjalankan

```bash
npm install
npm run dev
```
