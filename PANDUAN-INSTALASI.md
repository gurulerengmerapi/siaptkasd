# Siap TKA SD T6.4 — Panduan memasang dan memperbarui: backend di Google Apps Script, tampilan di GitHub Pages

Versi aplikasi: `1.6.4-t6.4` (skema data 8, sama dengan T5 dan T6; **tidak ada migrasi data**).

> **Sudah memasang T6?** Lompat ke bagian **"Mulai di sini bila T6 sudah terpasang"** di bawah (langkah U1–U8). Bagian 0 dan A–H ditujukan untuk pemasangan pertama dari T5 dan tetap berlaku sebagai rujukan.

Panduan ini untuk Anda yang **belum pernah memakai Git/GitHub**. Anda tidak perlu paham istilahnya dulu; tiap istilah dijelaskan saat pertama muncul. Waktu kerja: bagian A ± 15 menit, bagian B ± 40 menit pertama kali (jauh lebih singkat untuk pembaruan berikutnya).

---

## Cara memakai panduan ini (baca 1 menit)

1. **Kotak abu-abu = salin seluruh isinya.** Bila ada tombol **Salin** di pojok kanan atas kotak, klik itu; bila tidak ada, blok seluruh teks di dalam kotak lalu Ctrl+C (Mac: Cmd+C). Tempel di tempat yang diminta lalu tekan **Enter**.
2. **Satu kotak, satu langkah.** Salin satu kotak, tempel, tunggu sampai selesai dan lihat hasilnya. Baru salin kotak berikutnya. Jangan menempel dua kotak sekaligus.
3. **Kotak berjudul "Harus muncul"** adalah *contoh* hasil yang benar. Jalur folder, angka, dan nama Anda akan berbeda; yang dicocokkan hanya intinya.
4. **Tanda ✋ GANTI** berarti ada tulisan huruf besar di dalam kotak yang harus Anda ganti dengan data Anda *sebelum* menempel. Jumlahnya hanya sedikit, dan semuanya dikumpulkan di tabel "Isian Anda" di bawah.
5. **Cara menempel di terminal:** Windows PowerShell: **klik kanan** (atau Ctrl+V). Mac Terminal: **Cmd+V**. Linux: Ctrl+Shift+V.
6. **Bila hasilnya tidak seperti "Harus muncul":** berhenti, ambil tangkapan layar (screenshot) seluruh jendela, kirimkan kepada saya. Jangan lanjut menebak. Tulisan merah di terminal tidak selalu berarti gagal; baca isinya.
7. **Windows atau Mac?** Bagian yang berbeda diberi tiga tanda: **[Windows]**, **[Mac / Linux]**, atau tanpa tanda bila sama untuk semuanya. Kerjakan hanya bagian milik komputer Anda.

> **Cara tercepat:** kirim ke saya `username GitHub`, `nama repo`, dan alamat `/exec` Anda. Saya tuliskan semua perintah yang butuh diganti sudah terisi, tinggal tempel.

> **Yang tidak bisa saya jamin dari sini.** Perintah di panduan ini untuk **Linux sudah saya jalankan** (urutan `unzip`, isi `config.js`, `git init` sampai `git push` ke repository tiruan di komputer saya). Perintah **Windows PowerShell dan Mac (zsh) belum saya jalankan** karena saya tidak punya komputer itu. Tampilan Google (Apps Script) dan GitHub juga bisa berbeda sedikit dari uraian di bawah; yang dicari adalah *maksud* tombolnya.

---

## Mulai di sini bila T6.3 (atau yang lebih lama) sudah terpasang: perbarui ke T6.4 (± 15 menit)

T6.4 hanya memperbaiki **gambar soal yang tidak tampil saat halaman mengerjakan soal pertama kali dibuka** (baru tampil setelah halaman di-refresh). Sekarang, bila ada gambar soal yang alamatnya belum diterima, aplikasi memuat ulang ujian sekali dari server (cara yang sama dengan refresh) lalu menggambar ulang soalnya, sehingga gambar langsung tampil tanpa Anda refresh. Jawaban yang sudah dipilih tidak terpengaruh. **Skema data tidak berubah dan tidak ada migrasi**; `appsscript.json` **tidak berubah**. Di `Kode.gs` hanya nomor versi yang berganti (langkah U2–U4 hanya menyamakan nomor versi; perbaikannya ada di situs, U5–U6). Perubahan T6.3 (beranda, banner, dan halaman soal) ikut terbawa di ZIP yang sama; bila Anda masih di T6.2 atau T6.1, langkah yang sama bekerja karena ZIP berisi seluruh situs.

**Catatan jujur:** penyebab pasti mengapa muatan pembuka tidak membawa alamat gambar belum saya temukan dari membaca kode (alur server dan klien sama di buka-pertama dan refresh). Perbaikan ini menutup gejalanya di klien dan terbukti di uji tiruan, tetapi belum dicoba di Google dan GitHub asli.

Kerjakan berurutan, satu langkah satu waktu. Alamat `/exec` Anda **tidak berubah**, jadi `js/config.js` tidak perlu diisi ulang (langkah U5 menjaganya).

### U1. Buat backup dulu
Masuk sebagai Admin Utama → **Backup & Pulihkan** → **Buat backup sekarang** → tunggu **Terverifikasi**. (Jaring pengaman saja; T6.4 tidak mengubah isi data.)

### U2. Ganti kode backend (`Kode.gs`)
1. Buka berkas `Kode.gs` yang baru dengan Notepad (Mac: TextEdit, teks polos). Jangan memakai Word.
2. Buka proyek Apps Script Anda di <https://script.google.com> → di daftar berkas klik **Kode**.
3. Klik di dalam kotak kode, **Ctrl+A**, **Delete**. Lalu di Notepad: **Ctrl+A**, **Ctrl+C**; kembali ke editor: **Ctrl+V**. (Berkasnya ± 600 KB; tunggu beberapa detik.)
4. **Periksa tempelan lengkap:** klik di dalam kode, tekan **Ctrl+End**. Nomor baris terakhir yang berisi tulisan harus **10.932** dan tulisannya `}`. Bila angkanya jauh lebih kecil, tempelan terpotong: ulangi langkah 3.
5. Tekan **Ctrl+S**.

### U3. Terapkan sebagai versi baru dari penerapan yang sama
1. **Terapkan** (Deploy) → **Kelola penerapan** (Manage deployments).
2. Klik ikon **pensil** pada penerapan Anda yang aktif.
3. Pada **Versi** (Version) pilih **Versi baru** (New version). Deskripsi boleh `T6.4`.
4. Klik **Terapkan** (Deploy).

URL `/exec` tetap sama. **Jalan mundur:** versi sebelumnya tetap tersimpan di riwayat; lihat U8.

### U4. Periksa backend langsung di peramban
Buka alamat `/exec` Anda (Isian 1). Yang benar, satu baris JSON yang memuat `"versi":"1.6.4-t6.4"`:
```text
{"success":true,"data":{"layanan":"Siap TKA SD","versi":"1.6.4-t6.4","api":true},"message":"OK"}
```
Bila `versi` masih `1.6.0-t6`, penerapan belum memakai versi baru: ulangi U3 dan pastikan Anda memilih **Versi baru**.

