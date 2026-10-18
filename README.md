# LHO Explorer

Media pembelajaran Teks Laporan Hasil Observasi (Bahasa Indonesia Kelas X).
Situs statis: tanpa backend, database, atau akun.

## Menjalankan
Buka `index.html` di browser, atau host folder ini di Vercel/Netlify/GitHub Pages.

## Mengganti link
Edit `js/data.js`: link video orientasi dan link tiga kartu latihan (`url`).
Materi ada di `index.html`. Gaya tema ada di `css/style.css`, `css/components.css`, dan
`css/playful-geometric.css` (sudah dipangkas, hanya aturan yang terpakai). Gaya khusus
halaman LHO ada di `css/lho.css`. Font (Kalam, Patrick Hand) disimpan lokal di `fonts/`,
jadi situs tetap tampil benar tanpa internet.

## Musik latar
Lagu ada di `assets/musik-latar.mp3` (128 kbps). Untuk mengganti, timpa file itu dengan lagu lain
bernama sama. Musik hanya main setelah tombol musik ditekan.

## Alamat bersih (/materi, /latihan, ...)
Pindah menu mengubah alamat jadi `/tujuan`, `/video`, `/materi`, `/contoh`, `/latihan` (Beranda = `/`).
Supaya muat ulang di alamat itu tidak 404, server harus mengarahkannya ke `index.html`:
- Vercel: sudah diatur di `vercel.json`. Framework Preset pilih **Other**, tanpa build command.
- Lokal: `npx serve .` otomatis membaca `serve.json`. Server lain (misalnya `python -m http.server`)
  tidak punya aturan itu, jadi muat ulang di `/materi` akan 404 (pindah menu tetap jalan).
- Dibuka langsung dari file (`file://`): alamat tidak berubah, semua tetap berfungsi.
Folder `materi/` (PPT dan QR asli) hanya untuk bahan sumber. Sudah masuk `.gitignore` dan `.vercelignore`.
