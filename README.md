# Siap TKA SD — frontend (GitHub Pages)

Versi aplikasi: 1.6.2-t6.2

Berkas-berkas ini adalah **frontend statis** Siap TKA SD. Backend-nya (Google Apps Script) dikirim terpisah dan **tidak** ada di repository ini.

## Isi

| Berkas | Fungsi |
|---|---|
| `index.html` | Halaman utama (satu halaman, semua menu berpindah tanpa muat ulang) |
| `css/style.css` | Tampilan |
| `js/app.js` | Logika aplikasi |
| `js/config.js` | **Satu-satunya berkas yang perlu Anda ubah**: isi `GAS_URL` dengan alamat web app Apps Script (berakhiran `/exec`) |
| `favicon.svg` | Ikon tab |
| `.nojekyll` | Memberi tahu GitHub Pages agar berkas disajikan apa adanya |
| `PANDUAN-INSTALASI.md` | Panduan langkah demi langkah memasang di GitHub Pages |

## Pemasangan singkat

1. Isi `GAS_URL` di `js/config.js` **sebelum** unggah pertama.
2. Dari folder ini (tempat `index.html` terlihat): `git init`, `git add .`, `git commit`, `git push` ke repository publik.
3. GitHub: Settings → Pages → Deploy from branch → `main` / `(root)`, centang Enforce HTTPS.

Panduan lengkap ada di `PANDUAN-INSTALASI.md`.

## Catatan

- Alamat `/exec` bukan rahasia (sama seperti alamat situs). Kata sandi dan token sesi tidak pernah ada di berkas mana pun di repository ini.
- Situs memakai `username.github.io`, sehingga penyimpanan peramban (localStorage/sessionStorage) dipakai bersama dengan situs GitHub Pages lain milik akun yang sama.