### U5. Perbarui situs (tampilan) tanpa mengubah `config.js`
Folder situs lama Anda (tempat dulu `git init`) adalah yang tersambung ke GitHub, jadi *ke folder itulah isi ZIP baru ditimpakan*. Empat langkah kecil, satu kotak satu waktu. Berkas `js/config.js` Anda disimpan dulu lalu dikembalikan, supaya alamat backend Anda tidak tertimpa tulisan contoh.

**[Windows]** (PowerShell)
```powershell
Copy-Item -Path "$HOME\siap-tka-sd-situs\js\config.js" -Destination "$HOME\config-simpanan.js" -Force
```
```powershell
Expand-Archive -Path "$HOME\Downloads\siap-tka-sd-situs-1.6.4-t6.4.zip" -DestinationPath "$HOME\siap-tka-sd-situs-baru" -Force
```
```powershell
Copy-Item -Path "$HOME\siap-tka-sd-situs-baru\*" -Destination "$HOME\siap-tka-sd-situs" -Recurse -Force
```
```powershell
Copy-Item -Path "$HOME\config-simpanan.js" -Destination "$HOME\siap-tka-sd-situs\js\config.js" -Force
```

**[Mac / Linux]** (Terminal)
```bash
cp ~/siap-tka-sd-situs/js/config.js ~/config-simpanan.js
```
```bash
mkdir -p ~/siap-tka-sd-situs-baru && unzip -q -o ~/Downloads/siap-tka-sd-situs-1.6.4-t6.4.zip -d ~/siap-tka-sd-situs-baru
```
```bash
cp -R ~/siap-tka-sd-situs-baru/. ~/siap-tka-sd-situs/
```
```bash
cp ~/config-simpanan.js ~/siap-tka-sd-situs/js/config.js
```

Bila folder situs Anda bernama lain atau ada di tempat lain, ganti jalur `siap-tka-sd-situs` di keempat kotak dengan jalur yang sama dengan yang Anda pakai saat memasang T6. Bila nama ZIP yang Anda unduh berbeda (mis. berakhiran `(1)`), ganti juga nama berkasnya.

Sekarang masuk ke folder situs dan periksa bahwa alamat Anda masih ada (bukan tulisan `ISI_DENGAN_ALAMAT_EXEC_APPS_SCRIPT`):

**[Windows]**
```powershell
cd "$HOME\siap-tka-sd-situs"
```
```powershell
Get-Content js\config.js
```
**[Mac / Linux]**
```bash
cd ~/siap-tka-sd-situs
```
```bash
cat js/config.js
```
Harus muncul **satu baris** berisi alamat `/exec` Anda yang asli:
```text
window.SIAP_CONFIG = { GAS_URL: 'https://script.google.com/macros/s/AKfycb…panjang…/exec' };
```
Bila yang muncul tulisan contoh, ulangi perintah di bagian B6 (ia menanyakan alamat `/exec` Anda dan menulisnya sendiri).

### U6. Kirim ke GitHub
Di folder situs yang sama, tiga perintah, satu per satu:
```bash
git add .
```
```bash
git commit -m "Pembaruan T6.4"
```
```bash
git push
```
GitHub Pages memperbarui dalam 1–2 menit (lihat tab **Actions** di repo sampai ✓ hijau). Buka situs lalu tekan **Ctrl+Shift+R** (Mac: **Cmd+Shift+R**). Bila `git push` meminta tanda pengenal dan token lama sudah kedaluwarsa, buat token baru seperti B8g.

### U7. Uji T6.4 (hanya perlu beberapa menit)
Hasil ini belum pernah dicoba di Google dan GitHub asli; kirimkan tangkapan layar bila ada yang tidak sesuai.

| No | Uji | Yang benar | Hasil Anda |
|---|---|---|---|
| 1 | Buka alamat `/exec` | `"versi":"1.6.4-t6.4"` | |
| 2 | Tekan **Ctrl+Shift+R** di situs, masuk sebagai siswa, buka paket yang soalnya bergambar (teks bacaan dan pilihan jawaban) lewat **Mulai** atau **Lanjutkan** | Gambar langsung tampil di halaman soal pertama kali, tanpa refresh. Bila sesaat tampil tulisan "[gambar]", ia berganti gambar dalam sekitar 1–3 detik | |
| 3 | Pindah beberapa soal bergambar, lalu buka **Daftar Soal** | Semua gambar tampil; jawaban yang sudah dipilih tetap | |
| 4 | Ulangi no. 2 lewat **Ujian dengan kode** (token) | Sama: gambar tampil tanpa refresh | |

### U8. Jalan mundur dari T6.3 ke T6.2
Data tidak perlu dipulihkan: skemanya sama. 

- **Backend:** **Terapkan → Kelola penerapan →** ikon pensil **→ Versi** → pilih nomor versi yang dulu aktif (versi sebelum yang dibuat di U3) **→ Terapkan**. (Bila daftar versi tidak menampilkannya, tempel `Kode.gs` T6.3 lama lalu ulangi U3.) Tampilan Google bisa berbeda sedikit dari uraian ini; yang dicari adalah *maksud* tombolnya.
- **Situs:** ulangi U5 dan U6 memakai ZIP T6.3 yang lama (`siap-tka-sd-situs-1.6.3-t6.3.zip`).

---

## 0. Gambaran dan isian Anda

**Sebelum (T5):** satu alamat Google (`script.google.com/.../exec`) menyajikan halaman *dan* datanya. Setiap berpindah menu, peramban bertanya ke Google lebih dulu.

**Sesudah (T6):** dua tempat dengan tugas terpisah.

| Bagian | Tempat | Tugas |
|---|---|---|
| **Backend** | Google Apps Script (akun Google Anda; data tetap di Spreadsheet/Drive yang sama) | Hanya menjawab data berbentuk JSON. Tidak lagi menyajikan halaman. |
| **Frontend** | GitHub Pages (`https://USERNAME.github.io/NAMA-REPO/`) | Halaman, tampilan, dan kecepatan berpindah menu. |

**Berkas yang Anda terima**

| Berkas | Dipakai untuk |
|---|---|
| `Kode.gs` | Ditempel ke editor Apps Script (bagian A). Berkas terpisah, **bukan** di dalam ZIP. |
| `appsscript.json` | Ditempel ke manifes proyek Apps Script (bagian A). **Bukan** di dalam ZIP. |
| `siap-tka-sd-situs-1.6.4-t6.4.zip` | Seluruh isi situs untuk GitHub (bagian B atau U5). Tidak ada berkas `.gs` di dalamnya. |
| `siap-tka-sd-uji-beban-1.6.1-t6.1.zip` (tidak berubah di T6.4) | Alat uji beban (dijalankan di komputer; `README.md` di dalamnya). Tidak dipasang ke Apps Script atau GitHub. |
| `PANDUAN-MIGRASI-GITHUB.md` | Panduan ini (salinannya juga ada di dalam ZIP, bernama `PANDUAN-INSTALASI.md`). |

**Isian Anda** — siapkan Notepad (atau Catatan) dan catat nilai-nilai ini begitu Anda memperolehnya. Nanti tinggal disalin dari catatan itu.

| No | Isian | Diperoleh di | Contoh | Nilai Anda |
|---|---|---|---|---|
| 1 | Alamat backend `/exec` | A5 | `https://script.google.com/macros/s/AKfycb…/exec` | |
| 2 | Username GitHub | B2 | `guru-budi` | |
| 3 | Nama repo | B4 | `siap-tka-sd` | |
| 4 | Alamat situs jadi | B10 | `https://guru-budi.github.io/siap-tka-sd/` | |

**Urutan kerja:** A. Backend → B. Frontend → C. Uji → (D. Jalan mundur bila perlu) → E. Memperbarui nanti.

> **Apa yang sudah dan belum dibuktikan.** Semua uji otomatis berjalan di komputer pengembang dengan Google *tiruan*. Itu membuktikan logika dan tampilan, tetapi **belum** membuktikan hal-hal ini di Google dan GitHub yang asli: (1) peramban dari `github.io` bisa memanggil Apps Script tanpa diblokir CORS dan tanpa masalah pengalihan; (2) seberapa cepat respons nyata, termasuk jeda "bangun" di panggilan pertama setelah lama tidak dipakai; (3) kinerja di ponsel kelas bawah dan jaringan seluler; (4) beban 50 siswa serentak lewat jalur baru. Bagian C berisi uji yang perlu Anda lakukan untuk membuktikannya.

---

## A. Backend: perbarui Apps Script (± 15 menit)

Anda memakai **proyek Apps Script T5 yang sama**, sehingga data (Spreadsheet, folder Drive, pemicu otomatis) tetap utuh. Yang berubah hanya kode dan *penerapan* (deployment) barunya.

### A1. Buat backup dulu
Di aplikasi T5 yang sekarang berjalan: masuk sebagai Admin Utama → menu **Backup & Pulihkan** → **Buat backup sekarang**. Tunggu sampai berstatus **Terverifikasi**. (Ini jaring pengaman; T6 tidak mengubah isi data.)

### A2. Siapkan dua berkas backend di komputer
Buka `Kode.gs` dan `appsscript.json` dengan editor teks polos:
- **Windows:** klik kanan berkas → **Open with** → **Notepad**.
- **Mac:** klik kanan → **Open With** → **TextEdit** (bila ditanya format, pilih teks polos).

Jangan membukanya dengan Word. Jangan mengubah apa pun di dalamnya. Biarkan kedua jendela terbuka; Anda akan menyalin isinya satu per satu.

### A3. Perbarui manifes (`appsscript.json`)
1. Buka proyek Anda di <https://script.google.com> (proyek yang dipakai T5).
2. Klik ikon roda gigi **Setelan proyek** (Project Settings) di sidebar kiri.
3. Centang **Tampilkan file manifes "appsscript.json" di editor** (Show "appsscript.json" manifest file in editor).
4. Klik ikon **Editor** (`<>`) di sidebar kiri. Di daftar berkas, klik **appsscript.json**.
5. Klik di dalam kotak kode, tekan **Ctrl+A** (pilih semua), lalu **Delete**.
6. Di Notepad berkas `appsscript.json`: **Ctrl+A**, **Ctrl+C**. Kembali ke editor Apps Script: **Ctrl+V**.
7. Tekan **Ctrl+S**.

Yang benar: isinya 16 baris, baris pertama `{`, ada tulisan `"timeZone": "Asia/Jakarta"` dan `"access": "ANYONE_ANONYMOUS"`. Artinya: V8, zona waktu Jakarta, **Jalankan sebagai: Saya**, **Akses: Siapa saja**. Daftar izin sama dengan T5.

### A4. Ganti kode (`Kode.gs`)
1. Di daftar berkas editor, klik berkas kode utama (biasanya bernama **Kode**).
2. Klik di dalam kotak kode, **Ctrl+A**, **Delete**.
3. Di Notepad berkas `Kode.gs`: **Ctrl+A**, **Ctrl+C**. Kembali ke editor: **Ctrl+V**. (Berkasnya besar, ± 600 KB; tunggu beberapa detik sampai editor selesai menampilkan.)
4. **Periksa tempelan lengkap:** klik di dalam kode, tekan **Ctrl+End**. Nomor baris terakhir yang berisi tulisan harus **10.932**, dan tulisannya `}`. Di bagian atas, baris 1 berisi `/**` dan baris 2 berbunyi `* Kode.gs — Siap TKA SD (gabungan otomatis dari ...`. Bila nomor baris terakhirnya jauh lebih kecil, tempelan terpotong: ulangi langkah 2–3. Tempelan terpotong adalah kegagalan yang paling mudah terjadi.
5. Tekan **Ctrl+S**.
6. File HTML lama (`Index`, `Stylesheet`, `JavaScript`) **tidak dipakai lagi**. Boleh dihapus (titik tiga di sampingnya → **Hapus**) atau dibiarkan; keduanya aman. Penerapan lama (T5) tidak terpengaruh karena ia menyimpan salinan versinya sendiri.

### A5. Jalankan `pasangAwal` sekali
1. Di bilah atas editor ada kotak pilihan fungsi (bertulisan nama fungsi atau "Pilih fungsi"). Klik dan pilih **`pasangAwal`**.
2. Klik **Jalankan** (Run).
3. Bila muncul **Perlu otorisasi** (Authorization required): **Tinjau izin** → pilih akun Google Anda → **Lanjutan** (Advanced) → **Buka … (tidak aman)** (Go to … (unsafe)) → **Izinkan** (Allow). Peringatan "tidak aman" muncul karena skrip ini buatan Anda sendiri dan belum diverifikasi Google; itu normal.
4. Tunggu sampai di bagian bawah muncul **Log eksekusi** (Execution log) berisi baris selesai.

Harus muncul di log (angkanya boleh sedikit berbeda):
```text
[PASANG] Spreadsheet database: https://docs.google.com/spreadsheets/d/...
[PASANG] Tabel baru: 0 | sudah ada: 23
[PASANG] Akun sudah ada; Admin Utama tidak dibuat ulang dan tidak ada data yang ditimpa. ...
```
Fungsi ini aman diulang: tidak menimpa data dan tidak membuat admin kedua. Bila ada pesan galat berwarna merah, **berhenti** dan kirimkan tangkapan layar log.

> Pemicu otomatis (backup harian dll.) milik *proyek*, bukan milik penerapan, jadi tidak perlu dipasang ulang.

### A6. Buat penerapan **baru** (jangan ubah yang lama)
1. Klik **Terapkan** (Deploy) di kanan atas → **Penerapan baru** (New deployment).
2. Klik ikon roda gigi di samping **Pilih jenis** (Select type) → **Aplikasi web** (Web app).
3. Isi:

| Kolom | Isi |
|---|---|
| Deskripsi | `T6 backend JSON` |
| Jalankan sebagai (Execute as) | **Saya** (Me) |
| Yang memiliki akses (Who has access) | **Siapa saja** (Anyone) |

   Pilih **Siapa saja** yang paling sederhana, **bukan** "Siapa saja yang punya akun Google" dan bukan "Hanya saya". Dua yang terakhir membuat peramban siswa diminta login Google, dan tampilan di GitHub tidak akan bisa membaca datanya.
4. Klik **Terapkan** (Deploy). Bila diminta izin lagi, ikuti seperti di A5.
5. Klik tombol **Salin** di samping **URL aplikasi web** (Web app URL). URL ini berakhiran **`/exec`**. **Tempel ke catatan Anda sebagai Isian 1.**

Penerapan T5 yang lama **dibiarkan** sebagai jalan mundur (bagian D). Tiap penerapan punya URL sendiri.

**Bentuk URL yang benar** (keduanya diterima aplikasi):
```text
https://script.google.com/macros/s/AKfycb…panjang…/exec
https://script.google.com/a/macros/NAMA-DOMAIN-SEKOLAH/s/AKfycb…panjang…/exec
```
Bentuk kedua muncul pada akun Google Workspace (akun sekolah/kantor).

> **Bila pilihan "Siapa saja" tidak ada atau abu-abu** (biasanya pada akun Workspace sekolah): administrator domain membatasinya, dan itu tidak bisa saya ubah dari sini. Tanpa akses "Siapa saja", tampilan di GitHub tidak dapat membaca backend. Berhenti di sini, kirim tangkapan layar kotak penerapan, dan tetap pakai T5 sampai ada jalan keluar (mis. meminta administrator mengizinkan, atau memakai akun Gmail pribadi sebagai pemilik proyek).

### A7. Periksa backend langsung di peramban
Buka tab peramban baru, tempel URL `/exec` tadi (dari catatan), Enter. Yang benar: teks JSON pendek seperti ini.

Harus muncul:
```text
{"success":true,"data":{"layanan":"Siap TKA SD","versi":"1.6.4-t6.4","api":true},"message":"OK"}
```

| Yang Anda lihat | Artinya | Perbaikan |
|---|---|---|
| JSON dengan `"versi":"1.6.4-t6.4"` | Benar | Lanjut ke B |
| Halaman login Google | Akses bukan "Siapa saja" | Buat penerapan baru dengan akses **Siapa saja** (A6) |
| Tampilan aplikasi T5 yang lama | Itu URL penerapan lama | Pakai URL dari penerapan **baru** |
| `"versi":"1.5.0-t5"` atau halaman galat | Kode baru belum terpasang di penerapan itu | Ulangi A4 lalu A6 |

---

## B. Frontend: pasang di GitHub Pages (± 40 menit pertama kali)

Seluruh bagian B memakai **terminal** (jendela perintah), bukan tombol "Upload files" di web GitHub. Upload lewat web GitHub **meratakan** folder (semua berkas jadi satu tingkat), sehingga `css/` dan `js/` hilang dan halaman tampil tanpa gaya.

### B0. Istilah singkat
- **Git**: program di komputer Anda yang mengirim folder ke GitHub.
- **GitHub**: situs penyimpan folder (disebut *repository*, disingkat "repo").
- **Commit**: foto kondisi folder pada satu saat. **Push**: mengirim foto itu ke GitHub.
- **GitHub Pages**: fitur GitHub yang menyajikan isi repo sebagai situs web.
- **Terminal**: jendela tempat Anda menempel perintah. Windows: **PowerShell**. Mac: **Terminal**.

### B1. Pasang Git (lewati bila `git --version` sudah menjawab)

**[Windows]**
1. Buka <https://git-scm.com/download/win>, unduh pemasang 64-bit, jalankan.
2. Klik **Next** terus di semua layar (pilihan bawaan sudah benar), lalu **Install**, lalu **Finish**.
3. **Tutup semua jendela PowerShell yang terbuka.** Buka yang baru: tekan tombol Windows, ketik `PowerShell`, Enter.

**[Mac]** Buka *Terminal* (Cmd+Spasi, ketik `Terminal`, Enter). Jalankan perintah periksa di bawah; bila Git belum ada, macOS menawarkan pemasangan otomatis: klik **Install** dan tunggu selesai.

**[Linux, Debian/Ubuntu]**
```bash
sudo apt install git
```

**Periksa (semua sistem):**
```bash
git --version
```
Harus muncul:
```text
git version 2.43.0
```
(Angkanya boleh berbeda; di Windows ada tambahan `.windows.1`.) Bila muncul *"git is not recognized"*: jendela PowerShell Anda dibuka sebelum Git terpasang. Tutup, buka yang baru; bila masih sama, nyalakan ulang komputer.

### B2. Akun GitHub
Daftar di <https://github.com> bila belum punya. **Username** Anda menjadi bagian alamat situs (`USERNAME.github.io`), jadi pilih dengan sadar. **Catat sebagai Isian 2.**

### B3. Beri tahu Git siapa Anda (sekali seumur komputer itu)

✋ **GANTI** `NAMA ANDA` dan `EMAIL-GITHUB-ANDA@contoh.com`. Tanda kutipnya **jangan dihapus**. `user.name` bebas diisi apa saja (bukan username GitHub); `user.email` sebaiknya email akun GitHub Anda.
```bash
git config --global user.name "NAMA ANDA"
git config --global user.email "EMAIL-GITHUB-ANDA@contoh.com"
```
Periksa:
```bash
git config --global user.name
git config --global user.email
```
Harus muncul: nama dan email yang baru Anda ketik, masing-masing satu baris.

### B4. Buat repository kosong di GitHub
1. Di github.com klik **+** (kanan atas) → **New repository**.
2. **Repository name:** `siap-tka-sd` (atau nama lain; **catat sebagai Isian 3**).
3. Pilih **Public**. (GitHub Pages gratis hanya untuk repo publik. Isinya tidak memuat rahasia; lihat bagian G.)
4. **Jangan** centang *Add a README file*, *Add .gitignore*, ataupun *Choose a license*.
5. Klik **Create repository**.
6. **Biarkan halaman berikutnya terbuka.** Di sana ada kotak *"…or push an existing repository from the command line"* berisi tiga baris perintah dengan tombol salin, dan **sudah terisi username dan nama repo Anda yang benar**. Itu yang akan Anda pakai di langkah B8.

### B5. Ekstrak ZIP dan masuk ke folder yang benar

**Aturan satu-satunya:** folder hasil ekstraksi **adalah** folder tempat Anda menjalankan `git init`. Di dalamnya, **langsung** terlihat `index.html`, folder `css`, dan folder `js`. Tidak ada folder pembungkus lagi di dalamnya. **Ekstrak ke folder baru yang kosong**, jangan ke folder `Downloads` langsung (itu akan mengotori `Downloads` dan membuat Anda mengirim berkas yang tidak perlu).

**[Windows] Cara 1: dengan perintah** (bila ZIP ada di folder Downloads dan Windows Anda tidak memakai OneDrive untuk Downloads). Dua kotak, satu per satu.
```powershell
Expand-Archive -Path "$HOME\Downloads\siap-tka-sd-situs-1.6.4-t6.4.zip" -DestinationPath "$HOME\siap-tka-sd-situs" -Force
```
```powershell
cd "$HOME\siap-tka-sd-situs"
```

**[Windows] Cara 2: dengan mouse** (bila Cara 1 memberi galat, atau nama ZIP Anda berbeda, mis. ada tambahan `(1)`):
1. Buka **File Explorer** → folder tempat ZIP berada. Klik kanan ZIP → **Extract All…** → **Extract**.
2. Buka folder baru hasil ekstraksi. Pastikan *langsung* terlihat `index.html`, `css`, `js`. Bila yang terlihat justru satu folder lagi, masuk ke dalamnya.
3. Klik **kolom alamat** di bagian atas File Explorer (yang menampilkan jalur folder), ketik `powershell`, tekan **Enter**. PowerShell terbuka *tepat di folder itu*.

**[Mac / Linux] Cara 1: dengan perintah** (bila ZIP ada di `Downloads`). Satu kotak.
```bash
mkdir -p ~/siap-tka-sd-situs && unzip -q -o ~/Downloads/siap-tka-sd-situs-1.6.4-t6.4.zip -d ~/siap-tka-sd-situs && cd ~/siap-tka-sd-situs
```
Tidak ada keluaran bila berhasil.

**[Mac] Cara 2: dengan mouse** (bila Safari sudah mengekstrak ZIP sendiri menjadi folder, atau nama ZIP berbeda): ekstrak lewat Finder (klik dua kali). Di Terminal ketik `cd ` (huruf c, d, lalu **satu spasi**, jangan tekan Enter), **seret folder hasil ekstraksi dari Finder ke jendela Terminal**, lalu tekan Enter.

Di mana pun Anda berada sekarang, periksa jalurnya:

**[Windows]**
```powershell
pwd
```
**[Mac / Linux]**
```bash
pwd
```
Harus muncul jalur folder situs tadi, mis. `C:\Users\Budi\siap-tka-sd-situs` atau `/Users/budi/siap-tka-sd-situs`.

### B6. Isi alamat backend di `js/config.js` (WAJIB sebelum unggah pertama)

Anda tidak perlu menyunting berkas apa pun. Perintah di bawah menanyakan alamat `/exec` lalu menuliskannya ke `js/config.js` sendiri. Siapkan alamat dari catatan Anda (Isian 1).

**[Windows]** Salin kotak ini, tempel, Enter. PowerShell menampilkan tulisan *"Tempel alamat /exec lalu tekan Enter:"*. **Tempel alamatnya** (klik kanan; layar boleh tampak biasa) lalu tekan **Enter**.
```powershell
Set-Content -Path js\config.js -Encoding ascii -Value ("window.SIAP_CONFIG = { GAS_URL: '" + (Read-Host "Tempel alamat /exec lalu tekan Enter").Trim() + "' };")
```

**[Mac / Linux]** Dua kotak, satu per satu. Kotak pertama menunggu Anda menempel alamat lalu Enter.
```bash
printf "Tempel alamat /exec lalu tekan Enter: "; read -r URL
```
```bash
printf "window.SIAP_CONFIG = { GAS_URL: '%s' };\n" "$URL" > js/config.js
```

**Periksa hasilnya.**

**[Windows]**
```powershell
Get-Content js\config.js
```
**[Mac / Linux]**
```bash
cat js/config.js
```
Harus muncul **satu baris** (alamat Anda yang sebenarnya, bukan tiga titik):
```text
window.SIAP_CONFIG = { GAS_URL: 'https://script.google.com/macros/s/AKfycb…panjang…/exec' };
```
Cocokkan: dimulai `https://script.google.com/`, berakhir `/exec'`, tidak ada spasi atau tulisan lain di dalam tanda kutip, dan **bukan** tulisan `ISI_DENGAN_ALAMAT_EXEC_APPS_SCRIPT`. Bila salah, jalankan perintah B6 lagi (isinya ditimpa). Alamat ini bukan rahasia (sama seperti alamat situs). Kata sandi dan token tidak pernah ada di berkas ini.

### B7. Periksa isi folder SEBELUM `git init` (gerbang terpenting)

Kesalahan paling mahal di seluruh panduan ini bukan salah ketik, tetapi menjalankan `git init` satu tingkat terlalu tinggi: semua perintah "berhasil", tetapi situs 404. Karena itu periksa dulu.

**[Windows]**
```powershell
dir -Force
```
**[Mac / Linux]**
```bash
ls -la
```
Harus muncul nama-nama berikut. Urutan, ukuran, dan tanggal boleh berbeda; Windows menampilkan tabel berkolom *Mode, LastWriteTime, Length, Name* dan yang dicocokkan hanya kolom **Name**:
```text
-rw-r--r--  .nojekyll
-rw-r--r--  PANDUAN-INSTALASI.md
-rw-r--r--  README.md
drwxr-xr-x  css
-rw-r--r--  favicon.svg
-rw-r--r--  index.html
drwxr-xr-x  js
```
Yang wajib terlihat: **`index.html`**, folder **`css`**, folder **`js`**, dan berkas kecil **`.nojekyll`** (nama diawali titik; jangan dihapus, ia memberi tahu GitHub Pages agar menyajikan berkas apa adanya). Lalu periksa isi `js`:

**[Windows]**
```powershell
dir js
```
**[Mac / Linux]**
```bash
ls js
```
Harus ada `app.js` dan `config.js`. Terakhir, pastikan **tidak ada** berkas backend yang terselip:

**[Windows]** (tidak menampilkan apa-apa = benar)
```powershell
dir -Recurse -Force -Include *.gs,appsscript.json
```
**[Mac / Linux]** (tidak menampilkan apa-apa = benar)
```bash
find . -name "*.gs" -o -name "appsscript.json"
```

| Yang Anda lihat | Artinya | Perbaikan |
|---|---|---|
| `index.html`, `css`, `js` terlihat | Benar | Lanjut ke B8 |
| Yang terlihat justru satu folder lain (mis. `siap-tka-sd-situs-1.6.4-t6.4`) | Satu tingkat terlalu tinggi | `cd` masuk ke folder itu, ulangi B7 |
| `index.html` tidak ada sama sekali | Salah folder, atau ekstraksi gagal | Ulangi B5 |
| Berkas `.gs` atau `appsscript.json` muncul | Bukan milik frontend | Pindahkan keluar dari folder ini |

**Jangan lanjut sebelum `index.html` terlihat.**

### B8. Kirim ke GitHub (satu perintah, lihat hasilnya, baru berikutnya)

**B8a. Mulai pencatatan Git di folder ini.**
```bash
git init
```
Harus muncul (bagian `hint: ...` boleh ada atau tidak, itu normal):
```text
hint: Using 'master' as the name for the initial branch. ...
Initialized empty Git repository in /Users/budi/siap-tka-sd-situs/.git/
```

**B8b. Masukkan semua berkas ke daftar kirim.** (Ada **titik** di ujung perintah: artinya "semua berkas di folder ini".)
```bash
git add .
```
Tidak ada keluaran = berhasil. Di Windows mungkin muncul peringatan `warning: LF will be replaced by CRLF ...`; itu normal, abaikan.

**B8c. Buat commit pertama.**
```bash
git commit -m "Pasang Siap TKA SD T6"
```
Harus muncul:
```text
[master (root-commit) c1147a5] Pasang Siap TKA SD T6
 8 files changed, 12369 insertions(+)
 create mode 100644 .nojekyll
 create mode 100644 PANDUAN-INSTALASI.md
 create mode 100644 README.md
 create mode 100644 css/style.css
 create mode 100644 favicon.svg
 create mode 100644 index.html
 create mode 100644 js/app.js
 create mode 100644 js/config.js
```
Hitung dan nomor commit boleh berbeda; yang dicocokkan: delapan berkas, termasuk `index.html`, `css/style.css`, `js/app.js`, `js/config.js`. Bila muncul *"Author identity unknown"*, langkah B3 belum dilakukan: kerjakan B3, lalu ulangi B8c.

**B8d. Beri nama cabang utama `main`.**
```bash
git branch -M main
```
Tidak ada keluaran = berhasil.

**B8e. Sambungkan ke repo GitHub Anda.**

*Cara termudah:* di halaman repo kosong yang tadi Anda biarkan terbuka (B4), salin baris yang diawali `git remote add origin https://github.com/…` dengan tombol salin, tempel di terminal, Enter.

*Cara manual:* ✋ **GANTI** `USERNAME` dan `NAMA-REPO` (Isian 2 dan 3).
```bash
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
```
Tidak ada keluaran = berhasil. Bila muncul `error: remote origin already exists` dan alamat yang tersimpan salah, perbaiki dengan (✋ **GANTI** juga):
```bash
git remote set-url origin https://github.com/USERNAME/NAMA-REPO.git
```

**B8f. Kirim.**
```bash
git push -u origin main
```
Git meminta tanda pengenal ke GitHub. Salah satu dari tiga hal ini akan terjadi, semuanya benar:

1. **Jendela "Connect to GitHub" / "Sign in" muncul (umum di Windows).** Klik **Sign in with your browser**, masuk ke GitHub di peramban, setujui. Tidak perlu token.
2. **Terminal menanyakan `Username` lalu `Password`.** Username: username GitHub. Password: tempel **Personal Access Token**, *bukan* password akun (cara membuatnya di B8g). **Saat menempel token, layar tampak kosong. Itu normal**, tidak ada bintang atau huruf yang muncul. Tempel, lalu tekan Enter.
3. **Mac: jendela Keychain** meminta izin. Setujui.

Bila **tidak ada jendela apa pun** dan Git langsung gagal dengan `403` dan tulisan `Permission to PEMILIK/REPO.git denied to AKUN-LAIN`, komputer ini masih menyimpan login GitHub akun lain dan memakainya diam-diam. Lihat "Memperbaiki: 403 karena akun GitHub yang tersimpan berbeda" di bagian F.

Harus muncul di akhir:
```text
To https://github.com/USERNAME/NAMA-REPO.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```
Bagian `Writing objects: 100%` yang mendahuluinya boleh tampil. Bila muncul `Password authentication is not supported` atau `Authentication failed`, lanjut ke B8g.

**B8g. Membuat Personal Access Token (hanya bila diminta; sekali saja).**
1. Buka <https://github.com/settings/tokens> (GitHub mungkin meminta Anda memasukkan password lagi).
2. **Generate new token** → **Generate new token (classic)**.
3. **Note:** `git-push`. **Expiration:** `90 days` (atau *No expiration* bila tidak mau repot memperpanjang). **Centang kotak `repo`** (kotak-kotak di bawahnya ikut tercentang).
4. Gulir ke bawah, **Generate token**.
5. **Salin token** yang diawali `ghp_`. Ia hanya tampil sekali; simpan sementara di Notepad.
6. Kembali ke terminal, ulangi `git push -u origin main` (B8f), dan tempel token itu saat diminta *Password*.

Bila Anda lebih nyaman tanpa mengetik token, alternatifnya **GitHub Desktop** (<https://desktop.github.com>): login lewat peramban → **Add Local Repository** → pilih folder situs tadi → **Publish repository**. Ini jalur lewat mouse, tanpa token manual.

### B9. Periksa repo di GitHub
Buka `https://github.com/USERNAME/NAMA-REPO`. Yang benar, di daftar berkas paling atas:

```text
css/            ← folder
js/             ← folder
.nojekyll
PANDUAN-INSTALASI.md
README.md
favicon.svg
index.html
```
Tidak ada berkas `.gs`. Klik folder `js`: ada `app.js` dan `config.js`. Klik `config.js`: alamat `/exec` Anda terlihat di sana (itu memang publik).

Bila yang terlihat justru *folder* lain (bukan `index.html`) di daftar atas, atau berkas CSS/JS tampak rata tanpa folder, lihat "Memperbaiki" di bagian F.

### B10. Aktifkan GitHub Pages
1. Di halaman repo: **Settings** (tab paling kanan atas) → **Pages** (sidebar kiri).
2. Di **Build and deployment**:

| Kolom | Isi |
|---|---|
| Source | **Deploy from a branch** |
| Branch | **main** dan folder **/ (root)**, lalu klik **Save** |

3. Tunggu. Klik tab **Actions** di repo: ada proses bernama **pages build and deployment**. Bila sudah ada tanda centang hijau ✓, situs siap (biasanya 1–2 menit; lingkaran kuning = masih berjalan).
4. Kembali ke **Settings → Pages**, muat ulang halaman. Di bagian atas muncul tulisan *"Your site is live at https://USERNAME.github.io/NAMA-REPO/"*. **Catat sebagai Isian 4.**
5. Bila kotak **Enforce HTTPS** belum tercentang, centang. (Kadang abu-abu beberapa menit pertama; coba lagi nanti.)

### B11. Buka situsnya
Buka alamat Isian 4. Yang benar: beranda aplikasi tampil (nama dan logo sesuai pengaturan Anda). Bila terlihat versi lama atau polos, tekan **Ctrl+Shift+R** (Mac: **Cmd+Shift+R**). Bila layarnya berbunyi *"Alamat server belum diatur"* atau *"Aplikasi belum bisa tampil"*, lihat bagian F.

---

## C. Uji setelah online (ini yang membuktikan T6 di Google dan GitHub asli)

Lakukan berurutan dan catat hasilnya di tabel. Kirimkan tangkapan layar bila ada yang tidak sesuai.

**Cara membuka Console peramban:** tekan **F12** (Mac: **Cmd+Option+J**) → tab **Console**. Tulisan merah di sana yang perlu dilaporkan.

| No | Uji | Yang benar | Hasil Anda |
|---|---|---|---|
| 1 | Buka alamat situs, lihat beranda | Tampil dalam beberapa detik. Console tanpa tulisan merah. | |
| 2 | Masuk sebagai Admin; catat berapa detik dari menekan *Masuk* sampai Dasbor tampil (pakai stopwatch ponsel) | Dasbor tampil. Kali pertama setelah lama tidak dipakai boleh lebih lambat. | ± … detik |
| 3 | Pindah-pindah menu: Kelola Akun, Paket Soal, Hasil & Nilai, kembali ke Dasbor | Menu yang pernah dibuka terasa instan. Menu yang baru pertama kali dibuka menunggu sebentar dengan kerangka abu-abu berkilau. | |
| 4 | Tutup tab, **tunggu 15–30 menit**, buka lagi alamat situs, langsung tekan *Masuk* | Nama dan logo tampil seketika. Anda tidak terlempar ke layar masuk. | ± … detik |
| 5 | Masuk sebagai siswa, kerjakan satu ujian sampai hasil, buka **Riwayat** | Percobaan baru langsung tampil di Riwayat. | |
| 6 | Ulangi uji 2–5 di ponsel siswa yang paling sederhana, dengan jaringan seluler | Berfungsi; catat bila terasa lambat. | |
| 7 | (Opsional) uji beban 50 siswa dengan alat di folder `uji-beban` | Seperti hasil T5. | |

Satu pesan yang **mungkin** muncul dan wajib dilaporkan utuh: `blocked by CORS policy` di Console. Artinya peramban menolak jawaban Apps Script; lihat bagian F.

Tentang uji 7: jalur baru memanggil Apps Script dari peramban lewat `fetch`. Bebannya sama di sisi Google, tetapi itu belum saya ukur di Google asli.

Yang **tidak** berubah: data, akun, paket soal, hasil, dan pemicu otomatis semuanya tetap di Spreadsheet/Drive Anda yang lama.

---

## D. Jalan mundur (kembali ke T5)

Penerapan Apps Script T5 yang lama tidak diubah dan tetap hidup di URL lamanya. Bila T6 bermasalah: pakai kembali URL T5 itu (langsung di peramban, bukan GitHub). Data tetap sama karena Spreadsheet dan Drive-nya satu. Karena T6 tidak mengubah skema, tidak ada yang perlu dipulihkan dari backup.

Satu catatan: bila Anda sudah **menghapus** penerapan lama, atau mengedit penerapan yang sama menjadi versi T6, jalan mundur ini tidak ada; itu sebabnya A6 menyuruh membuat penerapan **baru**.

---

## E. Memperbarui situs nanti

**Memperbarui tampilan (ZIP baru dari saya).** Folder situs yang lama (tempat Anda dulu menjalankan `git init`) adalah yang menyimpan hubungan ke GitHub, jadi *ke folder itulah isi ZIP baru ditimpakan*. Jangan menjalankan `git add .` di folder hasil ekstraksi yang baru: ia tidak punya hubungan ke GitHub.

1. Ekstrak ZIP baru ke folder **baru**, lalu timpakan ke folder lama. ✋ **GANTI** `NAMA-ZIP-BARU.zip` dengan nama berkas ZIP yang baru Anda unduh.

   **[Windows]** dua kotak, satu per satu:
```powershell
Expand-Archive -Path "$HOME\Downloads\NAMA-ZIP-BARU.zip" -DestinationPath "$HOME\siap-tka-sd-situs-baru" -Force
```
```powershell
Copy-Item -Path "$HOME\siap-tka-sd-situs-baru\*" -Destination "$HOME\siap-tka-sd-situs" -Recurse -Force
```
   **[Mac / Linux]** satu kotak:
```bash
mkdir -p ~/siap-tka-sd-situs-baru && unzip -q -o ~/Downloads/NAMA-ZIP-BARU.zip -d ~/siap-tka-sd-situs-baru && cp -R ~/siap-tka-sd-situs-baru/. ~/siap-tka-sd-situs/
```
   (Bila Anda mengekstrak dengan mouse, cukup salin seluruh isi folder baru lalu tempel dan **Replace** semua di folder lama.) Berkas yang *dihapus* di versi baru tidak ikut hilang dari folder lama; bila ada yang seperti itu, saya akan menyebutkannya.
2. Masuk ke folder lama (terminal baru bila perlu, seperti B5):
   **[Windows]**
```powershell
cd "$HOME\siap-tka-sd-situs"
```
   **[Mac / Linux]**
```bash
cd ~/siap-tka-sd-situs
```
3. Isi ulang alamat backend dengan perintah B6 (ia menimpa `config.js` dengan alamat Anda), lalu periksa B7.
4. Kirim. Tiga perintah, satu per satu:
```bash
git add .
```
```bash
git commit -m "Pembaruan"
```
```bash
git push
```
Bila folder lama sudah terhapus: ambil kembali dari GitHub dengan ✋ (**GANTI** `USERNAME` dan `NAMA-REPO`) `git clone https://github.com/USERNAME/NAMA-REPO.git siap-tka-sd-situs` di folder pilihan Anda, lalu lanjutkan dari langkah 1.

GitHub Pages memperbarui dalam 1–2 menit (lihat tab **Actions**). Bila masih tampil versi lama: **Ctrl+Shift+R**. Berkas diberi nomor versi (`?v=…`) di `index.html` sehingga peramban otomatis mengambil yang baru.

Bila `git push` meminta tanda pengenal lagi dan token lama sudah kedaluwarsa (90 hari): buat token baru seperti B8g.

**Memperbarui backend (Kode.gs baru):** tempel kode baru seperti A4, lalu **Terapkan → Kelola penerapan** (Manage deployments) → ikon pensil pada penerapan T6 → **Versi** → **Versi baru** (New version) → **Terapkan**. URL `/exec` tetap sama, jadi `config.js` tidak perlu diubah. Bila Anda memilih **membuat penerapan baru** (URL berubah): ulangi B6 dengan URL baru, lalu `git add .`, `git commit`, `git push`.

---

## F. Pemecahan masalah

| Yang terlihat | Penyebab paling mungkin | Perbaikan |
|---|---|---|
| Halaman **404** dari GitHub | `git init` dijalankan satu tingkat terlalu tinggi, sehingga `index.html` tidak di akar repo; atau Pages belum selesai | Cek B9. Bila repo berisi *folder*: "Memperbaiki: salah folder". Bila repo benar: tunggu sampai ✓ hijau di tab Actions |
| Halaman tampil **polos tanpa warna**; Console: `404` untuk `style.css`/`app.js` | Berkas diunggah lewat web GitHub (rata) atau folder `css/`, `js/` tidak ikut | "Memperbaiki: berkas rata" |
| Layar **"Alamat server belum diatur"** | `GAS_URL` di `js/config.js` kosong atau bentuknya salah | Ulangi B6 (periksa dengan `cat`/`Get-Content`), lalu `git add .`, `git commit`, `git push`, Ctrl+Shift+R |
| Panel **"Aplikasi belum bisa tampil"** dengan laporan | Skrip utama tidak termuat, berhenti karena galat, atau server tidak menjawab > 30 dtk | Baca bagian *Sebab* di panel; tekan **Salin laporan** dan kirimkan |
| Layar **"Halaman tidak lengkap"** | `index.html` di repo berbeda dari yang di ZIP | Salin `index.html` dari ZIP asli ke folder, lalu `git add .`, `git commit`, `git push` |
| Console: **`blocked by CORS policy`** | Penerapan Apps Script bukan "Siapa saja", atau Anda memakai URL berakhiran `/dev` | Buat penerapan baru dengan akses **Siapa saja** (A6), pakai URL `/exec`, ulangi B6 |
| Beranda tampil tetapi **banner/peringkat berpesan galat** | Backend belum menjawab atau URL salah | Buka URL `/exec` langsung (A7); harus JSON |
| Setelah masuk, **"Sesi Anda berakhir"** berulang | Sesi dicabut (akun dinonaktifkan atau password direset) | Masuk lagi; bila terus berulang, kirimkan tangkapan layar |
| `git is not recognized` / `command not found: git` | Git belum terpasang, atau PowerShell dibuka sebelum Git terpasang | B1; tutup dan buka terminal baru |
| `fatal: not a git repository` | Belum `git init` atau salah folder | `pwd` dan cek B7, lalu `git init` |
| `Author identity unknown` | B3 belum dilakukan | Kerjakan B3, ulangi `git commit` |
| `warning: LF will be replaced by CRLF` | Pengaturan akhir baris Windows | Normal, abaikan |
| `error: remote origin already exists` | `git remote add` sudah pernah jalan | Lewati; bila alamatnya salah: `git remote set-url origin …` (B8e) |
| `src refspec main does not match any` | Belum ada commit, atau nama cabang bukan `main` | Ulangi B8c lalu B8d, kemudian `git push -u origin main` |
| `Password authentication is not supported` / `Authentication failed` | GitHub menolak password biasa | Pakai Personal Access Token (B8g) atau masuk lewat peramban |
| `remote: Permission to PEMILIK/REPO.git denied to AKUN-LAIN` + `error: 403` | Repo milik satu akun, tetapi komputer memakai login GitHub akun lain yang tersimpan sebelumnya | "Memperbaiki: 403 karena akun GitHub yang tersimpan berbeda" di bawah |
| `Repository not found` / `Permission denied` | Username/nama repo salah ketik, atau token tidak bercentang `repo` | Periksa alamat dengan `git remote -v`; perbaiki dengan `git remote set-url origin …`; buat token baru dengan centang `repo` |
| `Reinitialized existing Git repository` | `git init` dijalankan di folder yang sudah pernah di-`git init` | Normal, tidak merusak apa pun; lanjut ke langkah berikutnya |
| `nothing to commit, working tree clean` | Semua berkas sudah pernah di-commit | Normal; langkah commit tidak perlu diulang. Lanjut ke `git push` |
| `failed to push some refs` / `Updates were rejected` | Repo di GitHub tidak kosong (mis. tadi tercentang *Add a README*) | Aman bila repo memang baru: `git push -u origin main --force` (menimpa isi repo yang ada) |
| Perubahan tidak terlihat setelah push | Cache peramban atau Pages belum selesai | Tunggu sampai ✓ hijau di tab Actions, lalu Ctrl+Shift+R |

### Memperbaiki: salah folder (404)
Gejala: semua perintah berhasil, repo di GitHub berisi *folder* (bukan `index.html`) di daftar atas.
1. Masuk ke folder yang benar (yang *langsung* berisi `index.html`) dan buktikan dengan B7.
2. Satu per satu:
```bash
git init
```
```bash
git add .
```
```bash
git commit -m "Perbaiki folder"
```
```bash
git branch -M main
```
3. ✋ **GANTI** `USERNAME` dan `NAMA-REPO`:
```bash
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
```
4. Perintah terakhir ini **menimpa** isi repo di GitHub dengan isi folder ini. Aman di sini karena isi lama memang salah struktur; jangan memakainya untuk keperluan lain tanpa paham artinya:
```bash
git push -u origin main --force
```
Tunggu 1–2 menit, buka situs, Ctrl+Shift+R. (Folder `.git` lama yang tertinggal di folder yang salah tidak mengganggu; boleh dibiarkan.)

### Memperbaiki: 403 karena akun GitHub yang tersimpan berbeda
Gejala: `remote: Permission to PEMILIK/REPO.git denied to AKUN-LAIN`, lalu `fatal: unable to access ... The requested URL returned error: 403`. Perintah dan folder Anda benar. Repo milik `PEMILIK`, tetapi Git di komputer ini masuk ke GitHub sebagai `AKUN-LAIN`, login lama yang tersimpan, dan akun itu tidak boleh menulis ke repo tersebut.
1. **Peramban:** buka github.com, klik foto profil di kanan atas; nama di atas menu harus `PEMILIK`. Bila tidak, **Sign out** lalu masuk sebagai `PEMILIK`.
2. **Hapus login lama.**
   - **[Windows]** Tombol Windows → ketik `Credential Manager` (*Manajer Kredensial*) → **Windows Credentials** → di *Generic Credentials* cari entri yang mengandung `github` (mis. `git:https://github.com`) → klik → **Remove** → konfirmasi. Hapus semua entri berisi `github`.
   - **[Mac]** Cmd+Spasi → `Keychain Access` (*Akses Rantai Kunci*) → ketik `github.com` di kolom cari → hapus entri `github.com` jenis *internet password*.
3. Ulangi:
```bash
git push -u origin main
```
   Jendela **Connect to GitHub** muncul; **Sign in with your browser** dan setujui sebagai `PEMILIK`.

Bila ternyata akun yang benar adalah `AKUN-LAIN` (bukan `PEMILIK`): buat repo baru di akun itu (B4), lalu ✋ **GANTI** `AKUN-LAIN` dan `NAMA-REPO`:
```bash
git remote set-url origin https://github.com/AKUN-LAIN/NAMA-REPO.git
```
dan ulangi `git push -u origin main`. Alternatifnya, pemilik repo menambahkan `AKUN-LAIN` di **Settings → Collaborators** dengan izin menulis, dan `AKUN-LAIN` menerima undangannya.

### Memperbaiki: berkas rata (CSS/JS 404)
Cara termudah: kembali ke B5 dan kirim ulang dari folder yang benar seperti pada "salah folder" di atas (ikut `--force`). Itu menimpa repo dengan struktur yang benar. Cara mencegahnya: jangan unggah lewat web GitHub.

---

## G. Yang perlu Anda ketahui tentang GitHub Pages

- **Isi repo bersifat publik.** Itu aman di sini: tidak ada kata sandi, token, atau data siswa di berkas mana pun. Alamat `/exec` memang diketahui peramban setiap pengunjung. Yang menjaga data adalah backend (login, token sesi, pemeriksaan hak per aksi), bukan kerahasiaan alamat.
- **Penyimpanan peramban dibagi per alamat `USERNAME.github.io`.** Bila akun GitHub yang sama juga menayangkan situs lain di `USERNAME.github.io/…`, situs-situs itu berbagi `localStorage`/`sessionStorage` yang sama (bukan data lintas komputer). Aplikasi ini hanya menyimpan token sesi (di `sessionStorage`, hilang saat tab ditutup) dan salinan info publik (nama dan logo aplikasi). Karena itu jangan menaruh situs lain yang tidak Anda percayai di akun GitHub yang sama. Bila ingin terpisah sepenuhnya, pakai akun GitHub khusus atau domain sendiri.
- **Perlindungan CSP** dipasang lewat tag `<meta>` di `index.html` (skrip hanya dari situs sendiri dan satu skrip sebaris bertanda sidik; sambungan hanya ke situs sendiri dan Google). GitHub Pages tidak memungkinkan header HTTP, jadi perlindungan terhadap situs ini **di-bingkai** (`frame-ancestors`) tidak bisa dipasang; pihak lain secara teknis dapat menampilkannya di dalam bingkai. Risikonya rendah untuk aplikasi ini, tetapi perlu Anda ketahui.
- **Font** (Inter dan Plus Jakarta Sans) dimuat dari Google Fonts, tidak menghalangi tampilan pertama. Bila Google Fonts tidak terjangkau, aplikasi memakai font sistem.
- **Tidak ada mesin pencari yang diurus** (tidak ada `robots.txt` atau peta situs); bukan tujuan aplikasi ini.

---

## H. Lembar contekan (untuk yang sudah pernah melakukannya)

Semuanya dijalankan di folder situs yang benar (`index.html` terlihat). Satu per satu.

**Pertama kali:**
```bash
git init
```
```bash
git add .
```
```bash
git commit -m "Pasang Siap TKA SD T6"
```
```bash
git branch -M main
```
```bash
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
```
```bash
git push -u origin main
```

**Setiap pembaruan berikutnya:**
```bash
git add .
```
```bash
git commit -m "Pembaruan"
```
```bash
git push
```

Selesai. Bila ada langkah yang tidak sesuai, kirimkan tangkapan layar terminal atau Console dan saya lanjutkan dari titik itu.
