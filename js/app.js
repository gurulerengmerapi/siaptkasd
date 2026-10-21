(function () {
'use strict';


const PERAN = { ADMIN: 'ADMIN', GURU: 'GURU', SISWA: 'SISWA', TOKEN: 'TOKEN' };
const LABEL_PERAN = { ADMIN: 'Admin Utama', GURU: 'Guru', SISWA: 'Siswa', TOKEN: 'Peserta token' };
const MAPEL = { BIN: 'Bahasa Indonesia', MAT: 'Matematika', IPA: 'IPA' };
const MAPEL_URUT = ['BIN', 'MAT', 'IPA'];
const IKON_MAPEL = { BIN: 'book-open', MAT: 'grid', IPA: 'activity' };
const LABEL_JENIS = { PG: 'Pilihan ganda', MCMA: 'Pilihan ganda kompleks (MCMA)', BS: 'Benar–Salah' };
const LABEL_JENIS_PENDEK = { PG: 'Pilihan ganda', MCMA: 'MCMA', BS: 'Benar–Salah' };
const KUNCI_TEMA = 'siap_tka_tema';
const KUNCI_SESI = 'siap_tka_sesi';
const KUNCI_JENIS_SESI = 'siap_tka_jenis_sesi';
const KUNCI_PERANGKAT = 'siap_tka_perangkat';
const KUNCI_CADANGAN = 'siap_tka_cad_';
const KUNCI_SNAPSHOT = 'siap_tka_snap';

const LABEL_AKSI = {
  akses_ditolak: 'Akses ditolak', akun_dibuat: 'Akun dibuat', akun_dihapus: 'Akun dihapus', akun_diubah: 'Akun diubah',
  akun_status: 'Status akun', backup_dibuat: 'Backup dibuat', backup_gagal: 'Backup gagal', backup_uji_restore: 'Uji restore',
  identitas_diisi: 'Identitas diisi', identitas_diubah: 'Identitas diubah', paket_dibuat: 'Paket dibuat', paket_dihapus: 'Paket dihapus',
  paket_diubah: 'Paket diubah', paket_status: 'Status paket', paket_urutan: 'Urutan paket', password_direset: 'Password direset',
  password_diubah: 'Password diubah', pemasangan: 'Pemasangan', pengaturan_ditolak: 'Pengaturan ditolak', pengaturan_diubah: 'Pengaturan diubah',
  persetujuan_dicatat: 'Persetujuan dicatat (lama)', nama_disembunyikan: 'Nama disembunyikan di peringkat', nama_ditampilkan: 'Nama ditampilkan di peringkat', restore_berhasil: 'Restore berhasil', restore_gagal: 'Restore gagal', restore_mulai: 'Restore dimulai',
  sekolah_ditambah: 'Sekolah ditambah', sekolah_status: 'Status sekolah', soal_dibuat: 'Soal dibuat', soal_dihapus: 'Soal dihapus',
  soal_diubah: 'Soal diubah', soal_urutan: 'Urutan soal', username_diubah: 'Username diubah',
  koreksi_dihitung: 'Nilai dihitung ulang', koreksi_massal: 'Koreksi massal', percobaan_dibatalkan: 'Percobaan dibatalkan',
  peringkat_dibangun_ulang: 'Peringkat dibangun ulang', peserta_dianonimkan: 'Peserta dianonimkan', skema_dimigrasi: 'Skema data dimigrasi',
  token_dibuat: 'Kode ujian dibuat', token_dicabut: 'Kode ujian dicabut',
  media_unggah: 'Gambar diunggah', media_diubah: 'Gambar diubah', media_dihapus: 'Gambar dihapus', media_diagnosa: 'Uji tampil gambar',
  pembahasan_diunggah: 'Pembahasan diunggah', pembahasan_diganti: 'Pembahasan diganti', pembahasan_dilepas: 'Pembahasan dilepas',
  pembahasan_diunduh: 'Pembahasan diunduh', pembahasan_integritas_gagal: 'Pembahasan gagal uji keutuhan',
  materi_dibuat: 'Materi dibuat', materi_diubah: 'Info materi diubah', materi_status: 'Status materi diubah', materi_berkas_diunggah: 'Berkas materi diunggah',
  materi_berkas_diganti: 'Berkas materi diganti', materi_dihapus: 'Materi dihapus', materi_diunduh: 'Materi diunduh', materi_integritas_gagal: 'Berkas materi gagal uji keutuhan',
  banner_dibuat: 'Banner dibuat', banner_diubah: 'Banner diubah', banner_status: 'Status banner diubah', banner_urutan: 'Urutan banner diubah', banner_dihapus: 'Banner dihapus'
};
function labelAksi(k) { return LABEL_AKSI[k] || String(k || '').replace(/_/g, ' '); }

class Aman {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}
const PETA_ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(v) {
  return String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, function (c) { return PETA_ESC[c]; });
}
function dalam(v) {
  if (v === null || v === undefined || v === false || v === true) return '';
  if (v instanceof Aman) return v.s;
  if (Array.isArray(v)) return v.map(dalam).join('');
  return esc(v);
}
function h(teks) {
  let out = teks[0];
  for (let i = 1; i < teks.length; i++) out += dalam(arguments[i]) + teks[i];
  return new Aman(out);
}
function mentah(s) { return new Aman(String(s)); }
function pasang(el, aman) { if (el) el.innerHTML = aman instanceof Aman ? aman.s : esc(aman); }
function el(sel, akar) { return (akar || document).querySelector(sel); }
function semua(sel, akar) { return Array.prototype.slice.call((akar || document).querySelectorAll(sel)); }

function ikon(nama, kelas) {
  return new Aman('<svg class="ikon' + (kelas ? ' ' + esc(kelas) : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + esc(nama) + '"/></svg>');
}

function bacaLokal(jenis, k) {
  try { return (jenis === 'sesi' ? window.sessionStorage : window.localStorage).getItem(k); } catch (e) { return null; }
}
function simpanLokal(jenis, k, v) {
  try { (jenis === 'sesi' ? window.sessionStorage : window.localStorage).setItem(k, v); } catch (e) {   }
}
function hapusLokal(jenis, k) {
  try { (jenis === 'sesi' ? window.sessionStorage : window.localStorage).removeItem(k); } catch (e) {   }
}

const BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const BULAN_PANJANG = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
function dua(n) { return n < 10 ? '0' + n : String(n); }
function keWIB(iso) {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (isNaN(t)) return null;
  return new Date(t + 7 * 3600000);
}
function waktuWIB(iso) {
  const d = keWIB(iso);
  if (!d) return '—';
  return d.getUTCDate() + ' ' + BULAN_PENDEK[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + ', ' + dua(d.getUTCHours()) + '.' + dua(d.getUTCMinutes()) + ' WIB';
}
function tanggalWIB(iso) {
  const d = keWIB(iso);
  if (!d) return '—';
  return d.getUTCDate() + ' ' + BULAN_PENDEK[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
}
function tanggalLahirTeks(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || ''));
  if (!m) return '—';
  return (+m[3]) + ' ' + BULAN_PANJANG[+m[2] - 1] + ' ' + m[1];
}
function formatAngka(n, desimal) {
  const x = Number(n);
  if (!isFinite(x)) return '—';
  const d = desimal === undefined ? 0 : desimal;
  const bagian = x.toFixed(d).split('.');
  bagian[0] = bagian[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return bagian.join(',');
}
function inisial(nama) {
  const k = String(nama || '?').trim().split(/\s+/).filter(Boolean);
  if (!k.length) return '?';
  return (k[0].charAt(0) + (k.length > 1 ? k[k.length - 1].charAt(0) : '')).toUpperCase();
}
function hariIniISO() {
  const d = new Date(Date.now() + 7 * 3600000);
  return d.getUTCFullYear() + '-' + dua(d.getUTCMonth() + 1) + '-' + dua(d.getUTCDate());
}
function tahunLalu(n) {
  const d = new Date(Date.now() + 7 * 3600000);
  return (d.getUTCFullYear() - n) + '-' + dua(d.getUTCMonth() + 1) + '-' + dua(d.getUTCDate());
}
function tundaKe(fn, ms) {
  let t = null;
  return function () {
    const args = arguments, self = this;
    clearTimeout(t);
    t = setTimeout(function () { fn.apply(self, args); }, ms);
  };
}
function urlHttps(u) { return typeof u === 'string' && /^https:\/\/[^\s"'<>]+$/i.test(u) ? u : ''; }

function luminans(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
  if (!m) return null;
  const v = [0, 2, 4].map(function (i) {
    const c = parseInt(m[1].substr(i, 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
function kontras(a, b) {
  const la = luminans(a), lb = luminans(b);
  if (la === null || lb === null) return null;
  const t = Math.max(la, lb), r = Math.min(la, lb);
  return (t + 0.05) / (r + 0.05);
}
function gelapkan(hex, f) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
  if (!m) return hex;
  let s = '#';
  [0, 2, 4].forEach(function (i) {
    const c = Math.max(0, Math.round(parseInt(m[1].substr(i, 2), 16) * (1 - f)));
    s += (c < 16 ? '0' : '') + c.toString(16);
  });
  return s.toUpperCase();
}

function salin(teks) {
  return new Promise(function (selesai) {
    function cadangan() {
      const aktif = document.activeElement;
      try {
        const ta = document.createElement('textarea');
        ta.value = teks;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '0'; ta.style.left = '0'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { ta.setSelectionRange(0, teks.length); } catch (e) {   }
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (aktif && aktif.focus) aktif.focus();
        selesai(!!ok);
      } catch (e) { selesai(false); }
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(teks).then(function () { selesai(true); }, cadangan);
        return;
      }
    } catch (e) {   }
    cadangan();
  });
}

const S = {
  token: null,
  pengguna: null,
  profil: null,
  sembunyiNama: false,
  sekolah: [],
  info: { nama_aplikasi: 'Siap TKA SD', logo: '', warna_dominan: '#005EA4', kontak: '', mode_pemeliharaan: false, versi: '', belumDipasang: false },
  halaman: null,
  params: {},
  riwayat: [],
  navId: 0,
  rangkaPeran: null,
  tema: 'sistem',
  pemeliharaan: false,
  memulihkan: false,
  jenisSesi: null,
  percobaanToken: null,
  saatTinggal: null,
  sentuhan: 0,
  renderMulai: 0,
  senyapSampai: 0
};
function namaApp() { return S.info.nama_aplikasi || 'Siap TKA SD'; }


const Kaya = {
  AWALAN: '~r1:',
  KEDALAMAN_MAKS: 6,
  SIMPUL_MAKS: 800,
  BUTIR_DAFTAR_MAKS: 100,
  TEKS_SIMPUL_MAKS: 6000,
  ALT_MAKS: 300,
  SEL_MAKS: 45000,
  MASUKAN_MAKS: 200000,

  _FORMAT: { b: true, i: true, u: true, s: true, sup: true, sub: true },
  _RATA: { c: true, r: true, j: true },
  _KONTROL: /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g,


  _teksBersih: function (s) {
    return String(s).replace(/\r\n?|[\u0085\u2028\u2029]/g, '\n').replace(/\t/g, ' ').replace(Kaya._KONTROL, '')
      .replace(/[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g, '');
  },

  _konteks: function (media) { return { simpul: 0, lebih: false, media: media || null }; },

  _teksSaja: function (n, ctx, out, kedalaman) {
    if (ctx.simpul++ > Kaya.SIMPUL_MAKS) { ctx.lebih = true; return; }
    if (typeof n === 'string') { const s = Kaya._teksBersih(n); if (s.length > Kaya.TEKS_SIMPUL_MAKS) ctx.lebih = true; else if (s) out.push(s.replace(/\n/g, ' ')); return; }
    if (Array.isArray(n)) { for (let i = 0; i < n.length; i++) Kaya._teksSaja(n[i], ctx, out, kedalaman + 1); return; }
    if (!n || typeof n !== 'object') return;
    Kaya._teksSaja(n.c, ctx, out, kedalaman + 1);
    if (n.t === 'frac') { Kaya._teksSaja(n.n, ctx, out, kedalaman + 1); Kaya._teksSaja(n.d, ctx, out, kedalaman + 1); }
  },

  _sebaris: function (n, kedalaman, ctx, mat) {
    const out = [];
    Kaya._kumpul(n, kedalaman, ctx, mat, out);
    return Kaya._rapikan(out);
  },

  _kumpul: function (n, kedalaman, ctx, mat, out) {
    if (ctx.simpul++ > Kaya.SIMPUL_MAKS) { ctx.lebih = true; return; }
    if (typeof n === 'string') {
      const s = Kaya._teksBersih(n);
      if (s.length > Kaya.TEKS_SIMPUL_MAKS) { ctx.lebih = true; return; }
      const bagian = s.split('\n');
      for (let i = 0; i < bagian.length; i++) {
        if (i > 0) out.push(mat ? ' ' : { t: 'br' });
        if (bagian[i]) out.push(bagian[i]);
      }
      return;
    }
    if (Array.isArray(n)) { for (let i = 0; i < n.length; i++) Kaya._kumpul(n[i], kedalaman, ctx, mat, out); return; }
    if (!n || typeof n !== 'object') return;
    if (kedalaman >= Kaya.KEDALAMAN_MAKS) { Kaya._teksSaja(n, ctx, out, 0); return; }
    const t = typeof n.t === 'string' ? n.t : '';
    if (Kaya._FORMAT[t] === true) {
      const isi = Kaya._sebaris(n.c, kedalaman + 1, ctx, mat);
      if (!isi.length) return;
      if (mat && (t === 'u' || t === 's')) { for (let i = 0; i < isi.length; i++) out.push(isi[i]); return; }
      out.push({ t: t, c: isi });
      return;
    }
    if (t === 'br') { out.push(mat ? ' ' : { t: 'br' }); return; }
    if (t === 'frac') {
      const a = Kaya._sebaris(n.n, kedalaman + 1, ctx, true);
      const b = Kaya._sebaris(n.d, kedalaman + 1, ctx, true);
      if (mat) { for (let i = 0; i < a.length; i++) out.push(a[i]); out.push('/'); for (let j = 0; j < b.length; j++) out.push(b[j]); return; }
      if (a.length && b.length) out.push({ t: 'frac', n: a, d: b });
      else { for (let i = 0; i < a.length; i++) out.push(a[i]); for (let j = 0; j < b.length; j++) out.push(b[j]); }
      return;
    }
    if (t === 'sqrt') {
      const isi = Kaya._sebaris(n.c, kedalaman + 1, ctx, true);
      if (!isi.length) return;
      if (mat) { out.push('√('); for (let i = 0; i < isi.length; i++) out.push(isi[i]); out.push(')'); return; }
      out.push({ t: 'sqrt', c: isi });
      return;
    }
    if (t === 'img') {
      if (mat) return;
      const m = typeof n.m === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(n.m) ? n.m : '';
      if (m && ctx.media && ctx.media(m) === true) {
        const alt = typeof n.alt === 'string' ? Kaya._teksBersih(n.alt).replace(/\s+/g, ' ').trim().slice(0, Kaya.ALT_MAKS) : '';
        out.push({ t: 'img', m: m, alt: alt });
      }
      return;
    }
    Kaya._kumpul(n.c, kedalaman + 1, ctx, mat, out);
  },

  _rapikan: function (arr) {
    const out = [];
    for (let i = 0; i < arr.length; i++) {
      const x = arr[i];
      if (typeof x === 'string') {
        if (!x) continue;
        if (typeof out[out.length - 1] === 'string') out[out.length - 1] += x; else out.push(x);
      } else out.push(x);
    }
    return out;
  },

  _pangkas: function (arr) {
    const a = arr.slice();
    while (a.length && a[0] && a[0].t === 'br') a.shift();
    while (a.length && a[a.length - 1] && a[a.length - 1].t === 'br') a.pop();
    if (a.length && typeof a[0] === 'string') { a[0] = a[0].replace(/^\s+/, ''); if (!a[0]) a.shift(); }
    if (a.length && typeof a[a.length - 1] === 'string') { a[a.length - 1] = a[a.length - 1].replace(/\s+$/, ''); if (!a[a.length - 1]) a.pop(); }
    return a;
  },

  _adaIsi: function (arr) {
    for (let i = 0; i < arr.length; i++) {
      const x = arr[i];
      if (typeof x === 'string') { if (x.trim()) return true; } else if (x && x.t === 'img') return true;
      else if (x && x.t !== 'br' && Array.isArray(x.c) && Kaya._adaIsi(x.c)) return true;
      else if (x && x.t === 'frac') return true;
    }
    return false;
  },

  _blok: function (n, ctx, out) {
    if (ctx.simpul++ > Kaya.SIMPUL_MAKS) { ctx.lebih = true; return; }
    if (typeof n === 'string') {
      const s = Kaya._teksBersih(n);
      if (s.length > Kaya.TEKS_SIMPUL_MAKS * 4) { ctx.lebih = true; return; }
      s.split(/\n{2,}/).forEach(function (bagian) {
        const isi = Kaya._pangkas(Kaya._sebaris(bagian, 0, ctx, false));
        if (Kaya._adaIsi(isi)) out.push({ t: 'p', c: isi });
      });
      return;
    }
    if (Array.isArray(n)) { for (let i = 0; i < n.length; i++) Kaya._blok(n[i], ctx, out); return; }
    if (!n || typeof n !== 'object') return;
    const t = typeof n.t === 'string' ? n.t : '';
    if (t === 'ul' || t === 'ol') {
      const butir = [];
      const sumber = Array.isArray(n.i) ? n.i : [];
      if (sumber.length > Kaya.BUTIR_DAFTAR_MAKS * 4) ctx.lebih = true;
      for (let i = 0; i < sumber.length && butir.length < Kaya.BUTIR_DAFTAR_MAKS; i++) {
        const isi = Kaya._pangkas(Kaya._sebaris(sumber[i], 1, ctx, false));
        if (Kaya._adaIsi(isi)) butir.push(isi);
      }
      if (butir.length) out.push({ t: t, i: butir });
      return;
    }
    const isi = Kaya._pangkas(Kaya._sebaris(n.c, 0, ctx, false));
    if (!Kaya._adaIsi(isi)) return;
    const a = typeof n.a === 'string' && Kaya._RATA[n.a] === true ? n.a : '';
    out.push(a ? { t: 'p', a: a, c: isi } : { t: 'p', c: isi });
  },

  _dokumen: function (masuk, ctx) {
    const out = [];
    let sumber = masuk;
    if (typeof sumber === 'string') {
      if (sumber.length > Kaya.MASUKAN_MAKS) { ctx.lebih = true; return out; }
      if (sumber.indexOf(Kaya.AWALAN) === 0) {
        try { sumber = JSON.parse(sumber.slice(Kaya.AWALAN.length)); } catch (e) { sumber = masuk; }
      }
    } else if (sumber && typeof sumber === 'object' && !Array.isArray(sumber) && Array.isArray(sumber.b) && sumber.t === undefined) {
      sumber = sumber.b;
    }
    Kaya._blok(sumber, ctx, out);
    return out;
  },


  _teksSebaris: function (arr) {
    let s = '';
    for (let i = 0; i < arr.length; i++) {
      const x = arr[i];
      if (typeof x === 'string') s += x;
      else if (x.t === 'br') s += '\n';
      else if (x.t === 'frac') s += Kaya._teksSebaris(x.n) + '/' + Kaya._teksSebaris(x.d);
      else if (x.t === 'sqrt') s += '√(' + Kaya._teksSebaris(x.c) + ')';
      else if (x.t === 'img') s += '[gambar' + (x.alt ? ': ' + x.alt : '') + ']';
      else if (x.t === 'sup') s += '^(' + Kaya._teksSebaris(x.c) + ')';
      else s += Kaya._teksSebaris(x.c || []);
    }
    return s;
  },

  _teksDokumen: function (doc) {
    return doc.map(function (b) {
      if (b.t === 'ul' || b.t === 'ol') return b.i.map(function (isi, k) { return (b.t === 'ol' ? (k + 1) + '. ' : '• ') + Kaya._teksSebaris(isi); }).join('\n');
      return Kaya._teksSebaris(b.c);
    }).join('\n');
  },

  _adaGambar: function (arr) {
    for (let i = 0; i < arr.length; i++) {
      const x = arr[i];
      if (x && typeof x === 'object') {
        if (x.t === 'img') return true;
        if (Array.isArray(x.c) && Kaya._adaGambar(x.c)) return true;
      }
    }
    return false;
  },

  _gambarDokumen: function (doc) {
    const ids = [];
    const telusuri = function (arr) {
      arr.forEach(function (x) {
        if (x && typeof x === 'object') {
          if (x.t === 'img') ids.push(x.m);
          if (Array.isArray(x.c)) telusuri(x.c);
        }
      });
    };
    doc.forEach(function (b) { if (b.t === 'ul' || b.t === 'ol') b.i.forEach(telusuri); else telusuri(b.c); });
    return ids;
  },

  _polos: function (doc) {
    const bagian = [];
    for (let i = 0; i < doc.length; i++) {
      const b = doc[i];
      if (b.t !== 'p' || b.a) return null;
      let s = '';
      let setelahBr = false;
      for (let k = 0; k < b.c.length; k++) {
        const x = b.c[k];
        if (typeof x === 'string') { s += x; setelahBr = false; } else if (x.t === 'br' && !setelahBr) { s += '\n'; setelahBr = true; } else return null;
      }
      bagian.push(s);
    }
    const teks = bagian.join('\n\n');
    return teks.indexOf(Kaya.AWALAN) === 0 ? null : teks;
  },


  bersihkan: function (masuk, opsi) {
    const o = opsi || {};
    const nama = o.nama || 'Isian';
    const ctx = Kaya._konteks(o.media);
    const doc = Kaya._dokumen(masuk, ctx);
    if (ctx.lebih) throw new Galat(nama + ' terlalu panjang atau terlalu rumit.', 'VALIDASI');
    const teks = Kaya._teksDokumen(doc);
    const adaGambar = doc.some(function (b) { return Kaya._adaGambar(b.t === 'ul' || b.t === 'ol' ? [].concat.apply([], b.i) : b.c); });
    if (!teks.trim()) {
      if (o.wajib) throw new Galat(nama + ' wajib diisi.', 'VALIDASI');
      return '';
    }
    if (o.min && teks.trim().length < o.min && !adaGambar) throw new Galat(nama + ' minimal ' + o.min + ' karakter.', 'VALIDASI');
    if (o.maks && teks.length > o.maks) throw new Galat(nama + ' maksimal ' + o.maks + ' karakter.', 'VALIDASI');
    const polos = Kaya._polos(doc);
    const ser = polos !== null ? polos : Kaya.AWALAN + JSON.stringify(doc);
    if (ser.length > Math.min(Kaya.SEL_MAKS, (o.maks || 5000) * 6 + 2000)) throw new Galat(nama + ' terlalu panjang atau terlalu rumit.', 'VALIDASI');
    return ser;
  },

  pohon: function (nilai) {
    const ctx = Kaya._konteks(function () { return true; });
    try { return Kaya._dokumen(nilai === null || nilai === undefined ? '' : nilai, ctx); } catch (e) { return []; }
  },

  teks: function (nilai) {
    return Kaya._teksDokumen(Kaya.pohon(nilai));
  },

  gambar: function (nilai) {
    return Kaya._gambarDokumen(Kaya.pohon(nilai));
  },

  hitungGambarMentah: function (nilai) {
    let v = nilai;
    if (typeof v === 'string') {
      if (v.indexOf(Kaya.AWALAN) !== 0) return 0;
      try { v = JSON.parse(v.slice(Kaya.AWALAN.length)); } catch (e) { return 0; }
    }
    let n = 0;
    const tumpuk = [[v, 0]];
    let langkah = 0;
    while (tumpuk.length && langkah++ < 100000) {
      const it = tumpuk.pop();
      const x = it[0], d = it[1];
      if (d > 64 || !x || typeof x !== 'object') continue;
      if (Array.isArray(x)) { for (let i = 0; i < x.length; i++) tumpuk.push([x[i], d + 1]); continue; }
      if (x.t === 'img') n++;
      ['c', 'n', 'd', 'i'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') tumpuk.push([x[k], d + 1]); });
    }
    return n;
  },

  kosong: function (nilai) {
    const doc = Kaya.pohon(nilai);
    if (!doc.length) return true;
    return !Kaya._teksDokumen(doc).trim() && Kaya._gambarDokumen(doc).length === 0;
  }
};


const WARNA_BAWAAN = '#005EA4';
const WARNA_KONTRAS_MIN = 4.5;
const WARNA_PERMUKAAN = {
  terang: { bg: '#F8FAFC', surface: '#FFFFFF', 'surface-2': '#F1F5F9' },
  gelap: { bg: '#0B1220', surface: '#111B2E', 'surface-2': '#16233A' }
};
const WARNA_PRESET = [
  { id: 'biru', nama: 'Biru (bawaan)', warna: '#005EA4' },
  { id: 'hijau', nama: 'Hijau', warna: '#0B6B3A' },
  { id: 'teal', nama: 'Teal', warna: '#0F766E' },
  { id: 'ungu', nama: 'Ungu', warna: '#5B2A9E' },
  { id: 'marun', nama: 'Merah marun', warna: '#9B1C31' },
  { id: 'oranye', nama: 'Oranye tua', warna: '#B45309' },
  { id: 'baja', nama: 'Abu-abu baja', warna: '#475569' }
];

function wrUrai(hex) {
  if (typeof hex !== 'string') return null;
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) return null;
  return [0, 2, 4].map(function (i) { return parseInt(m[1].substr(i, 2), 16); });
}
function wrHex(rgb) {
  return '#' + rgb.map(function (v) {
    const n = Math.max(0, Math.min(255, Math.round(v)));
    return (n < 16 ? '0' : '') + n.toString(16);
  }).join('').toUpperCase();
}
function wrLum(rgb) {
  const c = rgb.map(function (v) {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function wrRasio(a, b) {
  const la = wrLum(a), lb = wrLum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
function wrHsl(rgb) {
  const r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let hh;
  if (mx === r) hh = (g - b) / d + (g < b ? 6 : 0);
  else if (mx === g) hh = (b - r) / d + 2;
  else hh = (r - g) / d + 4;
  return [hh / 6, s, l];
}
function wrRgb(hh, s, l) {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = function (t) {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [Math.round(f(hh + 1 / 3) * 255), Math.round(f(hh) * 255), Math.round(f(hh - 1 / 3) * 255)];
}
function wrCampur(a, b, t) {
  return [0, 1, 2].map(function (i) { return Math.round(a[i] * (1 - t) + b[i] * t); });
}
function wrTerendah(rgb, daftarLatar) {
  let m = Infinity;
  daftarLatar.forEach(function (lt) { const r = wrRasio(rgb, lt); if (r < m) m = r; });
  return m;
}

function wrGeser(rgb, arah, ok) {
  if (ok(rgb)) return rgb;
  const hsl = wrHsl(rgb);
  let dekat = hsl[2], jauh = arah < 0 ? 0 : 1;
  let terbaik = wrRgb(hsl[0], hsl[1], jauh);
  for (let i = 0; i < 40; i++) {
    const tengah = (dekat + jauh) / 2;
    const c = wrRgb(hsl[0], hsl[1], tengah);
    if (ok(c)) { terbaik = c; jauh = tengah; } else dekat = tengah;
  }
  return terbaik;
}
function wrGelapSampai(rgb, daftarLatar, min) {
  return wrGeser(rgb, -1, function (c) { return wrTerendah(c, daftarLatar) >= min; });
}
function wrTerangSampai(rgb, daftarLatar, min) {
  return wrGeser(rgb, 1, function (c) { return wrTerendah(c, daftarLatar) >= min; });
}
function wrLumMaks(rgb, maks) { return wrGeser(rgb, -1, function (c) { return wrLum(c) <= maks; }); }
function wrLumSasaran(rgb, sasaran) {
  const hsl = wrHsl(rgb);
  let a = 0, b = 1, hasil = rgb;
  for (let i = 0; i < 40; i++) {
    const t = (a + b) / 2;
    const c = wrRgb(hsl[0], hsl[1], t);
    hasil = c;
    if (wrLum(c) < sasaran) a = t; else b = t;
  }
  return hasil;
}

function wrLembutkan(rgb, k) {
  const hsl = wrHsl(rgb);
  return wrRgb(hsl[0], hsl[1] * k, hsl[2]);
}

const WR_PUTIH = [255, 255, 255];
const WR_HITAM = [0, 0, 0];

function turunkanTema(hex) {
  const p = wrUrai(hex);
  if (!p) return { ok: false, alasan: 'format', pesan: 'Warna harus berformat #RRGGBB.' };
  const kPutih = wrRasio(p, WR_PUTIH);
  if (kPutih < WARNA_KONTRAS_MIN) return { ok: false, alasan: 'kontras', pesan: 'Warna ini terlalu terang: kontras dengan teks putih hanya ' + formatAngka(kPutih, 1) + ' : 1 (minimal 4,5 : 1).' };

  const L = WARNA_PERMUKAAN.terang;
  const lBg = wrUrai(L.bg), lSf = wrUrai(L.surface), lS2 = wrUrai(L['surface-2']);
  const utama = p;
  const hover = wrCampur(p, WR_HITAM, 0.18);
  const lembut = wrCampur(p, WR_PUTIH, 0.9);
  const teksAksen = wrGelapSampai(p, [lBg, lSf, lS2, lembut], WARNA_KONTRAS_MIN);
  const diLembut = wrGelapSampai(p, [lembut], 7);
  const sbBg = wrLum(p) <= 0.055 ? p : wrLumMaks(p, 0.055);
  const hoverSb = wrCampur(sbBg, WR_PUTIH, 0.12);
  const sbRedam = wrTerangSampai(wrCampur(sbBg, WR_PUTIH, 0.6), [sbBg, hoverSb], 5.5);
  const header = wrLum(p) <= 0.035 ? p : wrLumMaks(p, 0.035);
  const terang = {
    primary: wrHex(utama), 'primary-hover': wrHex(hover), 'on-primary': '#FFFFFF', 'primary-text': wrHex(teksAksen),
    'primary-soft': wrHex(lembut), 'on-primary-soft': wrHex(diLembut), focus: wrHex(utama),
    'sidebar-bg': wrHex(sbBg), 'sidebar-text': '#FFFFFF', 'sidebar-muted': wrHex(sbRedam),
    'sidebar-active-bg': '#FFFFFF', 'sidebar-active-text': wrHex(sbBg), 'navy-header': wrHex(header)
  };

  const G = WARNA_PERMUKAAN.gelap;
  const gBg = wrUrai(G.bg), gSf = wrUrai(G.surface), gS2 = wrUrai(G['surface-2']);
  const uG = wrLumSasaran(p, 0.158);
  const hoverG = wrCampur(uG, WR_HITAM, 0.15);
  const lembutG = wrCampur(uG, gSf, 0.7);
  const teksAksenG = wrTerangSampai(wrLembutkan(uG, 0.6), [gBg, gSf, gS2, lembutG], 7);
  const diLembutG = wrTerangSampai(wrLembutkan(uG, 0.6), [lembutG], 7);
  const sbBgG = wrLumMaks(p, 0.02);
  const hoverSbG = wrCampur(sbBgG, WR_PUTIH, 0.1);
  const sbRedamG = wrTerangSampai(wrLembutkan(wrCampur(sbBgG, WR_PUTIH, 0.6), 0.6), [sbBgG, hoverSbG], 5.5);
  const headerG = wrLumMaks(p, 0.012);
  const gelap = {
    primary: wrHex(uG), 'primary-hover': wrHex(hoverG), 'on-primary': '#FFFFFF', 'primary-text': wrHex(teksAksenG),
    'primary-soft': wrHex(lembutG), 'on-primary-soft': wrHex(diLembutG),
    'sidebar-bg': wrHex(sbBgG), 'sidebar-text': '#F1F6FF', 'sidebar-muted': wrHex(sbRedamG),
    'sidebar-active-bg': '#E8EEF8', 'sidebar-active-text': wrHex(sbBgG), 'navy-header': wrHex(headerG)
  };
  return { ok: true, warna: wrHex(p), terang: terang, gelap: gelap };
}

const WARNA_PASANGAN = [
  ['on-primary', 'primary', 4.5, 'tombol utama'], ['on-primary', 'primary-hover', 4.5, 'tombol utama saat disorot'],
  ['primary-text', 'bg', 4.5, 'teks aksen di kanvas'], ['primary-text', 'surface', 4.5, 'teks aksen di kartu'], ['primary-text', 'surface-2', 4.5, 'teks aksen di isian halus'],
  ['primary-text', 'primary-soft', 4.5, 'teks aksen di latar lembut'], ['on-primary-soft', 'primary-soft', 4.5, 'item terpilih'],
  ['sidebar-text', 'sidebar-bg', 4.5, 'menu samping'], ['sidebar-muted', 'sidebar-bg', 4.5, 'judul bagian menu samping'],
  ['sidebar-text', 'sidebar-hover', 4.5, 'menu samping saat disorot'], ['sidebar-muted', 'sidebar-hover', 4.5, 'judul menu saat disorot'],
  ['sidebar-active-text', 'sidebar-active-bg', 4.5, 'menu samping aktif'], ['sidebar-text', 'navy-header', 4.5, 'bilah header'],
  ['primary', 'surface', 3, 'tepi tombol utama terhadap kartu (non-teks)'], ['primary', 'bg', 3, 'tepi tombol utama terhadap kanvas (non-teks)']
];
function periksaPasangan(tema) {
  const hasil = [];
  ['terang', 'gelap'].forEach(function (mode) {
    const t = tema[mode];
    const perm = WARNA_PERMUKAAN[mode];
    const nilai = function (nama) {
      if (nama === 'sidebar-hover') return wrCampur(wrUrai(t['sidebar-bg']), WR_PUTIH, mode === 'terang' ? 0.12 : 0.1);
      return wrUrai(t[nama] || perm[nama]);
    };
    WARNA_PASANGAN.forEach(function (x) {
      const r = wrRasio(nilai(x[0]), nilai(x[1]));
      hasil.push({ mode: mode, teks: x[0], latar: x[1], rasio: Math.round(r * 100) / 100, min: x[2], ok: r >= x[2], ket: x[3] });
    });
  });
  const lg = wrLum(wrUrai(tema.gelap.primary));
  hasil.push({ mode: 'gelap', teks: 'primary', latar: 'jendela luminans', rasio: Math.round(lg * 1000) / 1000, min: 0.133, ok: lg >= 0.133 && lg <= 0.183, ket: 'warna utama gelap di jendela [0,133; 0,183]' });
  return hasil;
}

function ringkasKeterbacaan(tema) {
  const cek = periksaPasangan(tema);
  const gagal = cek.filter(function (x) { return !x.ok; }).length;
  if (!gagal) return { ok: true, jumlah: cek.length, gagal: 0, teks: 'Semua ' + cek.length + ' pemeriksaan keterbacaan lolos di tema terang dan gelap. Di tema gelap, warna utama disesuaikan otomatis agar tetap terbaca.' };
  return { ok: false, jumlah: cek.length, gagal: gagal, teks: gagal + ' dari ' + cek.length + ' pemeriksaan keterbacaan tidak lolos untuk warna ini. Pilih warna lain.' };
}

function cssTema(tema, hanyaDaftar) {
  if (!tema || !tema.ok) return '';
  const blok = function (o) { return Object.keys(o).map(function (k) { return '--' + k + ':' + o[k] + ';'; }).join(''); };
  return ':root:not([data-theme="dark"]){' + blok(tema.terang) + '}:root[data-theme="dark"]{' + blok(tema.gelap) + '}';
}


const Galat = class Galat extends Error {
  constructor(pesan, kode) { super(pesan); this.name = 'Galat'; this.kode = kode || 'GALAT'; }
};

const mediaPeta = Object.create(null);
function mediaGabung(peta) {
  if (!peta || typeof peta !== 'object') return;
  Object.keys(peta).forEach(function (id) {
    const e = peta[id];
    if (!e || typeof e !== 'object' || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) return;
    const u = urlHttps(e.u);
    if (!u) return;
    mediaPeta[id] = { u: u, w: Math.max(0, parseInt(e.w, 10) || 0), h: Math.max(0, parseInt(e.h, 10) || 0) };
  });
}
function mediaInfo(id) { return typeof id === 'string' && id in mediaPeta ? mediaPeta[id] : null; }

const KY_TAG = { b: 'strong', i: 'em', u: 'u', s: 's', sup: 'sup', sub: 'sub' };

function kayaTeks(nilai) { return Kaya.teks(nilai); }
function kayaKosong(nilai) { return Kaya.kosong(nilai); }

function kayaIsi(arr, o) {
  let s = '';
  for (let i = 0; i < arr.length; i++) s += kayaSimpul(arr[i], o);
  return s;
}

function kayaSimpul(x, o) {
  if (typeof x === 'string') return esc(x);
  if (!x || typeof x !== 'object') return '';
  const t = x.t;
  if (t === 'br') return '<br>';
  if (t === 'frac') {
    const teks = Kaya._teksSebaris(x.n) + ' per ' + Kaya._teksSebaris(x.d);
    const atom = o.penyunting ? ' contenteditable="false" tabindex="0" data-ky="frac" data-n="' + esc(JSON.stringify(x.n)) + '" data-d="' + esc(JSON.stringify(x.d)) + '"' : '';
    return '<span class="ky-pecahan" role="' + (o.penyunting ? 'button' : 'math') + '" aria-label="' + esc((o.penyunting ? 'Ubah pecahan: ' : '') + teks) + '"' + atom + '>' +
      '<span class="ky-pb" aria-hidden="true">' + kayaIsi(x.n, o) + '</span><span class="ky-pn" aria-hidden="true">' + kayaIsi(x.d, o) + '</span></span>';
  }
  if (t === 'sqrt') {
    const teks = 'akar dari ' + Kaya._teksSebaris(x.c);
    const atom = o.penyunting ? ' contenteditable="false" tabindex="0" data-ky="sqrt" data-c="' + esc(JSON.stringify(x.c)) + '"' : '';
    return '<span class="ky-akar" role="' + (o.penyunting ? 'button' : 'math') + '" aria-label="' + esc((o.penyunting ? 'Ubah akar: ' : '') + teks) + '"' + atom + '>' +
      '<span class="ky-tanda" aria-hidden="true">\u221A</span><span class="ky-isi" aria-hidden="true">' + kayaIsi(x.c, o) + '</span></span>';
  }
  if (t === 'img') return kayaGambar(x, o);
  const tag = KY_TAG[t];
  if (!tag) return kayaIsi(Array.isArray(x.c) ? x.c : [], o);
  return '<' + tag + '>' + kayaIsi(Array.isArray(x.c) ? x.c : [], o) + '</' + tag + '>';
}

function kayaGambar(x, o) {
  const info = typeof o.gambar === 'function' ? o.gambar(x.m) : mediaInfo(x.m);
  const url = urlHttps(info && typeof info === 'object' ? info.u : info);
  const label = 'Gambar' + (x.alt ? ': ' + x.alt : '');
  const atom = o.penyunting ? ' contenteditable="false" tabindex="0" role="button" aria-label="' + esc('Ubah ' + label.charAt(0).toLowerCase() + label.slice(1)) + '" data-ky="img" data-m="' + esc(x.m) + '" data-alt="' + esc(x.alt) + '"' : '';
  if (!url) return '<span class="ky-gambar-kosong" ' + (o.penyunting ? '' : 'role="img" aria-label="' + esc(label) + '"') + atom + '>[gambar]</span>';
  const w = info && typeof info === 'object' ? (info.w | 0) : 0, hh = info && typeof info === 'object' ? (info.h | 0) : 0;
  const ukuran = w > 0 && hh > 0 ? ' width="' + w + '" height="' + hh + '"' : '';
  return '<span class="ky-gambar-bungkus"' + atom + '><img class="ky-gambar" src="' + esc(url) + '" alt="' + esc(o.penyunting ? '' : (x.alt || '')) + '"' + ukuran + ' loading="lazy" decoding="async" draggable="false"></span>';
}

function kayaBlokTampil(b, o) {
  if (b.t === 'ul' || b.t === 'ol') {
    let s = '<span class="ky-daftar ky-' + b.t + '" role="list">';
    for (let i = 0; i < b.i.length; i++) s += '<span class="ky-butir" role="listitem">' + kayaIsi(b.i[i], o) + '</span>';
    return s + '</span>';
  }
  return '<span class="ky-p' + (b.a ? ' ky-rata-' + b.a : '') + '">' + kayaIsi(b.c, o) + '</span>';
}

function kayaBlokPenyunting(b, o) {
  if (b.t === 'ul' || b.t === 'ol') {
    let s = '<' + b.t + '>';
    for (let i = 0; i < b.i.length; i++) s += '<li>' + kayaIsi(b.i[i], o) + '</li>';
    return s + '</' + b.t + '>';
  }
  return '<p' + (b.a ? ' class="ky-rata-' + b.a + '"' : '') + '>' + kayaIsi(b.c, o) + '</p>';
}

function kayaHtml(nilai, opsi) {
  const o = opsi || {};
  return new Aman(Kaya.pohon(nilai).map(function (b) { return kayaBlokTampil(b, o); }).join(''));
}

function kayaHtmlPenyunting(nilai, opsi) {
  const o = Object.assign({}, opsi || {}, { penyunting: true });
  return new Aman(Kaya.pohon(nilai).map(function (b) { return kayaBlokPenyunting(b, o); }).join(''));
}


const AKSI = {};
const KIRIM = {};
const MASUKAN = {};

function toast(pesan, jenis, lama) {
  const wadah = el('#toast-wadah');
  if (!wadah) return;
  const j = jenis || 'info';
  const kotak = document.createElement('div');
  kotak.className = 'toast' + (j === 'sukses' ? ' toast-sukses' : (j === 'galat' ? ' toast-galat' : ''));
  kotak.setAttribute('role', j === 'galat' ? 'alert' : 'status');
  pasang(kotak, h`${ikon(j === 'sukses' ? 'check-circle' : (j === 'galat' ? 'alert-circle' : 'info'))}<div class="isi">${pesan}</div><button type="button" aria-label="Tutup notifikasi">${ikon('x', 'ikon-sm')}</button>`);
  wadah.appendChild(kotak);
  while (wadah.children.length > 4) wadah.removeChild(wadah.firstChild);
  function tutup() { if (kotak.parentNode) kotak.parentNode.removeChild(kotak); }
  kotak.querySelector('button').addEventListener('click', tutup);
  setTimeout(tutup, lama || (j === 'galat' ? 9000 : 5000));
  return kotak;
}

function bersihkanToast() {
  const wadah = el('#toast-wadah');
  if (wadah) pasang(wadah, '');
}

const tumpukanModal = [];
let urutModal = 0;
const GAYA_TOMBOL = { utama: 'tombol', diam: 'tombol tombol-diam', bahaya: 'tombol tombol-bahaya', garis: 'tombol tombol-garis', polos: 'tombol tombol-polos', 'bahaya-garis': 'tombol tombol-bahaya-garis' };

function aturInertLatar() {
  const akar = el('#akar');
  if (!akar) return;
  const aktif = tumpukanModal.length > 0;
  try { akar.inert = aktif; } catch (e) {   }
  if (aktif) akar.setAttribute('aria-hidden', 'true'); else akar.removeAttribute('aria-hidden');
  document.body.style.overflow = aktif ? 'hidden' : '';
}

function modal(opsi) {
  const id = 'm' + (++urutModal);
  const aksi = opsi.aksi || [];
  const sebelumnya = document.activeElement;
  const latar = document.createElement('div');
  latar.className = 'modal-latar';
  pasang(latar, h`<div class="modal${opsi.lebar ? ' modal-lebar' : ''}" role="dialog" aria-modal="true" aria-labelledby="${id}-j" tabindex="-1">
    <div class="modal-kepala"><h2 id="${id}-j">${opsi.judul}</h2>${opsi.tahan ? '' : h`<button type="button" class="tombol tombol-polos tombol-ikon" data-modal="tutup" aria-label="Tutup">${ikon('x')}</button>`}</div>
    <div class="modal-badan">${opsi.badan}</div>
    ${aksi.length ? h`<div class="modal-kaki">${aksi.map(function (a, i) {
      return h`<button type="${a.tipe === 'submit' ? 'submit' : 'button'}" class="${GAYA_TOMBOL[a.gaya || 'diam']}" data-modal-aksi="${i}"${a.form ? mentah(' form="' + esc(a.form) + '"') : ''}>${a.label}</button>`;
    })}</div>` : ''}
  </div>`);
  let ditutup = false;
  let selesaiFn;
  const selesai = new Promise(function (r) { selesaiFn = r; });
  const dialog = latar.firstElementChild;
  const api = {
    el: dialog, latar: latar, tahan: !!opsi.tahan, selesai: selesai,
    tutup: function (nilai) {
      if (ditutup) return;
      ditutup = true;
      const i = tumpukanModal.indexOf(api);
      if (i >= 0) tumpukanModal.splice(i, 1);
      if (latar.parentNode) latar.parentNode.removeChild(latar);
      aturInertLatar();
      if (sebelumnya && sebelumnya.focus && document.body.contains(sebelumnya)) { try { sebelumnya.focus(); } catch (e) {   } }
      selesaiFn(nilai === undefined ? null : nilai);
    },
    ganti: function (aman) { pasang(el('.modal-badan', dialog), aman); }
  };
  latar.addEventListener('mousedown', function (e) {
    if (e.target === latar && !api.tahan) api.tutup(null);
  });
  latar.addEventListener('click', function (e) {
    const t = e.target.closest ? e.target.closest('[data-modal]') : null;
    if (t && t.getAttribute('data-modal') === 'tutup') { api.tutup(null); return; }
    const b = e.target.closest ? e.target.closest('[data-modal-aksi]') : null;
    if (!b || b.getAttribute('aria-disabled') === 'true') return;
    const a = aksi[+b.getAttribute('data-modal-aksi')];
    if (!a) return;
    if (a.onKlik) a.onKlik(api, b, e);
    else if (a.tipe !== 'submit') api.tutup(a.id === undefined ? null : a.id);
  });
  document.body.appendChild(latar);
  tumpukanModal.push(api);
  aturInertLatar();
  if (opsi.saatBuka) opsi.saatBuka(api);
  setTimeout(function () {
    if (ditutup) return;
    const fokus = dialog.querySelector('[autofocus]') ||
      dialog.querySelector('.modal-badan input:not([type=hidden]):not([readonly]):not([disabled]), .modal-badan select:not([disabled]), .modal-badan textarea:not([disabled])') ||
      dialog.querySelector('.modal-kaki button') || dialog;
    try { fokus.focus(); } catch (e) {   }
  }, 30);
  return api;
}
function modalTeratas() { return tumpukanModal.length ? tumpukanModal[tumpukanModal.length - 1] : null; }
function tutupSemuaModal() { while (tumpukanModal.length) tumpukanModal[tumpukanModal.length - 1].tutup(null); }

document.addEventListener('keydown', function (e) {
  const m = modalTeratas();
  if (!m) return;
  if (e.key === 'Escape' && !m.tahan) { e.preventDefault(); m.tutup(null); return; }
  if (e.key !== 'Tab') return;
  const fokusbisa = semua('a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', m.el)
    .filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
  if (!fokusbisa.length) { e.preventDefault(); m.el.focus(); return; }
  const awal = fokusbisa[0], akhir = fokusbisa[fokusbisa.length - 1];
  if (!m.el.contains(document.activeElement)) { e.preventDefault(); (e.shiftKey ? akhir : awal).focus(); return; }
  if (e.shiftKey && (document.activeElement === awal || document.activeElement === m.el)) { e.preventDefault(); akhir.focus(); }
  else if (!e.shiftKey && document.activeElement === akhir) { e.preventDefault(); awal.focus(); }
});

function konfirmasi(o) {
  return new Promise(function (selesai) {
    const api = modal({
      judul: o.judul || 'Konfirmasi',
      badan: o.badan || h`<p class="tanpa-margin">${o.pesan}</p>`,
      aksi: [
        { id: 'batal', label: o.batal || 'Batal', gaya: 'diam' },
        { id: 'ya', label: o.ya || 'Ya, lanjutkan', gaya: o.bahaya ? 'bahaya' : 'utama' }
      ]
    });
    api.selesai.then(function (v) { selesai(v === 'ya'); });
  });
}

let urutGalat = 0;
function nilaiForm(form) {
  const o = {};
  Array.prototype.forEach.call(form.elements, function (e) {
    if (!e.name || e.disabled) return;
    if (e.type === 'radio') { if (e.checked) o[e.name] = e.value; else if (!(e.name in o)) o[e.name] = ''; }
    else if (e.type === 'checkbox') o[e.name] = e.checked;
    else if (e.type === 'password') o[e.name] = e.value;
    else o[e.name] = String(e.value).trim();
  });
  return o;
}
function bersihGalat(form) {
  semua('.galat-isian', form).forEach(function (n) { n.parentNode.removeChild(n); });
  semua('[aria-invalid="true"]', form).forEach(function (n) { n.removeAttribute('aria-invalid'); n.removeAttribute('aria-describedby'); });
  const w = el('[data-galat]', form);
  if (w) w.innerHTML = '';
}
function galatForm(form, pesan) {
  const w = el('[data-galat]', form);
  if (!w) { toast(pesan, 'galat'); return; }
  pasang(w, h`<div class="peringatan peringatan-bahaya" role="alert">${ikon('alert-circle')}<div><p>${pesan}</p></div></div>`);
}
function galatIsian(form, nama, pesan) {
  const f = form.elements[nama];
  const kolom = f && (f.length !== undefined && !f.tagName ? f[0] : f);
  if (!kolom) { galatForm(form, pesan); return false; }
  const id = 'ge' + (++urutGalat);
  const p = document.createElement('p');
  p.className = 'galat-isian';
  p.id = id;
  p.setAttribute('role', 'alert');
  pasang(p, h`${ikon('alert-circle')}<span>${pesan}</span>`);
  const pembungkus = kolom.closest('.isian') || kolom.parentNode;
  pembungkus.appendChild(p);
  kolom.setAttribute('aria-invalid', 'true');
  kolom.setAttribute('aria-describedby', id);
  try { kolom.focus(); } catch (e) {   }
  return false;
}
document.addEventListener('input', function (e) {
  const t = e.target;
  if (t && t.getAttribute && t.getAttribute('aria-invalid') === 'true') {
    t.removeAttribute('aria-invalid');
    const d = t.getAttribute('aria-describedby');
    t.removeAttribute('aria-describedby');
    const g = d ? document.getElementById(d) : null;
    if (g && g.parentNode) g.parentNode.removeChild(g);
  }
});

function kerjakan(tombol, fn, labelMemuat) {
  if (tombol && tombol.getAttribute('aria-busy') === 'true') return Promise.resolve();
  const awal = tombol ? tombol.innerHTML : '';
  if (tombol) {
    tombol.setAttribute('aria-busy', 'true');
    tombol.setAttribute('aria-disabled', 'true');
    tombol.classList.add('memuat');
    pasang(tombol, h`<span class="spinner" aria-hidden="true"></span><span>${labelMemuat || 'Memproses…'}</span>`);
  }
  function pulih() {
    if (tombol && document.body.contains(tombol)) {
      tombol.removeAttribute('aria-busy');
      tombol.removeAttribute('aria-disabled');
      tombol.classList.remove('memuat');
      tombol.innerHTML = awal;
    }
  }
  let janji;
  try { janji = Promise.resolve(fn()); } catch (e) { janji = Promise.reject(e); }
  return janji.then(function (v) { pulih(); return v; }, function (e) { pulih(); throw e; });
}
function tombolKirim(form) {
  return el('[type="submit"]', form) || (form.id ? el('[type="submit"][form="' + form.id + '"]') : null);
}

function temaEfektif(p) {
  if (p === 'terang' || p === 'gelap') return p;
  try { return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang'; } catch (e) { return 'terang'; }
}
function terapkanTema(pilihan) {
  S.tema = pilihan;
  document.documentElement.setAttribute('data-theme', temaEfektif(pilihan) === 'gelap' ? 'dark' : 'light');
  semua('[data-aksi="tema"]').forEach(function (b) {
    const gelap = temaEfektif(S.tema) === 'gelap';
    b.setAttribute('aria-label', gelap ? 'Ganti ke tema terang' : 'Ganti ke tema gelap');
    b.setAttribute('title', gelap ? 'Ganti ke tema terang' : 'Ganti ke tema gelap');
    pasang(b, ikon(gelap ? 'sun' : 'moon'));
  });
}
function simpanTema(pilihan) {
  if (pilihan === 'sistem') hapusLokal('lokal', KUNCI_TEMA); else simpanLokal('lokal', KUNCI_TEMA, pilihan);
  terapkanTema(pilihan);
}
function muatTema() {
  const t = bacaLokal('lokal', KUNCI_TEMA);
  terapkanTema(t === 'terang' || t === 'gelap' ? t : 'sistem');
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const ubah = function () { if (S.tema === 'sistem') terapkanTema('sistem'); };
    if (mq.addEventListener) mq.addEventListener('change', ubah); else if (mq.addListener) mq.addListener(ubah);
  } catch (e) {   }
}
AKSI.tema = function () { simpanTema(temaEfektif(S.tema) === 'gelap' ? 'terang' : 'gelap'); };

function terapkanMerek() {
  let gaya = el('#gaya-merek');
  if (!gaya) { gaya = document.createElement('style'); gaya.id = 'gaya-merek'; document.head.appendChild(gaya); }
  const w = String(S.info.warna_dominan || '').toUpperCase();
  const t = w === WARNA_BAWAAN ? null : turunkanTema(w);
  gaya.textContent = t && t.ok ? cssTema(t) : '';
}

document.addEventListener('click', function (e) {
  const t = e.target.closest ? e.target.closest('[data-aksi]') : null;
  if (!t) return;
  if (t.getAttribute('aria-disabled') === 'true' || t.disabled) { e.preventDefault(); return; }
  const f = AKSI[t.getAttribute('data-aksi')];
  if (!f) return;
  if (t.tagName === 'A') e.preventDefault();
  f(t, e);
});
document.addEventListener('submit', function (e) {
  const form = e.target;
  const nama = form && form.getAttribute ? form.getAttribute('data-kirim') : null;
  if (!nama) return;
  e.preventDefault();
  const f = KIRIM[nama];
  if (f && form.getAttribute('data-sibuk') !== 'ya') f(form, e);
});
function delegasiMasukan(e) {
  const t = e.target.closest ? e.target.closest('[data-masuk]') : null;
  if (!t) return;
  const f = MASUKAN[t.getAttribute('data-masuk')];
  if (f) f(t, e);
}
document.addEventListener('input', delegasiMasukan);
document.addEventListener('change', delegasiMasukan);

AKSI['lihat-sandi'] = function (tombol) {
  const input = tombol.parentNode.querySelector('input');
  if (!input) return;
  const tampil = input.type === 'password';
  input.type = tampil ? 'text' : 'password';
  tombol.setAttribute('aria-pressed', tampil ? 'true' : 'false');
  tombol.setAttribute('aria-label', tampil ? 'Sembunyikan password' : 'Tampilkan password');
  pasang(tombol, ikon(tampil ? 'eye-off' : 'eye'));
};
function kolomSandi(o) {
  const id = o.id || ('k-' + o.nama);
  return h`<div class="isian"><label for="${id}">${o.label}</label>
    <div class="dengan-tombol"><input class="kontrol" type="password" id="${id}" name="${o.nama}" autocomplete="${o.autocomplete || 'current-password'}" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="128"${o.wajib === false ? '' : mentah(' required')}${o.bantu ? mentah(' aria-describedby="' + esc(id) + '-b"') : ''}>
    <button type="button" class="tombol-sisip" data-aksi="lihat-sandi" aria-label="Tampilkan password" aria-pressed="false">${ikon('eye')}</button></div>
    ${o.bantu ? h`<p class="bantu" id="${id}-b">${o.bantu}</p>` : ''}</div>`;
}


function galat(kode, pesan, data) {
  const e = new Error(pesan || 'Terjadi kesalahan.');
  e.kode = kode || 'GALAT';
  e.data = data === undefined ? null : data;
  e.ditangani = false;
  return e;
}

function transport() { return window.SiapHttp && typeof window.SiapHttp.kirim === 'function' ? window.SiapHttp : null; }

const BATAS_PANJANG_MS = 180000;
const BATAS_BIASA_MS = 90000;
const AKSI_MUATAN_BESAR = { 'media.unggah': 1, 'pembahasan.unggah': 1, 'materi.berkas': 1, 'impor.analisis': 1, 'impor.simpan': 1, 'berizin.ujiKirim': 1, 'banner.simpan': 1 };

const ULANG_OTOMATIS = { 'sesi.masuk': 8, 'ujian.mulai': 14, 'token.mulai': 14, 'pembahasan.unduh': 6 };
const GALAT_SERVER_ULANG_MAKS = 3;
function jedaUlangOtomatis(n) { return Math.round(Math.min(30000, 3000 * Math.pow(1.6, n - 1)) * (0.5 + Math.random())); }

const SEBAR_MULAI_MS = 1500;
function sebarMulaiMs() { const t = window.__sebarMulaiMs; return typeof t === 'number' && t >= 0 ? t : SEBAR_MULAI_MS; }

let toastAntre = null;
function hapusToastAntre() {
  if (toastAntre && toastAntre.parentNode) toastAntre.parentNode.removeChild(toastAntre);
  toastAntre = null;
}
function tampilkanAntre(ulangKe, maks, jedaMs) {
  hapusToastAntre();
  const detik = Math.max(1, Math.round(jedaMs / 1000));
  try {
    toastAntre = toast('Banyak pengguna mengakses bersamaan, jadi Anda masuk antrean. Mencoba lagi otomatis dalam ' + detik + ' detik (ke-' + ulangKe + ' dari ' + maks + '). Jangan tutup halaman ini.', 'info', jedaMs + 2500) || null;
  } catch (e) { toastAntre = null;   }
}

function panggil(aksi, data, opsi) {
  const o = opsi || {};
  if (CACHE_BACA[aksi] && !o.tanpaCache) return panggilBaca(aksi, data || {}, o);
  if (BACA_NETRAL[aksi]) return panggilLangsung(aksi, data, o);
  kosongkanCache();
  const p = panggilLangsung(aksi, data, o);
  p.then(kosongkanCache, kosongkanCache);
  return p;
}

function panggilLangsung(aksi, data, opsi) {
  const o = opsi || {};
  const maks = o.sabar || ULANG_OTOMATIS[aksi] || 0;
  const batasMs = AKSI_MUATAN_BESAR[aksi] ? BATAS_PANJANG_MS : BATAS_BIASA_MS;
  return new Promise(function (selesai, tolak) {
    let ulangKe = 0;
    function ulangiNanti(ragu) {
      ulangKe++;
      const jeda = jedaUlangOtomatis(ulangKe);
      if (ragu && typeof o.saatUlang === 'function') { try { o.saatUlang(ulangKe); } catch (e) {   } }
      if (!o.senyap) tampilkanAntre(ulangKe, maks, jeda);
      setTimeout(function () {
        if (o.kendali && o.kendali.batal) { hapusToastAntre(); const e = galat('DIBATALKAN', 'Dibatalkan.'); e.ditangani = true; tolak(e); return; }
        percobaan(0);
      }, jeda);
    }
    function gagalJaringan(sisa) {
      if (o.ulang && sisa > 0) { setTimeout(function () { percobaan(sisa - 1); }, 900); return; }
      if (maks && ulangKe < maks) { ulangiNanti(true); return; }
      hapusToastAntre();
      tolak(galat('JARINGAN', 'Koneksi ke server bermasalah. Periksa internet Anda lalu coba lagi.'));
    }
    function percobaan(sisa) {
      const t = transport();
      if (!t) { hapusToastAntre(); tolak(galat('JARINGAN', 'Aplikasi belum terhubung ke server. Muat ulang halaman ini.')); return; }
      if (!t.sah) { hapusToastAntre(); tolak(galat('KONFIGURASI', 'Alamat server belum diatur dengan benar (js/config.js). Hubungi pengelola aplikasi.')); return; }
      t.kirim({ aksi: aksi, token: S.token || undefined, data: data || {} }, batasMs).then(function (r) {
        if (!r.ok) {
          if (r.jenis === 'format') {
            if (maks && ulangKe < Math.min(maks, GALAT_SERVER_ULANG_MAKS)) { ulangiNanti(true); return; }
            hapusToastAntre(); tolak(galat('GALAT_SERVER', 'Jawaban server tidak dikenali. Coba lagi.')); return;
          }
          gagalJaringan(sisa);
          return;
        }
        const res = r.json;
        if (!res || typeof res !== 'object') { hapusToastAntre(); tolak(galat('GALAT_SERVER', 'Jawaban server tidak dikenali. Coba lagi.')); return; }
        if (res.success) { hapusToastAntre(); if (res.data && res.data.media) mediaGabung(res.data.media); selesai(res.data); return; }
        if (maks && res.kode === 'SIBUK' && ulangKe < maks) { ulangiNanti(); return; }
        if (maks && res.kode === 'GALAT_SERVER' && ulangKe < Math.min(maks, GALAT_SERVER_ULANG_MAKS)) { ulangiNanti(true); return; }
        hapusToastAntre();
        const e = galat(res.kode || 'GALAT', res.message || 'Terjadi kesalahan.', res.data);
        tanganiGalatGlobal(aksi, e);
        tolak(e);
      });
    }
    if (!o.sebar) { percobaan(o.ulang ? 1 : 0); return; }
    setTimeout(function () {
      if (o.kendali && o.kendali.batal) { const e = galat('DIBATALKAN', 'Dibatalkan.'); e.ditangani = true; tolak(e); return; }
      percobaan(o.ulang ? 1 : 0);
    }, Math.round(Math.random() * sebarMulaiMs()));
  });
}

function tanganiGalatGlobal(aksi, e) {
  if (e.kode === 'SESI' && aksi !== 'sesi.masuk') {
    e.ditangani = true;
    if (!S.memulihkan && (S.token || S.pengguna)) bersihkanSesi('Sesi Anda berakhir. Silakan masuk kembali.');
  } else if ((e.kode === 'WAJIB_GANTI' || e.kode === 'WAJIB_IDENTITAS') && S.pengguna) {
    e.ditangani = true;
    S.pengguna.langkahWajib = e.kode === 'WAJIB_GANTI' ? 'ganti_password' : 'identitas';
    if (e.kode === 'WAJIB_GANTI') S.pengguna.wajibGanti = true; else S.pengguna.identitasLengkap = false;
    toast(e.message, 'galat');
    navigateTo('wajib', {}, { tanpaRiwayat: true });
  } else if (e.kode === 'PEMELIHARAAN') {
    S.pemeliharaan = true;
    perbaruiBannerSistem();
  }
}

function gagalUmum(e) {
  if (!e) return;
  if (e.ditangani) return;
  toast(e.message || 'Terjadi kesalahan.', 'galat');
}

function simpanToken(token, jenis) {
  S.token = token || null;
  S.jenisSesi = token && jenis ? jenis : null;
  if (token) simpanLokal('sesi', KUNCI_SESI, token); else hapusLokal('sesi', KUNCI_SESI);
  if (token && jenis) simpanLokal('sesi', KUNCI_JENIS_SESI, jenis); else hapusLokal('sesi', KUNCI_JENIS_SESI);
}

function hitungLangkah(p) {
  if (!p) return null;
  if (p.wajibGanti) return 'ganti_password';
  if (p.peran === PERAN.SISWA && !p.identitasLengkap) return 'identitas';
  return null;
}

function bersihkanSesi(pesan, ke) {
  const token = S.jenisSesi === 'token' || (S.pengguna && S.pengguna.peran === PERAN.TOKEN);
  bersihkanLayarUjian();
  if (typeof pbLepasUrl === 'function') pbLepasUrl();
  simpanToken(null);
  kosongkanCache();
  ulangiSiap();
  S.pengguna = null; S.profil = null; S.sembunyiNama = false; S.sekolah = [];
  S.rangkaPeran = null; S.riwayat = []; S.percobaanToken = null;
  tutupSemuaModal();
  bersihkanToast();
  navigateTo(ke || (token ? 'token' : 'masuk'), { pesan: pesan || '' }, { tanpaRiwayat: true });
}

function bersihkanLayarUjian() {
  if (typeof S.saatTinggal === 'function') { const f = S.saatTinggal; S.saatTinggal = null; try { f(); } catch (e) {   } }
}

function terapkanSaya(d) {
  S.pengguna = d.pengguna;
  S.profil = d.profil;
  S.sembunyiNama = !!d.sembunyiNama;
  S.sekolah = d.sekolah || [];
  return d;
}

function muatSaya() {
  return panggil('sesi.saya', {}, { ulang: true }).then(terapkanSaya);
}

function masuk(username, password) {
  return panggil('sesi.masuk', { username: username, password: password }).then(function (d) {
    kosongkanCache();
    ulangiSiap();
    simpanToken(d.token);
    S.pengguna = d.pengguna;
    if (d.saya && d.saya.pengguna) {
      terapkanSaya(d.saya);
      if (d.dasbor) taruhCache('siswa.dasbor', {}, d.dasbor);
      return d;
    }
    return muatSaya().then(function () { return d; });
  });
}

function keluar() {
  const token = S.token;
  const selesai = function () { bersihkanSesi(''); };
  if (!token) { selesai(); return Promise.resolve(); }
  if (S.jenisSesi === 'token') { selesai(); return Promise.resolve(); }
  return panggil('sesi.keluar', {}).then(selesai, selesai);
}

function pulihkanSesi() {
  const t = bacaLokal('sesi', KUNCI_SESI);
  if (!t) return Promise.resolve(false);
  const jenis = bacaLokal('sesi', KUNCI_JENIS_SESI) === 'token' ? 'token' : null;
  S.token = t;
  S.jenisSesi = jenis;
  S.memulihkan = true;
  const muat = jenis === 'token'
    ? panggil('sesi.peserta', {}).then(function (d) { S.pengguna = d.pengguna; S.percobaanToken = d.percobaan; })
    : muatSaya();
  return muat.then(function () { S.memulihkan = false; return true; }, function () {
    S.memulihkan = false;
    simpanToken(null); S.pengguna = null; S.percobaanToken = null;
    return false;
  });
}

function terapkanInfo(d) {
  S.info = Object.assign({}, S.info, d || {});
  S.pemeliharaan = !!S.info.mode_pemeliharaan;
  terapkanMerek();
  return S.info;
}

function muatInfo() {
  return panggil('app.info', {}, { ulang: true }).then(terapkanInfo, function () { return S.info; });
}

function terapkanBundel(b) {
  terapkanInfo(b.info);
  if (b.beranda) taruhCache('beranda.publik', {}, b.beranda);
  if (b.sesi === 'member' && b.saya) {
    S.token = bacaLokal('sesi', KUNCI_SESI); S.jenisSesi = null;
    terapkanSaya(b.saya);
    if (b.dasbor) taruhCache('siswa.dasbor', {}, b.dasbor);
    return true;
  }
  if (b.sesi === 'token' && b.peserta) {
    S.token = bacaLokal('sesi', KUNCI_SESI);
    S.jenisSesi = 'token';
    S.pengguna = b.peserta.pengguna;
    S.percobaanToken = b.peserta.percobaan;
    return true;
  }
  if (b.sesi !== 'tunda') {
    if (S.token || bacaLokal('sesi', KUNCI_SESI)) simpanToken(null);
    S.token = null; S.jenisSesi = null;
  }
  return false;
}


const CACHE_BACA = {
  'app.info': { segar: 300, basi: 3600 },
  'beranda.publik': { segar: 30, basi: 900 },
  'siswa.dasbor': { segar: 20, basi: 900 },
  'ujian.katalog': { segar: 20, basi: 900 },
  'ujian.riwayat': { segar: 20, basi: 900 },
  'materi.katalog': { segar: 60, basi: 900 },
  'dashboard.ringkas': { segar: 15, basi: 600 },
  'paket.daftar': { segar: 20, basi: 900 },
  'akun.daftar': { segar: 20, basi: 900 },
  'materi.daftar': { segar: 30, basi: 900 },
  'banner.daftar': { segar: 30, basi: 900 },
  'pengaturan.ambil': { segar: 60, basi: 900 },
  'sekolah.daftar': { segar: 60, basi: 900 },
  'hasil.daftar': { segar: 10, basi: 600 },
  'percobaan.daftar': { segar: 10, basi: 600 },
  'analisis.paket': { segar: 30, basi: 900 }
};

const BACA_NETRAL = {
  'app.mulai': 1, 'app.siap': 1, 'sesi.saya': 1, 'sesi.peserta': 1, 'token.periksa': 1, 'ujian.muat': 1, 'ujian.hasil': 1,
  'percobaan.detail': 1, 'audit.daftar': 1, 'audit.verifikasi': 1, 'backup.status': 1, 'backup.daftar': 1, 'paket.ambil': 1,
  'akun.ambil': 1, 'materi.riwayat': 1, 'pembahasan.daftar': 1, 'soal.cari': 1, 'paket.dependensi': 1, 'koreksi.pratinjau': 1,
  'pembahasan.unduh': 1, 'materi.unduh': 1, 'materi.buka': 1, 'media.daftar': 1, 'berizin.pdfUji': 1
};

const cacheBaca = new Map();
const terbang = new Map();
let generasiTulis = 0;

function normalisasiParam(v) {
  if (Array.isArray(v)) return v.map(normalisasiParam);
  if (v && typeof v === 'object') {
    const o = {};
    Object.keys(v).sort().forEach(function (k) {
      if (v[k] === '' || v[k] === null || v[k] === undefined) return;
      o[k] = normalisasiParam(v[k]);
    });
    return o;
  }
  return v;
}
function kunciCache(aksi, data) {
  let p = '';
  try { p = JSON.stringify(normalisasiParam(data || {})); } catch (e) { p = String(Math.random()); }
  return aksi + '|' + p;
}

function kosongkanCache() {
  cacheBaca.clear();
  generasiTulis++;
}
if (window.__siapUji && typeof window.__siapUji === 'object') {
  window.__siapUji.kosongkanCache = kosongkanCache;
  window.__siapUji.panggil = panggil;
  window.__siapUji.modal = modal;
  window.__siapUji.h = h;
  window.__siapUji.kunciCache = function () { return Array.from(cacheBaca.keys()); };
}

function taruhCache(aksi, data, hasil) {
  if (!CACHE_BACA[aksi] || hasil === undefined || hasil === null) return;
  if (hasil && typeof hasil === 'object' && hasil.media) mediaGabung(hasil.media);
  try { cacheBaca.set(kunciCache(aksi, data), { s: JSON.stringify(hasil), t: Date.now() }); } catch (e) {   }
}

function ambilBersama(aksi, data, o, k) {
  if (terbang.has(k)) return terbang.get(k);
  const gen = generasiTulis;
  const p = panggilLangsung(aksi, data, o).then(function (d) {
    const s = JSON.stringify(d === undefined ? null : d);
    if (gen === generasiTulis) cacheBaca.set(k, { s: s, t: Date.now() });
    terbang.delete(k);
    return s;
  }, function (e) {
    terbang.delete(k);
    throw e;
  });
  terbang.set(k, p);
  return p;
}

function daftarkanTerbang(aksi, data, janjiBundel, ambil) {
  if (!CACHE_BACA[aksi]) return;
  const k = kunciCache(aksi, data);
  if (terbang.has(k)) return;
  const gen = generasiTulis;
  const p = janjiBundel.then(function (b) {
    const x = b ? ambil(b) : null;
    if (x === null || x === undefined) throw new Error('tidak dibawa bundel');
    const s = JSON.stringify(x);
    if (gen === generasiTulis) cacheBaca.set(k, { s: s, t: Date.now() });
    terbang.delete(k);
    return s;
  }).catch(function () {
    terbang.delete(k);
    return ambilBersama(aksi, data || {}, { ulang: true }, k);
  });
  terbang.set(k, p);
}

function panggilBaca(aksi, data, o) {
  const cfg = CACHE_BACA[aksi];
  const k = kunciCache(aksi, data);
  const e = cacheBaca.get(k);
  if (e) {
    const umur = (Date.now() - e.t) / 1000;
    if (umur <= cfg.segar) return Promise.resolve(JSON.parse(e.s));
    if (umur <= cfg.basi) {
      revalidasi(aksi, data, o, k, e.s, S.navId);
      return Promise.resolve(JSON.parse(e.s));
    }
    cacheBaca.delete(k);
  }
  return ambilBersama(aksi, data, o, k).then(function (s) { return JSON.parse(s); });
}

function revalidasi(aksi, data, o, k, sLama, idNav) {
  if (terbang.has(k)) return;
  ambilBersama(aksi, data, Object.assign({}, o, { ulang: true, senyap: true }), k).then(function (sBaru) {
    const kini = cacheBaca.get(k);
    if (sBaru !== sLama && kini && kini.s === sBaru) renderSenyap(idNav);
  }, function () {   });
}

function renderSenyap(idNav) {
  if (idNav !== S.navId || !S.pengguna) return;
  if (S.sentuhan > S.renderMulai) return;
  if (typeof modalTeratas === 'function' && modalTeratas()) return;
  const def = HALAMAN[S.halaman];
  if (!def || def.tanpaRangka || def.publik) return;
  navigateTo(S.halaman, S.params, { tanpaRiwayat: true, senyap: true });
}

['pointerdown', 'keydown', 'input', 'change'].forEach(function (nama) {
  document.addEventListener(nama, function () { S.sentuhan = Date.now(); }, true);
});


function bolehPrakirim() {
  if (!S.token || S.pemeliharaan || window.__tanpaPrakirim) return false;
  try {
    const k = navigator.connection;
    if (k && (k.saveData || /(^|-)2g$/.test(String(k.effectiveType || '')))) return false;
  } catch (e) {   }
  return true;
}

function prakirim(aksi, data) {
  if (!CACHE_BACA[aksi] || !bolehPrakirim()) return;
  const k = kunciCache(aksi, data);
  const e = cacheBaca.get(k);
  if (e && (Date.now() - e.t) / 1000 <= CACHE_BACA[aksi].segar) return;
  if (terbang.has(k)) return;
  ambilBersama(aksi, data || {}, { senyap: true }, k).catch(function () {   });
}

const PRAKIRIM_MENU = {
  dasbor: function () { return S.pengguna.peran === PERAN.SISWA ? [['siswa.dasbor', {}]] : [['dashboard.ringkas', {}]]; },
  katalog: function () { return [['ujian.katalog', {}]]; },
  riwayat: function () { return [['ujian.riwayat', {}]]; },
  materi: function () {
    return S.pengguna.peran === PERAN.SISWA
      ? [['materi.katalog', { q: msSt.q, mapel: msSt.mapel, kategori: msSt.kategori, jenis: msSt.jenis }]]
      : [['materi.daftar', { q: mtSt.q, mapel: mtSt.mapel, kategori: mtSt.kategori, jenis: mtSt.jenis, status: mtSt.status }]];
  },
  akun: function () { return [['akun.daftar', { q: akunSt.q, peran: akunSt.peran, status: akunSt.status }]]; },
  paket: function () { return [['paket.daftar', { q: paketSt.q, mapel: paketSt.mapel, kategori: paketSt.kategori, status: paketSt.status }]]; },
  banner: function () { return [['banner.daftar', {}]]; },
  pengaturan: function () { return [['pengaturan.ambil', {}], ['sekolah.daftar', { semua: true }]]; },
  'hasil-nilai': function () { return [['paket.daftar', {}], ['hasil.daftar', hnParam()]]; },
  analisis: function () { return [['paket.daftar', {}]]; },
  percobaan: function () {
    const d = { halaman: pcSt.halaman, ukuran: pcSt.ukuran };
    if (pcSt.id_paket) d.id_paket = pcSt.id_paket;
    if (pcSt.status) d.status = pcSt.status;
    if (pcSt.jalur) d.jalur = pcSt.jalur;
    if (pcSt.q) d.q = pcSt.q;
    return [['paket.daftar', {}], ['percobaan.daftar', d]];
  }
};

function prakirimMenu(halaman) {
  if (!S.pengguna || !bolehPrakirim()) return;
  const f = PRAKIRIM_MENU[halaman];
  if (!f) return;
  let daftar = [];
  try { daftar = f(); } catch (e) { return; }
  daftar.forEach(function (x) { prakirim(x[0], x[1]); });
}

let pewaktuMelayang = null;
function maksudMenu(e) {
  const b = e.target && e.target.closest ? e.target.closest('.nav-butir') : null;
  if (!b) return;
  const ke = b.getAttribute('data-ke');
  if (pewaktuMelayang) clearTimeout(pewaktuMelayang);
  pewaktuMelayang = setTimeout(function () { pewaktuMelayang = null; prakirimMenu(ke); }, e.type === 'touchstart' ? 0 : 120);
}
'pointerover focusin touchstart'.split(' ').forEach(function (nama) {
  document.addEventListener(nama, maksudMenu, { capture: true, passive: true });
});

let siapSudah = false;
function ulangiSiap() { siapSudah = false; }
function jadwalkanSiap() {
  if (siapSudah || !S.pengguna || S.pengguna.peran === PERAN.TOKEN || S.pengguna.langkahWajib) return;
  if (!bolehPrakirim()) return;
  siapSudah = true;
  const jalan = function () {
    if (!S.pengguna || !bolehPrakirim()) return;
    const gen = generasiTulis;
    panggilLangsung('app.siap', {}, { senyap: true }).then(function (d) {
      if (!d || gen !== generasiTulis) return;
      Object.keys(d).forEach(function (aksi) { taruhCache(aksi, {}, d[aksi]); });
    }, function () {   });
  };
  const tunda = 800 + Math.round(Math.random() * 2200);
  setTimeout(function () {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(jalan, { timeout: 2500 }); else jalan();
  }, tunda);
}


function simpanSnapshot() {
  const i = S.info || {};
  if (i.belumDipasang) return;
  simpanLokal('lokal', KUNCI_SNAPSHOT, JSON.stringify({ nama_aplikasi: i.nama_aplikasi, logo: i.logo, warna_dominan: i.warna_dominan, kontak: i.kontak, versi: i.versi }));
}

function pulihkanSnapshot() {
  const t = bacaLokal('lokal', KUNCI_SNAPSHOT);
  if (!t) return false;
  try {
    const o = JSON.parse(t);
    if (!o || typeof o !== 'object') return false;
    const bersih = {};
    ['nama_aplikasi', 'logo', 'warna_dominan', 'kontak', 'versi'].forEach(function (k) { if (typeof o[k] === 'string') bersih[k] = o[k]; });
    if (!bersih.nama_aplikasi) return false;
    S.info = Object.assign({}, S.info, bersih);
    terapkanMerek();
    return true;
  } catch (e) { return false; }
}


const NAMA_MENU_MAPEL = { BIN: 'B.Indonesia', MAT: 'Matematika', IPA: 'IPA' };

const MENU = {
  ADMIN: [['dasbor', 'Dasbor', 'home'], ['akun', 'Kelola Akun', 'users'], ['impor-siswa', 'Impor Siswa', 'upload'], ['paket', 'Paket Soal', 'package'], ['materi', 'Materi', 'book-open'], ['banner', 'Banner', 'megaphone'], ['hasil-nilai', 'Hasil & Nilai', 'trophy'], ['analisis', 'Analisis Soal', 'bar-chart'], ['percobaan', 'Percobaan', 'list'], ['pengaturan', 'Pengaturan', 'settings'], ['audit', 'Log Audit', 'shield'], ['backup', 'Backup & Pulihkan', 'database']],
  GURU: [['dasbor', 'Dasbor', 'home'], ['paket', 'Paket Soal Saya', 'package'], ['materi', 'Materi Saya', 'book-open'], ['hasil-nilai', 'Hasil & Nilai', 'trophy'], ['analisis', 'Analisis Soal', 'bar-chart'], ['percobaan', 'Percobaan', 'list'], ['audit', 'Log Aktivitas', 'activity']],
  SISWA: [['dasbor', 'Beranda', 'home']].concat(MAPEL_URUT.map(function (k) {
    return ['katalog', 'Latihan soal ' + NAMA_MENU_MAPEL[k], IKON_MAPEL[k], { mapel: k }];
  }), [['materi', 'Materi', 'file-text'], ['riwayat', 'Riwayat', 'clock']])
};
const JUDUL_HALAMAN = {
  beranda: 'Beranda', masuk: 'Masuk', token: 'Ujian dengan kode', wajib: 'Lengkapi akun Anda', dasbor: 'Dasbor', profil: 'Profil Saya', akun: 'Kelola Akun', 'impor-siswa': 'Impor Siswa',
  paket: 'Paket Soal', 'paket-edit': 'Susun Paket', katalog: 'Latihan soal', materi: 'Materi', banner: 'Banner beranda', percobaan: 'Percobaan', 'hasil-nilai': 'Hasil & Nilai', analisis: 'Analisis Soal', riwayat: 'Riwayat', hasil: 'Hasil ujian', 'hasil-token': 'Hasil ujian', ujian: 'Ujian',
  pengaturan: 'Pengaturan', audit: 'Log Audit', backup: 'Backup & Pulihkan'
};

function judulHalaman(nama, params) {
  const peran = S.pengguna && S.pengguna.peran;
  if (nama === 'katalog') return 'Latihan soal ' + NAMA_MENU_MAPEL[mapelKatalog(params)];
  if (nama === 'dasbor' && peran === PERAN.SISWA) return 'Beranda';
  if (nama === 'audit' && peran === PERAN.GURU) return 'Log Aktivitas Saya';
  if ((nama === 'paket' || nama === 'paket-edit') && peran === PERAN.GURU) return nama === 'paket' ? 'Paket Soal Saya' : 'Susun Paket';
  if (nama === 'materi' && peran === PERAN.GURU) return 'Materi Saya';
  return JUDUL_HALAMAN[nama] || '';
}

const HALAMAN = {
  beranda: { publik: true, render: function (p, c) { renderBeranda(p, c); } },
  masuk: { publik: true, render: function (p, c) { renderMasuk(p, c); } },
  token: { publik: true, render: function (p, c) { renderToken(p, c); } },
  ujian: { tanpaRangka: true, peran: [PERAN.SISWA, PERAN.TOKEN], render: function (p, c) { renderUjian(p, c); } },
  'hasil-token': { tanpaRangka: true, peran: [PERAN.TOKEN], render: function (p, c) { renderHasil(p, c, true); } },
  hasil: { peran: [PERAN.SISWA], menu: 'riwayat', render: function (p, c) { renderHasil(p, c, false); } },
  riwayat: { peran: [PERAN.SISWA], render: function (p, c) { renderRiwayat(p, c); } },
  katalog: { peran: [PERAN.SISWA], render: function (p, c) { renderKatalog(p, c); } },
  percobaan: { peran: [PERAN.ADMIN, PERAN.GURU], render: function (p, c) { renderPercobaan(p, c); } },
  'hasil-nilai': { peran: [PERAN.ADMIN, PERAN.GURU], render: function (p, c) { renderHasilNilai(p, c); } },
  analisis: { peran: [PERAN.ADMIN, PERAN.GURU], render: function (p, c) { renderAnalisisSoal(p, c); } },
  wajib: { tanpaRangka: true, render: function (p, c) { renderWajib(p, c); } },
  dasbor: { render: function (p, c) { renderDasbor(p, c); } },
  profil: { render: function (p, c) { renderProfil(p, c); } },
  akun: { peran: [PERAN.ADMIN], render: function (p, c) { renderAkun(p, c); } },
  'impor-siswa': { peran: [PERAN.ADMIN], render: function (p, c) { renderImporSiswa(p, c); } },
  paket: { peran: [PERAN.ADMIN, PERAN.GURU], render: function (p, c) { renderPaket(p, c); } },
  'paket-edit': { peran: [PERAN.ADMIN, PERAN.GURU], menu: 'paket', render: function (p, c) { renderPaketEdit(p, c); } },
  materi: { peran: [PERAN.ADMIN, PERAN.GURU, PERAN.SISWA], render: function (p, c) { if (S.pengguna.peran === PERAN.SISWA) renderMateriSiswa(p, c); else renderMateri(p, c); } },
  banner: { peran: [PERAN.ADMIN], render: function (p, c) { renderBannerAdmin(p, c); } },
  pengaturan: { peran: [PERAN.ADMIN], render: function (p, c) { renderPengaturan(p, c); } },
  audit: { peran: [PERAN.ADMIN, PERAN.GURU], render: function (p, c) { renderAudit(p, c); } },
  backup: { peran: [PERAN.ADMIN], render: function (p, c) { renderBackup(p, c); } }
};

function logoMerek(kelas) {
  const u = urlHttps(S.info.logo);
  return u ? h`<img src="${u}" alt="" referrerpolicy="no-referrer">` : ikon('graduation-cap', kelas || 'ikon-lg');
}

function perbaruiBannerSistem() {
  const b = el('#banner-sistem');
  if (!b) return;
  if (S.pemeliharaan) {
    pasang(b, h`<div class="banner-sistem" role="status">${ikon('alert-triangle')}<span>Sistem sedang dalam pemeliharaan (pemulihan data). Beberapa fitur dinonaktifkan sementara.</span></div>`);
  } else b.innerHTML = '';
}

function pasangRangka() {
  const p = S.pengguna;
  if (S.rangkaPeran === p.peran && el('#isi')) return;
  S.rangkaPeran = p.peran;
  const menu = (MENU[p.peran] || []).concat([['profil', 'Profil Saya', 'user']]);
  const terang = p.peran === PERAN.SISWA;
  pasang(el('#akar'), h`
    <button type="button" class="lompat" data-aksi="lompat">Lewati ke konten utama</button>
    <div class="aplikasi">
      <aside class="sidebar${terang ? ' terang' : ''}" id="sidebar" aria-label="Menu utama">
        <div class="sidebar-merek"><span class="logo">${logoMerek()}</span><span class="nama">${namaApp()}</span></div>
        <div class="sidebar-label">Menu</div>
        <nav aria-label="Navigasi utama"><ul class="sidebar-nav">${menu.map(function (m) {
          return h`<li><button type="button" class="nav-butir" data-aksi="nav" data-ke="${m[0]}" data-menu="${kunciMenu(m[0], m[3])}" data-mapel="${m[3] ? m[3].mapel : ''}">${ikon(m[2])}<span>${m[1]}</span></button></li>`;
        })}</ul></nav>
        <div class="sidebar-bawah">
          <div class="pengguna-kartu"><span class="avatar" aria-hidden="true">${inisial(p.nama)}</span><div class="info"><div class="nama potong">${p.nama}</div><div class="peran">${LABEL_PERAN[p.peran] || p.peran}</div></div></div>
          <button type="button" class="tombol tombol-sidebar" data-aksi="keluar">${ikon('log-out')}<span>Keluar</span></button>
        </div>
      </aside>
      <div class="scrim" id="scrim" data-aksi="tutup-menu" hidden></div>
      <div class="utama" id="utama">
        <header class="bilah-atas">
          <button type="button" class="tombol tombol-diam tombol-ikon tombol-menu" data-aksi="buka-menu" aria-label="Buka menu" aria-expanded="false" aria-controls="sidebar">${ikon('menu')}</button>
          <h1 id="judul-halaman" tabindex="-1"></h1>
          <button type="button" class="tombol tombol-diam tombol-ikon" data-aksi="tema" aria-label="Ganti tema">${ikon('moon')}</button>
        </header>
        <div id="banner-sistem"></div>
        <main id="isi" class="konten" tabindex="-1"></main>
      </div>
    </div>`);
  terapkanTema(S.tema);
  perbaruiBannerSistem();
}

function pasangPolos() {
  S.rangkaPeran = null;
}

function setJudul(teks) {
  const j = el('#judul-halaman');
  if (j) j.textContent = teks;
  try { document.title = teks + ' · ' + namaApp(); } catch (e) {   }
}

function mapelKatalog(params) {
  return params && MAPEL[params.mapel] ? params.mapel : MAPEL_URUT[0];
}
function kunciMenu(halaman, params) {
  return halaman === 'katalog' ? 'katalog:' + mapelKatalog(params) : halaman;
}

function perbaruiNav() {
  const aktif = kunciMenu((HALAMAN[S.halaman] && HALAMAN[S.halaman].menu) || S.halaman, S.params);
  semua('.nav-butir').forEach(function (b) {
    if (b.getAttribute('data-menu') === aktif) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
}

function bukaMenu() {
  const sb = el('#sidebar');
  if (!sb) return;
  sb.classList.add('terbuka');
  const sc = el('#scrim'); if (sc) sc.hidden = false;
  const bt = el('[data-aksi="buka-menu"]'); if (bt) bt.setAttribute('aria-expanded', 'true');
  const pertama = el('.nav-butir', sb); if (pertama) pertama.focus();
}
function tutupMenu(kembaliFokus) {
  const sb = el('#sidebar');
  if (!sb || !sb.classList.contains('terbuka')) return;
  sb.classList.remove('terbuka');
  const sc = el('#scrim'); if (sc) sc.hidden = true;
  const bt = el('[data-aksi="buka-menu"]');
  if (bt) { bt.setAttribute('aria-expanded', 'false'); if (kembaliFokus) bt.focus(); }
}
AKSI['buka-menu'] = bukaMenu;
AKSI['tutup-menu'] = function () { tutupMenu(true); };
AKSI.lompat = function () { const i = el('#isi'); if (i) i.focus(); };
AKSI.nav = function (b) {
  const mapel = b.getAttribute('data-mapel');
  navigateTo(b.getAttribute('data-ke'), mapel ? { mapel: mapel } : {});
};
AKSI.keluar = function (b) { kerjakan(b, function () { return keluar(); }); };
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalTeratas()) tutupMenu(true);
});

function samaParams(a, b) { try { return JSON.stringify(a || {}) === JSON.stringify(b || {}); } catch (e) { return false; } }

function navigateTo(nama, params, opsi) {
  const o = opsi || {};
  let def = HALAMAN[nama];
  if (!def) { nama = S.pengguna ? 'dasbor' : 'beranda'; def = HALAMAN[nama]; }
  if (S.pengguna && S.pengguna.peran === PERAN.TOKEN) {
    if (nama !== 'ujian' && nama !== 'hasil-token') { nama = 'ujian'; def = HALAMAN.ujian; }
  } else if (def.publik) {
    if (S.pengguna) { nama = S.pengguna.langkahWajib ? 'wajib' : 'dasbor'; def = HALAMAN[nama]; }
  } else if (!S.pengguna) {
    nama = 'masuk'; def = HALAMAN.masuk;
  } else if (S.pengguna.langkahWajib && nama !== 'wajib') {
    nama = 'wajib'; def = HALAMAN.wajib;
  } else if (nama === 'wajib' && !S.pengguna.langkahWajib) {
    nama = 'dasbor'; def = HALAMAN.dasbor;
  } else if (def.peran && def.peran.indexOf(S.pengguna.peran) === -1) {
    toast('Anda tidak berhak membuka halaman itu.', 'galat');
    nama = 'dasbor'; def = HALAMAN.dasbor;
  }
  const p = params || {};
  if (S.halaman && !o.tanpaRiwayat && !(S.halaman === nama && samaParams(S.params, p))) {
    S.riwayat.push({ nama: S.halaman, params: S.params });
    if (S.riwayat.length > 30) S.riwayat.shift();
  }
  S.halaman = nama; S.params = p;
  const id = ++S.navId;
  if (!o.senyap) {
    bersihkanLayarUjian();
    bersihkanLayarPublik();
    tutupMenu(false);
    tutupSemuaModal();
  }

  let wadah;
  if (def.publik || def.tanpaRangka) {
    pasangPolos();
    wadah = el('#akar');
  } else {
    pasangRangka();
    wadah = el('#isi');
    setJudul(judulHalaman(nama, p));
    perbaruiNav();
  }
  const konteks = { wadah: wadah, id: id, ok: function () { return id === S.navId; }, senyap: !!o.senyap };
  S.renderMulai = Date.now();
  if (o.senyap) {
    S.senyapSampai = Date.now() + 2000;
  } else {
    pasang(wadah, kerangkaIsi());
    try { window.scrollTo(0, 0); } catch (e) {   }
  }
  try { def.render(p, konteks); } catch (err) {
    pasang(wadah, h`<div class="kosong">${ikon('alert-triangle', 'ikon-xl')}<h3>Halaman tidak bisa ditampilkan</h3><p>Terjadi kesalahan di aplikasi. Muat ulang halaman atau hubungi admin.</p></div>`);
    if (window.console && console.error) console.error(err);
  }
  if (S.pengguna) jadwalkanSiap();
}

function kembali(cadangan) {
  const r = S.riwayat.pop();
  if (r) navigateTo(r.nama, r.params, { tanpaRiwayat: true });
  else navigateTo(cadangan || 'dasbor', {}, { tanpaRiwayat: true });
}
AKSI.kembali = function (b) { kembali(b.getAttribute('data-ke')); };

function kerangkaIsi() {
  return h`<div class="pemuat pemuat-isi" role="status" aria-live="polite"><span class="sr-only">Memuat…</span>
    <div class="rk-judul"></div><div class="rk-kpi"><div class="rk-kartu"></div><div class="rk-kartu"></div><div class="rk-kartu"></div><div class="rk-kartu"></div></div>
    <div class="rk-blok"></div><div class="rk-blok rk-blok-kecil"></div></div>`;
}

function fokusJudul() {
  if (Date.now() < S.senyapSampai) return;
  const j = el('#judul-halaman') || el('#akar h1');
  if (j) { if (!j.hasAttribute('tabindex')) j.setAttribute('tabindex', '-1'); try { j.focus({ preventScroll: true }); } catch (e) {   } }
}

function kepalaHalaman(judul, deskripsi, aksi) {
  return h`<div class="kepala-halaman"><div class="judul"><h2>${judul}</h2>${deskripsi ? h`<p>${deskripsi}</p>` : ''}</div>${aksi ? h`<div class="aksi">${aksi}</div>` : ''}</div>`;
}
function tampilkanGalatMuat(wadah, e, ulangi) {
  if (e && e.ditangani) return;
  pasang(wadah, h`<div class="kosong"><span class="ikon-bulat bahaya">${ikon('alert-triangle')}</span><h3>Data tidak bisa dimuat</h3><p>${e && e.message ? e.message : 'Terjadi kesalahan.'}</p>${ulangi ? h`<button type="button" class="tombol tombol-garis" data-aksi="muat-ulang">${ikon('refresh')}Coba lagi</button>` : ''}</div>`);
}
AKSI['muat-ulang'] = function () { navigateTo(S.halaman, S.params, { tanpaRiwayat: true }); };


function headerPublik(diBeranda) {
  return h`<header class="publik-header"><div class="dalam">
    <a class="merek" href="#" data-aksi="ke-beranda" aria-label="${namaApp()} — beranda"><span class="logo">${logoMerek()}</span><span class="nama">${namaApp()}</span></a>
    <nav class="nav-publik" aria-label="Bagian beranda">${diBeranda
      ? h`<a href="#peringkat" data-aksi="gulir" data-ke="peringkat">Peringkat</a><a href="#penilaian" data-aksi="gulir" data-ke="penilaian">Penilaian</a><a href="#cara-mulai" data-aksi="gulir" data-ke="cara-mulai">Cara mulai</a>`
      : h`<a href="#" data-aksi="ke-beranda">Beranda</a>`}</nav>
    <div class="kanan">
      <button type="button" class="tombol tombol-diam tombol-ikon" data-aksi="tema" aria-label="Ganti tema">${ikon('moon')}</button>
      <button type="button" class="tombol tombol-diam sembunyi-sempit" data-aksi="ke-masuk" data-untuk="staf" data-uji="masuk-staf-header">${ikon('shield')}<span>Guru / Admin</span></button>
      <button type="button" class="tombol" data-aksi="ke-masuk" data-untuk="siswa" data-uji="masuk-siswa-header" aria-label="Masuk Siswa">${ikon('log-in')}<span>Masuk<span class="sembunyi-sangat-sempit"> Siswa</span></span></button>
    </div>
  </div></header>`;
}
function bannerPublik() {
  if (S.info.belumDipasang) {
    return h`<div class="banner-sistem" role="status">${ikon('alert-triangle')}<span>Aplikasi belum dipasang. Pemilik perlu menjalankan fungsi pasangAwal di editor Apps Script.</span></div>`;
  }
  if (S.pemeliharaan) {
    return h`<div class="banner-sistem" role="status">${ikon('alert-triangle')}<span>Sistem sedang dalam pemeliharaan. Coba lagi beberapa menit lagi.</span></div>`;
  }
  return '';
}
function kakiPublik() {
  const kontak = S.info.kontak;
  return h`<footer class="publik-kaki"><div class="dalam">
    <div><p><strong>${namaApp()}</strong></p><p>Platform latihan dan try out TKA SD. Hasil di sini untuk berlatih dan tidak menggantikan asesmen resmi.</p></div>
    <div>${kontak ? h`<p>${ikon('info', 'ikon-sm')} Kontak: ${kontak}</p>` : ''}<p class="kecil teks-samar">Versi ${S.info.versi || '—'}</p></div>
  </div></footer>`;
}

AKSI['ke-beranda'] = function () { navigateTo('beranda'); };
AKSI['ke-masuk'] = function (b) {
  const u = b && b.getAttribute ? b.getAttribute('data-untuk') : '';
  navigateTo('masuk', u === 'siswa' || u === 'staf' ? { untuk: u } : {});
};
AKSI['ke-token'] = function () { navigateTo('token'); };
AKSI.gulir = function (b) {
  const t = document.getElementById(b.getAttribute('data-ke'));
  if (t) { try { t.scrollIntoView({ behavior: bnKurangiGerak() ? 'auto' : 'smooth', block: 'start' }); } catch (e) { t.scrollIntoView(); } }
};

const POLA_KODE_UJIAN = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/;
function normalkanKode(v) { return String(v || '').toUpperCase().replace(/[\s-]/g, ''); }

function htmlKartuMulai() {
  const nonaktif = S.info.belumDipasang;
  return h`<section class="kartu kartu-mulai" aria-labelledby="h-mulai" data-uji="kartu-mulai">
    <div class="kartu-judul"><span class="ikon-bulat">${ikon('key')}</span><h2 id="h-mulai">Mulai ujian dengan kode</h2></div>
    <p class="teks-redam">Punya kode ujian dari guru? Masukkan di sini. Tidak perlu akun.</p>
    <form data-kirim="mulai-kode" novalidate autocomplete="off">
      <div data-galat aria-live="polite"></div>
      <div class="isian"><label for="bk-kode">Kode ujian</label>
        <input class="kontrol kode-ujian" id="bk-kode" name="kode" type="text" inputmode="text" autocapitalize="characters" autocorrect="off" spellcheck="false" maxlength="12" autocomplete="off" required aria-describedby="bk-kode-b" placeholder="Contoh: K7M2P9XQ"${nonaktif ? mentah(' disabled') : ''}>
        <p class="bantu" id="bk-kode-b">8 huruf atau angka. Huruf besar atau kecil sama saja.</p></div>
      <button type="submit" class="tombol tombol-penuh" data-uji="mulai-kode"${nonaktif ? mentah(' disabled') : ''}>${ikon('play')}<span>Lanjut isi data</span></button>
    </form>
    <hr>
    <h3 class="kartu-sub">Sudah punya akun?</h3>
    <div class="pilihan-masuk">
      <button type="button" class="tombol tombol-garis" data-aksi="ke-masuk" data-untuk="siswa" data-uji="masuk-siswa">${ikon('user')}<span>Masuk Siswa</span></button>
      <button type="button" class="tombol tombol-diam" data-aksi="ke-masuk" data-untuk="staf" data-uji="masuk-staf">${ikon('shield')}<span>Guru / Admin</span></button>
    </div>
    <p class="bantu tanpa-margin">Akun siswa dibuat oleh guru atau admin.</p>
  </section>`;
}
KIRIM['mulai-kode'] = function (form) {
  bersihGalat(form);
  const kode = normalkanKode(nilaiForm(form).kode);
  if (!kode) { galatIsian(form, 'kode', 'Isi kode ujian dari guru.'); return; }
  if (!POLA_KODE_UJIAN.test(kode)) { galatIsian(form, 'kode', 'Kode terdiri dari 8 huruf atau angka. Huruf O, I, L dan angka 0, 1 tidak dipakai; periksa kembali kode dari guru.'); return; }
  navigateTo('token', { kode: kode });
};

function ruangBanner() {
  return h`<div class="banner banner-ruang" aria-hidden="true"><div class="banner-gambar kerangka"></div></div>`;
}

function renderBeranda(p, c) {
  const mapel = MAPEL_URUT.map(function (k) { return [k, MAPEL[k]]; });
  const fitur = [
    ['users', 'Akun siswa pribadi', 'Setiap siswa punya username dan password sendiri, lalu mengisi identitas dan mengelola profilnya.'],
    ['package', 'Paket soal terkelola', 'Guru menyusun paket Try Out Utama dan Latihan Materi untuk tiap mata pelajaran, lengkap dengan kunci jawaban.'],
    ['clock', 'Ujian berwaktu', 'Waktu dihitung server, jawaban tersimpan otomatis, dan pengerjaan bisa dilanjutkan bila halaman tertutup.'],
    ['bar-chart', 'Hasil dan perkembangan', 'Nilai, rekap benar dan salah, serta grafik perkembangan per mata pelajaran untuk siswa yang punya akun.'],
    ['book-open', 'Materi dan pembahasan', 'Materi PDF dan video, serta pembahasan paket bila guru menyediakannya.'],
    ['trophy', 'Peringkat per mapel', 'Siswa yang punya akun tampil di papan peringkat. Admin dapat menyembunyikan nama atas permintaan orang tua atau wali.']
  ];
  pasang(c.wadah, h`
    <button type="button" class="lompat" data-aksi="lompat-publik">Lewati ke konten utama</button>
    ${headerPublik(true)}${bannerPublik()}
    <main id="isi-publik" tabindex="-1">
      <div class="pembungkus">
        <section class="hero hero-baru" aria-labelledby="judul-hero">
          <div class="hero-teks">
            <span class="lencana lencana-primer">${ikon('target', 'ikon-sm')} Latihan TKA SD</span>
            <h1 id="judul-hero" tabindex="-1" class="jarak-atas-kecil">Latihan TKA SD yang <em>rapi, terukur,</em> dan mudah dipantau</h1>
          </div>
          <div class="hero-banner" id="bn-wadah" data-uji="banner-wadah">${ruangBanner()}</div>
          <div class="hero-form">${htmlKartuMulai()}</div>
        </section>

        <section class="bagian" id="peringkat" aria-label="Peringkat"><div id="pr-wadah" data-uji="pr-wadah"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat peringkat…</span></div></div></section>

        <section class="bagian" id="mapel" aria-labelledby="h-fitur">
          <h2 id="h-fitur">Yang bisa Anda lakukan</h2>
          <p class="pengantar">Semua yang tercantum di sini sudah tersedia dan bisa dipakai.</p>
          <div class="fitur">${fitur.map(function (f) {
            return h`<article class="kartu"><span class="ikon-bulat">${ikon(f[0])}</span><h3>${f[1]}</h3><p>${f[2]}</p></article>`;
          })}</div>
          <div class="kisi-3 jarak-atas">${mapel.map(function (m) {
            return h`<article class="kartu"><div class="kartu-judul"><span class="ikon-bulat">${ikon(IKON_MAPEL[m[0]])}</span><h3>${m[1]}</h3></div><p class="teks-redam tanpa-margin">Try Out Utama · Latihan Materi</p></article>`;
          })}</div>
        </section>

        <section class="bagian" id="cara-mulai" aria-labelledby="h-cara">
          <h2 id="h-cara">Cara memulai</h2>
          <ol class="langkah-mulai">
            <li><span class="nomor" aria-hidden="true">1</span><div><h3>Pilih jalur</h3><p>Punya akun dari guru? Masuk sebagai siswa. Hanya punya kode ujian? Pakai kode tanpa akun.</p></div></li>
            <li><span class="nomor" aria-hidden="true">2</span><div><h3>Pilih paket</h3><p>Try Out Utama untuk menguji kesiapan, Latihan Materi untuk berlatih topik tertentu.</p></div></li>
            <li><span class="nomor" aria-hidden="true">3</span><div><h3>Kerjakan</h3><p>Waktu berjalan di server dan jawaban tersimpan otomatis selama Anda mengerjakan.</p></div></li>
            <li><span class="nomor" aria-hidden="true">4</span><div><h3>Lihat hasil</h3><p>Nilai dan rekap tampil setelah selesai, sesuai pengaturan guru untuk paket itu.</p></div></li>
          </ol>
        </section>

        <section class="bagian" id="penilaian" aria-labelledby="h-nilai">
          <h2 id="h-nilai">Format soal dan cara penilaian</h2>
          <p class="pengantar">Aturan penilaian tetap dan sama untuk semua paket, jadi nilai antar-paket dapat dibandingkan.</p>
          <div class="kisi-3">
            <article class="kartu format-kartu"><h3>Pilihan ganda</h3><p>Empat opsi (A–D) dengan satu jawaban benar.</p><p class="contoh tanpa-margin">Benar = 1, salah atau kosong = 0.</p></article>
            <article class="kartu format-kartu"><h3>Pilihan ganda kompleks (MCMA)</h3><p>Tiga pernyataan; tentukan Benar atau Salah untuk tiap pernyataan. Kuncinya selalu dua Benar dan satu Salah.</p><p class="contoh tanpa-margin">Dinilai per posisi pernyataan.</p></article>
            <article class="kartu format-kartu"><h3>Benar–Salah</h3><p>Tiga pernyataan; tentukan Benar atau Salah untuk tiap pernyataan. Kuncinya bervariasi.</p><p class="contoh tanpa-margin">Dinilai per posisi pernyataan.</p></article>
          </div>
          <div class="catatan-skor jarak-atas">
            <p><strong>Skor MCMA dan Benar–Salah:</strong> 3 posisi cocok = 1, 1–2 posisi cocok = 0,5, tidak ada yang cocok = 0. Jawaban seragam (semua Benar atau semua Salah) bernilai 0.</p>
            <p><strong>Nilai akhir</strong> = (skor total ÷ skor maksimum) × 100, dibulatkan ke dua angka desimal.</p>
          </div>
        </section>
      </div>
    </main>
    ${kakiPublik()}`);
  fokusJudul();
  muatDataBeranda(c);
}
AKSI['lompat-publik'] = function () { const i = el('#isi-publik'); if (i) i.focus(); };

function muatDataBeranda(c) {
  const taruh = function (d, galat) {
    if (!c.ok()) return;
    const bn = el('#bn-wadah'), pr = el('#pr-wadah');
    if (bn) {
      bersihkanLayarPublik();
      pasang(bn, htmlBanner(d ? d.banner : []));
      pasangBanner(el('[data-banner]', bn));
    }
    if (pr) pasang(pr, galat ? htmlPapanGalat(galat) : htmlPapanPeringkat(d.peringkat, d.maksBaris));
  };
  if (S.info.belumDipasang) { taruh(null, 'Aplikasi belum dipasang.'); return; }
  if (S.pemeliharaan) { taruh(null, 'Sistem sedang dalam pemeliharaan. Coba lagi beberapa menit lagi.'); return; }
  panggil('beranda.publik', {}, { ulang: true }).then(function (d) { taruh(d, null); }).catch(function (e) {
    if (e && e.ditangani) return;
    taruh(null, e && e.message ? e.message : null);
  });
}

function renderMasuk(p, c) {
  const nonaktif = S.info.belumDipasang;
  const untuk = p && (p.untuk === 'siswa' || p.untuk === 'staf') ? p.untuk : '';
  const judul = untuk === 'siswa' ? 'Masuk Siswa' : (untuk === 'staf' ? 'Masuk Guru / Admin' : 'Masuk ke ' + namaApp());
  const lead = untuk === 'siswa' ? 'Gunakan username dan password dari guru atau admin sekolah.'
    : (untuk === 'staf' ? 'Untuk guru dan admin yang mengelola paket soal, materi, dan akun.' : 'Siswa, guru, dan admin masuk dari formulir yang sama.');
  pasang(c.wadah, h`
    ${headerPublik(false)}${bannerPublik()}
    <main class="halaman-masuk" id="isi-publik" tabindex="-1">
      <section class="kartu kartu-masuk" aria-labelledby="judul-masuk" data-untuk="${untuk}">
        <span class="logo-besar">${logoMerek('ikon-xl')}</span>
        <h1 id="judul-masuk" tabindex="-1">${judul}</h1>
        <p class="teks-redam tanpa-margin">${lead}</p>
        ${p && p.pesan ? h`<div class="peringatan peringatan-waspada jarak-atas" role="status">${ikon('info')}<div><p>${p.pesan}</p></div></div>` : ''}
        <form data-kirim="masuk" novalidate autocomplete="on">
          <div data-galat aria-live="polite"></div>
          <div class="isian"><label for="f-username">Username</label>
            <input class="kontrol" id="f-username" name="username" type="text" inputmode="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="60" required${nonaktif ? mentah(' disabled') : ''}></div>
          ${kolomSandi({ nama: 'password', label: 'Password', id: 'f-password', autocomplete: 'current-password' })}
          <button type="submit" class="tombol tombol-penuh"${nonaktif ? mentah(' disabled') : ''}>${ikon('log-in')}<span>Masuk</span></button>
        </form>
        <div class="tautan-bawah">
          <span>Lupa password? Minta guru atau admin untuk mereset akun Anda.</span>
          ${untuk === 'staf'
            ? h`<button type="button" class="tombol tombol-polos" data-aksi="ke-masuk" data-untuk="siswa">${ikon('user')}<span>Siswa? Masuk di sini</span></button>`
            : h`<button type="button" class="tombol tombol-polos" data-aksi="ke-masuk" data-untuk="staf">${ikon('shield')}<span>Guru atau admin? Masuk di sini</span></button>`}
          <button type="button" class="tombol tombol-polos" data-aksi="ke-token">${ikon('key')}<span>Punya kode ujian? Mulai tanpa akun</span></button>
          <button type="button" class="tombol tombol-polos" data-aksi="ke-beranda">${ikon('chevron-left')}<span>Kembali ke beranda</span></button>
        </div>
      </section>
    </main>`);
  const u = el('#f-username'); if (u && !nonaktif) u.focus();
}

KIRIM.masuk = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  if (!v.username) { galatIsian(form, 'username', 'Username wajib diisi.'); return; }
  if (!v.password) { galatIsian(form, 'password', 'Password wajib diisi.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return masuk(v.username, v.password).then(function (d) {
      navigateTo(S.pengguna.langkahWajib ? 'wajib' : 'dasbor', {}, { tanpaRiwayat: true });
    });
  }).catch(function (e) {
    const pw = form.elements.password;
    if (pw) { pw.value = ''; }
    if (e.kode === 'LOGIN_GAGAL' || e.kode === 'DIBATASI' || e.kode === 'NONAKTIF' || e.kode === 'VALIDASI' || e.kode === 'PEMELIHARAAN' || e.kode === 'BELUM_PASANG') {
      galatForm(form, e.message);
      if (pw) pw.focus();
    } else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};


const BN_JEDA_MS = 4000;
const bnInstans = [];

function bnKurangiGerak() {
  try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
}
function bnUrlGambar(u, pratinjau) {
  if (pratinjau && typeof u === 'string' && /^blob:/i.test(u) && !/["'<>\s]/.test(u)) return u;
  return urlHttps(u);
}

function htmlBannerKosong(op) {
  if (op.admin) {
    return h`<section class="banner banner-kosong" data-uji="banner-kosong" aria-label="Pratinjau banner">
      <span class="ikon-bulat netral">${ikon('megaphone')}</span><h3>Belum ada banner aktif</h3>
      <p>Pengunjung beranda akan melihat panel sambutan sebagai ganti banner. Tambahkan banner lalu aktifkan agar tampil di sini.</p></section>`;
  }
  return h`<section class="banner banner-kosong" data-uji="banner-kosong" aria-labelledby="bn-kosong-judul">
    <span class="ikon-bulat">${ikon('target')}</span><h2 id="bn-kosong-judul" class="banner-kosong-judul">Latihan untuk tiga mata pelajaran</h2>
    <ul class="banner-kosong-mapel" role="list">${MAPEL_URUT.map(function (k) { return h`<li><span class="lencana lencana-primer">${ikon(IKON_MAPEL[k], 'ikon-sm')} ${MAPEL[k]}</span></li>`; })}</ul>
    <p>Pengumuman dari sekolah akan tampil di sini bila ada.</p></section>`;
}

function htmlBanner(daftar, o) {
  const op = o || {};
  const adaGambar = (daftar || []).filter(function (b) { return b && bnUrlGambar(b.url, op.pratinjau); });
  if (!adaGambar.length) return htmlBannerKosong(op);
  const n = adaGambar.length;
  const banyak = n > 1;
  return h`<section class="banner" data-banner data-uji="banner" aria-roledescription="carousel" aria-label="${op.label || 'Pengumuman'}">
    <h2 class="sr-only">${op.label || 'Pengumuman'}</h2>
    <div class="banner-lintasan" data-bn-lintasan aria-live="off">${adaGambar.map(function (b, i) {
      const u = bnUrlGambar(b.url, op.pratinjau);
      const tautan = urlHttps(b.tautan);
      const w = Math.max(0, parseInt(b.lebar, 10) || 0), t = Math.max(0, parseInt(b.tinggi, 10) || 0);
      return h`<article class="banner-slaid" role="group" aria-roledescription="slide" aria-label="${(i + 1) + ' dari ' + n}" data-bn-slaid${i ? mentah(' aria-hidden="true" inert') : ''}>
        <div class="banner-gambar"><img src="${u}" alt="${b.alt || ''}"${w && t ? mentah(' width="' + w + '" height="' + t + '"') : ''} decoding="async" referrerpolicy="no-referrer"${i ? mentah(' loading="lazy"') : ''} data-bn-gambar></div>
        ${b.judul || b.teks || tautan ? h`<div class="banner-teks">${b.judul ? h`<h3>${b.judul}</h3>` : ''}${b.teks ? h`<p>${b.teks}</p>` : ''}${tautan ? h`<a class="tombol tombol-garis tombol-kecil" href="${tautan}" target="_blank" rel="noopener noreferrer" data-uji="banner-tautan">${b.labelTautan || 'Buka tautan'}${ikon('external-link', 'ikon-sm')}<span class="sr-only"> (dibuka di tab baru)</span></a>` : ''}</div>` : ''}
      </article>`;
    })}</div>
    ${banyak ? h`<button type="button" class="banner-panah banner-panah-kiri" data-aksi="bn-sebelumnya" aria-label="Banner sebelumnya">${ikon('chevron-left')}</button>
    <button type="button" class="banner-panah banner-panah-kanan" data-aksi="bn-berikutnya" aria-label="Banner berikutnya">${ikon('chevron-right')}</button>` : ''}
  </section>`;
}

function bnCari(root) {
  for (let i = 0; i < bnInstans.length; i++) if (bnInstans[i].root === root) return bnInstans[i];
  return null;
}
function bnBuang(inst) {
  if (inst.pewaktu) { clearInterval(inst.pewaktu); inst.pewaktu = null; }
  const i = bnInstans.indexOf(inst);
  if (i >= 0) bnInstans.splice(i, 1);
}
function bersihkanLayarPublik() {
  bnInstans.slice().forEach(bnBuang);
}
function bnAtur(inst) {
  if (inst.pewaktu) { clearInterval(inst.pewaktu); inst.pewaktu = null; }
  if (inst.n < 2 || !inst.jalan) return;
  inst.pewaktu = setInterval(function () {
    if (!document.body || !document.body.contains(inst.root)) { bnBuang(inst); return; }
    if (inst.tertahan || document.hidden) return;
    bnKe(inst, inst.idx + 1, false, 1);
  }, BN_JEDA_MS);
}
function bnTandai(slaid, tampak) {
  if (tampak) { slaid.removeAttribute('aria-hidden'); slaid.removeAttribute('inert'); } else { slaid.setAttribute('aria-hidden', 'true'); slaid.setAttribute('inert', ''); }
  semua('a, button', slaid).forEach(function (a) { if (tampak) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1'); });
}
function bnKe(inst, i, pengguna, arah) {
  if (inst.n < 1) return;
  const baru = ((i % inst.n) + inst.n) % inst.n;
  const lintasan = el('[data-bn-lintasan]', inst.root);
  if (lintasan) lintasan.setAttribute('aria-live', pengguna || !inst.jalan || inst.tertahan ? 'polite' : 'off');
  const slaid = semua('[data-bn-slaid]', inst.root);
  const lama = inst.idx;
  const arahGeser = arah || (baru >= lama ? 1 : -1);
  if (baru !== lama && slaid[baru] && slaid[lama]) {
    slaid.forEach(function (s, k) {
      if (k === baru) { s.style.transition = 'none'; s.style.transform = 'translateX(' + (arahGeser * 100) + '%)'; }
      else if (k !== lama) { s.style.transition = 'none'; s.style.transform = 'translateX(100%)'; }
    });
    void (lintasan || inst.root).offsetWidth;
    slaid[baru].style.transition = ''; slaid[baru].style.transform = 'translateX(0)';
    slaid[lama].style.transition = ''; slaid[lama].style.transform = 'translateX(' + (-arahGeser * 100) + '%)';
  }
  slaid.forEach(function (s, k) { bnTandai(s, k === baru); });
  inst.idx = baru;
  bnMuatBerikut(inst);
}
function bnMuatBerikut(inst) {
  const slaid = semua('[data-bn-slaid]', inst.root);
  const s = slaid[(inst.idx + 1) % Math.max(1, slaid.length)];
  const im = s && s.querySelector('img[loading="lazy"]');
  if (im) im.loading = 'eager';
}
function pasangBanner(root) {
  if (!root || !root.hasAttribute || !root.hasAttribute('data-banner')) return null;
  const lama = bnCari(root);
  if (lama) bnBuang(lama);
  const n = semua('[data-bn-slaid]', root).length;
  const inst = { root: root, idx: 0, n: n, jalan: n > 1, pewaktu: null, tertahan: false };
  bnInstans.push(inst);
  bnMuatBerikut(inst);
  const tahan = function (ya) { inst.tertahan = ya; };
  root.addEventListener('mouseenter', function () { tahan(true); });
  root.addEventListener('mouseleave', function () { tahan(false); });
  root.addEventListener('focusin', function () { tahan(true); });
  root.addEventListener('focusout', function (e) { if (!e.relatedTarget || !root.contains(e.relatedTarget)) tahan(false); });
  root.addEventListener('keydown', function (e) {
    if (inst.n < 2) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); bnKe(inst, inst.idx - 1, true, -1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); bnKe(inst, inst.idx + 1, true, 1); }
  });
  let x0 = null, y0 = null;
  root.addEventListener('touchstart', function (e) { const t = e.touches && e.touches[0]; if (t) { x0 = t.clientX; y0 = t.clientY; } tahan(true); }, { passive: true });
  root.addEventListener('touchend', function (e) {
    const t = e.changedTouches && e.changedTouches[0];
    if (t && x0 !== null && inst.n > 1) {
      const dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) bnKe(inst, inst.idx + (dx < 0 ? 1 : -1), true, dx < 0 ? 1 : -1);
    }
    x0 = null; y0 = null;
    tahan(false);
  }, { passive: true });
  root.addEventListener('touchcancel', function () { x0 = null; y0 = null; tahan(false); }, { passive: true });
  root.addEventListener('error', function (e) {
    const im = e.target;
    if (!im || im.tagName !== 'IMG' || !im.hasAttribute('data-bn-gambar')) return;
    const alt = im.getAttribute('alt') || '';
    const kotak = document.createElement('div');
    kotak.className = 'banner-gagal';
    kotak.setAttribute('data-uji', 'banner-gambar-gagal');
    if (alt) { kotak.setAttribute('role', 'img'); kotak.setAttribute('aria-label', alt); }
    kotak.innerHTML = '<svg class="ikon ikon-lg" aria-hidden="true" focusable="false"><use href="#i-image"/></svg><span>Gambar tidak dapat dimuat</span>';
    if (im.parentNode) im.parentNode.replaceChild(kotak, im);
  }, true);
  bnAtur(inst);
  return inst;
}

AKSI['bn-sebelumnya'] = function (b) { const i = bnCari(b.closest('[data-banner]')); if (i) bnKe(i, i.idx - 1, true, -1); };
AKSI['bn-berikutnya'] = function (b) { const i = bnCari(b.closest('[data-banner]')); if (i) bnKe(i, i.idx + 1, true, 1); };


const prSt = { mapel: 'BIN', data: null };

function prDaftar(kode) {
  const d = prSt.data || [];
  for (let i = 0; i < d.length; i++) if (d[i] && d[i].mapel === kode) return Array.isArray(d[i].daftar) ? d[i].daftar : [];
  return [];
}
function prMapelAwal(data) {
  for (let i = 0; i < MAPEL_URUT.length; i++) {
    const k = MAPEL_URUT[i];
    const d = (data || []).filter(function (x) { return x && x.mapel === k; })[0];
    if (d && Array.isArray(d.daftar) && d.daftar.length) return k;
  }
  return MAPEL_URUT[0];
}

function htmlPeringkatIsi(kode) {
  const daftar = prDaftar(kode);
  if (!daftar.length) {
    return h`<div class="kosong papan-kosong" data-uji="peringkat-kosong"><span class="ikon-bulat netral">${ikon('trophy')}</span><h3>Belum ada peringkat ${MAPEL[kode]}</h3>
      <p>Peringkat muncul setelah siswa yang punya akun menyelesaikan Try Out Utama ${MAPEL[kode]}.</p></div>`;
  }
  return h`<div class="bungkus-tabel papan-tabel"><table class="tabel papan" data-uji="peringkat-tabel">
    <caption class="sr-only">Peringkat ${MAPEL[kode]}, paling banyak ${formatAngka(daftar.length)} baris</caption>
    <thead><tr><th scope="col">Peringkat</th><th scope="col">Nama</th><th scope="col">Sekolah</th><th scope="col">Rerata</th></tr></thead>
    <tbody>${daftar.map(function (r) {
      const atas = r.peringkat <= 3;
      return h`<tr class="${atas ? 'papan-atas' : ''}" data-uji="peringkat-baris">
        <td data-label="Peringkat" class="papan-no"><span class="papan-lencana${atas ? ' papan-lencana-atas' : ''}">${atas ? ikon('award', 'ikon-sm') : ''}<span class="angka">${formatAngka(r.peringkat)}</span></span></td>
        <td data-label="Nama" class="pecah papan-nama">${r.nama}</td>
        <td data-label="Sekolah" class="pecah papan-sekolah">${r.sekolah || '—'}</td>
        <td data-label="Rerata" class="angka papan-rerata">${formatAngka(r.rerata, 2)}</td></tr>`;
    })}</tbody></table></div>`;
}

function htmlPapanPeringkat(data, maks) {
  prSt.data = data || [];
  prSt.mapel = prMapelAwal(prSt.data);
  return h`<section class="papan-peringkat" aria-labelledby="h-papan" data-uji="papan">
    <div class="papan-kepala"><div><h2 id="h-papan">Peringkat per mata pelajaran</h2>
      <p class="pengantar">Dihitung dari rerata nilai Try Out Utama. Tiap mata pelajaran dihitung sendiri, dan rerata yang sama berarti peringkat bersama. Nama siswa yang disembunyikan Admin tampil sebagai &quot;Nama disembunyikan&quot;${maks ? ' (paling banyak ' + formatAngka(maks) + ' baris)' : ''}.</p></div></div>
    <div class="papan-tab" role="tablist" aria-label="Mata pelajaran">${MAPEL_URUT.map(function (k) {
      const aktif = k === prSt.mapel;
      return h`<button type="button" class="papan-tab-btn" role="tab" id="pr-tab-${k}" aria-controls="pr-panel" aria-selected="${aktif ? 'true' : 'false'}" tabindex="${aktif ? '0' : '-1'}" data-aksi="pr-tab" data-mapel="${k}" data-pr-tab>${ikon(IKON_MAPEL[k], 'ikon-sm')}<span>${MAPEL[k]}</span></button>`;
    })}</div>
    <div id="pr-panel" role="tabpanel" aria-labelledby="pr-tab-${prSt.mapel}" tabindex="0">${htmlPeringkatIsi(prSt.mapel)}</div>
  </section>`;
}
function htmlPapanGalat(pesan) {
  return h`<section class="papan-peringkat" aria-labelledby="h-papan" data-uji="papan-galat"><h2 id="h-papan">Peringkat per mata pelajaran</h2>
    <div class="kosong"><span class="ikon-bulat bahaya">${ikon('alert-triangle')}</span><h3>Peringkat belum bisa dimuat</h3><p>${pesan || 'Terjadi kesalahan saat memuat peringkat.'}</p>
      <button type="button" class="tombol tombol-garis" data-aksi="muat-ulang">${ikon('refresh')}<span>Coba lagi</span></button></div></section>`;
}

function prPilih(kode, fokus) {
  if (MAPEL_URUT.indexOf(kode) < 0) return;
  prSt.mapel = kode;
  semua('[data-pr-tab]').forEach(function (b) {
    const aktif = b.getAttribute('data-mapel') === kode;
    b.setAttribute('aria-selected', aktif ? 'true' : 'false');
    b.setAttribute('tabindex', aktif ? '0' : '-1');
    if (aktif && fokus) b.focus();
  });
  const p = el('#pr-panel');
  if (p) { p.setAttribute('aria-labelledby', 'pr-tab-' + kode); pasang(p, htmlPeringkatIsi(kode)); }
}
AKSI['pr-tab'] = function (b) { prPilih(b.getAttribute('data-mapel'), false); };
document.addEventListener('keydown', function (e) {
  const t = e.target && e.target.closest ? e.target.closest('[data-pr-tab]') : null;
  if (!t) return;
  const i = MAPEL_URUT.indexOf(t.getAttribute('data-mapel'));
  let ke = -1;
  if (e.key === 'ArrowRight') ke = (i + 1) % MAPEL_URUT.length;
  else if (e.key === 'ArrowLeft') ke = (i + MAPEL_URUT.length - 1) % MAPEL_URUT.length;
  else if (e.key === 'Home') ke = 0;
  else if (e.key === 'End') ke = MAPEL_URUT.length - 1;
  if (ke < 0) return;
  e.preventDefault();
  prPilih(MAPEL_URUT[ke], true);
});


let totalLangkahWajib = 0;

function evaluasiSandi(baru, ulang, username) {
  const b = typeof baru === 'string' ? baru : '';
  const aturan = [
    { id: 'panjang', teks: 'Minimal 8 karakter', ok: b.length >= 8 && b.length <= 128 },
    { id: 'huruf', teks: 'Memuat huruf', ok: /[A-Za-z]/.test(b) },
    { id: 'angka', teks: 'Memuat angka', ok: /[0-9]/.test(b) },
    { id: 'beda', teks: 'Berbeda dari username', ok: b.length > 0 && (!username || b.toLowerCase() !== String(username).toLowerCase()) },
    { id: 'sama', teks: 'Pengulangan password cocok', ok: b.length > 0 && b === ulang }
  ];
  return { aturan: aturan, semuaOk: aturan.every(function (a) { return a.ok; }) };
}
function daftarAturanSandi(hasil) {
  return h`<ul class="aturan" aria-label="Syarat password baru">${hasil.aturan.map(function (a) {
    return h`<li data-ok="${a.ok ? 'true' : 'false'}">${ikon(a.ok ? 'check-circle' : 'circle')}<span>${a.teks}<span class="sr-only"> — ${a.ok ? 'terpenuhi' : 'belum terpenuhi'}</span></span></li>`;
  })}</ul>`;
}
MASUKAN['aturan-sandi'] = function (input) {
  const form = input.form;
  if (!form) return;
  const v = nilaiForm(form);
  const w = el('[data-aturan]', form);
  if (w) pasang(w, daftarAturanSandi(evaluasiSandi(v.password_baru, v.password_ulang, S.pengguna && S.pengguna.username)));
};

function formUbahPassword(konteks) {
  const wajib = konteks === 'wajib';
  const awal = evaluasiSandi('', '', S.pengguna.username);
  return h`<form data-kirim="ubah-password" data-konteks="${konteks}" id="f-ubah-password-${konteks}" novalidate>
    <div data-galat aria-live="polite"></div>
    ${kolomSandi({ nama: 'password_sekarang', label: wajib ? 'Password sementara' : 'Password saat ini', id: 'sandi-sekarang-' + konteks, autocomplete: 'current-password', bantu: wajib ? 'Password yang diberikan guru atau admin saat akun dibuat atau direset.' : '' })}
    <div class="isian"><label for="sandi-baru-${konteks}">Password baru</label>
      <div class="dengan-tombol"><input class="kontrol" type="password" id="sandi-baru-${konteks}" name="password_baru" autocomplete="new-password" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="128" required data-masuk="aturan-sandi">
      <button type="button" class="tombol-sisip" data-aksi="lihat-sandi" aria-label="Tampilkan password" aria-pressed="false">${ikon('eye')}</button></div></div>
    <div class="isian"><label for="sandi-ulang-${konteks}">Ulangi password baru</label>
      <div class="dengan-tombol"><input class="kontrol" type="password" id="sandi-ulang-${konteks}" name="password_ulang" autocomplete="new-password" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="128" required data-masuk="aturan-sandi">
      <button type="button" class="tombol-sisip" data-aksi="lihat-sandi" aria-label="Tampilkan password" aria-pressed="false">${ikon('eye')}</button></div></div>
    <div data-aturan>${daftarAturanSandi(awal)}</div>
    ${wajib ? '' : h`<p class="bantu">Setelah password diganti, perangkat lain yang sedang masuk dengan akun ini otomatis keluar.</p>`}
    <div class="aksi-form"><button type="submit" class="tombol">${ikon('lock')}<span>${wajib ? 'Simpan password baru' : 'Ganti password'}</span></button></div>
  </form>`;
}

KIRIM['ubah-password'] = function (form) {
  bersihGalat(form);
  const konteks = form.getAttribute('data-konteks');
  const v = nilaiForm(form);
  if (!v.password_sekarang) { galatIsian(form, 'password_sekarang', 'Password saat ini wajib diisi.'); return; }
  const cek = evaluasiSandi(v.password_baru, v.password_ulang, S.pengguna.username);
  if (!cek.aturan[0].ok || !cek.aturan[1].ok || !cek.aturan[2].ok || !cek.aturan[3].ok) { galatIsian(form, 'password_baru', 'Password baru belum memenuhi syarat di bawah.'); return; }
  if (!cek.aturan[4].ok) { galatIsian(form, 'password_ulang', 'Pengulangan password tidak sama dengan password baru.'); return; }
  if (v.password_baru === v.password_sekarang) { galatIsian(form, 'password_baru', 'Password baru harus berbeda dari password saat ini.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('profil.ubahPassword', { password_sekarang: v.password_sekarang, password_baru: v.password_baru }).then(function (d) {
      S.pengguna.wajibGanti = false;
      S.pengguna.langkahWajib = hitungLangkah(S.pengguna);
      form.reset();
      toast(d && d.sesiLainDicabut ? 'Password diganti. Sesi di perangkat lain dikeluarkan.' : 'Password berhasil diganti.', 'sukses');
      if (konteks === 'wajib') navigateTo(S.pengguna.langkahWajib ? 'wajib' : 'dasbor', {}, { tanpaRiwayat: true });
      else MASUKAN['aturan-sandi'](form.elements.password_baru);
    });
  }).catch(function (e) {
    if (e.kode === 'SANDI_SALAH') galatIsian(form, 'password_sekarang', e.message);
    else if (e.kode === 'VALIDASI') galatIsian(form, 'password_baru', e.message);
    else if (e.kode === 'DIBATASI') galatForm(form, e.message);
    else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};

function formIdentitas(konteks) {
  const wajib = konteks === 'wajib';
  const pr = S.profil || {};
  return h`<form data-kirim="simpan-identitas" data-konteks="${konteks}" id="f-identitas-${konteks}" novalidate>
    <div data-galat aria-live="polite"></div>
    <div class="isian"><label for="id-nama-${konteks}">Nama lengkap</label>
      <input class="kontrol" id="id-nama-${konteks}" name="nama_lengkap" type="text" autocomplete="name" maxlength="100" required value="${pr.namaLengkap || ''}" aria-describedby="id-nama-${konteks}-b">
      <p class="bantu" id="id-nama-${konteks}-b">Tulis sesuai ijazah atau akta. Nama ini tampil di hasil Anda.</p></div>
    <div class="kelompok-isian">
      <div class="isian"><label for="id-lahir-${konteks}">Tanggal lahir</label>
        <input class="kontrol" id="id-lahir-${konteks}" name="tanggal_lahir" type="date" autocomplete="bday" required min="${tahunLalu(25)}" max="${hariIniISO()}" value="${pr.tanggalLahir || ''}"></div>
      <fieldset class="isian fieldset-polos"><legend class="label">Jenis kelamin</legend>
        <div class="segmen" role="radiogroup" aria-label="Jenis kelamin">
          <label>${ikon('check')}<input type="radio" name="jenis_kelamin" value="L"${pr.jenisKelamin === 'L' ? mentah(' checked') : ''}> Laki-laki</label>
          <label>${ikon('check')}<input type="radio" name="jenis_kelamin" value="P"${pr.jenisKelamin === 'P' ? mentah(' checked') : ''}> Perempuan</label>
        </div></fieldset>
    </div>
    <div class="isian"><label for="id-sekolah-${konteks}">Asal sekolah</label>
      <input class="kontrol" id="id-sekolah-${konteks}" name="sekolah" type="text" list="dl-sekolah-${konteks}" autocomplete="organization" maxlength="100" required value="${pr.sekolah || ''}" aria-describedby="id-sekolah-${konteks}-b">
      <datalist id="dl-sekolah-${konteks}">${(S.sekolah || []).map(function (n) { return h`<option value="${n}"></option>`; })}</datalist>
      <p class="bantu" id="id-sekolah-${konteks}-b">Pilih dari saran bila ada, atau ketik nama sekolah Anda.</p></div>
    <p class="bantu catatan-papan" data-uji="catatan-papan-identitas">Nama lengkap dan asal sekolah Anda tampil di papan peringkat beranda bila Anda masuk 20 besar sebuah mata pelajaran. Bila ingin disembunyikan, minta orang tua atau wali menghubungi Admin.</p>
    <div class="isian"><span class="label">Kelas</span>
      <div class="kontrol kotak-baca" aria-readonly="true">${pr.kelas ? pr.kelas : 'Belum diisi'}</div>
      <p class="bantu">Kelas diisi oleh admin. Tanggal lahir hanya terlihat oleh Anda dan Admin Utama.</p></div>
    <div class="aksi-form"><button type="submit" class="tombol">${ikon('save')}<span>${wajib ? 'Simpan dan lanjut' : 'Simpan identitas'}</span></button></div>
  </form>`;
}

function periksaIdentitas(v) {
  if (!v.nama_lengkap || v.nama_lengkap.length < 3) return ['nama_lengkap', 'Nama lengkap minimal 3 karakter.'];
  try {
    if (!/^[\p{L}\p{M}][\p{L}\p{M} .,'’\-]*$/u.test(v.nama_lengkap)) return ['nama_lengkap', 'Nama hanya boleh berisi huruf, spasi, titik, koma, apostrof, dan strip.'];
  } catch (e) {   }
  if (!v.tanggal_lahir) return ['tanggal_lahir', 'Tanggal lahir wajib diisi.'];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.tanggal_lahir)) return ['tanggal_lahir', 'Format tanggal lahir tidak sah.'];
  if (v.tanggal_lahir > hariIniISO()) return ['tanggal_lahir', 'Tanggal lahir tidak boleh di masa depan.'];
  if (v.jenis_kelamin !== 'L' && v.jenis_kelamin !== 'P') return ['jenis_kelamin', 'Pilih jenis kelamin.'];
  if (!v.sekolah || v.sekolah.length < 3) return ['sekolah', 'Asal sekolah minimal 3 karakter.'];
  return null;
}

KIRIM['simpan-identitas'] = function (form) {
  bersihGalat(form);
  const konteks = form.getAttribute('data-konteks');
  const v = nilaiForm(form);
  const salah = periksaIdentitas(v);
  if (salah) { galatIsian(form, salah[0], salah[1]); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('profil.simpanIdentitas', {
      nama_lengkap: v.nama_lengkap, tanggal_lahir: v.tanggal_lahir, jenis_kelamin: v.jenis_kelamin, sekolah: v.sekolah
    }).then(function (d) {
      S.pengguna = d.pengguna; S.profil = d.profil; S.sembunyiNama = !!d.sembunyiNama; S.sekolah = d.sekolah || S.sekolah;
      toast(konteks === 'wajib' ? 'Identitas tersimpan. Selamat berlatih!' : 'Identitas diperbarui.', 'sukses');
      navigateTo(S.pengguna.langkahWajib ? 'wajib' : (konteks === 'wajib' ? 'dasbor' : 'profil'), {}, { tanpaRiwayat: true });
    });
  }).catch(function (e) {
    if (e.kode === 'VALIDASI') {
      const m = e.message.toLowerCase();
      const nama = m.indexOf('tanggal') >= 0 ? 'tanggal_lahir' : (m.indexOf('sekolah') >= 0 ? 'sekolah' : (m.indexOf('kelamin') >= 0 ? 'jenis_kelamin' : 'nama_lengkap'));
      galatIsian(form, nama, e.message);
    } else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};

function renderWajib(p, c) {
  const u = S.pengguna;
  const sisa = [];
  if (u.wajibGanti) sisa.push('ganti_password');
  if (u.peran === PERAN.SISWA && !u.identitasLengkap) sisa.push('identitas');
  if (!sisa.length) { navigateTo('dasbor', {}, { tanpaRiwayat: true }); return; }
  if (sisa.length > totalLangkahWajib) totalLangkahWajib = sisa.length;
  const ke = totalLangkahWajib - sisa.length + 1;
  const sekarang = sisa[0];
  const titik = [];
  for (let i = 1; i <= totalLangkahWajib; i++) {
    if (i > 1) titik.push(h`<span class="garis" aria-hidden="true"></span>`);
    titik.push(h`<span class="titik ${i < ke ? 'selesai' : (i === ke ? 'aktif' : '')}" aria-hidden="true">${i < ke ? ikon('check', 'ikon-sm') : i}</span>`);
  }
  document.title = 'Lengkapi akun Anda · ' + namaApp();
  pasang(c.wadah, h`
    <div class="halaman-wajib">
      <div class="atas">
        <span class="merek"><span class="logo">${logoMerek()}</span><span class="nama">${namaApp()}</span></span>
        <span class="rata-kanan baris-rapat">
          <button type="button" class="tombol tombol-diam tombol-ikon" data-aksi="tema" aria-label="Ganti tema">${ikon('moon')}</button>
          <button type="button" class="tombol tombol-diam" data-aksi="keluar">${ikon('log-out')}<span>Keluar</span></button>
        </span>
      </div>
      <main class="kartu kartu-wajib" id="isi-publik" tabindex="-1">
        ${totalLangkahWajib > 1 ? h`<div class="langkah" role="group" aria-label="Langkah ${ke} dari ${totalLangkahWajib}">${titik}<span class="teks">Langkah ${ke} dari ${totalLangkahWajib}</span></div>` : ''}
        ${sekarang === 'ganti_password' ? h`
          <h1 id="judul-wajib" tabindex="-1">Buat password baru</h1>
          <p class="teks-redam">Halo, ${u.nama}. Password sementara hanya dipakai untuk masuk pertama kali. Buat password pribadi yang hanya Anda yang tahu. Username <strong>${u.username}</strong> bisa diubah kapan saja di menu Profil.</p>
          ${formUbahPassword('wajib')}` : h`
          <h1 id="judul-wajib" tabindex="-1">Lengkapi identitas diri</h1>
          <p class="teks-redam">Isi data berikut sekali saja agar akun Anda siap dipakai. Data bisa diperbarui nanti di menu Profil.</p>
          ${formIdentitas('wajib')}`}
      </main>
    </div>`);
  terapkanTema(S.tema);
  const j = el('#judul-wajib'); if (j) { try { j.focus({ preventScroll: true }); } catch (e) {   } }
}


function kpi(ikonNama, label, nilai, sub, jenis) {
  return h`<article class="kartu kpi"><div class="kpi-label"><span class="ikon-bulat ${jenis || ''}">${ikon(ikonNama)}</span>${label}</div><div class="kpi-nilai">${formatAngka(nilai)}</div>${sub ? h`<div class="kpi-sub">${sub}</div>` : ''}</article>`;
}

function daftarAktivitas(daftar) {
  if (!daftar || !daftar.length) return h`<div class="kosong"><span class="ikon-bulat netral">${ikon('activity')}</span><p>Belum ada aktivitas tercatat.</p></div>`;
  return h`<ul class="aktivitas">${daftar.map(function (a) {
    return h`<li><span class="titik-aktv" aria-hidden="true"></span><div class="teks"><div><strong>${labelAksi(a.aksi)}</strong> — ${a.ringkasan || ''}</div><div class="meta">${a.pelaku} · ${waktuWIB(a.waktu)}</div></div></li>`;
  })}</ul>`;
}

function kartuBackup(b, tombol) {
  let isi;
  if (!b || !b.jumlah) {
    isi = h`<div class="peringatan peringatan-waspada">${ikon('alert-triangle')}<div><p><strong>Belum ada backup.</strong> Buat backup pertama sekarang agar data bisa dipulihkan bila terjadi kesalahan.</p></div></div>`;
  } else {
    const t = b.terakhir;
    const gagalTerakhir = t && t.verifikasi !== 'lulus';
    isi = h`<div class="status-backup">
      <div class="baris-status"><span class="lencana ${gagalTerakhir ? 'lencana-bahaya' : 'lencana-sukses'}">${ikon(gagalTerakhir ? 'alert-circle' : 'check', 'ikon-sm')} ${gagalTerakhir ? 'Backup terakhir gagal verifikasi' : 'Backup terakhir terverifikasi'}</span><span class="teks-redam">${waktuWIB(t && t.waktu)}</span></div>
      <p class="tanpa-margin teks-redam">Terverifikasi berarti salinan berhasil dibuat dan jumlah barisnya cocok dengan data asli. Itu belum membuktikan data bisa dipulihkan.</p>
      ${b.terbukti
        ? h`<div class="peringatan peringatan-sukses">${ikon('check-circle')}<div><p><strong>Uji restore lulus</strong> terakhir pada ${waktuWIB(b.ujiRestoreLulusTerakhir && b.ujiRestoreLulusTerakhir.waktu)}. Pencocokan data secara manual tetap perlu Anda lakukan.</p></div></div>`
        : h`<div class="peringatan peringatan-waspada">${ikon('alert-triangle')}<div><p><strong>Pemulihan belum terbukti.</strong> Belum ada uji restore yang lulus. Jalankan “Uji restore” di menu Backup lalu cocokkan datanya.</p></div></div>`}
    </div>`;
  }
  return h`<section class="kartu" aria-labelledby="h-backup"><div class="kartu-judul"><span class="ikon-bulat">${ikon('database')}</span><h3 id="h-backup">Cadangan data</h3></div>${isi}${tombol ? h`<div class="jarak-atas"><button type="button" class="tombol tombol-garis" data-aksi="nav" data-ke="backup">${ikon('database')}<span>Buka Backup &amp; Pulihkan</span></button></div>` : ''}</section>`;
}


function batangPersen(nilai, tingkat) {
  const v = Math.max(0, Math.min(100, Number(nilai) || 0));
  return h`<span class="rr-lintasan" aria-hidden="true"><svg viewBox="0 0 100 10" preserveAspectRatio="none" focusable="false"><rect class="rr-latar" x="0" y="0" width="100" height="10"/><rect class="rr-isi ${tingkat || ''}" x="0" y="0" width="${v}" height="10"/></svg></span>`;
}

function barisRerata(namaIkon, label, sub, rerata, n) {
  const ada = n > 0 && rerata !== null && rerata !== undefined;
  return h`<li class="rr-baris" data-uji="rerata-baris">
    <span class="rr-label">${namaIkon ? ikon(namaIkon, 'ikon-sm') : ''}<span class="rr-nama"><span data-uji="rerata-nama">${label}</span>${sub ? h`<span class="rr-sub">${sub}</span>` : ''}</span></span>
    ${ada ? batangPersen(rerata) : h`<span class="rr-lintasan rr-kosong"><span>Belum ada nilai</span></span>`}
    <span class="rr-nilai"><strong data-uji="rerata-nilai">${ada ? formatAngka(rerata, 2) : '—'}</strong><span class="rr-n">${formatAngka(n)} percobaan</span></span>
  </li>`;
}

function kartuRerataMapel(r) {
  const ada = r.mapel.some(function (m) { return m.n > 0; });
  return h`<section class="kartu" aria-labelledby="h-rr-mapel" data-uji="rerata-mapel"><div class="kartu-judul"><span class="ikon-bulat">${ikon('bar-chart')}</span><h3 id="h-rr-mapel">Rata-rata nilai per mata pelajaran</h3></div>
    <ul class="rr-daftar" role="list">${r.mapel.map(function (m) { return barisRerata(IKON_MAPEL[m.mapel], MAPEL[m.mapel] || m.mapel, '', m.rerata, m.n); })}</ul>
    <p class="bantu jarak-atas">${ada ? 'Dihitung dari semua percobaan yang sudah selesai pada skala 0–100, termasuk peserta token. Percobaan yang masih berjalan atau dibatalkan tidak dihitung.' : 'Belum ada percobaan yang selesai. Rata-rata tampil di sini setelah ada siswa yang menyelesaikan ujian.'}</p></section>`;
}

function kartuRerataPaket(r) {
  return h`<section class="kartu" aria-labelledby="h-rr-paket" data-uji="rerata-paket"><div class="kartu-judul"><span class="ikon-bulat">${ikon('package')}</span><h3 id="h-rr-paket">Rata-rata nilai per paket soal</h3></div>
    ${r.paket.length
      ? h`<ul class="rr-daftar" role="list">${r.paket.map(function (p) { return barisRerata(null, p.nama, MAPEL[p.mapel] || p.mapel, p.rerata, p.n); })}</ul>
        <p class="bantu jarak-atas">${r.paketLain > 0 ? formatAngka(r.paketLain) + ' paket lain yang sudah dikerjakan tidak ditampilkan; ditampilkan 10 paket yang paling banyak dikerjakan.' : 'Paket yang sudah dikerjakan, dari yang paling banyak percobaannya.'}</p>`
      : h`<div class="kosong"><span class="ikon-bulat netral">${ikon('package')}</span><p>Belum ada paket yang sudah dikerjakan.</p></div>`}
  </section>`;
}


function dsUkuran(bayt) {
  const x = Number(bayt);
  if (!isFinite(x) || x < 0) return '—';
  const satuan = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0, v = x;
  while (v >= 1024 && i < satuan.length - 1) { v /= 1024; i++; }
  return formatAngka(v, i === 0 || v >= 100 ? 0 : 1) + ' ' + satuan[i];
}
const TINGKAT_KAPASITAS = {
  aman: { kelas: 'lencana-sukses', ikon: 'check-circle', teks: 'Aman' },
  waspada: { kelas: 'lencana-peringatan', ikon: 'alert-triangle', teks: 'Waspada' },
  bahaya: { kelas: 'lencana-bahaya', ikon: 'alert-circle', teks: 'Hampir penuh' }
};
function lencanaTingkat(t) {
  const k = TINGKAT_KAPASITAS[t] || TINGKAT_KAPASITAS.aman;
  return h`<span class="lencana ${k.kelas}" data-uji="kap-tingkat">${ikon(k.ikon, 'ikon-sm')} ${k.teks}</span>`;
}

function kartuKapasitasSheet(s) {
  const peringatan = s.tingkat === 'bahaya'
    ? 'Kapasitas di atas 90%. Penulisan data baru bisa gagal bila batas tercapai. Buat backup, lalu kurangi data (misalnya hapus riwayat percobaan yang sudah tidak dibutuhkan) sebelum ujian berikutnya.'
    : (s.tingkat === 'waspada' ? 'Kapasitas sudah di atas 70%. Rencanakan pengurangan data lama sebelum musim ujian berikutnya.' : '');
  return h`<section class="kartu" aria-labelledby="h-kap-sheet" data-uji="kapasitas-sheet"><div class="kartu-judul"><span class="ikon-bulat">${ikon('database')}</span><h3 id="h-kap-sheet">Kapasitas Spreadsheet</h3></div>
    <div class="kap-ringkas"><strong class="kap-persen" data-uji="kap-persen">${formatAngka(s.persen, 2)}%</strong>${lencanaTingkat(s.tingkat)}</div>
    ${batangPersen(s.persen, s.tingkat)}
    <p class="kap-angka" data-uji="kap-angka">${formatAngka(s.selTerpakai)} dari ${formatAngka(s.batas)} sel terpakai · ${formatAngka(s.jumlahLembar)} lembar</p>
    ${peringatan ? h`<div class="peringatan ${s.tingkat === 'bahaya' ? 'peringatan-bahaya' : 'peringatan-waspada'}" data-uji="kap-peringatan">${ikon('alert-triangle')}<div><p>${peringatan}</p></div></div>` : ''}
    <div class="kap-tabel-bungkus jarak-atas"><table class="tabel-kap" data-uji="kap-tabel"><caption>Lembar dengan sel terbanyak</caption>
      <thead><tr><th scope="col">Lembar</th><th scope="col" class="angka">Baris terisi</th><th scope="col" class="angka">Sel</th></tr></thead>
      <tbody>${s.terbesar.map(function (x) { return h`<tr><th scope="row">${x.nama}</th><td class="angka">${formatAngka(x.terisi)}</td><td class="angka">${formatAngka(x.sel)}</td></tr>`; })}</tbody></table></div>
    <p class="bantu jarak-atas">Google Sheets membatasi 10 juta sel per spreadsheet. Yang dihitung adalah seluruh kisi lembar (termasuk sel kosong), bukan hanya baris yang terisi.</p>
  </section>`;
}

function kartuKapasitasDrive(d, b) {
  return h`<section class="kartu" aria-labelledby="h-kap-drive" data-uji="kapasitas-drive"><div class="kartu-judul"><span class="ikon-bulat">${ikon('hard-drive')}</span><h3 id="h-kap-drive">Kapasitas Google Drive</h3></div>
    ${d.tersedia
      ? h`<div class="kap-ringkas"><strong class="kap-persen" data-uji="kap-persen">${formatAngka(d.persen, 2)}%</strong>${lencanaTingkat(d.tingkat)}</div>
        ${batangPersen(d.persen, d.tingkat)}
        <p class="kap-angka" data-uji="kap-angka">${dsUkuran(d.terpakai)} dari ${dsUkuran(d.batas)} terpakai</p>
        <p class="bantu">Angka ini kuota seluruh akun Google pemilik aplikasi (Drive, Gmail, Foto), bukan hanya berkas aplikasi ini.</p>`
      : h`<div class="peringatan peringatan-info" data-uji="kap-drive-tidak-ada">${ikon('info')}<div><p><strong>Kuota Drive tidak dapat dibaca.</strong> Google tidak memberikan angka kuota kepada aplikasi saat ini. Periksa langsung di pengaturan penyimpanan akun Google pemilik aplikasi.</p></div></div>`}
    <div class="kap-berkas jarak-atas" data-uji="kap-berkas"><strong>Berkas aplikasi:</strong> ${formatAngka(b.jumlah)} berkas, ${dsUkuran(b.ukuran)}
      <span class="bantu">Gambar soal dan banner ${formatAngka(b.rincian.media.n)} (${dsUkuran(b.rincian.media.ukuran)}) · pembahasan ${formatAngka(b.rincian.pembahasan.n)} (${dsUkuran(b.rincian.pembahasan.ukuran)}) · materi ${formatAngka(b.rincian.materi.n)} (${dsUkuran(b.rincian.materi.ukuran)}).</span></div>
  </section>`;
}

function renderDasbor(p, c) {
  const u = S.pengguna;
  if (u.peran === PERAN.SISWA) { renderBerandaSiswa(p, c); return; }
  panggil('dashboard.ringkas', {}, { ulang: true }).then(function (d) {
    if (!c.ok()) return;
    if (d.peran === 'ADMIN') {
      pasang(c.wadah, h`
        ${kepalaHalaman('Selamat datang, ' + u.nama, 'Ringkasan data yang tersimpan di aplikasi.')}
        ${d.siswaBelumLengkap > 0 ? h`<div class="peringatan peringatan-waspada jarak-bawah">${ikon('info')}<div><p><strong>${formatAngka(d.siswaBelumLengkap)} siswa aktif</strong> belum melengkapi identitas. Mereka akan diminta mengisinya saat masuk.</p></div></div>` : ''}
        <div class="kisi-kpi">
          ${kpi('users', 'Siswa aktif', d.siswaAktif, formatAngka(d.siswaNonaktif) + ' nonaktif')}
          ${kpi('user-check', 'Guru aktif', d.guruAktif, formatAngka(d.adminAktif) + ' Admin Utama aktif')}
          ${kpi('package', 'Paket terbit', d.paketTerbit, formatAngka(d.paketDraf) + ' draf · ' + formatAngka(d.paketArsip) + ' diarsipkan')}
          ${kpi('list', 'Total soal', d.jumlahSoal, formatAngka(d.jumlahPercobaan) + ' percobaan tercatat')}
        </div>
        <div class="dasbor-sama">${kartuRerataMapel(d.rerata)}${kartuRerataPaket(d.rerata)}</div>
        <div class="dasbor-sama" data-uji="kapasitas">${kartuKapasitasSheet(d.kapasitas.spreadsheet)}${kartuKapasitasDrive(d.kapasitas.drive, d.kapasitas.berkasAplikasi)}</div>
        <div class="dasbor-2">
          <section class="kartu" aria-labelledby="h-aktv"><div class="kartu-judul"><span class="ikon-bulat">${ikon('activity')}</span><h3 id="h-aktv">Aktivitas terbaru</h3></div>${daftarAktivitas(d.aktivitas)}</section>
          <div class="kolom">
            ${kartuBackup(d.backup, true)}
            <section class="kartu" aria-labelledby="h-pintas"><div class="kartu-judul"><span class="ikon-bulat">${ikon('zap')}</span><h3 id="h-pintas">Pintasan</h3></div>
              <div class="pintasan">
                <button type="button" class="tombol tombol-garis" data-aksi="nav" data-ke="akun">${ikon('user-plus')}<span>Kelola akun</span></button>
                <button type="button" class="tombol tombol-garis" data-aksi="nav" data-ke="paket">${ikon('package')}<span>Paket soal</span></button>
              </div></section>
          </div>
        </div>`);
    } else if (d.peran === 'GURU') {
      pasang(c.wadah, h`
        ${kepalaHalaman('Selamat datang, ' + u.nama, 'Ringkasan paket dan soal milik Anda.', h`<button type="button" class="tombol" data-aksi="paket-baru-dari-dasbor">${ikon('plus')}<span>Buat paket</span></button>`)}
        <div class="kisi-kpi">
          ${kpi('file-text', 'Paket draf', d.paketDraf, 'Belum terlihat siswa')}
          ${kpi('check-circle', 'Paket terbit', d.paketTerbit, 'Terlihat oleh siswa', 'sukses')}
          ${kpi('layers', 'Diarsipkan', d.paketArsip, '')}
          ${kpi('list', 'Soal milik Anda', d.jumlahSoal, formatAngka(d.jumlahPercobaan) + ' percobaan pada paket Anda')}
        </div>
        <div class="dasbor-sama">${kartuRerataMapel(d.rerata)}${kartuRerataPaket(d.rerata)}</div>
        <section class="kartu" aria-labelledby="h-aktv"><div class="kartu-judul"><span class="ikon-bulat">${ikon('activity')}</span><h3 id="h-aktv">Aktivitas Anda</h3></div>${daftarAktivitas(d.aktivitas)}</section>`);
    }
    fokusJudul();
  }).catch(function (e) { if (c.ok()) tampilkanGalatMuat(c.wadah, e, true); });
}
AKSI['paket-baru-dari-dasbor'] = function () { navigateTo('paket', { buat: true }); };


function validasiUsernameKlien(u) {
  const s = String(u || '').trim().toLowerCase();
  if (!s) return 'Username wajib diisi.';
  if (s.length < 3 || s.length > 30) return 'Username harus 3–30 karakter.';
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(s)) return 'Username hanya boleh huruf kecil, angka, titik, garis bawah, dan strip, dan diawali huruf atau angka.';
  return '';
}

function renderProfil(p, c) {
  muatSaya().then(function () {
    if (!c.ok()) return;
    const u = S.pengguna;
    const siswa = u.peran === PERAN.SISWA;
    const sembunyi = !!S.sembunyiNama;
    const kartuAkun = h`<section class="kartu" aria-labelledby="h-akun"><div class="kartu-judul"><span class="ikon-bulat">${ikon('user')}</span><h3 id="h-akun">Akun</h3></div>
      <dl class="data">
        <div class="data-baris"><dt>Username</dt><dd class="mono">${u.username}</dd></div>
        <div class="data-baris"><dt>Peran</dt><dd>${LABEL_PERAN[u.peran]}</dd></div>
        <div class="data-baris"><dt>Nama</dt><dd>${u.nama}</dd></div>
      </dl>
      ${siswa ? '' : h`<p class="bantu jarak-atas">Nama akun staf diubah oleh Admin Utama.</p>`}
      <hr>
      <h4>Ubah username</h4>
      <form data-kirim="ubah-username" id="f-username-profil" novalidate>
        <div data-galat aria-live="polite"></div>
        <div class="isian"><label for="un-baru">Username baru</label>
          <input class="kontrol" id="un-baru" name="username_baru" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="30" required aria-describedby="un-baru-b">
          <p class="bantu" id="un-baru-b">3–30 karakter: huruf kecil, angka, titik, garis bawah, atau strip.</p></div>
        ${kolomSandi({ nama: 'password_sekarang', label: 'Password saat ini (untuk konfirmasi)', id: 'un-sandi', autocomplete: 'current-password' })}
        <div class="aksi-form"><button type="submit" class="tombol tombol-garis">${ikon('edit')}<span>Ubah username</span></button></div>
      </form></section>`;
    const kartuSandi = h`<section class="kartu" aria-labelledby="h-sandi"><div class="kartu-judul"><span class="ikon-bulat">${ikon('lock')}</span><h3 id="h-sandi">Ganti password</h3></div>
      <p class="teks-redam">Password disimpan dalam bentuk terenkripsi satu arah, sehingga tidak bisa dilihat siapa pun, termasuk admin. Bila lupa, minta admin mereset akun Anda.</p>
      ${formUbahPassword('profil')}</section>`;
    const kartuIdentitas = siswa ? h`<section class="kartu" aria-labelledby="h-ident"><div class="kartu-judul"><span class="ikon-bulat">${ikon('file-text')}</span><h3 id="h-ident">Identitas diri</h3></div>${formIdentitas('profil')}</section>` : '';
    const kartuPapan = siswa ? h`<section class="kartu" aria-labelledby="h-papan-saya" data-uji="kartu-papan"><div class="kartu-judul"><span class="ikon-bulat ${sembunyi ? 'netral' : 'sukses'}">${ikon(sembunyi ? 'eye-off' : 'trophy')}</span><h3 id="h-papan-saya">Nama di papan peringkat</h3></div>
      <p class="tanpa-margin"><span class="lencana ${sembunyi ? 'lencana-info' : 'lencana-sukses'}">${sembunyi ? 'Nama disembunyikan' : 'Nama tampil'}</span></p>
      <p class="bantu jarak-atas">${sembunyi ? 'Di papan peringkat beranda Anda tampil sebagai "Nama disembunyikan", tanpa asal sekolah. Pengaturan ini dilakukan oleh Admin; Anda tidak dapat mengubahnya sendiri.' : 'Nama lengkap dan asal sekolah Anda tampil di papan peringkat beranda bila Anda masuk 20 besar sebuah mata pelajaran (dihitung dari Try Out Utama). Bila ingin disembunyikan, minta orang tua atau wali menghubungi Admin.'}</p></section>` : '';
    const kartuTema = h`<section class="kartu" aria-labelledby="h-tema"><div class="kartu-judul"><span class="ikon-bulat">${ikon('sun')}</span><h3 id="h-tema">Tampilan</h3></div>
      <fieldset class="isian fieldset-polos"><legend class="label">Tema warna</legend>
        <div class="segmen" role="radiogroup" aria-label="Tema warna">
          ${[['sistem', 'Ikuti perangkat'], ['terang', 'Terang'], ['gelap', 'Gelap']].map(function (t) {
            return h`<label>${ikon('check')}<input type="radio" name="tema" value="${t[0]}" data-masuk="pilih-tema"${S.tema === t[0] ? mentah(' checked') : ''}> ${t[1]}</label>`;
          })}
        </div></fieldset></section>`;
    pasang(c.wadah, h`
      ${kepalaHalaman('Profil saya', siswa ? 'Atur username, password, dan identitas diri Anda.' : 'Atur username dan password Anda.')}
      <div class="profil-kisi">
        <div class="kolom">${kartuAkun}${kartuIdentitas}</div>
        <div class="kolom">${kartuSandi}${kartuPapan}${kartuTema}</div>
      </div>`);
    fokusJudul();
  }).catch(function (e) { if (c.ok()) tampilkanGalatMuat(c.wadah, e, true); });
}

MASUKAN['pilih-tema'] = function (r) { if (r.checked) simpanTema(r.value); };

KIRIM['ubah-username'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const salah = validasiUsernameKlien(v.username_baru);
  if (salah) { galatIsian(form, 'username_baru', salah); return; }
  if (!v.password_sekarang) { galatIsian(form, 'password_sekarang', 'Masukkan password saat ini untuk konfirmasi.'); return; }
  if (v.username_baru.toLowerCase() === S.pengguna.username) { galatIsian(form, 'username_baru', 'Username baru sama dengan yang sekarang.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('profil.ubahUsername', { username_baru: v.username_baru, password_sekarang: v.password_sekarang }).then(function (d) {
      S.pengguna.username = d.username;
      toast('Username diubah menjadi ' + d.username + '.', 'sukses');
      navigateTo('profil', {}, { tanpaRiwayat: true });
    });
  }).catch(function (e) {
    if (e.kode === 'SANDI_SALAH') galatIsian(form, 'password_sekarang', e.message);
    else if (e.kode === 'DUPLIKAT' || e.kode === 'VALIDASI') galatIsian(form, 'username_baru', e.message);
    else if (e.kode === 'DIBATASI') galatForm(form, e.message);
    else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};


const LP = { fokus: false, waktu: 0, minta: false };

function lpElemen() { return document.documentElement; }
function lpFungsiMasuk() {
  const d = lpElemen();
  return d.requestFullscreen || d.webkitRequestFullscreen || null;
}
function lpFungsiKeluar() { return document.exitFullscreen || document.webkitExitFullscreen || null; }
function lpTerdukung() {
  const aktif = document.fullscreenEnabled !== undefined ? document.fullscreenEnabled : document.webkitFullscreenEnabled;
  return !!(aktif && lpFungsiMasuk() && lpFungsiKeluar());
}
function lpSungguhan() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
function lpAktif() { return lpSungguhan() || LP.fokus; }
function lpSentuh() { try { return !!(window.matchMedia && matchMedia('(pointer: coarse)').matches); } catch (e) { return false; } }
function lpBaruBerganti() { return Date.now() - LP.waktu < 2000; }

function lpTerapkanKelas() {
  const u = el('#ujian');
  if (!u) return;
  u.classList.toggle('penuh', lpSungguhan());
  u.classList.toggle('fokus', LP.fokus);
}

function lpPerbaruiTombol() {
  lpTerapkanKelas();
  const b = el('#uj-penuh');
  if (!b) return;
  const aktif = lpAktif();
  b.setAttribute('data-aktif', aktif ? 'true' : 'false');
  b.setAttribute('aria-label', aktif ? 'Keluar dari layar penuh' : 'Layar penuh');
  b.setAttribute('title', aktif ? 'Keluar dari layar penuh' : 'Layar penuh');
  pasang(b, h`${ikon(aktif ? 'minimize' : 'maximize')}<span class="teks-penuh">${aktif ? 'Keluar layar penuh' : 'Layar penuh'}</span>`);
}

function lpMasukFokus(pesan) {
  LP.fokus = true;
  LP.waktu = Date.now();
  lpPerbaruiTombol();
  umumkan('Mode fokus aktif.');
  toast(pesan || 'Tampilan dipadatkan agar soal lebih luas. Ketuk tombol yang sama untuk kembali.', 'info', 6000);
}

function lpMasuk() {
  if (!UJ) return;
  if (!lpTerdukung()) {
    lpMasukFokus('Peramban ini tidak mendukung layar penuh sungguhan, jadi tampilan dipadatkan agar soal lebih luas. Ketuk tombol yang sama untuk kembali.');
    return;
  }
  LP.minta = true;
  LP.waktu = Date.now();
  let janji;
  try { janji = lpFungsiMasuk().call(lpElemen(), { navigationUI: 'hide' }); } catch (e) { janji = Promise.reject(e); }
  Promise.resolve(janji).then(function () {
    LP.minta = false;
    if (!UJ) return;
    lpPerbaruiTombol();
    umumkan('Layar penuh aktif.');
    toast(lpSentuh() ? 'Layar penuh aktif. Ketuk "Keluar layar penuh" atau gunakan tombol Kembali perangkat untuk keluar.' : 'Layar penuh aktif. Tekan Esc untuk keluar.', 'info', 5000);
  }, function () {
    LP.minta = false;
    if (!UJ) return;
    lpMasukFokus('Peramban tidak mengizinkan layar penuh, jadi tampilan dipadatkan agar soal lebih luas. Ketuk tombol yang sama untuk kembali.');
  });
}

function lpKeluar() {
  LP.waktu = Date.now();
  if (LP.fokus) { LP.fokus = false; }
  if (lpSungguhan()) {
    let janji;
    try { janji = lpFungsiKeluar().call(document); } catch (e) { janji = null; }
    if (janji && typeof janji.catch === 'function') janji.catch(function () {   });
  }
  lpPerbaruiTombol();
  umumkan('Keluar dari layar penuh.');
}

function lpLepas() {
  LP.fokus = false;
  LP.minta = false;
  if (lpSungguhan()) {
    let janji;
    try { janji = lpFungsiKeluar().call(document); } catch (e) { janji = null; }
    if (janji && typeof janji.catch === 'function') janji.catch(function () {   });
  }
  lpTerapkanKelas();
}

AKSI['uj-penuh'] = function () {
  if (!UJ) return;
  if (lpAktif()) lpKeluar(); else lpMasuk();
};

['fullscreenchange', 'webkitfullscreenchange'].forEach(function (nama) {
  document.addEventListener(nama, function () {
    LP.waktu = Date.now();
    if (UJ) lpPerbaruiTombol(); else lpTerapkanKelas();
  });
});


let UJ = null;
let ujianAwal = null;
let hasilKumpul = null;
let idPerangkatMemori = '';
const KUNCI_SKALA_UJIAN = 'siap_tka_skala_ujian';
const SKALA_UJIAN = [1, 2, 3];
const NAMA_SKALA_UJIAN = { 1: 'kecil', 2: 'sedang', 3: 'besar' };

function mono() { try { return window.performance && performance.now ? performance.now() : Date.now(); } catch (e) { return Date.now(); } }

function idAcak(panjang) {
  const abjad = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  try {
    const b = new Uint8Array(panjang);
    window.crypto.getRandomValues(b);
    for (let i = 0; i < panjang; i++) s += abjad.charAt(b[i] % abjad.length);
    return s;
  } catch (e) { s = ''; }
  for (let i = 0; i < panjang; i++) s += abjad.charAt(Math.floor(Math.random() * abjad.length));
  return s;
}
function idPerangkat() {
  let v = bacaLokal('lokal', KUNCI_PERANGKAT);
  if (!v || !/^[A-Za-z0-9_-]{12,80}$/.test(v)) {
    v = idPerangkatMemori || idAcak(24);
    idPerangkatMemori = v;
    simpanLokal('lokal', KUNCI_PERANGKAT, v);
  }
  return v;
}
function angkaSkor(n) {
  const x = Number(n);
  if (!isFinite(x)) return '—';
  return Number.isInteger(x) ? formatAngka(x, 0) : formatAngka(x, 1);
}
function formatSisa(detik) {
  const d = Math.max(0, Math.floor(detik));
  const j = Math.floor(d / 3600), m = Math.floor((d % 3600) / 60), s = d % 60;
  return dua(j) + ':' + dua(m) + ':' + dua(s);
}
function jitterMs(dasarDetik) {
  const lo = Math.max(10, dasarDetik * 0.75), hi = Math.max(lo + 1, dasarDetik * 1.5);
  return Math.round((lo + Math.random() * (hi - lo)) * 1000);
}
function bentukJawabanSah(jenis, j) {
  if (j === null) return true;
  if (jenis === 'PG') return typeof j === 'string' && /^[A-D]$/.test(j);
  return Array.isArray(j) && j.length === 3 && j.every(function (x) { return x === null || x === 'B' || x === 'S'; });
}
function jawabanTerisi(jenis, j) {
  if (j === null || j === undefined) return 'kosong';
  if (jenis === 'PG') return 'penuh';
  const n = j.filter(function (x) { return x !== null; }).length;
  if (jenis === 'MCMA') return n === 0 ? 'kosong' : 'penuh';
  return n === 0 ? 'kosong' : (n === 3 ? 'penuh' : 'sebagian');
}

function bacaCadangan(id) {
  try {
    const t = bacaLokal('lokal', KUNCI_CADANGAN + id);
    if (!t) return {};
    const o = JSON.parse(t);
    return o && o.j && typeof o.j === 'object' ? o.j : {};
  } catch (e) { return {}; }
}
function simpanCadangan() {
  if (!UJ) return;
  simpanLokal('lokal', KUNCI_CADANGAN + UJ.id, JSON.stringify({ t: Date.now(), j: UJ.jawaban }));
}
function hapusCadangan(id) { hapusLokal('lokal', KUNCI_CADANGAN + id); }
function bersihkanCadanganLama() {
  try {
    const ls = window.localStorage;
    const hapus = [];
    for (let i = 0; i < ls.length; i++) {
      const k = ls.key(i);
      if (!k || k.indexOf(KUNCI_CADANGAN) !== 0) continue;
      let t = 0;
      try { t = (JSON.parse(ls.getItem(k)) || {}).t || 0; } catch (e) { t = 0; }
      if (Date.now() - t > 3 * 86400000) hapus.push(k);
    }
    hapus.forEach(function (k) { ls.removeItem(k); });
  } catch (e) {   }
}

function konfirmasiMulai(p) {
  const lanjut = !!p.berjalan;
  const api = modal({
    judul: lanjut ? 'Lanjutkan ujian?' : 'Mulai ujian?',
    badan: h`<p class="tanpa-margin"><strong>${p.nama}</strong></p>
      <dl class="data">
        ${p.jumlahSoal > 0 ? h`<div class="data-baris"><dt>Jumlah soal</dt><dd class="angka">${formatAngka(p.jumlahSoal)}</dd></div>` : ''}
        <div class="data-baris"><dt>Waktu</dt><dd class="angka">${formatAngka(p.durasiMenit)} menit</dd></div>
      </dl>
      ${lanjut ? h`<div class="peringatan peringatan-waspada">${ikon('clock')}<div><p>Ujian ini sudah berjalan. Waktu terus berkurang sejak Anda memulai, meskipun halaman ditutup.</p></div></div>`
        : h`<div class="peringatan">${ikon('info')}<div><p><strong>Waktu mulai berjalan begitu Anda menekan Mulai</strong> dan dihitung oleh server. Menutup halaman tidak menghentikan waktu. Jawaban tersimpan otomatis; pastikan koneksi internet stabil.</p></div></div>`}`,
    aksi: [
      { id: 'batal', label: 'Batal', gaya: 'diam' },
      {
        id: 'mulai', label: lanjut ? 'Lanjutkan' : 'Mulai sekarang', gaya: 'utama',
        onKlik: function (a, tombol) {
          const kendali = { batal: false };
          a.selesai.then(function () { kendali.batal = true; });
          kerjakan(tombol, function () {
            return panggil('ujian.mulai', { id_paket: p.id, kunci_idempotensi: idAcak(24) }, { kendali: kendali, sebar: true }).then(function (d) {
              a.tutup('mulai');
              if (d.selesai) { navigateTo('hasil', { id: d.percobaan.id }); return; }
              ujianAwal = d;
              navigateTo('ujian', { id: d.percobaan.id }, { tanpaRiwayat: true });
            });
          }, lanjut ? 'Membuka ujian…' : 'Menyiapkan soal…').catch(function (e) {
            a.tutup(null);
            if (e.kode === 'MASIH_BERJALAN' && e.data && e.data.id_percobaan) {
              konfirmasi({ judul: 'Ada ujian yang masih berjalan', ya: 'Lanjutkan ujian itu', pesan: e.message }).then(function (ya) {
                if (ya) navigateTo('ujian', { id: e.data.id_percobaan }, { tanpaRiwayat: true });
              });
            } else if (!e.ditangani) toast(e.message, 'galat');
          });
        }
      }
    ]
  });
  return api;
}
AKSI['ujian-mulai'] = function (b) {
  konfirmasiMulai({
    id: b.getAttribute('data-id'), nama: b.getAttribute('data-nama'), jumlahSoal: +b.getAttribute('data-soal'),
    durasiMenit: +b.getAttribute('data-menit'), berjalan: b.getAttribute('data-berjalan') === '1'
  });
};
AKSI['ujian-lanjut'] = function (b) { navigateTo('ujian', { id: b.getAttribute('data-id') }, { tanpaRiwayat: true }); };

function renderUjian(p, c) {
  const id = (p && p.id) || (S.percobaanToken && S.percobaanToken.id) || '';
  if (!id) { pasang(c.wadah, ''); navigateTo(S.pengguna && S.pengguna.peran === PERAN.TOKEN ? 'token' : 'dasbor', {}, { tanpaRiwayat: true }); return; }
  if (ujianAwal && ujianAwal.percobaan && ujianAwal.percobaan.id === id) {
    const m = ujianAwal; ujianAwal = null;
    mulaiLayarUjian(m, c);
    return;
  }
  panggil('ujian.muat', { id_percobaan: id }, { ulang: true }).then(function (d) {
    if (!c.ok()) return;
    if (d.selesai) { ujianSelesai(d.percobaan); return; }
    mulaiLayarUjian(d, c);
  }).catch(function (e) {
    if (!c.ok()) return;
    if (e.ditangani) return;
    const token = S.pengguna && S.pengguna.peran === PERAN.TOKEN;
    pasang(c.wadah, h`<div class="halaman-wajib"><div class="kartu kartu-wajib"><div class="kosong"><span class="ikon-bulat bahaya">${ikon('alert-triangle')}</span><h3>Ujian tidak bisa dibuka</h3><p>${e.message}</p>
      <div class="baris-bungkus"><button type="button" class="tombol" data-aksi="muat-ulang">${ikon('refresh')}<span>Coba lagi</span></button>
      <button type="button" class="tombol tombol-diam" data-aksi="${token ? 'token-selesai' : 'ke-dasbor'}">${token ? 'Kembali' : 'Ke beranda'}</button></div></div></div></div>`);
  });
}
AKSI['ke-dasbor'] = function () { navigateTo('dasbor', {}, { tanpaRiwayat: true }); };

function pastikanGambarUjian(ref) {
  if (ref.pulihGambar) return;
  let hilang = false;
  const lihat = function (v) {
    if (hilang || typeof v !== 'string' || v.indexOf('"img"') === -1) return;
    Kaya.gambar(v).forEach(function (id) { if (!mediaInfo(id)) hilang = true; });
  };
  ref.soal.forEach(function (s) { lihat(s.stimulus); lihat(s.pertanyaan); (Array.isArray(s.opsi) ? s.opsi : []).forEach(lihat); });
  if (!hilang) return;
  ref.pulihGambar = true;
  panggilLangsung('ujian.muat', { id_percobaan: ref.id }, { ulang: true, senyap: true }).then(function () {
    if (UJ !== ref || ref.mati || ref.selesai) return;
    gambarSoal();
  }).catch(function () {   });
}

function mulaiLayarUjian(m, c) {
  bersihUjian();
  bersihkanCadanganLama();
  const id = m.percobaan.id;
  const sisaServer = (Date.parse(m.percobaan.batasWaktu) - Date.parse(m.waktuServer)) / 1000;
  const ref = {
    id: id, token: !!(S.pengguna && S.pengguna.peran === PERAN.TOKEN), m: m, soal: m.soal, idx: 0,
    jawaban: {}, tersimpan: {}, kejadian: [], jumlahTab: 0, jeda: m.jedaSimpan || 20,
    batasMono: mono() + (isFinite(sisaServer) ? sisaServer : (m.paket.durasiMenit || 60) * 60) * 1000,
    terakhirOk: mono(), terakhirOkJam: null, menyimpan: false, mengumpulkan: false, selesai: false, putus: false,
    gagalBerturut: 0, gagalPermanen: '', tSimpan: null, tTik: null, tOto: null, tCoba: null, detikTerakhir: null,
    sudahDiumumkan: {}, otoMulai: false, tersembunyi: false, mati: false, wadah: c.wadah, skala: skalaTersimpan()
  };
  UJ = ref;
  Object.keys(m.jawaban || {}).forEach(function (sid) {
    const e = m.jawaban[sid];
    ref.jawaban[sid] = { j: e.j === undefined ? null : e.j, v: e.v, r: !!e.r };
    ref.tersimpan[sid] = e.v;
  });
  const cad = bacaCadangan(id);
  ref.soal.forEach(function (s) {
    const e = cad[s.id];
    if (!e || typeof e !== 'object' || !bentukJawabanSah(s.jenis, e.j === undefined ? null : e.j)) return;
    if (typeof e.v !== 'number' || e.v !== Math.floor(e.v) || e.v < 1) return;
    const ada = ref.jawaban[s.id];
    if (!ada || e.v > ada.v) ref.jawaban[s.id] = { j: e.j === undefined ? null : e.j, v: e.v, r: !!e.r };
  });

  ref.hVis = function () { saatTampilBerubah(ref); };
  ref.hSebelumTutup = function (e) { if (!ref.selesai && idTertinggal().length) { e.preventDefault(); e.returnValue = ''; return ''; } return undefined; };
  ref.hOnline = function () { if (UJ === ref && !ref.selesai) { ref.putusTampil = false; setStatus(); jadwalSimpan(500 + Math.random() * 1500); } };
  ref.hOffline = function () { if (UJ === ref && !ref.selesai) { ref.putusTampil = true; catatPutus(ref); setStatus(); } };
  document.addEventListener('visibilitychange', ref.hVis);
  window.addEventListener('beforeunload', ref.hSebelumTutup);
  window.addEventListener('online', ref.hOnline);
  window.addEventListener('offline', ref.hOffline);
  S.saatTinggal = bersihUjian;

  pasang(c.wadah, kerangkaUjian(ref));
  setJudulDokumen(ref);
  gambarSemua();
  lpPerbaruiTombol();
  ref.tTik = setInterval(tik, 500);
  jadwalSimpan();
  pastikanGambarUjian(ref);
  const judul = el('#uj-judul'); if (judul) { try { judul.focus({ preventScroll: true }); } catch (e) {   } }
}

function setJudulDokumen(ref) { try { document.title = ref.m.paket.nama + ' · ' + namaApp(); } catch (e) {   } }

function kerangkaUjian(ref) {
  const mp = ref.m.paket;
  const nama = (S.pengguna && S.pengguna.nama) || '';
  const label = (MAPEL[mp.mapel] || mp.mapel) + ' – ' + mp.nama;
  return h`
    <button type="button" class="lompat" data-aksi="uj-lompat">Lewati ke soal</button>
    <div class="ujian" id="ujian" data-skala="${ref.skala}">
      <header class="ujian-merek">
        <span class="merek"><span class="logo">${logoMerek()}</span><span class="nama">${namaApp()}</span></span>
        <h1 id="uj-judul" class="sr-only" tabindex="-1">Ujian ${label}</h1>
        ${nama ? h`<span class="ujian-peserta">${ikon('user')}<span class="potong">${nama}</span></span>` : ''}
      </header>
      <div class="ujian-kartu">
        <section class="ujian-bar" aria-label="Kendali ujian">
          <h2 class="ujian-no angka" id="uj-no" tabindex="-1"></h2>
          <div class="ujian-zoom" role="group" aria-label="Ukuran font soal"><span class="zoom-label" aria-hidden="true">Ukuran font soal:</span>${SKALA_UJIAN.map(function (n) {
            return h`<button type="button" class="tombol-zoom zoom-${n}" data-aksi="uj-zoom" data-skala="${n}" aria-label="Huruf ${NAMA_SKALA_UJIAN[n]}" aria-pressed="${ref.skala === n ? 'true' : 'false'}">A</button>`;
          })}</div>
          <div class="ujian-status" id="uj-status"></div>
          <p class="ujian-paket-label potong" aria-hidden="true" title="${label}">${label}</p>
          <div class="ujian-kanan">
            <button type="button" class="tombol tombol-pil ujian-info" data-aksi="uj-info" aria-haspopup="dialog">${ikon('info')}<span>Informasi Soal</span></button>
            <div class="ujian-pewaktu" id="uj-pewaktu" role="timer" aria-label="Sisa waktu">${ikon('clock')}<span class="label-waktu">Sisa Waktu :</span><span id="uj-waktu" class="angka">--:--:--</span></div>
            <button type="button" class="tombol tombol-pil ujian-daftar" data-aksi="uj-daftar" aria-haspopup="dialog">${ikon('grid')}<span>Daftar Soal</span></button>
            <button type="button" class="tombol tombol-garis tombol-pil ujian-penuh" id="uj-penuh" data-aksi="uj-penuh" data-aktif="false" aria-label="Layar penuh" title="Layar penuh">${ikon('maximize')}<span class="teks-penuh">Layar penuh</span></button>
          </div>
        </section>
        <div id="uj-banner"></div>
        <main id="uj-isi" class="ujian-soal" tabindex="-1" aria-label="Soal"></main>
        <footer class="ujian-kaki" id="uj-kaki"></footer>
      </div>
      <div id="uj-sr" class="sr-only" aria-live="polite" aria-atomic="true"></div>
    </div>`;
}
function skalaTersimpan() {
  const n = +bacaLokal('sesi', KUNCI_SKALA_UJIAN);
  return SKALA_UJIAN.indexOf(n) >= 0 ? n : 2;
}
function terapkanSkala() {
  const u = el('#ujian');
  if (!u || !UJ) return;
  u.setAttribute('data-skala', String(UJ.skala));
  semua('.tombol-zoom', u).forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-skala') === UJ.skala ? 'true' : 'false'); });
}
AKSI['uj-zoom'] = function (b) {
  if (!UJ) return;
  const n = +b.getAttribute('data-skala');
  if (SKALA_UJIAN.indexOf(n) < 0) return;
  UJ.skala = n;
  simpanLokal('sesi', KUNCI_SKALA_UJIAN, String(n));
  terapkanSkala();
  umumkan('Ukuran huruf soal ' + NAMA_SKALA_UJIAN[n] + '.');
};
AKSI['uj-lompat'] = function () { const i = el('#uj-isi'); if (i) i.focus(); };

function bersihUjian() {
  const u = UJ;
  if (!u) return;
  u.mati = true;
  clearInterval(u.tTik); clearTimeout(u.tSimpan); clearTimeout(u.tOto); clearTimeout(u.tCoba);
  document.removeEventListener('visibilitychange', u.hVis);
  window.removeEventListener('beforeunload', u.hSebelumTutup);
  window.removeEventListener('online', u.hOnline);
  window.removeEventListener('offline', u.hOffline);
  if (S.saatTinggal === bersihUjian) S.saatTinggal = null;
  UJ = null;
  lpLepas();
}

function soalAktif() { return UJ.soal[UJ.idx]; }
function idTertinggal() {
  if (!UJ) return [];
  return Object.keys(UJ.jawaban).filter(function (id) { return UJ.jawaban[id].v > (UJ.tersimpan[id] || 0); });
}
function ringkasJawaban() {
  const r = { total: UJ.soal.length, penuh: 0, sebagian: 0, kosong: 0, ragu: 0, belum: [] };
  UJ.soal.forEach(function (s, i) {
    const e = UJ.jawaban[s.id];
    const t = jawabanTerisi(s.jenis, e ? e.j : null);
    r[t === 'penuh' ? 'penuh' : (t === 'sebagian' ? 'sebagian' : 'kosong')]++;
    if (t !== 'penuh') r.belum.push(i + 1);
    if (e && e.r) r.ragu++;
  });
  return r;
}
function setJawaban(id, ubah) {
  if (!UJ || UJ.selesai || UJ.mengumpulkan) return;
  const lama = UJ.jawaban[id] || { j: null, v: 0, r: false };
  UJ.jawaban[id] = { j: 'j' in ubah ? ubah.j : lama.j, v: lama.v + 1, r: 'r' in ubah ? !!ubah.r : lama.r };
  simpanCadangan();
  setStatus();
}
MASUKAN['uj-jawab'] = function (inp) {
  if (!UJ) return;
  const s = soalAktif();
  let j;
  if (s.jenis === 'PG') j = inp.value;
  else if (s.jenis === 'MCMA') {
    const kotak = semua('input[type=checkbox][data-pos]', el('#uj-isi'));
    j = kotak.some(function (k) { return k.checked; }) ? kotak.map(function (k) { return k.checked ? 'B' : 'S'; }) : null;
  } else {
    const sekarang = UJ.jawaban[s.id] && UJ.jawaban[s.id].j ? UJ.jawaban[s.id].j.slice() : [null, null, null];
    sekarang[+inp.getAttribute('data-pos')] = inp.value;
    j = sekarang;
  }
  setJawaban(s.id, { j: j });
  perbaruiTombolHapus();
};
function perbaruiTombolHapus() {
  const s = soalAktif();
  const e = UJ.jawaban[s.id];
  const hb = el('#uj-hapus');
  if (hb) { if (jawabanTerisi(s.jenis, e ? e.j : null) === 'kosong') hb.setAttribute('aria-disabled', 'true'); else hb.removeAttribute('aria-disabled'); }
}
AKSI['uj-hapus'] = function (b) {
  if (!UJ) return;
  if (b && b.getAttribute('aria-disabled') === 'true') return;
  setJawaban(soalAktif().id, { j: null });
  semua('#uj-isi input[type=radio], #uj-isi input[type=checkbox]').forEach(function (i) { i.checked = false; });
  perbaruiTombolHapus();
};
AKSI['uj-ragu'] = function () {
  if (!UJ) return;
  const s = soalAktif();
  const e = UJ.jawaban[s.id];
  setJawaban(s.id, { r: !(e && e.r) });
  gambarKaki();
};
function keSoal(i) {
  if (!UJ || i < 0 || i >= UJ.soal.length) return;
  const kaki = el('#uj-kaki');
  const dariKaki = !!(kaki && document.activeElement && kaki.contains(document.activeElement));
  UJ.idx = i;
  gambarSoal();
  gambarBar();
  gambarKaki();
  try { window.scrollTo(0, 0); } catch (e) {   }
  if (dariKaki) {
    umumkan('Soal ' + (i + 1) + ' dari ' + UJ.soal.length + '. ' + kayaTeks(UJ.soal[i].pertanyaan));
  } else {
    const no = el('#uj-no'); if (no) { try { no.focus({ preventScroll: true }); } catch (e) {   } }
  }
}
AKSI['uj-ke'] = function (b) {
  const api = modalTeratas();
  if (api && api.el.querySelector('.nav-kisi')) api.tutup(null);
  keSoal(+b.getAttribute('data-ke'));
};
AKSI['uj-sebelum'] = function () { if (UJ) keSoal(UJ.idx - 1); };
AKSI['uj-berikut'] = function () { if (UJ) keSoal(UJ.idx + 1); };

function gambarSemua() {
  gambarSoal(); gambarBar(); gambarKaki(); setStatus(); tik();
}

function htmlPetunjuk(s) {
  if (s.jenis === 'MCMA') return h`<p class="petunjuk-soal" data-uji="petunjuk">Klik pada setiap jawaban benar! Jawaban benar lebih dari satu</p>`;
  if (s.jenis === 'BS') return h`<p class="petunjuk-soal" data-uji="petunjuk">Klik pilihan <strong>Benar</strong> atau <strong>Salah</strong> untuk setiap pernyataan!</p>`;
  return '';
}

function htmlJawaban(s, e) {
  const nama = 'jw-' + s.id;
  const j = e ? e.j : null;
  if (s.jenis === 'PG') {
    return h`<div class="opsi-daftar" role="radiogroup" aria-labelledby="uj-tanya">${s.opsi.map(function (teks, i) {
      const huruf = 'ABCD'.charAt(i);
      return h`<label class="opsi-ujian"><input type="radio" name="${nama}" value="${huruf}" data-masuk="uj-jawab"${j === huruf ? mentah(' checked') : ''}><span class="penanda" aria-hidden="true"></span><span class="teks ky">${kayaHtml(teks)}</span></label>`;
    })}</div>`;
  }
  if (s.jenis === 'MCMA') {
    return h`<div class="opsi-daftar" role="group" aria-labelledby="uj-tanya">${s.opsi.map(function (teks, i) {
      const centang = !!(j && j[i] === 'B');
      return h`<label class="opsi-ujian opsi-centang"><input type="checkbox" name="${nama}" value="B" data-pos="${i}" data-masuk="uj-jawab"${centang ? mentah(' checked') : ''}><span class="penanda penanda-kotak" aria-hidden="true">${ikon('check')}</span><span class="teks ky">${kayaHtml(teks)}</span></label>`;
    })}</div>`;
  }
  return h`<div class="bungkus-bs"><table class="tabel-bs">
    <caption class="sr-only">Tentukan Benar atau Salah untuk setiap pernyataan</caption>
    <thead><tr><th scope="col">Pernyataan</th><th scope="col" class="kolom-pilih">Benar</th><th scope="col" class="kolom-pilih">Salah</th></tr></thead>
    <tbody>${s.opsi.map(function (teks, i) {
      const cur = j && j[i] ? j[i] : null;
      const idT = 'bs-' + i;
      return h`<tr class="pernyataan"><th scope="row" id="${idT}" class="teks-pernyataan"><span class="ky">${kayaHtml(teks)}</span></th>
        <td class="sel-pilih"><label class="radio-sel"><input type="radio" name="${nama}-${i}" value="B" data-pos="${i}" data-masuk="uj-jawab" aria-labelledby="${idT} ${idT}-b"${cur === 'B' ? mentah(' checked') : ''}><span class="penanda" aria-hidden="true"></span><span class="sr-only" id="${idT}-b">Benar</span></label></td>
        <td class="sel-pilih"><label class="radio-sel"><input type="radio" name="${nama}-${i}" value="S" data-pos="${i}" data-masuk="uj-jawab" aria-labelledby="${idT} ${idT}-s"${cur === 'S' ? mentah(' checked') : ''}><span class="penanda" aria-hidden="true"></span><span class="sr-only" id="${idT}-s">Salah</span></label></td></tr>`;
    })}</tbody></table></div>`;
}

function gambarSoal() {
  const w = el('#uj-isi');
  if (!w || !UJ) return;
  const s = soalAktif();
  const e = UJ.jawaban[s.id] || null;
  const ada = !kayaKosong(s.stimulus);
  pasang(w, h`<article class="soal-ujian ${ada ? 'terpecah' : 'tunggal'}" data-soal="${s.id}" data-jenis="${s.jenis}">
    <div class="soal-isi">
      ${ada ? h`<section class="panel-bacaan" role="region" aria-label="Teks bacaan atau konteks" tabindex="0"><div class="stimulus ky">${kayaHtml(s.stimulus)}</div></section>` : ''}
      <section class="panel-soal" aria-label="Pertanyaan dan jawaban">
        <span class="sr-only">Jenis soal: ${LABEL_JENIS_PENDEK[s.jenis]}.</span>
        <div class="pertanyaan-ujian ky" id="uj-tanya">${kayaHtml(s.pertanyaan)}</div>
        ${htmlPetunjuk(s)}
        ${htmlJawaban(s, e)}
        <div class="soal-aksi"><button type="button" class="tombol tombol-polos tombol-kecil" data-aksi="uj-hapus" id="uj-hapus"${jawabanTerisi(s.jenis, e ? e.j : null) === 'kosong' ? mentah(' aria-disabled="true"') : ''}>${ikon('rotate-ccw')}<span>Hapus jawaban</span></button></div>
      </section>
    </div>
  </article>`);
  gambarPraMuat(UJ.soal.slice(UJ.idx + 1, UJ.idx + 3));
}

function gambarBar() {
  const w = el('#uj-no');
  if (!w || !UJ) return;
  pasang(w, h`Soal nomor <span id="uj-no-n">${soalAktif().no}</span> <span class="dari">dari ${UJ.soal.length}</span>`);
}

function statusNav(s, i) {
  const e = UJ.jawaban[s.id];
  const t = jawabanTerisi(s.jenis, e ? e.j : null);
  const ragu = !!(e && e.r);
  const teks = t === 'penuh' ? 'terjawab' : (t === 'sebagian' ? 'terjawab sebagian' : 'belum dijawab');
  return { t: t, ragu: ragu, label: 'Soal ' + (i + 1) + ', ' + teks + (ragu ? ', ragu-ragu' : '') + (i === UJ.idx ? ', soal saat ini' : '') };
}
function htmlLegenda() {
  return h`<ul class="nav-legenda" aria-label="Keterangan warna">
      <li><span class="contoh penuh">${ikon('check', 'ikon-sm')}</span> Sudah dijawab</li>
      <li><span class="contoh ragu">${ikon('flag', 'ikon-sm')}</span> Ragu-ragu</li>
      <li><span class="contoh belum"></span> Belum dijawab</li>
      <li><span class="contoh sebagian"></span> Belum lengkap</li>
      <li><span class="contoh aktif"></span> Soal saat ini</li>
    </ul>`;
}
function htmlDaftarSoal() {
  const r = ringkasJawaban();
  return h`<div class="nav-modal">
    <p class="bantu angka">${formatAngka(r.penuh)} dari ${formatAngka(r.total)} soal terjawab${r.ragu ? ' · ' + formatAngka(r.ragu) + ' ragu-ragu' : ''}</p>
    <ol class="nav-kisi">${UJ.soal.map(function (s, i) {
      const st = statusNav(s, i);
      return h`<li><button type="button" class="nav-soal ${st.t === 'kosong' ? 'belum' : st.t}${st.ragu ? ' ragu' : ''}${i === UJ.idx ? ' aktif' : ''}" data-aksi="uj-ke" data-ke="${i}" aria-label="${st.label}"${i === UJ.idx ? mentah(' aria-current="step" autofocus') : ''}><span class="angka">${i + 1}</span>${st.ragu ? ikon('flag', 'ikon-sm') : (st.t === 'penuh' ? ikon('check', 'ikon-sm') : '')}</button></li>`;
    })}</ol>
    ${htmlLegenda()}
    <button type="button" class="tombol tombol-penuh" data-aksi="uj-kumpul">${ikon('send')}<span>Kumpulkan jawaban</span></button>
  </div>`;
}
AKSI['uj-daftar'] = function () {
  if (!UJ) return;
  modal({ judul: 'Daftar Soal', badan: htmlDaftarSoal() });
};
AKSI['uj-info'] = function () {
  if (!UJ) return;
  const mp = UJ.m.paket;
  const r = ringkasJawaban();
  modal({
    judul: 'Informasi Soal',
    badan: h`<dl class="data" data-uji="info-paket">
        <div class="data-baris"><dt>Paket</dt><dd>${mp.nama}</dd></div>
        <div class="data-baris"><dt>Mata pelajaran</dt><dd>${MAPEL[mp.mapel] || mp.mapel}</dd></div>
        <div class="data-baris"><dt>Jumlah soal</dt><dd class="angka">${formatAngka(r.total)}</dd></div>
        <div class="data-baris"><dt>Waktu pengerjaan</dt><dd class="angka">${formatAngka(mp.durasiMenit)} menit</dd></div>
      </dl>
      <h3 class="info-judul">Petunjuk pengerjaan</h3>
      <ul class="info-daftar">
        <li>Waktu dihitung oleh server dan terus berjalan. Jawaban tersimpan otomatis.</li>
        <li><strong>Pilihan ganda:</strong> pilih satu jawaban yang paling tepat.</li>
        <li><strong>Pilihan ganda kompleks:</strong> klik setiap jawaban yang benar. Jawaban benar lebih dari satu.</li>
        <li><strong>Benar–Salah:</strong> pilih Benar atau Salah untuk setiap pernyataan.</li>
        <li>Tandai <strong>Ragu-ragu</strong> bila ingin memeriksa soal itu lagi. Buka <strong>Daftar Soal</strong> untuk pindah ke nomor mana pun.</li>
        <li>Setelah selesai, kumpulkan jawaban dari soal terakhir atau dari Daftar Soal.</li>
      </ul>
      <h3 class="info-judul">Keterangan warna</h3>
      ${htmlLegenda()}
      <h3 class="info-judul">Jawaban Anda sejauh ini</h3>
      <dl class="data" data-uji="info-hitung">
        <div class="data-baris"><dt>Sudah dijawab</dt><dd class="angka">${formatAngka(r.penuh)}</dd></div>
        <div class="data-baris"><dt>Ragu-ragu</dt><dd class="angka">${formatAngka(r.ragu)}</dd></div>
        <div class="data-baris"><dt>Belum dijawab atau belum lengkap</dt><dd class="angka">${formatAngka(r.kosong + r.sebagian)}</dd></div>
      </dl>`,
    aksi: [{ id: 'tutup', label: 'Mengerti', gaya: 'utama' }]
  });
};

function jagaFokus(wadah, fn) {
  const a = document.activeElement;
  const kunci = a && wadah && wadah.contains(a) ? a.getAttribute('data-aksi') : null;
  fn();
  if (kunci) {
    const n = wadah.querySelector('[data-aksi="' + kunci + '"]');
    if (n) { try { n.focus({ preventScroll: true }); } catch (e) {   } }
  }
}
function gambarKaki() {
  const w = el('#uj-kaki');
  if (!w || !UJ) return;
  jagaFokus(w, function () { gambarKakiIsi(w); });
}
function gambarKakiIsi(w) {
  const s = soalAktif();
  const e = UJ.jawaban[s.id];
  const akhir = UJ.idx === UJ.soal.length - 1;
  const ragu = !!(e && e.r);
  pasang(w, h`<div class="ujian-kaki-dalam">
    <button type="button" class="tombol tombol-bahaya tombol-pil" data-aksi="uj-sebelum"${UJ.idx === 0 ? mentah(' aria-disabled="true"') : ''}>${ikon('chevron-left')}<span class="t-panjang">Soal sebelumnya</span><span class="t-pendek">Sebelumnya</span></button>
    <button type="button" class="tombol tombol-pil tombol-ragu${ragu ? ' menyala' : ''}" data-aksi="uj-ragu" role="checkbox" aria-checked="${ragu ? 'true' : 'false'}"><span class="kotak-ragu" aria-hidden="true">${ragu ? ikon('check', 'ikon-sm') : ''}</span><span>Ragu-ragu</span></button>
    ${akhir ? h`<button type="button" class="tombol tombol-pil" data-aksi="uj-kumpul">${ikon('send')}<span class="t-panjang">Tinjau &amp; kumpulkan</span><span class="t-pendek">Kumpulkan</span></button>`
      : h`<button type="button" class="tombol tombol-pil" data-aksi="uj-berikut"><span class="t-panjang">Soal berikutnya</span><span class="t-pendek">Berikutnya</span>${ikon('chevron-right')}</button>`}
  </div>`);
}

function setStatus() {
  const w = el('#uj-status');
  if (!w || !UJ) return;
  let isi;
  if (UJ.gagalPermanen) isi = h`<span class="status-simpan galat">${ikon('alert-circle')}<span>Tidak tersimpan</span></span>`;
  else if (UJ.putusTampil || UJ.gagalBerturut >= 2) isi = h`<span class="status-simpan offline">${ikon('wifi-off')}<span>Tidak ada koneksi. Jawaban aman di perangkat ini; mencoba lagi…</span></span>`;
  else if (UJ.menyimpan) isi = h`<span class="status-simpan"><span class="spinner" aria-hidden="true"></span><span>Menyimpan…</span></span>`;
  else if (idTertinggal().length) isi = h`<span class="status-simpan tunda">${ikon('clock')}<span>Perubahan belum tersimpan</span></span>`;
  else isi = h`<span class="status-simpan ok">${ikon('check-circle')}<span>${UJ.terakhirOkJam ? 'Tersimpan ' + UJ.terakhirOkJam : 'Semua jawaban tersimpan'}</span></span>`;
  pasang(w, isi);
}
function umumkan(teks) { const w = el('#uj-sr'); if (w) w.textContent = teks; }
function jamWIBSekarang() {
  const d = new Date(Date.now() + 7 * 3600000);
  return dua(d.getUTCHours()) + '.' + dua(d.getUTCMinutes()) + '.' + dua(d.getUTCSeconds());
}

function sisaDetik() { return UJ ? (UJ.batasMono - mono()) / 1000 : 0; }
function tik() {
  if (!UJ || UJ.selesai) return;
  const sisa = sisaDetik();
  const d = Math.max(0, Math.ceil(sisa));
  if (d !== UJ.detikTerakhir) {
    UJ.detikTerakhir = d;
    const w = el('#uj-waktu');
    if (w) w.textContent = formatSisa(d);
    const p = el('#uj-pewaktu');
    if (p) { p.classList.toggle('peringatan', d <= 300 && d > 60); p.classList.toggle('mendesak', d <= 60); }
    if (d === 300 && !UJ.sudahDiumumkan[300]) { UJ.sudahDiumumkan[300] = true; umumkan('Sisa waktu lima menit.'); }
    if (d === 60 && !UJ.sudahDiumumkan[60]) { UJ.sudahDiumumkan[60] = true; umumkan('Sisa waktu satu menit.'); }
  }
  if (sisa <= 0 && !UJ.otoMulai) {
    UJ.otoMulai = true;
    umumkan('Waktu habis. Jawaban sedang dikumpulkan.');
    tampilkanWaktuHabis();
    const ref = UJ;
    ref.tOto = setTimeout(function () { if (UJ === ref) kumpulkan(true); }, Math.round(Math.random() * 3000));
  }
}
function tampilkanWaktuHabis() {
  tutupSemuaModal();
  modal({
    judul: 'Waktu habis', tahan: true,
    badan: h`<div class="peringatan peringatan-waspada">${ikon('clock')}<div><p id="uj-habis-teks"><strong>Waktu ujian sudah habis.</strong> Jawaban Anda sedang dikumpulkan. Jangan tutup halaman ini.</p></div></div>
      <div class="pemuat"><span class="spinner" aria-hidden="true"></span><span>Mengumpulkan…</span></div>`
  });
}

function jadwalSimpan(ms) {
  if (!UJ || UJ.selesai) return;
  clearTimeout(UJ.tSimpan);
  const ref = UJ;
  ref.tSimpan = setTimeout(function () { if (UJ === ref) siklusSimpan(); }, ms === undefined ? jitterMs(ref.jeda) : ms);
}
function catatPutus(ref) {
  if (ref.putus) return;
  ref.putus = true;
  if (ref.kejadian.length < 20) ref.kejadian.push('putus');
}

function siklusSimpan() {
  const ref = UJ;
  if (!ref || ref.selesai || ref.mengumpulkan) return;
  if (ref.menyimpan) { jadwalSimpan(2000); return; }
  if (ref.gagalPermanen) return;
  const tertinggal = idTertinggal();
  const sejak = mono() - ref.terakhirOk;
  if (!tertinggal.length && !ref.kejadian.length && sejak < 90000) { jadwalSimpan(); return; }
  const potong = tertinggal.slice(0, 100);
  const kirim = {};
  potong.forEach(function (id) { const e = ref.jawaban[id]; kirim[id] = { j: e.j, v: e.v, r: e.r ? 1 : 0 }; });
  const kej = ref.kejadian.slice(0, 20);
  ref.menyimpan = true;
  setStatus();
  panggil('ujian.simpan', { id_percobaan: ref.id, jawaban: kirim, kejadian: kej }).then(function (d) {
    ref.menyimpan = false;
    if (UJ !== ref || ref.selesai) return;
    ref.kejadian.splice(0, kej.length);
    if (d.selesai) { ujianSelesai(d.percobaan); return; }
    ref.tersimpan = d.tersimpan || {};
    if (typeof d.sisaDetik === 'number') ref.batasMono = mono() + d.sisaDetik * 1000;
    ref.terakhirOk = mono(); ref.terakhirOkJam = jamWIBSekarang();
    if (ref.gagalBerturut >= 2 || ref.putus) umumkan('Koneksi pulih. Jawaban tersimpan.');
    ref.gagalBerturut = 0; ref.putus = false; ref.putusTampil = false;
    setStatus();
    jadwalSimpan(idTertinggal().length && tertinggal.length > potong.length ? 1500 : undefined);
  }).catch(function (e) {
    ref.menyimpan = false;
    if (UJ !== ref || ref.selesai) return;
    if (e.kode === 'SESI') return;
    if (['VALIDASI', 'DITOLAK', 'TIDAK_ADA'].indexOf(e.kode) >= 0) {
      ref.gagalPermanen = e.message;
      tampilkanBanner('galat', 'Jawaban tidak dapat disimpan: ' + e.message + ' Muat ulang halaman ini; jawaban Anda tersimpan di perangkat dan akan dikirim ulang.');
      setStatus();
      return;
    }
    ref.gagalBerturut++;
    if (e.kode === 'JARINGAN') { ref.putusTampil = true; catatPutus(ref); }
    setStatus();
    const tunggu = Math.min(30000, 3000 * Math.pow(2, Math.min(ref.gagalBerturut - 1, 4))) * (0.8 + Math.random() * 0.4);
    jadwalSimpan(tunggu);
  });
}

function simpanSekarang() {
  const ref = UJ;
  if (!ref || ref.selesai) return Promise.resolve(true);
  const tertinggal = idTertinggal();
  if (!tertinggal.length && !ref.kejadian.length) return Promise.resolve(true);
  const kirim = {};
  tertinggal.slice(0, 100).forEach(function (id) { const e = ref.jawaban[id]; kirim[id] = { j: e.j, v: e.v, r: e.r ? 1 : 0 }; });
  const kej = ref.kejadian.slice(0, 20);
  return panggil('ujian.simpan', { id_percobaan: ref.id, jawaban: kirim, kejadian: kej }).then(function (d) {
    if (d.selesai) return true;
    ref.tersimpan = d.tersimpan || {};
    ref.kejadian.splice(0, kej.length);
    return idTertinggal().length === 0;
  }, function () { return false; });
}

function saatTampilBerubah(ref) {
  if (UJ !== ref || ref.selesai) return;
  if (document.hidden) { ref.tersembunyi = true; ref.waktuSembunyi = Date.now(); return; }
  if (!ref.tersembunyi) return;
  ref.tersembunyi = false;
  if (lpBaruBerganti() && Date.now() - (ref.waktuSembunyi || 0) < 1500) return;
  ref.jumlahTab++;
  if (ref.kejadian.length < 20) ref.kejadian.push('pindah_tab');
  tampilkanBanner('waspada', 'Anda sempat meninggalkan halaman ujian (' + ref.jumlahTab + '×). Perpindahan tab dicatat dan dapat dilihat guru. Tetap fokus pada ujian.');
  jadwalSimpan(800 + Math.random() * 1500);
}
function tampilkanBanner(jenis, pesan) {
  const w = el('#uj-banner');
  if (!w) return;
  pasang(w, h`<div class="peringatan ${jenis === 'galat' ? 'peringatan-bahaya' : 'peringatan-waspada'} ujian-banner" role="${jenis === 'galat' ? 'alert' : 'status'}">${ikon(jenis === 'galat' ? 'alert-circle' : 'alert-triangle')}<div><p>${pesan}</p></div><button type="button" class="tombol tombol-polos tombol-ikon" data-aksi="uj-tutup-banner" aria-label="Tutup pemberitahuan">${ikon('x')}</button></div>`);
}
AKSI['uj-tutup-banner'] = function () { const w = el('#uj-banner'); if (w) w.innerHTML = ''; };

AKSI['uj-kumpul'] = function () {
  if (!UJ || UJ.selesai || UJ.mengumpulkan) return;
  tutupSemuaModal();
  const r = ringkasJawaban();
  modal({
    judul: 'Kumpulkan jawaban?',
    badan: h`<dl class="data">
        <div class="data-baris"><dt>Terjawab</dt><dd class="angka">${formatAngka(r.penuh)} dari ${formatAngka(r.total)}</dd></div>
        <div class="data-baris"><dt>Belum dijawab atau sebagian</dt><dd class="angka">${formatAngka(r.kosong + r.sebagian)}</dd></div>
        <div class="data-baris"><dt>Ditandai ragu-ragu</dt><dd class="angka">${formatAngka(r.ragu)}</dd></div>
      </dl>
      ${r.belum.length ? h`<div class="peringatan peringatan-waspada">${ikon('alert-triangle')}<div><p><strong>Soal belum lengkap:</strong> ${r.belum.slice(0, 20).join(', ')}${r.belum.length > 20 ? ', …' : ''}</p></div></div>` : ''}
      <p class="tanpa-margin">Setelah dikumpulkan, jawaban tidak bisa diubah.</p>
      <div id="uj-kirim" class="peringatan" role="status" hidden>${ikon('send')}<div><p><strong>Mengirim jawaban Anda…</strong> Jangan tutup halaman ini sampai hasil tampil.</p></div></div>`,
    aksi: [
      { id: 'kembali', label: 'Kembali ke soal', gaya: 'diam' },
      {
        id: 'kumpul', label: 'Kumpulkan sekarang', gaya: 'utama',
        onKlik: function (api, tombol) {
          const info = el('#uj-kirim');
          if (info) info.hidden = false;
          kerjakan(tombol, function () { return kumpulkan(false); }, 'Mengirim jawaban…').then(function (ok) {
            if (ok === false) { const i2 = el('#uj-kirim'); if (i2) i2.hidden = true; api.tutup(null); }
          });
        }
      }
    ]
  });
};

function kumpulkan(otomatis) {
  const ref = UJ;
  if (!ref || ref.selesai || ref.mengumpulkan) return Promise.resolve(false);
  ref.mengumpulkan = true;
  clearTimeout(ref.tSimpan);
  const semuaJawaban = {};
  Object.keys(ref.jawaban).forEach(function (id) { const e = ref.jawaban[id]; semuaJawaban[id] = { j: e.j, v: e.v, r: e.r ? 1 : 0 }; });
  return panggil('ujian.kumpul', { id_percobaan: ref.id, jawaban: semuaJawaban, otomatis: !!otomatis, denganHasil: true }, { sabar: otomatis ? 14 : 8 }).then(function (d) {
    if (UJ !== ref) return true;
    ujianSelesai(d.percobaan, d.hasil);
    return true;
  }).catch(function (e) {
    if (UJ !== ref) return false;
    ref.mengumpulkan = false;
    if (e.kode === 'SESI') return false;
    if (otomatis) {
      const t = el('#uj-habis-teks');
      if (t) pasang(t, h`<strong>Waktu ujian sudah habis.</strong> Belum bisa menghubungi server (${e.message}). Mencoba lagi…`);
      ref.otoMulai = true;
      ref.tCoba = setTimeout(function () {
        if (UJ !== ref) return;
        if (sisaDetik() < -20) cekHasilSetelahHabis(ref); else kumpulkan(true);
      }, 3000 + Math.random() * 3000);
      return false;
    }
    if (!e.ditangani) toast(e.message, 'galat');
    jadwalSimpan();
    return false;
  });
}
function cekHasilSetelahHabis(ref) {
  panggil('ujian.hasil', { id_percobaan: ref.id }).then(function (d) {
    if (UJ !== ref) return;
    ujianSelesai(d.percobaan, d);
  }).catch(function () {
    if (UJ !== ref) return;
    ref.tCoba = setTimeout(function () { if (UJ === ref) cekHasilSetelahHabis(ref); }, 5000 + Math.random() * 3000);
  });
}

function ujianSelesai(r, hasil) {
  const token = !!(S.pengguna && S.pengguna.peran === PERAN.TOKEN);
  if (UJ) UJ.selesai = true;
  bersihUjian();
  hapusCadangan(r.id);
  tutupSemuaModal();
  hasilKumpul = hasil && typeof hasil === 'object' && hasil.percobaan && hasil.percobaan.id === r.id ? { id: r.id, data: hasil } : null;
  if (token) S.percobaanToken = r;
  navigateTo(token ? 'hasil-token' : 'hasil', { id: r.id }, { tanpaRiwayat: true });
}

const LABEL_STATUS_BUTIR = { benar: 'Benar', sebagian: 'Sebagian benar', salah: 'Salah', kosong: 'Tidak dijawab' };
const IKON_STATUS_BUTIR = { benar: 'check-circle', sebagian: 'alert-triangle', salah: 'x', kosong: 'circle' };
const KELAS_STATUS_BUTIR = { benar: 'lencana-sukses', sebagian: 'lencana-peringatan', salah: 'lencana-bahaya', kosong: '' };

function teksBS(x) { return x === 'B' ? 'Benar' : (x === 'S' ? 'Salah' : 'Tidak dijawab'); }
function htmlCatatanButir(b) {
  if (b.bentukBerubah) return h`<p class="bantu catatan-butir" data-uji="catatan-bentuk">${ikon('info', 'ikon-sm')}<span>Jenis soal ini diubah setelah dikerjakan, jadi pilihan dan jawaban tidak bisa ditampilkan lagi. Nilai tetap sesuai hasil saat dikerjakan.</span></p>`;
  if (b.diubah) return h`<p class="bantu catatan-butir" data-uji="catatan-diubah">${ikon('info', 'ikon-sm')}<span>Soal ini diubah setelah dikerjakan. Isi dan kunci yang tampil adalah versi terbaru; nilai tetap sesuai hasil saat dikerjakan kecuali sudah dihitung ulang.</span></p>`;
  return '';
}
function jawabanPernyataan(jenis, arr, i) {
  const x = arr ? arr[i] : null;
  if (x === 'B' || x === 'S') return x;
  if (jenis === 'MCMA' && arr && arr.some(function (v) { return v === 'B' || v === 'S'; })) return 'S';
  return null;
}
function htmlButir(b, untukStaf) {
  return h`<li class="butir-hasil ${b.status === 'kosong' ? 'tanpa-jawaban' : b.status}">
    <div class="butir-kepala"><span class="nomor angka">${b.no}</span><span class="lencana ${KELAS_STATUS_BUTIR[b.status]}">${ikon(IKON_STATUS_BUTIR[b.status], 'ikon-sm')} ${LABEL_STATUS_BUTIR[b.status]}</span><span class="teks-redam angka">Skor ${angkaSkor(b.skor)}</span><span class="lencana lencana-primer rata-kanan">${LABEL_JENIS_PENDEK[b.jenis]}</span></div>
    ${!kayaKosong(b.stimulus) ? h`<div class="stimulus ky">${kayaHtml(b.stimulus)}</div>` : ''}
    <div class="pertanyaan-ujian ky">${kayaHtml(b.pertanyaan)}</div>
    ${htmlCatatanButir(b)}
    ${b.bentukBerubah ? '' : b.jenis === 'PG'
      ? h`<ul class="opsi-hasil">${b.opsi.map(function (teks, i) {
        const hr = 'ABCD'.charAt(i);
        const pilih = b.jawaban === hr, kunci = b.kunci === hr;
        return h`<li class="${kunci ? 'kunci' : ''}${pilih ? ' pilih' : ''}">${untukStaf === true ? h`<span class="huruf" aria-hidden="true">${hr}</span>` : ''}<span class="teks ky">${kayaHtml(teks)}</span>${pilih ? h`<span class="lencana">Jawaban Anda</span>` : ''}${kunci ? h`<span class="lencana lencana-sukses">${ikon('check', 'ikon-sm')} Kunci</span>` : ''}</li>`;
      })}</ul>`
      : h`<ul class="opsi-hasil">${b.opsi.map(function (teks, i) {
        const ja = jawabanPernyataan(b.jenis, b.jawaban, i), kc = b.kunci ? b.kunci[i] : null;
        const cocok = ja === kc;
        const kosongJ = ja !== 'B' && ja !== 'S';
        return h`<li class="${cocok ? 'kunci' : (kosongJ ? 'tanpa' : 'salah')}"><span class="huruf angka" aria-hidden="true">${i + 1}</span><span class="teks ky">${kayaHtml(teks)}</span>
          <span class="lencana ${cocok ? 'lencana-sukses' : (kosongJ ? '' : 'lencana-bahaya')}">${kosongJ ? '' : ikon(cocok ? 'check' : 'x', 'ikon-sm')} Anda: ${teksBS(ja)}</span><span class="lencana">Kunci: ${teksBS(kc)}</span></li>`;
      })}</ul>`}
    ${b.pembahasan ? h`<div class="pembahasan-butir" data-uji="pembahasan-butir"><p class="pembahasan-judul">${ikon('book-open', 'ikon-sm')} Pembahasan</p><p class="pembahasan-isi">${b.pembahasan}</p></div>` : ''}
  </li>`;
}

function htmlHasil(d, staf) {
  const pk = d.percobaan;
  const lencanaStatus = pk.status === 'Waktu habis' ? h`<span class="lencana lencana-peringatan">${ikon('clock', 'ikon-sm')} Waktu habis</span>`
    : (pk.status === 'Dibatalkan' ? h`<span class="lencana lencana-bahaya">Dibatalkan</span>` : h`<span class="lencana lencana-sukses">${ikon('check', 'ikon-sm')} Selesai</span>`);
  if (d.dibatalkan) {
    return h`<div class="peringatan peringatan-bahaya">${ikon('alert-circle')}<div><p><strong>Percobaan dibatalkan.</strong> ${d.pesan}</p></div></div>`;
  }
  const kepala = h`<section class="kartu hasil-ringkas" aria-labelledby="hasil-judul">
    <div class="baris-bungkus"><h2 id="hasil-judul" class="tanpa-margin">${d.paket.nama}</h2>${lencanaStatus}</div>
    <p class="teks-redam tanpa-margin">${MAPEL[d.paket.mapel] || d.paket.mapel} · ${d.paket.kategori}${pk.nomorUrut > 1 || !staf ? ' · percobaan ke-' + pk.nomorUrut : ''} · selesai ${waktuWIB(pk.waktuSelesai)}</p>
    ${d.nilaiTeks !== undefined ? h`<div class="nilai-besar"><span class="nilai-label">Nilai</span><span class="nilai-angka angka" data-uji="nilai">${d.nilaiTeks}</span>${d.skor !== undefined ? h`<span class="teks-redam angka">Skor ${angkaSkor(d.skor)} dari ${angkaSkor(d.skorMaks)}</span>` : ''}</div>` : ''}
    ${d.pesan ? h`<div class="peringatan">${ikon('info')}<div><p>${d.pesan}</p></div></div>` : ''}
    ${d.dihapus ? h`<div class="peringatan" data-uji="catatan-dihapus">${ikon('info')}<div><p>${formatAngka(d.dihapus)} soal dihapus setelah dikerjakan, jadi tidak tampil di rincian. Nilai tetap sesuai hasil saat dikerjakan.</p></div></div>` : ''}
    ${d.hitung ? h`<ul class="hitung-hasil" aria-label="Rekap jawaban">
      <li><span class="lencana lencana-sukses">${ikon('check-circle', 'ikon-sm')} Benar</span><strong class="angka">${formatAngka(d.hitung.benar)}</strong></li>
      <li><span class="lencana lencana-peringatan">${ikon('alert-triangle', 'ikon-sm')} Sebagian</span><strong class="angka">${formatAngka(d.hitung.sebagian)}</strong></li>
      <li><span class="lencana lencana-bahaya">${ikon('x', 'ikon-sm')} Salah</span><strong class="angka">${formatAngka(d.hitung.salah)}</strong></li>
      <li><span class="lencana">${ikon('circle', 'ikon-sm')} Tidak dijawab</span><strong class="angka">${formatAngka(d.hitung.kosong)}</strong></li>
    </ul>` : ''}
  </section>`;
  const rincian = d.butir ? h`<section aria-labelledby="rinci-judul"><h2 id="rinci-judul" class="jarak-atas">Rincian jawaban</h2><ol class="daftar-butir">${d.butir.map(function (b) { return htmlButir(b, !!staf); })}</ol></section>` : '';
  return h`${kepala}${htmlKartuPembahasanSiswa(d)}${rincian}`;
}

function renderHasil(p, c, token) {
  const id = (p && p.id) || (S.percobaanToken && S.percobaanToken.id) || '';
  const bungkus = function (isi) {
    if (!token) return isi;
    return h`<header class="publik-header"><div class="dalam"><span class="merek"><span class="logo">${logoMerek()}</span><span class="nama">${namaApp()}</span></span>
      <div class="kanan"><button type="button" class="tombol tombol-diam tombol-ikon" data-aksi="tema" aria-label="Ganti tema">${ikon('moon')}</button></div></div></header>
      <main id="isi-publik" class="pembungkus hasil-halaman" tabindex="-1"><h1 id="judul-hasil">Hasil ujian</h1>${isi}</main>`;
  };
  if (!id) { navigateTo(token ? 'token' : 'riwayat', {}, { tanpaRiwayat: true }); return; }
  const bawaan = hasilKumpul && hasilKumpul.id === id ? hasilKumpul.data : null;
  hasilKumpul = null;
  (bawaan ? Promise.resolve(bawaan) : panggil('ujian.hasil', { id_percobaan: id }, { ulang: true })).then(function (d) {
    if (!c.ok()) return;
    const aksi = token
      ? h`<div class="baris-bungkus jarak-atas"><button type="button" class="tombol" data-aksi="token-selesai">${ikon('check')}<span>Selesai</span></button><span class="bantu">Setelah menekan Selesai, data peserta dihapus dari perangkat ini.</span></div>`
      : h`<div class="baris-bungkus jarak-atas"><button type="button" class="tombol" data-aksi="ke-dasbor">${ikon('home')}<span>Kembali ke beranda</span></button><button type="button" class="tombol tombol-diam" data-aksi="nav" data-ke="riwayat">${ikon('clock')}<span>Riwayat</span></button></div>`;
    pasang(c.wadah, bungkus(h`${token ? '' : kepalaHalaman('Hasil ujian', null)}${htmlHasil(d, false)}${aksi}`));
    if (token) setJudul(d.paket.nama); else setJudul('Hasil ujian');
    fokusJudul();
  }).catch(function (e) {
    if (!c.ok() || e.ditangani) return;
    if (e.kode === 'BELUM_SELESAI') {
      pasang(c.wadah, bungkus(h`<div class="kartu kosong"><span class="ikon-bulat peringatan">${ikon('clock')}</span><h3>Ujian masih berjalan</h3><p>${e.message}</p><button type="button" class="tombol" data-aksi="ujian-lanjut" data-id="${id}">${ikon('play')}<span>Lanjutkan ujian</span></button></div>`));
      return;
    }
    pasang(c.wadah, bungkus(h`<div class="kartu kosong"><span class="ikon-bulat bahaya">${ikon('alert-triangle')}</span><h3>Hasil tidak bisa dimuat</h3><p>${e.message}</p><button type="button" class="tombol tombol-garis" data-aksi="muat-ulang">${ikon('refresh')}Coba lagi</button></div>`));
  });
}
AKSI['token-selesai'] = function () {
  const id = S.percobaanToken && S.percobaanToken.id;
  if (id) hapusCadangan(id);
  bersihkanSesi('', 'beranda');
};

const KELAS_STATUS = { Berjalan: 'lencana-info', Selesai: 'lencana-sukses', 'Waktu habis': 'lencana-peringatan', Dibatalkan: 'lencana-bahaya' };
function renderRiwayat(p, c) {
  panggil('ujian.riwayat', {}, { ulang: true }).then(function (daftar) {
    if (!c.ok()) return;
    if (!daftar.length) {
      pasang(c.wadah, h`${kepalaHalaman('Riwayat pengerjaan', 'Semua percobaan Anda, terbaru di atas.')}<div class="kartu kosong"><span class="ikon-bulat netral">${ikon('clock')}</span><h3>Belum ada riwayat</h3><p>Mulai mengerjakan paket dari Try Out &amp; Latihan. Setiap percobaan akan tercatat di sini.</p><button type="button" class="tombol" data-aksi="nav" data-ke="katalog">${ikon('package')}<span>Lihat Try Out &amp; Latihan</span></button></div>`);
      fokusJudul();
      return;
    }
    pasang(c.wadah, h`${kepalaHalaman('Riwayat pengerjaan', 'Semua percobaan Anda, terbaru di atas.')}
      <div class="bungkus-tabel"><table class="tabel"><caption class="sr-only">Riwayat pengerjaan</caption>
        <thead><tr><th scope="col">Paket</th><th scope="col">Percobaan</th><th scope="col">Status</th><th scope="col">Nilai</th><th scope="col">Mulai</th><th scope="col"><span class="sr-only">Aksi</span></th></tr></thead>
        <tbody>${daftar.map(function (r) {
          return h`<tr>
            <td data-label="Paket" class="pecah"><div class="tebal">${r.namaPaket}</div><div class="sub-sel">${MAPEL[r.mapel] || r.mapel} · ${r.kategori}</div></td>
            <td data-label="Percobaan" class="angka">ke-${r.nomorUrut}</td>
            <td data-label="Status"><span class="lencana ${KELAS_STATUS[r.status] || ''}">${r.status}</span></td>
            <td data-label="Nilai" class="angka">${r.nilaiTeks !== null && r.nilaiTeks !== undefined ? r.nilaiTeks : '—'}</td>
            <td data-label="Mulai">${waktuWIB(r.waktuMulai)}</td>
            <td class="sel-aksi"><div class="aksi-sel">${r.status === 'Berjalan'
              ? h`<button type="button" class="tombol" data-aksi="ujian-lanjut" data-id="${r.id}">${ikon('play')}<span>Lanjutkan</span></button>`
              : h`<button type="button" class="tombol tombol-diam" data-aksi="riwayat-hasil" data-id="${r.id}">${ikon('file-text')}<span>Lihat hasil</span></button>`}</div></td></tr>`;
        })}</tbody></table></div>`);
    fokusJudul();
  }).catch(function (e) { if (c.ok()) tampilkanGalatMuat(c.wadah, e, true); });
}
AKSI['riwayat-hasil'] = function (b) { navigateTo('hasil', { id: b.getAttribute('data-id') }); };


const tokenSt = { kode: '', paket: null, sekolah: [], kodeAwal: '' };
const GALAT_KODE_DITAMPILKAN = ['TOKEN_TIDAK_SAH', 'DIBATASI', 'VALIDASI', 'PEMELIHARAAN'];

function renderToken(p, c) {
  tokenSt.kodeAwal = p && typeof p.kode === 'string' && POLA_KODE_UJIAN.test(normalkanKode(p.kode)) ? normalkanKode(p.kode) : '';
  tokenSt.kode = ''; tokenSt.paket = null; tokenSt.sekolah = [];
  pasang(c.wadah, h`
    ${headerPublik(false)}${bannerPublik()}
    <main class="pembungkus token-halaman" id="isi-publik" tabindex="-1">
      <div class="token-kepala">
        <h1 id="judul-token" tabindex="-1">Ujian dengan kode</h1>
        <p class="teks-redam">Untuk peserta tanpa akun. Masukkan kode ujian dari guru; kode itu langsung membuka paket yang sesuai. Punya akun? <button type="button" class="tombol tombol-polos tombol-kecil" data-aksi="ke-masuk">Masuk di sini</button></p>
        ${p && p.pesan ? h`<div class="peringatan peringatan-waspada" role="status">${ikon('info')}<div><p>${p.pesan}</p></div></div>` : ''}
      </div>
      <div id="token-isi"></div>
    </main>
    ${kakiPublik()}`);
  const j = el('#judul-token'); if (j) { try { j.focus({ preventScroll: true }); } catch (e) {   } }
  gambarFormKode(tokenSt.kodeAwal);
  if (tokenSt.kodeAwal) { const f = el('#f-kode'); if (f) KIRIM['token-periksa'](f); }
}

function gambarFormKode(nilai) {
  const w = el('#token-isi');
  if (!w) return;
  pasang(w, h`<form id="f-kode" class="kartu token-form" data-kirim="token-periksa" novalidate autocomplete="off">
    <div data-galat aria-live="polite"></div>
    <div class="isian"><label for="tk-kode">Kode ujian</label>
      <input class="kontrol kode-ujian" id="tk-kode" name="kode" type="text" inputmode="text" autocapitalize="characters" autocorrect="off" spellcheck="false" maxlength="12" autocomplete="off" required aria-describedby="tk-kode-b" placeholder="Contoh: K7M2P9XQ">
      <p class="bantu" id="tk-kode-b">8 huruf atau angka dari guru. Huruf besar atau kecil sama saja.</p></div>
    <div class="aksi-form"><button type="submit" class="tombol">${ikon('play')}<span>Lanjut</span></button></div>
  </form>`);
  const k = el('#tk-kode');
  if (k && nilai) k.value = nilai;
}

KIRIM['token-periksa'] = function (form) {
  bersihGalat(form);
  const kode = normalkanKode(nilaiForm(form).kode);
  if (!kode) { galatIsian(form, 'kode', 'Isi kode ujian dari guru.'); return; }
  if (!POLA_KODE_UJIAN.test(kode)) { galatIsian(form, 'kode', 'Kode terdiri dari 8 huruf atau angka. Huruf O, I, L dan angka 0, 1 tidak dipakai; periksa kembali kode dari guru.'); return; }
  return kerjakan(tombolKirim(form), function () {
    return panggil('token.periksa', { kode: kode, perangkat: idPerangkat() }, { ulang: true }).then(function (d) {
      if (!el('#f-kode')) return;
      tokenSt.kode = kode; tokenSt.paket = d.paket; tokenSt.sekolah = d.sekolah || [];
      gambarFormPeserta();
    });
  }).catch(function (e) {
    if (GALAT_KODE_DITAMPILKAN.indexOf(e.kode) >= 0) {
      galatForm(form, e.message);
      const k = el('#tk-kode'); if (k) k.focus();
    } else gagalUmum(e);
  });
};

function gambarFormPeserta() {
  const w = el('#token-isi');
  const pk = tokenSt.paket;
  if (!w || !pk) return;
  const maks = hariIniISO();
  pasang(w, h`<section class="kartu token-paket" aria-labelledby="h-token-paket" data-uji="token-paket">
      <div class="kartu-judul"><span class="ikon-bulat">${ikon(IKON_MAPEL[pk.mapel] || 'package')}</span><h2 id="h-token-paket" tabindex="-1">${pk.nama}</h2></div>
      <div class="baris-bungkus"><span class="lencana lencana-primer">${MAPEL[pk.mapel] || pk.mapel}</span><span class="lencana">${pk.kategori}</span>
        <span class="teks-redam angka">${formatAngka(pk.jumlahSoal)} soal · ${formatAngka(pk.durasiMenit)} menit</span></div>
      <p class="bantu tanpa-margin">Kode <span class="mono" data-uji="token-kode">${tokenSt.kode}</span> · <button type="button" class="tombol tombol-polos tombol-kecil" data-aksi="token-ganti-kode">Ganti kode</button></p>
    </section>
    <form id="f-token" class="kartu token-form" data-kirim="token-mulai" novalidate autocomplete="off">
    <div data-galat aria-live="polite"></div>
    <fieldset class="isian fieldset-polos token-data"><legend class="label">Data peserta</legend>
      <div class="kelompok-isian">
        <div class="isian penuh"><label for="tk-nama">Nama lengkap</label><input class="kontrol" id="tk-nama" name="nama_lengkap" type="text" maxlength="100" autocomplete="off" required aria-describedby="tk-nama-b"><p class="bantu" id="tk-nama-b">Tulis sama persis setiap kali. Nama dan tanggal lahir dipakai untuk melanjutkan ujian bila halaman tertutup.</p></div>
        <div class="isian"><label for="tk-lahir">Tanggal lahir</label><input class="kontrol" id="tk-lahir" name="tanggal_lahir" type="date" min="${tahunLalu(25)}" max="${maks}" required></div>
        <fieldset class="isian fieldset-polos"><legend class="label">Jenis kelamin</legend><div class="segmen" role="radiogroup" aria-label="Jenis kelamin">
          <label>${ikon('check')}<input type="radio" name="jenis_kelamin" value="L"> Laki-laki</label>
          <label>${ikon('check')}<input type="radio" name="jenis_kelamin" value="P"> Perempuan</label></div></fieldset>
        <div class="isian penuh"><label for="tk-sekolah">Asal sekolah</label><input class="kontrol" id="tk-sekolah" name="sekolah" type="text" list="dl-tk-sekolah" maxlength="100" autocomplete="off" required><datalist id="dl-tk-sekolah">${tokenSt.sekolah.map(function (s) { return h`<option value="${s}"></option>`; })}</datalist></div>
      </div>
    </fieldset>
    <div class="peringatan">${ikon('info')}<div><p><strong>Tentang data Anda.</strong> Nama, tanggal lahir, jenis kelamin, dan sekolah dipakai untuk menampilkan hasil dan membantu guru. Data peserta tanpa akun dihapus (dianonimkan) otomatis setelah 12 bulan. Hasil dengan kode tidak masuk peringkat.</p></div></div>
    <div class="aksi-form"><button type="submit" class="tombol">${ikon('play')}<span>Periksa &amp; mulai</span></button></div>
  </form>`);
  const j = el('#h-token-paket'); if (j) { try { j.focus({ preventScroll: true }); } catch (e) {   } }
}
AKSI['token-ganti-kode'] = function () {
  const kode = tokenSt.kode;
  tokenSt.kode = ''; tokenSt.paket = null;
  gambarFormKode(kode);
  const k = el('#tk-kode'); if (k) { try { k.focus(); k.select(); } catch (e) {   } }
};

KIRIM['token-mulai'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const nama = String(v.nama_lengkap || '').replace(/\s+/g, ' ');
  if (nama.length < 3) { galatIsian(form, 'nama_lengkap', 'Nama lengkap minimal 3 karakter.'); return; }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.tanggal_lahir || '')) { galatIsian(form, 'tanggal_lahir', 'Isi tanggal lahir.'); return; }
  if (v.tanggal_lahir > hariIniISO()) { galatIsian(form, 'tanggal_lahir', 'Tanggal lahir tidak boleh di masa depan.'); return; }
  if (v.jenis_kelamin !== 'L' && v.jenis_kelamin !== 'P') { galatForm(form, 'Pilih jenis kelamin.'); const f = el('input[name="jenis_kelamin"]', form); if (f) f.focus(); return; }
  if (!v.sekolah || v.sekolah.length < 3) { galatIsian(form, 'sekolah', 'Isi asal sekolah (minimal 3 karakter).'); return; }
  const kode = tokenSt.kode, paket = tokenSt.paket;
  if (!kode || !paket) { gambarFormKode(kode); return; }

  const api = modal({
    judul: 'Periksa data Anda',
    badan: h`<p class="tanpa-margin">Pastikan data sudah benar. Setelah ujian dimulai, <strong>waktu langsung berjalan di server</strong> dan data tidak bisa diubah.</p>
      <dl class="data">
        <div class="data-baris"><dt>Paket</dt><dd>${paket.nama}</dd></div>
        <div class="data-baris"><dt>Soal dan waktu</dt><dd class="angka">${formatAngka(paket.jumlahSoal)} soal · ${formatAngka(paket.durasiMenit)} menit</dd></div>
        <div class="data-baris"><dt>Nama</dt><dd>${nama}</dd></div>
        <div class="data-baris"><dt>Tanggal lahir</dt><dd>${tanggalLahirTeks(v.tanggal_lahir)}</dd></div>
        <div class="data-baris"><dt>Jenis kelamin</dt><dd>${v.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</dd></div>
        <div class="data-baris"><dt>Sekolah</dt><dd>${v.sekolah}</dd></div>
        <div class="data-baris"><dt>Kode</dt><dd class="mono">${kode}</dd></div>
      </dl>`,
    aksi: [
      { id: 'perbaiki', label: 'Perbaiki data', gaya: 'diam' },
      {
        id: 'mulai', label: 'Mulai ujian sekarang', gaya: 'utama',
        onKlik: function (a, tombol) {
          const kendali = { batal: false };
          a.selesai.then(function () { kendali.batal = true; });
          kerjakan(tombol, function () {
            return panggil('token.mulai', {
              kode: kode, nama_lengkap: nama, tanggal_lahir: v.tanggal_lahir, jenis_kelamin: v.jenis_kelamin,
              sekolah: v.sekolah, perangkat: idPerangkat(), kunci_idempotensi: idAcak(24)
            }, { kendali: kendali, sebar: true }).then(function (d) {
              simpanToken(d.token, 'token');
              S.pengguna = d.pengguna;
              S.percobaanToken = d.ujian.percobaan;
              ujianAwal = d.ujian;
              a.tutup('mulai');
              navigateTo('ujian', { id: d.ujian.percobaan.id }, { tanpaRiwayat: true });
            });
          }).catch(function (e) {
            a.tutup(null);
            const di = ['TOKEN_TIDAK_SAH', 'SUDAH_DIPAKAI', 'DIBATASI', 'VALIDASI', 'PEMELIHARAAN', 'KUNCI_TIDAK_SAH', 'STATUS', 'TIDAK_ADA'];
            if (di.indexOf(e.kode) >= 0) galatForm(form, e.message); else gagalUmum(e);
          });
        }
      }
    ]
  });
  return api;
};



const GR_MARGIN = { kiri: 34, kanan: 10, atas: 12, bawah: 26 };
const GR_DALAM = 10;
const GR_LEBAR_MIN = 240;
const GR_JARAK_LABEL_X = 28;
const GR_GARIS_Y = [0, 25, 50, 75, 100];

function grUkuran(lebarWadah) {
  const w = Number(lebarWadah);
  const lebar = Math.max(GR_LEBAR_MIN, Math.floor(isFinite(w) ? w : GR_LEBAR_MIN));
  const tinggi = Math.max(180, Math.min(280, Math.round(lebar * 0.55)));
  return { lebar: lebar, tinggi: tinggi };
}

function grGaya(kategori) { return kategori === 'Try Out Utama' ? 'to' : 'lm'; }
function grBulat(n) { return Math.round(n * 100) / 100; }
function grBatas(n) { return n < 0 ? 0 : (n > 100 ? 100 : n); }

function hitungGrafik(seri, lebar, tinggi) {
  const m = GR_MARGIN;
  const x0 = m.kiri, x1 = lebar - m.kanan, y0 = m.atas, y1 = tinggi - m.bawah;
  const bersih = (seri || []).filter(function (s) {
    return s && s.nilai !== null && s.nilai !== undefined && s.nilai !== '' && isFinite(Number(s.nilai));
  });
  const n = bersih.length;
  const px0 = x0 + GR_DALAM, px1 = x1 - GR_DALAM;
  const langkah = n > 1 ? (px1 - px0) / (n - 1) : 0;
  const yDari = function (nilai) { return y1 - (grBatas(Number(nilai)) / 100) * (y1 - y0); };
  const titik = bersih.map(function (s, i) {
    const nilai = grBatas(Number(s.nilai));
    return {
      i: i, x: grBulat(n > 1 ? px0 + i * langkah : (px0 + px1) / 2), y: grBulat(yDari(nilai)), nilai: nilai,
      kategori: s.kategori, gaya: grGaya(s.kategori), ulang: Number(s.ke) > 1, ke: Number(s.ke) || 1, label: s.label || ''
    };
  });
  const garis = [];
  ['to', 'lm'].forEach(function (g) {
    const t = titik.filter(function (p) { return p.gaya === g; });
    if (t.length >= 2) garis.push({ gaya: g, titik: t });
  });
  const sumbuY = GR_GARIS_Y.map(function (v) { return { nilai: v, y: grBulat(yDari(v)) }; });
  const lompat = langkah > 0 ? Math.max(1, Math.ceil(GR_JARAK_LABEL_X / langkah)) : 1;
  const sumbuX = titik.filter(function (p) { return p.i % lompat === 0; }).map(function (p) { return { i: p.i, x: p.x, teks: String(p.i + 1) }; });
  return { lebar: lebar, tinggi: tinggi, area: { x0: x0, x1: x1, y0: y0, y1: y1 }, titik: titik, garis: garis, sumbuY: sumbuY, sumbuX: sumbuX, n: n };
}

function grPenanda(p) {
  const kelas = 'gr-titik gr-' + p.gaya + (p.ulang ? ' gr-ulang' : '');
  const judul = '<title>' + esc(p.label || (p.kategori + ' · nilai ' + p.nilai)) + '</title>';
  if (p.gaya === 'to') return '<g class="' + kelas + '">' + judul + '<circle cx="' + p.x + '" cy="' + p.y + '" r="5"></circle></g>';
  const r = 6.5;
  const pts = [[p.x, p.y - r], [p.x + r, p.y], [p.x, p.y + r], [p.x - r, p.y]].map(function (q) { return grBulat(q[0]) + ',' + grBulat(q[1]); }).join(' ');
  return '<g class="' + kelas + '">' + judul + '<polygon points="' + pts + '"></polygon></g>';
}

function svgGrafik(g, opsi) {
  const o = opsi || {};
  const id = String(o.id || 'gr').replace(/[^A-Za-z0-9_-]/g, '');
  const bagian = [];
  bagian.push('<svg class="grafik" width="' + g.lebar + '" height="' + g.tinggi + '" viewBox="0 0 ' + g.lebar + ' ' + g.tinggi + '" role="img" aria-labelledby="' + id + '-j ' + id + '-d" focusable="false">');
  bagian.push('<title id="' + id + '-j">' + esc(o.judul || 'Grafik nilai') + '</title>');
  bagian.push('<desc id="' + id + '-d">' + esc(o.deskripsi || '') + '</desc>');
  g.sumbuY.forEach(function (s) {
    bagian.push('<line class="gr-grid' + (s.nilai === 0 ? ' gr-dasar' : '') + '" x1="' + g.area.x0 + '" x2="' + g.area.x1 + '" y1="' + s.y + '" y2="' + s.y + '"></line>');
    bagian.push('<text class="gr-sumbu" x="' + (g.area.x0 - 6) + '" y="' + grBulat(s.y + 4) + '" text-anchor="end">' + s.nilai + '</text>');
  });
  g.sumbuX.forEach(function (s) {
    bagian.push('<text class="gr-sumbu" x="' + s.x + '" y="' + (g.area.y1 + 18) + '" text-anchor="middle">' + esc(s.teks) + '</text>');
  });
  g.garis.forEach(function (l) {
    bagian.push('<polyline class="gr-garis gr-' + l.gaya + '" points="' + l.titik.map(function (p) { return p.x + ',' + p.y; }).join(' ') + '"></polyline>');
  });
  g.titik.forEach(function (p) { bagian.push(grPenanda(p)); });
  bagian.push('</svg>');
  return bagian.join('');
}

function grContoh(gaya, ulang, tanpaGaris) {
  const kelas = 'gr-titik gr-' + gaya + (ulang ? ' gr-ulang' : '');
  const garis = tanpaGaris ? '' : '<line class="gr-garis gr-' + gaya + '" x1="1" x2="35" y1="7" y2="7"></line>';
  const bentuk = gaya === 'to' ? '<circle cx="18" cy="7" r="5"></circle>' : '<polygon points="18,0.5 24.5,7 18,13.5 11.5,7"></polygon>';
  return '<svg class="gr-contoh" width="36" height="14" viewBox="0 0 36 14" aria-hidden="true" focusable="false">' + garis + '<g class="' + kelas + '">' + bentuk + '</g></svg>';
}


const bsSt = { d: null };
const ktSt = { q: '', mapel: '', kategori: '', status: '', data: null };
const KT_KATEGORI = ['Try Out Utama', 'Latihan Materi'];
const KT_STATUS = [['', 'Semua status'], ['sedang', 'Sedang berjalan'], ['pernah', 'Pernah dikerjakan'], ['belum', 'Belum dikerjakan']];

function kpiTeks(ikonNama, label, teks, sub) {
  return h`<article class="kartu kpi"><div class="kpi-label"><span class="ikon-bulat">${ikon(ikonNama)}</span>${label}</div><div class="kpi-nilai">${teks}</div>${sub ? h`<div class="kpi-sub">${sub}</div>` : ''}</article>`;
}

function tombolMulaiPaket(x, terkunci, sedang, sudah) {
  return h`<button type="button" class="tombol tombol-penuh jarak-atas-kecil" data-aksi="ujian-mulai" data-id="${x.id}" data-nama="${x.nama}" data-soal="${x.jumlahSoal || ''}" data-menit="${x.durasiMenit}" data-berjalan="${sedang ? '1' : '0'}"${terkunci ? mentah(' aria-disabled="true"') : ''}>${ikon(sedang ? 'play' : (sudah ? 'refresh' : 'play'))}<span>${sedang ? 'Lanjutkan ujian' : (sudah ? 'Kerjakan lagi' : 'Mulai mengerjakan')}</span></button>`;
}

function kartuPaketSiswa(x, sibuk) {
  const sedang = !!x.berjalan;
  const terkunci = !!sibuk && !sedang;
  const sudah = x.selesaiSaya > 0;
  const nilai = x.nilaiTerakhir ? h`<span>${ikon('award', 'ikon-sm')} Nilai terakhir <strong class="angka">${x.nilaiTerakhir.nilaiTeks}</strong></span>`
    : (sudah ? h`<span>${ikon('award', 'ikon-sm')} Nilai tidak ditampilkan</span>` : '');
  return h`<article class="kartu paket-kartu" data-uji="kt-kartu"><h4>${x.nama}</h4>
    <div class="meta"><span class="lencana lencana-primer">${x.kategori}</span>${sedang ? h`<span class="lencana lencana-info">${ikon('clock', 'ikon-sm')} Sedang berjalan</span>` : ''}${!sedang && sudah ? h`<span class="lencana lencana-sukses">${ikon('check', 'ikon-sm')} Pernah dikerjakan</span>` : ''}</div>
    <div class="rincian"><span>${ikon('list', 'ikon-sm')} ${formatAngka(x.jumlahSoal)} soal</span><span>${ikon('clock', 'ikon-sm')} ${formatAngka(x.durasiMenit)} menit</span>${sudah ? h`<span>${ikon('refresh', 'ikon-sm')} ${formatAngka(x.selesaiSaya)}× selesai</span>` : ''}${nilai}</div>
    ${tombolMulaiPaket(x, terkunci, sedang, sudah)}
    ${terkunci ? h`<p class="bantu tanpa-margin">Selesaikan ujian yang sedang berjalan lebih dulu.</p>` : ''}</article>`;
}

function peringatanBerjalan(b) {
  if (!b) return '';
  return h`<div class="peringatan peringatan-waspada jarak-bawah" data-uji="bs-berjalan">${ikon('clock')}<div><p><strong>Ujian sedang berjalan:</strong> ${b.namaPaket}. Sisa waktu sekitar <strong class="angka">${formatAngka(Math.ceil(b.sisaDetik / 60))} menit</strong>.</p>
    <button type="button" class="tombol" data-aksi="ujian-lanjut" data-id="${b.id}">${ikon('play')}<span>Lanjutkan ujian</span></button></div></div>`;
}

function labelTitikGrafik(x) {
  return x.kategori + ' · ' + x.namaPaket + ' · pengerjaan ke-' + x.ke + ' · nilai ' + x.nilaiTeks + ' · ' + tanggalWIB(x.waktu);
}

function legendaMapel(m) {
  const ada = { to: false, lm: false, ulang: false };
  m.seri.forEach(function (x) { ada[grGaya(x.kategori)] = true; if (x.ke > 1) ada.ulang = true; });
  const butir = [];
  if (ada.to) butir.push(h`<li>${mentah(grContoh('to', false, false))}<span>Try Out Utama</span></li>`);
  if (ada.lm) butir.push(h`<li>${mentah(grContoh('lm', false, false))}<span>Latihan Materi</span></li>`);
  if (ada.ulang) butir.push(h`<li>${mentah(grContoh(ada.to ? 'to' : 'lm', true, true))}<span>Berongga: pengerjaan ulang paket yang sama</span></li>`);
  return h`<ul class="gr-legenda" aria-label="Keterangan grafik">${butir}</ul>`;
}

function tabelSeriMapel(m) {
  return h`<details class="gr-tabel" data-uji="bs-tabel"><summary>Lihat data sebagai tabel</summary>
    <div class="bungkus-tabel"><table class="tabel"><caption class="sr-only">Nilai ${m.nama}, dari yang terlama</caption>
      <thead><tr><th scope="col">No</th><th scope="col">Paket</th><th scope="col">Kategori</th><th scope="col">Pengerjaan</th><th scope="col">Nilai</th><th scope="col">Selesai</th></tr></thead>
      <tbody>${m.seri.map(function (x, i) {
        return h`<tr><td data-label="No" class="angka">${i + 1}</td><td data-label="Paket" class="pecah">${x.namaPaket}</td><td data-label="Kategori">${x.kategori}</td><td data-label="Pengerjaan" class="angka">ke-${x.ke}</td><td data-label="Nilai" class="angka"><strong>${x.nilaiTeks}</strong></td><td data-label="Selesai">${waktuWIB(x.waktu)}</td></tr>`;
      })}</tbody></table></div></details>`;
}

function kartuMapel(m) {
  const kode = m.kode;
  let isi;
  if (m.selesai === 0) {
    isi = h`<div class="kosong kosong-kecil" data-uji="bs-kosong"><p>Belum ada pengerjaan ${m.nama}. Grafik perkembangan akan muncul setelah Anda menyelesaikan satu paket.</p>
      <button type="button" class="tombol tombol-garis" data-aksi="katalog-mapel" data-mapel="${kode}">${ikon('package')}<span>Cari paket ${m.nama}</span></button></div>`;
  } else if (!m.seri.length) {
    isi = h`<div class="peringatan peringatan-info" data-uji="bs-tersembunyi">${ikon('info')}<div><p>${formatAngka(m.selesai)} pengerjaan ${m.nama} sudah selesai, tetapi nilainya tidak ditampilkan karena diatur oleh guru.</p></div></div>`;
  } else {
    const t = m.nilaiTerbaru, k = m.nilaiTertinggi;
    isi = h`<dl class="gr-ringkas">
        <div><dt>Nilai terbaru</dt><dd class="angka" data-uji="bs-terbaru">${t.nilaiTeks}</dd></div>
        <div><dt>Nilai tertinggi</dt><dd class="angka" data-uji="bs-tertinggi">${k.nilaiTeks}</dd></div>
        <div><dt>Selesai</dt><dd class="angka">${formatAngka(m.selesai)}</dd></div></dl>
      <div class="grafik-wadah" data-grafik="${kode}" data-uji="bs-grafik"></div>
      ${legendaMapel(m)}
      ${m.tersembunyi > 0 ? h`<p class="bantu tanpa-margin">${formatAngka(m.tersembunyi)} pengerjaan lain tidak menampilkan nilai (diatur guru), jadi tidak ada di grafik.</p>` : ''}
      ${m.seriTerpotong ? h`<p class="bantu tanpa-margin">Grafik memuat pengerjaan terakhir saja; yang lebih lama ada di Riwayat.</p>` : ''}
      ${tabelSeriMapel(m)}`;
  }
  return h`<section class="kartu kartu-mapel" aria-labelledby="bs-${kode}" data-uji="bs-mapel-${kode}">
    <div class="kartu-judul"><span class="ikon-bulat">${ikon(IKON_MAPEL[kode] || 'book-open')}</span><h3 id="bs-${kode}">${m.nama}</h3></div>${isi}</section>`;
}

function kartuSaran(daftar, sibuk) {
  if (!daftar.length) return h`<div class="kosong kosong-kecil" data-uji="bs-saran-kosong"><p>Tidak ada Try Out Utama baru. Semua yang tersedia sudah pernah Anda kerjakan; ulangi dari Try Out &amp; Latihan.</p></div>`;
  return h`<div class="daftar-paket daftar-paket-sempit">${daftar.map(function (x) {
    const terkunci = !!sibuk;
    return h`<article class="kartu paket-kartu" data-uji="bs-saran"><h4>${x.nama}</h4>
      <div class="meta"><span class="lencana lencana-primer">${x.kategori}</span><span class="lencana">${MAPEL[x.mapel] || x.mapel}</span></div>
      <div class="rincian"><span>${ikon('clock', 'ikon-sm')} ${formatAngka(x.durasiMenit)} menit</span></div>
      ${tombolMulaiPaket({ id: x.id, nama: x.nama, jumlahSoal: 0, durasiMenit: x.durasiMenit }, terkunci, false, false)}
      ${terkunci ? h`<p class="bantu tanpa-margin">Selesaikan ujian yang sedang berjalan lebih dulu.</p>` : ''}</article>`;
  })}</div>`;
}

function pengerjaanTerakhir(d) {
  const semuaSeri = [];
  d.mapel.forEach(function (m) { m.seri.forEach(function (x) { semuaSeri.push({ mapel: m.nama, x: x }); }); });
  semuaSeri.sort(function (a, b) { return String(b.x.waktu).localeCompare(String(a.x.waktu)); });
  const lima = semuaSeri.slice(0, 5);
  if (!lima.length) return h`<div class="kosong kosong-kecil"><p>Belum ada pengerjaan dengan nilai yang ditampilkan.</p></div>`;
  return h`<ul class="aktivitas" data-uji="bs-terakhir">${lima.map(function (r) {
    return h`<li><span class="titik-aktv" aria-hidden="true"></span><div class="teks"><div><strong>${r.x.namaPaket}</strong> — nilai <strong class="angka">${r.x.nilaiTeks}</strong></div><div class="meta">${r.mapel} · ke-${r.x.ke} · ${waktuWIB(r.x.waktu)}</div></div></li>`;
  })}</ul>`;
}

function renderBerandaSiswa(p, c) {
  const u = S.pengguna;
  panggil('siswa.dasbor', {}, { ulang: true }).then(function (d) {
    if (!c.ok()) return;
    bsSt.d = d;
    let tertinggi = null, tertinggiMapel = '';
    d.mapel.forEach(function (m) { if (m.nilaiTertinggi && (!tertinggi || m.nilaiTertinggi.nilai > tertinggi.nilai)) { tertinggi = m.nilaiTertinggi; tertinggiMapel = m.nama; } });
    const dilatih = d.mapel.filter(function (m) { return m.selesai > 0; }).length;
    pasang(c.wadah, h`
      ${kepalaHalaman('Halo, ' + u.nama + '!', 'Pantau perkembangan nilai Anda dan lanjutkan berlatih.')}
      ${peringatanBerjalan(d.berjalan)}
      <div class="kisi-kpi kisi-kpi-2">
        ${kpi('check-circle', 'Ujian selesai', d.selesai, d.tersembunyi > 0 ? formatAngka(d.tersembunyi) + ' tanpa nilai tampil' : 'Semua percobaan yang diselesaikan', 'sukses')}
        ${kpi('package', 'Paket tersedia', d.jumlahPaket, 'Try Out dan Latihan untuk Anda')}
        ${kpiTeks('award', 'Nilai tertinggi', tertinggi ? tertinggi.nilaiTeks : '—', tertinggi ? tertinggiMapel + ' · ' + tertinggi.namaPaket : 'Belum ada nilai yang tampil')}
        ${kpiTeks('target', 'Mapel dilatih', formatAngka(dilatih) + ' dari ' + formatAngka(d.mapel.length), 'Matematika, Bahasa Indonesia, IPA')}
      </div>
      <h3 class="judul-bagian">Perkembangan nilai</h3>
      <div class="kisi-mapel">${d.mapel.map(kartuMapel)}</div>
      <div class="dasbor-2 jarak-atas">
        <section aria-labelledby="bs-saran-j"><h3 class="judul-bagian" id="bs-saran-j">Rekomendasi Try Out Utama</h3>${kartuSaran(d.saran, d.berjalan)}</section>
        <section class="kartu" aria-labelledby="bs-akhir-j"><div class="kartu-judul"><span class="ikon-bulat">${ikon('clock')}</span><h3 id="bs-akhir-j">Pengerjaan terakhir</h3></div>${pengerjaanTerakhir(d)}
          <div class="jarak-atas-kecil"><button type="button" class="tombol tombol-garis" data-aksi="nav" data-ke="riwayat">${ikon('clock')}<span>Buka riwayat</span></button></div></section>
      </div>
      <div class="pintasan jarak-atas">
        <button type="button" class="tombol tombol-garis" data-aksi="nav" data-ke="materi">${ikon('book-open')}<span>Materi belajar</span></button>
      </div>`);
    gambarSemuaGrafik();
    fokusJudul();
  }).catch(function (e) { if (c.ok()) tampilkanGalatMuat(c.wadah, e, true); });
}

function gambarGrafik(wadah) {
  if (!wadah || !bsSt.d) return;
  const kode = wadah.getAttribute('data-grafik');
  const m = bsSt.d.mapel.filter(function (x) { return x.kode === kode; })[0];
  if (!m || !m.seri.length) return;
  const lebar = wadah.clientWidth;
  if (!lebar) return;
  const uk = grUkuran(lebar);
  if (wadah.getAttribute('data-lebar') === String(uk.lebar)) return;
  const seri = m.seri.map(function (x) { return { nilai: x.nilai, kategori: x.kategori, ke: x.ke, label: labelTitikGrafik(x) }; });
  const g = hitungGrafik(seri, uk.lebar, uk.tinggi);
  const t = m.nilaiTerbaru, k = m.nilaiTertinggi;
  wadah.innerHTML = svgGrafik(g, {
    id: 'gr-' + kode,
    judul: 'Grafik nilai ' + m.nama,
    deskripsi: formatAngka(m.seri.length) + ' pengerjaan dengan nilai. Nilai terbaru ' + t.nilaiTeks + ', tertinggi ' + k.nilaiTeks + '. Data lengkap ada pada tabel di bawah grafik.'
  });
  wadah.setAttribute('data-lebar', String(uk.lebar));
}
function gambarSemuaGrafik() { semua('[data-grafik]').forEach(gambarGrafik); }
window.addEventListener('resize', tundaKe(gambarSemuaGrafik, 150));

AKSI['katalog-mapel'] = function (b) { navigateTo('katalog', { mapel: b.getAttribute('data-mapel') }); };

function statusPaket(x) { return x.berjalan ? 'sedang' : (x.selesaiSaya > 0 ? 'pernah' : 'belum'); }
function cocokPenyaring(x, f) {
  if (f.mapel && x.mapel !== f.mapel) return false;
  if (f.kategori && x.kategori !== f.kategori) return false;
  if (f.q && String(x.nama).toLowerCase().indexOf(f.q.toLowerCase()) === -1) return false;
  if (f.status === 'sedang') return !!x.berjalan;
  if (f.status === 'pernah') return x.selesaiSaya > 0;
  if (f.status === 'belum') return !x.berjalan && !(x.selesaiSaya > 0);
  return true;
}

function renderKatalog(p, c) {
  ktSt.q = ''; ktSt.kategori = ''; ktSt.status = '';
  ktSt.mapel = mapelKatalog(p);
  const kode = ktSt.mapel;
  panggil('ujian.katalog', {}, { ulang: true }).then(function (d) {
    if (!c.ok()) return;
    ktSt.data = d;
    pasang(c.wadah, h`
      ${kepalaHalaman('Latihan soal ' + NAMA_MENU_MAPEL[kode], 'Try Out dan latihan ' + MAPEL[kode] + ' yang tersedia untuk Anda. Waktu dihitung oleh server setelah Anda menekan Mulai.')}
      ${peringatanBerjalan(d.berjalan)}
      <div class="saring" role="search">
        <div class="cari"><label class="sr-only" for="kt-cari">Cari paket</label>${ikon('search')}<input class="kontrol" id="kt-cari" type="search" placeholder="Cari nama paket" value="" data-masuk="katalog-saring" autocomplete="off"></div>
        <div class="isian"><label class="sr-only" for="kt-kategori">Kategori</label><select class="kontrol" id="kt-kategori" data-masuk="katalog-saring"><option value="">Semua kategori</option>${KT_KATEGORI.map(function (k) { return h`<option value="${k}">${k}</option>`; })}</select></div>
        <div class="isian"><label class="sr-only" for="kt-status">Status pengerjaan</label><select class="kontrol" id="kt-status" data-masuk="katalog-saring">${KT_STATUS.map(function (k) { return h`<option value="${k[0]}">${k[1]}</option>`; })}</select></div>
      </div>
      <p class="bantu jarak-bawah" id="kt-hitung" aria-live="polite" data-uji="kt-hitung"></p>
      <div id="kt-daftar" data-uji="kt-daftar"></div>`);
    gambarKatalog();
    fokusJudul();
  }).catch(function (e) { if (c.ok()) tampilkanGalatMuat(c.wadah, e, true); });
}

function gambarKatalog() {
  const wadah = el('#kt-daftar');
  if (!wadah || !ktSt.data) return;
  const d = ktSt.data;
  const kode = ktSt.mapel;
  const milik = d.paket.filter(function (x) { return x.mapel === kode; });
  const cocok = milik.filter(function (x) { return cocokPenyaring(x, ktSt); });
  const hitung = el('#kt-hitung');
  if (hitung) hitung.textContent = milik.length ? 'Menampilkan ' + formatAngka(cocok.length) + ' dari ' + formatAngka(milik.length) + ' paket.' : '';
  if (!milik.length) {
    pasang(wadah, h`<div class="kartu kosong" data-uji="kt-belum-ada"><span class="ikon-bulat netral">${ikon(IKON_MAPEL[kode])}</span><h3>Belum ada paket ${MAPEL[kode]}</h3><p>Belum ada paket ${MAPEL[kode]} yang diterbitkan untuk Anda. Paket baru akan muncul di sini.</p></div>`);
    return;
  }
  if (!cocok.length) {
    pasang(wadah, h`<div class="kartu kosong" data-uji="kt-kosong"><span class="ikon-bulat netral">${ikon('search')}</span><h3>Tidak ada paket yang cocok</h3><p>Ubah kata kunci atau penyaring.</p><button type="button" class="tombol tombol-garis" data-aksi="katalog-atur-ulang">${ikon('refresh')}<span>Atur ulang penyaring</span></button></div>`);
    return;
  }
  pasang(wadah, h`<section aria-label="Paket ${MAPEL[kode]}" data-uji="kt-mapel-${kode}">
    ${KT_KATEGORI.map(function (kat) {
      const isi = cocok.filter(function (x) { return x.kategori === kat; });
      if (!isi.length) return '';
      return h`<h3 class="sub-judul">${kat} <span class="teks-redam">(${formatAngka(isi.length)})</span></h3><div class="daftar-paket">${isi.map(function (x) { return kartuPaketSiswa(x, d.berjalan); })}</div>`;
    })}</section>`);
}

MASUKAN['katalog-saring'] = tundaKe(function () {
  const a = el('#kt-cari'), k = el('#kt-kategori'), s = el('#kt-status');
  if (!a || !k || !s) return;
  ktSt.q = a.value.trim(); ktSt.kategori = k.value; ktSt.status = s.value;
  gambarKatalog();
}, 150);
AKSI['katalog-atur-ulang'] = function () {
  ktSt.q = ''; ktSt.kategori = ''; ktSt.status = '';
  ['#kt-cari', '#kt-kategori', '#kt-status'].forEach(function (s) { const e = el(s); if (e) e.value = ''; });
  gambarKatalog();
};


const msSt = { q: '', mapel: '', kategori: '', jenis: '', data: null, seq: 0 };
const MS_KATEGORI = ['Try Out Utama', 'Latihan Materi'];

function renderMateriSiswa(p, c) {
  msSt.q = ''; msSt.kategori = ''; msSt.jenis = ''; msSt.data = null;
  msSt.mapel = p && MAPEL[p.mapel] ? p.mapel : '';
  pasang(c.wadah, h`
    ${kepalaHalaman('Materi', 'Bahan belajar dari guru: berkas PDF untuk diunduh dan tautan video.')}
    <div class="saring saring-4" role="search">
      <div class="cari"><label class="sr-only" for="ms-cari">Cari materi</label>${ikon('search')}<input class="kontrol" id="ms-cari" type="search" placeholder="Cari judul materi" value="" data-masuk="materi-siswa-saring" autocomplete="off"></div>
      <div class="isian"><label class="sr-only" for="ms-mapel">Mata pelajaran</label><select class="kontrol" id="ms-mapel" data-masuk="materi-siswa-saring"><option value="">Semua mapel</option>${MAPEL_URUT.map(function (k) { return h`<option value="${k}"${msSt.mapel === k ? mentah(' selected') : ''}>${MAPEL[k]}</option>`; })}</select></div>
      <div class="isian"><label class="sr-only" for="ms-kategori">Kategori</label><select class="kontrol" id="ms-kategori" data-masuk="materi-siswa-saring"><option value="">Semua kategori</option>${MS_KATEGORI.map(function (k) { return h`<option value="${k}">${k}</option>`; })}</select></div>
      <div class="isian"><label class="sr-only" for="ms-jenis">Jenis</label><select class="kontrol" id="ms-jenis" data-masuk="materi-siswa-saring"><option value="">Semua jenis</option><option value="PDF">PDF</option><option value="Video">Video</option></select></div>
    </div>
    <p class="bantu jarak-bawah" id="ms-hitung" aria-live="polite" data-uji="ms-hitung"></p>
    <div id="ms-daftar" data-uji="ms-daftar"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat materi…</span></div></div>`);
  fokusJudul();
  muatMateriSiswa(c.ok);
}

function muatMateriSiswa(ok) {
  const seq = ++msSt.seq;
  return panggil('materi.katalog', { q: msSt.q, mapel: msSt.mapel, kategori: msSt.kategori, jenis: msSt.jenis }, { ulang: true }).then(function (d) {
    if (seq !== msSt.seq || (ok && !ok())) return;
    msSt.data = d;
    gambarMateriSiswa();
  }).catch(function (e) {
    if (seq !== msSt.seq || (ok && !ok())) return;
    tampilkanGalatMuat(el('#ms-daftar'), e, true);
  });
}
MASUKAN['materi-siswa-saring'] = tundaKe(function () {
  const a = el('#ms-cari'), b = el('#ms-mapel'), k = el('#ms-kategori'), j = el('#ms-jenis');
  if (!a || !b || !k || !j) return;
  msSt.q = a.value.trim(); msSt.mapel = b.value; msSt.kategori = k.value; msSt.jenis = j.value;
  muatMateriSiswa();
}, 300);
AKSI['materi-siswa-atur-ulang'] = function () {
  msSt.q = ''; msSt.mapel = ''; msSt.kategori = ''; msSt.jenis = '';
  ['#ms-cari', '#ms-mapel', '#ms-kategori', '#ms-jenis'].forEach(function (s) { const e = el(s); if (e) e.value = ''; });
  muatMateriSiswa();
};

function kartuMateriSiswa(m) {
  const video = m.jenis === 'Video';
  const rincian = video ? 'Situs: ' + (m.host || 'tautan') : 'Ukuran berkas: ' + gbUkuranTeks(m.ukuran || 0);
  return h`<article class="kartu materi-kartu" data-ms-kartu data-uji="ms-kartu">
    <div class="materi-kepala"><span class="ikon-bulat">${ikon(video ? 'play' : 'file-text')}</span><div class="materi-judul"><h4>${m.judul}</h4>
      <div class="meta"><span class="lencana lencana-primer">${m.kategori}</span><span class="lencana">${m.jenis}</span></div>
      <p class="bantu tanpa-margin pecah">${rincian}</p></div></div>
    ${video
      ? h`<button type="button" class="tombol tombol-penuh" data-aksi="materi-siswa-buka" data-id="${m.id}" data-uji="ms-buka">${ikon('external-link')}<span>Buka video</span></button>`
      : h`<button type="button" class="tombol tombol-penuh" data-aksi="materi-siswa-unduh" data-id="${m.id}" data-uji="ms-unduh">${ikon('download')}<span>Unduh PDF</span></button>`}
    <div class="pb-status" role="status" aria-live="polite" data-ms-status></div></article>`;
}

function gambarMateriSiswa() {
  const wadah = el('#ms-daftar');
  const d = msSt.data;
  if (!wadah || !d) return;
  const hitung = el('#ms-hitung');
  const disaring = !!(msSt.q || msSt.mapel || msSt.kategori || msSt.jenis);
  if (hitung) hitung.textContent = d.materi.length ? 'Menampilkan ' + formatAngka(d.materi.length) + (d.terpotong ? ' dari ' + formatAngka(d.total) : '') + ' materi.' : '';
  if (!d.materi.length) {
    pasang(wadah, disaring
      ? h`<div class="kartu kosong" data-uji="ms-kosong"><span class="ikon-bulat netral">${ikon('search')}</span><h3>Tidak ada materi yang cocok</h3><p>Ubah kata kunci atau penyaring.</p><button type="button" class="tombol tombol-garis" data-aksi="materi-siswa-atur-ulang">${ikon('refresh')}<span>Atur ulang penyaring</span></button></div>`
      : h`<div class="kartu kosong" data-uji="ms-kosong"><span class="ikon-bulat netral">${ikon('book-open')}</span><h3>Belum ada materi</h3><p>Materi dari guru akan muncul di sini setelah diterbitkan.</p></div>`);
    return;
  }
  const bagian = MAPEL_URUT.map(function (k) {
    const isi = d.materi.filter(function (m) { return m.mapel === k; });
    if (!isi.length) return '';
    return h`<section aria-labelledby="ms-mp-${k}" data-uji="ms-mapel-${k}"><div class="mapel-judul"><span class="ikon-bulat">${ikon(IKON_MAPEL[k])}</span><h3 id="ms-mp-${k}">${MAPEL[k]}</h3></div>
      <div class="daftar-paket">${isi.map(kartuMateriSiswa)}</div></section>`;
  });
  pasang(wadah, h`${bagian}${d.terpotong ? h`<div class="peringatan peringatan-info jarak-atas" data-uji="ms-terpotong">${ikon('info')}<div><p>Hanya sebagian materi yang ditampilkan. Persempit dengan kata kunci atau penyaring untuk melihat yang lain.</p></div></div>` : ''}`);
}

function statusKartuMateri(b) {
  const kartu = b.closest ? b.closest('[data-ms-kartu]') : null;
  return kartu ? el('[data-ms-status]', kartu) : null;
}

AKSI['materi-siswa-unduh'] = function (b) {
  const st = statusKartuMateri(b);
  if (st) pasang(st, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Menyiapkan berkas…</p>`);
  kerjakan(b, function () { return panggil('materi.unduh', { id: b.getAttribute('data-id') }); }).then(function (d) {
    if (!d) return;
    pbLaporUnduh(st, d);
  }).catch(function (e) { pbLaporGalat(st, e); });
};

AKSI['materi-siswa-buka'] = function (b) {
  const st = statusKartuMateri(b);
  if (st) pasang(st, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Menyiapkan tautan…</p>`);
  kerjakan(b, function () { return panggil('materi.buka', { id: b.getAttribute('data-id') }); }).then(function (d) {
    if (!d || !st) return;
    const url = urlHttps(d.tautan);
    if (!url) { pbLaporGalat(st, { message: 'Tautan materi ini tidak dapat dibuka. Hubungi guru.' }); return; }
    pasang(st, h`<div class="peringatan peringatan-sukses" data-uji="ms-tautan-siap">${ikon('check-circle')}<div>
      <p>Tautan siap (${d.host}). Video dibuka di tab baru, di situs penyedia video.</p>
      <p><a class="tombol" href="#" data-ms-tautan target="_blank" rel="noopener noreferrer">${ikon('external-link')}<span>Buka di tab baru</span></a></p></div></div>`);
    const a = el('a[data-ms-tautan]', st);
    if (a) a.setAttribute('href', url);
  }).catch(function (e) { pbLaporGalat(st, e); });
};


const akunSt = { q: '', peran: '', status: '', data: [], total: 0, seq: 0, asli: null };

function lencanaPeran(peran) {
  const k = peran === PERAN.ADMIN ? 'lencana-bahaya' : (peran === PERAN.GURU ? 'lencana-info' : 'lencana-primer');
  return h`<span class="lencana ${k}">${LABEL_PERAN[peran] || peran}</span>`;
}

function renderAkun(p, c) {
  pasang(c.wadah, h`
    ${kepalaHalaman('Kelola akun', 'Buat, ubah, dan atur akses akun siswa, guru, dan admin.', h`<button type="button" class="tombol tombol-garis" data-aksi="akun-impor" data-uji="akun-impor">${ikon('upload')}<span>Impor siswa dari Excel</span></button><button type="button" class="tombol" data-aksi="akun-baru">${ikon('user-plus')}<span>Tambah akun</span></button>`)}
    <div class="peringatan jarak-bawah">${ikon('lock')}<div>
      <p><strong>Username terlihat di sini, password tidak.</strong> Password disimpan sebagai hash satu arah, jadi tidak ada yang bisa melihatnya, termasuk admin.</p>
      <p>Bila siswa lupa password, pakai <strong>Reset password</strong>: sistem membuat password sementara yang tampil sekali, lalu siswa wajib menggantinya saat masuk.</p></div></div>
    <div class="saring" role="search">
      <div class="cari"><label class="sr-only" for="akun-cari">Cari akun</label>${ikon('search')}<input class="kontrol" id="akun-cari" type="search" placeholder="Cari username, nama, sekolah, atau kelas" value="${akunSt.q}" data-masuk="akun-saring" autocomplete="off"></div>
      <div class="isian"><label class="sr-only" for="akun-peran">Peran</label><select class="kontrol" id="akun-peran" data-masuk="akun-saring"><option value="">Semua peran</option>${['SISWA', 'GURU', 'ADMIN'].map(function (r) { return h`<option value="${r}"${akunSt.peran === r ? mentah(' selected') : ''}>${LABEL_PERAN[r]}</option>`; })}</select></div>
      <div class="isian"><label class="sr-only" for="akun-status">Status</label><select class="kontrol" id="akun-status" data-masuk="akun-saring"><option value="">Semua status</option><option value="aktif"${akunSt.status === 'aktif' ? mentah(' selected') : ''}>Aktif</option><option value="nonaktif"${akunSt.status === 'nonaktif' ? mentah(' selected') : ''}>Nonaktif</option></select></div>
    </div>
    <p class="bantu jarak-bawah" id="akun-hitung" aria-live="polite"></p>
    <div id="akun-daftar"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat akun…</span></div></div>`);
  fokusJudul();
  muatAkun(c.ok);
}

function muatAkun(ok) {
  const seq = ++akunSt.seq;
  return panggil('akun.daftar', { q: akunSt.q, peran: akunSt.peran, status: akunSt.status }, { ulang: true }).then(function (d) {
    if (seq !== akunSt.seq || (ok && !ok())) return;
    akunSt.data = d.daftar; akunSt.total = d.total;
    gambarAkun();
  }).catch(function (e) {
    if (seq !== akunSt.seq || (ok && !ok())) return;
    tampilkanGalatMuat(el('#akun-daftar'), e, true);
  });
}

MASUKAN['akun-saring'] = tundaKe(function () {
  const q = el('#akun-cari'), pr = el('#akun-peran'), st = el('#akun-status');
  if (!q || !pr || !st) return;
  akunSt.q = q.value.trim(); akunSt.peran = pr.value; akunSt.status = st.value;
  muatAkun();
}, 300);

function gambarAkun() {
  const wadah = el('#akun-daftar');
  if (!wadah) return;
  const hit = el('#akun-hitung');
  if (hit) hit.textContent = 'Menampilkan ' + formatAngka(akunSt.data.length) + ' dari ' + formatAngka(akunSt.total) + ' akun.';
  if (!akunSt.data.length) {
    pasang(wadah, h`<div class="bungkus-tabel"><div class="tabel-kosong">${akunSt.q || akunSt.peran || akunSt.status ? 'Tidak ada akun yang cocok dengan penyaring.' : 'Belum ada akun.'}</div></div>`);
    return;
  }
  const saya = S.pengguna.id;
  pasang(wadah, h`<div class="bungkus-tabel"><table class="tabel"><caption class="sr-only">Daftar akun</caption>
    <thead><tr><th scope="col">Username</th><th scope="col">Nama</th><th scope="col">Peran dan status</th><th scope="col">Login terakhir</th><th scope="col"><span class="sr-only">Aksi</span></th></tr></thead>
    <tbody>${akunSt.data.map(function (a) {
      const diri = a.id === saya;
      const sekolah = a.profil ? [a.profil.sekolah, a.profil.kelas].filter(Boolean).join(' · ') : '';
      return h`<tr class="${a.aktif ? '' : 'nonaktif'}">
        <td data-label="Username"><span class="sel-username"><code>${a.username}</code><button type="button" class="tombol tombol-polos tombol-ikon" data-aksi="salin-teks" data-salin="${a.username}" data-pesan="Username disalin." aria-label="Salin username ${a.username}">${ikon('copy')}</button></span></td>
        <td data-label="Nama" class="pecah"><div>${a.nama}${diri ? h` <span class="lencana lencana-netral">Anda</span>` : ''}</div>${sekolah ? h`<div class="sub-sel">${sekolah}</div>` : ''}</td>
        <td data-label="Peran dan status"><div class="chip-status">
          ${lencanaPeran(a.peran)}
          <span class="lencana ${a.aktif ? 'lencana-sukses' : 'lencana-bahaya'}">${a.aktif ? 'Aktif' : 'Nonaktif'}</span>
          ${a.peran === PERAN.SISWA && !a.identitasLengkap ? h`<span class="lencana lencana-peringatan">Identitas belum lengkap</span>` : ''}
          ${a.peran === PERAN.SISWA && a.sembunyiNama ? h`<span class="lencana lencana-info">Nama disembunyikan</span>` : ''}
          ${a.wajibGanti ? h`<span class="lencana lencana-info">Wajib ganti password</span>` : ''}</div></td>
        <td data-label="Login terakhir">${a.loginTerakhir ? waktuWIB(a.loginTerakhir) : 'Belum pernah'}</td>
        <td class="sel-aksi"><div class="aksi-sel">
          <button type="button" class="tombol tombol-diam tombol-adaptif" data-aksi="akun-detail" data-id="${a.id}" title="Detail akun">${ikon('edit')}<span class="teks-aksi">Detail ${a.username}</span></button>
          <button type="button" class="tombol tombol-diam tombol-adaptif" data-aksi="akun-reset" data-id="${a.id}" title="Reset password"${diri ? mentah(' aria-disabled="true"') : ''}>${ikon('key')}<span class="teks-aksi">Reset password ${a.username}</span></button>
          <button type="button" class="tombol ${a.aktif ? 'tombol-bahaya-garis' : 'tombol-garis'} tombol-adaptif" data-aksi="akun-aktif" data-id="${a.id}" data-ke="${a.aktif ? '0' : '1'}" title="${a.aktif ? 'Nonaktifkan' : 'Aktifkan'}"${diri ? mentah(' aria-disabled="true"') : ''}>${ikon(a.aktif ? 'slash' : 'user-check')}<span class="teks-aksi">${a.aktif ? 'Nonaktifkan' : 'Aktifkan'} ${a.username}</span></button>
        </div></td></tr>`;
    })}</tbody></table></div>`);
}

AKSI['akun-impor'] = function () { navigateTo('impor-siswa'); };

AKSI['salin-teks'] = function (b) {
  salin(b.getAttribute('data-salin') || '').then(function (ok) {
    toast(ok ? (b.getAttribute('data-pesan') || 'Disalin.') : 'Tidak bisa menyalin otomatis. Pilih teksnya lalu tekan Ctrl+C.', ok ? 'sukses' : 'galat');
  });
};

function tampilkanKredensial(o) {
  const teks = 'Username: ' + o.username + '\nPassword sementara: ' + o.password;
  return modal({
    judul: o.judul, tahan: true,
    badan: h`<p class="tanpa-margin">${o.pesan}</p>
      <div class="kredensial" role="group" aria-label="Kredensial sementara">
        <div class="baris-kred"><span class="kunci">Username</span><span class="nilai">${o.username}</span></div>
        <div class="baris-kred"><span class="kunci">Password</span><span class="nilai">${o.password}</span></div>
        <button type="button" class="tombol tombol-diam" data-aksi="salin-teks" data-salin="${teks}" data-pesan="Username dan password disalin.">${ikon('copy')}<span>Salin keduanya</span></button>
      </div>
      <div class="peringatan peringatan-waspada">${ikon('alert-triangle')}<div><p><strong>Password ini hanya tampil sekali.</strong> Setelah jendela ini ditutup, password tidak bisa dilihat lagi. Berikan ke pemilik akun lewat jalur yang aman; pemilik wajib menggantinya saat masuk.</p></div></div>`,
    aksi: [{ id: 'ok', label: 'Saya sudah menyalin', gaya: 'utama' }]
  });
}

AKSI['akun-baru'] = function () {
  panggil('sekolah.daftar', {}).then(function (daftar) { return daftar || []; }, function () { return []; }).then(function (sekolah) {
    modal({
      judul: 'Tambah akun', lebar: true,
      badan: h`<form id="f-akun-baru" data-kirim="akun-baru" novalidate>
        <div data-galat aria-live="polite"></div>
        <fieldset class="isian fieldset-polos"><legend class="label">Peran</legend>
          <div class="segmen" role="radiogroup" aria-label="Peran">
            ${['SISWA', 'GURU', 'ADMIN'].map(function (r) { return h`<label>${ikon('check')}<input type="radio" name="peran" value="${r}" data-masuk="akun-peran"${r === 'SISWA' ? mentah(' checked') : ''}> ${LABEL_PERAN[r]}</label>`; })}
          </div></fieldset>
        <div class="kelompok-isian">
          <div class="isian"><label for="ab-username">Username</label><input class="kontrol" id="ab-username" name="username" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="30" required aria-describedby="ab-username-b"><p class="bantu" id="ab-username-b">3–30 karakter: huruf kecil, angka, titik, garis bawah, atau strip.</p></div>
          <div class="isian"><label for="ab-nama" id="ab-nama-l">Nama <span class="opsional">(opsional; siswa mengisi sendiri)</span></label><input class="kontrol" id="ab-nama" name="nama" type="text" autocomplete="off" maxlength="100"></div>
        </div>
        <div class="kelompok-isian" data-bagian-siswa>
          <div class="isian"><label for="ab-sekolah">Asal sekolah <span class="opsional">(opsional)</span></label><input class="kontrol" id="ab-sekolah" name="sekolah" type="text" list="dl-ab-sekolah" maxlength="100" autocomplete="off"><datalist id="dl-ab-sekolah">${sekolah.map(function (s) { return h`<option value="${s.nama}"></option>`; })}</datalist></div>
          <div class="isian"><label for="ab-kelas">Kelas <span class="opsional">(opsional)</span></label><input class="kontrol" id="ab-kelas" name="kelas" type="text" maxlength="20" autocomplete="off" placeholder="Contoh: 6A"></div>
        </div>
        <p class="bantu catatan-papan" data-bagian-siswa data-uji="ab-catatan-papan">Dengan membuat akun siswa (member), nama lengkap dan asal sekolahnya akan tampil di papan peringkat beranda setelah ia menyelesaikan Try Out Utama. Pastikan orang tua atau wali sudah mengetahuinya. Nama bisa disembunyikan kapan saja dengan tombol &quot;Sembunyikan nama&quot; pada rincian akun.</p>
        <p class="bantu">Sistem membuat password sementara yang tampil sekali setelah akun dibuat. Pemilik wajib menggantinya saat pertama masuk.</p>
      </form>`,
      aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'simpan', label: 'Buat akun', gaya: 'utama', tipe: 'submit', form: 'f-akun-baru' }]
    });
  });
};
MASUKAN['akun-peran'] = function (r) {
  const form = r.form; if (!form || !r.checked) return;
  const siswa = r.value === 'SISWA';
  semua('[data-bagian-siswa]', form).forEach(function (b) { b.hidden = !siswa; });
  const l = el('#ab-nama-l', form);
  if (l) pasang(l, siswa ? h`Nama <span class="opsional">(opsional; siswa mengisi sendiri)</span>` : h`Nama lengkap`);
};
KIRIM['akun-baru'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const salahU = validasiUsernameKlien(v.username);
  if (salahU) { galatIsian(form, 'username', salahU); return; }
  if (v.peran !== 'SISWA' && v.nama.length < 3) { galatIsian(form, 'nama', 'Nama minimal 3 karakter.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('akun.buat', { peran: v.peran, username: v.username, nama: v.nama, sekolah: v.peran === 'SISWA' ? v.sekolah : '', kelas: v.peran === 'SISWA' ? v.kelas : '' }).then(function (d) {
      const api = modalTeratas(); if (api) api.tutup('dibuat');
      tampilkanKredensial({ judul: 'Akun dibuat', username: d.akun.username, password: d.passwordSementara, pesan: 'Akun ' + LABEL_PERAN[d.akun.peran] + ' berhasil dibuat.' })
        .selesai.then(function () { if (S.halaman === 'akun') muatAkun(); });
    });
  }).catch(function (e) {
    if (e.kode === 'DUPLIKAT') galatIsian(form, 'username', e.message);
    else if (e.kode === 'VALIDASI') galatForm(form, e.message);
    else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};

AKSI['akun-reset'] = function (b) {
  const id = b.getAttribute('data-id');
  const a = akunSt.data.filter(function (x) { return x.id === id; })[0];
  const nama = a ? a.username : 'akun ini';
  konfirmasi({
    judul: 'Reset password?', ya: 'Reset password',
    badan: h`<p class="tanpa-margin">Password lama <strong>${nama}</strong> tidak berlaku lagi dan semua sesi masuknya dikeluarkan. Sistem membuat password sementara yang tampil <strong>sekali</strong>; pemilik wajib menggantinya saat masuk.</p>`
  }).then(function (ya) {
    if (!ya) return;
    panggil('akun.resetPassword', { id: id }).then(function (d) {
      tampilkanKredensial({ judul: 'Password direset', username: d.username, password: d.passwordSementara, pesan: 'Password sementara untuk ' + d.username + ' sudah dibuat.' });
    }).catch(gagalUmum);
  });
};
AKSI['akun-aktif'] = function (b) {
  const id = b.getAttribute('data-id'), aktif = b.getAttribute('data-ke') === '1';
  const a = akunSt.data.filter(function (x) { return x.id === id; })[0];
  const jalan = function () {
    return panggil('akun.setAktif', { id: id, aktif: aktif }).then(function () {
      toast('Akun ' + (a ? a.username : '') + (aktif ? ' diaktifkan.' : ' dinonaktifkan.'), 'sukses');
      muatAkun();
    }).catch(gagalUmum);
  };
  if (aktif) { jalan(); return; }
  konfirmasi({
    judul: 'Nonaktifkan akun?', ya: 'Nonaktifkan', bahaya: true,
    badan: h`<p class="tanpa-margin">Akun <strong>${a ? a.username : ''}</strong> tidak bisa masuk dan semua sesinya dikeluarkan. Data dan riwayatnya tetap tersimpan, dan akun bisa diaktifkan lagi kapan saja.</p>`
  }).then(function (ya) { if (ya) jalan(); });
};

AKSI['akun-detail'] = function (b) {
  const id = b.getAttribute('data-id');
  const api = modal({ judul: 'Detail akun', lebar: true, badan: h`<div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat…</span></div>` });
  Promise.all([panggil('akun.ambil', { id: id }), panggil('sekolah.daftar', {}).catch(function () { return []; })]).then(function (hasil) {
    const a = hasil[0], sekolah = hasil[1] || [];
    akunSt.asli = a;
    api.ganti(badanDetailAkun(a, sekolah));
  }).catch(function (e) { api.tutup(null); gagalUmum(e); });
};

function badanDetailAkun(a, sekolah) {
  const siswa = a.peran === PERAN.SISWA;
  const diri = a.id === S.pengguna.id;
  const pr = a.profil || {};
  return h`
    <div class="baris-bungkus">${lencanaPeran(a.peran)}<span class="lencana ${a.aktif ? 'lencana-sukses' : 'lencana-bahaya'}">${a.aktif ? 'Aktif' : 'Nonaktif'}</span>
      ${siswa ? h`<span class="lencana ${a.identitasLengkap ? 'lencana-sukses' : 'lencana-peringatan'}">${a.identitasLengkap ? 'Identitas lengkap' : 'Identitas belum lengkap'}</span>` : ''}
      ${a.wajibGanti ? h`<span class="lencana lencana-info">Wajib ganti password</span>` : ''}
      <span class="teks-redam kecil">Dibuat ${tanggalWIB(a.dibuat)} · Login terakhir ${a.loginTerakhir ? waktuWIB(a.loginTerakhir) : 'belum pernah'}</span></div>
    <form id="f-akun-ubah" data-kirim="akun-ubah" data-id="${a.id}" novalidate>
      <div data-galat aria-live="polite"></div>
      <div class="kelompok-isian">
        <div class="isian"><label for="ad-username">Username</label><input class="kontrol" id="ad-username" name="username" type="text" value="${a.username}" maxlength="30" autocomplete="off" autocapitalize="none" spellcheck="false" required></div>
        ${siswa
          ? h`<div class="isian"><label for="ad-nama">Nama lengkap</label><input class="kontrol" id="ad-nama" name="nama_lengkap" type="text" value="${pr.namaLengkap || ''}" maxlength="100" autocomplete="off" placeholder="Belum diisi siswa"></div>`
          : h`<div class="isian"><label for="ad-nama">Nama</label><input class="kontrol" id="ad-nama" name="nama" type="text" value="${a.nama}" maxlength="100" autocomplete="off" required></div>`}
      </div>
      ${siswa ? h`
        <div class="kelompok-isian">
          <div class="isian"><label for="ad-lahir">Tanggal lahir</label><input class="kontrol" id="ad-lahir" name="tanggal_lahir" type="date" value="${pr.tanggalLahir || ''}" min="${tahunLalu(25)}" max="${hariIniISO()}"><p class="bantu">Hanya terlihat di rincian ini.</p></div>
          <fieldset class="isian fieldset-polos"><legend class="label">Jenis kelamin</legend><div class="segmen" role="radiogroup" aria-label="Jenis kelamin">
            <label>${ikon('check')}<input type="radio" name="jenis_kelamin" value="L"${pr.jenisKelamin === 'L' ? mentah(' checked') : ''}> Laki-laki</label>
            <label>${ikon('check')}<input type="radio" name="jenis_kelamin" value="P"${pr.jenisKelamin === 'P' ? mentah(' checked') : ''}> Perempuan</label></div></fieldset>
        </div>
        <div class="kelompok-isian">
          <div class="isian"><label for="ad-sekolah">Asal sekolah</label><input class="kontrol" id="ad-sekolah" name="sekolah" type="text" list="dl-ad-sekolah" value="${pr.sekolah || ''}" maxlength="100" autocomplete="off"><datalist id="dl-ad-sekolah">${sekolah.map(function (s) { return h`<option value="${s.nama}"></option>`; })}</datalist></div>
          <div class="isian"><label for="ad-kelas">Kelas</label><input class="kontrol" id="ad-kelas" name="kelas" type="text" value="${pr.kelas || ''}" maxlength="20" autocomplete="off" placeholder="Contoh: 6A"></div>
        </div>` : h`
        <div class="kelompok-isian">
          <div class="isian"><label for="ad-peran">Peran</label><select class="kontrol" id="ad-peran" name="peran" data-masuk="akun-peran-detail"${diri ? mentah(' disabled') : ''}>${['GURU', 'ADMIN'].map(function (r) { return h`<option value="${r}"${a.peran === r ? mentah(' selected') : ''}>${LABEL_PERAN[r]}</option>`; })}</select>${diri ? h`<p class="bantu">Peran akun Anda sendiri tidak bisa diubah di sini.</p>` : ''}</div>
          <div class="isian" data-bagian-koreksi${a.peran === PERAN.GURU ? '' : mentah(' hidden')}><span class="label">Izin Koreksi Massal</span><label class="saklar"><input type="checkbox" name="izin_koreksi"${a.izinKoreksi ? mentah(' checked') : ''}><span class="jalur"></span><span>Boleh mengoreksi nilai massal (Tahap 2)</span></label></div>
        </div>`}
      <div class="aksi-form"><button type="button" class="tombol tombol-diam" data-modal="tutup">Tutup</button><button type="submit" class="tombol">${ikon('save')}<span>Simpan perubahan</span></button></div>
    </form>
    ${siswa ? h`<hr><section aria-labelledby="ad-papan" data-uji="ad-papan"><h4 id="ad-papan">Nama di papan peringkat</h4>
      ${a.sembunyiNama
        ? h`<div class="papan-baris"><span class="lencana lencana-peringatan">Nama disembunyikan</span><span class="teks-redam kecil">Di papan peringkat siswa ini tampil sebagai "Nama disembunyikan", tanpa asal sekolah. Nilai dan peringkatnya tetap dihitung.</span><button type="button" class="tombol tombol-garis rata-kanan" data-aksi="akun-tampilkan-nama" data-id="${a.id}">${ikon('eye')}<span>Tampilkan nama</span></button></div>`
        : h`<div class="papan-baris"><span class="lencana lencana-sukses">Nama tampil</span><span class="teks-redam kecil">Nama lengkap dan asal sekolah tampil di papan peringkat bila siswa menyelesaikan Try Out Utama. Sembunyikan bila orang tua atau wali meminta.</span><button type="button" class="tombol tombol-garis rata-kanan" data-aksi="akun-sembunyikan-nama" data-id="${a.id}">${ikon('eye-off')}<span>Sembunyikan nama</span></button></div>`}
    </section>` : ''}
    ${diri ? '' : h`<hr><section class="bahaya-zona" aria-labelledby="ad-bahaya"><h4 id="ad-bahaya">Tindakan lanjutan</h4>
      <div class="baris-bungkus">
        <button type="button" class="tombol tombol-diam" data-aksi="akun-reset" data-id="${a.id}">${ikon('key')}<span>Reset password</span></button>
        <button type="button" class="tombol tombol-bahaya-garis" data-aksi="akun-hapus" data-id="${a.id}">${ikon('trash')}<span>Hapus akun</span></button></div>
      <p class="bantu tanpa-margin">Akun yang sudah pernah dipakai atau punya riwayat tidak bisa dihapus; nonaktifkan saja.</p></section>`}`;
}
MASUKAN['akun-peran-detail'] = function (sel) {
  const form = sel.form; if (!form) return;
  const b = el('[data-bagian-koreksi]', form); if (b) b.hidden = sel.value !== PERAN.GURU;
};

KIRIM['akun-ubah'] = function (form) {
  bersihGalat(form);
  const a = akunSt.asli; if (!a) return;
  const v = nilaiForm(form);
  const salahU = validasiUsernameKlien(v.username);
  if (salahU) { galatIsian(form, 'username', salahU); return; }
  const siswa = a.peran === PERAN.SISWA;
  const p = { id: a.id };
  if (v.username.toLowerCase() !== a.username) p.username = v.username;
  if (siswa) {
    const pr = a.profil || {};
    if (v.nama_lengkap !== (pr.namaLengkap || '')) { if (v.nama_lengkap.length < 3) { galatIsian(form, 'nama_lengkap', 'Nama lengkap minimal 3 karakter.'); return; } p.nama_lengkap = v.nama_lengkap; }
    if (v.tanggal_lahir && v.tanggal_lahir !== (pr.tanggalLahir || '')) p.tanggal_lahir = v.tanggal_lahir;
    if (v.jenis_kelamin && v.jenis_kelamin !== (pr.jenisKelamin || '')) p.jenis_kelamin = v.jenis_kelamin;
    if (v.sekolah !== (pr.sekolah || '')) { if (v.sekolah && v.sekolah.length < 3) { galatIsian(form, 'sekolah', 'Asal sekolah minimal 3 karakter.'); return; } p.sekolah = v.sekolah; }
    if (v.kelas !== (pr.kelas || '')) p.kelas = v.kelas;
  } else {
    if (v.nama !== a.nama) { if (v.nama.length < 3) { galatIsian(form, 'nama', 'Nama minimal 3 karakter.'); return; } p.nama = v.nama; }
    if (v.peran && v.peran !== a.peran) p.peran = v.peran;
    const peranAkhir = p.peran || a.peran;
    if (peranAkhir === PERAN.GURU && !!v.izin_koreksi !== !!a.izinKoreksi) p.izin_koreksi = !!v.izin_koreksi;
  }
  if (Object.keys(p).length === 1) { toast('Tidak ada perubahan untuk disimpan.', 'info'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('akun.ubah', p).then(function () {
      const api = modalTeratas(); if (api) api.tutup('disimpan');
      toast('Akun diperbarui.' + (p.peran ? ' Sesi akun itu dikeluarkan karena perannya berubah.' : ''), 'sukses');
      if (S.halaman === 'akun') muatAkun();
    });
  }).catch(function (e) {
    if (e.kode === 'DUPLIKAT') galatIsian(form, 'username', e.message);
    else if (e.kode === 'VALIDASI' || e.kode === 'ADMIN_TERAKHIR') galatForm(form, e.message);
    else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};

function aturNamaPeringkat(id, sembunyi) {
  return panggil('akun.sembunyikanNama', { id_akun: id, sembunyi: sembunyi }).then(function () {
    const api = modalTeratas(); if (api) api.tutup('disimpan');
    toast(sembunyi ? 'Nama disembunyikan dari papan peringkat.' : 'Nama ditampilkan kembali di papan peringkat.', 'sukses');
    if (S.halaman === 'akun') muatAkun();
  }).catch(gagalUmum);
}
AKSI['akun-sembunyikan-nama'] = function (b) {
  const id = b.getAttribute('data-id');
  konfirmasi({ judul: 'Sembunyikan nama siswa ini?', ya: 'Sembunyikan', pesan: 'Di papan peringkat, nama dan asal sekolahnya diganti "Nama disembunyikan". Nilai dan peringkatnya tetap dihitung.' }).then(function (ya) {
    if (ya) aturNamaPeringkat(id, true);
  });
};
AKSI['akun-tampilkan-nama'] = function (b) {
  const id = b.getAttribute('data-id');
  konfirmasi({ judul: 'Tampilkan nama siswa ini kembali?', ya: 'Tampilkan', pesan: 'Nama lengkap dan asal sekolahnya akan tampil lagi di papan peringkat beranda.' }).then(function (ya) {
    if (ya) aturNamaPeringkat(id, false);
  });
};
AKSI['akun-hapus'] = function (b) {
  const id = b.getAttribute('data-id');
  const a = akunSt.asli;
  konfirmasi({ judul: 'Hapus akun?', ya: 'Hapus permanen', bahaya: true, badan: h`<p class="tanpa-margin">Akun <strong>${a ? a.username : ''}</strong> akan dihapus permanen. Hanya akun tanpa riwayat yang bisa dihapus; bila ada riwayat, sistem menolak dan Anda bisa menonaktifkannya.</p>` }).then(function (ya) {
    if (!ya) return;
    panggil('akun.hapus', { id: id }).then(function () {
      tutupSemuaModal();
      toast('Akun dihapus.', 'sukses');
      if (S.halaman === 'akun') muatAkun();
    }).catch(gagalUmum);
  });
};


const BS = {
  BYTE_MAKS: 5 * 1048576,
  XML_MAKS: 40 * 1048576,
  BARIS_MAKS: 1000,
  KOLOM_MAKS: 60,
  PINDAI_KEPALA: 40,
  PINDAI_BARIS: 20000
};
const BS_NS_REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

const BS_KOLOM = {
  username: 'username namapengguna user userid namauser akun'.split(' '),
  password: 'password katasandi sandi katakunci pass'.split(' '),
  nama: 'namalengkap nama namasiswa namapeserta'.split(' '),
  sekolah: 'sekolah asalsekolah namasekolah'.split(' '),
  kelas: 'kelas rombel'.split(' ')
};
const BS_WAJIB = 'username password nama'.split(' ');
const BS_LABEL_KOLOM = { username: 'Username', password: 'Password', nama: 'Nama Lengkap', sekolah: 'Sekolah', kelas: 'Kelas' };

function bsGalat(pesan) { return galat('BERKAS', pesan); }

function bsNormKepala(teks) {
  let s = String(teks === null || teks === undefined ? '' : teks).replace(/\([^)]*\)/g, ' ');
  if (s.normalize) s = s.normalize('NFKD').replace(/[̀-ͯ]/g, '');
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function bsPetaKepala(sel) {
  const peta = {};
  const dipakai = {};
  const norm = sel.map(bsNormKepala);
  Object.keys(BS_KOLOM).forEach(function (kunci) {
    for (let i = 0; i < norm.length; i++) {
      if (!norm[i] || dipakai[i]) continue;
      if (BS_KOLOM[kunci].indexOf(norm[i]) !== -1) { peta[kunci] = i; dipakai[i] = true; return; }
    }
  });
  return peta;
}

function bsDariGrid(grid, angka, nomorBaris) {
  let terbaik = null;
  const batas = Math.min(grid.length, BS.PINDAI_KEPALA);
  for (let i = 0; i < batas; i++) {
    const peta = bsPetaKepala(grid[i] || []);
    const adaWajib = BS_WAJIB.filter(function (k) { return peta[k] !== undefined; });
    if (adaWajib.length === BS_WAJIB.length) { terbaik = { indeks: i, peta: peta, lengkap: true }; break; }
    if (adaWajib.length > 0 && (!terbaik || adaWajib.length > terbaik.jumlah)) terbaik = { indeks: i, peta: peta, lengkap: false, jumlah: adaWajib.length };
  }
  if (!terbaik) {
    throw bsGalat('Judul kolom tidak ditemukan. Baris judul harus memuat Username, Password, dan Nama Lengkap (Sekolah dan Kelas boleh ada). Pakai template dari tombol "Unduh template Excel" supaya sesuai.');
  }
  if (!terbaik.lengkap) {
    const kurang = BS_WAJIB.filter(function (k) { return terbaik.peta[k] === undefined; }).map(function (k) { return BS_LABEL_KOLOM[k]; });
    throw bsGalat('Kolom wajib tidak ditemukan pada baris judul: ' + kurang.join(', ') + '. Periksa ejaan judul kolom, atau pakai template dari tombol "Unduh template Excel".');
  }
  const peta = terbaik.peta;
  const hasil = [];
  let angkaUsername = 0;
  for (let i = terbaik.indeks + 1; i < grid.length; i++) {
    const sel = grid[i] || [];
    const ambil = function (k) { return peta[k] === undefined ? '' : String(sel[peta[k]] === undefined ? '' : sel[peta[k]]); };
    const b = { n: (nomorBaris ? nomorBaris[i] : i + 1), username: ambil('username'), password: ambil('password'), nama: ambil('nama'), sekolah: ambil('sekolah'), kelas: ambil('kelas') };
    if (!b.username.trim() && !b.password && !b.nama.trim() && !b.sekolah.trim() && !b.kelas.trim()) continue;
    if (angka && angka[i] && peta.username !== undefined && angka[i][peta.username]) angkaUsername++;
    b.username = b.username.trim(); b.nama = b.nama.trim(); b.sekolah = b.sekolah.trim(); b.kelas = b.kelas.trim();
    hasil.push(b);
    if (hasil.length > BS.BARIS_MAKS) throw bsGalat('Berkas berisi lebih dari ' + formatAngka(BS.BARIS_MAKS) + ' baris data. Bagi menjadi beberapa berkas (maksimal ' + formatAngka(BS.BARIS_MAKS) + ' baris per berkas).');
  }
  if (!hasil.length) throw bsGalat('Judul kolom ditemukan, tetapi tidak ada baris data di bawahnya. Isi data siswa mulai dari baris tepat di bawah judul.');
  return { baris: hasil, kolom: Object.keys(peta), angkaUsername: angkaUsername };
}

function bsDekodeTeks(bytes) {
  let u = bytes;
  if (u.length >= 3 && u[0] === 0xEF && u[1] === 0xBB && u[2] === 0xBF) u = u.subarray(3);
  try { return new TextDecoder('utf-8', { fatal: true }).decode(u); } catch (e) {   }
  try { return new TextDecoder('windows-1252').decode(u); } catch (e2) { throw bsGalat('Isi berkas tidak dapat dibaca sebagai teks. Simpan sebagai "CSV UTF-8" lalu coba lagi.'); }
}

function bsPemisah(teks) {
  const hitung = { ',': 0, ';': 0, '\t': 0 };
  let kutip = false, baris = 0;
  for (let i = 0; i < teks.length && baris < 10; i++) {
    const c = teks[i];
    if (c === '"') kutip = !kutip;
    else if (!kutip && c === '\n') baris++;
    else if (!kutip && hitung[c] !== undefined) hitung[c]++;
  }
  return Object.keys(hitung).sort(function (a, b) { return hitung[b] - hitung[a]; })[0];
}

function bsUraiCsv(teks) {
  const sep = bsPemisah(teks);
  const baris = [];
  let sel = '', row = [], kutip = false;
  const tutupSel = function () { row.push(sel); sel = ''; };
  const tutupBaris = function () {
    tutupSel();
    if (row.length > BS.KOLOM_MAKS) row.length = BS.KOLOM_MAKS;
    baris.push(row); row = [];
    if (baris.length > BS.PINDAI_BARIS) throw bsGalat('Berkas terlalu panjang untuk dibaca.');
  };
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (kutip) {
      if (c === '"') { if (teks[i + 1] === '"') { sel += '"'; i++; } else kutip = false; } else sel += c;
    } else if (c === '"' && sel === '') kutip = true;
    else if (c === sep) tutupSel();
    else if (c === '\n') tutupBaris();
    else if (c === '\r') { if (teks[i + 1] === '\n') i++; tutupBaris(); } else sel += c;
  }
  if (sel !== '' || row.length) tutupBaris();
  return baris;
}

function bsBacaCsv(bytes) {
  const grid = bsUraiCsv(bsDekodeTeks(bytes));
  return bsDariGrid(grid, null, null);
}

function bsZipDaftar(bytes) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 22 - 65535); i--) {
    if (v.getUint32(i, true) === 0x06054B50) { eocd = i; break; }
  }
  if (eocd < 0) throw bsGalat('Isi berkas bukan arsip .xlsx yang sah (direktori ZIP tidak ditemukan). Buka di Excel lalu simpan ulang sebagai .xlsx.');
  const jumlah = v.getUint16(eocd + 10, true);
  let p = v.getUint32(eocd + 16, true);
  if (jumlah === 0xFFFF || p === 0xFFFFFFFF) throw bsGalat('Arsip ZIP64 tidak didukung. Simpan ulang berkas sebagai .xlsx biasa.');
  const dec = new TextDecoder('utf-8');
  const peta = {};
  for (let k = 0; k < jumlah; k++) {
    if (p + 46 > bytes.length || v.getUint32(p, true) !== 0x02014B50) throw bsGalat('Struktur ZIP rusak. Buka di Excel lalu simpan ulang sebagai .xlsx.');
    const bendera = v.getUint16(p + 8, true);
    const metode = v.getUint16(p + 10, true);
    const kecil = v.getUint32(p + 20, true);
    const besar = v.getUint32(p + 24, true);
    const nm = v.getUint16(p + 28, true), ex = v.getUint16(p + 30, true), kom = v.getUint16(p + 32, true);
    const lokal = v.getUint32(p + 42, true);
    const nama = dec.decode(bytes.subarray(p + 46, p + 46 + nm));
    if (bendera & 1) throw bsGalat('Berkas ini dilindungi kata sandi. Hapus perlindungannya di Excel lalu simpan ulang.');
    peta[nama] = { metode: metode, kecil: kecil, besar: besar, lokal: lokal };
    p += 46 + nm + ex + kom;
  }
  return peta;
}

async function bsInflate(data, maks) {
  if (typeof DecompressionStream === 'undefined') {
    throw bsGalat('Peramban ini belum bisa membuka berkas .xlsx yang dimampatkan. Simpan berkas Anda sebagai CSV (UTF-8) di Excel, lalu unggah CSV-nya; atau perbarui peramban.');
  }
  const ds = new DecompressionStream('deflate-raw');
  const w = ds.writable.getWriter();
  w.write(data).catch(function () {   });
  w.close().catch(function () {   });
  const r = ds.readable.getReader();
  const bagian = [];
  let total = 0;
  try {
    for (;;) {
      const x = await r.read();
      if (x.done) break;
      total += x.value.length;
      if (total > maks) { try { await r.cancel(); } catch (e) {   } throw bsGalat('Isi berkas terlalu besar setelah dibuka. Berkas ditolak demi keamanan.'); }
      bagian.push(x.value);
    }
  } catch (e) {
    if (e && e.kode === 'BERKAS') throw e;
    throw bsGalat('Isi berkas rusak dan tidak dapat dibuka. Buka di Excel lalu simpan ulang sebagai .xlsx.');
  }
  const out = new Uint8Array(total);
  let q = 0;
  bagian.forEach(function (b) { out.set(b, q); q += b.length; });
  return out;
}

async function bsZipIsi(bytes, peta, nama) {
  const e = peta[nama];
  if (!e) return null;
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (e.lokal + 30 > bytes.length || v.getUint32(e.lokal, true) !== 0x04034B50) throw bsGalat('Struktur ZIP rusak. Buka di Excel lalu simpan ulang sebagai .xlsx.');
  const awal = e.lokal + 30 + v.getUint16(e.lokal + 26, true) + v.getUint16(e.lokal + 28, true);
  if (awal + e.kecil > bytes.length) throw bsGalat('Struktur ZIP rusak. Buka di Excel lalu simpan ulang sebagai .xlsx.');
  if (e.besar > BS.XML_MAKS) throw bsGalat('Isi berkas terlalu besar setelah dibuka. Berkas ditolak demi keamanan.');
  const mentah = bytes.subarray(awal, awal + e.kecil);
  if (e.metode === 0) return mentah;
  if (e.metode === 8) return bsInflate(mentah, BS.XML_MAKS);
  throw bsGalat('Cara kompresi berkas ini tidak didukung. Buka di Excel lalu simpan ulang sebagai .xlsx.');
}

function bsXml(bytes, nama) {
  const doc = new DOMParser().parseFromString(new TextDecoder('utf-8').decode(bytes), 'application/xml');
  if (doc.getElementsByTagName('parsererror').length) throw bsGalat('Bagian "' + nama + '" dalam berkas rusak. Buka di Excel lalu simpan ulang sebagai .xlsx.');
  return doc;
}
const bsTag = function (akar, nama) { return Array.prototype.slice.call(akar.getElementsByTagNameNS('*', nama)); };

function bsTeksRingkas(simpul) {
  let s = '';
  bsTag(simpul, 't').forEach(function (t) {
    let p = t.parentNode;
    while (p && p !== simpul) { if (p.localName === 'rPh') return; p = p.parentNode; }
    s += t.textContent;
  });
  return s;
}

function bsKolomDariRef(ref) {
  const m = /^([A-Za-z]+)/.exec(ref || '');
  if (!m) return -1;
  let n = 0;
  const h = m[1].toUpperCase();
  for (let i = 0; i < h.length; i++) n = n * 26 + (h.charCodeAt(i) - 64);
  return n - 1;
}

function bsAngkaTeks(mentah) {
  const s = String(mentah).trim();
  if (/^-?\d+$/.test(s)) return s;
  if (/[eE]/.test(s)) { const x = Number(s); if (isFinite(x) && Number.isSafeInteger(x)) return String(x); }
  return s;
}

function bsLembarKeGrid(doc, bersama) {
  const grid = [], angka = [], nomor = [];
  const barisXml = bsTag(doc, 'row');
  let urutTerakhir = 0;
  for (let ri = 0; ri < barisXml.length && grid.length < BS.PINDAI_BARIS; ri++) {
    const rowEl = barisXml[ri];
    const nomorBaris = parseInt(rowEl.getAttribute('r'), 10) || (urutTerakhir + 1);
    urutTerakhir = nomorBaris;
    const sel = [], an = [];
    let urutKolom = 0;
    bsTag(rowEl, 'c').forEach(function (c) {
      let kol = bsKolomDariRef(c.getAttribute('r'));
      if (kol < 0) kol = urutKolom;
      urutKolom = kol + 1;
      if (kol >= BS.KOLOM_MAKS) return;
      const tipe = c.getAttribute('t') || '';
      const vEl = bsTag(c, 'v')[0];
      const v = vEl ? vEl.textContent : '';
      let nilai = '', angkaSel = false;
      if (tipe === 's') nilai = bersama[parseInt(v, 10)] !== undefined ? bersama[parseInt(v, 10)] : '';
      else if (tipe === 'inlineStr') { const is = bsTag(c, 'is')[0]; nilai = is ? bsTeksRingkas(is) : ''; }
      else if (tipe === 'str') nilai = v;
      else if (tipe === 'b') nilai = v === '1' ? 'TRUE' : 'FALSE';
      else if (tipe === 'e') nilai = '';
      else if (tipe === 'd') nilai = v;
      else if (v !== '') { nilai = bsAngkaTeks(v); angkaSel = true; }
      while (sel.length < kol) { sel.push(''); an.push(false); }
      sel[kol] = nilai; an[kol] = angkaSel;
    });
    grid.push(sel); angka.push(an); nomor.push(nomorBaris);
  }
  return { grid: grid, angka: angka, nomor: nomor };
}

async function bsBacaXlsx(bytes) {
  if (!(bytes[0] === 0x50 && bytes[1] === 0x4B)) throw bsGalat('Isi berkas ini bukan .xlsx walau namanya demikian. Buka di Excel lalu simpan ulang sebagai .xlsx.');
  const peta = bsZipDaftar(bytes);
  if (!peta['xl/workbook.xml']) throw bsGalat('Berkas ini bukan buku kerja Excel (.xlsx). Buka di Excel lalu simpan ulang sebagai .xlsx.');
  if (peta['xl/vbaProject.bin']) throw bsGalat('Berkas ini berisi makro. Simpan sebagai .xlsx biasa (tanpa makro) lalu coba lagi.');
  const dapat = async function (nama) { const b = await bsZipIsi(bytes, peta, nama); return b ? bsXml(b, nama) : null; };

  const bersama = [];
  const ss = await dapat('xl/sharedStrings.xml');
  if (ss) bsTag(ss, 'si').forEach(function (si) { bersama.push(bsTeksRingkas(si)); });

  const lembar = [];
  const wb = await dapat('xl/workbook.xml');
  const rel = await dapat('xl/_rels/workbook.xml.rels');
  const target = {};
  if (rel) bsTag(rel, 'Relationship').forEach(function (r) { target[r.getAttribute('Id')] = r.getAttribute('Target'); });
  bsTag(wb, 'sheet').forEach(function (s) {
    const id = s.getAttributeNS(BS_NS_REL, 'id') || s.getAttribute('r:id');
    let t = target[id];
    if (!t) return;
    t = t.replace(/^\//, '');
    if (!/^xl\//.test(t)) t = 'xl/' + t;
    lembar.push({ nama: s.getAttribute('name') || '', berkas: t, tersembunyi: (s.getAttribute('state') || '') !== '' && s.getAttribute('state') !== 'visible' });
  });
  if (!lembar.length && peta['xl/worksheets/sheet1.xml']) lembar.push({ nama: 'Sheet1', berkas: 'xl/worksheets/sheet1.xml', tersembunyi: false });
  if (!lembar.length) throw bsGalat('Tidak ada lembar kerja di berkas ini.');

  const urut = lembar.filter(function (l) { return !l.tersembunyi; });
  urut.sort(function (a, b) { return (/data\s*siswa/i.test(b.nama) ? 1 : 0) - (/data\s*siswa/i.test(a.nama) ? 1 : 0); });
  let galatTerakhir = null;
  for (let i = 0; i < urut.length; i++) {
    const doc = await dapat(urut[i].berkas);
    if (!doc) continue;
    const g = bsLembarKeGrid(doc, bersama);
    try {
      const hasil = bsDariGrid(g.grid, g.angka, g.nomor);
      hasil.lembar = urut[i].nama;
      return hasil;
    } catch (e) {
      if (!e || e.kode !== 'BERKAS') throw e;
      if (!galatTerakhir || i === 0) galatTerakhir = e;
    }
  }
  throw galatTerakhir || bsGalat('Tidak ada lembar yang berisi daftar siswa.');
}

async function bsBacaBerkas(file) {
  const nama = (file && file.name) || '';
  if (!file || !file.size) throw bsGalat('Berkas ini kosong.');
  if (file.size > BS.BYTE_MAKS) throw bsGalat('Ukuran berkas ' + gbUkuranTeks(file.size) + ' melebihi batas ' + formatAngka(BS.BYTE_MAKS / 1048576) + ' MB.');
  if (/\.xlsm$/i.test(nama)) throw bsGalat('Berkas .xlsm (berpotensi bermakro) tidak diterima. Simpan sebagai .xlsx biasa.');
  if (/\.xls$/i.test(nama)) throw bsGalat('Format .xls lama belum didukung. Buka di Excel lalu simpan sebagai .xlsx.');
  if (/\.(ods|numbers)$/i.test(nama)) throw bsGalat('Simpan berkas ini sebagai .xlsx (Excel) atau .csv terlebih dulu.');
  const esc = /\.xlsx$/i.test(nama), csv = /\.(csv|txt)$/i.test(nama);
  if (!esc && !csv) throw bsGalat('Hanya berkas .xlsx atau .csv yang dapat diunggah.');
  let bytes;
  try { bytes = new Uint8Array(await file.arrayBuffer()); } catch (e) { throw bsGalat('Berkas tidak bisa dibaca. Coba pilih lagi.'); }
  if (esc) return bsBacaXlsx(bytes);
  if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 3) return bsBacaXlsx(bytes);
  return bsBacaCsv(bytes);
}

const BS_KOLOM_TEMPLATE = [
  { judul: 'Username *', lebar: 22, tipe: 'teks' },
  { judul: 'Password *', lebar: 22, tipe: 'teks' },
  { judul: 'Nama Lengkap *', lebar: 34, tipe: 'teks' },
  { judul: 'Sekolah (opsional)', lebar: 30, tipe: 'teks' },
  { judul: 'Kelas (opsional)', lebar: 16, tipe: 'teks' }
];

function bsBuatTemplate() {
  const data = {
    nama: 'Data Siswa',
    judul: ['Template Impor Siswa', 'Isi satu siswa per baris di bawah judul kolom. Kolom bertanda * wajib diisi. Contoh pengisian ada di lembar "Petunjuk & Contoh".'],
    kolom: BS_KOLOM_TEMPLATE.map(function (k) { return { judul: k.judul, lebar: k.lebar, tipe: 'teks', gayaKolom: 9 }; }),
    baris: [],
    barisKosong: 150,
    arah: 'datar'
  };
  const petunjuk = {
    nama: 'Petunjuk & Contoh',
    judul: ['Petunjuk pengisian', 'Lembar ini hanya petunjuk dan contoh. Aplikasi hanya membaca lembar "Data Siswa".'],
    kolom: [
      { judul: 'Kolom', lebar: 18, tipe: 'teks' }, { judul: 'Wajib?', lebar: 10, tipe: 'teks' }, { judul: 'Cara mengisi', lebar: 58, tipe: 'teks' },
      { judul: 'Contoh 1', lebar: 22, tipe: 'teks' }, { judul: 'Contoh 2', lebar: 22, tipe: 'teks' }, { judul: 'Contoh 3', lebar: 22, tipe: 'teks' }
    ],
    baris: [
      ['Username', 'Ya', '3–30 karakter: huruf kecil, angka, titik, garis bawah, atau strip; harus diawali huruf atau angka. Tanpa spasi. Harus berbeda untuk tiap siswa.', 'budi.santoso', 'siti.aminah', 'rizki2026'],
      ['Password', 'Ya', 'Dibuat oleh Anda. 8–128 karakter, memuat huruf dan angka, bukan sama dengan username, bukan kata yang umum (mis. 12345678). Jangan diawali atau diakhiri spasi.', 'Matahari88', 'Bintang2026', 'KucingLucu7'],
      ['Nama Lengkap', 'Ya', 'Minimal 3 karakter: huruf, spasi, titik, koma, apostrof, atau strip.', 'Budi Santoso', 'Siti Aminah', 'Rizki Pratama'],
      ['Sekolah', 'Tidak', 'Sebaiknya sama persis dengan nama di Pengaturan > Daftar sekolah. Bila beda, tetap disimpan seperti yang tertulis dan diberi tanda peringatan.', 'SDN 1 Contoh', 'SDN 1 Contoh', 'SDN 2 Contoh'],
      ['Kelas', 'Tidak', 'Maksimal 20 karakter, mis. 6A.', '6A', '6A', '6B']
    ],
    catatan: [
      'Penting:',
      '• Password hanya Anda yang tahu dari berkas ini. Di server hanya disimpan dalam bentuk hash (tidak bisa dibaca). Simpan berkas ini di tempat aman dan hapus setelah password dibagikan.',
      '• Username yang sudah dipakai akun lain dilewati dan akunnya tidak diubah. Berkas yang sama boleh diunggah ulang setelah memperbaiki baris yang bermasalah.',
      '• Tanggal lahir dan jenis kelamin diisi siswa sendiri saat pertama masuk. Siswa juga diminta mengganti password bila opsi itu dibiarkan menyala saat impor.',
      '• Maksimal ' + formatAngka(BS.BARIS_MAKS) + ' siswa per berkas. Hindari menyalin dari sel berformat angka: angka nol di depan username bisa hilang.'
    ],
    arah: 'datar'
  };
  return xlsxBuat([data, petunjuk], { judul: 'Template Impor Siswa', penulis: 'Siap TKA SD' });
}


const IS = { KELOMPOK_CEK: 300, KELOMPOK_BUAT: 20, PEKERJA: 3, SABAR: 5, TAMPIL_MAKS: 200 };
const IS_SATU = { sah: 'Siap dibuat', ada: 'Sudah ada, dilewati', galat: 'Bermasalah', dibuat: 'Dibuat', belum: 'Belum diproses', terputus: 'Koneksi terputus' };

const isSt = {
  tahap: 'pilih',
  urut: 0,
  berkas: null,
  baris: [],
  hasil: {},
  wajibGanti: true,
  saring: 'semua',
  memeriksa: null,
  proses: null,
  kendali: { batal: false }
};

function isReset() {
  isSt.kendali.batal = true; isSt.kendali = { batal: false };
  isSt.tahap = 'pilih'; isSt.urut++; isSt.berkas = null; isSt.baris = []; isSt.hasil = {}; isSt.saring = 'semua'; isSt.memeriksa = null; isSt.proses = null;
}
function isDiHalaman() { return S.halaman === 'impor-siswa' && !!el('#is-akar'); }

function isKunci(u) { return String(u || '').replace(/\s+/g, ' ').trim().toLowerCase(); }

function renderImporSiswa(p, c) {
  pasang(c.wadah, h`<div id="is-akar"></div>`);
  isGambar();
  fokusJudul();
}

function isGambar() {
  const akar = el('#is-akar');
  if (!akar) return;
  if (isSt.tahap === 'pilih') pasang(akar, isHtmlPilih());
  else if (isSt.tahap === 'periksa') pasang(akar, isHtmlPeriksa());
  else if (isSt.tahap === 'proses') pasang(akar, isHtmlProses());
  else pasang(akar, isHtmlSelesai());
}

function isHtmlPilih() {
  return h`
    ${kepalaHalaman('Impor Siswa dari Excel', 'Buat banyak akun siswa sekaligus dari satu berkas Excel atau CSV.',
      h`<button type="button" class="tombol tombol-garis" data-aksi="is-template" data-uji="is-template">${ikon('download')}<span>Unduh template Excel</span></button>`)}
    <div id="is-unduh" aria-live="polite"></div>
    <ol class="is-langkah" data-uji="is-langkah">
      <li><span class="nomor" aria-hidden="true">1</span><div><strong>Unduh template</strong><p>Lembar "Data Siswa" siap diisi. Lembar "Petunjuk &amp; Contoh" menjelaskan tiap kolom.</p></div></li>
      <li><span class="nomor" aria-hidden="true">2</span><div><strong>Isi datanya</strong><p>Username, password (Anda yang menentukan), dan nama lengkap wajib. Sekolah dan kelas boleh dikosongkan.</p></div></li>
      <li><span class="nomor" aria-hidden="true">3</span><div><strong>Unggah dan periksa</strong><p>Aplikasi memeriksa semua baris lebih dulu. Belum ada akun yang dibuat sampai Anda menyetujuinya.</p></div></li>
    </ol>
    <div class="peringatan jarak-bawah" data-uji="is-catatan-sandi">${ikon('lock')}<div>
      <p><strong>Password dibuat oleh Anda di berkas ini.</strong> Server hanya menyimpan hash-nya (tidak bisa dibaca siapa pun), tetapi berkas Excel Anda tetap berisi password aslinya. Simpan berkas di tempat aman dan hapus setelah password dibagikan kepada siswa.</p></div></div>
    <form id="f-is" novalidate>
      <div data-galat aria-live="polite"></div>
      <div class="isian"><label for="is-berkas">Pilih berkas (.xlsx atau .csv)</label>
        <input class="kontrol" id="is-berkas" name="berkas" type="file" accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-masuk="is-berkas" aria-describedby="is-berkas-b">
        <p class="bantu" id="is-berkas-b">Maksimal ${formatAngka(BS.BARIS_MAKS)} siswa dan ${formatAngka(BS.BYTE_MAKS / 1048576)} MB per berkas. Berkas dibaca di peramban Anda; yang dikirim ke server hanya baris datanya.</p></div>
      <div id="is-pilihan" aria-live="polite"></div>
    </form>
    <p class="bantu">Berkas dengan makro (.xlsm) atau format lama (.xls) tidak diterima. Dari Google Sheets atau LibreOffice: Unduh/Simpan sebagai .xlsx atau .csv.</p>`;
}

function isHitung() {
  const r = { total: isSt.baris.length, sah: 0, ada: 0, galat: 0, dibuat: 0, belum: 0, terputus: 0, peringatan: 0 };
  isSt.baris.forEach(function (b) {
    const x = isSt.hasil[b.n];
    if (!x) { r.belum++; return; }
    r[x.status] = (r[x.status] || 0) + 1;
    if (x.peringatan && x.peringatan.length && (x.status === 'sah' || x.status === 'dibuat')) r.peringatan++;
  });
  return r;
}

function isBarisTabel(b) {
  const x = isSt.hasil[b.n] || { status: 'belum', pesan: '', peringatan: [] };
  const username = x.username || b.username;
  const nama = x.nama || b.nama;
  const sekolah = x.sekolah !== undefined && x.status !== 'galat' ? x.sekolah : b.sekolah;
  const kelas = x.kelas !== undefined && x.status !== 'galat' ? x.kelas : b.kelas;
  const k = x.status === 'sah' || x.status === 'dibuat' ? 'lencana-sukses' : x.status === 'ada' ? 'lencana-info' : x.status === 'galat' ? 'lencana-bahaya' : x.status === 'terputus' ? 'lencana-peringatan' : 'lencana-netral';
  const ik = x.status === 'galat' ? 'alert-circle' : x.status === 'ada' ? 'info' : x.status === 'terputus' ? 'wifi-off' : x.status === 'belum' ? 'clock' : 'check-circle';
  return h`<tr>
    <td data-label="Baris">${b.n}</td>
    <td data-label="Username"><code>${username || '—'}</code></td>
    <td data-label="Nama" class="pecah">${nama || '—'}</td>
    <td data-label="Sekolah dan kelas" class="pecah">${[sekolah, kelas].filter(Boolean).join(' · ') || '—'}</td>
    <td data-label="Status"><span class="lencana ${k}">${ikon(ik, 'ikon-sm')}${IS_SATU[x.status] || x.status}</span>
      ${x.pesan ? h`<div class="is-pesan">${x.pesan}</div>` : ''}
      ${(x.peringatan || []).map(function (t) { return h`<div class="is-pesan is-waspada">${ikon('alert-triangle', 'ikon-sm')}<span>${t}</span></div>`; })}</td></tr>`;
}

function isDaftarTabel(saring) {
  const cocok = isSt.baris.filter(function (b) {
    const x = isSt.hasil[b.n];
    if (saring === 'semua') return true;
    if (!x) return saring === 'belum';
    if (saring === 'peringatan') return !!(x.peringatan && x.peringatan.length);
    return x.status === saring;
  });
  return cocok;
}

function isHtmlTabel(saring) {
  const cocok = isDaftarTabel(saring);
  const tampil = cocok.slice(0, IS.TAMPIL_MAKS);
  if (!cocok.length) return h`<div class="bungkus-tabel"><div class="tabel-kosong">Tidak ada baris untuk penyaring ini.</div></div>`;
  return h`<p class="bantu" id="is-hitung" aria-live="polite">Menampilkan ${formatAngka(tampil.length)} dari ${formatAngka(cocok.length)} baris${cocok.length > tampil.length ? '. Gunakan penyaring untuk melihat sisanya.' : '.'}</p>
    <div class="bungkus-tabel"><table class="tabel" data-uji="is-tabel"><caption class="sr-only">Baris dalam berkas</caption>
    <thead><tr><th scope="col">Baris</th><th scope="col">Username</th><th scope="col">Nama</th><th scope="col">Sekolah dan kelas</th><th scope="col">Status</th></tr></thead>
    <tbody>${tampil.map(isBarisTabel)}</tbody></table></div>`;
}

function isHtmlPeriksa() {
  const r = isHitung();
  const b = isSt.berkas;
  const perluPerhatian = r.galat > 0;
  return h`
    ${kepalaHalaman('Periksa sebelum membuat', 'Belum ada akun yang dibuat. Periksa ringkasan dan baris bermasalah di bawah ini.',
      h`<button type="button" class="tombol tombol-diam" data-aksi="is-ulang">${ikon('rotate-ccw')}<span>Pilih berkas lain</span></button>`)}
    <div class="is-berkas-info" data-uji="is-berkas-info">${ikon('file-text')}<span><strong>${b.nama}</strong> · ${gbUkuranTeks(b.ukuran)}${b.lembar ? h` · lembar "${b.lembar}"` : ''}</span></div>
    <div class="kisi-kpi" data-uji="is-ringkas">
      ${kpi('users', 'Baris dalam berkas', r.total)}
      ${kpi('user-plus', 'Siap dibuat', r.sah, r.peringatan ? formatAngka(r.peringatan) + ' perlu dicek' : '', 'sukses')}
      ${kpi('info', 'Sudah ada (dilewati)', r.ada, 'akun lama tidak diubah')}
      ${kpi('alert-circle', 'Bermasalah', r.galat, r.galat ? 'tidak akan dibuat' : '', r.galat ? 'bahaya' : '')}
    </div>
    ${perluPerhatian ? h`<div class="peringatan peringatan-waspada jarak-bawah" data-uji="is-ada-masalah">${ikon('alert-triangle')}<div><p><strong>${formatAngka(r.galat)} baris bermasalah tidak akan dibuat.</strong> Perbaiki di Excel lalu unggah ulang berkas yang sama: akun yang sudah dibuat akan dilewati, sisanya dibuat.</p></div></div>` : ''}
    ${b.angkaUsername ? h`<div class="peringatan peringatan-waspada jarak-bawah" data-uji="is-ada-angka">${ikon('alert-triangle')}<div><p><strong>${formatAngka(b.angkaUsername)} username tersimpan sebagai angka di Excel.</strong> Angka nol di depan (misalnya 00123) bisa hilang bila kolomnya tidak berformat teks. Periksa kolom Username di bawah.</p></div></div>` : ''}
    <div class="saring" role="group" aria-label="Penyaring baris">
      <div class="isian"><label class="sr-only" for="is-saring">Tampilkan baris</label>
        <select class="kontrol" id="is-saring" data-masuk="is-saring">
          ${[['semua', 'Semua baris'], ['galat', 'Bermasalah'], ['ada', 'Sudah ada'], ['sah', 'Siap dibuat'], ['peringatan', 'Perlu dicek (peringatan)']].map(function (o) { return h`<option value="${o[0]}"${isSt.saring === o[0] ? mentah(' selected') : ''}>${o[1]}</option>`; })}
        </select></div>
    </div>
    <div id="is-tabel">${isHtmlTabel(isSt.saring)}</div>
    <div class="kartu is-pilihan-buat">
      <label class="is-wajib"><input type="checkbox" id="is-wajib" data-masuk="is-wajib"${isSt.wajibGanti ? mentah(' checked') : ''}> <span><strong>Siswa wajib mengganti password saat pertama masuk</strong><br><span class="bantu">Disarankan. Password di berkas hanya dipakai untuk masuk pertama kali. Siswa tetap melengkapi tanggal lahir dan jenis kelamin sendiri.</span></span></label>
      <div class="is-aksi">
        <button type="button" class="tombol" data-aksi="is-buat" data-uji="is-buat"${r.sah ? '' : mentah(' disabled')}>${ikon('user-plus')}<span>Buat ${formatAngka(r.sah)} akun</span></button>
        <button type="button" class="tombol tombol-diam" data-aksi="is-ulang">${ikon('x')}<span>Batal</span></button>
      </div>
      ${r.sah ? '' : h`<p class="bantu">Tidak ada baris yang bisa dibuat. Perbaiki berkasnya lalu pilih ulang.</p>`}
    </div>`;
}

function isHtmlProses() {
  const P = isSt.proses;
  const persen = P.total ? Math.round(P.selesai / P.total * 100) : 0;
  return h`
    ${kepalaHalaman('Membuat akun…', 'Jangan menutup atau memuat ulang halaman ini sampai selesai.')}
    <div class="kartu is-proses" data-uji="is-proses">
      <div class="is-bar" role="progressbar" id="is-bar" aria-label="Kemajuan pembuatan akun" aria-valuemin="0" aria-valuemax="${P.total}" aria-valuenow="${P.selesai}"><span id="is-bar-isi" style="width:${persen}%"></span></div>
      <p id="is-teks" class="is-teks" role="status" aria-live="polite">${isTeksProses()}</p>
      <div class="is-aksi"><button type="button" class="tombol tombol-bahaya-garis" data-aksi="is-henti" id="is-henti"${P.hentikan ? mentah(' disabled') : ''}>${ikon('pause')}<span>${P.hentikan ? 'Menghentikan…' : 'Hentikan'}</span></button></div>
      <p class="bantu">Menghentikan tidak membatalkan akun yang sudah dibuat. Unggah ulang berkas yang sama nanti untuk melanjutkan.</p>
    </div>`;
}

function isTeksProses() {
  const P = isSt.proses;
  return formatAngka(P.selesai) + ' dari ' + formatAngka(P.total) + ' baris diproses · ' + formatAngka(P.dibuat) + ' dibuat'
    + (P.ada ? ' · ' + formatAngka(P.ada) + ' sudah ada' : '') + (P.galat ? ' · ' + formatAngka(P.galat) + ' bermasalah' : '');
}

function isPerbaruiProses() {
  const P = isSt.proses;
  const bar = el('#is-bar'), isi = el('#is-bar-isi'), t = el('#is-teks');
  if (!bar || !isi || !t) return;
  const persen = P.total ? Math.round(P.selesai / P.total * 100) : 0;
  bar.setAttribute('aria-valuenow', String(P.selesai));
  isi.style.width = persen + '%';
  t.textContent = isTeksProses();
}

function isHtmlSelesai() {
  const r = isHitung();
  const P = isSt.proses || {};
  const lengkap = r.sah === 0 && r.belum === 0 && r.terputus === 0;
  const masalah = r.galat + r.belum + r.terputus;
  return h`
    ${kepalaHalaman(lengkap && !r.galat ? 'Impor selesai' : 'Impor selesai dengan catatan', 'Berikut hasil akhirnya. Laporan Excel tidak memuat password.',
      h`<button type="button" class="tombol tombol-garis" data-aksi="is-laporan" data-uji="is-laporan">${ikon('download')}<span>Unduh laporan (Excel)</span></button>`)}
    <div id="is-unduh" aria-live="polite"></div>
    <div class="kisi-kpi" data-uji="is-hasil">
      ${kpi('user-check', 'Akun dibuat', r.dibuat, '', 'sukses')}
      ${kpi('info', 'Sudah ada (dilewati)', r.ada, 'akun lama tidak diubah')}
      ${kpi('alert-circle', 'Bermasalah', r.galat, r.galat ? 'perbaiki lalu unggah ulang' : '', r.galat ? 'bahaya' : '')}
      ${kpi('clock', 'Belum diproses', r.belum + r.terputus, r.terputus ? 'koneksi terputus' : (P.hentikan ? 'dihentikan' : ''))}
    </div>
    ${P.berhenti ? h`<div class="peringatan peringatan-bahaya jarak-bawah" role="alert">${ikon('alert-circle')}<div><p>${P.berhenti}</p></div></div>` : ''}
    ${r.terputus ? h`<div class="peringatan peringatan-waspada jarak-bawah" data-uji="is-terputus">${ikon('wifi-off')}<div><p><strong>Koneksi terputus saat memproses ${formatAngka(r.terputus)} baris.</strong> Sebagian mungkin sudah terbuat. Unggah ulang berkas yang sama untuk melanjutkan: akun yang sudah ada dilewati, tidak diduplikasi.</p></div></div>` : ''}
    ${P.ragu ? h`<div class="peringatan peringatan-waspada jarak-bawah" data-uji="is-ragu">${ikon('info')}<div><p><strong>${formatAngka(P.ragu)} baris tercatat "Sudah ada" setelah koneksi sempat bermasalah.</strong> Kemungkinan akun itu dibuat oleh percobaan sebelumnya yang jawabannya tidak sampai. Jumlah akun yang tepat bisa dicek di Kelola Akun.</p></div></div>` : ''}
    ${r.dibuat ? h`<div class="peringatan peringatan-sukses jarak-bawah">${ikon('check-circle')}<div><p>Siswa bisa masuk dengan username dan password dari berkas Anda.${isSt.wajibGanti ? ' Mereka akan diminta mengganti password saat pertama masuk.' : ''} Hapus atau simpan berkas Excel Anda dengan aman.</p></div></div>` : ''}
    ${masalah ? h`<h3>Baris yang perlu perhatian</h3><div id="is-tabel">${isHtmlTabelMasalah()}</div>` : ''}
    <div class="is-aksi">
      <button type="button" class="tombol" data-aksi="is-ke-akun">${ikon('users')}<span>Lihat daftar akun</span></button>
      <button type="button" class="tombol tombol-diam" data-aksi="is-ulang">${ikon('upload')}<span>Impor berkas lain</span></button>
    </div>`;
}

function isHtmlTabelMasalah() {
  const cocok = isSt.baris.filter(function (b) { const x = isSt.hasil[b.n]; return !x || x.status === 'galat' || x.status === 'terputus' || x.status === 'belum' || x.status === 'sah'; });
  const tampil = cocok.slice(0, IS.TAMPIL_MAKS);
  return h`<p class="bantu">Menampilkan ${formatAngka(tampil.length)} dari ${formatAngka(cocok.length)} baris${cocok.length > tampil.length ? '. Laporan Excel memuat semuanya.' : '.'}</p>
    <div class="bungkus-tabel"><table class="tabel"><caption class="sr-only">Baris yang perlu perhatian</caption>
    <thead><tr><th scope="col">Baris</th><th scope="col">Username</th><th scope="col">Nama</th><th scope="col">Sekolah dan kelas</th><th scope="col">Status</th></tr></thead>
    <tbody>${tampil.map(isBarisTabel)}</tbody></table></div>`;
}

AKSI['is-template'] = function () {
  let bytes;
  try { bytes = bsBuatTemplate(); } catch (e) { toast('Template tidak bisa disiapkan di peramban ini.', 'galat'); return; }
  ekLapor(el('#is-unduh'), 'Template-Impor-Siswa.xlsx', bytes, XLSX_TIPE);
};

MASUKAN['is-berkas'] = function (r, e) {
  if (e && e.type === 'input') return;
  const form = r.form;
  const kotak = el('#is-pilihan', form);
  bersihGalat(form);
  const nomor = ++isSt.urut;
  isSt.kendali.batal = true; isSt.kendali = { batal: false };
  const file = r.files && r.files[0];
  if (!file) { pasang(kotak, h``); return; }
  const gagal = function (pesan) {
    if (nomor !== isSt.urut) return;
    r.value = '';
    pasang(kotak, h``);
    galatIsian(form, 'berkas', pesan);
  };
  pasang(kotak, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Membaca berkas…</p>`);
  bsBacaBerkas(file).then(function (hasil) {
    if (nomor !== isSt.urut) return;
    isSt.berkas = { nama: file.name, ukuran: file.size, lembar: hasil.lembar || '', angkaUsername: hasil.angkaUsername || 0 };
    isSt.baris = hasil.baris;
    isSt.hasil = {};
    const pertama = {};
    isSt.baris.forEach(function (b) {
      const k = isKunci(b.username);
      if (!k) return;
      if (pertama[k] !== undefined) {
        isSt.hasil[b.n] = { n: b.n, username: k, nama: b.nama, sekolah: b.sekolah, kelas: b.kelas, status: 'galat', pesan: 'Username sama dengan baris ' + pertama[k] + ' di berkas ini.', peringatan: [] };
      } else pertama[k] = b.n;
    });
    isSt.memeriksa = { selesai: 0, total: isSt.baris.length };
    pasang(kotak, h`<p class="bantu" role="status"><span class="spinner" aria-hidden="true"></span> <span id="is-periksa-teks">Memeriksa ${formatAngka(isSt.baris.length)} baris…</span></p>`);
    return isPeriksa(nomor).then(function () {
      if (nomor !== isSt.urut) return;
      isSt.memeriksa = null;
      isSt.tahap = 'periksa';
      if (isDiHalaman()) { isGambar(); fokusJudul(); }
    });
  }).catch(function (e2) {
    if (nomor !== isSt.urut) return;
    isSt.baris = []; isSt.hasil = {}; isSt.memeriksa = null;
    if (e2 && e2.kode === 'BERKAS') { gagal(e2.message); return; }
    if (e2 && e2.ditangani) { r.value = ''; pasang(kotak, h``); return; }
    gagal(e2 && e2.message ? e2.message : 'Berkas tidak bisa diperiksa. Coba lagi.');
  });
};

function isKirimKelompok(mode, daftar, kendali, saatUlang) {
  return panggil('akun.imporSiswa', {
    mode: mode, wajibGanti: isSt.wajibGanti,
    baris: daftar.map(function (b) { return { n: b.n, username: b.username, password: b.password, nama: b.nama, sekolah: b.sekolah, kelas: b.kelas }; })
  }, { sabar: IS.SABAR, kendali: kendali, saatUlang: saatUlang });
}

function isPeriksa(nomor) {
  const kendali = isSt.kendali;
  const antre = isSt.baris.filter(function (b) { return !isSt.hasil[b.n]; });
  const kelompok = [];
  for (let i = 0; i < antre.length; i += IS.KELOMPOK_CEK) kelompok.push(antre.slice(i, i + IS.KELOMPOK_CEK));
  return kelompok.reduce(function (p, kel) {
    return p.then(function () {
      if (nomor !== isSt.urut) return null;
      return isKirimKelompok('cek', kel, kendali).then(function (d) {
        if (nomor !== isSt.urut) return;
        d.hasil.forEach(function (x) { isSt.hasil[x.n] = x; });
        isSt.memeriksa.selesai += kel.length;
        const t = el('#is-periksa-teks');
        if (t) t.textContent = 'Memeriksa… ' + formatAngka(isSt.memeriksa.selesai) + ' dari ' + formatAngka(isSt.memeriksa.total) + ' baris';
      });
    });
  }, Promise.resolve());
}

MASUKAN['is-saring'] = function (r) {
  isSt.saring = r.value;
  const w = el('#is-tabel');
  if (w) pasang(w, isHtmlTabel(isSt.saring));
};
MASUKAN['is-wajib'] = function (r) { isSt.wajibGanti = !!r.checked; };

AKSI['is-ulang'] = function () {
  if (isSt.proses && isSt.proses.jalan) return;
  isReset();
  if (isDiHalaman()) { isGambar(); fokusJudul(); }
};
AKSI['is-ke-akun'] = function () { navigateTo('akun'); };

AKSI['is-buat'] = function () {
  const r = isHitung();
  if (!r.sah || isSt.tahap !== 'periksa') return;
  konfirmasi({
    judul: 'Buat ' + formatAngka(r.sah) + ' akun siswa?', ya: 'Buat akun',
    badan: h`<p class="tanpa-margin">Akan dibuat <strong>${formatAngka(r.sah)}</strong> akun Siswa.${r.ada ? h` <strong>${formatAngka(r.ada)}</strong> baris dilewati karena username sudah ada.` : ''}${r.galat ? h` <strong>${formatAngka(r.galat)}</strong> baris bermasalah tidak dibuat.` : ''}</p>
      <p>${isSt.wajibGanti ? 'Siswa wajib mengganti password saat pertama masuk.' : 'Siswa tidak diminta mengganti password.'} Password tidak dapat dilihat lagi setelah ini, jadi simpan berkas Anda.</p>`
  }).then(function (ya) { if (ya) isMulaiBuat(); });
};

function isMulaiBuat() {
  const antre = isSt.baris.filter(function (b) { const x = isSt.hasil[b.n]; return x && x.status === 'sah'; });
  const kelompok = [];
  for (let i = 0; i < antre.length; i += IS.KELOMPOK_BUAT) kelompok.push(antre.slice(i, i + IS.KELOMPOK_BUAT));
  const P = { total: antre.length, selesai: 0, dibuat: 0, ada: 0, galat: 0, ragu: 0, kelompok: kelompok, hentikan: false, jalan: true, berhenti: '', tanpaKemajuan: 0, kendali: { batal: false } };
  isSt.proses = P;
  isSt.tahap = 'proses';
  isGambar(); fokusJudul();
  window.onbeforeunload = function (e) { e.preventDefault(); e.returnValue = ''; return ''; };
  const pekerja = [];
  for (let i = 0; i < IS.PEKERJA; i++) pekerja.push(isPekerja(P));
  Promise.all(pekerja).then(function () {
    P.jalan = false;
    window.onbeforeunload = null;
    isSt.baris.forEach(function (b) { const x = isSt.hasil[b.n]; if (x && x.status === 'sah') isSt.hasil[b.n] = Object.assign({}, x, { status: 'belum', pesan: 'Belum diproses.' }); });
    isSt.tahap = 'selesai';
    if (isDiHalaman()) { isGambar(); fokusJudul(); } else toast('Impor siswa selesai. Buka menu Impor Siswa untuk melihat hasilnya.', 'info');
  });
}

function isTunda(ms) { return new Promise(function (selesai) { setTimeout(selesai, ms); }); }

function isPekerja(P) {
  const lanjut = function () {
    if (P.hentikan || !P.kelompok.length) return Promise.resolve();
    const kel = P.kelompok.shift();
    return isJalankanKelompok(P, kel).then(lanjut);
  };
  return lanjut();
}

function isJalankanKelompok(P, kel) {
  const peta = {};
  kel.forEach(function (b) { peta[b.n] = b; });
  let ragu = false;
  return isKirimKelompok('buat', kel, P.kendali, function () { ragu = true; }).then(function (d) {
    const sisa = [];
    let maju = 0;
    d.hasil.forEach(function (x) {
      if (x.status === 'tertunda') { if (peta[x.n]) sisa.push(peta[x.n]); return; }
      maju++;
      if (ragu && x.status === 'ada') {
        x = Object.assign({}, x, { pesan: ((x.pesan || '') + ' Mungkin dibuat oleh percobaan sebelumnya yang jawabannya tidak sampai.').trim() });
        P.ragu++;
      }
      isSt.hasil[x.n] = x;
      P.selesai++;
      if (x.status === 'dibuat') P.dibuat++; else if (x.status === 'ada') P.ada++; else P.galat++;
    });
    if (sisa.length) {
      P.tanpaKemajuan = maju ? 0 : P.tanpaKemajuan + 1;
      if (P.tanpaKemajuan >= 3) { P.hentikan = true; P.berhenti = 'Server terlalu lambat memproses permintaan sehingga impor dihentikan. Coba lagi beberapa saat lagi dengan berkas yang sama.'; } else P.kelompok.unshift(sisa);
    }
    if (isDiHalaman() && isSt.tahap === 'proses') isPerbaruiProses();
  }).catch(function (e) {
    const kode = e && e.kode;
    if (kode === 'SESI' || kode === 'DITOLAK' || kode === 'PEMELIHARAAN') {
      P.hentikan = true;
      P.berhenti = kode === 'SESI' ? 'Sesi Anda berakhir sehingga impor dihentikan. Masuk lagi lalu unggah ulang berkas yang sama untuk melanjutkan.' : (e.message || 'Impor ditolak server.');
      return null;
    }
    if (kode && kode !== 'JARINGAN' && kode !== 'DIBATALKAN' && kode !== 'GALAT_SERVER') {
      P.hentikan = true;
      P.berhenti = e.message || 'Impor dihentikan karena server menolak permintaan.';
      return null;
    }
    kel.forEach(function (b) {
      isSt.hasil[b.n] = { n: b.n, username: isKunci(b.username), nama: b.nama, sekolah: b.sekolah, kelas: b.kelas, status: 'terputus', pesan: 'Koneksi terputus; mungkin sudah terbuat. Unggah ulang untuk memastikan.', peringatan: [] };
      P.selesai++;
    });
    if (isDiHalaman() && isSt.tahap === 'proses') isPerbaruiProses();
    return null;
  });
}

AKSI['is-henti'] = function () {
  const P = isSt.proses;
  if (!P || !P.jalan) return;
  P.hentikan = true;
  P.kendali.batal = true;
  const b = el('#is-henti');
  if (b) { b.disabled = true; pasang(b, h`${ikon('pause')}<span>Menghentikan…</span>`); }
};

AKSI['is-laporan'] = function () {
  const r = isHitung();
  const kini = new Date();
  const baris = isSt.baris.map(function (b) {
    const x = isSt.hasil[b.n] || { status: 'belum', pesan: '', peringatan: [] };
    const ket = [x.pesan].concat(x.peringatan || []).filter(Boolean).join(' ');
    return [b.n, x.username || b.username, x.nama || b.nama, x.sekolah !== undefined && x.status !== 'galat' ? x.sekolah : b.sekolah, x.kelas !== undefined && x.status !== 'galat' ? x.kelas : b.kelas, IS_SATU[x.status] || x.status, ket];
  });
  let bytes;
  try {
    bytes = xlsxBuat([{
      nama: 'Laporan',
      judul: ['Laporan Impor Siswa', 'Berkas: ' + (isSt.berkas ? isSt.berkas.nama : '-') + ' · ' + waktuWIB(kini.toISOString()),
        'Dibuat ' + r.dibuat + ' · Sudah ada ' + r.ada + ' · Bermasalah ' + r.galat + ' · Belum diproses ' + (r.belum + r.terputus) + '. Laporan ini tidak memuat password.'],
      kolom: [{ judul: 'Baris', lebar: 8, tipe: 'bulat' }, { judul: 'Username', lebar: 24 }, { judul: 'Nama Lengkap', lebar: 32 }, { judul: 'Sekolah', lebar: 28 }, { judul: 'Kelas', lebar: 12 }, { judul: 'Status', lebar: 22 }, { judul: 'Keterangan', lebar: 60 }],
      baris: baris, arah: 'datar'
    }], { judul: 'Laporan Impor Siswa', waktu: kini });
  } catch (e) { toast('Laporan tidak bisa disiapkan.', 'galat'); return; }
  ekLapor(el('#is-unduh'), 'Laporan-Impor-Siswa-' + ekStempel() + '.xlsx', bytes, XLSX_TIPE);
};


const PY_SIMBOL = [
  ['Hitung', ['×', '÷', '±', '=', '≠', '≈', '<', '>', '≤', '≥', '%', '‰', '√', 'π', '∞', '²', '³', '½', '⅓', '⅔', '¼', '¾']],
  ['Sudut dan bangun', ['°', '′', '″', '∠', '△', '□', '⊥', '∥', '⌀', '○']],
  ['Satuan dan IPA', ['µ', 'Ω', 'Δ', '℃', '→', '←', '↑', '↓', '⇄', '·', '•']],
  ['Huruf Yunani', ['α', 'β', 'γ', 'θ', 'λ', 'μ', 'σ', 'φ', 'ω', 'Σ', 'Π']]
];

const PY_TOMBOL = [
  [['undo', 'Urungkan', 'rotate-ccw'], ['redo', 'Ulangi', 'rotate-cw']],
  [['bold', 'Tebal', 'B', 'bold', 'glif'], ['italic', 'Miring', 'I', 'italic', 'glif glif-m'], ['underline', 'Garis bawah', 'U', 'underline', 'glif glif-u'], ['strike', 'Coret', 'S', 'strikeThrough', 'glif glif-s']],
  [['sup', 'Superskrip (pangkat)', 'x²', 'superscript', 'glif'], ['sub', 'Subskrip', 'x₂', 'subscript', 'glif']],
  [['kiri', 'Rata kiri', 'align-left', 'justifyLeft'], ['tengah', 'Rata tengah', 'align-center', 'justifyCenter'], ['kanan', 'Rata kanan', 'align-right', 'justifyRight'], ['penuh', 'Rata kiri-kanan', 'align-justify', 'justifyFull']],
  [['ul', 'Daftar berbutir', 'list', 'insertUnorderedList'], ['ol', 'Daftar bernomor', 'list-ordered', 'insertOrderedList']],
  [['simbol', 'Simbol', 'Ω', null, 'glif'], ['frac', 'Sisipkan pecahan', '½', null, 'glif'], ['sqrt', 'Sisipkan akar', '√', null, 'glif']],
  [['gambar', 'Sisipkan gambar', 'image']]
];
const PY_PERINTAH = { bold: 'bold', italic: 'italic', underline: 'underline', strike: 'strikeThrough', sup: 'superscript', sub: 'subscript', ul: 'insertUnorderedList', ol: 'insertOrderedList' };
const PY_RATA = { kiri: '', tengah: 'c', kanan: 'r', penuh: 'j' };

const PY_STATE = typeof WeakMap === 'function' ? new WeakMap() : null;
let pyDialog = null;
let pyAktifGlobal = null;


function htmlBilahPenyunting() {
  return h`<div class="penyunting-bar" role="toolbar" aria-label="Pemformatan teks" data-penyunting-bar>
    <div class="pb-baris">${PY_TOMBOL.map(function (kel) {
      return h`<div class="kelompok" role="group">${kel.map(function (t, i) {
        const isi = /^[a-z-]+$/.test(t[2]) ? ikon(t[2]) : h`<span class="${t[4] || 'glif'}" aria-hidden="true">${t[2]}</span>`;
        return h`<button type="button" class="pb-tombol" data-pb="${t[0]}" aria-label="${t[1]}" title="${t[1]}"${PY_PERINTAH[t[0]] || t[0] in PY_RATA ? mentah(' aria-pressed="false"') : ''}${t[0] === 'simbol' ? mentah(' aria-expanded="false" aria-controls="py-simbol"') : ''} tabindex="-1">${isi}</button>`;
      })}</div>`;
    })}</div>
    <div class="palet-simbol-bungkus" id="py-simbol" hidden>
      ${PY_SIMBOL.map(function (g) {
        return h`<p class="palet-judul">${g[0]}</p><div class="palet-simbol" role="group" aria-label="${g[0]}">${g[1].map(function (s) { return h`<button type="button" class="pb-tombol" data-py-simbol="${s}" aria-label="Sisipkan ${s}" tabindex="-1">${s}</button>`; })}</div>`;
      })}
    </div>
  </div>`;
}

function htmlIsianKaya(o) {
  return h`<div class="penyunting-bungkus"><div class="penyunting-isi${o.pendek ? ' pendek' : ''} ky" id="${o.id}" data-penyunting="${o.nama}" contenteditable="true" role="textbox" aria-multiline="true"${o.labelId ? mentah(' aria-labelledby="' + esc(o.labelId) + '"') : mentah(' aria-label="' + esc(o.label || 'Isian') + '"')} data-placeholder="${o.placeholder || ''}"${o.fokusAwal ? mentah(' autofocus') : ''}${o.utama ? mentah(' data-py-utama="1"') : ''} lang="id" spellcheck="true">${Kaya.kosong(o.nilai) ? mentah('<p><br></p>') : kayaHtmlPenyunting(o.nilai)}</div></div>`;
}


function pyKeadaan(ed) {
  let s = PY_STATE ? PY_STATE.get(ed) : ed.__py;
  if (!s) { s = { riwayat: [], idx: -1, seleksi: null, pewaktu: null }; if (PY_STATE) PY_STATE.set(ed, s); else ed.__py = s; }
  return s;
}
function pyBilah(ed) { const f = ed.closest('form') || ed.closest('.modal-badan') || document; return f.querySelector('[data-penyunting-bar]'); }


function pyOffset(ed, simpul, off) {
  const r = document.createRange();
  r.selectNodeContents(ed);
  try { r.setEnd(simpul, off); } catch (e) { return 0; }
  return r.toString().length;
}
function pyBacaSeleksi(ed) {
  const sel = window.getSelection ? window.getSelection() : null;
  if (!sel || !sel.rangeCount) return null;
  const r = sel.getRangeAt(0);
  if (!ed.contains(r.startContainer) || !ed.contains(r.endContainer)) return null;
  return { a: pyOffset(ed, r.startContainer, r.startOffset), b: pyOffset(ed, r.endContainer, r.endOffset) };
}
function pyTempat(ed, n) {
  const w = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT, null);
  let sisa = n, akhir = null, t;
  while ((t = w.nextNode())) {
    const len = t.nodeValue.length;
    if (sisa <= len) { akhir = { node: t, offset: sisa }; break; }
    sisa -= len;
    akhir = { node: t, offset: len };
  }
  if (!akhir) return { node: ed, offset: ed.childNodes.length };
  const atom = akhir.node.parentNode && akhir.node.parentNode.closest ? akhir.node.parentNode.closest('[data-ky]') : null;
  if (atom && ed.contains(atom)) return { node: atom.parentNode, offset: Array.prototype.indexOf.call(atom.parentNode.childNodes, atom) + 1 };
  return akhir;
}
function pyPulihkanSeleksi(ed, s) {
  if (!s) return;
  const sel = window.getSelection ? window.getSelection() : null;
  if (!sel) return;
  try {
    const a = pyTempat(ed, s.a), b = s.a === s.b ? a : pyTempat(ed, s.b);
    const r = document.createRange();
    r.setStart(a.node, a.offset);
    r.setEnd(b.node, b.offset);
    sel.removeAllRanges();
    sel.addRange(r);
  } catch (e) {   }
}
function pyKursorAkhir(ed) {
  const sel = window.getSelection ? window.getSelection() : null;
  if (!sel) return;
  const r = document.createRange();
  r.selectNodeContents(ed);
  r.collapse(false);
  sel.removeAllRanges();
  sel.addRange(r);
}


function pyCatat(ed) {
  const s = pyKeadaan(ed);
  const html = ed.innerHTML;
  if (s.idx >= 0 && s.riwayat[s.idx].html === html) { s.riwayat[s.idx].seleksi = pyBacaSeleksi(ed) || s.riwayat[s.idx].seleksi; return; }
  s.riwayat = s.riwayat.slice(0, s.idx + 1);
  s.riwayat.push({ html: html, seleksi: pyBacaSeleksi(ed) });
  if (s.riwayat.length > 100) s.riwayat.shift();
  s.idx = s.riwayat.length - 1;
}
function pyTutupWaktu(ed) {
  const s = pyKeadaan(ed);
  if (s.pewaktu) { clearTimeout(s.pewaktu); s.pewaktu = null; pyCatat(ed); }
}
function pyTerapkan(ed, entri) {
  ed.innerHTML = entri.html;
  if (!ed.firstChild) ed.innerHTML = '<p><br></p>';
  pyPulihkanSeleksi(ed, entri.seleksi);
  pyTandaiKosong(ed);
}
function pyUrung(ed) {
  const s = pyKeadaan(ed);
  pyTutupWaktu(ed);
  pyCatat(ed);
  if (s.idx <= 0) return;
  s.idx--;
  pyTerapkan(ed, s.riwayat[s.idx]);
}
function pyUlang(ed) {
  const s = pyKeadaan(ed);
  pyTutupWaktu(ed);
  if (s.idx >= s.riwayat.length - 1) return;
  s.idx++;
  pyTerapkan(ed, s.riwayat[s.idx]);
}
function pyTandaiKosong(ed) {
  const kosong = !ed.textContent.replace(/\s+/g, '') && !ed.querySelector('[data-ky]');
  ed.classList.toggle('kosong', kosong);
}


const PY_BLOK = { P: 1, DIV: 1, H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1, BLOCKQUOTE: 1, PRE: 1, SECTION: 1, ARTICLE: 1, HEADER: 1, FOOTER: 1, MAIN: 1, ADDRESS: 1, FIGURE: 1, FIGCAPTION: 1, TABLE: 1, THEAD: 1, TBODY: 1, TFOOT: 1, TR: 1, TD: 1, TH: 1, DL: 1, DT: 1, DD: 1, CENTER: 1, FORM: 1, FIELDSET: 1, HR: 1, BODY: 1 };
const PY_ABAIKAN = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, IFRAME: 1, OBJECT: 1, EMBED: 1, HEAD: 1, TITLE: 1, META: 1, LINK: 1, SVG: 1, MATH: 1, CANVAS: 1, AUDIO: 1, VIDEO: 1, IMG: 1, INPUT: 1, BUTTON: 1, SELECT: 1, TEXTAREA: 1 };

function pyJson(v) { try { const x = JSON.parse(v); return Array.isArray(x) ? x : []; } catch (e) { return []; } }

function pyFormatGaya(n) {
  const out = [];
  const st = n.style;
  if (!st) return out;
  const fw = String(st.fontWeight || '').toLowerCase();
  if (fw === 'bold' || fw === 'bolder' || (+fw >= 600)) out.push('b');
  if (String(st.fontStyle || '').toLowerCase() === 'italic') out.push('i');
  const td = String(st.textDecorationLine || st.textDecoration || '').toLowerCase();
  if (td.indexOf('underline') >= 0) out.push('u');
  if (td.indexOf('line-through') >= 0) out.push('s');
  const va = String(st.verticalAlign || '').toLowerCase();
  if (va === 'super') out.push('sup'); else if (va === 'sub') out.push('sub');
  return out;
}
const PY_TAG_FORMAT = { STRONG: 'b', B: 'b', EM: 'i', I: 'i', U: 'u', INS: 'u', S: 's', STRIKE: 's', DEL: 's', SUP: 'sup', SUB: 'sub' };

function pyRata(n) {
  const st = n.style;
  let a = st ? String(st.textAlign || '').toLowerCase() : '';
  if (!a) a = String(n.getAttribute ? n.getAttribute('align') || '' : '').toLowerCase();
  if (!a && n.classList) a = n.classList.contains('ky-rata-c') ? 'center' : (n.classList.contains('ky-rata-r') ? 'right' : (n.classList.contains('ky-rata-j') ? 'justify' : ''));
  return a === 'center' ? 'c' : (a === 'right' || a === 'end' ? 'r' : (a === 'justify' ? 'j' : ''));
}

function pyBungkus(isi, formats) {
  let c = isi;
  for (let i = 0; i < formats.length; i++) c = [{ t: formats[i], c: c }];
  return c;
}

function pyInline(n, out, kedalaman) {
  if (kedalaman > 60) return;
  if (n.nodeType === 3) { out.push(String(n.nodeValue).replace(/[\t\r\n\u00a0 ]{2,}/g, ' ').replace(/[\t\r\n\u00a0]/g, ' ')); return; }
  if (n.nodeType !== 1) return;
  const tag = n.tagName.toUpperCase();
  if (PY_ABAIKAN[tag]) return;
  const ky = n.getAttribute('data-ky');
  if (ky === 'frac') { out.push({ t: 'frac', n: pyJson(n.getAttribute('data-n')), d: pyJson(n.getAttribute('data-d')) }); return; }
  if (ky === 'sqrt') { out.push({ t: 'sqrt', c: pyJson(n.getAttribute('data-c')) }); return; }
  if (ky === 'img') { out.push({ t: 'img', m: n.getAttribute('data-m') || '', alt: n.getAttribute('data-alt') || '' }); return; }
  if (tag === 'BR') { out.push({ t: 'br' }); return; }
  const dalam = [];
  for (let c = n.firstChild; c; c = c.nextSibling) pyInline(c, dalam, kedalaman + 1);
  const formats = pyFormatGaya(n);
  if (PY_TAG_FORMAT[tag]) formats.push(PY_TAG_FORMAT[tag]);
  if (PY_BLOK[tag] || tag === 'LI' || tag === 'UL' || tag === 'OL') dalam.push({ t: 'br' });
  Array.prototype.push.apply(out, formats.length ? pyBungkus(dalam, formats) : dalam);
}

function pyDaftar(n, blok, formats) {
  const butir = [];
  const kumpul = function (daftar, kedalaman) {
    if (kedalaman > 12) return;
    for (let li = daftar.firstChild; li; li = li.nextSibling) {
      if (li.nodeType !== 1) continue;
      const tag = li.tagName.toUpperCase();
      if (tag === 'UL' || tag === 'OL') { kumpul(li, kedalaman + 1); continue; }
      if (tag !== 'LI') continue;
      const isi = [];
      for (let c = li.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 1 && (c.tagName.toUpperCase() === 'UL' || c.tagName.toUpperCase() === 'OL')) {
          if (isi.length) { butir.push(pyBungkus(isi.splice(0), formats)); }
          kumpul(c, kedalaman + 1);
        } else pyInline(c, isi, 0);
      }
      if (isi.length) butir.push(pyBungkus(isi, formats));
    }
  };
  kumpul(n, 0);
  if (butir.length) blok.push({ t: n.tagName.toUpperCase() === 'OL' ? 'ol' : 'ul', i: butir });
}

function pyBlok(induk, blok, rata, formats, kedalaman) {
  if (kedalaman > 30) return;
  let aktif = [];
  const tuntas = function () {
    if (aktif.length) { blok.push(rata ? { t: 'p', a: rata, c: pyBungkus(aktif, formats) } : { t: 'p', c: pyBungkus(aktif, formats) }); aktif = []; }
  };
  for (let c = induk.firstChild; c; c = c.nextSibling) {
    if (c.nodeType === 3) { pyInline(c, aktif, 0); continue; }
    if (c.nodeType !== 1) continue;
    const tag = c.tagName.toUpperCase();
    if (PY_ABAIKAN[tag]) continue;
    if (c.getAttribute('data-ky')) { pyInline(c, aktif, 0); continue; }
    if (tag === 'UL' || tag === 'OL') { tuntas(); pyDaftar(c, blok, formats.concat(pyFormatGaya(c))); continue; }
    if (PY_BLOK[tag]) {
      tuntas();
      const fm = formats.concat(pyFormatGaya(c));
      if (PY_TAG_FORMAT[tag]) fm.push(PY_TAG_FORMAT[tag]);
      if (/^H[1-6]$/.test(tag)) fm.push('b');
      pyBlok(c, blok, pyRata(c) || rata, fm, kedalaman + 1);
      continue;
    }
    pyInline(c, aktif, 0);
  }
  tuntas();
}

function pyDomKePohon(akar) {
  const blok = [];
  pyBlok(akar, blok, '', [], 0);
  return blok;
}

function bacaKaya(ed, opsi) {
  return Kaya.bersihkan(pyDomKePohon(ed), Object.assign({ media: function () { return true; } }, opsi));
}

function pyNilaiDariHtml(html) {
  const doc = new DOMParser().parseFromString(String(html), 'text/html');
  return Kaya.bersihkan(pyDomKePohon(doc.body), { maks: 20000 });
}


function pySisipHtml(ed, html, sebaris) {
  ed.focus();
  if (!sebaris) {
    let ok = false;
    try { ok = document.execCommand('insertHTML', false, html); } catch (e) { ok = false; }
    if (ok) return;
  }
  const sel = window.getSelection ? window.getSelection() : null;
  if (!sel) return;
  if (!sel.rangeCount || !ed.contains(sel.getRangeAt(0).startContainer)) pyKursorAkhir(ed);
  const r = sel.getRangeAt(0);
  r.deleteContents();
  const t = document.createElement('template');
  t.innerHTML = html;
  const frag = t.content;
  const akhir = frag.lastChild;
  r.insertNode(frag);
  if (akhir) { r.setStartAfter(akhir); r.collapse(true); sel.removeAllRanges(); sel.addRange(r); }
}
function pySisipTeks(ed, teks) {
  ed.focus();
  let ok = false;
  try { ok = document.execCommand('insertText', false, teks); } catch (e) { ok = false; }
  if (!ok) pySisipHtml(ed, esc(teks), true);
}
function pyHtmlSisipan(nilai) {
  const pohon = Kaya.pohon(nilai);
  if (!pohon.length) return { html: '', sebaris: true };
  if (pohon.length === 1 && pohon[0].t === 'p' && !pohon[0].a) return { html: kayaIsi(pohon[0].c, { penyunting: true }), sebaris: true };
  return { html: String(kayaHtmlPenyunting(nilai)), sebaris: false };
}


function pyPastikanParagraf(ed) {
  const sel = pyBacaSeleksi(ed);
  let berubah = false;
  let p = null;
  Array.prototype.slice.call(ed.childNodes).forEach(function (n) {
    const blok = n.nodeType === 1 && /^(P|DIV|UL|OL|H[1-6]|BLOCKQUOTE|PRE|TABLE)$/.test(n.tagName);
    if (blok) { p = null; return; }
    if (n.nodeType === 3 && !n.nodeValue.trim() && !p) return;
    if (!p) { p = document.createElement('p'); ed.insertBefore(p, n); }
    p.appendChild(n);
    berubah = true;
  });
  if (berubah) pyPulihkanSeleksi(ed, sel);
}
function pyBlokTerpilih(ed) {
  const sel = window.getSelection ? window.getSelection() : null;
  if (!sel || !sel.rangeCount) return [];
  const r = sel.getRangeAt(0);
  return Array.prototype.filter.call(ed.children, function (b) { try { return r.intersectsNode(b); } catch (e) { return false; } });
}
function pyRataBlok(b) {
  if (b.classList.contains('ky-rata-c')) return 'c';
  if (b.classList.contains('ky-rata-r')) return 'r';
  if (b.classList.contains('ky-rata-j')) return 'j';
  return '';
}
function pyTerapkanRata(ed, rata) {
  pyPastikanParagraf(ed);
  pyBlokTerpilih(ed).forEach(function (b) {
    if (b.tagName === 'UL' || b.tagName === 'OL') return;
    Object.keys(PY_RATA).forEach(function (k) { if (PY_RATA[k]) b.classList.remove('ky-rata-' + PY_RATA[k]); });
    b.style.textAlign = '';
    b.removeAttribute('align');
    if (rata) b.classList.add('ky-rata-' + rata);
    if (!b.getAttribute('class')) b.removeAttribute('class');
    if (!b.getAttribute('style')) b.removeAttribute('style');
  });
}


function pyPerbaruiBilah(ed) {
  const bar = pyBilah(ed);
  if (!bar) return;
  const s = pyKeadaan(ed);
  const aktif = document.activeElement === ed;
  semua('[data-pb]', bar).forEach(function (b) {
    const id = b.getAttribute('data-pb');
    if (id === 'undo') { b.setAttribute('aria-disabled', s.idx <= 0 && !s.pewaktu ? 'true' : 'false'); return; }
    if (id === 'redo') { b.setAttribute('aria-disabled', s.idx >= s.riwayat.length - 1 ? 'true' : 'false'); return; }
    if (id in PY_RATA) {
      const blok = aktif ? pyBlokTerpilih(ed)[0] : null;
      b.setAttribute('aria-pressed', blok && blok.tagName === 'P' && pyRataBlok(blok) === PY_RATA[id] ? 'true' : 'false');
      return;
    }
    const pr = PY_PERINTAH[id];
    if (!pr) return;
    let tekan = false;
    if (aktif) { try { tekan = !!document.queryCommandState(pr); } catch (e) { tekan = false; } }
    b.setAttribute('aria-pressed', tekan ? 'true' : 'false');
  });
}

function pyJalankan(ed, id) {
  ed.focus();
  const s = pyKeadaan(ed);
  if (document.activeElement !== ed || !pyBacaSeleksi(ed)) { if (s.seleksi) pyPulihkanSeleksi(ed, s.seleksi); else pyKursorAkhir(ed); }
  if (id === 'undo') { pyUrung(ed); pyPerbaruiBilah(ed); return; }
  if (id === 'redo') { pyUlang(ed); pyPerbaruiBilah(ed); return; }
  if (id === 'frac' || id === 'sqrt') { pyBukaDialog(ed, id, null); return; }
  if (id === 'gambar') { gambarBuka(ed, null); return; }
  if (id in PY_RATA) {
    pyTutupWaktu(ed);
    pyCatat(ed);
    pyTerapkanRata(ed, PY_RATA[id]);
    pyCatat(ed);
    pyPerbaruiBilah(ed);
    return;
  }
  const pr = PY_PERINTAH[id];
  if (!pr) return;
  pyTutupWaktu(ed);
  pyCatat(ed);
  try { document.execCommand('styleWithCSS', false, false); } catch (e) {   }
  try { document.execCommand(pr, false, null); } catch (e) {   }
  pyTandaiKosong(ed);
  pyCatat(ed);
  pyPerbaruiBilah(ed);
}

function pyUmumkan(teks) { try { if (typeof umumkan === 'function') umumkan(teks); } catch (e) {   } }


function pyTeksPendek(arr) { return Kaya._teksSebaris(Array.isArray(arr) ? Kaya.pohon([{ t: 'p', c: arr }]).reduce(function (a, b) { return a.concat(b.c || []); }, []) : []); }

function pyBukaDialog(ed, jenis, atom) {
  const s = pyKeadaan(ed);
  const seleksi = pyBacaSeleksi(ed) || s.seleksi;
  const awal = { n: '', d: '', c: '' };
  if (atom && jenis === 'frac') { awal.n = pyTeksPendek(pyJson(atom.getAttribute('data-n'))); awal.d = pyTeksPendek(pyJson(atom.getAttribute('data-d'))); }
  if (atom && jenis === 'sqrt') awal.c = pyTeksPendek(pyJson(atom.getAttribute('data-c')));
  pyDialog = { ed: ed, jenis: jenis, atom: atom, seleksi: seleksi };
  const judul = (atom ? 'Ubah ' : 'Sisipkan ') + (jenis === 'frac' ? 'pecahan' : 'akar');
  const isian = jenis === 'frac'
    ? h`<div class="isian"><label for="py-n">Pembilang (angka di atas)</label><input class="kontrol" id="py-n" name="n" type="text" maxlength="60" autocomplete="off" data-masuk="py-pratinjau" value="${awal.n}"></div>
        <div class="isian"><label for="py-d">Penyebut (angka di bawah)</label><input class="kontrol" id="py-d" name="d" type="text" maxlength="60" autocomplete="off" data-masuk="py-pratinjau" value="${awal.d}"></div>`
    : h`<div class="isian"><label for="py-c">Isi akar (angka di bawah tanda √)</label><input class="kontrol" id="py-c" name="c" type="text" maxlength="60" autocomplete="off" data-masuk="py-pratinjau" value="${awal.c}"></div>`;
  const api = modal({
    judul: judul,
    badan: h`<form id="f-matematika" data-kirim="py-matematika" novalidate class="dialog-matematika"><div data-galat aria-live="polite"></div>${isian}
      <div><p class="palet-judul">Pratinjau</p><div class="pratinjau ky" id="py-pratinjau" aria-live="polite"></div></div></form>`,
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'ok', label: atom ? 'Simpan perubahan' : 'Sisipkan', gaya: 'utama', tipe: 'submit', form: 'f-matematika' }]
  });
  pyDialog.api = api;
  pyPratinjau(el('#f-matematika', api.el));
  api.selesai.then(function () { pyDialog = null; try { ed.focus(); } catch (e) {   } });
}

function pyNodeDari(form, jenis) {
  const v = nilaiForm(form);
  return jenis === 'frac' ? { t: 'frac', n: [v.n || ''], d: [v.d || ''] } : { t: 'sqrt', c: [v.c || ''] };
}
function pyPratinjau(form) {
  const w = el('#py-pratinjau', form.ownerDocument || document);
  if (!w || !pyDialog) return;
  const pohon = Kaya.pohon([{ t: 'p', c: [pyNodeDari(form, pyDialog.jenis)] }]);
  if (pohon.length) pasang(w, mentah(kayaIsi(pohon[0].c, {}))); else pasang(w, h`<span class="teks-redam">Isi kolom di atas untuk melihat hasilnya.</span>`);
}
MASUKAN['py-pratinjau'] = function (r) { if (r.form) pyPratinjau(r.form); };

KIRIM['py-matematika'] = function (form) {
  const st = pyDialog;
  if (!st) return;
  bersihGalat(form);
  const v = nilaiForm(form);
  if (st.jenis === 'frac') {
    if (!v.n) { galatIsian(form, 'n', 'Pembilang belum diisi.'); return; }
    if (!v.d) { galatIsian(form, 'd', 'Penyebut belum diisi.'); return; }
  } else if (!v.c) { galatIsian(form, 'c', 'Isi akar belum diisi.'); return; }
  const pohon = Kaya.pohon([{ t: 'p', c: [pyNodeDari(form, st.jenis)] }]);
  if (!pohon.length || !pohon[0].c.length) { galatForm(form, 'Isian tidak bisa diubah menjadi rumus.'); return; }
  const atom = kayaIsi(pohon[0].c, { penyunting: true });
  const ed = st.ed;
  st.api.tutup('ok');
  pyTutupWaktu(ed);
  pyCatat(ed);
  if (st.atom && ed.contains(st.atom)) {
    st.atom.insertAdjacentHTML('afterend', atom);
    st.atom.parentNode.removeChild(st.atom);
  } else {
    ed.focus();
    pyPulihkanSeleksi(ed, st.seleksi);
    pySisipHtml(ed, atom + '&nbsp;', true);
  }
  pyTandaiKosong(ed);
  pyCatat(ed);
  pyUmumkan((st.atom ? 'Rumus diubah.' : 'Rumus disisipkan.'));
};


function pyAktifkanIsian(ed) {
  ed.setAttribute('data-py-siap', '1');
  try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (e) {   }
  const s = pyKeadaan(ed);
  pyTandaiKosong(ed);
  pyCatat(ed);

  ed.addEventListener('input', function () {
    pyTandaiKosong(ed);
    if (s.pewaktu) clearTimeout(s.pewaktu);
    s.pewaktu = setTimeout(function () { s.pewaktu = null; pyCatat(ed); pyPerbaruiBilah(ed); }, 350);
    pyPerbaruiBilah(ed);
  });
  ed.addEventListener('focus', function () {
    const bar = pyBilah(ed);
    if (bar) { bar.__aktif = ed; bar.__pernahFokus = true; }
    pyAktifGlobal = ed;
    pyPerbaruiBilah(ed);
  });
  ed.addEventListener('blur', function () { s.seleksi = pyBacaSeleksi(ed) || s.seleksi; });

  ed.addEventListener('beforeinput', function (e) {
    if (e.inputType === 'historyUndo') { e.preventDefault(); pyUrung(ed); pyPerbaruiBilah(ed); } else if (e.inputType === 'historyRedo') { e.preventDefault(); pyUlang(ed); pyPerbaruiBilah(ed); }
  });
  ed.addEventListener('keydown', function (e) {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && !e.altKey && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); if (e.shiftKey) pyUlang(ed); else pyUrung(ed); pyPerbaruiBilah(ed); return; }
    if (mod && !e.altKey && (e.key === 'y' || e.key === 'Y')) { e.preventDefault(); pyUlang(ed); pyPerbaruiBilah(ed); return; }
    const atom = e.target && e.target.closest ? e.target.closest('[data-ky]') : null;
    if (atom && ed.contains(atom) && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pyBukaAtom(ed, atom); }
  });
  ed.addEventListener('click', function (e) {
    const atom = e.target && e.target.closest ? e.target.closest('[data-ky]') : null;
    if (atom && ed.contains(atom)) { e.preventDefault(); pyBukaAtom(ed, atom); }
  });

  ed.addEventListener('paste', function (e) {
    e.preventDefault();
    const dt = e.clipboardData || window.clipboardData;
    if (!dt) return;
    let nilai = '';
    try { const html = dt.getData('text/html'); if (html) nilai = pyNilaiDariHtml(html); } catch (er) { nilai = ''; }
    if (!nilai) { try { nilai = Kaya.bersihkan(String(dt.getData('text/plain') || dt.getData('Text') || ''), { maks: 20000 }); } catch (er2) { nilai = ''; } }
    if (!nilai) return;
    pyTutupWaktu(ed);
    pyCatat(ed);
    const sis = pyHtmlSisipan(nilai);
    pySisipHtml(ed, sis.html, sis.sebaris);
    pyTandaiKosong(ed);
    pyCatat(ed);
  });
  ed.addEventListener('drop', function (e) {
    e.preventDefault();
    const dt = e.dataTransfer;
    const teks = dt ? String(dt.getData('text/plain') || '') : '';
    if (!teks) return;
    let nilai = '';
    try { nilai = Kaya.bersihkan(teks, { maks: 20000 }); } catch (er) { nilai = ''; }
    if (nilai) { pyTutupWaktu(ed); pyCatat(ed); const sis = pyHtmlSisipan(nilai); pySisipHtml(ed, sis.html, sis.sebaris); pyTandaiKosong(ed); pyCatat(ed); }
  });
  ed.addEventListener('dragover', function (e) { e.preventDefault(); });
}

function pyBukaAtom(ed, atom) {
  const jenis = atom.getAttribute('data-ky');
  if (jenis === 'frac' || jenis === 'sqrt') pyBukaDialog(ed, jenis, atom);
  else if (jenis === 'img') gambarBukaUbah(ed, atom);
}

function pyAktifkanBilah(bar) {
  bar.setAttribute('data-py-siap', '1');
  const tombol = function () { return semua('button.pb-tombol', bar).filter(function (b) { return b.offsetParent !== null; }); };
  const awal = el('[data-pb]', bar); if (awal) awal.setAttribute('tabindex', '0');
  const jaga = function (e) { if (e.target.closest && e.target.closest('button.pb-tombol')) e.preventDefault(); };
  bar.addEventListener('pointerdown', jaga);
  bar.addEventListener('mousedown', jaga);
  bar.addEventListener('click', function (e) {
    const b = e.target.closest ? e.target.closest('button.pb-tombol') : null;
    if (!b || b.getAttribute('aria-disabled') === 'true') return;
    let ed = bar.__aktif;
    if (!ed || !ed.isConnected) { ed = el('[data-penyunting]', bar.closest('form') || document); bar.__aktif = ed; }
    if (!ed) return;
    const sim = b.getAttribute('data-py-simbol');
    if (sim) { pyTutupWaktu(ed); pyCatat(ed); pySisipTeks(ed, sim); pyTandaiKosong(ed); pyCatat(ed); pyUmumkan('Disisipkan ' + sim); return; }
    const id = b.getAttribute('data-pb');
    if (id === 'simbol') {
      const p = el('#py-simbol', bar);
      const buka = p.hasAttribute('hidden');
      if (buka) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
      b.setAttribute('aria-expanded', buka ? 'true' : 'false');
      return;
    }
    pyJalankan(ed, id);
  });
  bar.addEventListener('keydown', function (e) {
    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].indexOf(e.key) < 0) return;
    const daftar = tombol();
    const i = daftar.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    let k = i;
    if (e.key === 'ArrowRight') k = (i + 1) % daftar.length; else if (e.key === 'ArrowLeft') k = (i - 1 + daftar.length) % daftar.length; else if (e.key === 'Home') k = 0; else k = daftar.length - 1;
    daftar.forEach(function (b) { b.setAttribute('tabindex', '-1'); });
    daftar[k].setAttribute('tabindex', '0');
    daftar[k].focus();
  });
}

function aktifkanPenyunting(akar) {
  semua('[data-penyunting-bar]:not([data-py-siap])', akar).forEach(pyAktifkanBilah);
  semua('[data-penyunting]:not([data-py-siap])', akar).forEach(function (ed) {
    pyAktifkanIsian(ed);
    const bar = pyBilah(ed);
    if (bar && (!bar.__aktif || !bar.__aktif.isConnected)) bar.__aktif = ed;
    if (bar && !bar.__pernahFokus && ed.hasAttribute('data-py-utama')) bar.__aktif = ed;
    const lid = ed.getAttribute('aria-labelledby');
    const lab = lid ? document.getElementById(lid) : null;
    if (lab) lab.addEventListener('click', function () { ed.focus(); });
  });
}

document.addEventListener('selectionchange', function () {
  const ed = pyAktifGlobal;
  if (!ed || !document.body.contains(ed)) return;
  if (document.activeElement === ed) { pyKeadaan(ed).seleksi = pyBacaSeleksi(ed) || pyKeadaan(ed).seleksi; pyPerbaruiBilah(ed); }
});

function galatKaya(ed, pesan) {
  const kolom = ed.closest('.isian') || ed.parentNode;
  semua('.galat-isian', kolom).forEach(function (n) { n.parentNode.removeChild(n); });
  const id = 'ge' + (++urutGalat);
  const p = document.createElement('p');
  p.className = 'galat-isian';
  p.id = id;
  p.setAttribute('role', 'alert');
  pasang(p, h`${ikon('alert-circle')}<span>${pesan}</span>`);
  kolom.appendChild(p);
  ed.setAttribute('aria-invalid', 'true');
  ed.setAttribute('aria-describedby', id);
  try { ed.focus(); } catch (e) {   }
}


const GB_TIPE = { 'image/jpeg': true, 'image/png': true, 'image/webp': true };
const GB_SISI = 1280;
const GB_BYTE_MAKS = 4 * 1024 * 1024;
const GB_ASAL_MAKS = 30 * 1024 * 1024;
const GB_KECIL = 400 * 1024;

const gbSt = { ed: null, seleksi: null, atom: null, api: null, mapel: 'MAT', mode: 'unggah', q: '', halaman: 1, data: null, seq: 0, hasil: null, memproses: 0, nama: '' };

function gbUkuranTeks(byte) {
  if (byte >= 1048576) return formatAngka(byte / 1048576, 1) + ' MB';
  return formatAngka(Math.max(1, Math.round(byte / 1024)), 0) + ' KB';
}


function gbMuat(file) {
  const lewatImg = function () {
    return new Promise(function (ok, no) {
      const url = URL.createObjectURL(file);
      const im = new Image();
      im.onload = function () { ok({ sumber: im, lebar: im.naturalWidth, tinggi: im.naturalHeight, bersihkan: function () { URL.revokeObjectURL(url); } }); };
      im.onerror = function () { URL.revokeObjectURL(url); no(galat('FORMAT', 'Berkas ini tidak bisa dibaca sebagai gambar. Coba gambar lain.')); };
      im.src = url;
    });
  };
  if (typeof window.createImageBitmap === 'function') {
    return window.createImageBitmap(file).then(function (bm) {
      return { sumber: bm, lebar: bm.width, tinggi: bm.height, bersihkan: function () { try { bm.close(); } catch (e) {   } } };
    }, function () { return lewatImg(); });
  }
  return lewatImg();
}
function gbKode(kanvas, tipe, mutu) {
  return new Promise(function (ok) {
    try { kanvas.toBlob(function (b) { ok(b); }, tipe, mutu); } catch (e) { ok(null); }
  });
}

function gbKompres(file) {
  const tipeAsal = String(file.type || '').toLowerCase();
  if (!GB_TIPE[tipeAsal]) return Promise.reject(galat('FORMAT', 'Jenis berkas tidak didukung. Pilih gambar JPG, PNG, atau WebP.'));
  if (file.size > GB_ASAL_MAKS) return Promise.reject(galat('UKURAN', 'Berkas terlalu besar (maksimal 30 MB sebelum dikecilkan).'));
  let muat = null;
  return gbMuat(file).then(function (m) {
    muat = m;
    const w0 = m.lebar, h0 = m.tinggi;
    if (!(w0 > 0 && h0 > 0)) throw galat('FORMAT', 'Berkas ini tidak bisa dibaca sebagai gambar. Coba gambar lain.');
    const skala = Math.min(1, GB_SISI / Math.max(w0, h0));
    if (tipeAsal !== 'image/jpeg' && skala === 1 && file.size <= GB_KECIL) return { blob: file, tipe: tipeAsal, lebar: w0, tinggi: h0 };
    const w = Math.max(1, Math.round(w0 * skala)), hh = Math.max(1, Math.round(h0 * skala));
    const kanvas = document.createElement('canvas');
    kanvas.width = w; kanvas.height = hh;
    const g = kanvas.getContext('2d');
    if (!g) throw galat('FORMAT', 'Peramban ini tidak bisa mengecilkan gambar. Pakai peramban lain atau kecilkan gambar lebih dulu.');
    g.imageSmoothingQuality = 'high';
    g.drawImage(m.sumber, 0, 0, w, hh);
    const hasil = function (blob, tipe) { return { blob: blob, tipe: tipe, lebar: w, tinggi: hh }; };
    const mutuBerturut = function (tipe, daftar, i) {
      return gbKode(kanvas, tipe, daftar[i]).then(function (b) {
        if (!b || b.type !== tipe) return null;
        if (b.size <= GB_BYTE_MAKS) return hasil(b, tipe);
        return i + 1 < daftar.length ? mutuBerturut(tipe, daftar, i + 1) : Promise.reject(galat('UKURAN', 'Gambar masih terlalu besar setelah dikecilkan (maksimal 4 MB). Pilih gambar lain.'));
      });
    };
    return mutuBerturut('image/webp', [0.86, 0.7, 0.55, 0.4], 0).then(function (r) {
      if (r) return r;
      g.globalCompositeOperation = 'destination-over';
      g.fillStyle = '#ffffff';
      g.fillRect(0, 0, w, hh);
      return mutuBerturut('image/jpeg', [0.88, 0.75, 0.6, 0.45], 0).then(function (r2) {
        if (r2) return r2;
        throw galat('FORMAT', 'Peramban ini tidak bisa menyimpan gambar yang sudah dikecilkan. Pakai peramban lain.');
      });
    });
  }).then(function (r) { if (muat) muat.bersihkan(); return r; }, function (e) { if (muat) muat.bersihkan(); throw e; });
}
function gbBase64(blob) {
  return new Promise(function (ok, no) {
    const r = new FileReader();
    r.onload = function () { const s = String(r.result); ok(s.slice(s.indexOf(',') + 1)); };
    r.onerror = function () { no(galat('FORMAT', 'Gagal membaca gambar.')); };
    r.readAsDataURL(blob);
  });
}


function gbIsiUnggah() {
  return h`<form id="f-gambar" data-kirim="gb-unggah" novalidate>
    <div data-galat aria-live="polite"></div>
    <div class="isian"><label for="gb-berkas">Pilih gambar</label>
      <input class="kontrol" id="gb-berkas" name="berkas" type="file" accept="image/jpeg,image/png,image/webp" data-masuk="gb-berkas" aria-describedby="gb-berkas-b">
      <p class="bantu" id="gb-berkas-b">JPG, PNG, atau WebP. Gambar dikecilkan otomatis hingga ${GB_SISI} piksel; hasilnya maksimal 4 MB.</p></div>
    <div class="gb-pratinjau" id="gb-pratinjau" aria-live="polite"></div>
    <div class="isian"><label for="gb-alt">Teks pengganti gambar</label>
      <input class="kontrol" id="gb-alt" name="alt" type="text" maxlength="300" autocomplete="off" aria-describedby="gb-alt-b" placeholder="Contoh: Segitiga siku-siku dengan sisi 3 cm, 4 cm, dan 5 cm">
      <p class="bantu" id="gb-alt-b">Jelaskan isi gambar singkat dan jelas. Dibacakan pembaca layar dan tampil bila gambar gagal dimuat. Jangan menuliskan kunci jawaban.</p></div>
    <label class="gb-hiasan"><input type="checkbox" name="hiasan" data-masuk="gb-hiasan"><span>Gambar ini hanya hiasan (tidak perlu teks pengganti)</span></label>
    <div class="gb-aksi"><button type="submit" class="tombol tombol-utama" id="gb-kirim">${ikon('upload')}<span>Unggah dan sisipkan</span></button></div>
  </form>`;
}

function gbIsiSaya() {
  return h`<div class="gb-alat">
      <div class="isian tanpa-margin"><label for="gb-cari" class="sr-only">Cari gambar</label><input class="kontrol" id="gb-cari" type="search" maxlength="100" placeholder="Cari nama atau teks pengganti" autocomplete="off" data-masuk="gb-cari" value="${gbSt.q}"></div>
      <span class="bantu" id="gb-hitung" aria-live="polite"></span>
    </div>
    <div id="gb-daftar" aria-busy="true"></div>
    <div class="ambil-halaman" id="gb-halaman"></div>`;
}

function gbBadan() {
  return h`<div class="segmen gb-segmen" role="radiogroup" aria-label="Sumber gambar">
      <label>${ikon('check')}<input type="radio" name="gb-mode" value="unggah" data-masuk="gb-mode"${gbSt.mode === 'unggah' ? mentah(' checked') : ''}> Unggah baru</label>
      <label>${ikon('check')}<input type="radio" name="gb-mode" value="saya" data-masuk="gb-mode"${gbSt.mode === 'saya' ? mentah(' checked') : ''}> Gambar saya</label>
    </div>
    <div id="gb-isi">${gbSt.mode === 'unggah' ? gbIsiUnggah() : gbIsiSaya()}</div>`;
}

function gambarBuka(ed, atom) {
  const s = pyKeadaan(ed);
  gbSt.ed = ed;
  gbSt.seleksi = pyBacaSeleksi(ed) || s.seleksi;
  gbSt.atom = atom || null;
  gbSt.mode = 'unggah';
  gbSt.q = ''; gbSt.halaman = 1; gbSt.data = null; gbSt.hasil = null; gbSt.nama = '';
  gbSt.mapel = (typeof edSt !== 'undefined' && edSt.paket && edSt.paket.mapel) || 'MAT';
  gbSt.api = modal({
    judul: atom ? 'Ganti gambar' : 'Sisipkan gambar', lebar: true, badan: gbBadan(),
    aksi: [{ id: 'tutup', label: 'Tutup', gaya: 'diam' }]
  });
  const api = gbSt.api;
  api.selesai.then(function () {
    if (gbSt.api === api) { gbSt.api = null; gbSt.seq++; }
    try { ed.focus(); } catch (e) {   }
  });
}

MASUKAN['gb-mode'] = function (r) {
  if (!r.checked || !gbSt.api) return;
  gbSt.mode = r.value;
  pasang(el('#gb-isi', gbSt.api.el), r.value === 'unggah' ? gbIsiUnggah() : gbIsiSaya());
  if (r.value === 'saya') gbMuatDaftar();
};

MASUKAN['gb-hiasan'] = function (r) {
  const alt = el('#gb-alt', gbSt.api ? gbSt.api.el : document);
  if (!alt) return;
  alt.disabled = r.checked;
  if (r.checked) alt.value = '';
};

MASUKAN['gb-berkas'] = function (r) {
  const form = r.form;
  const kotak = el('#gb-pratinjau', form);
  gbSt.hasil = null;
  bersihGalat(form);
  const file = r.files && r.files[0];
  if (!file) { pasang(kotak, h``); return; }
  const nomor = ++gbSt.memproses;
  pasang(kotak, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Memeriksa dan mengecilkan gambar…</p>`);
  gbKompres(file).then(function (hsl) {
    if (nomor !== gbSt.memproses || !document.body.contains(form)) return;
    gbSt.hasil = hsl;
    gbSt.nama = file.name || 'gambar';
    const url = URL.createObjectURL(hsl.blob);
    pasang(kotak, h`<figure class="gb-fig"><img src="${url}" alt="Pratinjau gambar yang dipilih" width="${hsl.lebar}" height="${hsl.tinggi}"><figcaption class="bantu">${formatAngka(hsl.lebar, 0)} × ${formatAngka(hsl.tinggi, 0)} piksel · ${gbUkuranTeks(hsl.blob.size)}${hsl.blob.size < file.size ? ' (dari ' + gbUkuranTeks(file.size) + ')' : ''}</figcaption></figure>`);
    const gam = el('img', kotak);
    if (gam) gam.addEventListener('load', function () { try { URL.revokeObjectURL(url); } catch (e) {   } });
  }).catch(function (e) {
    if (nomor !== gbSt.memproses || !document.body.contains(form)) return;
    pasang(kotak, h``);
    r.value = '';
    galatIsian(form, 'berkas', e.kode === 'FORMAT' || e.kode === 'UKURAN' ? e.message : 'Gambar tidak bisa diproses. Coba gambar lain.');
  });
};

KIRIM['gb-unggah'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  if (gbSt.memproses && !gbSt.hasil && el('#gb-berkas', form).files.length) { galatIsian(form, 'berkas', 'Tunggu sebentar, gambar sedang dikecilkan.'); return; }
  if (!gbSt.hasil) { galatIsian(form, 'berkas', 'Pilih gambar dulu.'); return; }
  const hiasan = !!v.hiasan;
  const alt = hiasan ? '' : String(v.alt || '').replace(/\s+/g, ' ').trim();
  if (!hiasan && !alt) { galatIsian(form, 'alt', 'Isi teks pengganti gambar, atau centang "hanya hiasan".'); return; }
  const hsl = gbSt.hasil;
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(el('#gb-kirim', form), function () {
    return gbBase64(hsl.blob).then(function (b64) {
      return panggil('media.unggah', { mapel: gbSt.mapel, nama: gbSt.nama, tipe: hsl.tipe, alt: alt, data: b64 });
    }).then(function (res) {
      gbSisipkan(res.media, alt);
    });
  }).catch(function (e) {
    if (['VALIDASI', 'FORMAT', 'UKURAN', 'UKURAN_PIKSEL', 'BATAS', 'DRIVE', 'BAGI_DITOLAK', 'BELUM_PASANG', 'PERMINTAAN'].indexOf(e.kode) >= 0) galatForm(form, e.message); else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};

function gbSisipkan(info, alt) {
  mediaGabung({ [info.id]: { u: info.url, w: info.lebar, h: info.tinggi } });
  const html = kayaIsi([{ t: 'img', m: info.id, alt: alt }], { penyunting: true });
  const ed = gbSt.ed, atom = gbSt.atom, seleksi = gbSt.seleksi;
  if (gbSt.api) gbSt.api.tutup('ok');
  if (!ed || !document.body.contains(ed)) return;
  pyTutupWaktu(ed);
  pyCatat(ed);
  if (atom && ed.contains(atom)) {
    atom.insertAdjacentHTML('afterend', html);
    atom.parentNode.removeChild(atom);
  } else {
    ed.focus();
    pyPulihkanSeleksi(ed, seleksi);
    pySisipHtml(ed, html + '&nbsp;', true);
  }
  pyTandaiKosong(ed);
  pyCatat(ed);
  pyUmumkan(atom ? 'Gambar diganti.' : 'Gambar disisipkan.');
}


function gbMuatDaftar() {
  if (!gbSt.api) return;
  const nomor = ++gbSt.seq;
  const wadah = el('#gb-daftar', gbSt.api.el);
  if (wadah) wadah.setAttribute('aria-busy', 'true');
  panggil('media.daftar', { q: gbSt.q, halaman: gbSt.halaman }, { ulang: true }).then(function (d) {
    if (nomor !== gbSt.seq || !gbSt.api) return;
    gbSt.data = d;
    gbSt.halaman = d.halaman;
    const peta = {};
    d.hasil.forEach(function (m) { peta[m.id] = { u: m.url, w: m.lebar, h: m.tinggi }; });
    mediaGabung(peta);
    gbGambarDaftar();
  }).catch(function (e) {
    if (nomor !== gbSt.seq || !gbSt.api) return;
    const w = el('#gb-daftar', gbSt.api.el);
    if (w) { w.removeAttribute('aria-busy'); pasang(w, h`<p class="galat-isian" role="alert">${ikon('alert-circle')}<span>${e.message}</span></p>`); }
  });
}

function gbGambarDaftar() {
  const api = gbSt.api, d = gbSt.data;
  if (!api || !d) return;
  const wadah = el('#gb-daftar', api.el);
  if (!wadah) return;
  wadah.removeAttribute('aria-busy');
  const hit = el('#gb-hitung', api.el);
  if (hit) hit.textContent = formatAngka(d.total, 0) + ' gambar · batas ' + formatAngka(d.kuota, 0) + ' per akun';
  if (!d.total) {
    pasang(wadah, h`<div class="kosong"><span class="ikon-bulat netral">${ikon('image')}</span><h3>${gbSt.q ? 'Tidak ada gambar yang cocok' : 'Belum ada gambar'}</h3><p>${gbSt.q ? 'Ubah kata kunci pencarian.' : 'Gambar yang Anda unggah akan tersimpan di sini dan bisa dipakai lagi di soal lain.'}</p></div>`);
    pasang(el('#gb-halaman', api.el), h``);
    return;
  }
  pasang(wadah, h`<ul class="gb-daftar" aria-label="Gambar saya">${d.hasil.map(function (m) {
    const dipakai = m.dipakai | 0;
    return h`<li class="gb-butir">
      <div class="gb-kecil"><img src="${urlHttps(m.url)}" alt="" width="${m.lebar}" height="${m.tinggi}" loading="lazy" decoding="async"></div>
      <div class="gb-info">
        <strong class="gb-nama">${m.nama}</strong>
        <span class="bantu">${formatAngka(m.lebar, 0)} × ${formatAngka(m.tinggi, 0)} piksel · ${gbUkuranTeks(m.ukuran)} · ${MAPEL[m.mapel] || m.mapel}${m.namaPemilik ? ' · oleh ' + m.namaPemilik : ''}</span>
        ${m.alt ? h`<span class="bantu gb-alt">Teks pengganti: ${m.alt}</span>` : h`<span class="bantu gb-alt">Belum ada teks pengganti bawaan</span>`}
        <span class="lencana ${dipakai ? 'lencana-info' : ''}">${dipakai ? 'Dipakai di ' + formatAngka(dipakai, 0) + ' soal' : 'Belum dipakai'}</span>
      </div>
      <div class="gb-tindak">
        <button type="button" class="tombol tombol-utama" data-aksi="gb-pilih" data-id="${m.id}" aria-label="Sisipkan gambar ${m.nama}">${ikon('plus')}<span>Sisipkan</span></button>
        <button type="button" class="tombol tombol-diam" data-aksi="gb-hapus" data-id="${m.id}" aria-label="${dipakai ? 'Hapus gambar ' + m.nama + ' (tidak bisa: masih dipakai di ' + dipakai + ' soal)' : 'Hapus gambar ' + m.nama}"${dipakai ? mentah(' data-dipakai="ya"') : ''}>${ikon('trash')}<span>Hapus</span></button>
      </div>
    </li>`;
  })}</ul>`);
  pasang(el('#gb-halaman', api.el), d.jumlahHalaman > 1 ? h`
    <button type="button" class="tombol tombol-diam" data-aksi="gb-halaman" data-ke="${d.halaman - 1}"${d.halaman <= 1 ? mentah(' aria-disabled="true"') : ''}>${ikon('chevron-left')}<span>Sebelumnya</span></button>
    <span class="teks-redam" aria-live="polite">Halaman ${formatAngka(d.halaman, 0)} dari ${formatAngka(d.jumlahHalaman, 0)}</span>
    <button type="button" class="tombol tombol-diam" data-aksi="gb-halaman" data-ke="${d.halaman + 1}"${d.halaman >= d.jumlahHalaman ? mentah(' aria-disabled="true"') : ''}><span>Berikutnya</span>${ikon('chevron-right')}</button>` : h``);
}

let gbPewaktuCari = null;
MASUKAN['gb-cari'] = function (r) {
  gbSt.q = r.value.trim();
  gbSt.halaman = 1;
  if (gbPewaktuCari) clearTimeout(gbPewaktuCari);
  gbPewaktuCari = setTimeout(function () { gbPewaktuCari = null; gbMuatDaftar(); }, 300);
};
AKSI['gb-halaman'] = function (b) {
  const ke = parseInt(b.getAttribute('data-ke'), 10);
  if (!(ke >= 1)) return;
  gbSt.halaman = ke;
  gbMuatDaftar();
};
AKSI['gb-pilih'] = function (b) {
  const id = b.getAttribute('data-id');
  const m = gbSt.data && gbSt.data.hasil.filter(function (x) { return x.id === id; })[0];
  if (!m) return;
  gbSisipkan(m, m.alt || '');
};
AKSI['gb-hapus'] = function (b) {
  const id = b.getAttribute('data-id');
  const m = gbSt.data && gbSt.data.hasil.filter(function (x) { return x.id === id; })[0];
  if (!m) return;
  if ((m.dipakai | 0) > 0) { toast('Gambar ini masih dipakai di ' + (m.dipakai | 0) + ' soal. Hapus atau ganti gambar itu dari soal-soalnya lebih dulu.', 'info'); return; }
  konfirmasi({ judul: 'Hapus gambar "' + m.nama + '"?', ya: 'Hapus gambar', bahaya: true, pesan: 'Gambar dihapus permanen dari penyimpanan. Gambar yang masih dipakai soal tidak bisa dihapus.' }).then(function (ya) {
    if (!ya) return;
    panggil('media.hapus', { id: id }).then(function () {
      toast('Gambar dihapus.', 'sukses');
      gbMuatDaftar();
    }).catch(function (e) {
      if (e.kode === 'DIPAKAI' || e.kode === 'TIDAK_ADA') { toast(e.message, 'galat'); gbMuatDaftar(); } else gagalUmum(e);
    });
  });
};


let gbUbah = null;
function gambarBukaUbah(ed, atom) {
  const id = atom.getAttribute('data-m') || '';
  const alt = atom.getAttribute('data-alt') || '';
  const info = mediaInfo(id);
  const s = pyKeadaan(ed);
  gbUbah = { ed: ed, atom: atom, seleksi: pyBacaSeleksi(ed) || s.seleksi, id: id };
  const api = modal({
    judul: 'Ubah gambar',
    badan: h`<form id="f-gambar-ubah" data-kirim="gb-ubah" novalidate>
      <div data-galat aria-live="polite"></div>
      <div class="gb-pratinjau">${info ? h`<figure class="gb-fig"><img src="${info.u}" alt="" ${info.w && info.h ? mentah('width="' + (info.w | 0) + '" height="' + (info.h | 0) + '"') : ''}></figure>` : h`<p class="bantu">Gambar ini tidak lagi tersedia. Ganti dengan gambar lain atau hapus dari soal.</p>`}</div>
      <div class="isian"><label for="gu-alt">Teks pengganti gambar</label>
        <input class="kontrol" id="gu-alt" name="alt" type="text" maxlength="300" autocomplete="off" value="${alt}"${alt ? '' : mentah(' disabled')}>
        <p class="bantu">Dibacakan pembaca layar dan tampil bila gambar gagal dimuat. Jangan menuliskan kunci jawaban.</p></div>
      <label class="gb-hiasan"><input type="checkbox" name="hiasan" data-masuk="gb-hiasan-ubah"${alt ? '' : mentah(' checked')}><span>Gambar ini hanya hiasan (tidak perlu teks pengganti)</span></label>
    </form>`,
    aksi: [
      { id: 'hapus', label: 'Hapus dari soal', gaya: 'bahaya', onKlik: function (a) { gbHapusDariSoal(a); } },
      { id: 'ganti', label: 'Ganti gambar', gaya: 'diam', onKlik: function (a) { a.tutup('ganti'); gambarBuka(ed, atom); } },
      { id: 'simpan', label: 'Simpan perubahan', gaya: 'utama', tipe: 'submit', form: 'f-gambar-ubah' }
    ]
  });
  api.selesai.then(function (v) { if (v !== 'ganti') { try { ed.focus(); } catch (e) {   } } gbUbah = null; });
}
MASUKAN['gb-hiasan-ubah'] = function (r) {
  const alt = el('#gu-alt', r.form);
  if (!alt) return;
  alt.disabled = r.checked;
  if (r.checked) alt.value = '';
  else alt.focus();
};
function gbHapusDariSoal(api) {
  const st = gbUbah;
  if (!st) return;
  api.tutup('hapus');
  const ed = st.ed, atom = st.atom;
  if (!ed || !ed.contains(atom)) return;
  pyTutupWaktu(ed);
  pyCatat(ed);
  atom.parentNode.removeChild(atom);
  pyTandaiKosong(ed);
  pyCatat(ed);
  pyUmumkan('Gambar dihapus dari soal.');
  try { ed.focus(); } catch (e) {   }
}
KIRIM['gb-ubah'] = function (form) {
  const st = gbUbah;
  if (!st) return;
  bersihGalat(form);
  const v = nilaiForm(form);
  const alt = v.hiasan ? '' : String(v.alt || '').replace(/\s+/g, ' ').trim();
  if (!v.hiasan && !alt) { galatIsian(form, 'alt', 'Isi teks pengganti gambar, atau centang "hanya hiasan".'); return; }
  const ed = st.ed, atom = st.atom;
  const api = modalTeratas();
  if (api) api.tutup('simpan');
  if (!ed || !ed.contains(atom)) return;
  pyTutupWaktu(ed);
  pyCatat(ed);
  atom.insertAdjacentHTML('afterend', kayaIsi([{ t: 'img', m: st.id, alt: alt }], { penyunting: true }));
  atom.parentNode.removeChild(atom);
  pyTandaiKosong(ed);
  pyCatat(ed);
  pyUmumkan('Teks pengganti gambar diperbarui.');
};


const gbSudahMuat = Object.create(null);
function gambarPraMuat(daftarSoal) {
  (daftarSoal || []).forEach(function (s) {
    if (!s) return;
    const nilai = [s.stimulus, s.pertanyaan].concat(Array.isArray(s.opsi) ? s.opsi : []);
    nilai.forEach(function (v) {
      Kaya.gambar(v).forEach(function (id) {
        const info = mediaInfo(id);
        if (!info || gbSudahMuat[info.u]) return;
        gbSudahMuat[info.u] = true;
        try { const im = new Image(); im.decoding = 'async'; im.src = info.u; } catch (e) {   }
      });
    });
  });
}

const GB_JEDA_ULANG = [1400, 3800];
function gbGagalMuat(im) {
  if (!im.isConnected) return;
  const bungkus = im.closest ? im.closest('.ky-gambar-bungkus') : null;
  if (!bungkus || bungkus.hasAttribute('data-ky')) return;
  const u = urlHttps(im.getAttribute('src'));
  if (!u) return;
  const n = parseInt(im.getAttribute('data-coba') || '0', 10) || 0;
  if (n < GB_JEDA_ULANG.length) {
    im.setAttribute('data-coba', String(n + 1));
    setTimeout(function () { if (im.isConnected && !(im.complete && im.naturalWidth > 0)) im.src = u; }, GB_JEDA_ULANG[n] + Math.floor(Math.random() * 900));
    return;
  }
  const alt = im.getAttribute('alt') || '';
  const bisaUlang = !(im.closest && im.closest('label'));
  const w = parseInt(im.getAttribute('width'), 10) || 0, hh = parseInt(im.getAttribute('height'), 10) || 0;
  pasang(bungkus, h`<span class="ky-gambar-gagal" role="group" aria-label="Gambar tidak dapat dimuat">
      <span class="ky-gambar-gagal-judul">${ikon('alert-circle', 'ikon-sm')}<span>Gambar tidak dapat dimuat.</span></span>
      ${alt ? h`<span class="ky-gambar-gagal-alt">Teks pengganti: ${alt}</span>` : ''}
      ${bisaUlang ? h`<button type="button" class="tombol tombol-garis" data-aksi="gb-ulang" data-src="${u}" data-alt="${alt}" data-w="${w}" data-h="${hh}">${ikon('rotate-ccw')}<span>Muat ulang gambar</span></button>` : ''}
    </span>`);
}
AKSI['gb-ulang'] = function (b) {
  const bungkus = b.closest('.ky-gambar-bungkus');
  const u = urlHttps(b.getAttribute('data-src'));
  if (!bungkus || !u) return;
  const w = parseInt(b.getAttribute('data-w'), 10) || 0, hh = parseInt(b.getAttribute('data-h'), 10) || 0;
  const ukuran = w > 0 && hh > 0 ? mentah(' width="' + w + '" height="' + hh + '"') : '';
  pasang(bungkus, h`<img class="ky-gambar" src="${u}" alt="${b.getAttribute('data-alt') || ''}"${ukuran} decoding="async">`);
};
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('error', function (e) {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.classList && t.classList.contains('ky-gambar')) gbGagalMuat(t);
  }, true);
}


const paketSt = { q: '', mapel: '', kategori: '', status: '', data: [], seq: 0 };
let edSt = { paket: null, soal: [] };

const LABEL_TAMPIL = { sembunyikan: 'Sembunyikan hasil dari siswa', nilai: 'Tampilkan nilai saja', penuh: 'Tampilkan nilai dan pembahasan' };
const LABEL_JALUR = { Member: 'Hanya member (akun siswa)', Token: 'Hanya token (peserta dengan kode, tanpa akun)', Keduanya: 'Member dan token' };

function lencanaStatus(s) {
  const k = s === 'Terbit' ? 'lencana-sukses' : (s === 'Diarsipkan' ? 'lencana-peringatan' : '');
  return h`<span class="lencana ${k}">${s}</span>`;
}
function kunciTeks(s) {
  if (s.jenis === 'PG') return s.kunci;
  return String(s.kunci || '').split(',').map(function (x) { return x === 'B' ? 'Benar' : 'Salah'; }).join(' · ');
}

function renderPaket(p, c) {
  const admin = S.pengguna.peran === PERAN.ADMIN;
  pasang(c.wadah, h`
    ${kepalaHalaman(admin ? 'Paket soal' : 'Paket soal saya', admin ? 'Seluruh paket dari semua guru. Admin dapat mengatur urutan dan menghapus.' : 'Paket yang Anda susun. Siswa hanya melihat paket berstatus Terbit.', h`<button type="button" class="tombol" data-aksi="paket-baru">${ikon('plus')}<span>Buat paket</span></button>`)}
    <div class="saring saring-4" role="search">
      <div class="cari"><label class="sr-only" for="pk-cari">Cari paket</label>${ikon('search')}<input class="kontrol" id="pk-cari" type="search" placeholder="Cari nama paket" value="${paketSt.q}" data-masuk="paket-saring" autocomplete="off"></div>
      <div class="isian"><label class="sr-only" for="pk-mapel">Mata pelajaran</label><select class="kontrol" id="pk-mapel" data-masuk="paket-saring"><option value="">Semua mapel</option>${MAPEL_URUT.map(function (k) { return h`<option value="${k}"${paketSt.mapel === k ? mentah(' selected') : ''}>${MAPEL[k]}</option>`; })}</select></div>
      <div class="isian"><label class="sr-only" for="pk-kategori">Kategori</label><select class="kontrol" id="pk-kategori" data-masuk="paket-saring"><option value="">Semua kategori</option>${['Try Out Utama', 'Latihan Materi'].map(function (k) { return h`<option value="${k}"${paketSt.kategori === k ? mentah(' selected') : ''}>${k}</option>`; })}</select></div>
      <div class="isian"><label class="sr-only" for="pk-status">Status</label><select class="kontrol" id="pk-status" data-masuk="paket-saring"><option value="">Semua status</option>${['Draf', 'Terbit', 'Diarsipkan'].map(function (k) { return h`<option value="${k}"${paketSt.status === k ? mentah(' selected') : ''}>${k}</option>`; })}</select></div>
    </div>
    <p class="bantu jarak-bawah" id="pk-hitung" aria-live="polite"></p>
    <div id="pk-daftar"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat paket…</span></div></div>`);
  fokusJudul();
  muatPaket(c.ok).then(function () { if (p && p.buat && c.ok()) AKSI['paket-baru'](); });
}

function muatPaket(ok) {
  const seq = ++paketSt.seq;
  return panggil('paket.daftar', { q: paketSt.q, mapel: paketSt.mapel, kategori: paketSt.kategori, status: paketSt.status }, { ulang: true }).then(function (d) {
    if (seq !== paketSt.seq || (ok && !ok())) return;
    paketSt.data = d;
    gambarPaket();
  }).catch(function (e) {
    if (seq !== paketSt.seq || (ok && !ok())) return;
    tampilkanGalatMuat(el('#pk-daftar'), e, true);
  });
}
MASUKAN['paket-saring'] = tundaKe(function () {
  const a = el('#pk-cari'), b = el('#pk-mapel'), k = el('#pk-kategori'), s = el('#pk-status');
  if (!a || !b || !k || !s) return;
  paketSt.q = a.value.trim(); paketSt.mapel = b.value; paketSt.kategori = k.value; paketSt.status = s.value;
  muatPaket();
}, 300);

function gambarPaket() {
  const wadah = el('#pk-daftar');
  if (!wadah) return;
  const admin = S.pengguna.peran === PERAN.ADMIN;
  const hit = el('#pk-hitung');
  if (hit) hit.textContent = formatAngka(paketSt.data.length) + ' paket.';
  if (!paketSt.data.length) {
    const disaring = paketSt.q || paketSt.mapel || paketSt.kategori || paketSt.status;
    pasang(wadah, h`<div class="kartu kosong"><span class="ikon-bulat netral">${ikon('package')}</span><h3>${disaring ? 'Tidak ada paket yang cocok' : 'Belum ada paket'}</h3><p>${disaring ? 'Ubah penyaring untuk melihat paket lain.' : 'Mulai dengan membuat paket pertama, lalu tambahkan soal.'}</p>${disaring ? '' : h`<button type="button" class="tombol" data-aksi="paket-baru">${ikon('plus')}<span>Buat paket</span></button>`}</div>`);
    return;
  }
  const bisaUrut = admin && !paketSt.q && !paketSt.status;
  const per = {};
  paketSt.data.forEach(function (x) { (per[x.mapel] = per[x.mapel] || []).push(x); });
  pasang(wadah, h`${MAPEL_URUT.filter(function (k) { return per[k]; }).map(function (k) {
    return h`<section aria-labelledby="pkm-${k}"><div class="mapel-judul"><span class="ikon-bulat">${ikon(IKON_MAPEL[k])}</span><h3 id="pkm-${k}">${MAPEL[k]}</h3></div>
      <div class="kisi">${per[k].map(function (x) {
        const sebaris = per[k].filter(function (y) { return y.kategori === x.kategori; });
        const i = sebaris.indexOf(x);
        return h`<article class="kartu kartu-paket-staf">
          <div class="paket-staf-kepala"><h3>${x.nama}</h3>${lencanaStatus(x.status)}</div>
          <div class="paket-staf-meta"><span class="lencana lencana-primer">${x.kategori}</span><span>${formatAngka(x.jumlahSoal)} soal</span><span aria-hidden="true">·</span><span>${formatAngka(x.durasiMenit)} menit</span><span aria-hidden="true">·</span><span>${formatAngka(x.jumlahPercobaan)} percobaan</span>${admin ? h`<span aria-hidden="true">·</span><span>oleh ${x.namaPemilik}</span>` : ''}</div>
          <div class="paket-staf-aksi">
            <button type="button" class="tombol" data-aksi="paket-buka" data-id="${x.id}">${ikon('edit')}<span>Kelola soal</span></button>
            <button type="button" class="tombol tombol-diam" data-aksi="paket-duplikat" data-id="${x.id}" aria-label="Duplikat paket ${x.nama}">${ikon('copy')}<span>Duplikat</span></button>
            ${bisaUrut ? h`<button type="button" class="tombol tombol-diam tombol-ikon" data-aksi="paket-geser" data-id="${x.id}" data-arah="naik" aria-label="Naikkan urutan ${x.nama}"${i === 0 ? mentah(' aria-disabled="true"') : ''}>${ikon('arrow-up')}</button>
            <button type="button" class="tombol tombol-diam tombol-ikon" data-aksi="paket-geser" data-id="${x.id}" data-arah="turun" aria-label="Turunkan urutan ${x.nama}"${i === sebaris.length - 1 ? mentah(' aria-disabled="true"') : ''}>${ikon('arrow-down')}</button>` : ''}
          </div></article>`;
      })}</div></section>`;
  })}`);
}
AKSI['paket-buka'] = function (b) { navigateTo('paket-edit', { id: b.getAttribute('data-id') }); };
AKSI['paket-geser'] = function (b) {
  panggil('paket.geser', { id: b.getAttribute('data-id'), arah: b.getAttribute('data-arah') }).then(function () { return muatPaket(); }).catch(gagalUmum);
};

function formPaket(pk, kunci) {
  const baru = !pk;
  const v = pk || { nama: '', mapel: '', kategori: 'Try Out Utama', durasiMenit: 60, acakSoal: true, acakOpsi: true, tampilHasil: 'penuh', jalurAkses: 'Member' };
  return h`<form id="f-paket" data-kirim="paket-simpan" data-id="${pk ? pk.id : ''}" novalidate>
    <div data-galat aria-live="polite"></div>
    <div class="isian"><label for="pk-nama">Nama paket</label><input class="kontrol" id="pk-nama" name="nama" type="text" maxlength="120" required value="${v.nama}" placeholder="Contoh: Try Out Utama Matematika 1"></div>
    <div class="kelompok-isian">
      <div class="isian"><label for="pk-f-mapel">Mata pelajaran</label><select class="kontrol" id="pk-f-mapel" name="mapel" required${kunci.mapel ? mentah(' disabled') : ''}>${baru ? h`<option value="">Pilih…</option>` : ''}${MAPEL_URUT.map(function (k) { return h`<option value="${k}"${v.mapel === k ? mentah(' selected') : ''}>${MAPEL[k]}</option>`; })}</select>${kunci.mapel ? h`<p class="bantu">Terkunci karena paket sudah memuat soal atau percobaan.</p>` : ''}</div>
      <div class="isian"><label for="pk-f-durasi">Durasi (menit)</label><input class="kontrol angka" id="pk-f-durasi" name="durasi_menit" type="number" inputmode="numeric" min="1" max="300" step="1" required value="${v.durasiMenit}"></div>
    </div>
    <fieldset class="isian fieldset-polos"><legend class="label">Kategori</legend><div class="segmen" role="radiogroup" aria-label="Kategori">
      ${['Try Out Utama', 'Latihan Materi'].map(function (k) { return h`<label>${ikon('check')}<input type="radio" name="kategori" value="${k}"${v.kategori === k ? mentah(' checked') : ''}${kunci.kategori ? mentah(' disabled') : ''}> ${k}</label>`; })}
    </div>${kunci.kategori ? h`<p class="bantu">Kategori terkunci karena paket sudah punya percobaan.</p>` : ''}</fieldset>
    <div class="kelompok-isian">
      <div class="isian"><label class="saklar"><input type="checkbox" name="acak_soal"${v.acakSoal ? mentah(' checked') : ''}><span class="jalur"></span><span>Acak urutan soal</span></label></div>
      <div class="isian"><label class="saklar"><input type="checkbox" name="acak_opsi"${v.acakOpsi ? mentah(' checked') : ''}><span class="jalur"></span><span>Acak urutan opsi</span></label></div>
    </div>
    <div class="kelompok-isian">
      <div class="isian"><label for="pk-f-tampil">Hasil untuk siswa</label><select class="kontrol" id="pk-f-tampil" name="tampil_hasil">${Object.keys(LABEL_TAMPIL).map(function (k) { return h`<option value="${k}"${v.tampilHasil === k ? mentah(' selected') : ''}>${LABEL_TAMPIL[k]}</option>`; })}</select></div>
      <div class="isian"><label for="pk-f-jalur">Jalur akses</label><select class="kontrol" id="pk-f-jalur" name="jalur_akses">${Object.keys(LABEL_JALUR).map(function (k) { return h`<option value="${k}"${v.jalurAkses === k ? mentah(' selected') : ''}>${LABEL_JALUR[k]}</option>`; })}</select></div>
    </div>
  </form>`;
}
AKSI['paket-baru'] = function () {
  modal({
    judul: 'Buat paket', lebar: true, badan: formPaket(null, {}),
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'simpan', label: 'Buat paket', gaya: 'utama', tipe: 'submit', form: 'f-paket' }]
  });
};
AKSI['paket-ubah'] = function () {
  const pk = edSt.paket; if (!pk) return;
  modal({
    judul: 'Pengaturan paket', lebar: true,
    badan: formPaket(pk, { mapel: edSt.soal.length > 0 || pk.jumlahPercobaan > 0, kategori: pk.jumlahPercobaan > 0 }),
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'simpan', label: 'Simpan', gaya: 'utama', tipe: 'submit', form: 'f-paket' }]
  });
};
KIRIM['paket-simpan'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const id = form.getAttribute('data-id');
  if (!v.nama || v.nama.length < 3) { galatIsian(form, 'nama', 'Nama paket minimal 3 karakter.'); return; }
  if (!id && !v.mapel) { galatIsian(form, 'mapel', 'Pilih mata pelajaran.'); return; }
  const dur = parseInt(v.durasi_menit, 10);
  if (!(dur >= 1 && dur <= 300)) { galatIsian(form, 'durasi_menit', 'Durasi harus 1–300 menit.'); return; }
  const data = { nama: v.nama, durasi_menit: dur, acak_soal: !!v.acak_soal, acak_opsi: !!v.acak_opsi, tampil_hasil: v.tampil_hasil, jalur_akses: v.jalur_akses };
  if (v.mapel) data.mapel = v.mapel;
  if (v.kategori) data.kategori = v.kategori;
  if (id) data.id = id;
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('paket.simpan', data).then(function (d) {
      const api = modalTeratas(); if (api) api.tutup('disimpan');
      if (!id) { toast('Paket dibuat. Sekarang tambahkan soalnya.', 'sukses'); navigateTo('paket-edit', { id: d.paket.id }); }
      else { toast(d.berubah === false ? 'Tidak ada perubahan.' : 'Pengaturan paket disimpan.', 'sukses'); segarkanEditor(); }
    });
  }).catch(function (e) {
    if (e.kode === 'VALIDASI') galatForm(form, e.message); else if (e.kode === 'TERKUNCI' || e.kode === 'STATUS') galatForm(form, e.message); else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};

function renderPaketEdit(p, c) {
  if (!p || !p.id) { navigateTo('paket', {}, { tanpaRiwayat: true }); return; }
  bukaPanelKoreksi = false;
  panggil('paket.ambil', { id: p.id }, { ulang: true }).then(function (d) {
    if (!c.ok()) return;
    edSt = d;
    gambarEditor();
    setJudul(d.paket.nama);
    fokusJudul();
  }).catch(function (e) {
    if (!c.ok()) return;
    tampilkanGalatMuat(c.wadah, e, false);
    if (!e.ditangani) pasang(c.wadah, h`<div class="kosong"><span class="ikon-bulat bahaya">${ikon('alert-triangle')}</span><h3>Paket tidak bisa dibuka</h3><p>${e.message}</p><button type="button" class="tombol tombol-garis" data-aksi="kembali" data-ke="paket">${ikon('chevron-left')}Kembali ke daftar paket</button></div>`);
  });
}
function segarkanEditor() {
  if (S.halaman !== 'paket-edit' || !edSt.paket) return Promise.resolve();
  const y = window.pageYOffset || 0;
  const id = edSt.paket.id;
  return panggil('paket.ambil', { id: id }).then(function (d) {
    if (S.halaman !== 'paket-edit') return;
    edSt = d; gambarEditor(); setJudul(d.paket.nama);
    try { window.scrollTo(0, y); } catch (e) {   }
  }).catch(gagalUmum);
}

function gambarEditor() {
  const wadah = el('#isi');
  if (!wadah) return;
  const pk = edSt.paket, soal = edSt.soal;
  const admin = S.pengguna.peran === PERAN.ADMIN;
  const arsip = pk.status === 'Diarsipkan';
  const adaPercobaan = pk.jumlahPercobaan > 0;
  const berjalan = pk.berjalan || { jumlah: 0, aktif: 0, sampai: '' };
  const sedangDikerjakan = berjalan.jumlah > 0;
  const bisaUbahSoal = !arsip && !sedangDikerjakan;
  const bisaHapus = admin || !adaPercobaan;
  const aksiStatus = [];
  if (pk.status === 'Draf') { aksiStatus.push(['Terbit', 'Terbitkan', 'check-circle', 'tombol']); aksiStatus.push(['Diarsipkan', 'Arsipkan', 'layers', 'tombol tombol-diam']); }
  else if (pk.status === 'Terbit') { aksiStatus.push(['Diarsipkan', 'Arsipkan', 'layers', 'tombol tombol-diam']); if (!adaPercobaan) aksiStatus.push(['Draf', 'Kembalikan ke Draf', 'rotate-ccw', 'tombol tombol-diam']); }
  else aksiStatus.push(['Draf', 'Kembalikan ke Draf', 'rotate-ccw', 'tombol']);
  pasang(wadah, h`
    <div class="remah"><button type="button" class="tombol tombol-polos" data-aksi="kembali" data-ke="paket">${ikon('chevron-left')}<span>Semua paket</span></button></div>
    ${kepalaHalaman(pk.nama, null, h`<button type="button" class="tombol tombol-diam" data-aksi="paket-duplikat" data-id="${pk.id}">${ikon('copy')}<span>Duplikat</span></button><button type="button" class="tombol tombol-diam" data-aksi="paket-ubah">${ikon('settings')}<span>Pengaturan</span></button>`)}
    <div class="baris-bungkus jarak-bawah">${lencanaStatus(pk.status)}<span class="lencana lencana-primer">${MAPEL[pk.mapel] || pk.mapel}</span><span class="lencana">${pk.kategori}</span>
      <span class="teks-redam">${formatAngka(pk.durasiMenit)} menit · ${formatAngka(soal.length)} soal · ${formatAngka(pk.jumlahPercobaan)} percobaan · oleh ${pk.namaPemilik}</span></div>
    ${sedangDikerjakan ? h`<div class="peringatan peringatan-waspada jarak-bawah" data-uji="banner-sedang">${ikon('clock')}<div>
        ${berjalan.aktif ? h`<p><strong>${formatAngka(berjalan.aktif)} siswa sedang mengerjakan paket ini.</strong> Soal belum bisa diubah, ditambah, atau dihapus sampai mereka selesai (paling lambat ${waktuWIB(berjalan.sampai)}).</p>`
          : h`<p><strong>${formatAngka(berjalan.jumlah)} percobaan paket ini baru berakhir dan sedang ditutup.</strong> Periksa lagi sebentar lagi.</p>`}
        <button type="button" class="tombol tombol-diam jarak-atas-kecil" data-aksi="paket-segarkan">${ikon('refresh')}<span>Periksa lagi</span></button></div></div>`
      : (adaPercobaan && !arsip ? h`<div class="peringatan jarak-bawah" data-uji="banner-berriwayat">${ikon('info')}<div><p><strong>Paket ini sudah dikerjakan ${formatAngka(pk.jumlahPercobaan)} kali.</strong> Soal tetap bisa diubah, ditambah, atau dihapus selama tidak ada siswa yang sedang mengerjakannya. Nilai yang sudah ada <strong>tidak berubah sendiri</strong>; hasil lama diberi catatan bila soalnya diubah atau dihapus. Untuk menghitung ulang nilai lama, pakai Koreksi Massal di bawah.</p></div></div>`
      : (arsip ? h`<div class="peringatan peringatan-waspada jarak-bawah">${ikon('layers')}<div><p><strong>Paket diarsipkan.</strong> Kembalikan ke Draf bila ingin mengubah soalnya.</p></div></div>`
        : (pk.status === 'Terbit' ? h`<div class="peringatan jarak-bawah">${ikon('info')}<div><p><strong>Paket sedang terbit.</strong> Perubahan soal langsung berlaku untuk siswa yang mengerjakan setelahnya.</p></div></div>`
          : h`<div class="peringatan jarak-bawah">${ikon('info')}<div><p>Paket belum terlihat siswa. Terbitkan setelah semua soal punya kunci yang sah.</p></div></div>`)))}
    <div class="kartu jarak-bawah"><div class="kartu-judul"><span class="ikon-bulat">${ikon('check-circle')}</span><h3>Status paket</h3></div>
      <div class="baris-bungkus">${aksiStatus.map(function (a) { return h`<button type="button" class="${a[3]}" data-aksi="paket-status" data-ke="${a[0]}">${ikon(a[2])}<span>${a[1]}</span></button>`; })}
        ${bisaHapus ? h`<button type="button" class="tombol tombol-bahaya-garis rata-kanan" data-aksi="paket-hapus">${ikon('trash')}<span>Hapus paket</span></button>` : h`<span class="bantu rata-kanan">Paket berriwayat hanya bisa diarsipkan.</span>`}</div></div>
    ${adaJalurToken(pk) ? h`<section class="kartu jarak-bawah" id="token-panel" aria-labelledby="h-token">${kerangkaPanelToken(pk)}</section>` : ''}
    ${htmlKartuPembahasanStaf(pk, edSt.pembahasan)}
    ${h`<div class="kartu-judul"><h3 class="tanpa-margin">Soal <span class="teks-redam angka">(${formatAngka(soal.length)}/100)</span></h3>
      <div class="baris-bungkus rata-kanan"><button type="button" class="tombol tombol-garis" data-aksi="soal-ambil"${bisaUbahSoal && soal.length < 100 ? '' : mentah(' aria-disabled="true"')}>${ikon('copy')}<span>Ambil dari paket lain</span></button>
      ${pk.status === 'Draf' && bisaUbahSoal ? h`<button type="button" class="tombol tombol-garis" data-aksi="impor-buka" data-uji="im-buka"${soal.length < 100 ? '' : mentah(' aria-disabled="true"')}>${ikon('upload')}<span>Impor soal (prototipe)</span></button>` : ''}
      <button type="button" class="tombol" data-aksi="soal-baru"${bisaUbahSoal && soal.length < 100 ? '' : mentah(' aria-disabled="true"')}>${ikon('plus')}<span>Tambah soal</span></button></div></div>`}
    ${soal.length ? h`<ol class="daftar-soal">${soal.map(function (s, i) {
      return h`<li class="soal-butir"><span class="nomor">${i + 1}</span>
        <div><div class="pertanyaan ky">${kayaHtml(s.pertanyaan)}</div><div class="meta"><span class="lencana lencana-primer">${LABEL_JENIS_PENDEK[s.jenis]}</span><span class="lencana lencana-sukses">Kunci: ${kunciTeks(s)}</span>${s.kunciStatus === 'claude' ? h`<span class="lencana lencana-peringatan" data-uji="kunci-belum-diperiksa">${ikon('alert-triangle', 'ikon-sm')} Kunci tebakan Claude, belum diperiksa</span>` : ''}${s.pembahasan ? h`<span class="lencana lencana-info" data-uji="ada-pembahasan">Ada pembahasan</span>` : ''}</div></div>
        ${bisaUbahSoal ? h`<div class="aksi">
          <button type="button" class="tombol tombol-diam tombol-ikon" data-aksi="soal-geser" data-id="${s.id}" data-arah="naik" aria-label="Naikkan soal nomor ${i + 1}"${i === 0 ? mentah(' aria-disabled="true"') : ''}>${ikon('arrow-up')}</button>
          <button type="button" class="tombol tombol-diam tombol-ikon" data-aksi="soal-geser" data-id="${s.id}" data-arah="turun" aria-label="Turunkan soal nomor ${i + 1}"${i === soal.length - 1 ? mentah(' aria-disabled="true"') : ''}>${ikon('arrow-down')}</button>
          <button type="button" class="tombol tombol-diam tombol-ikon" data-aksi="soal-ubah" data-id="${s.id}" aria-label="Ubah soal nomor ${i + 1}">${ikon('edit')}</button>
          <button type="button" class="tombol tombol-bahaya-garis tombol-ikon" data-aksi="soal-hapus" data-id="${s.id}" aria-label="Hapus soal nomor ${i + 1}">${ikon('trash')}</button></div>` : ''}</li>`;
    })}</ol>` : h`<div class="kartu kosong"><span class="ikon-bulat netral">${ikon('list')}</span><h3>Belum ada soal</h3><p>Tambahkan soal pilihan ganda, MCMA, atau Benar–Salah, atau ambil dari paket lain. Paket tanpa soal tidak bisa diterbitkan.</p>${bisaUbahSoal ? h`<div class="baris-bungkus"><button type="button" class="tombol tombol-garis" data-aksi="soal-ambil">${ikon('copy')}<span>Ambil dari paket lain</span></button>${pk.status === 'Draf' ? h`<button type="button" class="tombol tombol-garis" data-aksi="impor-buka" data-uji="im-buka-kosong">${ikon('upload')}<span>Impor soal (prototipe)</span></button>` : ''}</div>` : ''}</div>`}
    ${adaPercobaan ? htmlPanelKoreksi(pk, soal, edSt.soalDibatalkan) : ''}`);
  if (adaJalurToken(pk)) muatPanelToken();
}

AKSI['paket-status'] = function (b) {
  const ke = b.getAttribute('data-ke');
  const pk = edSt.paket;
  const jalan = function () {
    return panggil('paket.ubahStatus', { id: pk.id, status: ke }).then(function () {
      toast('Status paket: ' + ke + '.', 'sukses');
      return segarkanEditor();
    }).catch(function (e) { if (e.kode === 'BELUM_LAYAK' || e.kode === 'STATUS') toast(e.message, 'galat'); else gagalUmum(e); });
  };
  if (ke === 'Terbit') {
    konfirmasi({ judul: 'Terbitkan paket?', ya: 'Terbitkan', pesan: 'Setelah terbit, paket terlihat oleh siswa. Pastikan semua soal dan kuncinya sudah benar. Soal masih bisa diubah setelah ada yang mengerjakan, tetapi tidak selagi ada siswa yang sedang mengerjakannya, dan nilai yang sudah ada tidak berubah sendiri.' }).then(function (ya) { if (ya) jalan(); });
  } else if (ke === 'Diarsipkan') {
    konfirmasi({ judul: 'Arsipkan paket?', ya: 'Arsipkan', pesan: 'Paket tidak lagi terlihat oleh siswa. Riwayat pengerjaan tetap tersimpan dan paket bisa dikembalikan ke Draf.' }).then(function (ya) { if (ya) jalan(); });
  } else jalan();
};

AKSI['paket-hapus'] = function () {
  const pk = edSt.paket;
  panggil('paket.dependensi', { id: pk.id }).then(function (d) {
    const baris = [['Soal', d.jumlahSoal], ['Percobaan pengerjaan', d.jumlahPercobaan], ['Hasil selesai', d.jumlahHasilSelesai], ['Akun terdampak', d.jumlahAkunTerdampak], ['Token', d.jumlahToken], ['Pembahasan', d.jumlahPembahasan]];
    modal({
      judul: 'Hapus paket permanen?', lebar: true,
      badan: h`<p class="tanpa-margin">Paket <strong>${d.paket.nama}</strong> beserta data berikut akan dihapus permanen dan <strong>tidak bisa dikembalikan</strong>.</p>
        <dl class="data">${baris.map(function (r) { return h`<div class="data-baris"><dt>${r[0]}</dt><dd class="angka">${formatAngka(r[1])}</dd></div>`; })}</dl>
        ${d.berriwayat ? h`<div class="peringatan peringatan-bahaya">${ikon('alert-triangle')}<div><p><strong>Paket ini punya riwayat pengerjaan siswa.</strong> Menghapusnya juga menghapus nilai dan jawaban yang tersangkut, dan peringkat terkait dihitung ulang. Pertimbangkan mengarsipkan saja.</p></div></div>
          <label class="saklar"><input type="checkbox" id="hapus-paham" data-masuk="paket-hapus-centang"><span class="jalur"></span><span>Saya mengerti dan tetap ingin menghapus</span></label>` : ''}`,
      aksi: [
        { id: 'batal', label: 'Batal', gaya: 'diam' },
        {
          id: 'hapus', label: 'Hapus permanen', gaya: 'bahaya',
          onKlik: function (api, tombol) {
            if (d.berriwayat && !el('#hapus-paham', api.el).checked) { toast('Centang pernyataan persetujuan lebih dulu.', 'galat'); return; }
            kerjakan(tombol, function () {
              return panggil('paket.hapus', { id: pk.id, konfirmasi: d.konfirmasi || '' }).then(function () {
                api.tutup('hapus');
                toast('Paket dihapus.', 'sukses');
                navigateTo('paket', {}, { tanpaRiwayat: true });
              });
            }).catch(function (e) { api.tutup(null); gagalUmum(e); });
          }
        }
      ],
      saatBuka: function (api) {
        if (d.berriwayat) { const t = el('[data-modal-aksi="1"]', api.el); if (t) t.setAttribute('aria-disabled', 'true'); }
      }
    });
  }).catch(gagalUmum);
};
MASUKAN['paket-hapus-centang'] = function (cb) {
  const api = modalTeratas(); if (!api) return;
  const t = el('[data-modal-aksi="1"]', api.el);
  if (t) { if (cb.checked) t.removeAttribute('aria-disabled'); else t.setAttribute('aria-disabled', 'true'); }
};

function tombolGambarOpsi(i, nama) {
  return h`<div class="isian-alat"><button type="button" class="tombol tombol-diam tombol-kecil" data-aksi="opsi-gambar" data-untuk="so-${i}" aria-label="Sisipkan gambar ke ${nama}">${ikon('image')}<span>Gambar</span></button></div>`;
}
AKSI['opsi-gambar'] = function (b) {
  const ed = document.getElementById(b.getAttribute('data-untuk'));
  if (ed) pyJalankan(ed, 'gambar');
};
function htmlOpsiSoal(jenis, opsi, kunci) {
  const hurufKunci = jenis === 'PG' ? String(kunci || '') : '';
  const bs = jenis === 'PG' ? [] : String(kunci || '').split(',');
  if (jenis === 'PG') {
    return h`<div class="opsi-soal" role="group" aria-label="Opsi jawaban">${['A', 'B', 'C', 'D'].map(function (hr, i) {
      return h`<div class="opsi-baris"><span class="huruf" aria-hidden="true">${hr}</span>
        <div class="isian"><label class="sr-only" id="so-${i}-l" for="so-${i}">Isi opsi ${hr}</label>${htmlIsianKaya({ nama: 'opsi' + i, id: 'so-' + i, labelId: 'so-' + i + '-l', nilai: opsi[i] || '', pendek: true, placeholder: 'Isi opsi ' + hr })}${tombolGambarOpsi(i, 'opsi ' + hr)}</div>
        <label class="kunci-pg">${ikon('check')}<input type="radio" name="kunci_pg" value="${hr}" data-masuk="soal-kunci"${hurufKunci === hr ? mentah(' checked') : ''}><span>Kunci</span></label></div>`;
    })}</div>`;
  }
  return h`<div class="opsi-soal" role="group" aria-label="Pernyataan">${[0, 1, 2].map(function (i) {
    return h`<div class="opsi-baris"><span class="huruf" aria-hidden="true">${i + 1}</span>
      <div class="isian"><label class="sr-only" id="so-${i}-l" for="so-${i}">Isi pernyataan ${i + 1}</label>${htmlIsianKaya({ nama: 'opsi' + i, id: 'so-' + i, labelId: 'so-' + i + '-l', nilai: opsi[i] || '', pendek: true, placeholder: 'Isi pernyataan ' + (i + 1) })}${tombolGambarOpsi(i, 'pernyataan ' + (i + 1))}</div>
      <div class="segmen" role="radiogroup" aria-label="Kunci pernyataan ${i + 1}">
        <label>${ikon('check')}<input type="radio" name="k${i}" value="B" data-masuk="soal-kunci"${bs[i] === 'B' ? mentah(' checked') : ''}> Benar</label>
        <label>${ikon('check')}<input type="radio" name="k${i}" value="S" data-masuk="soal-kunci"${bs[i] === 'S' ? mentah(' checked') : ''}> Salah</label></div></div>`;
  })}</div>`;
}
function bacaKunciForm(form, jenis) {
  if (jenis === 'PG') { const r = form.querySelector('input[name="kunci_pg"]:checked'); return r ? r.value : ''; }
  const out = [];
  for (let i = 0; i < 3; i++) { const r = form.querySelector('input[name="k' + i + '"]:checked'); out.push(r ? r.value : ''); }
  return out.every(Boolean) ? out.join(',') : '';
}
function statusKunci(jenis, kunci) {
  if (jenis === 'PG') return kunci ? { ok: true, teks: 'Kunci jawaban: ' + kunci + '.' } : { ok: false, teks: 'Pilih satu jawaban yang benar (A–D).' };
  if (!kunci) return { ok: false, teks: 'Pilih Benar atau Salah untuk ketiga pernyataan.' };
  const b = kunci.split(',').filter(function (x) { return x === 'B'; }).length;
  if (jenis === 'MCMA' && b !== 2) return { ok: false, teks: 'Kunci MCMA harus tepat dua Benar dan satu Salah (sekarang ' + b + ' Benar).' };
  if (jenis === 'BS' && (b === 0 || b === 3)) return { ok: false, teks: 'Kunci Benar–Salah harus bervariasi: tidak boleh semua Benar atau semua Salah.' };
  return { ok: true, teks: 'Kunci sah: ' + kunci.split(',').map(function (x) { return x === 'B' ? 'Benar' : 'Salah'; }).join(' · ') + '.' };
}
function jenisForm(form) { const r = form.elements.jenis; if (!r) return 'PG'; return (r.value !== undefined && r.value !== '') ? r.value : (r.length ? (Array.prototype.filter.call(r, function (x) { return x.checked; })[0] || r[0]).value : 'PG'); }
function perbaruiStatusKunci(form) {
  const jenis = jenisForm(form);
  const s = statusKunci(jenis, bacaKunciForm(form, jenis));
  const w = el('#soal-status-kunci', form);
  if (w) pasang(w, h`<span class="status-kunci ${s.ok ? 'ok' : 'salah'}">${ikon(s.ok ? 'check-circle' : 'alert-circle', 'ikon-sm')} ${s.teks}</span>`);
}
MASUKAN['soal-kunci'] = function (r) { if (r.form) perbaruiStatusKunci(r.form); };
MASUKAN['soal-jenis'] = function (r) {
  const form = r.form; if (!form || !r.checked) return;
  const lama = [0, 1, 2, 3].map(function (i) {
    const e = el('[data-penyunting="opsi' + i + '"]', form);
    if (!e) return '';
    try { return bacaKaya(e, { maks: 100000 }); } catch (x) { return ''; }
  });
  const jenis = r.value;
  pasang(el('#soal-opsi', form), htmlOpsiSoal(jenis, lama, ''));
  aktifkanPenyunting(form);
  const ket = el('#soal-ket-jenis', form);
  if (ket) ket.textContent = ketJenis(jenis);
  perbaruiStatusKunci(form);
};
function ketJenis(jenis) {
  return jenis === 'PG' ? 'Empat opsi (A–D) dengan satu jawaban benar.' : (jenis === 'MCMA' ? 'Tiga pernyataan. Kunci harus tepat dua Benar dan satu Salah.' : 'Tiga pernyataan. Kunci bervariasi (tidak boleh semuanya Benar atau semuanya Salah).');
}

function bukaFormSoal(s) {
  const baru = !s;
  const jenis = s ? s.jenis : 'PG';
  const api = modal({
    judul: baru ? 'Tambah soal' : 'Ubah soal', lebar: true,
    badan: h`<form id="f-soal" data-kirim="soal-simpan" data-id="${s ? s.id : ''}" novalidate>
      <div data-galat aria-live="polite"></div>
      <fieldset class="isian fieldset-polos"><legend class="label">Jenis soal</legend><div class="segmen" role="radiogroup" aria-label="Jenis soal">
        ${['PG', 'MCMA', 'BS'].map(function (j) { return h`<label>${ikon('check')}<input type="radio" name="jenis" value="${j}" data-masuk="soal-jenis"${j === jenis ? mentah(' checked') : ''}> ${LABEL_JENIS_PENDEK[j]}</label>`; })}</div>
        <p class="bantu" id="soal-ket-jenis">${ketJenis(jenis)}</p>
        ${!baru && edSt.paket && edSt.paket.jumlahPercobaan > 0 ? h`<p class="bantu" data-uji="ket-jenis-berubah">Paket ini sudah dikerjakan. Bila jenis soal diganti, hasil lama butir ini tidak lagi menampilkan pilihan dan jawabannya; nilai lama tidak berubah.</p>` : ''}</fieldset>
      ${htmlBilahPenyunting()}
      <div class="isian"><label id="so-stimulus-l" for="so-stimulus">Teks bacaan atau konteks <span class="opsional">(opsional)</span></label>${htmlIsianKaya({ nama: 'stimulus', id: 'so-stimulus', labelId: 'so-stimulus-l', nilai: s ? s.stimulus : '', placeholder: 'Teks bacaan, tabel singkat, atau konteks soal' })}</div>
      <div class="isian"><label id="so-tanya-l" for="so-tanya">Pertanyaan</label>${htmlIsianKaya({ nama: 'pertanyaan', id: 'so-tanya', labelId: 'so-tanya-l', nilai: s ? s.pertanyaan : '', placeholder: 'Tulis pertanyaan', fokusAwal: !baru, utama: true })}</div>
      <div id="soal-opsi">${htmlOpsiSoal(jenis, s ? s.opsi : [], s ? s.kunci : '')}</div>
      <div id="soal-status-kunci" aria-live="polite"></div>
      ${s && s.kunciStatus === 'claude' ? h`<label class="saklar im-paham" data-uji="so-diperiksa-label"><input type="checkbox" id="so-diperiksa" name="kunci_diperiksa" data-uji="so-diperiksa"><span class="jalur"></span><span>Kunci sudah saya periksa. Kunci soal ini awalnya tebakan Claude, dan paket belum bisa diterbitkan sebelum Anda mencentang ini (atau mengubah kuncinya sendiri).</span></label>` : ''}
      <div class="isian"><label for="so-pembahasan">Pembahasan <span class="opsional">(opsional)</span></label>
        <textarea class="kontrol" id="so-pembahasan" name="pembahasan" rows="4" maxlength="1500" data-uji="so-pembahasan" placeholder="Penjelasan singkat jawaban yang benar">${s ? s.pembahasan || '' : ''}</textarea>
        <p class="bantu">Tampil kepada siswa di halaman hasil, setelah ujian selesai dan hanya bila paket memakai tingkat hasil "penuh". Maksimal 1.500 karakter.</p></div>
    </form>`,
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'simpan', label: 'Simpan soal', gaya: 'utama', tipe: 'submit', form: 'f-soal' }]
  });
  const form = el('#f-soal', api.el);
  if (form) { perbaruiStatusKunci(form); aktifkanPenyunting(form); }
}
AKSI['soal-baru'] = function () { bukaFormSoal(null); };
AKSI['soal-ubah'] = function (b) {
  const s = edSt.soal.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0];
  if (s) bukaFormSoal(s);
};
KIRIM['soal-simpan'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const jenis = v.jenis || jenisForm(form);
  const isian = function (nama) { return el('[data-penyunting="' + nama + '"]', form); };
  const baca = function (nama, opsi, pesanKosong) {
    const ed = isian(nama);
    try { return { nilai: bacaKaya(ed, opsi) }; } catch (e) {
      const kosong = e.kode === 'VALIDASI' && / wajib diisi\.$/.test(e.message);
      galatKaya(ed, kosong && pesanKosong ? pesanKosong : (e.kode === 'VALIDASI' ? e.message : 'Isian tidak bisa diproses.'));
      return null;
    }
  };
  const st1 = baca('stimulus', { nama: 'Stimulus', maks: 5000 });
  if (!st1) return;
  const tanya = baca('pertanyaan', { nama: 'Pertanyaan', min: 3, maks: 2000, wajib: true });
  if (!tanya) return;
  const jml = jenis === 'PG' ? 4 : 3;
  const opsi = [];
  for (let i = 0; i < jml; i++) {
    const nama = jenis === 'PG' ? 'Opsi ' + 'ABCD'.charAt(i) : 'Pernyataan ' + (i + 1);
    const o = baca('opsi' + i, { nama: nama, min: 1, maks: 500, wajib: true }, nama + ' belum diisi.');
    if (!o) return;
    opsi.push(o.nilai);
  }
  const kunci = bacaKunciForm(form, jenis);
  const st = statusKunci(jenis, kunci);
  if (!st.ok) { perbaruiStatusKunci(form); toast(st.teks, 'galat'); return; }
  const id = form.getAttribute('data-id');
  const pem = el('#so-pembahasan', form);
  const data = { id_paket: edSt.paket.id, jenis: jenis, pertanyaan: tanya.nilai, stimulus: st1.nilai, opsi: opsi, kunci: kunci, pembahasan: pem ? pem.value : '' };
  const dip = el('#so-diperiksa', form);
  if (dip && dip.checked) data.kunci_diperiksa = true;
  if (id) data.id_soal = id;
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('soal.simpan', data).then(function () {
      const api = modalTeratas(); if (api) api.tutup('disimpan');
      toast(id ? 'Soal diperbarui.' : 'Soal ditambahkan.', 'sukses');
      return segarkanEditor();
    });
  }).catch(function (e) {
    if (['VALIDASI', 'KUNCI_TIDAK_SAH', 'TERKUNCI', 'STATUS', 'BATAS', 'SEDANG_DIKERJAKAN'].indexOf(e.kode) >= 0) galatForm(form, e.message); else gagalUmum(e);
    if (e && e.kode === 'SEDANG_DIKERJAKAN') segarkanEditor();
  }).then(function () { form.removeAttribute('data-sibuk'); });
};
function gagalUbahSoal(e) {
  gagalUmum(e);
  if (e && e.kode === 'SEDANG_DIKERJAKAN') segarkanEditor();
}
AKSI['paket-segarkan'] = function () { segarkanEditor(); };
AKSI['soal-geser'] = function (b) {
  panggil('soal.geser', { id_paket: edSt.paket.id, id_soal: b.getAttribute('data-id'), arah: b.getAttribute('data-arah') }).then(segarkanEditor).catch(gagalUbahSoal);
};
AKSI['soal-hapus'] = function (b) {
  const id = b.getAttribute('data-id');
  const no = edSt.soal.map(function (x) { return x.id; }).indexOf(id) + 1;
  konfirmasi({ judul: 'Hapus soal nomor ' + no + '?', ya: 'Hapus soal', bahaya: true, pesan: 'Soal dihapus permanen dari paket ini.' + (edSt.paket.jumlahPercobaan > 0 ? ' Paket ini sudah dikerjakan: nilai yang sudah ada tidak berubah, tetapi soal ini tidak lagi tampil di hasil lama.' : '') }).then(function (ya) {
    if (!ya) return;
    panggil('soal.hapus', { id_paket: edSt.paket.id, id_soal: id }).then(function () { toast('Soal dihapus.', 'sukses'); return segarkanEditor(); }).catch(gagalUbahSoal);
  });
};


const ambilSt = { idPaket: '', q: '', jenis: '', paket: '', halaman: 1, seq: 0, data: null, pilih: {}, info: {} };

function ambilSisaTempat() { return Math.max(0, 100 - edSt.soal.length); }
function ambilBatas() { return Math.min(50, ambilSisaTempat()); }
function ambilJumlahPilih() { return Object.keys(ambilSt.pilih).length; }

function ambilTeksPendek(x) { const t = kayaTeks(x.pertanyaan).replace(/\s+/g, ' ').trim(); return t.length > 90 ? t.slice(0, 90) + '…' : t; }

function htmlButirAmbil(x, penuh) {
  const dipilih = !!ambilSt.pilih[x.id];
  const terkunciKotak = !dipilih && penuh;
  return h`<li class="ambil-butir${dipilih ? ' terpilih' : ''}">
    <label class="ambil-kotak"><input type="checkbox" data-masuk="ambil-pilih" data-id="${x.id}"${dipilih ? mentah(' checked') : ''}${terkunciKotak ? mentah(' disabled') : ''}><span class="sr-only">Pilih soal: ${ambilTeksPendek(x)}</span></label>
    <div class="ambil-isi">
      <div class="pertanyaan ky">${kayaHtml(x.pertanyaan)}</div>
      <div class="meta"><span class="lencana lencana-primer">${LABEL_JENIS_PENDEK[x.jenis]}</span><span class="lencana lencana-sukses">Kunci: ${kunciTeks(x)}</span>${x.sudahAda ? h`<span class="lencana lencana-info">Sudah ada di paket ini</span>` : ''}</div>
      <p class="bantu ambil-sumber">Dari <strong>${x.namaPaket}</strong> · ${x.statusPaket} · ${x.milikSendiri ? 'milik Anda' : 'oleh ' + x.namaPemilik}</p>
    </div>
    <button type="button" class="tombol tombol-diam" data-aksi="ambil-pratinjau" data-id="${x.id}">${ikon('eye')}<span>Pratinjau</span></button>
  </li>`;
}

function gambarAmbil() {
  const wadah = el('#ab-daftar');
  if (!wadah) return;
  const d = ambilSt.data;
  wadah.removeAttribute('aria-busy');
  const filter = ambilSt.q || ambilSt.jenis || ambilSt.paket;
  const pil = el('#ab-paket');
  if (pil && d) {
    const ada = d.paketSumber.some(function (p) { return p.id === ambilSt.paket; });
    if (!ada) ambilSt.paket = '';
    pasang(pil, h`<option value="">Semua paket sumber</option>${d.paketSumber.map(function (p) {
      return h`<option value="${p.id}"${ambilSt.paket === p.id ? mentah(' selected') : ''}>${p.nama} (${formatAngka(p.jumlahSoal)})${p.milikSendiri ? ' — milik Anda' : ' — ' + p.namaPemilik}</option>`;
    })}`);
  }
  const hit = el('#ab-hitung');
  if (hit && d) hit.textContent = formatAngka(d.total) + ' soal ditemukan. Sisa tempat di paket ini: ' + formatAngka(ambilSisaTempat()) + '.';
  if (!d || !d.total) {
    pasang(wadah, h`<div class="kosong"><span class="ikon-bulat netral">${ikon('search')}</span><h3>${filter ? 'Tidak ada soal yang cocok' : 'Belum ada soal untuk diambil'}</h3><p>${filter ? 'Ubah kata kunci atau penyaring.' : 'Soal semapel dari paket milik Anda atau paket berstatus Terbit akan muncul di sini.'}</p></div>`);
    pasang(el('#ab-halaman'), h``);
    perbaruiTombolAmbil();
    return;
  }
  const penuh = ambilJumlahPilih() >= ambilBatas();
  pasang(wadah, h`<ul class="ambil-daftar" aria-label="Hasil pencarian soal">${d.hasil.map(function (x) { return htmlButirAmbil(x, penuh); })}</ul>`);
  const sem = el('#ab-halaman');
  if (sem) {
    pasang(sem, h`${d.jumlahHalaman > 1 ? h`
      <button type="button" class="tombol tombol-diam" data-aksi="ambil-halaman" data-ke="${d.halaman - 1}"${d.halaman <= 1 ? mentah(' aria-disabled="true"') : ''}>${ikon('chevron-left')}<span>Sebelumnya</span></button>
      <span class="teks-redam" aria-live="polite">Halaman ${formatAngka(d.halaman)} dari ${formatAngka(d.jumlahHalaman)}</span>
      <button type="button" class="tombol tombol-diam" data-aksi="ambil-halaman" data-ke="${d.halaman + 1}"${d.halaman >= d.jumlahHalaman ? mentah(' aria-disabled="true"') : ''}><span>Berikutnya</span>${ikon('chevron-right')}</button>` : ''}`);
  }
  perbaruiTombolAmbil();
}

function perbaruiTombolAmbil() {
  const api = ambilModal;
  if (!api) return;
  const t = el('[data-modal-aksi="1"]', api.el);
  if (!t) return;
  const n = ambilJumlahPilih();
  t.textContent = n ? 'Ambil ' + formatAngka(n) + ' soal terpilih' : 'Ambil soal terpilih';
  if (n) t.removeAttribute('aria-disabled'); else t.setAttribute('aria-disabled', 'true');
  const pilihSemua = el('#ab-semua', api.el);
  if (pilihSemua && ambilSt.data) {
    const idHalaman = ambilSt.data.hasil.map(function (x) { return x.id; });
    pilihSemua.checked = idHalaman.length > 0 && idHalaman.every(function (i) { return !!ambilSt.pilih[i]; });
  }
}

function muatAmbil() {
  const seq = ++ambilSt.seq;
  const w = el('#ab-daftar');
  if (!w) return Promise.resolve();
  w.setAttribute('aria-busy', 'true');
  return panggil('soal.cari', { id_paket: ambilSt.idPaket, q: ambilSt.q, jenis: ambilSt.jenis, id_paket_sumber: ambilSt.paket, halaman: ambilSt.halaman }, { ulang: true }).then(function (d) {
    if (seq !== ambilSt.seq || !el('#ab-daftar')) return;
    ambilSt.data = d; ambilSt.halaman = d.halaman;
    d.hasil.forEach(function (x) { ambilSt.info[x.id] = x; });
    gambarAmbil();
  }).catch(function (e) {
    if (seq !== ambilSt.seq || !el('#ab-daftar')) return;
    if (e && e.ditangani) return;
    pasang(el('#ab-daftar'), h`<div class="peringatan peringatan-bahaya" role="alert">${ikon('alert-circle')}<div><p>${e && e.message ? e.message : 'Pencarian gagal.'}</p></div></div>`);
  });
}

let ambilModal = null;

AKSI['soal-ambil'] = function () {
  const pk = edSt.paket; if (!pk) return;
  if (ambilSisaTempat() <= 0) { toast('Paket sudah berisi 100 soal.', 'galat'); return; }
  Object.assign(ambilSt, { idPaket: pk.id, q: '', jenis: '', paket: '', halaman: 1, data: null, pilih: {}, info: {} });
  const api = modal({
    judul: 'Ambil soal dari paket lain', lebar: true,
    badan: h`<p class="bantu">Soal yang diambil menjadi <strong>salinan</strong> di paket ini: mengubah salinan tidak mengubah soal asalnya. Hanya soal ${MAPEL[pk.mapel] || pk.mapel} dari paket milik Anda atau paket berstatus Terbit.</p>
      <div class="ambil-saring" role="search">
        <div class="cari"><label class="sr-only" for="ab-cari">Cari teks soal</label>${ikon('search')}<input class="kontrol" id="ab-cari" type="search" placeholder="Cari teks soal, bacaan, atau opsi" data-masuk="ambil-saring" autocomplete="off"></div>
        <div class="isian"><label class="sr-only" for="ab-paket">Paket sumber</label><select class="kontrol" id="ab-paket" data-masuk="ambil-saring"><option value="">Semua paket sumber</option></select></div>
        <div class="isian"><label class="sr-only" for="ab-jenis">Jenis soal</label><select class="kontrol" id="ab-jenis" data-masuk="ambil-saring"><option value="">Semua jenis</option>${['PG', 'MCMA', 'BS'].map(function (j) { return h`<option value="${j}">${LABEL_JENIS_PENDEK[j]}</option>`; })}</select></div>
      </div>
      <div class="ambil-alat"><label class="saklar"><input type="checkbox" id="ab-semua" data-masuk="ambil-semua"><span class="jalur"></span><span>Pilih semua di halaman ini</span></label><p class="bantu tanpa-margin" id="ab-hitung" aria-live="polite"></p></div>
      <div id="ab-daftar" role="region" aria-label="Hasil pencarian soal"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat soal…</span></div></div>
      <nav class="ambil-halaman" id="ab-halaman" aria-label="Halaman hasil"></nav>`,
    aksi: [
      { id: 'tutup', label: 'Tutup', gaya: 'diam' },
      {
        id: 'ambil', label: 'Ambil soal terpilih', gaya: 'utama',
        onKlik: function (a, tombol) {
          const idSoal = Object.keys(ambilSt.pilih);
          if (!idSoal.length) { toast('Pilih minimal satu soal lebih dulu.', 'galat'); return; }
          kerjakan(tombol, function () {
            return panggil('soal.salin', { id_paket: ambilSt.idPaket, id_soal: idSoal }).then(function (d) {
              a.tutup('ambil');
              toast(formatAngka(d.jumlah) + ' soal diambil sebagai salinan.', 'sukses');
              return segarkanEditor();
            });
          }).catch(function (e) {
            if (e && e.ditangani) return;
            if (e.kode === 'TERKUNCI' || e.kode === 'STATUS' || e.kode === 'SEDANG_DIKERJAKAN') { a.tutup(null); toast(e.message, 'galat'); segarkanEditor(); return; }
            if (['BATAS', 'BEDA_MAPEL', 'TIDAK_ADA', 'DITOLAK', 'VALIDASI'].indexOf(e.kode) >= 0) {
              toast(e.message, 'galat');
              if (e.kode === 'TIDAK_ADA') { ambilSt.pilih = {}; muatAmbil(); }
              return;
            }
            gagalUmum(e);
          });
        }
      }
    ],
    saatBuka: function (a) { ambilModal = a; }
  });
  ambilModal = api;
  api.selesai.then(function () { if (ambilModal === api) ambilModal = null; });
  perbaruiTombolAmbil();
  muatAmbil();
};

MASUKAN['ambil-saring'] = tundaKe(function () {
  const a = el('#ab-cari'), p = el('#ab-paket'), j = el('#ab-jenis');
  if (!a || !p || !j) return;
  const q = a.value.trim();
  if (q === ambilSt.q && p.value === ambilSt.paket && j.value === ambilSt.jenis) return;
  ambilSt.q = q; ambilSt.paket = p.value; ambilSt.jenis = j.value; ambilSt.halaman = 1;
  muatAmbil();
}, 300);

MASUKAN['ambil-pilih'] = function (cb, e) {
  if (e && e.type === 'input') return;
  const id = cb.getAttribute('data-id');
  if (cb.checked) {
    if (ambilJumlahPilih() >= ambilBatas()) { cb.checked = false; toast('Paling banyak ' + formatAngka(ambilBatas()) + ' soal bisa dipilih sekaligus.', 'info'); return; }
    ambilSt.pilih[id] = true;
  } else delete ambilSt.pilih[id];
  gambarAmbil();
  const baru = el('.ambil-kotak input[data-id="' + id + '"]');
  if (baru) baru.focus();
};

MASUKAN['ambil-semua'] = function (cb, e) {
  if (e && e.type === 'input') return;
  if (!ambilSt.data) return;
  let terlewat = 0;
  ambilSt.data.hasil.forEach(function (x) {
    if (cb.checked) { if (ambilSt.pilih[x.id]) return; if (ambilJumlahPilih() >= ambilBatas()) { terlewat++; return; } ambilSt.pilih[x.id] = true; }
    else delete ambilSt.pilih[x.id];
  });
  if (terlewat) toast('Hanya ' + formatAngka(ambilBatas()) + ' soal yang bisa dipilih sekaligus; sisanya tidak ikut terpilih.', 'info');
  gambarAmbil();
};

AKSI['ambil-halaman'] = function (b) {
  const ke = parseInt(b.getAttribute('data-ke'), 10);
  if (!(ke >= 1)) return;
  ambilSt.halaman = ke;
  muatAmbil().then(function () { const g = el('#ab-daftar'); if (g && g.scrollIntoView) { try { g.scrollIntoView({ block: 'nearest' }); } catch (e) {   } } });
};

function htmlSoalLengkap(x) {
  const bs = String(x.kunci || '').split(',');
  return h`<div class="pratinjau-soal">
    <div class="meta"><span class="lencana lencana-primer">${LABEL_JENIS[x.jenis]}</span><span class="lencana lencana-sukses">Kunci: ${kunciTeks(x)}</span></div>
    ${kayaKosong(x.stimulus) ? '' : h`<div class="ps-bacaan ky" aria-label="Teks bacaan atau konteks">${kayaHtml(x.stimulus)}</div>`}
    <div class="ps-tanya ky">${kayaHtml(x.pertanyaan)}</div>
    <ul class="ps-opsi" aria-label="${x.jenis === 'PG' ? 'Opsi jawaban' : 'Pernyataan'}">${(x.opsi || []).map(function (o, i) {
      const hr = 'ABCD'.charAt(i);
      const benar = x.jenis === 'PG' ? x.kunci === hr : bs[i] === 'B';
      return h`<li class="ps-butir${x.jenis === 'PG' && benar ? ' kunci' : ''}"><span class="huruf" aria-hidden="true">${x.jenis === 'PG' ? hr : String(i + 1)}</span><div class="ps-teks ky">${kayaHtml(o)}</div>${x.jenis === 'PG' ? (benar ? h`<span class="lencana lencana-sukses">${ikon('check')} Kunci</span>` : '') : h`<span class="lencana ${benar ? 'lencana-sukses' : 'lencana-bahaya'}">${benar ? 'Benar' : 'Salah'}</span>`}</li>`;
    })}</ul>
  </div>`;
}

AKSI['ambil-pratinjau'] = function (b) {
  const id = b.getAttribute('data-id');
  const x = ambilSt.info[id];
  if (!x) return;
  modal({
    judul: 'Pratinjau soal', lebar: true,
    badan: h`${htmlSoalLengkap(x)}<p class="bantu ps-sumber">Sumber: <strong>${x.namaPaket}</strong> (${x.statusPaket}) · ${x.milikSendiri ? 'milik Anda' : 'oleh ' + x.namaPemilik}${x.sudahAda ? ' · sudah pernah diambil ke paket ini' : ''}</p>`,
    aksi: [
      { id: 'tutup', label: 'Tutup', gaya: 'diam' },
      {
        id: 'pilih', label: ambilSt.pilih[id] ? 'Batalkan pilihan' : 'Pilih soal ini', gaya: 'utama',
        onKlik: function (a) {
          if (ambilSt.pilih[id]) delete ambilSt.pilih[id];
          else if (ambilJumlahPilih() >= ambilBatas()) { toast('Paling banyak ' + formatAngka(ambilBatas()) + ' soal bisa dipilih sekaligus.', 'info'); return; }
          else ambilSt.pilih[id] = true;
          gambarAmbil();
          a.tutup('pilih');
          const lagi = el('[data-aksi="ambil-pratinjau"][data-id="' + id + '"]');
          if (lagi) { try { lagi.focus(); } catch (e) {   } }
        }
      }
    ]
  });
};

AKSI['paket-duplikat'] = function (b) {
  const id = b.getAttribute('data-id') || (edSt.paket && edSt.paket.id);
  const dariEditor = S.halaman === 'paket-edit' && edSt.paket && edSt.paket.id === id;
  const p = dariEditor ? edSt.paket : paketSt.data.filter(function (x) { return x.id === id; })[0];
  if (!p) return;
  const nama = (p.nama.length > 110 ? p.nama.slice(0, 110) : p.nama) + ' (salinan)';
  modal({
    judul: 'Duplikat paket', lebar: true,
    badan: h`<form id="f-duplikat" data-kirim="paket-duplikat" data-id="${p.id}" novalidate>
      <div data-galat aria-live="polite"></div>
      <p class="bantu">Membuat paket baru berstatus <strong>Draf</strong> milik Anda, berisi salinan semua soal aktif dari <strong>${p.nama}</strong>. Soal salinan berdiri sendiri: mengubahnya tidak memengaruhi paket asal.</p>
      <div class="isian"><label for="dp-nama">Nama paket baru</label><input class="kontrol" id="dp-nama" name="nama" type="text" maxlength="120" required value="${nama}" autocomplete="off"></div>
      <p class="bantu">Pengaturan (durasi, acak, tampil hasil, jalur akses) ikut disalin. Kode ujian, riwayat pengerjaan, nilai, dan soal yang dibatalkan lewat Koreksi Massal <strong>tidak</strong> ikut.</p>
    </form>`,
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'duplikat', label: 'Duplikat paket', gaya: 'utama', tipe: 'submit', form: 'f-duplikat' }]
  });
};
KIRIM['paket-duplikat'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  if (!v.nama || v.nama.length < 3) { galatIsian(form, 'nama', 'Nama paket minimal 3 karakter.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('paket.duplikat', { id: form.getAttribute('data-id'), nama: v.nama }).then(function (d) {
      const api = modalTeratas(); if (api) api.tutup('duplikat');
      toast('Paket diduplikat: ' + formatAngka(d.jumlahSoal) + ' soal disalin sebagai Draf.', 'sukses');
      navigateTo('paket-edit', { id: d.paket.id });
    });
  }).catch(function (e) {
    if (e && e.ditangani) return;
    if (['VALIDASI', 'DITOLAK', 'TIDAK_ADA'].indexOf(e.kode) >= 0) galatForm(form, e.message); else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};


const PB_UNGGAH_KARAKTER_MAKS = 14100000;
const PB_MASA_URL_MS = 10 * 60 * 1000;
const PB_BLOK_BYTE = 3072;
const PB_BLOK_B64 = 4096;
const pbSt = { url: null, timer: null, berkas: null, urut: 0 };


function pbLepasUrl() {
  if (pbSt.timer) { clearTimeout(pbSt.timer); pbSt.timer = null; }
  if (pbSt.url) { try { URL.revokeObjectURL(pbSt.url); } catch (e) {   } pbSt.url = null; }
}

function pbBytes(b64) {
  const bin = atob(b64);
  const n = bin.length;
  const u = new Uint8Array(n);
  for (let i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
  return u;
}

function pbSimpanKePerangkat(nama, b64, tipe) {
  let url;
  try {
    url = URL.createObjectURL(new Blob([pbBytes(b64)], { type: tipe || 'application/pdf' }));
  } catch (e) {
    throw galat('UNDUH', 'Peramban ini tidak dapat menyiapkan berkas untuk disimpan. Coba peramban lain atau perbarui peramban Anda.');
  }
  pbLepasUrl();
  pbSt.url = url;
  pbSt.timer = setTimeout(pbLepasUrl, PB_MASA_URL_MS);
  try {
    const a = document.createElement('a');
    a.href = url; a.download = nama; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } catch (e) {   }
  return url;
}

function pbLaporUnduh(wadah, d) {
  const url = pbSimpanKePerangkat(d.nama, d.data, d.tipe);
  if (!wadah) return;
  pasang(wadah, h`<div class="peringatan peringatan-sukses" data-uji="pb-berhasil">${ikon('check-circle')}<div>
    <p><strong>${d.nama}</strong> (${gbUkuranTeks(d.ukuran)}) disiapkan.</p>
    <p class="bantu">Bila berkas tidak tersimpan otomatis, <a href="#" class="tautan" data-pb-tab>buka di tab baru</a> lalu simpan dari sana, atau tekan tombolnya sekali lagi.</p></div></div>`);
  const t = el('a[data-pb-tab]', wadah);
  if (t) { t.setAttribute('href', url); t.setAttribute('target', '_blank'); t.setAttribute('rel', 'noopener'); }
}

function pbLaporGalat(wadah, e) {
  if (!e || e.ditangani) return;
  if (!wadah) { gagalUmum(e); return; }
  pasang(wadah, h`<div class="peringatan peringatan-bahaya" role="alert" data-uji="pb-galat">${ikon('alert-circle')}<div><p>${e.message || 'Terjadi kesalahan.'}</p></div></div>`);
}


function htmlKartuPembahasanSiswa(d) {
  if (!d || !d.adaPembahasan) return '';
  return h`<section class="kartu pb-siswa jarak-atas" aria-labelledby="pb-judul">
    <div class="kartu-judul"><span class="ikon-bulat">${ikon('file-text')}</span><h3 id="pb-judul">Pembahasan</h3></div>
    <p class="bantu">Pembahasan soal paket ini dalam bentuk PDF${d.pembahasanUkuran ? ' (' + gbUkuranTeks(d.pembahasanUkuran) + ')' : ''}.</p>
    <div class="aksi-form pb-aksi"><button type="button" class="tombol" data-aksi="pembahasan-unduh" data-id="${d.percobaan.id}" data-uji="pb-unduh">${ikon('download')}<span>Unduh pembahasan (PDF)</span></button></div>
    <div id="pb-status" class="pb-status" role="status" aria-live="polite"></div></section>`;
}

AKSI['pembahasan-unduh'] = function (b) {
  const st = el('#pb-status');
  if (st) pasang(st, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Menyiapkan berkas… untuk berkas besar ini bisa memakan waktu beberapa detik.</p>`);
  kerjakan(b, function () { return panggil('pembahasan.unduh', { id_percobaan: b.getAttribute('data-id') }); }).then(function (d) {
    if (!d) return;
    pbLaporUnduh(el('#pb-status'), d);
  }).catch(function (e) { pbLaporGalat(el('#pb-status'), e); });
};


function htmlKartuPembahasanStaf(pk, pem) {
  const a = pem && pem.aktif;
  const bukanPenuh = pk.tampilHasil && pk.tampilHasil !== 'penuh';
  return h`<section class="kartu jarak-bawah" id="pembahasan-panel" aria-labelledby="h-pembahasan">
    <div class="kartu-judul"><span class="ikon-bulat">${ikon('file-text')}</span><h3 id="h-pembahasan">Pembahasan (PDF)</h3></div>
    ${a ? h`<dl class="data">
        <div class="data-baris"><dt>Berkas</dt><dd class="pecah" data-uji="pb-nama">${a.nama}</dd></div>
        <div class="data-baris"><dt>Versi aktif</dt><dd class="angka" data-uji="pb-versi">${formatAngka(a.versi)}</dd></div>
        <div class="data-baris"><dt>Ukuran</dt><dd class="angka">${gbUkuranTeks(a.ukuran)}</dd></div>
        <div class="data-baris"><dt>Diunggah</dt><dd>${waktuWIB(a.dibuat)}${a.pengunggah && a.pengunggah !== '—' ? ' oleh ' + a.pengunggah : ''}</dd></div></dl>
      <div class="baris-bungkus jarak-atas-kecil">
        <button type="button" class="tombol tombol-garis" data-aksi="pembahasan-buka" data-uji="pb-buka">${ikon('download')}<span>Buka PDF</span></button>
        <button type="button" class="tombol tombol-garis" data-aksi="pembahasan-unggah" data-uji="pb-ganti">${ikon('upload')}<span>Ganti PDF</span></button>
        <button type="button" class="tombol tombol-diam" data-aksi="pembahasan-riwayat" data-uji="pb-riwayat">${ikon('layers')}<span>Riwayat versi (${formatAngka(pem.jumlahVersi)})</span></button>
        <button type="button" class="tombol tombol-bahaya-garis rata-kanan" data-aksi="pembahasan-lepas" data-uji="pb-lepas">${ikon('x')}<span>Lepas dari paket</span></button></div>`
      : h`<p class="bantu">Belum ada PDF pembahasan. Siswa tidak melihat tombol unduh. PDF dikirim hanya kepada siswa yang sudah menyelesaikan paket ini; tidak ada tautan publik.${pem && pem.jumlahVersi ? ' Versi lama masih tersimpan sebagai arsip (' + formatAngka(pem.jumlahVersi) + ').' : ''}</p>
      <div class="baris-bungkus jarak-atas-kecil">
        <button type="button" class="tombol" data-aksi="pembahasan-unggah" data-uji="pb-unggah">${ikon('upload')}<span>Unggah PDF</span></button>
        ${pem && pem.jumlahVersi ? h`<button type="button" class="tombol tombol-diam" data-aksi="pembahasan-riwayat" data-uji="pb-riwayat">${ikon('layers')}<span>Riwayat versi (${formatAngka(pem.jumlahVersi)})</span></button>` : ''}</div>`}
    ${a && bukanPenuh ? h`<div class="peringatan peringatan-waspada jarak-atas" data-uji="pb-peringatan-tampil">${ikon('alert-triangle')}<div><p>Pengaturan hasil paket ini adalah “${LABEL_TAMPIL[pk.tampilHasil] || pk.tampilHasil}”, tetapi tombol unduh PDF <strong>tetap muncul</strong> bagi siswa yang sudah menyelesaikan paket. Bila PDF belum boleh dilihat siswa, lepaskan dulu dari paket.</p></div></div>` : ''}
    <div id="pb-status" class="pb-status" role="status" aria-live="polite"></div></section>`;
}

AKSI['pembahasan-buka'] = function (b) {
  const pk = edSt.paket;
  const st = el('#pb-status');
  if (st) pasang(st, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Menyiapkan berkas…</p>`);
  kerjakan(b, function () { return panggil('pembahasan.unduh', { id_paket: pk.id }); }).then(function (d) {
    if (!d) return;
    pbLaporUnduh(el('#pb-status'), d);
  }).catch(function (e) { pbLaporGalat(el('#pb-status'), e); });
};

AKSI['pembahasan-lepas'] = function () {
  const pk = edSt.paket;
  const a = edSt.pembahasan && edSt.pembahasan.aktif;
  if (!a) return;
  konfirmasi({
    judul: 'Lepas PDF dari paket?', ya: 'Lepas PDF', bahaya: true,
    pesan: 'Siswa tidak lagi melihat tombol unduh untuk paket ini. Berkas dan riwayat versinya tetap tersimpan sebagai arsip, dan nilai siswa tidak berubah.'
  }).then(function (ya) {
    if (!ya) return;
    panggil('pembahasan.lepas', { id_paket: pk.id }).then(function (r) {
      toast(r.dilepas ? 'PDF dilepas dari paket.' : 'Paket ini memang belum punya PDF aktif.', r.dilepas ? 'sukses' : 'info');
      return segarkanEditor();
    }).catch(gagalUmum);
  });
};


function pbNamaKirim(nama) {
  const s = String(nama || 'pembahasan.pdf').replace(/\s+/g, ' ').trim() || 'pembahasan.pdf';
  if (s.length <= 100) return s;
  const m = /\.[A-Za-z0-9]{1,5}$/.exec(s);
  const ekor = m ? m[0] : '.pdf';
  return s.slice(0, 100 - ekor.length).trim() + ekor;
}

AKSI['pembahasan-unggah'] = function () {
  const pk = edSt.paket;
  const pem = edSt.pembahasan || { aktif: null, jumlahVersi: 0, batasMb: 10 };
  const ganti = !!pem.aktif;
  const bukanPenuh = pk.tampilHasil && pk.tampilHasil !== 'penuh';
  pbSt.berkas = null;
  pbSt.urut++;
  modal({
    judul: ganti ? 'Ganti PDF pembahasan' : 'Unggah PDF pembahasan',
    badan: h`<form id="f-pembahasan" data-kirim="pembahasan-unggah" data-batas="${pem.batasMb}" novalidate>
      <div data-galat aria-live="polite"></div>
      ${ganti ? h`<div class="peringatan peringatan-info jarak-bawah" data-uji="pb-info-ganti">${ikon('info')}<div><p>PDF versi ${formatAngka(pem.aktif.versi)} (${pem.aktif.nama}) akan <strong>diarsipkan, bukan dihapus</strong>. Nilai dan riwayat siswa tidak berubah.</p></div></div>` : ''}
      <div class="isian"><label for="pb-berkas">Pilih berkas PDF</label>
        <input class="kontrol" id="pb-berkas" name="berkas" type="file" accept="application/pdf,.pdf" data-masuk="pb-berkas" aria-describedby="pb-berkas-b">
        <p class="bantu" id="pb-berkas-b">Hanya PDF, maksimal ${formatAngka(pem.batasMb)} MB. PDF dengan kata sandi, skrip, atau yang rusak akan ditolak. Berkas disimpan privat dan hanya dikirim kepada siswa yang sudah menyelesaikan paket ini.</p></div>
      <div id="pb-pilihan" class="pb-pilihan" aria-live="polite"></div>
      ${bukanPenuh ? h`<div class="peringatan peringatan-waspada" data-uji="pb-peringatan-unggah">${ikon('alert-triangle')}<div><p>Pengaturan hasil paket ini “${LABEL_TAMPIL[pk.tampilHasil] || pk.tampilHasil}”. Tombol unduh PDF tetap muncul bagi siswa yang sudah selesai, apa pun pengaturan itu.</p></div></div>` : ''}
    </form>`,
    aksi: [
      { id: 'batal', label: 'Batal', gaya: 'diam' },
      { id: 'kirim', label: ganti ? 'Ganti PDF' : 'Unggah PDF', gaya: 'utama', tipe: 'submit', form: 'f-pembahasan' }
    ]
  });
};

MASUKAN['pb-berkas'] = function (r, e) {
  if (e && e.type === 'input') return;
  const form = r.form;
  const kotak = el('#pb-pilihan', form);
  const batasMb = parseInt(form.getAttribute('data-batas'), 10) || 10;
  bersihGalat(form);
  pbSt.berkas = null;
  const nomor = ++pbSt.urut;
  const file = r.files && r.files[0];
  if (!file) { pasang(kotak, h``); return; }
  const tolak = function (pesan) {
    if (nomor !== pbSt.urut) return;
    r.value = '';
    pbSt.berkas = null;
    pasang(kotak, h``);
    galatIsian(form, 'berkas', pesan);
  };
  if (file.size === 0) { tolak('Berkas ini kosong.'); return; }
  if (file.size > batasMb * 1048576) { tolak('Ukuran berkas ' + gbUkuranTeks(file.size) + ' melebihi batas ' + formatAngka(batasMb) + ' MB. Perkecil PDF-nya atau minta Admin menaikkan batas (maksimal 10 MB).'); return; }
  pasang(kotak, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Memeriksa berkas…</p>`);
  const baca = new FileReader();
  baca.onerror = function () { tolak('Berkas tidak bisa dibaca. Coba pilih lagi.'); };
  baca.onload = function () {
    if (nomor !== pbSt.urut) return;
    const u = new Uint8Array(baca.result);
    const awal = String.fromCharCode.apply(null, Array.prototype.slice.call(u));
    if (awal !== '%PDF-') { tolak('Isi berkas bukan PDF. Pastikan berkasnya benar-benar PDF (bukan DOC, gambar, atau berkas yang hanya diganti namanya).'); return; }
    pbSt.berkas = file;
    pasang(kotak, h`<p class="bantu pb-dipilih" data-uji="pb-dipilih">${ikon('file-text', 'ikon-sm')} <strong>${file.name}</strong> · ${gbUkuranTeks(file.size)}</p>`);
  };
  baca.readAsArrayBuffer(file.slice(0, 5));
};

KIRIM['pembahasan-unggah'] = function (form) {
  bersihGalat(form);
  const file = pbSt.berkas;
  const pk = edSt.paket;
  if (!file) { galatIsian(form, 'berkas', 'Pilih berkas PDF dulu.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return gbBase64(file).then(function (b64) {
      if (b64.length > PB_UNGGAH_KARAKTER_MAKS) throw galat('UKURAN', 'Berkas terlalu besar untuk dikirim. Perkecil PDF-nya.');
      return panggil('pembahasan.unggah', { id_paket: pk.id, nama: pbNamaKirim(file.name), tipe: 'application/pdf', data: b64 });
    }).then(function (r) {
      const api = modalTeratas(); if (api) api.tutup('disimpan');
      pbSt.berkas = null;
      if (r.tidakBerubah) toast('PDF ini sama dengan versi aktif; tidak ada perubahan.', 'info');
      else toast('PDF pembahasan tersimpan sebagai versi ' + formatAngka(r.pembahasan.versi) + '.', 'sukses');
      return segarkanEditor();
    });
  }).catch(function (e) {
    if (['VALIDASI', 'FORMAT', 'UKURAN', 'TERENKRIPSI', 'BERBAHAYA', 'DRIVE', 'TIDAK_ADA', 'PERMINTAAN'].indexOf(e.kode) >= 0) galatForm(form, e.message); else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};


function pbDaftarVersi(d) {
  if (!d.versi.length) return h`<p class="teks-redam tanpa-margin">Belum ada versi.</p>`;
  return h`<ul class="pb-versi" role="list">${d.versi.map(function (v) {
    return h`<li class="pb-versi-baris" data-uji="pb-versi-baris">
      <div class="pb-versi-info"><div class="baris-bungkus"><strong class="angka">Versi ${formatAngka(v.versi)}</strong><span class="lencana ${v.aktif ? 'lencana-sukses' : ''}">${v.aktif ? 'Aktif' : 'Arsip'}</span></div>
        <div class="pecah">${v.nama}</div>
        <div class="bantu">${gbUkuranTeks(v.ukuran)} · diunggah ${waktuWIB(v.dibuat)}${v.pengunggah && v.pengunggah !== '—' ? ' oleh ' + v.pengunggah : ''}${v.diarsipkan ? ' · diarsipkan ' + waktuWIB(v.diarsipkan) : ''}</div></div>
      <button type="button" class="tombol tombol-garis" data-aksi="pembahasan-buka-versi" data-versi="${v.versi}" aria-label="Buka versi ${v.versi}">${ikon('download')}<span>Buka</span></button></li>`;
  })}</ul>`;
}

AKSI['pembahasan-riwayat'] = function (b) {
  kerjakan(b, function () { return panggil('pembahasan.daftar', { id_paket: edSt.paket.id }); }).then(function (d) {
    if (!d) return;
    modal({
      judul: 'Riwayat versi PDF', lebar: true,
      badan: h`<p class="bantu">Versi lama tidak pernah dihapus. Bila PDF salah terunggah, unggah versi yang benar; yang salah ikut tersimpan sebagai arsip.</p>
        ${pbDaftarVersi(d)}<div id="pb-status-modal" class="pb-status" role="status" aria-live="polite"></div>`,
      aksi: [{ id: 'tutup', label: 'Tutup', gaya: 'diam' }]
    });
  }).catch(gagalUmum);
};

AKSI['pembahasan-buka-versi'] = function (b) {
  const st = el('#pb-status-modal');
  if (st) pasang(st, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Menyiapkan berkas…</p>`);
  const versi = parseInt(b.getAttribute('data-versi'), 10);
  kerjakan(b, function () { return panggil('pembahasan.unduh', { id_paket: edSt.paket.id, versi: versi }); }).then(function (d) {
    if (!d) return;
    pbLaporUnduh(el('#pb-status-modal'), d);
  }).catch(function (e) { pbLaporGalat(el('#pb-status-modal'), e); });
};


function htmlKartuPdfPengaturan(g) {
  return h`<section class="kartu" aria-labelledby="h-pdf"><div class="kartu-judul"><span class="ikon-bulat">${ikon('file-text')}</span><h3 id="h-pdf">PDF pembahasan</h3></div>
    <p class="bantu">PDF disimpan di folder privat TKA-BERIZIN (tidak dibagikan) dan hanya dikirim aplikasi kepada siswa yang sudah menyelesaikan paketnya. Guru pemilik paket dan Admin dapat mengunggah.</p>
    <form id="f-pdf" data-kirim="pdf-simpan" novalidate>
      <div data-galat aria-live="polite"></div>
      <div class="isian"><label for="pg-pdf">Batas ukuran PDF (MB)</label>
        <input class="kontrol angka" id="pg-pdf" name="pdf_maks_mb" type="number" min="1" max="10" step="1" inputmode="numeric" required value="${g.pdf_maks_mb || '10'}" aria-describedby="pg-pdf-b">
        <p class="bantu" id="pg-pdf-b">1–10 MB. Kemampuan Apps Script mengirim PDF sebesar ini ke banyak siswa sekaligus belum terbukti; jalankan uji di bawah, lalu turunkan batas bila hasilnya lambat atau gagal.</p></div>
      <div class="aksi-form"><button type="submit" class="tombol">${ikon('save')}<span>Simpan batas</span></button></div>
    </form>
    <div class="aksi-form jarak-atas"><button type="button" class="tombol tombol-garis" data-aksi="berizin-uji" data-uji="pb-uji">${ikon('activity')}<span>Uji kirim dan unduh PDF</span></button></div></section>`;
}

KIRIM['pdf-simpan'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const mb = parseInt(v.pdf_maks_mb, 10);
  if (!(mb >= 1 && mb <= 10) || String(mb) !== String(v.pdf_maks_mb)) { galatIsian(form, 'pdf_maks_mb', 'Batas harus bilangan bulat 1–10 MB.'); return; }
  if (String(mb) === String(pgAsli.pdf_maks_mb || '10')) { toast('Tidak ada perubahan untuk disimpan.', 'info'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('pengaturan.simpan', { kunci: 'pdf_maks_mb', nilai: String(mb) }).then(function () {
      pgAsli.pdf_maks_mb = String(mb);
      toast('Batas ukuran PDF: ' + formatAngka(mb) + ' MB.', 'sukses');
    });
  }).catch(function (e) { if (e.kode === 'VALIDASI') galatIsian(form, 'pdf_maks_mb', e.message); else gagalUmum(e); })
    .then(function () { form.removeAttribute('data-sibuk'); });
};

function pbBlokUji() {
  const u = new Uint8Array(PB_BLOK_BYTE);
  for (let i = 0; i < PB_BLOK_BYTE; i++) u[i] = (((i * 131 + 7) % 251) - 125) & 255;
  let s = '';
  for (let i = 0; i < PB_BLOK_BYTE; i++) s += String.fromCharCode(u[i]);
  return btoa(s);
}

function pbDtk(ms) { return formatAngka(ms / 1000, 1) + ' dtk'; }

function pbTulisUji(api, mb, arah, st, teks) {
  const n = el('#pb-u-' + arah + '-' + mb, api.el);
  if (!n) return;
  n.textContent = teks;
  n.className = 'lencana ' + (st === 'ok' ? 'lencana-sukses' : (st === 'gagal' ? 'lencana-bahaya' : (st === 'lambat' ? 'lencana-peringatan' : '')));
  n.setAttribute('data-status', st);
}

const PB_LAMBAT_MS = 20000;

function pbUjiSatu(api, mb, blokB64) {
  const ulang = Math.ceil(mb * 1048576 / PB_BLOK_BYTE);
  const hidup = function () { return document.body.contains(api.el); };
  const muatan = new Array(ulang + 1).join(blokB64);
  pbTulisUji(api, mb, 'kirim', 'jalan', 'Mengirim…');
  const t0 = performance.now();
  return panggil('berizin.ujiKirim', { data: muatan }).then(function (r) {
    const ms = performance.now() - t0;
    if (!hidup()) return;
    if (r.karakter !== muatan.length || r.byte !== ulang * PB_BLOK_BYTE) {
      pbTulisUji(api, mb, 'kirim', 'gagal', 'Tidak utuh: server menerima ' + formatAngka(r.byte) + ' byte, seharusnya ' + formatAngka(ulang * PB_BLOK_BYTE));
    } else {
      pbTulisUji(api, mb, 'kirim', ms > PB_LAMBAT_MS ? 'lambat' : 'ok', (ms > PB_LAMBAT_MS ? 'Utuh tetapi lambat: ' : 'Utuh: ') + pbDtk(ms));
    }
  }, function (e) {
    if (hidup()) pbTulisUji(api, mb, 'kirim', 'gagal', 'Gagal: ' + (e.message || 'tidak ada jawaban'));
  }).then(function () {
    if (!hidup()) return;
    pbTulisUji(api, mb, 'terima', 'jalan', 'Menerima…');
    const t1 = performance.now();
    return panggil('berizin.ujiUnduh', { mb: mb }).then(function (r) {
      const ms = performance.now() - t1;
      if (!hidup()) return;
      const d = String(r.data || '');
      const utuh = d.length === r.ulang * PB_BLOK_B64 && r.byte === r.ulang * PB_BLOK_BYTE && r.ulang === ulang &&
        d.slice(0, PB_BLOK_B64) === blokB64 && d.slice(-PB_BLOK_B64) === blokB64 &&
        d.slice(Math.floor(r.ulang / 2) * PB_BLOK_B64, Math.floor(r.ulang / 2) * PB_BLOK_B64 + PB_BLOK_B64) === blokB64;
      if (!utuh) pbTulisUji(api, mb, 'terima', 'gagal', 'Tidak utuh: diterima ' + formatAngka(d.length) + ' karakter, seharusnya ' + formatAngka(ulang * PB_BLOK_B64));
      else pbTulisUji(api, mb, 'terima', ms > PB_LAMBAT_MS ? 'lambat' : 'ok', (ms > PB_LAMBAT_MS ? 'Utuh tetapi lambat: ' : 'Utuh: ') + pbDtk(ms));
    }, function (e) {
      if (hidup()) pbTulisUji(api, mb, 'terima', 'gagal', 'Gagal: ' + (e.message || 'tidak ada jawaban'));
    });
  });
}

AKSI['berizin-uji'] = function () {
  const ukuran = [1, 5, 10];
  let jalan = false;
  const api = modal({
    judul: 'Uji kirim dan unduh PDF', lebar: true,
    badan: h`<div class="peringatan peringatan-info" role="note">${ikon('info')}<div><p>Uji ini mengirim data uji sebesar 1, 5, dan 10 MB dari peramban ini ke server dan sebaliknya, lalu memeriksa apakah sampai utuh dan berapa lama. Jalankan dari <strong>alamat Blogger tempat siswa memakai aplikasi</strong>, bukan dari editor Apps Script. Tidak ada data yang disimpan.</p>
        <p>Satu uji ini hanya mengukur <strong>satu pengguna</strong>. Perilaku saat puluhan siswa mengunduh bersamaan belum terukur oleh uji ini.</p></div></div>
      <ul class="pb-uji jarak-atas" role="list">${ukuran.map(function (mb) {
        return h`<li class="pb-uji-baris"><strong class="angka">${mb} MB</strong>
          <div class="pb-uji-arah"><span class="teks-redam">Kirim ke server</span><span class="lencana" id="pb-u-kirim-${mb}" role="status">Belum diuji</span></div>
          <div class="pb-uji-arah"><span class="teks-redam">Terima dari server</span><span class="lencana" id="pb-u-terima-${mb}" role="status">Belum diuji</span></div></li>`;
      })}</ul>
      <div class="baris-bungkus jarak-atas">
        <button type="button" class="tombol tombol-garis" data-aksi="berizin-uji-simpan" data-uji="pb-uji-simpan">${ikon('download')}<span>Uji simpan PDF kecil ke perangkat</span></button></div>
      <div id="pb-uji-simpan-status" class="pb-status" role="status" aria-live="polite"></div>
      <p class="bantu" id="pb-uji-ringkas" aria-live="polite" data-uji="pb-uji-ringkas"></p>`,
    aksi: [
      { id: 'tutup', label: 'Tutup', gaya: 'diam' },
      { id: 'jalan', label: 'Jalankan uji', gaya: 'utama', onKlik: function (a, tombol) {
        if (jalan) return;
        jalan = true;
        const blok = pbBlokUji();
        kerjakan(tombol, function () {
          let rantai = Promise.resolve();
          ukuran.forEach(function (mb) { rantai = rantai.then(function () { return document.body.contains(a.el) ? pbUjiSatu(a, mb, blok) : null; }); });
          return rantai;
        }).then(function () {
          jalan = false;
          const w = el('#pb-uji-ringkas', a.el);
          if (!w) return;
          const lencana = semua('[data-status]', a.el);
          const gagal = lencana.filter(function (n) { return n.getAttribute('data-status') === 'gagal'; }).length;
          const lambat = lencana.filter(function (n) { return n.getAttribute('data-status') === 'lambat'; }).length;
          w.textContent = gagal
            ? gagal + ' dari ' + lencana.length + ' uji gagal. Turunkan batas ukuran PDF di Pengaturan sampai ukuran yang lolos, lalu uji ulang.'
            : (lambat ? 'Semua uji sampai utuh, tetapi ' + lambat + ' lambat. Pertimbangkan menurunkan batas ukuran PDF.' : 'Semua uji sampai utuh. Ini hanya membuktikan satu pengguna; belum membuktikan banyak siswa mengunduh bersamaan.');
        });
      } }
    ]
  });
  return api;
};

AKSI['berizin-uji-simpan'] = function (b) {
  const st = el('#pb-uji-simpan-status');
  if (st) pasang(st, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Menyiapkan PDF uji…</p>`);
  kerjakan(b, function () { return panggil('berizin.pdfUji', {}); }).then(function (d) {
    if (!d) return;
    pbLaporUnduh(el('#pb-uji-simpan-status'), d);
  }).catch(function (e) { pbLaporGalat(el('#pb-uji-simpan-status'), e); });
};


const mtSt = { q: '', mapel: '', kategori: '', jenis: '', status: '', data: null, seq: 0 };
const MT_KATEGORI = ['Try Out Utama', 'Latihan Materi'];
const MT_STATUS = ['Draf', 'Terbit', 'Diarsipkan'];
const MT_GALAT_FORM = ['VALIDASI', 'FORMAT', 'UKURAN', 'TERENKRIPSI', 'BERBAHAYA', 'DRIVE', 'TIDAK_ADA', 'PERMINTAAN', 'BATAS', 'TERKUNCI', 'BELUM_PASANG', 'BERIZIN_TERBUKA'];

function mtIkonJenis(jenis) { return jenis === 'Video' ? 'play' : 'file-text'; }
function mtDari(id) { return ((mtSt.data && mtSt.data.materi) || []).filter(function (m) { return m.id === id; })[0] || null; }

function renderMateri(p, c) {
  const admin = S.pengguna.peran === PERAN.ADMIN;
  pasang(c.wadah, h`
    ${kepalaHalaman(admin ? 'Materi' : 'Materi saya', admin ? 'Materi PDF dan video dari semua guru.' : 'Materi PDF dan video yang Anda kelola.', h`<button type="button" class="tombol" data-aksi="materi-baru" data-uji="mt-baru">${ikon('plus')}<span>Tambah materi</span></button>`)}
    <div class="peringatan peringatan-info jarak-bawah" data-uji="mt-info-siswa">${ikon('info')}<div><p>Materi berstatus <strong>Terbit</strong> tampil kepada siswa di menu Materi. Materi Draf dan Arsip tidak pernah tampil kepada siswa.</p></div></div>
    <div class="saring saring-5" role="search">
      <div class="cari"><label class="sr-only" for="mt-cari">Cari materi</label>${ikon('search')}<input class="kontrol" id="mt-cari" type="search" placeholder="Cari judul materi" value="${mtSt.q}" data-masuk="materi-saring" autocomplete="off"></div>
      <div class="isian"><label class="sr-only" for="mt-mapel">Mata pelajaran</label><select class="kontrol" id="mt-mapel" data-masuk="materi-saring"><option value="">Semua mapel</option>${MAPEL_URUT.map(function (k) { return h`<option value="${k}"${mtSt.mapel === k ? mentah(' selected') : ''}>${MAPEL[k]}</option>`; })}</select></div>
      <div class="isian"><label class="sr-only" for="mt-kategori">Kategori</label><select class="kontrol" id="mt-kategori" data-masuk="materi-saring"><option value="">Semua kategori</option>${MT_KATEGORI.map(function (k) { return h`<option value="${k}"${mtSt.kategori === k ? mentah(' selected') : ''}>${k}</option>`; })}</select></div>
      <div class="isian"><label class="sr-only" for="mt-jenis">Jenis</label><select class="kontrol" id="mt-jenis" data-masuk="materi-saring"><option value="">Semua jenis</option><option value="PDF"${mtSt.jenis === 'PDF' ? mentah(' selected') : ''}>PDF</option><option value="Video"${mtSt.jenis === 'Video' ? mentah(' selected') : ''}>Video</option></select></div>
      <div class="isian"><label class="sr-only" for="mt-status">Status</label><select class="kontrol" id="mt-status" data-masuk="materi-saring"><option value="">Semua status</option>${MT_STATUS.map(function (k) { return h`<option value="${k}"${mtSt.status === k ? mentah(' selected') : ''}>${k}</option>`; })}</select></div>
    </div>
    <p class="bantu jarak-bawah" id="mt-hitung" aria-live="polite"></p>
    <div id="mt-daftar"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat materi…</span></div></div>`);
  fokusJudul();
  muatMateri(c.ok).then(function () { if (p && p.baru && c.ok()) AKSI['materi-baru'](); });
}

function muatMateri(ok) {
  const seq = ++mtSt.seq;
  return panggil('materi.daftar', { q: mtSt.q, mapel: mtSt.mapel, kategori: mtSt.kategori, jenis: mtSt.jenis, status: mtSt.status }, { ulang: true }).then(function (d) {
    if (seq !== mtSt.seq || (ok && !ok())) return;
    mtSt.data = d;
    gambarMateri();
  }).catch(function (e) {
    if (seq !== mtSt.seq || (ok && !ok())) return;
    tampilkanGalatMuat(el('#mt-daftar'), e, true);
  });
}
MASUKAN['materi-saring'] = tundaKe(function () {
  const a = el('#mt-cari'), b = el('#mt-mapel'), k = el('#mt-kategori'), j = el('#mt-jenis'), s = el('#mt-status');
  if (!a || !b || !k || !j || !s) return;
  mtSt.q = a.value.trim(); mtSt.mapel = b.value; mtSt.kategori = k.value; mtSt.jenis = j.value; mtSt.status = s.value;
  muatMateri();
}, 300);

function mtMeta(m, admin) {
  const bagian = [];
  if (m.jenis === 'PDF') {
    if (m.berkas) {
      bagian.push(h`<span class="pecah" data-uji="mt-berkas">${m.berkas.nama}</span>`);
      bagian.push(h`<span>${gbUkuranTeks(m.berkas.ukuran)}</span>`);
      bagian.push(h`<span class="angka">versi ${formatAngka(m.berkas.versi)}</span>`);
    } else bagian.push(h`<span class="mt-kurang" data-uji="mt-tanpa-berkas">${ikon('alert-triangle', 'ikon-sm')} Belum ada berkas PDF</span>`);
  } else bagian.push(h`<span class="pecah" data-uji="mt-host">${m.host || 'tautan tidak sah'}</span>`);
  bagian.push(h`<span>diperbarui ${waktuWIB(m.diubah)}</span>`);
  if (admin && m.pemilik) bagian.push(h`<span>oleh ${m.pemilik}</span>`);
  return bagian.map(function (x, i) { return h`${i ? h`<span aria-hidden="true">·</span>` : ''}${x}`; });
}

function gambarMateri() {
  const wadah = el('#mt-daftar');
  if (!wadah || !mtSt.data) return;
  const admin = S.pengguna.peran === PERAN.ADMIN;
  const daftar = mtSt.data.materi;
  const hit = el('#mt-hitung');
  if (hit) hit.textContent = formatAngka(mtSt.data.total) + ' materi.' + (mtSt.data.terpotong ? ' Hanya sebagian yang ditampilkan; persempit penyaring.' : '');
  if (!daftar.length) {
    const disaring = mtSt.q || mtSt.mapel || mtSt.kategori || mtSt.jenis || mtSt.status;
    pasang(wadah, h`<div class="kartu kosong"><span class="ikon-bulat netral">${ikon('book-open')}</span><h3>${disaring ? 'Tidak ada materi yang cocok' : 'Belum ada materi'}</h3><p>${disaring ? 'Ubah penyaring untuk melihat materi lain.' : 'Tambahkan materi PDF atau tautan video untuk membantu siswa belajar.'}</p>${disaring ? '' : h`<button type="button" class="tombol" data-aksi="materi-baru">${ikon('plus')}<span>Tambah materi</span></button>`}</div>`);
    return;
  }
  const per = {};
  daftar.forEach(function (x) { (per[x.mapel] = per[x.mapel] || []).push(x); });
  pasang(wadah, h`${MAPEL_URUT.filter(function (k) { return per[k]; }).map(function (k) {
    return h`<section aria-labelledby="mtm-${k}"><div class="mapel-judul"><span class="ikon-bulat">${ikon(IKON_MAPEL[k])}</span><h3 id="mtm-${k}">${MAPEL[k]}</h3></div>
      <div class="kisi">${per[k].map(function (m) {
        const tanpaBerkas = m.jenis === 'PDF' && !m.berkas;
        return h`<article class="kartu kartu-paket-staf kartu-materi" data-uji="mt-kartu" data-id="${m.id}" data-status="${m.status}">
          <div class="paket-staf-kepala"><span class="ikon-bulat netral" aria-hidden="true">${ikon(mtIkonJenis(m.jenis))}</span><h4>${m.judul}</h4>${lencanaStatus(m.status)}</div>
          <div class="paket-staf-meta"><span class="lencana lencana-primer">${m.kategori}</span><span class="lencana" data-uji="mt-jenis">${m.jenis}</span></div>
          <div class="paket-staf-meta">${mtMeta(m, admin)}</div>
          <div class="paket-staf-aksi">
            ${tanpaBerkas ? h`<button type="button" class="tombol" data-aksi="materi-ganti" data-id="${m.id}" data-uji="mt-unggah">${ikon('upload')}<span>Unggah PDF</span></button>`
              : h`<button type="button" class="tombol" data-aksi="materi-pratinjau" data-id="${m.id}" data-uji="mt-pratinjau">${ikon('eye')}<span>Pratinjau</span></button>`}
            <div class="isian mt-status-pilih"><label class="sr-only" for="mt-st-${m.id}">Status ${m.judul}</label>
              <select class="kontrol" id="mt-st-${m.id}" data-masuk="materi-status" data-id="${m.id}" data-uji="mt-status-pilih">${MT_STATUS.map(function (s) { return h`<option value="${s}"${m.status === s ? mentah(' selected') : ''}>${s}</option>`; })}</select></div>
            <button type="button" class="tombol tombol-garis" data-aksi="materi-ubah" data-id="${m.id}" data-uji="mt-ubah">${ikon('edit')}<span>Ubah</span></button>
            ${m.jenis === 'PDF' && m.berkas ? h`<button type="button" class="tombol tombol-garis" data-aksi="materi-ganti" data-id="${m.id}" data-uji="mt-ganti">${ikon('upload')}<span>Ganti PDF</span></button>` : ''}
            ${m.jenis === 'PDF' && m.jumlahVersi ? h`<button type="button" class="tombol tombol-diam" data-aksi="materi-riwayat" data-id="${m.id}" data-uji="mt-riwayat">${ikon('layers')}<span>Riwayat (${formatAngka(m.jumlahVersi)})</span></button>` : ''}
            <button type="button" class="tombol tombol-bahaya-garis rata-kanan" data-aksi="materi-hapus" data-id="${m.id}" aria-label="Hapus materi ${m.judul}" data-uji="mt-hapus">${ikon('trash')}<span>Hapus</span></button>
          </div></article>`;
      })}</div></section>`;
  })}`);
}

MASUKAN['materi-status'] = function (r, e) {
  if (e && e.type === 'input') return;
  const id = r.getAttribute('data-id');
  const baru = r.value;
  r.disabled = true;
  panggil('materi.status', { id: id, status: baru }).then(function (res) {
    if (!res.berubah) return;
    toast(baru === 'Terbit' ? 'Materi diterbitkan. Siswa dapat melihatnya di menu Materi.' : (baru === 'Diarsipkan' ? 'Materi diarsipkan; siswa tidak lagi melihatnya.' : 'Materi dikembalikan ke Draf.'), 'sukses');
  }).catch(function (er) {
    gagalUmum(er);
  }).then(function () { return muatMateri(); });
};

function mtHostTeks() {
  const d = mtSt.data && mtSt.data.hostIzin;
  return d && d.length ? d.join(', ') : 'semua domain https';
}

function formMateri(m) {
  const baru = !m;
  const v = m || { jenis: 'PDF', judul: '', mapel: '', kategori: 'Latihan Materi', tautan: '' };
  const batas = (mtSt.data && mtSt.data.batasMb) || 10;
  return h`<form id="f-materi" data-kirim="materi-simpan" data-id="${m ? m.id : ''}" data-jenis="${v.jenis}" data-batas="${batas}" novalidate>
    <div data-galat aria-live="polite"></div>
    ${baru ? h`<fieldset class="isian fieldset-polos"><legend class="label">Jenis materi</legend><div class="segmen" role="radiogroup" aria-label="Jenis materi">
      <label>${ikon('check')}<input type="radio" name="jenis" value="PDF" checked data-masuk="materi-jenis" data-uji="mt-jenis-pdf"> PDF</label>
      <label>${ikon('check')}<input type="radio" name="jenis" value="Video" data-masuk="materi-jenis" data-uji="mt-jenis-video"> Video (tautan)</label></div></fieldset>`
      : h`<p class="bantu"><span class="lencana">${v.jenis}</span> Jenis materi tidak bisa diubah. Buat materi baru bila jenisnya salah.</p>`}
    <div class="isian"><label for="mt-f-judul">Judul</label><input class="kontrol" id="mt-f-judul" name="judul" type="text" maxlength="120" required value="${v.judul}" placeholder="Contoh: Ringkasan Pecahan Kelas 6"></div>
    <div class="kelompok-isian">
      <div class="isian"><label for="mt-f-mapel">Mata pelajaran</label><select class="kontrol" id="mt-f-mapel" name="mapel" required>${baru ? h`<option value="">Pilih…</option>` : ''}${MAPEL_URUT.map(function (k) { return h`<option value="${k}"${v.mapel === k ? mentah(' selected') : ''}>${MAPEL[k]}</option>`; })}</select></div>
      <div class="isian"><label for="mt-f-kategori">Kategori</label><select class="kontrol" id="mt-f-kategori" name="kategori" required>${MT_KATEGORI.map(function (k) { return h`<option value="${k}"${v.kategori === k ? mentah(' selected') : ''}>${k}</option>`; })}</select></div>
    </div>
    ${baru ? h`<div class="isian" id="mt-blok-pdf"><label for="pb-berkas">Berkas PDF</label>
        <input class="kontrol" id="pb-berkas" name="berkas" type="file" accept="application/pdf,.pdf" data-masuk="pb-berkas" aria-describedby="mt-berkas-b">
        <p class="bantu" id="mt-berkas-b">Hanya PDF, maksimal ${formatAngka(batas)} MB. PDF dengan kata sandi, skrip, atau yang rusak akan ditolak. Berkas disimpan privat dan hanya dikirim aplikasi kepada yang berhak.</p>
        <div id="pb-pilihan" class="pb-pilihan" aria-live="polite"></div></div>` : ''}
    ${baru || v.jenis === 'Video' ? h`<div class="isian" id="mt-blok-video"${baru ? mentah(' hidden') : ''}><label for="mt-f-tautan">Tautan video</label>
        <input class="kontrol" id="mt-f-tautan" name="tautan" type="url" maxlength="500" inputmode="url" placeholder="https:&#47;&#47;www.youtube.com/watch?v=…" value="${v.tautan || ''}" autocomplete="off" aria-describedby="mt-tautan-b">
        <p class="bantu" id="mt-tautan-b">Harus diawali https:&#47;&#47;. Domain yang diizinkan: ${mtHostTeks()}. Video tidak diunggah ke aplikasi dan dibuka di tab baru tanpa diputar otomatis. Tautan yang tidak dipublikasikan bukan pengaman: siapa pun yang memegang tautannya dapat membukanya.</p></div>` : ''}
    ${baru ? h`<p class="bantu">Materi baru berstatus Draf. Periksa dengan Pratinjau, lalu terbitkan dari daftar.</p>` : ''}
  </form>`;
}

MASUKAN['materi-jenis'] = function (r) {
  const form = r.form;
  if (!form || !r.checked) return;
  const pdf = el('#mt-blok-pdf', form), vid = el('#mt-blok-video', form);
  if (pdf) pdf.hidden = r.value !== 'PDF';
  if (vid) vid.hidden = r.value !== 'Video';
  form.setAttribute('data-jenis', r.value);
  bersihGalat(form);
};

AKSI['materi-baru'] = function () {
  pbSt.berkas = null;
  pbSt.urut++;
  modal({
    judul: 'Tambah materi', lebar: true, badan: formMateri(null),
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'simpan', label: 'Simpan materi', gaya: 'utama', tipe: 'submit', form: 'f-materi' }]
  });
};
AKSI['materi-ubah'] = function (b) {
  const m = mtDari(b.getAttribute('data-id'));
  if (!m) return;
  modal({
    judul: 'Ubah info materi', lebar: true, badan: formMateri(m),
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'simpan', label: 'Simpan', gaya: 'utama', tipe: 'submit', form: 'f-materi' }]
  });
};

function mtGalatKirim(form, e) {
  if (e && e.kode === 'DOMAIN') galatIsian(form, 'tautan', e.message);
  else if (e && MT_GALAT_FORM.indexOf(e.kode) >= 0) galatForm(form, e.message);
  else gagalUmum(e);
}

function mtUnggahBerkas(idMateri, file) {
  return gbBase64(file).then(function (b64) {
    if (b64.length > PB_UNGGAH_KARAKTER_MAKS) throw galat('UKURAN', 'Berkas terlalu besar untuk dikirim. Perkecil PDF-nya.');
    return panggil('materi.berkas', { id: idMateri, nama: pbNamaKirim(file.name), tipe: 'application/pdf', data: b64 });
  });
}

KIRIM['materi-simpan'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const id = form.getAttribute('data-id');
  const idBaru = form.getAttribute('data-baru-id');
  const jenis = id ? form.getAttribute('data-jenis') : (v.jenis || 'PDF');
  if (!idBaru) {
    if (!v.judul || v.judul.length < 3) { galatIsian(form, 'judul', 'Judul minimal 3 karakter.'); return; }
    if (v.judul.length > 120) { galatIsian(form, 'judul', 'Judul maksimal 120 karakter.'); return; }
    if (!v.mapel) { galatIsian(form, 'mapel', 'Pilih mata pelajaran.'); return; }
    if (jenis === 'Video') {
      if (!v.tautan) { galatIsian(form, 'tautan', 'Tautan video wajib diisi.'); return; }
      if (!urlHttps(v.tautan)) { galatIsian(form, 'tautan', 'Tautan harus diawali https:\/\/ dan tidak boleh berisi spasi.'); return; }
    }
  }
  if (!id && jenis === 'PDF' && !pbSt.berkas) { galatIsian(form, 'berkas', 'Pilih berkas PDF dulu.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  let telahDibuat = false;
  kerjakan(tombolKirim(form), function () {
    let langkah;
    if (idBaru) langkah = Promise.resolve({ materi: { id: idBaru }, dibuat: true, berubah: true, ulang: true });
    else if (id) {
      const data = { id: id, judul: v.judul, mapel: v.mapel, kategori: v.kategori };
      if (jenis === 'Video') data.tautan = v.tautan;
      langkah = panggil('materi.simpan', data);
    } else {
      const data = { jenis: jenis, judul: v.judul, mapel: v.mapel, kategori: v.kategori };
      if (jenis === 'Video') data.tautan = v.tautan;
      langkah = panggil('materi.simpan', data);
    }
    return langkah.then(function (r) {
      if (!id && !idBaru) {
        telahDibuat = true;
        form.setAttribute('data-baru-id', r.materi.id);
        mtKunciIsian(form);
      }
      if (!id && jenis === 'PDF') {
        return mtUnggahBerkas(r.materi.id, pbSt.berkas).then(function () { return r; });
      }
      return r;
    });
  }).then(function (r) {
    if (!r) return;
    const api = modalTeratas(); if (api) api.tutup('disimpan');
    pbSt.berkas = null;
    if (id) toast(r.berubah ? 'Perubahan materi disimpan.' : 'Tidak ada perubahan untuk disimpan.', r.berubah ? 'sukses' : 'info');
    else toast('Materi dibuat sebagai Draf. Periksa dengan Pratinjau, lalu terbitkan.', 'sukses');
    return muatMateri();
  }).catch(function (e) {
    if (telahDibuat || idBaru) {
      if (telahDibuat) muatMateri();
      galatForm(form, (e && e.message ? e.message + ' ' : '') + 'Materi sudah dibuat sebagai Draf. Pilih berkas PDF lagi lalu tekan Simpan, atau tutup jendela ini dan unggah dari daftar.');
      return;
    }
    mtGalatKirim(form, e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};

function mtKunciIsian(form) {
  ['jenis', 'judul', 'mapel', 'kategori', 'tautan'].forEach(function (n) {
    semua('[name="' + n + '"]', form).forEach(function (x) { x.disabled = true; });
  });
}

AKSI['materi-ganti'] = function (b) {
  const m = mtDari(b.getAttribute('data-id'));
  if (!m) return;
  const ganti = !!m.berkas;
  const batas = (mtSt.data && mtSt.data.batasMb) || 10;
  pbSt.berkas = null;
  pbSt.urut++;
  modal({
    judul: ganti ? 'Ganti PDF materi' : 'Unggah PDF materi',
    badan: h`<form id="f-materi-berkas" data-kirim="materi-berkas" data-id="${m.id}" data-batas="${batas}" novalidate>
      <div data-galat aria-live="polite"></div>
      <p class="bantu"><strong>${m.judul}</strong></p>
      ${ganti ? h`<div class="peringatan peringatan-info jarak-bawah" data-uji="mt-info-ganti">${ikon('info')}<div><p>PDF versi ${formatAngka(m.berkas.versi)} (${m.berkas.nama}) akan <strong>diarsipkan, bukan dihapus</strong>. Status materi tidak berubah, dan siswa langsung menerima versi baru.</p></div></div>` : ''}
      <div class="isian"><label for="pb-berkas">Pilih berkas PDF</label>
        <input class="kontrol" id="pb-berkas" name="berkas" type="file" accept="application/pdf,.pdf" data-masuk="pb-berkas" aria-describedby="pb-berkas-b">
        <p class="bantu" id="pb-berkas-b">Hanya PDF, maksimal ${formatAngka(batas)} MB. PDF dengan kata sandi, skrip, atau yang rusak akan ditolak.</p></div>
      <div id="pb-pilihan" class="pb-pilihan" aria-live="polite"></div>
    </form>`,
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'kirim', label: ganti ? 'Ganti PDF' : 'Unggah PDF', gaya: 'utama', tipe: 'submit', form: 'f-materi-berkas' }]
  });
};

KIRIM['materi-berkas'] = function (form) {
  bersihGalat(form);
  const file = pbSt.berkas;
  if (!file) { galatIsian(form, 'berkas', 'Pilih berkas PDF dulu.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return mtUnggahBerkas(form.getAttribute('data-id'), file).then(function (r) {
      const api = modalTeratas(); if (api) api.tutup('disimpan');
      pbSt.berkas = null;
      if (r.tidakBerubah) toast('PDF ini sama dengan versi aktif; tidak ada perubahan.', 'info');
      else toast('PDF materi tersimpan sebagai versi ' + formatAngka(r.berkas.versi) + '.', 'sukses');
      return muatMateri();
    });
  }).catch(function (e) { mtGalatKirim(form, e); }).then(function () { form.removeAttribute('data-sibuk'); });
};

AKSI['materi-pratinjau'] = function (b) {
  const m = mtDari(b.getAttribute('data-id'));
  if (!m) return;
  const pdf = m.jenis === 'PDF';
  modal({
    judul: 'Pratinjau materi', lebar: true,
    badan: h`<dl class="data">
        <div class="data-baris"><dt>Judul</dt><dd class="pecah" data-uji="mt-pr-judul">${m.judul}</dd></div>
        <div class="data-baris"><dt>Jenis</dt><dd>${m.jenis}</dd></div>
        <div class="data-baris"><dt>Mata pelajaran</dt><dd>${MAPEL[m.mapel] || m.mapel}</dd></div>
        <div class="data-baris"><dt>Kategori</dt><dd>${m.kategori}</dd></div>
        <div class="data-baris"><dt>Status</dt><dd>${lencanaStatus(m.status)}</dd></div>
        ${pdf && m.berkas ? h`<div class="data-baris"><dt>Berkas</dt><dd class="pecah">${m.berkas.nama} · ${gbUkuranTeks(m.berkas.ukuran)} · versi ${formatAngka(m.berkas.versi)}</dd></div>` : ''}
      </dl>
      <div class="baris-bungkus jarak-atas-kecil">${pdf
        ? h`<button type="button" class="tombol" data-aksi="materi-unduh" data-id="${m.id}" data-uji="mt-unduh">${ikon('download')}<span>Unduh PDF</span></button>`
        : h`<button type="button" class="tombol" data-aksi="materi-tautan" data-id="${m.id}" data-uji="mt-tautan">${ikon('external-link')}<span>Periksa tautan video</span></button>`}</div>
      <p class="bantu jarak-atas-kecil">${pdf ? 'Pratinjau PDF menyimpan berkasnya ke perangkat Anda; aplikasi tidak menampilkan PDF di dalam halaman.' : 'Tautan dibuka di tab baru. Aplikasi tidak menanam pemutar dan tidak memutar video otomatis.'}</p>
      <div id="mt-status-modal" class="pb-status" role="status" aria-live="polite"></div>`,
    aksi: [{ id: 'tutup', label: 'Tutup', gaya: 'diam' }]
  });
};

AKSI['materi-unduh'] = function (b) {
  const st = el('#mt-status-modal');
  if (st) pasang(st, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Menyiapkan berkas…</p>`);
  const data = { id: b.getAttribute('data-id') };
  const v = b.getAttribute('data-versi');
  if (v) data.versi = parseInt(v, 10);
  kerjakan(b, function () { return panggil('materi.unduh', data); }).then(function (d) {
    if (!d) return;
    pbLaporUnduh(el('#mt-status-modal'), d);
  }).catch(function (e) { pbLaporGalat(el('#mt-status-modal'), e); });
};
AKSI['materi-buka-versi'] = AKSI['materi-unduh'];

AKSI['materi-tautan'] = function (b) {
  const st = el('#mt-status-modal');
  if (st) pasang(st, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Memeriksa tautan…</p>`);
  kerjakan(b, function () { return panggil('materi.buka', { id: b.getAttribute('data-id') }); }).then(function (d) {
    if (!d) return;
    const url = urlHttps(d.tautan);
    const wadah = el('#mt-status-modal');
    if (!wadah) return;
    if (!url) { pbLaporGalat(wadah, { message: 'Tautan materi ini tidak sah. Ubah tautannya.' }); return; }
    pasang(wadah, h`<div class="peringatan peringatan-sukses" data-uji="mt-tautan-ok">${ikon('check-circle')}<div>
      <p>Tautan sah (${d.host}). Aplikasi tidak memeriksa apakah videonya masih ada.</p>
      <p><a class="tautan" href="#" data-mt-buka target="_blank" rel="noopener noreferrer">Buka video di tab baru</a></p></div></div>`);
    const a = el('a[data-mt-buka]', wadah);
    if (a) a.setAttribute('href', url);
  }).catch(function (e) { pbLaporGalat(el('#mt-status-modal'), e); });
};

function mtDaftarVersi(id, d) {
  if (!d.versi.length) return h`<p class="teks-redam tanpa-margin">Belum ada versi.</p>`;
  return h`<ul class="pb-versi" role="list">${d.versi.map(function (v) {
    return h`<li class="pb-versi-baris" data-uji="mt-versi-baris">
      <div class="pb-versi-info"><div class="baris-bungkus"><strong class="angka">Versi ${formatAngka(v.versi)}</strong><span class="lencana ${v.aktif ? 'lencana-sukses' : ''}">${v.aktif ? 'Aktif' : 'Arsip'}</span></div>
        <div class="pecah">${v.nama}</div>
        <div class="bantu">${gbUkuranTeks(v.ukuran)} · diunggah ${waktuWIB(v.dibuat)}${v.pengunggah && v.pengunggah !== '—' ? ' oleh ' + v.pengunggah : ''}${v.diarsipkan ? ' · diarsipkan ' + waktuWIB(v.diarsipkan) : ''}</div></div>
      <button type="button" class="tombol tombol-garis" data-aksi="materi-buka-versi" data-id="${id}" data-versi="${v.versi}" aria-label="Unduh versi ${v.versi}">${ikon('download')}<span>Unduh</span></button></li>`;
  })}</ul>`;
}
AKSI['materi-riwayat'] = function (b) {
  const id = b.getAttribute('data-id');
  kerjakan(b, function () { return panggil('materi.riwayat', { id: id }); }).then(function (d) {
    if (!d) return;
    modal({
      judul: 'Riwayat versi PDF', lebar: true,
      badan: h`<p class="bantu">Versi lama tidak pernah dihapus otomatis. Bila PDF salah terunggah, unggah versi yang benar; yang salah ikut tersimpan sebagai arsip.</p>
        ${mtDaftarVersi(id, d)}<div id="mt-status-modal" class="pb-status" role="status" aria-live="polite"></div>`,
      aksi: [{ id: 'tutup', label: 'Tutup', gaya: 'diam' }]
    });
  }).catch(gagalUmum);
};

AKSI['materi-hapus'] = function (b) {
  const m = mtDari(b.getAttribute('data-id'));
  if (!m) return;
  konfirmasi({
    judul: 'Hapus materi?', ya: 'Hapus materi', bahaya: true,
    pesan: 'Materi “' + m.judul + '” dihapus' + (m.jumlahVersi ? ' beserta ' + m.jumlahVersi + ' versi berkasnya (dibuang ke tempat sampah Drive)' : '') + '. Siswa tidak lagi melihatnya. Untuk menyembunyikan tanpa menghapus, ubah statusnya menjadi Arsip.'
  }).then(function (ya) {
    if (!ya) return;
    panggil('materi.hapus', { id: m.id }).then(function (r) {
      toast(r.berkasTertinggal ? 'Materi dihapus. ' + r.berkasTertinggal + ' berkas gagal dibuang dari Drive; berkasnya tetap privat.' : 'Materi dihapus.', r.berkasTertinggal ? 'info' : 'sukses');
      return muatMateri();
    }).catch(function (e) { gagalUmum(e); return muatMateri(); });
  });
};

function htmlKartuVideoPengaturan(g) {
  return h`<section class="kartu" aria-labelledby="h-video"><div class="kartu-judul"><span class="ikon-bulat">${ikon('play')}</span><h3 id="h-video">Video materi</h3></div>
    <p class="bantu">Video hanya berupa tautan https yang dibuka di tab baru; tidak diunggah ke aplikasi, tidak ada pemutar tertanam, dan tidak diputar otomatis. Bandwidth ditanggung penyedia video.</p>
    <form id="f-video" data-kirim="video-simpan" novalidate>
      <div data-galat aria-live="polite"></div>
      <div class="isian"><label for="pg-video">Domain video yang diizinkan</label>
        <input class="kontrol" id="pg-video" name="video_host_izin" type="text" maxlength="600" autocomplete="off" spellcheck="false" value="${g.video_host_izin === undefined || g.video_host_izin === null ? '' : g.video_host_izin}" aria-describedby="pg-video-b" placeholder="youtube.com, youtu.be, vimeo.com">
        <p class="bantu" id="pg-video-b">Pisahkan dengan koma, tanpa https:&#47;&#47;. Subdomain ikut diizinkan (youtube.com mengizinkan www.youtube.com). Kosongkan untuk mengizinkan semua domain https. Tautan yang tidak dipublikasikan bukan pengaman: siapa pun yang memegang tautannya dapat membukanya.</p></div>
      <div class="aksi-form"><button type="submit" class="tombol">${ikon('save')}<span>Simpan domain</span></button></div>
    </form></section>`;
}

KIRIM['video-simpan'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const nilai = v.video_host_izin || '';
  const asli = String(pgAsli.video_host_izin === undefined || pgAsli.video_host_izin === null ? '' : pgAsli.video_host_izin);
  if (nilai === asli) { toast('Tidak ada perubahan untuk disimpan.', 'info'); return; }
  const simpan = function () {
    form.setAttribute('data-sibuk', 'ya');
    return kerjakan(tombolKirim(form), function () {
      return panggil('pengaturan.simpan', { kunci: 'video_host_izin', nilai: nilai }).then(function (r) {
        pgAsli.video_host_izin = r.nilai;
        const i = el('#pg-video'); if (i) i.value = r.nilai;
        toast(r.nilai ? 'Domain video diizinkan: ' + r.nilai.split(',').join(', ') + '.' : 'Semua domain https diizinkan untuk video.', 'sukses');
      });
    }).catch(function (e) { if (e.kode === 'VALIDASI') galatIsian(form, 'video_host_izin', e.message); else gagalUmum(e); })
      .then(function () { form.removeAttribute('data-sibuk'); });
  };
  if (!nilai) {
    konfirmasi({ judul: 'Izinkan semua domain?', ya: 'Izinkan semua', bahaya: true, pesan: 'Guru akan bisa menautkan video dari domain https mana pun, termasuk situs yang tidak Anda kenal. Siswa yang membuka tautan itu meninggalkan aplikasi. Lanjutkan?' })
      .then(function (ya) { if (ya) simpan(); });
    return;
  }
  simpan();
};


const KELAS_STATUS_TOKEN = { Aktif: 'lencana-sukses', 'Belum berlaku': 'lencana-info', Kedaluwarsa: 'lencana-peringatan', Habis: 'lencana-peringatan', Dicabut: 'lencana-bahaya' };
let tokenStaf = { idPaket: '', daftar: [] };

function adaJalurToken(pk) { return pk && (pk.jalurAkses === 'Token' || pk.jalurAkses === 'Keduanya'); }

function kerangkaPanelToken(pk) {
  const bisaBuat = pk.status === 'Terbit';
  return h`<div class="kartu-judul"><span class="ikon-bulat">${ikon('key')}</span><h3 id="h-token">Kode ujian (token)</h3>
      <button type="button" class="tombol rata-kanan" data-aksi="token-buat-dialog"${bisaBuat ? '' : mentah(' aria-disabled="true"')}>${ikon('plus')}<span>Buat kode</span></button></div>
    <p class="bantu jarak-bawah">Satu kode boleh dipakai banyak siswa. Tiap siswa (nama + tanggal lahir) hanya bisa satu kali per kode; kode baru berarti kesempatan baru. Peserta dengan kode tidak masuk peringkat.</p>
    ${bisaBuat ? '' : h`<div class="peringatan peringatan-waspada jarak-bawah">${ikon('info')}<div><p>Kode hanya bisa dibuat untuk paket yang sudah <strong>Terbit</strong>.</p></div></div>`}
    <div id="token-daftar"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat kode…</span></div></div>`;
}

function muatPanelToken() {
  const pk = edSt.paket;
  const w = el('#token-daftar');
  if (!pk || !w) return Promise.resolve();
  return panggil('token.daftar', { id_paket: pk.id }, { ulang: true }).then(function (d) {
    if (!edSt.paket || edSt.paket.id !== pk.id) return;
    tokenStaf = { idPaket: pk.id, daftar: d.token };
    gambarDaftarToken();
  }).catch(function (e) { const x = el('#token-daftar'); if (x) tampilkanGalatMuat(x, e, false); });
}

function gambarDaftarToken() {
  const w = el('#token-daftar');
  if (!w) return;
  if (!tokenStaf.daftar.length) {
    pasang(w, h`<div class="kosong"><span class="ikon-bulat netral">${ikon('key')}</span><p>Belum ada kode untuk paket ini.</p></div>`);
    return;
  }
  pasang(w, h`<ul class="daftar-token">${tokenStaf.daftar.map(function (t) {
    const bisaCabut = t.status !== 'Dicabut' && t.status !== 'Kedaluwarsa';
    return h`<li class="token-baris">
      <div class="token-kode"><code class="kode-besar" aria-label="Kode ${t.kode.split('').join(' ')}">${t.kode}</code>
        <button type="button" class="tombol tombol-polos tombol-ikon" data-aksi="salin-teks" data-salin="${t.kode}" data-pesan="Kode disalin." aria-label="Salin kode ${t.kode}">${ikon('copy')}</button></div>
      <div class="token-info"><span class="lencana ${KELAS_STATUS_TOKEN[t.status] || ''}">${t.status}</span>
        <span>${t.kedaluwarsa ? 'Berlaku sampai ' + waktuWIB(t.kedaluwarsa) : 'Aktif selamanya'}</span>
        <span class="angka">Dipakai ${formatAngka(t.terpakai)}${t.batasPakai !== null ? ' dari ' + formatAngka(t.batasPakai) : ''}×</span></div>
      <div class="token-aksi">${bisaCabut ? h`<button type="button" class="tombol tombol-bahaya-garis tombol-kecil" data-aksi="token-cabut" data-id="${t.id}" data-kode="${t.kode}">${ikon('slash')}<span>Cabut</span></button>` : ''}</div>
    </li>`;
  })}</ul>`);
}

function wibKeISO(v) {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2})?$/.exec(String(v || ''));
  if (!m) return '';
  const t = Date.parse(m[1] + 'T' + m[2] + ':00+07:00');
  return isNaN(t) ? '' : new Date(t).toISOString();
}
function isoKeWIBInput(ms) {
  const d = new Date(ms + 7 * 3600000);
  return d.getUTCFullYear() + '-' + dua(d.getUTCMonth() + 1) + '-' + dua(d.getUTCDate()) + 'T' + dua(d.getUTCHours()) + ':' + dua(d.getUTCMinutes());
}

MASUKAN['tb-selamanya'] = function (r) {
  const i = el('#tb-kedaluwarsa');
  if (i) { i.disabled = !!r.checked; i.required = !r.checked; }
};

AKSI['token-buat-dialog'] = function () {
  const pk = edSt.paket;
  if (!pk) return;
  const awal = new Date(Date.now() + 7 * 86400000 + 7 * 3600000);
  const bawaan = awal.getUTCFullYear() + '-' + dua(awal.getUTCMonth() + 1) + '-' + dua(awal.getUTCDate()) + 'T23:59';
  modal({
    judul: 'Buat kode ujian',
    badan: h`<form id="f-token-buat" data-kirim="token-buat" novalidate>
      <div data-galat aria-live="polite"></div>
      <div class="isian"><label for="tb-kedaluwarsa">Berlaku sampai (WIB)</label>
        <input class="kontrol" id="tb-kedaluwarsa" name="kedaluwarsa" type="datetime-local" value="${bawaan}" min="${isoKeWIBInput(Date.now())}" required aria-describedby="tb-kedaluwarsa-b">
        <p class="bantu" id="tb-kedaluwarsa-b">Maksimal 1 tahun dari sekarang. Setelah lewat, kode tidak bisa dipakai memulai ujian baru (ujian yang sudah berjalan tetap bisa diselesaikan).</p>
        <label class="is-wajib"><input type="checkbox" id="tb-selamanya" name="selamanya" data-masuk="tb-selamanya"> <span><strong>Aktif selamanya</strong><br><span class="bantu">Tanpa masa berlaku. Kode tetap bisa dipakai sampai Anda mencabutnya atau batas pemakaian habis.</span></span></label></div>
      <div class="isian"><label for="tb-batas">Batas pemakaian <span class="opsional">(opsional)</span></label>
        <input class="kontrol angka" id="tb-batas" name="batas_pakai" type="number" inputmode="numeric" min="1" max="100000" step="1" placeholder="Kosongkan bila tanpa batas" aria-describedby="tb-batas-b">
        <p class="bantu" id="tb-batas-b">Jumlah siswa yang boleh memulai dengan kode ini.</p></div>
    </form>`,
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'buat', label: 'Buat kode', gaya: 'utama', tipe: 'submit', form: 'f-token-buat' }]
  });
};

KIRIM['token-buat'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const kotakSelamanya = el('#tb-selamanya', form);
  const selamanya = !!(kotakSelamanya && kotakSelamanya.checked);
  const data = { id_paket: edSt.paket.id };
  if (selamanya) {
    data.selamanya = true;
  } else {
    const iso = wibKeISO(v.kedaluwarsa);
    if (!iso) { galatIsian(form, 'kedaluwarsa', 'Isi tanggal dan jam berakhirnya kode, atau pilih "Aktif selamanya".'); return; }
    if (Date.parse(iso) <= Date.now()) { galatIsian(form, 'kedaluwarsa', 'Masa berlaku harus di masa depan.'); return; }
    if (Date.parse(iso) > Date.now() + 365 * 86400000) { galatIsian(form, 'kedaluwarsa', 'Masa berlaku maksimal 1 tahun. Pilih "Aktif selamanya" bila tidak ingin ada batas waktu.'); return; }
    data.kedaluwarsa = iso;
  }
  if (v.batas_pakai !== '') {
    const n = parseInt(v.batas_pakai, 10);
    if (!(n >= 1 && n <= 100000) || String(n) !== String(v.batas_pakai)) { galatIsian(form, 'batas_pakai', 'Batas pemakaian harus bilangan bulat 1–100.000.'); return; }
    data.batas_pakai = n;
  }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('token.buat', data).then(function (d) {
      const api = modalTeratas(); if (api) api.tutup('dibuat');
      const t = d.token;
      modal({
        judul: 'Kode ujian dibuat', tahan: true,
        badan: h`<p class="tanpa-margin">Bagikan kode ini kepada siswa. Mereka membuka halaman utama lalu memilih <strong>Ujian dengan kode</strong>.</p>
          <div class="kredensial" role="group" aria-label="Kode ujian"><div class="baris-kred"><span class="kunci">Kode</span><span class="nilai kode-besar">${t.kode}</span></div>
            <button type="button" class="tombol tombol-diam" data-aksi="salin-teks" data-salin="${t.kode}" data-pesan="Kode disalin.">${ikon('copy')}<span>Salin kode</span></button></div>
          <p class="bantu tanpa-margin">${t.kedaluwarsa ? 'Berlaku sampai ' + waktuWIB(t.kedaluwarsa) : 'Aktif selamanya (tanpa masa berlaku)'}${t.batasPakai !== null ? ' · maksimal ' + formatAngka(t.batasPakai) + ' siswa' : ''}.</p>`,
        aksi: [{ id: 'ok', label: 'Selesai', gaya: 'utama' }]
      }).selesai.then(function () { muatPanelToken(); });
      muatPanelToken();
    });
  }).catch(function (e) {
    if (['VALIDASI', 'STATUS', 'BATAS'].indexOf(e.kode) >= 0) galatForm(form, e.message); else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};

AKSI['token-cabut'] = function (b) {
  const id = b.getAttribute('data-id'), kode = b.getAttribute('data-kode');
  konfirmasi({
    judul: 'Cabut kode ' + kode + '?', ya: 'Cabut kode', bahaya: true,
    pesan: 'Siswa tidak bisa lagi memulai ujian baru dengan kode ini. Ujian yang sedang berjalan tidak terpengaruh. Kode yang dicabut tidak bisa diaktifkan kembali; buat kode baru bila perlu.'
  }).then(function (ya) {
    if (!ya) return;
    panggil('token.cabut', { id: id }).then(function () { toast('Kode dicabut.', 'sukses'); return muatPanelToken(); }).catch(gagalUmum);
  });
};


const pcSt = { id_paket: '', status: '', jalur: '', q: '', halaman: 1, ukuran: 30, data: null, paket: [], seq: 0 };

const STATUS_PERCOBAAN = ['Berjalan', 'Selesai', 'Waktu habis', 'Dibatalkan'];

function renderPercobaan(p, c) {
  if (p && p.id_paket !== undefined) { pcSt.id_paket = p.id_paket || ''; pcSt.halaman = 1; pcSt.status = ''; pcSt.jalur = ''; pcSt.q = ''; }
  const admin = S.pengguna.peran === PERAN.ADMIN;
  pasang(c.wadah, h`
    ${kepalaHalaman('Percobaan', admin ? 'Semua percobaan pengerjaan, dari akun siswa maupun peserta dengan kode.' : 'Percobaan pada paket milik Anda, dari akun siswa maupun peserta dengan kode.')}
    <div class="saring saring-4" role="search">
      <div class="cari"><label class="sr-only" for="pc-cari">Cari nama peserta</label>${ikon('search')}<input class="kontrol" id="pc-cari" type="search" placeholder="Cari nama peserta" value="${pcSt.q}" data-masuk="pc-saring" autocomplete="off"></div>
      <div class="isian"><label class="sr-only" for="pc-paket">Paket</label><select class="kontrol" id="pc-paket" data-masuk="pc-saring"><option value="">Semua paket</option></select></div>
      <div class="isian"><label class="sr-only" for="pc-status">Status</label><select class="kontrol" id="pc-status" data-masuk="pc-saring"><option value="">Semua status</option>${STATUS_PERCOBAAN.map(function (k) { return h`<option value="${k}"${pcSt.status === k ? mentah(' selected') : ''}>${k}</option>`; })}</select></div>
      <div class="isian"><label class="sr-only" for="pc-jalur">Jalur</label><select class="kontrol" id="pc-jalur" data-masuk="pc-saring"><option value="">Semua jalur</option><option value="Member"${pcSt.jalur === 'Member' ? mentah(' selected') : ''}>Akun siswa</option><option value="Token"${pcSt.jalur === 'Token' ? mentah(' selected') : ''}>Dengan kode</option></select></div>
    </div>
    <div class="baris-bungkus jarak-bawah" id="pc-ringkas" aria-live="polite"></div>
    <div id="pc-daftar"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat percobaan…</span></div></div>
    <div id="pc-halaman" class="halaman-nav"></div>
    ${admin ? kartuPeringkatAdmin() : ''}`);
  fokusJudul();
  panggil('paket.daftar', {}, { ulang: true }).then(function (d) {
    if (!c.ok()) return;
    pcSt.paket = d;
    const sel = el('#pc-paket');
    if (sel) {
      pasang(sel, h`<option value="">Semua paket</option>${d.map(function (x) { return h`<option value="${x.id}"${pcSt.id_paket === x.id ? mentah(' selected') : ''}>${x.nama} (${MAPEL[x.mapel] || x.mapel})</option>`; })}`);
    }
  }).catch(function () {   });
  muatPercobaan(c.ok);
}

function muatPercobaan(ok) {
  const seq = ++pcSt.seq;
  const data = { halaman: pcSt.halaman, ukuran: pcSt.ukuran };
  if (pcSt.id_paket) data.id_paket = pcSt.id_paket;
  if (pcSt.status) data.status = pcSt.status;
  if (pcSt.jalur) data.jalur = pcSt.jalur;
  if (pcSt.q) data.q = pcSt.q;
  return panggil('percobaan.daftar', data, { ulang: true }).then(function (d) {
    if (seq !== pcSt.seq || (ok && !ok())) return;
    pcSt.data = d;
    gambarPercobaan();
  }).catch(function (e) {
    if (seq !== pcSt.seq || (ok && !ok())) return;
    tampilkanGalatMuat(el('#pc-daftar'), e, true);
  });
}
MASUKAN['pc-saring'] = tundaKe(function () {
  const q = el('#pc-cari'), pk = el('#pc-paket'), st = el('#pc-status'), jl = el('#pc-jalur');
  if (!q || !pk || !st || !jl) return;
  pcSt.q = q.value.trim(); pcSt.id_paket = pk.value; pcSt.status = st.value; pcSt.jalur = jl.value; pcSt.halaman = 1;
  muatPercobaan();
}, 300);

function gambarPercobaan() {
  const w = el('#pc-daftar');
  const d = pcSt.data;
  if (!w || !d) return;
  const rk = el('#pc-ringkas');
  if (rk) {
    const hs = d.hitungStatus || {};
    pasang(rk, h`${STATUS_PERCOBAAN.filter(function (k) { return hs[k]; }).map(function (k) { return h`<span class="lencana ${KELAS_STATUS[k] || ''}">${k}: <span class="angka">${formatAngka(hs[k])}</span></span>`; })}<span class="teks-redam">Menampilkan ${formatAngka(d.daftar.length)} dari ${formatAngka(d.total)} percobaan.</span>`);
  }
  const admin = S.pengguna.peran === PERAN.ADMIN;
  if (!d.daftar.length) {
    const disaring = pcSt.q || pcSt.status || pcSt.jalur || pcSt.id_paket;
    pasang(w, h`<div class="kartu kosong"><span class="ikon-bulat netral">${ikon('bar-chart')}</span><h3>${disaring ? 'Tidak ada percobaan yang cocok' : 'Belum ada percobaan'}</h3><p>${disaring ? 'Ubah penyaring untuk melihat yang lain.' : 'Percobaan akan muncul di sini setelah siswa mengerjakan paket.'}</p></div>`);
    pasang(el('#pc-halaman'), '');
    return;
  }
  pasang(w, h`<div class="bungkus-tabel"><table class="tabel"><caption class="sr-only">Daftar percobaan</caption>
    <thead><tr><th scope="col">Peserta</th><th scope="col">Paket</th><th scope="col">Status</th><th scope="col">Nilai</th><th scope="col">Mulai</th><th scope="col"><span class="sr-only">Aksi</span></th></tr></thead>
    <tbody>${d.daftar.map(function (r) {
      const selesai = r.status === 'Selesai' || r.status === 'Waktu habis';
      return h`<tr>
        <td data-label="Peserta" class="pecah"><div class="tebal">${r.nama}</div><div class="sub-sel">${r.sekolah ? r.sekolah + ' · ' : ''}${r.jalur === 'Token' ? 'dengan kode' : 'akun siswa'}</div></td>
        <td data-label="Paket" class="pecah"><div>${r.namaPaket}</div><div class="sub-sel">${MAPEL[r.mapel] || r.mapel} · ${r.kategori} · percobaan ke-${r.nomorUrut}</div></td>
        <td data-label="Status"><div class="chip-status"><span class="lencana ${KELAS_STATUS[r.status] || ''}">${r.status}</span>${r.pindahTab > 0 ? h`<span class="lencana lencana-peringatan" title="Berpindah dari halaman ujian">${ikon('alert-triangle', 'ikon-sm')} ${formatAngka(r.pindahTab)}× pindah tab</span>` : ''}${r.putus > 0 ? h`<span class="lencana" title="Koneksi sempat terputus">${ikon('wifi-off', 'ikon-sm')} ${formatAngka(r.putus)}× putus</span>` : ''}</div></td>
        <td data-label="Nilai" class="angka">${selesai ? h`<strong>${r.nilaiTeks}</strong><div class="sub-sel">skor ${angkaSkor(r.skor)} / ${angkaSkor(r.skorMaks)}</div>` : '—'}</td>
        <td data-label="Mulai">${waktuWIB(r.waktuMulai)}</td>
        <td class="sel-aksi"><div class="aksi-sel">
          <button type="button" class="tombol tombol-diam tombol-adaptif" data-aksi="pc-detail" data-id="${r.id}" title="Detail percobaan">${ikon('file-text')}<span class="teks-aksi">Detail ${r.nama}</span></button>
          ${admin && r.status !== 'Dibatalkan' ? h`<button type="button" class="tombol tombol-bahaya-garis tombol-adaptif" data-aksi="pc-batal" data-id="${r.id}" data-nama="${r.nama}" title="Batalkan percobaan">${ikon('slash')}<span class="teks-aksi">Batalkan ${r.nama}</span></button>` : ''}
        </div></td></tr>`;
    })}</tbody></table></div>`);
  const total = Math.max(1, Math.ceil(d.total / d.ukuran));
  pasang(el('#pc-halaman'), total <= 1 ? '' : h`<nav class="halaman-nav-dalam" aria-label="Halaman daftar">
    <button type="button" class="tombol tombol-diam" data-aksi="pc-halaman" data-ke="${d.halaman - 1}"${d.halaman <= 1 ? mentah(' aria-disabled="true"') : ''}>${ikon('chevron-left')}<span>Sebelumnya</span></button>
    <span class="angka teks-redam">Halaman ${formatAngka(d.halaman)} dari ${formatAngka(total)}</span>
    <button type="button" class="tombol tombol-diam" data-aksi="pc-halaman" data-ke="${d.halaman + 1}"${d.halaman >= total ? mentah(' aria-disabled="true"') : ''}><span>Berikutnya</span>${ikon('chevron-right')}</button></nav>`);
}
AKSI['pc-halaman'] = function (b) { pcSt.halaman = Math.max(1, +b.getAttribute('data-ke')); muatPercobaan(); };

const LABEL_KEJADIAN = { pindah_tab: 'Meninggalkan halaman ujian', putus: 'Koneksi terputus' };
function barisData(label, nilai) { return nilai === undefined || nilai === null || nilai === '' ? '' : h`<div class="data-baris"><dt>${label}</dt><dd>${nilai}</dd></div>`; }

function htmlDetailPercobaan(d) {
  const ps = d.peserta, rg = d.ringkasan, hs = d.hasil;
  return h`
    <section aria-labelledby="dt-peserta"><h3 id="dt-peserta">Peserta</h3><dl class="data">
      ${barisData('Nama', ps.nama)}${barisData('Jalur', ps.jalur === 'Token' ? 'Dengan kode (tanpa akun)' : 'Akun siswa')}
      ${barisData('Username', ps.username)}${barisData('Sekolah', ps.sekolah)}${barisData('Kelas', ps.kelas)}
      ${barisData('Jenis kelamin', ps.jenisKelamin === 'L' ? 'Laki-laki' : (ps.jenisKelamin === 'P' ? 'Perempuan' : ''))}
      ${ps.tanggalLahir ? barisData('Tanggal lahir', tanggalLahirTeks(ps.tanggalLahir)) : ''}
      ${ps.dianonimkan ? h`<div class="data-baris"><dt>Data pribadi</dt><dd><span class="lencana">Sudah dianonimkan</span></dd></div>` : ''}
    </dl></section>
    <section aria-labelledby="dt-ringkas"><h3 id="dt-ringkas">Percobaan</h3><dl class="data">
      ${barisData('Paket', rg.namaPaket)}${barisData('Mata pelajaran', (MAPEL[rg.mapel] || rg.mapel) + ' · ' + rg.kategori)}
      ${barisData('Percobaan ke', rg.nomorUrut)}
      <div class="data-baris"><dt>Status</dt><dd><span class="lencana ${KELAS_STATUS[rg.status] || ''}">${rg.status}</span></dd></div>
      ${barisData('Mulai', waktuWIB(rg.waktuMulai))}${barisData('Batas waktu', waktuWIB(rg.batasWaktu))}${rg.waktuSelesai ? barisData('Selesai', waktuWIB(rg.waktuSelesai)) : ''}
      ${rg.status === 'Berjalan' && d.terjawab !== undefined ? barisData('Sudah terjawab', formatAngka(d.terjawab) + ' dari ' + formatAngka(rg.jumlahSoal) + ' soal') : ''}
      ${d.alasanBatal ? barisData('Alasan pembatalan', d.alasanBatal) : ''}
    </dl></section>
    <section aria-labelledby="dt-integritas"><h3 id="dt-integritas">Kejadian selama ujian</h3>
      <p class="tanpa-margin">Pindah tab: <strong class="angka">${formatAngka(d.pindahTab)}×</strong> · Koneksi terputus: <strong class="angka">${formatAngka(d.putus)}×</strong>. <span class="teks-redam">Hanya dicatat sebagai informasi; ujian tidak digagalkan otomatis.</span></p>
      ${d.kejadian.length ? h`<ul class="daftar-kejadian">${d.kejadian.slice(0, 30).map(function (k) { return h`<li><span>${LABEL_KEJADIAN[k.jenis] || k.jenis}</span><span class="teks-redam">${waktuWIB(k.waktu)}</span></li>`; })}</ul>${d.kejadian.length > 30 ? h`<p class="bantu">Menampilkan 30 dari ${formatAngka(d.kejadian.length)} kejadian.</p>` : ''}` : ''}
    </section>
    ${d.jejakNilai.length ? h`<section aria-labelledby="dt-jejak"><h3 id="dt-jejak">Riwayat perubahan nilai</h3><ul class="daftar-kejadian">${d.jejakNilai.map(function (j) { return h`<li><span><strong class="angka">${j.nilaiLama || '—'}</strong> → <strong class="angka">${j.nilaiBaru || '—'}</strong> <span class="teks-redam">${j.alasan}</span></span><span class="teks-redam">${waktuWIB(j.waktu)}</span></li>`; })}</ul></section>` : ''}
    ${hs ? h`<section aria-labelledby="dt-hasil"><h3 id="dt-hasil">Hasil</h3>
      ${hs.nilaiTeks !== undefined ? h`<p class="tanpa-margin">Nilai <strong class="angka">${hs.nilaiTeks}</strong>${hs.skor !== undefined ? h` <span class="teks-redam angka">(skor ${angkaSkor(hs.skor)} dari ${angkaSkor(hs.skorMaks)})</span>` : ''}</p>` : ''}
      ${hs.pesan ? h`<p class="teks-redam">${hs.pesan}</p>` : ''}
      ${hs.hitung ? h`<p class="angka tanpa-margin">Benar ${formatAngka(hs.hitung.benar)} · Sebagian ${formatAngka(hs.hitung.sebagian)} · Salah ${formatAngka(hs.hitung.salah)} · Tidak dijawab ${formatAngka(hs.hitung.kosong)}</p>` : ''}
      ${hs.dihapus ? h`<p class="bantu" data-uji="catatan-dihapus">${formatAngka(hs.dihapus)} soal dihapus setelah dikerjakan, jadi tidak tampil di rincian. Nilai tetap sesuai hasil saat dikerjakan.</p>` : ''}
      ${hs.butir && hs.butir.length ? h`<details class="rincian-butir"><summary>Rincian jawaban per soal (${formatAngka(hs.butir.length)})</summary><ol class="daftar-butir">${hs.butir.map(function (b) { return htmlButir(b, true); })}</ol></details>` : ''}
    </section>` : (rg.status === 'Berjalan' ? h`<div class="peringatan">${ikon('info')}<div><p>Percobaan masih berjalan. Kunci jawaban dan rincian baru tersedia setelah selesai.</p></div></div>` : '')}`;
}

AKSI['pc-detail'] = function (b) {
  const id = b.getAttribute('data-id');
  panggil('percobaan.detail', { id: id }).then(function (d) {
    const admin = S.pengguna.peran === PERAN.ADMIN;
    const aksi = [{ id: 'tutup', label: 'Tutup', gaya: 'diam' }];
    if (admin && d.peserta.jalur === 'Token' && !d.peserta.dianonimkan) {
      aksi.unshift({ id: 'anonim', label: 'Anonimkan data peserta', gaya: 'bahaya-garis', onKlik: function (api) { api.tutup('anonim'); bukaAnonimkan(id, d.peserta.nama); } });
    }
    if (admin && d.ringkasan.status !== 'Dibatalkan') {
      aksi.unshift({ id: 'batal', label: 'Batalkan percobaan', gaya: 'bahaya-garis', onKlik: function (api) { api.tutup('batal'); bukaBatalkan(id, d.peserta.nama); } });
    }
    modal({ judul: 'Detail percobaan', lebar: true, badan: htmlDetailPercobaan(d), aksi: aksi });
  }).catch(gagalUmum);
};

function bukaBatalkan(id, nama) {
  modal({
    judul: 'Batalkan percobaan?',
    badan: h`<form id="f-batal" data-kirim="pc-batal" data-id="${id}" novalidate>
      <div data-galat aria-live="polite"></div>
      <p class="tanpa-margin">Percobaan <strong>${nama}</strong> akan dibatalkan: tidak dihitung di peringkat dan peserta tidak bisa melanjutkannya. Nilai yang sudah ada tetap tersimpan sebagai bukti. Tindakan ini tercatat di log audit.</p>
      <div class="isian jarak-atas"><label for="pb-alasan">Alasan (wajib, minimal 5 karakter)</label>
        <textarea class="kontrol" id="pb-alasan" name="alasan" maxlength="300" rows="3" required></textarea></div>
    </form>`,
    aksi: [{ id: 'batal', label: 'Kembali', gaya: 'diam' }, { id: 'ya', label: 'Batalkan percobaan', gaya: 'bahaya', tipe: 'submit', form: 'f-batal' }]
  });
}
AKSI['pc-batal'] = function (b) { bukaBatalkan(b.getAttribute('data-id'), b.getAttribute('data-nama')); };
KIRIM['pc-batal'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  if (!v.alasan || v.alasan.length < 5) { galatIsian(form, 'alasan', 'Alasan minimal 5 karakter.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('percobaan.batalkan', { id: form.getAttribute('data-id'), alasan: v.alasan }).then(function (d) {
      const api = modalTeratas(); if (api) api.tutup('ok');
      toast(d.berubah ? 'Percobaan dibatalkan.' : 'Percobaan sudah dibatalkan sebelumnya.', 'sukses');
      return muatPercobaan();
    });
  }).catch(function (e) {
    if (e.kode === 'VALIDASI') galatForm(form, e.message); else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};

function bukaAnonimkan(id, nama) {
  konfirmasi({
    judul: 'Anonimkan data peserta?', ya: 'Anonimkan sekarang', bahaya: true,
    badan: h`<p class="tanpa-margin">Nama dan tanggal lahir <strong>${nama}</strong> akan dihapus permanen. Nilai, sekolah, dan jenis kelamin tetap tersimpan. Setelah ini identitas yang sama dengan kode yang sama bisa memulai lagi. <strong>Tidak bisa dibatalkan.</strong></p>`
  }).then(function (ya) {
    if (!ya) return;
    panggil('percobaan.anonimkan', { id: id }).then(function (d) {
      toast(d.berubah ? 'Data peserta dianonimkan.' : 'Data peserta sudah anonim.', 'sukses');
      return muatPercobaan();
    }).catch(gagalUmum);
  });
}

function kartuPeringkatAdmin() {
  return h`<section class="kartu jarak-atas" aria-labelledby="h-ringkasan"><div class="kartu-judul"><span class="ikon-bulat">${ikon('award')}</span><h3 id="h-ringkasan">Ringkasan peringkat</h3></div>
    <p class="teks-redam">Ringkasan peringkat diperbarui otomatis tiap ada nilai baru, koreksi, atau pembatalan. Pemeriksaan ini menghitung ulang dari nol dan membandingkannya dengan ringkasan yang tersimpan.</p>
    <div class="baris-bungkus"><button type="button" class="tombol tombol-garis" data-aksi="pk-verifikasi">${ikon('check-circle')}<span>Periksa kecocokan</span></button>
      <button type="button" class="tombol tombol-diam" data-aksi="pk-bangun">${ikon('refresh')}<span>Bangun ulang</span></button></div>
    <div id="pk-hasil" class="jarak-atas" aria-live="polite"></div></section>`;
}
AKSI['pk-verifikasi'] = function (b) {
  kerjakan(b, function () {
    return panggil('peringkat.verifikasi', {}).then(function (d) {
      pasang(el('#pk-hasil'), d.sama
        ? h`<div class="peringatan peringatan-sukses">${ikon('check-circle')}<div><p><strong>Cocok.</strong> ${formatAngka(d.jumlahBaris)} baris ringkasan sama dengan hitungan dari nol.</p></div></div>`
        : h`<div class="peringatan peringatan-waspada">${ikon('alert-triangle')}<div><p><strong>Ada ${formatAngka(d.jumlahSelisih)} baris yang berbeda.</strong> Gunakan “Bangun ulang” untuk memperbaikinya. Pemeliharaan harian juga memperbaikinya otomatis.</p></div></div>`);
    });
  }).catch(gagalUmum);
};
AKSI['pk-bangun'] = function (b) {
  konfirmasi({ judul: 'Bangun ulang ringkasan peringkat?', ya: 'Bangun ulang', pesan: 'Seluruh ringkasan dihitung ulang dari nilai yang tersimpan. Nilai dan percobaan tidak berubah. Aman dijalankan kapan saja.' }).then(function (ya) {
    if (!ya) return;
    kerjakan(b, function () {
      return panggil('peringkat.bangunUlang', {}).then(function (d) {
        pasang(el('#pk-hasil'), h`<div class="peringatan peringatan-sukses">${ikon('check-circle')}<div><p>Ringkasan dibangun ulang: <strong class="angka">${formatAngka(d.baris)}</strong> baris.</p></div></div>`);
      });
    }).catch(gagalUmum);
  });
};


const LABEL_TINDAKAN = { ubah_kunci: 'Ubah kunci jawaban', batalkan_soal: 'Batalkan soal', pulihkan_soal: 'Pulihkan soal' };

function bolehKoreksi() { return S.pengguna && (S.pengguna.peran === PERAN.ADMIN || !!S.pengguna.izinKoreksi); }

let bukaPanelKoreksi = false;
function htmlPanelKoreksi(pk, soal, dibatalkan) {
  const boleh = bolehKoreksi();
  return h`<details class="kartu jarak-bawah panel-koreksi" id="panel-koreksi" aria-labelledby="h-koreksi"${bukaPanelKoreksi ? mentah(' open') : ''}>
    <summary class="kartu-judul"><span class="ikon-bulat peringatan">${ikon('edit')}</span><h3 id="h-koreksi">Koreksi Massal: hitung ulang nilai yang sudah ada</h3></summary>
    <div class="baris-bungkus"><button type="button" class="tombol tombol-diam" data-aksi="pc-ke-paket">${ikon('bar-chart')}<span>Lihat percobaan paket ini</span></button></div>
    <p class="teks-redam">Mengubah soal di daftar atas <strong>tidak mengubah nilai yang sudah ada</strong>. Bila kunci yang keliru atau soal yang bermasalah harus ikut memperbaiki nilai lama, pakai Koreksi Massal: semua percobaan yang terdampak dihitung ulang, perubahan nilai tercatat, dan peringkat ikut diperbarui. Anda akan melihat dampaknya dulu sebelum menerapkan.</p>
    ${boleh ? '' : h`<div class="peringatan peringatan-waspada jarak-bawah">${ikon('lock')}<div><p><strong>Anda belum diberi izin koreksi.</strong> Minta Admin Utama untuk mengaktifkan izin koreksi massal pada akun Anda.</p></div></div>`}
    <ol class="daftar-soal">${soal.map(function (s, i) {
      return h`<li class="soal-butir"><span class="nomor">${i + 1}</span>
        <div><div class="pertanyaan ky">${kayaHtml(s.pertanyaan)}</div><div class="meta"><span class="lencana lencana-primer">${LABEL_JENIS_PENDEK[s.jenis]}</span><span class="lencana lencana-sukses">Kunci: ${kunciTeks(s)}</span></div></div>
        <div class="aksi">
          <button type="button" class="tombol tombol-diam tombol-kecil" data-aksi="kr-mulai" data-tindakan="ubah_kunci" data-id="${s.id}"${boleh ? '' : mentah(' aria-disabled="true"')}>${ikon('key')}<span>Ubah kunci</span></button>
          <button type="button" class="tombol tombol-bahaya-garis tombol-kecil" data-aksi="kr-mulai" data-tindakan="batalkan_soal" data-id="${s.id}"${boleh && soal.length > 1 ? '' : mentah(' aria-disabled="true"')} ${soal.length <= 1 ? mentah('title="Paket harus tetap punya minimal satu soal aktif"') : ''}>${ikon('slash')}<span>Batalkan soal</span></button>
        </div></li>`;
    })}</ol>
    ${dibatalkan && dibatalkan.length ? h`<h4 class="jarak-atas">Soal yang dibatalkan (${formatAngka(dibatalkan.length)})</h4><p class="bantu">Soal ini tidak ikut dinilai. Pulihkan bila pembatalan keliru.</p>
      <ul class="daftar-soal">${dibatalkan.map(function (s) {
        return h`<li class="soal-butir dibatalkan"><span class="nomor" aria-hidden="true">${ikon('slash', 'ikon-sm')}</span>
          <div><div class="pertanyaan ky">${kayaHtml(s.pertanyaan)}</div><div class="meta"><span class="lencana lencana-bahaya">Dibatalkan</span><span class="lencana">${LABEL_JENIS_PENDEK[s.jenis]}</span><span class="lencana">Kunci: ${kunciTeks(s)}</span></div></div>
          <div class="aksi"><button type="button" class="tombol tombol-garis tombol-kecil" data-aksi="kr-mulai" data-tindakan="pulihkan_soal" data-id="${s.id}"${boleh ? '' : mentah(' aria-disabled="true"')}>${ikon('rotate-ccw')}<span>Pulihkan</span></button></div></li>`;
      })}</ul>` : ''}
    <div class="jarak-atas"><button type="button" class="tombol tombol-diam" data-aksi="kr-hitung-ulang"${boleh ? '' : mentah(' aria-disabled="true"')}>${ikon('refresh')}<span>Hitung ulang semua nilai paket</span></button>
      <p class="bantu jarak-atas-kecil">Gunakan bila koreksi sebelumnya terhenti di tengah jalan, atau setelah Anda mengubah soal dan ingin nilai lama ikut dihitung menurut soal yang baru. Aman diulang: nilai yang sudah benar dilewati dan tidak mencatat riwayat ganda.</p></div>
  </details>`;
}
AKSI['pc-ke-paket'] = function () { if (edSt.paket) navigateTo('percobaan', { id_paket: edSt.paket.id }); };

function soalKoreksi(id) {
  return edSt.soal.concat(edSt.soalDibatalkan || []).filter(function (s) { return s.id === id; })[0] || null;
}
function nomorSoalDiPaket(id) { const i = edSt.soal.map(function (s) { return s.id; }).indexOf(id); return i < 0 ? 0 : i + 1; }

function htmlPilihKunci(s) {
  const hurufKunci = s.jenis === 'PG' ? String(s.kunci || '') : '';
  const bs = s.jenis === 'PG' ? [] : String(s.kunci || '').split(',');
  if (s.jenis === 'PG') {
    return h`<fieldset class="isian fieldset-polos"><legend class="label">Kunci jawaban yang benar</legend><div class="opsi-soal" role="radiogroup">${['A', 'B', 'C', 'D'].map(function (hr, i) {
      return h`<div class="opsi-baris"><span class="huruf" aria-hidden="true">${hr}</span><div class="tanpa-margin pecah ky">${kayaHtml(s.opsi[i] || '')}</div>
        <label class="kunci-pg">${ikon('check')}<input type="radio" name="kunci_pg" value="${hr}" data-masuk="soal-kunci"${hurufKunci === hr ? mentah(' checked') : ''}><span>Kunci</span></label></div>`;
    })}</div></fieldset>`;
  }
  return h`<fieldset class="isian fieldset-polos"><legend class="label">Kunci setiap pernyataan</legend><div class="opsi-soal" role="group">${[0, 1, 2].map(function (i) {
    return h`<div class="opsi-baris"><span class="huruf" aria-hidden="true">${i + 1}</span><div class="tanpa-margin pecah ky">${kayaHtml(s.opsi[i] || '')}</div>
      <div class="segmen" role="radiogroup" aria-label="Kunci pernyataan ${i + 1}">
        <label>${ikon('check')}<input type="radio" name="k${i}" value="B" data-masuk="soal-kunci"${bs[i] === 'B' ? mentah(' checked') : ''}> Benar</label>
        <label>${ikon('check')}<input type="radio" name="k${i}" value="S" data-masuk="soal-kunci"${bs[i] === 'S' ? mentah(' checked') : ''}> Salah</label></div></div>`;
  })}</div></fieldset>`;
}

AKSI['kr-mulai'] = function (b) {
  if (!edSt.paket) return;
  bukaPanelKoreksi = true;
  const tindakan = b.getAttribute('data-tindakan');
  const s = soalKoreksi(b.getAttribute('data-id'));
  if (!s) return;
  const no = nomorSoalDiPaket(s.id);
  const judul = LABEL_TINDAKAN[tindakan] + (no ? ' — soal nomor ' + no : '');
  const ket = tindakan === 'ubah_kunci' ? h`<p class="tanpa-margin">Kunci sekarang: <strong>${kunciTeks(s)}</strong>. Pilih kunci yang benar; semua percobaan yang sudah selesai akan dinilai ulang.</p>`
    : (tindakan === 'batalkan_soal' ? h`<p class="tanpa-margin">Soal ini <strong>tidak akan dihitung</strong> pada semua percobaan: skor maksimum berkurang dan nilai dihitung ulang dari soal yang tersisa.</p>`
      : h`<p class="tanpa-margin">Soal ini <strong>dihitung kembali</strong> pada semua percobaan yang memuatnya, dengan kunci yang tertulis di bawah.</p>`);
  modal({
    judul: judul, lebar: true,
    badan: h`<form id="f-koreksi" data-kirim="kr-tinjau" data-tindakan="${tindakan}" data-id="${s.id}" novalidate>
      <div data-galat aria-live="polite"></div>
      <input type="hidden" name="jenis" value="${s.jenis}">
      <div class="kotak-soal"><span class="lencana lencana-primer">${LABEL_JENIS_PENDEK[s.jenis]}</span><div class="pertanyaan pecah ky">${kayaHtml(s.pertanyaan)}</div></div>
      ${ket}
      ${tindakan === 'ubah_kunci' ? h`${htmlPilihKunci(s)}<div id="soal-status-kunci" aria-live="polite"></div>` : ''}
      <div class="isian"><label for="kr-alasan">Alasan (wajib, minimal 5 karakter)</label><textarea class="kontrol" id="kr-alasan" name="alasan" maxlength="300" rows="2" required placeholder="Contoh: Kunci pada naskah resmi ternyata C"></textarea></div>
    </form>`,
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'tinjau', label: 'Tinjau dampak', gaya: 'utama', tipe: 'submit', form: 'f-koreksi' }],
    saatBuka: function (api) { const f = el('#f-koreksi', api.el); if (f && tindakan === 'ubah_kunci') perbaruiStatusKunci(f); }
  });
};

KIRIM['kr-tinjau'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const tindakan = form.getAttribute('data-tindakan');
  const idSoal = form.getAttribute('data-id');
  const s = soalKoreksi(idSoal);
  const data = { id_paket: edSt.paket.id, id_soal: idSoal, tindakan: tindakan };
  if (tindakan === 'ubah_kunci') {
    const kunci = bacaKunciForm(form, s.jenis);
    const st = statusKunci(s.jenis, kunci);
    if (!st.ok) { perbaruiStatusKunci(form); galatForm(form, st.teks); return; }
    if (kunci === s.kunci) { galatForm(form, 'Kunci baru sama dengan kunci sekarang. Pilih kunci yang berbeda.'); return; }
    data.kunci = kunci;
  }
  if (!v.alasan || v.alasan.length < 5) { galatIsian(form, 'alasan', 'Alasan minimal 5 karakter.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('koreksi.pratinjau', data).then(function (d) {
      const api = modalTeratas(); if (api) api.tutup('tinjau');
      bukaPratinjau(d, data, v.alasan, s);
    });
  }).catch(function (e) {
    if (['VALIDASI', 'KUNCI_TIDAK_SAH', 'TIDAK_ADA', 'DITOLAK'].indexOf(e.kode) >= 0) galatForm(form, e.message); else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};

function bukaPratinjau(d, data, alasan, s) {
  const no = nomorSoalDiPaket(s.id);
  const baris = d.tindakan === 'ubah_kunci' ? 'Kunci ' + (no ? 'soal nomor ' + no : 'soal') + ' diubah dari ' + kunciTeks({ jenis: s.jenis, kunci: d.soal.kunciSekarang }) + ' menjadi ' + kunciTeks({ jenis: s.jenis, kunci: d.soal.kunciBaru }) + '.'
    : (d.tindakan === 'batalkan_soal' ? 'Soal ' + (no ? 'nomor ' + no : '') + ' dibatalkan dan tidak ikut dinilai.' : 'Soal dipulihkan dan ikut dinilai kembali.');
  modal({
    judul: 'Dampak koreksi', lebar: true, tahan: true,
    badan: h`<p class="tanpa-margin"><strong>${d.paket.nama}</strong><br>${baris}</p>
      <div class="kisi-kpi kisi-kpi-3">
        ${kpi('users', 'Percobaan terdampak', d.terdampak, 'yang memuat soal ini')}
        ${kpi('edit', 'Nilai berubah', d.berubah, formatAngka(d.naik) + ' naik · ' + formatAngka(d.turun) + ' turun', d.berubah ? 'peringatan' : '')}
        ${kpi('clock', 'Sedang berjalan', d.berjalan, d.berjalan ? 'dinilai dengan kunci baru saat dikumpulkan' : 'tidak ada')}
      </div>
      ${d.berubah === 0 ? h`<div class="peringatan">${ikon('info')}<div><p>Tidak ada nilai yang berubah. Koreksi tetap berlaku untuk percobaan berikutnya.</p></div></div>` : ''}
      ${d.contoh.length ? h`<div class="bungkus-tabel"><table class="tabel"><caption class="sr-only">Contoh perubahan nilai</caption><thead><tr><th scope="col">Peserta</th><th scope="col">Nilai lama</th><th scope="col">Nilai baru</th></tr></thead>
        <tbody>${d.contoh.map(function (c) { return h`<tr><td data-label="Peserta" class="pecah">${c.nama}</td><td data-label="Nilai lama" class="angka">${c.nilaiLama}</td><td data-label="Nilai baru" class="angka tebal">${c.nilaiBaru}</td></tr>`; })}</tbody></table></div>
        ${d.berubah > d.contoh.length ? h`<p class="bantu">Menampilkan ${formatAngka(d.contoh.length)} contoh dari ${formatAngka(d.berubah)} nilai yang berubah.</p>` : ''}` : ''}
      <div class="peringatan peringatan-waspada">${ikon('alert-triangle')}<div><p><strong>Alasan:</strong> ${alasan}</p><p>Koreksi tercatat di log audit. Riwayat nilai lama dan baru tiap peserta disimpan. Tinjauan ini berlaku 10 menit.</p></div></div>
      <div id="kr-status" aria-live="polite"></div>`,
    aksi: [
      { id: 'batal', label: 'Batal', gaya: 'diam' },
      {
        id: 'terapkan', label: 'Terapkan koreksi', gaya: 'bahaya',
        onKlik: function (api, tombol) {
          const tombolBatal = el('[data-modal-aksi="0"]', api.el);
          if (tombolBatal) tombolBatal.setAttribute('aria-disabled', 'true');
          pasang(el('#kr-status', api.el), h`<div class="peringatan">${ikon('clock')}<div><p>Menghitung ulang nilai. Jangan tutup halaman ini; paket besar bisa memerlukan beberapa menit.</p></div></div>`);
          kerjakan(tombol, function () {
            return panggil('koreksi.jalankan', Object.assign({ alasan: alasan, konfirmasi: d.konfirmasi }, data)).then(function (r) {
              api.tutup('selesai');
              modal({
                judul: 'Koreksi diterapkan',
                badan: h`<div class="peringatan peringatan-sukses">${ikon('check-circle')}<div><p><strong>Selesai.</strong> ${formatAngka(r.diperiksa)} percobaan diperiksa, ${formatAngka(r.berubah)} nilai berubah, ${formatAngka(r.akunTerdampak)} akun siswa ikut diperbarui di peringkat.</p></div></div>`,
                aksi: [{ id: 'ok', label: 'Tutup', gaya: 'utama' }]
              });
              return segarkanEditor();
            });
          }).catch(function (e) {
            if (tombolBatal) tombolBatal.removeAttribute('aria-disabled');
            pasang(el('#kr-status', api.el), '');
            if (e.kode === 'KONFIRMASI') { api.tutup(null); toast(e.message, 'galat'); return; }
            if (e.kode === 'JARINGAN' || e.kode === 'GALAT_SERVER') {
              api.tutup(null);
              modal({
                judul: 'Koreksi mungkin belum tuntas',
                badan: h`<div class="peringatan peringatan-bahaya">${ikon('alert-circle')}<div><p>${e.message}</p><p>Kunci atau status soal mungkin <strong>sudah berubah</strong>, tetapi perhitungan ulang nilai belum tentu selesai. Muat ulang halaman ini, lalu pakai <strong>Hitung ulang semua nilai paket</strong> untuk melengkapinya. Aman diulang.</p></div></div>`,
                aksi: [{ id: 'ok', label: 'Mengerti', gaya: 'utama' }]
              });
              segarkanEditor();
              return;
            }
            if (['VALIDASI', 'KUNCI_TIDAK_SAH', 'TIDAK_ADA', 'DITOLAK'].indexOf(e.kode) >= 0) { api.tutup(null); toast(e.message, 'galat'); } else gagalUmum(e);
          });
        }
      }
    ]
  });
}

AKSI['kr-hitung-ulang'] = function () {
  bukaPanelKoreksi = true;
  if (!edSt.paket) return;
  modal({
    judul: 'Hitung ulang semua nilai paket',
    badan: h`<form id="f-hitung-ulang" data-kirim="kr-hitung-ulang" novalidate>
      <div data-galat aria-live="polite"></div>
      <p class="tanpa-margin">Semua percobaan selesai pada paket <strong>${edSt.paket.nama}</strong> dinilai ulang terhadap kunci yang berlaku sekarang. Nilai yang sudah benar dilewati.</p>
      <div class="isian jarak-atas"><label for="hu-alasan">Alasan (wajib, minimal 5 karakter)</label><textarea class="kontrol" id="hu-alasan" name="alasan" maxlength="300" rows="2" required placeholder="Contoh: Melanjutkan koreksi yang terhenti"></textarea></div>
      <div id="hu-status" aria-live="polite"></div>
    </form>`,
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'jalan', label: 'Hitung ulang', gaya: 'utama', tipe: 'submit', form: 'f-hitung-ulang' }]
  });
};
KIRIM['kr-hitung-ulang'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  if (!v.alasan || v.alasan.length < 5) { galatIsian(form, 'alasan', 'Alasan minimal 5 karakter.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  pasang(el('#hu-status', form), h`<div class="peringatan jarak-atas">${ikon('clock')}<div><p>Menghitung ulang… jangan tutup halaman ini.</p></div></div>`);
  kerjakan(tombolKirim(form), function () {
    return panggil('koreksi.hitungUlang', { id_paket: edSt.paket.id, alasan: v.alasan }).then(function (r) {
      const api = modalTeratas(); if (api) api.tutup('selesai');
      modal({
        judul: 'Perhitungan ulang selesai',
        badan: h`<div class="peringatan peringatan-sukses">${ikon('check-circle')}<div><p>${formatAngka(r.diperiksa)} percobaan diperiksa, <strong>${formatAngka(r.berubah)}</strong> nilai berubah, ${formatAngka(r.akunTerdampak)} akun siswa diperbarui di peringkat.</p></div></div>`,
        aksi: [{ id: 'ok', label: 'Tutup', gaya: 'utama' }]
      });
    });
  }).catch(function (e) {
    pasang(el('#hu-status', form), '');
    if (e.kode === 'VALIDASI') galatForm(form, e.message); else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};


const imSt = { tahap: 'pilih', idPaket: '', berkas: null, teks: null, urut: 0, hasil: null, soal: [], paham: false, modal: null, kotor: false };
const IM_TEKS_MAKS = 300000;
const IM_STIMULUS_MAKS = 5000;
const IM_PEMBAHASAN_MAKS = 1500;
const IM_UNGGAH_BYTE_MAKS = 5 * 1048576;
const IM_PERTANYAAN_MAKS = 2000;
const IM_OPSI_MAKS = 500;
const IM_GALAT_FORM = ['VALIDASI', 'FORMAT', 'UKURAN', 'BERKAS_BESAR', 'TERENKRIPSI', 'BERBAHAYA', 'KOSONG', 'PERMINTAAN'];
const IM_GALAT_TUTUP = ['STATUS', 'TERKUNCI', 'TIDAK_ADA', 'DITOLAK'];
const IM_JENIS = ['PG', 'MCMA', 'BS'];

function imBuatModel(x) {
  const bs = x.kunciPernyataan ? String(x.kunciPernyataan).split(',') : [];
  const s = {
    no: x.no, jenis: x.jenis || '', pertanyaan: x.pertanyaan || '', opsi: (x.opsi || []).slice(),
    kunciPg: x.kunci || '', kunciBs: [bs[0] || '', bs[1] || '', bs[2] || ''],
    catatan: x.catatan || [], gambar: !!x.gambar, rumus: !!x.rumus, dariTabel: !!x.dariTabel, duplikat: x.duplikat || '', dipilih: false,
    dariFormat: !!x.dariFormat, stimulus: x.stimulus || '', pembahasan: x.pembahasan || '', kunciSumber: x.kunciSumber || '', keyakinan: x.keyakinan || ''
  };
  s.kunciAsli = imKunciSekarang(s);
  s.dipilih = !!x.lengkap && !x.duplikat && !s.catatan.length;
  return s;
}
function imKunciSekarang(s) { return s.jenis === 'PG' ? s.kunciPg : s.kunciBs.slice(0, 3).join(','); }
function imKunciStatus(s) {
  if (s.kunciSumber === 'dokumen') return 'dokumen';
  if (s.kunciSumber === 'claude' && imKunciSekarang(s) === s.kunciAsli) return 'claude';
  return '';
}
function imJumlahButir(s) { return s.jenis === 'PG' ? 4 : 3; }
function imOpsiN(s) { const n = imJumlahButir(s); const o = []; for (let i = 0; i < n; i++) o.push(s.opsi[i] || ''); return o; }
function imNamaButir(s, i) { return s.jenis === 'PG' ? 'Opsi ' + 'ABCD'.charAt(i) : 'Pernyataan ' + (i + 1); }

function imKurang(s) {
  const k = [];
  if (IM_JENIS.indexOf(s.jenis) < 0) { k.push('Pilih jenis soal.'); return k; }
  const p = s.pertanyaan.trim();
  if (p.length < 3) k.push('Isi pertanyaan (minimal 3 karakter).');
  else if (p.length > IM_PERTANYAAN_MAKS) k.push('Pertanyaan terlalu panjang (maksimal ' + formatAngka(IM_PERTANYAAN_MAKS) + ' karakter).');
  if (s.stimulus.trim().length > IM_STIMULUS_MAKS) k.push('Bacaan terlalu panjang (maksimal ' + formatAngka(IM_STIMULUS_MAKS) + ' karakter).');
  if (s.pembahasan.trim().length > IM_PEMBAHASAN_MAKS) k.push('Pembahasan terlalu panjang (maksimal ' + formatAngka(IM_PEMBAHASAN_MAKS) + ' karakter).');
  imOpsiN(s).forEach(function (t, i) {
    const x = t.trim();
    if (!x) k.push(imNamaButir(s, i) + ' masih kosong.');
    else if (x.length > IM_OPSI_MAKS) k.push(imNamaButir(s, i) + ' terlalu panjang (maksimal ' + formatAngka(IM_OPSI_MAKS) + ' karakter).');
  });
  if (s.jenis === 'PG') {
    if (!/^[A-D]$/.test(s.kunciPg)) k.push('Pilih kunci jawaban (A–D).');
  } else {
    const kb = s.kunciBs.slice(0, 3);
    if (kb.some(function (x) { return x !== 'B' && x !== 'S'; })) k.push('Pilih Benar atau Salah untuk ketiga pernyataan.');
    else if (s.jenis === 'MCMA' && kb.filter(function (x) { return x === 'B'; }).length !== 2) k.push('MCMA: tepat dua pernyataan Benar dan satu Salah.');
    else if (s.jenis === 'BS' && kb.every(function (x) { return x === kb[0]; })) k.push('Benar–Salah: kunci harus bervariasi, tidak boleh ketiganya sama.');
  }
  return k;
}
function imLengkap(s) { return imKurang(s).length === 0; }
function imDipilih() { return imSt.soal.filter(function (s) { return s.dipilih && imLengkap(s); }); }
function imRuang() { return imSt.hasil ? imSt.hasil.ruang : 0; }

function imBentukKirim(s) {
  return {
    no: s.no, jenis: s.jenis, pertanyaan: s.pertanyaan.trim(), opsi: imOpsiN(s).map(function (t) { return t.trim(); }),
    kunci: imKunciSekarang(s), stimulus: s.stimulus.trim(), pembahasan: s.pembahasan.trim(), kunciStatus: imKunciStatus(s)
  };
}

function htmlImPilih(pk) {
  return h`<div class="peringatan peringatan-waspada jarak-bawah" data-uji="im-prototipe">${ikon('alert-triangle')}<div>
      <p><strong>Fitur prototipe.</strong> Pembaca dokumen ini baru diuji dengan dokumen contoh buatan pengembang, jadi ketepatannya pada dokumen Anda belum diketahui. Karena itu <strong>tidak ada soal yang tersimpan sebelum Anda memeriksanya satu per satu</strong>, dan kunci jawaban tidak pernah ditebak oleh aplikasi. Pada berkas teks hasil konversi Claude, kunci yang dikarang Claude ditandai sebagai tebakan dan harus Anda periksa sebelum paket diterbitkan.</p></div></div>
    <form id="f-impor" novalidate>
      <div data-galat aria-live="polite"></div>
      <div class="isian"><label for="im-berkas">Pilih berkas</label>
        <input class="kontrol" id="im-berkas" name="berkas" type="file" accept=".txt,.md,text/plain,text/markdown,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" data-masuk="im-berkas" aria-describedby="im-berkas-b">
        <p class="bantu" id="im-berkas-b"><strong>Cara yang disarankan:</strong> kirim dokumen soal Anda ke Claude dengan skill konversi soal Siap TKA SD, lalu unggah berkas <strong>.txt</strong> hasilnya di sini (maksimal ${formatAngka(IM_TEKS_MAKS)} karakter). Bacaan, jenis soal, kunci, dan pembahasan ikut terbaca. Berkas Word (.docx) langsung juga masih bisa, maksimal ${formatAngka(IM_UNGGAH_BYTE_MAKS / 1048576)} MB, tetapi pembacanya kurang pintar. Hasil impor masuk ke paket <strong>${pk.nama}</strong> (${MAPEL[pk.mapel] || pk.mapel}) sebagai soal baru di urutan paling akhir.</p></div>
      <div id="im-pilihan" class="pb-pilihan" aria-live="polite"></div>
    </form>
    <details class="im-panduan" data-uji="im-panduan-teks"><summary>Tentang berkas teks hasil konversi Claude</summary>
      <ul>
        <li>Baris pertama harus <code>#FORMAT-IMPOR v1</code>. Berkas lain ditolak dengan pesan yang jelas.</li>
        <li>Kunci yang tertulis di dokumen asli ditandai <strong>dari dokumen</strong>. Kunci yang dikarang Claude ditandai <strong>tebakan Claude</strong>: tetap bisa diimpor, tetapi paket <strong>tidak bisa diterbitkan</strong> sebelum Anda memeriksa tiap soalnya dan mencentang "Kunci sudah saya periksa" di editor soal.</li>
        <li>Pembahasan dari Claude juga perlu Anda baca dulu; siswa melihatnya di halaman hasil.</li>
        <li>Gambar tidak ikut. Soal yang memerlukan gambar diberi catatan, dan gambarnya Anda tambahkan lewat editor soal.</li></ul></details>
    <details class="im-panduan" data-uji="im-panduan"><summary>Format dokumen Word yang dikenali</summary>
      <ul>
        <li>Nomor soal di awal baris: <code>1.</code> atau <code>1)</code>, berurutan. Penomoran otomatis Word ikut dibaca.</li>
        <li>Pilihan ganda: empat opsi <code>A.</code> sampai <code>D.</code> (boleh <code>a)</code> atau <code>(B)</code>, boleh satu baris).</li>
        <li>Kunci harus <strong>tertulis</strong>: <code>Kunci: B</code> setelah opsinya, atau daftar <code>KUNCI JAWABAN</code> di akhir (<code>1. B  2. C</code>), atau tabel No / Jawaban. Huruf tebal, garis bawah, atau warna <strong>tidak</strong> dipakai sebagai petunjuk kunci.</li>
        <li>Tiga pernyataan (<code>1) …</code> <code>2) …</code> <code>3) …</code> atau tabel Benar/Salah): Anda sendiri yang memilih jenisnya, MCMA atau Benar–Salah.</li>
        <li><strong>Tidak ikut diimpor:</strong> gambar, kotak teks, teks bacaan, pemformatan (tebal, miring), dan rumus (rumus disalin sebagai teks dan ditandai untuk Anda periksa).</li>
      </ul></details>`;
}

MASUKAN['im-berkas'] = function (r, e) {
  if (e && e.type === 'input') return;
  const form = r.form;
  const kotak = el('#im-pilihan', form);
  bersihGalat(form);
  imSt.berkas = null;
  imSt.teks = null;
  const nomor = ++imSt.urut;
  const file = r.files && r.files[0];
  if (!file) { pasang(kotak, h``); return; }
  const tolak = function (pesan) {
    if (nomor !== imSt.urut) return;
    r.value = '';
    imSt.berkas = null;
    pasang(kotak, h``);
    galatIsian(form, 'berkas', pesan);
  };
  if (/\.(txt|md)$/i.test(file.name)) {
    if (file.size === 0) { tolak('Berkas ini kosong.'); return; }
    if (file.size > IM_TEKS_MAKS * 4) { tolak('Berkas teks terlalu besar (' + gbUkuranTeks(file.size) + '). Pecah menjadi beberapa berkas, maksimal ' + formatAngka(IM_TEKS_MAKS) + ' karakter.'); return; }
    pasang(kotak, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Memeriksa berkas…</p>`);
    const bacaTeks = new FileReader();
    bacaTeks.onerror = function () { tolak('Berkas tidak bisa dibaca. Coba pilih lagi.'); };
    bacaTeks.onload = function () {
      if (nomor !== imSt.urut) return;
      const isi = String(bacaTeks.result || '');
      if (isi.length > IM_TEKS_MAKS) { tolak('Berkas teks berisi ' + formatAngka(isi.length) + ' karakter; batasnya ' + formatAngka(IM_TEKS_MAKS) + '. Pecah menjadi beberapa berkas.'); return; }
      if (isi.replace(/^\uFEFF/, '').trimStart().slice(0, 15).toUpperCase().indexOf('#FORMAT-IMPOR') !== 0) { tolak('Berkas ini bukan format impor Siap TKA SD (baris pertamanya harus #FORMAT-IMPOR v1). Buat berkasnya lewat skill konversi soal di Claude.'); return; }
      imSt.berkas = file;
      imSt.teks = isi;
      pasang(kotak, h`<p class="bantu pb-dipilih" data-uji="im-dipilih">${ikon('file-text', 'ikon-sm')} <strong>${file.name}</strong> · berkas teks format impor · ${formatAngka(isi.length)} karakter</p>`);
    };
    bacaTeks.readAsText(file, 'utf-8');
    return;
  }
  if (!/\.docx$/i.test(file.name)) {
    tolak(/\.docm$/i.test(file.name) ? 'Berkas .docm (berpotensi bermakro) tidak diterima. Simpan sebagai .docx biasa.'
      : /\.doc$/i.test(file.name) ? 'Format .doc lama belum didukung. Buka di Word lalu simpan sebagai .docx.'
        : /\.pdf$/i.test(file.name) ? 'Impor dari PDF belum tersedia pada prototipe ini. Gunakan berkas .docx.'
          : 'Hanya berkas .txt (hasil konversi Claude) atau .docx yang dapat diimpor.');
    return;
  }
  if (file.size === 0) { tolak('Berkas ini kosong.'); return; }
  if (file.size > IM_UNGGAH_BYTE_MAKS) { tolak('Ukuran berkas ' + gbUkuranTeks(file.size) + ' melebihi batas ' + formatAngka(IM_UNGGAH_BYTE_MAKS / 1048576) + ' MB.'); return; }
  pasang(kotak, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Memeriksa berkas…</p>`);
  const baca = new FileReader();
  baca.onerror = function () { tolak('Berkas tidak bisa dibaca. Coba pilih lagi.'); };
  baca.onload = function () {
    if (nomor !== imSt.urut) return;
    const u = new Uint8Array(baca.result);
    if (!(u[0] === 0x50 && u[1] === 0x4B && u[2] === 3 && u[3] === 4)) { tolak('Isi berkas ini bukan dokumen .docx walau namanya demikian. Buka di Word lalu simpan ulang sebagai .docx.'); return; }
    imSt.berkas = file;
    pasang(kotak, h`<p class="bantu pb-dipilih" data-uji="im-dipilih">${ikon('file-text', 'ikon-sm')} <strong>${file.name}</strong> · ${gbUkuranTeks(file.size)}</p>`);
  };
  baca.readAsArrayBuffer(file.slice(0, 4));
};

function htmlImSelectJenis(i, s) {
  return h`<div class="isian"><label for="im-j-${i}">Jenis soal</label>
    <select class="kontrol" id="im-j-${i}" data-masuk="impor-isi" data-i="${i}" data-bidang="jenis" data-uji="im-jenis">
      <option value=""${s.jenis === '' ? mentah(' selected') : ''}>— pilih jenis —</option>
      ${IM_JENIS.map(function (j) { return h`<option value="${j}"${s.jenis === j ? mentah(' selected') : ''}>${LABEL_JENIS_PENDEK[j]}</option>`; })}
    </select></div>`;
}

function htmlImBadanKartu(s, i) {
  const n = imJumlahButir(s);
  const bantuJenis = s.jenis === '' && s.opsi.length
    ? h`<div class="im-terbaca" data-uji="im-terbaca"><p class="bantu tanpa-margin">Butir yang terbaca dari dokumen (pilih jenis soal untuk mengeditnya):</p><ol>${s.opsi.map(function (t) { return h`<li>${t}</li>`; })}</ol></div>` : '';
  let butir = '';
  if (s.jenis === 'PG') {
    butir = h`<div class="im-butir" role="group" aria-label="Opsi jawaban">${imOpsiN(s).map(function (t, k) {
      return h`<div class="isian"><label for="im-o-${i}-${k}">Opsi ${'ABCD'.charAt(k)}</label><input class="kontrol" id="im-o-${i}-${k}" type="text" value="${t}" data-masuk="impor-isi" data-i="${i}" data-bidang="opsi" data-k="${k}" autocomplete="off"></div>`;
    })}</div>
      <div class="isian im-kunci"><label for="im-k-${i}">Kunci jawaban</label>
        <select class="kontrol" id="im-k-${i}" data-masuk="impor-isi" data-i="${i}" data-bidang="kunciPg" data-uji="im-kunci">
          <option value=""${s.kunciPg === '' ? mentah(' selected') : ''}>— pilih kunci —</option>
          ${['A', 'B', 'C', 'D'].map(function (x) { return h`<option value="${x}"${s.kunciPg === x ? mentah(' selected') : ''}>${x}</option>`; })}
        </select></div>`;
  } else if (s.jenis) {
    butir = h`<div class="im-butir" role="group" aria-label="Pernyataan">${imOpsiN(s).map(function (t, k) {
      return h`<div class="im-pernyataan"><div class="isian"><label for="im-o-${i}-${k}">Pernyataan ${k + 1}</label><input class="kontrol" id="im-o-${i}-${k}" type="text" value="${t}" data-masuk="impor-isi" data-i="${i}" data-bidang="opsi" data-k="${k}" autocomplete="off"></div>
        <div class="isian"><label for="im-b-${i}-${k}">Kunci pernyataan ${k + 1}</label>
          <select class="kontrol" id="im-b-${i}-${k}" data-masuk="impor-isi" data-i="${i}" data-bidang="kunciBs" data-k="${k}" data-uji="im-kunci-bs">
            <option value=""${s.kunciBs[k] === '' ? mentah(' selected') : ''}>— pilih —</option>
            <option value="B"${s.kunciBs[k] === 'B' ? mentah(' selected') : ''}>Benar</option>
            <option value="S"${s.kunciBs[k] === 'S' ? mentah(' selected') : ''}>Salah</option>
          </select></div></div>`;
    })}</div>`;
  }
  return h`${htmlImSelectJenis(i, s)}
    ${bantuJenis}
    ${s.jenis && s.opsi.length > n ? h`<p class="bantu tanpa-margin" data-uji="im-lebih">Dokumen punya ${formatAngka(s.opsi.length)} butir; hanya ${formatAngka(n)} pertama yang disimpan untuk jenis ini.</p>` : ''}
    ${s.dariFormat ? h`<div class="isian"><label for="im-st-${i}">Bacaan atau konteks <span class="opsional">(opsional)</span></label><textarea class="kontrol" id="im-st-${i}" rows="4" data-masuk="impor-isi" data-i="${i}" data-bidang="stimulus" data-uji="im-stimulus">${s.stimulus}</textarea></div>` : ''}
    <div class="isian"><label for="im-p-${i}">Pertanyaan</label><textarea class="kontrol" id="im-p-${i}" rows="3" data-masuk="impor-isi" data-i="${i}" data-bidang="pertanyaan" data-uji="im-pertanyaan">${s.pertanyaan}</textarea></div>
    ${butir}
    ${s.dariFormat ? h`<div class="isian"><label for="im-pb-${i}">Pembahasan <span class="opsional">(opsional, tampil ke siswa setelah ujian)</span></label><textarea class="kontrol" id="im-pb-${i}" rows="3" data-masuk="impor-isi" data-i="${i}" data-bidang="pembahasan" data-uji="im-pembahasan">${s.pembahasan}</textarea></div>` : ''}`;
}

function htmlImStatus(s) {
  const kurang = imKurang(s);
  const lengkap = kurang.length === 0;
  const aktif = s.dipilih && lengkap;
  return h`<span class="lencana ${aktif ? 'lencana-sukses' : (lengkap ? 'lencana-info' : 'lencana-peringatan')}" data-uji="im-status">${aktif ? 'Akan disimpan' : (lengkap ? 'Lengkap, belum dipilih' : 'Belum lengkap')}</span>`;
}
function htmlImKurang(s) {
  const kurang = imKurang(s);
  return kurang.length ? h`<ul class="im-kurang" data-uji="im-kurang">${kurang.map(function (t) { return h`<li>${t}</li>`; })}</ul>` : '';
}

function htmlImKartu(s, i) {
  const lengkap = imLengkap(s);
  return h`<li class="im-kartu${s.dipilih && lengkap ? ' terpilih' : ''}" data-i="${i}" data-uji="im-kartu">
    <div class="im-kepala">
      <label class="im-pilih"><input type="checkbox" data-masuk="impor-isi" data-i="${i}" data-bidang="pilih"${s.dipilih && lengkap ? mentah(' checked') : ''}${lengkap ? '' : mentah(' disabled')}><span>Simpan soal ini</span></label>
      <strong class="im-no">Soal nomor ${formatAngka(s.no)} di dokumen</strong>
      <span class="im-status" data-im-status>${htmlImStatus(s)}</span>
    </div>
    ${s.catatan.length || s.duplikat ? h`<div class="im-catatan" data-uji="im-catatan">${s.duplikat ? h`<p class="im-dup">${ikon('copy', 'ikon-sm')} ${s.duplikat}</p>` : ''}${s.catatan.length ? h`<ul>${s.catatan.map(function (t) { return h`<li>${t}</li>`; })}</ul>` : ''}</div>` : ''}
    <div class="im-badan" data-im-badan>${htmlImBadanKartu(s, i)}</div>
    <div data-im-kurang>${htmlImKurang(s)}</div>
  </li>`;
}

function htmlImPeriksa() {
  const d = imSt.hasil;
  const ada = d.soal.length;
  return h`<div class="im-ringkas" data-uji="im-ringkas" tabindex="-1" id="im-ringkas">
      <p class="tanpa-margin" id="im-hitung" data-uji="im-hitung"></p>
      <div class="baris-bungkus">
        <button type="button" class="tombol tombol-garis" data-aksi="impor-pilih-lengkap" data-uji="im-pilih-lengkap">${ikon('check-circle')}<span>Pilih semua yang lengkap</span></button>
        <button type="button" class="tombol tombol-diam" data-aksi="impor-kosongkan" data-uji="im-kosongkan">${ikon('x')}<span>Kosongkan pilihan</span></button></div>
    </div>
    <div id="im-galat" aria-live="assertive"></div>
    ${d.peringatan.length ? h`<div class="peringatan peringatan-waspada jarak-bawah" data-uji="im-peringatan">${ikon('alert-triangle')}<div>${d.peringatan.map(function (t) { return h`<p>${t}</p>`; })}</div></div>` : ''}
    <ol class="im-daftar" aria-label="Soal hasil bacaan dokumen, ${formatAngka(ada)} soal">${imSt.soal.map(function (s, i) { return htmlImKartu(s, i); })}</ol>
    ${d.jumlahTidakTerpakai ? h`<details class="im-tak-terpakai" data-uji="im-tak-terpakai"><summary>${formatAngka(d.jumlahTidakTerpakai)} baris di dokumen tidak terpakai</summary>
      <p class="bantu">Teks di bawah tidak dikenali sebagai bagian soal mana pun, jadi tidak ikut diimpor. Periksa apakah ada soal yang terlewat.</p>
      <ul>${d.tidakTerpakai.map(function (t) { return h`<li>${t}</li>`; })}</ul>${d.jumlahTidakTerpakai > d.tidakTerpakai.length ? h`<p class="bantu">… dan ${formatAngka(d.jumlahTidakTerpakai - d.tidakTerpakai.length)} baris lainnya.</p>` : ''}</details>` : ''}
    <label class="saklar im-paham"><input type="checkbox" id="im-paham" data-masuk="impor-paham" data-uji="im-paham"${imSt.paham ? mentah(' checked') : ''}><span class="jalur"></span><span>Saya sudah memeriksa teks, opsi, dan kunci setiap soal yang dipilih. Saya mengerti bahwa pembaca dokumen ini masih prototipe.</span></label>`;
}

function imPerbaruiKaki() {
  const api = imSt.modal;
  if (!api) return;
  const ulang = el('[data-modal-aksi="1"]', api.el);
  const utama = el('[data-modal-aksi="2"]', api.el);
  if (!ulang || !utama) return;
  if (imSt.tahap === 'pilih') {
    ulang.hidden = true;
    utama.textContent = 'Periksa berkas';
    utama.removeAttribute('aria-disabled');
    return;
  }
  ulang.hidden = false;
  const n = imDipilih().length;
  utama.textContent = n ? 'Simpan ' + formatAngka(n) + ' soal sebagai Draf' : 'Simpan soal terpilih';
  if (n && n <= imRuang() && imSt.paham) utama.removeAttribute('aria-disabled'); else utama.setAttribute('aria-disabled', 'true');
}

function imPerbaruiRingkas() {
  const hit = el('#im-hitung');
  if (!hit) return;
  const lengkap = imSt.soal.filter(imLengkap).length;
  const n = imDipilih().length;
  const lebih = n > imRuang();
  hit.textContent = formatAngka(imSt.soal.length) + ' soal dikenali · ' + formatAngka(lengkap) + ' lengkap · ' + formatAngka(n) + ' dipilih · sisa tempat di paket: ' + formatAngka(imRuang()) + (lebih ? '. Pilihan melebihi sisa tempat; kurangi dulu.' : '.');
  hit.classList.toggle('im-lebih', lebih);
  imPerbaruiKaki();
}

function imSegarkanKartu(i) {
  const li = el('.im-kartu[data-i="' + i + '"]');
  const s = imSt.soal[i];
  if (!li || !s) return;
  const lengkap = imLengkap(s);
  if (!lengkap && s.dipilih) s.dipilih = false;
  li.classList.toggle('terpilih', s.dipilih && lengkap);
  const cb = el('input[data-bidang="pilih"]', li);
  if (cb) { cb.checked = s.dipilih && lengkap; cb.disabled = !lengkap; }
  pasang(el('[data-im-status]', li), htmlImStatus(s));
  pasang(el('[data-im-kurang]', li), htmlImKurang(s));
  imPerbaruiRingkas();
}

MASUKAN['impor-isi'] = function (t) {
  const i = parseInt(t.getAttribute('data-i'), 10);
  const s = imSt.soal[i];
  if (!s) return;
  const bidang = t.getAttribute('data-bidang');
  const k = parseInt(t.getAttribute('data-k'), 10);
  imSt.kotor = true;
  if (bidang === 'pilih') {
    s.dipilih = t.checked && imLengkap(s);
    if (t.checked && !s.dipilih) t.checked = false;
  } else if (bidang === 'pertanyaan') s.pertanyaan = t.value;
  else if (bidang === 'stimulus') s.stimulus = t.value;
  else if (bidang === 'pembahasan') s.pembahasan = t.value;
  else if (bidang === 'opsi') s.opsi[k] = t.value;
  else if (bidang === 'kunciPg') s.kunciPg = t.value;
  else if (bidang === 'kunciBs') s.kunciBs[k] = t.value;
  else if (bidang === 'jenis') {
    if (s.jenis === t.value) return;
    s.jenis = t.value;
    s.dipilih = false;
    const li = el('.im-kartu[data-i="' + i + '"]');
    if (li) {
      pasang(el('[data-im-badan]', li), htmlImBadanKartu(s, i));
      const lagi = el('#im-j-' + i);
      if (lagi) lagi.focus();
    }
  }
  imSegarkanKartu(i);
};

MASUKAN['impor-paham'] = function (cb) {
  imSt.paham = !!cb.checked;
  imPerbaruiKaki();
};

AKSI['impor-pilih-lengkap'] = function () {
  let terlewat = 0;
  let dipilih = imDipilih().length;
  imSt.soal.forEach(function (s, i) {
    if (!imLengkap(s) || s.dipilih) return;
    if (dipilih >= imRuang()) { terlewat++; return; }
    s.dipilih = true; dipilih++;
    imSegarkanKartu(i);
  });
  imSt.kotor = true;
  if (terlewat) toast('Sisa tempat di paket hanya ' + formatAngka(imRuang()) + ' soal; ' + formatAngka(terlewat) + ' soal lengkap tidak ikut dipilih.', 'info');
  imPerbaruiRingkas();
};

AKSI['impor-kosongkan'] = function () {
  imSt.soal.forEach(function (s, i) { if (s.dipilih) { s.dipilih = false; imSegarkanKartu(i); } });
  imSt.kotor = true;
  imPerbaruiRingkas();
};

function imKePilih() {
  const api = imSt.modal; if (!api) return;
  Object.assign(imSt, { tahap: 'pilih', berkas: null, teks: null, hasil: null, soal: [], kotor: false });
  imSt.urut++;
  api.ganti(htmlImPilih(edSt.paket));
  imPerbaruiKaki();
}

function imTutupDenganGalat(e) {
  const api = imSt.modal;
  if (api) { imSt.kotor = false; api.tutup(null); }
  toast(e.message, 'galat');
  segarkanEditor();
}

function imAnalisis(tombol) {
  const form = el('#f-impor');
  if (!form) return;
  bersihGalat(form);
  const file = imSt.berkas;
  if (!file) { galatIsian(form, 'berkas', 'Pilih berkas dulu.'); return; }
  kerjakan(tombol, function () {
    const minta = imSt.teks !== null
      ? panggil('impor.teks', { id_paket: imSt.idPaket, nama: pbNamaKirim(file.name), teks: imSt.teks })
      : gbBase64(file).then(function (b64) { return panggil('impor.analisis', { id_paket: imSt.idPaket, nama: pbNamaKirim(file.name), data: b64 }); });
    return minta.then(function (d) {
      if (!imSt.modal) return;
      imSt.hasil = d;
      imSt.soal = d.soal.map(imBuatModel);
      imSt.tahap = 'periksa';
      imSt.paham = false;
      imSt.kotor = false;
      imSt.modal.ganti(htmlImPeriksa());
      imPerbaruiRingkas();
      const r = el('#im-ringkas'); if (r) r.focus();
    });
  }).catch(function (e) {
    if (!e || e.ditangani) return;
    if (IM_GALAT_TUTUP.indexOf(e.kode) >= 0) { imTutupDenganGalat(e); return; }
    if (IM_GALAT_FORM.indexOf(e.kode) >= 0 && el('#f-impor')) galatForm(el('#f-impor'), e.message); else gagalUmum(e);
  }).then(function () { imPerbaruiKaki(); });
}

function imSimpan(tombol) {
  const pilih = imDipilih();
  const muatan = { id_paket: imSt.idPaket, nama: pbNamaKirim(imSt.berkas ? imSt.berkas.name : 'impor'), soal: pilih.map(imBentukKirim) };
  const wadahGalat = el('#im-galat');
  if (wadahGalat) pasang(wadahGalat, h``);
  kerjakan(tombol, function () {
    return panggil('impor.simpan', muatan).then(function (r) {
      imSt.kotor = false;
      if (imSt.modal) imSt.modal.tutup('disimpan');
      const tebakan = muatan.soal.filter(function (x) { return x.kunciStatus === 'claude'; }).length;
      toast(formatAngka(r.tersimpan) + ' soal diimpor sebagai Draf.' + (tebakan ? ' ' + formatAngka(tebakan) + ' di antaranya berkunci tebakan Claude dan harus Anda periksa dulu sebelum paket bisa diterbitkan.' : ' Periksa sekali lagi di daftar soal sebelum menerbitkan.'), 'sukses');
      return segarkanEditor();
    });
  }).catch(function (e) {
    if (!e || e.ditangani) return;
    if (IM_GALAT_TUTUP.indexOf(e.kode) >= 0) { imTutupDenganGalat(e); return; }
    const w = el('#im-galat');
    if (w) {
      pasang(w, h`<div class="peringatan peringatan-bahaya jarak-bawah" role="alert" data-uji="im-galat-simpan">${ikon('alert-circle')}<div><p><strong>Tidak ada soal yang disimpan.</strong> ${e.message}</p></div></div>`);
      try { w.scrollIntoView({ block: 'nearest' }); } catch (x) {   }
    } else gagalUmum(e);
  }).then(function () { imPerbaruiKaki(); });
}

AKSI['impor-buka'] = function () {
  const pk = edSt.paket;
  if (!pk || pk.status !== 'Draf') return;
  Object.assign(imSt, { tahap: 'pilih', idPaket: pk.id, berkas: null, teks: null, hasil: null, soal: [], kotor: false });
  imSt.urut++;
  const api = modal({
    judul: 'Impor soal (prototipe)', lebar: true,
    badan: htmlImPilih(pk),
    aksi: [
      { id: 'tutup', label: 'Tutup', gaya: 'diam' },
      { id: 'ulang', label: 'Pilih berkas lain', gaya: 'garis', onKlik: function () { imKePilih(); } },
      { id: 'utama', label: 'Periksa berkas', gaya: 'utama', onKlik: function (a, tombol) { if (imSt.tahap === 'pilih') imAnalisis(tombol); else imSimpan(tombol); } }
    ]
  });
  imSt.modal = api;
  const tutupAsli = api.tutup;
  api.tutup = function (nilai) {
    if (imSt.tahap === 'periksa' && imSt.kotor) {
      konfirmasi({ judul: 'Tutup tanpa menyimpan?', ya: 'Tutup tanpa menyimpan', pesan: 'Hasil pembacaan dan perubahan yang sudah Anda buat di daftar soal ini akan hilang. Belum ada soal yang tersimpan ke paket.' })
        .then(function (ya) { if (ya) tutupAsli(null); });
      return;
    }
    tutupAsli(nilai);
  };
  api.selesai.then(function () { if (imSt.modal === api) imSt.modal = null; });
  imPerbaruiKaki();
};


const anSt = { id_paket: '', data: null, paket: [], seq: 0 };
const AN_KUNCI_SESI = 'siap.analisis.paket';
const AN_KELAS_KATEGORI = { Mudah: 'lencana-sukses', Sedang: 'lencana-peringatan', Sulit: 'lencana-bahaya' };
const AN_WARNA_KATEGORI = { Mudah: 'benar', Sedang: 'sebagian', Sulit: 'salah' };
const AN_KELAS_BAR = { Mudah: 'an-mudah', Sedang: 'an-sedang', Sulit: 'an-sulit' };

function anPersen(n, total) { return total > 0 ? Math.round(n / total * 1000) / 10 : null; }
function anPersenTeks(n, total) { const p = anPersen(n, total); return p === null ? '—' : formatAngka(p, 1) + '%'; }
function anCapaianTeks(c) { return typeof c === 'number' ? formatAngka(c, 1) + '%' : '—'; }

function renderAnalisisSoal(p, c) {
  anSt.data = null;
  anSt.id_paket = anSt.id_paket || bacaLokal('sesi', AN_KUNCI_SESI) || '';
  pasang(c.wadah, h`
    ${kepalaHalaman('Analisis Soal', 'Soal mana yang paling banyak dijawab benar dan mana yang paling sulit, dihitung dari semua pengerjaan yang sudah selesai pada satu paket.')}
    <div class="saring-analisis" role="search">
      <div class="isian"><label for="an-paket">Paket</label><select class="kontrol" id="an-paket" data-masuk="an-paket"><option value="">Pilih paket…</option></select></div>
    </div>
    <div id="an-hasil" aria-live="polite"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat daftar paket…</span></div></div>`);
  fokusJudul();
  panggil('paket.daftar', {}, { ulang: true }).then(function (d) {
    if (!c.ok()) return;
    anSt.paket = d;
    if (anSt.id_paket && !d.some(function (x) { return x.id === anSt.id_paket; })) anSt.id_paket = '';
    const sel = el('#an-paket');
    if (sel) pasang(sel, h`<option value="">Pilih paket…</option>${d.map(function (x) { return h`<option value="${x.id}"${anSt.id_paket === x.id ? mentah(' selected') : ''}>${x.nama} (${MAPEL[x.mapel] || x.mapel})</option>`; })}`);
    if (anSt.id_paket) muatAnalisis(c.ok); else gambarAnalisis();
  }).catch(function (e) {
    if (!c.ok()) return;
    tampilkanGalatMuat(el('#an-hasil'), e, true);
  });
}

function muatAnalisis(ok) {
  const seq = ++anSt.seq;
  pasang(el('#an-hasil'), h`<div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Menghitung analisis…</span></div>`);
  return panggil('analisis.paket', { id_paket: anSt.id_paket }, { ulang: true }).then(function (d) {
    if (seq !== anSt.seq || (ok && !ok())) return;
    anSt.data = d;
    gambarAnalisis();
  }).catch(function (e) {
    if (seq !== anSt.seq || (ok && !ok())) return;
    anSt.data = null;
    if (e && (e.kode === 'VALIDASI' || e.kode === 'TIDAK_ADA')) {
      pasang(el('#an-hasil'), h`<div class="peringatan peringatan-waspada" role="alert" data-uji="an-galat">${ikon('alert-triangle')}<div><p>${e.message}</p></div></div>`);
      return;
    }
    tampilkanGalatMuat(el('#an-hasil'), e, true);
  });
}

MASUKAN['an-paket'] = function () {
  const sel = el('#an-paket');
  if (!sel) return;
  anSt.id_paket = sel.value;
  if (anSt.id_paket) simpanLokal('sesi', AN_KUNCI_SESI, anSt.id_paket); else hapusLokal('sesi', AN_KUNCI_SESI);
  anSt.data = null;
  if (anSt.id_paket) muatAnalisis(); else gambarAnalisis();
};

function gambarAnalisis() {
  const w = el('#an-hasil');
  if (!w) return;
  const d = anSt.data;
  if (!anSt.id_paket || !d) {
    pasang(w, h`<div class="kartu kosong" data-uji="an-kosong"><span class="ikon-bulat netral">${ikon('bar-chart')}</span><h3>${anSt.paket.length ? 'Pilih paket untuk dianalisis' : 'Belum ada paket'}</h3><p>${anSt.paket.length ? 'Pilih satu paket di atas. Analisis dihitung dari pengerjaan yang sudah selesai.' : 'Buat paket dan kumpulkan hasil pengerjaan dulu, lalu analisisnya muncul di sini.'}</p></div>`);
    return;
  }
  const r = d.ringkas;
  if (!d.butir.length) {
    pasang(w, h`<div class="kartu kosong" data-uji="an-kosong"><span class="ikon-bulat netral">${ikon('list')}</span><h3>Paket ini belum punya soal</h3><p>Tambahkan soal lewat editor paket.</p></div>`);
    return;
  }
  if (!d.jumlahPercobaan) {
    pasang(w, h`<div class="kartu kosong" data-uji="an-kosong"><span class="ikon-bulat netral">${ikon('users')}</span><h3>Belum ada hasil pada paket ini</h3><p>Analisis muncul setelah ada peserta yang menyelesaikan paket ini.</p></div>`);
    return;
  }
  pasang(w, h`
    <div class="baris-bungkus jarak-bawah" id="an-ringkas">
      <span class="lencana lencana-primer">${ikon('list', 'ikon-sm')} Butir soal: <span class="angka" data-uji="an-butir">${formatAngka(r.butir)}</span></span>
      <span class="lencana lencana-primer">${ikon('users', 'ikon-sm')} Pengerjaan dianalisis: <span class="angka" data-uji="an-percobaan">${formatAngka(d.jumlahPercobaan)}</span></span>
      <span class="lencana lencana-primer">${ikon('bar-chart', 'ikon-sm')} Rata-rata capaian: <span class="angka" data-uji="an-rerata">${anCapaianTeks(r.rerataCapaian)}</span></span>
      <span class="lencana lencana-sukses">Mudah: <span class="angka" data-uji="an-mudah">${formatAngka(r.mudah)}</span></span>
      <span class="lencana lencana-peringatan">Sedang: <span class="angka" data-uji="an-sedang">${formatAngka(r.sedang)}</span></span>
      <span class="lencana lencana-bahaya">Sulit: <span class="angka" data-uji="an-sulit">${formatAngka(r.sulit)}</span></span>
      ${r.tanpaData > 0 ? h`<span class="lencana">Tanpa data: <span class="angka" data-uji="an-tanpa-data">${formatAngka(r.tanpaData)}</span></span>` : ''}
    </div>
    <div class="baris-bungkus jarak-bawah">
      <button type="button" class="tombol tombol-garis" data-aksi="an-unduh-xlsx" data-uji="an-unduh-xlsx">${ikon('download')}<span>Unduh Excel</span></button>
      <button type="button" class="tombol tombol-garis" data-aksi="an-unduh-xlsx-sulit" data-uji="an-unduh-xlsx-sulit">${ikon('download')}<span>Excel, tersulit dulu</span></button>
      <button type="button" class="tombol tombol-garis" data-aksi="an-unduh-pdf" data-uji="an-unduh-pdf">${ikon('file-text')}<span>Unduh PDF</span></button>
    </div>
    <div id="an-unduh" aria-live="polite"></div>
    ${d.tanpaRincian ? h`<p class="bantu" data-uji="an-tanpa-rincian">${formatAngka(d.tanpaRincian)} pengerjaan berasal dari versi lama dan tidak punya rincian per soal, jadi tidak ikut dihitung di tabel ini.</p>` : ''}
    ${d.dipotong ? h`<p class="bantu" data-uji="an-dipotong">Paket ini punya lebih dari ${formatAngka(d.batas)} pengerjaan selesai; hanya ${formatAngka(d.batas)} yang pertama dianalisis.</p>` : ''}
    <div class="bungkus-tabel bt-rel"><table class="tabel an-tabel"><caption class="sr-only">Analisis per soal: ${d.paket.nama}</caption>
      <thead><tr><th scope="col">No</th><th scope="col">Jenis</th><th scope="col">Pertanyaan</th><th scope="col">Peserta</th><th scope="col">Benar</th><th scope="col">Sebagian</th><th scope="col">Salah</th><th scope="col">Tidak dijawab</th><th scope="col">Capaian</th><th scope="col">Kategori</th></tr></thead>
      <tbody>${d.butir.map(function (b) {
        return h`<tr>
          <td data-label="No" class="angka">${b.no}</td>
          <td data-label="Jenis"><span class="lencana lencana-primer">${LABEL_JENIS_PENDEK[b.jenis] || b.jenis}</span></td>
          <td data-label="Pertanyaan" class="pecah an-pertanyaan">${b.pertanyaan || '(tanpa teks)'}</td>
          <td data-label="Peserta" class="angka">${formatAngka(b.peserta)}</td>
          <td data-label="Benar" class="angka an-hitung an-b"><div class="isi-sel"><span class="an-n">${formatAngka(b.benar)}</span><span class="sub-sel">${anPersenTeks(b.benar, b.peserta)}</span></div></td>
          <td data-label="Sebagian" class="angka an-hitung an-sb"><div class="isi-sel"><span class="an-n">${formatAngka(b.sebagian)}</span><span class="sub-sel">${anPersenTeks(b.sebagian, b.peserta)}</span></div></td>
          <td data-label="Salah" class="angka an-hitung an-s"><div class="isi-sel"><span class="an-n">${formatAngka(b.salah)}</span><span class="sub-sel">${anPersenTeks(b.salah, b.peserta)}</span></div></td>
          <td data-label="Tidak dijawab" class="angka an-hitung an-k"><div class="isi-sel"><span class="an-n">${formatAngka(b.kosong)}</span><span class="sub-sel">${anPersenTeks(b.kosong, b.peserta)}</span></div></td>
          <td data-label="Capaian" class="angka">${typeof b.capaian === 'number'
            ? h`<div class="an-capaian"><progress class="an-bar ${AN_KELAS_BAR[b.kategori]}" max="100" value="${b.capaian}" aria-label="Capaian soal ${b.no}">${anCapaianTeks(b.capaian)}</progress><span class="an-angka">${anCapaianTeks(b.capaian)}</span></div>` : '—'}</td>
          <td data-label="Kategori">${b.kategori ? h`<span class="lencana ${AN_KELAS_KATEGORI[b.kategori]}">${b.kategori}</span>` : h`<span class="lencana">Tanpa data</span>`}</td></tr>`;
      })}</tbody></table></div>
    <p class="bantu jarak-atas">Capaian = rata-rata skor soal dari semua peserta × 100 (jawaban sebagian benar dihitung sesuai skornya). Kategori: Mudah bila capaian ${formatAngka(d.ambang.mudah)}% ke atas, Sulit bila di bawah ${formatAngka(d.ambang.sulit)}%, selebihnya Sedang. Ambang ini tetap. Hanya pengerjaan berstatus Selesai atau Waktu habis yang dihitung.</p>`);
}

AKSI['an-unduh-xlsx'] = function (b) { anUnduh(b, 'xlsx', false); };
AKSI['an-unduh-xlsx-sulit'] = function (b) { anUnduh(b, 'xlsx', true); };
AKSI['an-unduh-pdf'] = function (b) { anUnduh(b, 'pdf', false); };

function anUnduh(tombol, jenis, sulitDulu) {
  const wadah = el('#an-unduh');
  const d = anSt.data;
  if (!d) return;
  pasang(wadah, '');
  kerjakan(tombol, function () {
    return new Promise(function (selesai) { setTimeout(selesai, 0); }).then(function () {
      const bytes = jenis === 'pdf' ? anPdf(d) : anXlsx(d, sulitDulu);
      ekLapor(wadah, ekNamaBerkas(['analisis-soal', d.paket.nama].concat(sulitDulu ? ['tersulit'] : []), jenis), bytes, jenis === 'pdf' ? 'application/pdf' : XLSX_TIPE);
    });
  }).catch(function (e) { ekLaporGalat(wadah, e); });
}

function anUrutSulit(butir) {
  return butir.slice().sort(function (a, b) {
    const ca = typeof a.capaian === 'number' ? a.capaian : Infinity;
    const cb = typeof b.capaian === 'number' ? b.capaian : Infinity;
    return ca !== cb ? ca - cb : a.no - b.no;
  });
}

function anRingkasanPasang(d) {
  const r = d.ringkas;
  return [['Paket', d.paket.nama], ['Mata pelajaran', (MAPEL[d.paket.mapel] || d.paket.mapel) + ' · ' + d.paket.kategori], ['Pengerjaan dianalisis', formatAngka(d.jumlahPercobaan)],
    ['Rata-rata nilai', d.rataNilai === null ? '-' : formatAngka(d.rataNilai, 2)], ['Butir soal', formatAngka(r.butir)], ['Rata-rata capaian', anCapaianTeks(r.rerataCapaian)]];
}

function anPdf(d) {
  const r = d.ringkas;
  const dok = pdfBuat({ judul: 'Analisis Soal · ' + d.paket.nama, penulis: ekPenulis(), arah: 'datar', kaki: namaApp() + ' · Analisis Soal · dibuat ' + ekWaktuCetak() });
  dok.judul('Analisis Soal');
  dok.teks(namaApp() + ' · dibuat ' + ekWaktuCetak(), { ukuran: 9, warna: PDF_WARNA.redam, jarakBawah: 6 });
  dok.pasangan(anRingkasanPasang(d), { kolom: 3 });
  dok.kotakAngka([['Mudah', formatAngka(r.mudah)], ['Sedang', formatAngka(r.sedang)], ['Sulit', formatAngka(r.sulit)], ['Rata-rata capaian', anCapaianTeks(r.rerataCapaian)]]);
  if (d.tanpaRincian) dok.teks(formatAngka(d.tanpaRincian) + ' pengerjaan versi lama tidak punya rincian per soal dan tidak ikut dihitung.', { ukuran: 9, tebal: true, warna: PDF_WARNA.salah });
  if (d.dipotong) dok.teks('Hanya ' + formatAngka(d.batas) + ' pengerjaan pertama yang dianalisis.', { ukuran: 9, tebal: true, warna: PDF_WARNA.salah });
  dok.tabel({
    ukuran: 8, maksBaris: 3,
    kolom: [{ judul: 'No', lebar: 0.8, rata: 'kanan' }, { judul: 'Jenis', lebar: 1.6 }, { judul: 'Pertanyaan', lebar: 8 }, { judul: 'Peserta', lebar: 1.3, rata: 'kanan' }, { judul: 'Benar', lebar: 1.9, rata: 'kanan' },
      { judul: 'Sebagian', lebar: 1.9, rata: 'kanan' }, { judul: 'Salah', lebar: 1.9, rata: 'kanan' }, { judul: 'Tidak dijawab', lebar: 1.9, rata: 'kanan' }, { judul: 'Capaian', lebar: 3 }, { judul: 'Kategori', lebar: 1.7 }],
    baris: d.butir.map(function (b) {
      const hit = function (n) { return b.peserta > 0 ? n + ' (' + anPersenTeks(n, b.peserta) + ')' : '-'; };
      return [b.no, LABEL_JENIS_PENDEK[b.jenis] || b.jenis, b.pertanyaan || '(tanpa teks)', b.peserta, hit(b.benar), hit(b.sebagian), hit(b.salah), hit(b.kosong),
        typeof b.capaian === 'number' ? { t: anCapaianTeks(b.capaian), bar: b.capaian, warnaBar: PDF_WARNA[AN_WARNA_KATEGORI[b.kategori]] } : '-',
        b.kategori ? { t: b.kategori, tebal: true, warna: PDF_WARNA[AN_WARNA_KATEGORI[b.kategori]] } : 'Tanpa data'];
    })
  });
  dok.teks('Capaian = rata-rata skor soal dari semua peserta x 100 (jawaban sebagian benar dihitung sesuai skornya). Mudah: capaian ' + d.ambang.mudah + '% ke atas; Sulit: di bawah ' + d.ambang.sulit + '%; selebihnya Sedang. Hanya pengerjaan berstatus Selesai atau Waktu habis yang dihitung.', { ukuran: 8, warna: PDF_WARNA.redam });
  return dok.selesai();
}

function anXlsx(d, sulitDulu) {
  const r = d.ringkas;
  const butir = sulitDulu ? anUrutSulit(d.butir) : d.butir;
  const ringkas = anRingkasanPasang(d).concat([['Mudah', String(r.mudah)], ['Sedang', String(r.sedang)], ['Sulit', String(r.sulit)]]);
  if (r.tanpaData > 0) ringkas.push(['Tanpa data', String(r.tanpaData)]);
  ringkas.push(['Ambang kategori', 'Mudah: ' + d.ambang.mudah + '% ke atas; Sulit: di bawah ' + d.ambang.sulit + '%; selebihnya Sedang'], ['Urutan tabel', sulitDulu ? 'Tersulit dulu (capaian kecil ke besar)' : 'Nomor soal'],
    ['Dibuat', ekWaktuCetak()], ['Dibuat oleh', ekPenulis()]);
  if (d.tanpaRincian) ringkas.push(['Catatan', formatAngka(d.tanpaRincian) + ' pengerjaan versi lama tidak punya rincian per soal dan tidak ikut dihitung.']);
  if (d.dipotong) ringkas.push(['Catatan', 'Hanya ' + formatAngka(d.batas) + ' pengerjaan pertama yang dianalisis.']);
  return xlsxBuat([
    {
      nama: 'Analisis', arah: 'datar',
      kolom: [{ judul: 'No', lebar: 6, tipe: 'bulat' }, { judul: 'Jenis', lebar: 14 }, { judul: 'Pertanyaan', lebar: 70 }, { judul: 'Peserta', lebar: 9, tipe: 'bulat' }, { judul: 'Benar', lebar: 8, tipe: 'bulat' }, { judul: 'Sebagian', lebar: 9, tipe: 'bulat' },
        { judul: 'Salah', lebar: 8, tipe: 'bulat' }, { judul: 'Tidak dijawab', lebar: 12, tipe: 'bulat' }, { judul: 'Benar (%)', lebar: 10, tipe: 'desimal1' }, { judul: 'Sebagian (%)', lebar: 12, tipe: 'desimal1' },
        { judul: 'Salah (%)', lebar: 10, tipe: 'desimal1' }, { judul: 'Tidak dijawab (%)', lebar: 16, tipe: 'desimal1' }, { judul: 'Capaian (%)', lebar: 12, tipe: 'desimal1' }, { judul: 'Kategori', lebar: 12 }],
      baris: butir.map(function (b) {
        return [b.no, LABEL_JENIS_PENDEK[b.jenis] || b.jenis, b.pertanyaan, b.peserta, b.benar, b.sebagian, b.salah, b.kosong, anPersen(b.benar, b.peserta), anPersen(b.sebagian, b.peserta), anPersen(b.salah, b.peserta),
          anPersen(b.kosong, b.peserta), b.capaian, b.kategori || 'Tanpa data'];
      })
    },
    { nama: 'Ringkasan', arah: 'tegak', kolom: [{ judul: 'Keterangan', lebar: 26 }, { judul: 'Isi', lebar: 60 }], baris: ringkas }
  ], { judul: 'Analisis Soal · ' + d.paket.nama, penulis: ekPenulis() });
}


const PDF_LEBAR_NORMAL = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 761,
  556, 556, 222, 556, 333, 1000, 556, 556, 333, 1000, 667, 333, 1000, 556, 611, 556,
  556, 222, 222, 333, 333, 350, 556, 1000, 333, 1000, 500, 333, 944, 556, 500, 667,
  278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333,
  400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611,
  667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278,
  722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611,
  556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556, 500
];
const PDF_LEBAR_TEBAL = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611,
  975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556,
  333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611,
  611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584, 761,
  556, 611, 278, 556, 500, 1000, 556, 556, 333, 1000, 667, 333, 1000, 611, 611, 611,
  611, 278, 278, 500, 500, 350, 556, 1000, 333, 1000, 556, 333, 944, 611, 500, 667,
  278, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 333, 737, 333,
  400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611,
  722, 722, 722, 722, 722, 722, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278,
  722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611,
  556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278, 278, 278,
  611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556, 611, 556
];


const PDF_KODE_KHUSUS = {
  '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86, '‡': 0x87, 'ˆ': 0x88,
  '‰': 0x89, 'Š': 0x8A, '‹': 0x8B, 'Œ': 0x8C, 'Ž': 0x8E, '‘': 0x91, '’': 0x92, '“': 0x93,
  '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97, '˜': 0x98, '™': 0x99, 'š': 0x9A, '›': 0x9B,
  'œ': 0x9C, 'ž': 0x9E, 'Ÿ': 0x9F
};
const PDF_GANTI = {
  '≥': '>=', '≤': '<=', '≠': '!=', '→': '->', '←': '<-', '↔': '<->', '√': 'akar ', '−': '-',
  '≈': '~', '∞': 'tak hingga', 'π': 'pi', '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8',
  '⁹': '^9', '⁰': '^0', '₀': '_0', '₁': '_1', '₂': '_2', '₃': '_3', '₄': '_4', '•': '•',
  '\u00a0': ' ', '\u2009': ' ', '\u2002': ' ', '\u2003': ' ', '\u202f': ' ', '●': '•', '✓': 'v', '✔': 'v', '✗': 'x', '✘': 'x'
};

function pdfKodeTeks(teks) {
  let s = String(teks === null || teks === undefined ? '' : teks).replace(/\r\n?/g, '\n');
  if (s.normalize) s = s.normalize('NFC');
  const out = [];
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c === 10) { out.push(10); continue; }
    if (c === 9) { out.push(32); continue; }
    if (c < 32 || c === 127 || (c >= 0x200B && c <= 0x200F) || (c >= 0x202A && c <= 0x202E) || (c >= 0x2060 && c <= 0x2064) || c === 0xFE0F || c === 0xFEFF) continue;
    if (c <= 126 || (c >= 0xA1 && c <= 0xFF)) { out.push(c); continue; }
    if (Object.prototype.hasOwnProperty.call(PDF_KODE_KHUSUS, ch)) { out.push(PDF_KODE_KHUSUS[ch]); continue; }
    if (Object.prototype.hasOwnProperty.call(PDF_GANTI, ch)) {
      const g = PDF_GANTI[ch];
      for (let i = 0; i < g.length; i++) out.push(g.charCodeAt(i) === 0x2022 ? 0x95 : g.charCodeAt(i));
      continue;
    }
    out.push(63);
  }
  return out;
}

function pdfLebarKode(kode, tebal) {
  if (kode < 32 || kode > 255) return 0;
  return (tebal ? PDF_LEBAR_TEBAL : PDF_LEBAR_NORMAL)[kode - 32];
}
function pdfLebarTeks(kodeArr, tebal, ukuran) {
  let t = 0;
  for (let i = 0; i < kodeArr.length; i++) t += pdfLebarKode(kodeArr[i], tebal);
  return t * ukuran / 1000;
}

function pdfBungkus(teks, tebal, ukuran, lebarMaks, maksBaris) {
  const semua = pdfKodeTeks(teks);
  const batas = lebarMaks * 0.985;
  const baris = [];
  const alinea = [[]];
  semua.forEach(function (k) { if (k === 10) alinea.push([]); else alinea[alinea.length - 1].push(k); });
  alinea.forEach(function (kodeAlinea) {
    const kata = [];
    let kini = [];
    kodeAlinea.forEach(function (k) {
      if (k === 32) { if (kini.length) { kata.push(kini); kini = []; } } else kini.push(k);
    });
    if (kini.length) kata.push(kini);
    if (!kata.length) { baris.push([]); return; }
    let cur = [];
    const lebarSpasi = pdfLebarKode(32, tebal) * ukuran / 1000;
    kata.forEach(function (w) {
      const lw = pdfLebarTeks(w, tebal, ukuran);
      if (cur.length && pdfLebarTeks(cur, tebal, ukuran) + lebarSpasi + lw <= batas) { cur = cur.concat([32], w); return; }
      if (cur.length) { baris.push(cur); cur = []; }
      if (lw <= batas) { cur = w.slice(); return; }
      let potongan = [];
      w.forEach(function (k) {
        if (potongan.length && pdfLebarTeks(potongan.concat([k]), tebal, ukuran) > batas) { baris.push(potongan); potongan = []; }
        potongan.push(k);
      });
      cur = potongan;
    });
    if (cur.length) baris.push(cur);
  });
  if (maksBaris && baris.length > maksBaris) {
    const terpotong = baris.slice(0, maksBaris);
    let akhir = terpotong[maksBaris - 1];
    while (akhir.length && pdfLebarTeks(akhir.concat([0x85]), tebal, ukuran) > batas) akhir = akhir.slice(0, -1);
    while (akhir.length && akhir[akhir.length - 1] === 32) akhir = akhir.slice(0, -1);
    terpotong[maksBaris - 1] = akhir.concat([0x85]);
    return terpotong;
  }
  return baris;
}

function pdfWarna(w) {
  const a = w || [0, 0, 0];
  return a.map(function (x) { return (Math.round(Math.max(0, Math.min(1, x)) * 1000) / 1000).toString(); }).join(' ');
}
const PDF_WARNA = {
  teks: [0.09, 0.11, 0.15], redam: [0.34, 0.38, 0.45], garis: [0.78, 0.81, 0.86], kepala: [0.88, 0.92, 0.97], belang: [0.972, 0.978, 0.988],
  benar: [0.04, 0.4, 0.17], sebagian: [0.6, 0.27, 0.0], salah: [0.7, 0.09, 0.09], bar: [0.15, 0.39, 0.92], lintasan: [0.9, 0.92, 0.95], putih: [1, 1, 1]
};
const PDF_UKURAN_KERTAS = { A4: [595.28, 841.89] };

function pdfStringKode(kodeArr) {
  let s = '';
  for (let i = 0; i < kodeArr.length; i++) {
    const k = kodeArr[i];
    if (k === 40 || k === 41 || k === 92) s += '\\' + String.fromCharCode(k);
    else if (k < 32 || k > 126) s += '\\' + ('00' + k.toString(8)).slice(-3);
    else s += String.fromCharCode(k);
  }
  return '(' + s + ')';
}
function pdfHexUtf16(teks) {
  let h = 'FEFF';
  for (let i = 0; i < teks.length; i++) h += ('0000' + teks.charCodeAt(i).toString(16).toUpperCase()).slice(-4);
  return '<' + h + '>';
}
function pdfAngka(n) { return (Math.round(n * 100) / 100).toString(); }

function pdfBuat(opsi) {
  const o = Object.assign({ judul: '', penulis: '', arah: 'tegak', margin: 36, kaki: '', waktu: new Date() }, opsi || {});
  const tegak = o.arah !== 'datar';
  const W = tegak ? PDF_UKURAN_KERTAS.A4[0] : PDF_UKURAN_KERTAS.A4[1];
  const H = tegak ? PDF_UKURAN_KERTAS.A4[1] : PDF_UKURAN_KERTAS.A4[0];
  const M = o.margin;
  const lebarIsi = W - 2 * M;
  const batasBawah = M + 14;
  const halaman = [];
  let aktif = null;
  let y = 0;

  function halamanBaru() { aktif = []; halaman.push(aktif); y = H - M; }
  function pastikan(tinggi) { if (!aktif) halamanBaru(); else if (y - tinggi < batasBawah) halamanBaru(); }
  function gambarTeks(kodeArr, x, yDasar, ukuran, tebal, warna) {
    if (!kodeArr.length) return;
    aktif.push('BT /' + (tebal ? 'F2' : 'F1') + ' ' + pdfAngka(ukuran) + ' Tf ' + pdfWarna(warna || PDF_WARNA.teks) + ' rg ' + pdfAngka(x) + ' ' + pdfAngka(yDasar) + ' Td ' + pdfStringKode(kodeArr) + ' Tj ET');
  }
  function persegi(x, yBawah, w, h, warna) { aktif.push(pdfWarna(warna) + ' rg ' + pdfAngka(x) + ' ' + pdfAngka(yBawah) + ' ' + pdfAngka(w) + ' ' + pdfAngka(h) + ' re f'); }
  function bingkai(x, yBawah, w, h, warna, tebalGaris) { aktif.push(pdfAngka(tebalGaris || 0.6) + ' w ' + pdfWarna(warna) + ' RG ' + pdfAngka(x) + ' ' + pdfAngka(yBawah) + ' ' + pdfAngka(w) + ' ' + pdfAngka(h) + ' re S'); }
  function garisH(x1, x2, yy, warna, tebalGaris) { aktif.push(pdfAngka(tebalGaris || 0.5) + ' w ' + pdfWarna(warna) + ' RG ' + pdfAngka(x1) + ' ' + pdfAngka(yy) + ' m ' + pdfAngka(x2) + ' ' + pdfAngka(yy) + ' l S'); }
  function xRata(kodeArr, tebal, ukuran, x, lebar, rata) {
    const w = pdfLebarTeks(kodeArr, tebal, ukuran);
    if (rata === 'kanan') return x + lebar - w;
    if (rata === 'tengah') return x + (lebar - w) / 2;
    return x;
  }

  const api = {
    lebarIsi: lebarIsi,
    teks: function (isi, opt) {
      const p = Object.assign({ ukuran: 10, tebal: false, warna: PDF_WARNA.teks, rata: 'kiri', jarakBawah: 4, lebar: lebarIsi, x: M, maksBaris: 0 }, opt || {});
      const lh = p.ukuran * 1.28;
      const baris = pdfBungkus(isi, p.tebal, p.ukuran, p.lebar, p.maksBaris);
      baris.forEach(function (b) {
        pastikan(lh);
        gambarTeks(b, xRata(b, p.tebal, p.ukuran, p.x, p.lebar, p.rata), y - p.ukuran * 0.92, p.ukuran, p.tebal, p.warna);
        y -= lh;
      });
      y -= p.jarakBawah;
      return api;
    },
    judul: function (isi, opt) { return api.teks(isi, Object.assign({ ukuran: 16, tebal: true, jarakBawah: 3 }, opt || {})); },
    jarak: function (n) { if (!aktif) halamanBaru(); y -= n; return api; },
    garis: function () { pastikan(6); garisH(M, W - M, y - 2, PDF_WARNA.garis, 0.7); y -= 7; return api; },
    pasangan: function (daftar, opt) {
      const p = Object.assign({ kolom: 2 }, opt || {});
      const lk = lebarIsi / p.kolom;
      for (let i = 0; i < daftar.length; i += p.kolom) {
        const potong = daftar.slice(i, i + p.kolom);
        const sel = potong.map(function (d) { return { l: pdfBungkus(d[0], false, 8, lk - 8, 1), v: pdfBungkus(d[1] === null || d[1] === undefined || d[1] === '' ? '-' : d[1], true, 10, lk - 8, 3) }; });
        const tinggi = 8 * 1.3 + Math.max.apply(null, sel.map(function (s) { return s.v.length; })) * 12.8 + 4;
        pastikan(tinggi);
        sel.forEach(function (s, j) {
          const x = M + j * lk;
          gambarTeks(s.l[0] || [], x, y - 7.5, 8, false, PDF_WARNA.redam);
          s.v.forEach(function (b, n) { gambarTeks(b, x, y - 8 * 1.3 - 9 - n * 12.8, 10, true, PDF_WARNA.teks); });
        });
        y -= tinggi;
      }
      return api;
    },
    kotakAngka: function (daftar) {
      const n = daftar.length;
      const gap = 8;
      const lk = (lebarIsi - gap * (n - 1)) / n;
      const tinggi = 44;
      pastikan(tinggi + 6);
      daftar.forEach(function (d, i) {
        const x = M + i * (lk + gap);
        persegi(x, y - tinggi, lk, tinggi, PDF_WARNA.belang);
        bingkai(x, y - tinggi, lk, tinggi, PDF_WARNA.garis, 0.6);
        const v = pdfBungkus(d[1], true, 15, lk - 6, 1)[0] || [];
        const l = pdfBungkus(d[0], false, 8, lk - 6, 1)[0] || [];
        gambarTeks(v, xRata(v, true, 15, x, lk, 'tengah'), y - 20, 15, true, PDF_WARNA.teks);
        gambarTeks(l, xRata(l, false, 8, x, lk, 'tengah'), y - 35, 8, false, PDF_WARNA.redam);
      });
      y -= tinggi + 8;
      return api;
    },
    tabel: function (def) {
      const ukuran = def.ukuran || 8.5;
      const lh = ukuran * 1.27;
      const padX = 4, padY = 3.2;
      const maksBaris = def.maksBaris || 6;
      const bobot = def.kolom.reduce(function (a, k) { return a + (k.lebar || 1); }, 0);
      const lk = def.kolom.map(function (k) { return lebarIsi * (k.lebar || 1) / bobot; });
      const xk = [];
      lk.reduce(function (a, w, i) { xk[i] = M + a; return a + w; }, 0);
      function susun(sel, i, kepala) {
        const s = (sel !== null && typeof sel === 'object' && !Array.isArray(sel)) ? sel : { t: sel };
        const tebal = kepala || s.tebal === true;
        const teks = s.t === null || s.t === undefined ? '' : String(s.t);
        const baris = pdfBungkus(teks, tebal, ukuran, lk[i] - 2 * padX, maksBaris);
        return { baris: baris, tebal: tebal, warna: s.warna || (kepala ? PDF_WARNA.teks : PDF_WARNA.teks), rata: s.rata || def.kolom[i].rata || 'kiri', bar: typeof s.bar === 'number' ? s.bar : null, warnaBar: s.warnaBar || PDF_WARNA.bar };
      }
      function tinggiBaris(sel) { return Math.max.apply(null, sel.map(function (c) { return Math.max(1, c.baris.length) * lh + (c.bar !== null ? 7 : 0); })) + 2 * padY; }
      function gambarBaris(sel, tinggi, warnaLatar) {
        if (warnaLatar) persegi(M, y - tinggi, lebarIsi, tinggi, warnaLatar);
        sel.forEach(function (c, i) {
          c.baris.forEach(function (b, n) {
            gambarTeks(b, xRata(b, c.tebal, ukuran, xk[i] + padX, lk[i] - 2 * padX, c.rata), y - padY - ukuran * 0.92 - n * lh, ukuran, c.tebal, c.warna);
          });
          if (c.bar !== null) {
            const bx = xk[i] + padX, bw = lk[i] - 2 * padX, by = y - tinggi + padY;
            persegi(bx, by, bw, 3.6, PDF_WARNA.lintasan);
            persegi(bx, by, bw * Math.max(0, Math.min(100, c.bar)) / 100, 3.6, c.warnaBar);
          }
        });
        garisH(M, W - M, y - tinggi, PDF_WARNA.garis, 0.4);
        y -= tinggi;
      }
      const kepala = def.kolom.map(function (k, i) { return susun(k.judul, i, true); });
      const tKepala = tinggiBaris(kepala);
      function gambarKepala() { gambarBaris(kepala, tKepala, PDF_WARNA.kepala); }
      pastikan(tKepala + 30);
      gambarKepala();
      def.baris.forEach(function (r, n) {
        const sel = r.map(function (s, i) { return susun(s, i, false); });
        const t = tinggiBaris(sel);
        if (y - t < batasBawah) { halamanBaru(); gambarKepala(); }
        gambarBaris(sel, t, n % 2 ? PDF_WARNA.belang : null);
      });
      y -= 6;
      return api;
    },
    selesai: function () {
      if (!halaman.length) halamanBaru();
      const total = halaman.length;
      halaman.forEach(function (isi, i) {
        aktif = isi;
        garisH(M, W - M, M - 4, PDF_WARNA.garis, 0.5);
        gambarTeks(pdfBungkus(o.kaki, false, 7.5, lebarIsi - 90, 1)[0] || [], M, M - 15, 7.5, false, PDF_WARNA.redam);
        const nomor = pdfKodeTeks('Halaman ' + (i + 1) + ' dari ' + total);
        gambarTeks(nomor, W - M - pdfLebarTeks(nomor, false, 7.5), M - 15, 7.5, false, PDF_WARNA.redam);
      });
      return pdfRakit(halaman, W, H, o);
    }
  };
  return api;
}

function pdfRakit(halaman, W, H, o) {
  const bagian = [];
  let panjang = 0;
  const offset = [];
  function tulis(s) { bagian.push(s); panjang += s.length; }
  function objek(no, isi) { offset[no] = panjang; tulis(no + ' 0 obj\n' + isi + '\nendobj\n'); }
  const n = halaman.length;
  const d = o.waktu instanceof Date && !isNaN(o.waktu) ? o.waktu : new Date();
  const dua = function (x) { return ('0' + x).slice(-2); };
  const tanggal = 'D:' + d.getUTCFullYear() + dua(d.getUTCMonth() + 1) + dua(d.getUTCDate()) + dua(d.getUTCHours()) + dua(d.getUTCMinutes()) + dua(d.getUTCSeconds()) + 'Z';
  tulis('%PDF-1.4\n%âãÏÓ\n');
  objek(1, '<< /Type /Catalog /Pages 2 0 R >>');
  const kids = [];
  for (let i = 0; i < n; i++) kids.push((6 + 2 * i) + ' 0 R');
  objek(2, '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + n + ' >>');
  objek(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  objek(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  objek(5, '<< /Title ' + pdfHexUtf16(o.judul || '') + ' /Author ' + pdfHexUtf16(o.penulis || '') + ' /Producer ' + pdfHexUtf16('Siap TKA SD') + ' /CreationDate (' + tanggal + ') >>');
  for (let i = 0; i < n; i++) {
    const isi = halaman[i].join('\n');
    objek(6 + 2 * i, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pdfAngka(W) + ' ' + pdfAngka(H) + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + (7 + 2 * i) + ' 0 R >>');
    objek(7 + 2 * i, '<< /Length ' + isi.length + ' >>\nstream\n' + isi + '\nendstream');
  }
  const jumlahObjek = 6 + 2 * n;
  const mulaiXref = panjang;
  let x = 'xref\n0 ' + jumlahObjek + '\n0000000000 65535 f \n';
  for (let i = 1; i < jumlahObjek; i++) x += ('0000000000' + offset[i]).slice(-10) + ' 00000 n \n';
  tulis(x);
  tulis('trailer\n<< /Size ' + jumlahObjek + ' /Root 1 0 R /Info 5 0 R >>\nstartxref\n' + mulaiXref + '\n%%EOF\n');
  const semua = bagian.join('');
  const bytes = new Uint8Array(semua.length);
  for (let i = 0; i < semua.length; i++) bytes[i] = semua.charCodeAt(i) & 255;
  return bytes;
}


const EK_MASA_URL_MS = 300000;
const ekSt = { url: null, timer: null };

function ekLepasUrl() {
  if (ekSt.timer) { clearTimeout(ekSt.timer); ekSt.timer = null; }
  if (ekSt.url) { try { URL.revokeObjectURL(ekSt.url); } catch (e) {   } ekSt.url = null; }
}

function ekSimpan(nama, bytes, tipe) {
  let url;
  try {
    url = URL.createObjectURL(new Blob([bytes], { type: tipe }));
  } catch (e) {
    throw galat('UNDUH', 'Peramban ini tidak dapat menyiapkan berkas untuk disimpan. Coba peramban lain atau perbarui peramban Anda.');
  }
  ekLepasUrl();
  ekSt.url = url;
  ekSt.timer = setTimeout(ekLepasUrl, EK_MASA_URL_MS);
  try {
    const a = document.createElement('a');
    a.href = url; a.download = nama; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } catch (e) {   }
  return url;
}

function ekLapor(wadah, nama, bytes, tipe) {
  const url = ekSimpan(nama, bytes, tipe);
  if (!wadah) return;
  pasang(wadah, h`<div class="peringatan peringatan-sukses" data-uji="ek-berhasil">${ikon('check-circle')}<div>
    <p><strong>${nama}</strong> (${gbUkuranTeks(bytes.length)}) disiapkan.</p>
    <p class="bantu">Bila berkas tidak tersimpan otomatis, <a href="#" class="tautan" data-ek-tab>buka di tab baru</a> lalu simpan dari sana, atau tekan tombolnya sekali lagi.</p></div></div>`);
  const t = el('a[data-ek-tab]', wadah);
  if (t) { t.setAttribute('href', url); t.setAttribute('target', '_blank'); t.setAttribute('rel', 'noopener'); }
}

function ekLaporGalat(wadah, e) {
  if (!e || e.ditangani) return;
  if (!wadah) { gagalUmum(e); return; }
  pasang(wadah, h`<div class="peringatan peringatan-bahaya" role="alert" data-uji="ek-galat">${ikon('alert-circle')}<div><p>${e.message || 'Terjadi kesalahan saat menyiapkan berkas.'}</p></div></div>`);
}

function ekBersihNama(teks) {
  let s = String(teks === null || teks === undefined ? '' : teks);
  if (s.normalize) s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '').slice(0, 50);
  return s || 'berkas';
}
function ekStempel() {
  const d = keWIB(new Date().toISOString());
  return d.getUTCFullYear() + dua(d.getUTCMonth() + 1) + dua(d.getUTCDate()) + '-' + dua(d.getUTCHours()) + dua(d.getUTCMinutes());
}
function ekNamaBerkas(bagian, ekstensi) {
  return bagian.map(ekBersihNama).join('-') + '-' + ekStempel() + '.' + ekstensi;
}
function ekWaktuCetak() { return waktuWIB(new Date().toISOString()); }
function ekWaktuAngka(iso) {
  const d = keWIB(iso);
  if (!d) return '';
  return d.getUTCFullYear() + '-' + dua(d.getUTCMonth() + 1) + '-' + dua(d.getUTCDate()) + ' ' + dua(d.getUTCHours()) + ':' + dua(d.getUTCMinutes());
}
function ekDurasi(detik) {
  if (detik === null || detik === undefined || !isFinite(detik)) return '';
  const t = Math.max(0, Math.round(detik));
  if (t >= 3600) return Math.floor(t / 3600) + ' j ' + dua(Math.floor((t % 3600) / 60)) + ' mnt';
  return Math.floor(t / 60) + ' mnt ' + dua(t % 60) + ' dtk';
}
function ekPotong(teks, maks) {
  const s = String(teks === null || teks === undefined ? '' : teks).replace(/\s+/g, ' ').trim();
  return s.length > maks ? s.slice(0, maks - 1) + '…' : s;
}
function ekPenulis() { return S.pengguna && S.pengguna.nama ? S.pengguna.nama : 'Siap TKA SD'; }


const XLSX_XML = '<' + '?xml version="1.0" encoding="UTF-8" standalone="yes"?' + '>\n';
const XLSX_TIPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const XLSX_TEKS_MAKS = 32000;

const ZIP_CRC = (function () {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function zipCrc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = ZIP_CRC[(c ^ bytes[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function zipBuat(entri, waktu) {
  const d = waktu instanceof Date && !isNaN(waktu) ? waktu : new Date();
  const dosJam = (d.getUTCHours() << 11) | (d.getUTCMinutes() << 5) | (d.getUTCSeconds() >> 1);
  const dosTgl = ((Math.max(1980, d.getUTCFullYear()) - 1980) << 9) | ((d.getUTCMonth() + 1) << 5) | d.getUTCDate();
  const enc = new TextEncoder();
  const nama = entri.map(function (e) { return enc.encode(e.nama); });
  let ukuran = 22;
  entri.forEach(function (e, i) { ukuran += 30 + nama[i].length + e.data.length + 46 + nama[i].length; });
  const out = new Uint8Array(ukuran);
  const v = new DataView(out.buffer);
  let p = 0;
  const lokal = [];
  entri.forEach(function (e, i) {
    const crc = zipCrc32(e.data);
    lokal.push({ crc: crc, awal: p });
    v.setUint32(p, 0x04034B50, true); v.setUint16(p + 4, 20, true); v.setUint16(p + 6, 0x0800, true); v.setUint16(p + 8, 0, true);
    v.setUint16(p + 10, dosJam, true); v.setUint16(p + 12, dosTgl, true); v.setUint32(p + 14, crc, true);
    v.setUint32(p + 18, e.data.length, true); v.setUint32(p + 22, e.data.length, true);
    v.setUint16(p + 26, nama[i].length, true); v.setUint16(p + 28, 0, true);
    out.set(nama[i], p + 30); p += 30 + nama[i].length;
    out.set(e.data, p); p += e.data.length;
  });
  const awalPusat = p;
  entri.forEach(function (e, i) {
    v.setUint32(p, 0x02014B50, true); v.setUint16(p + 4, 20, true); v.setUint16(p + 6, 20, true); v.setUint16(p + 8, 0x0800, true); v.setUint16(p + 10, 0, true);
    v.setUint16(p + 12, dosJam, true); v.setUint16(p + 14, dosTgl, true); v.setUint32(p + 16, lokal[i].crc, true);
    v.setUint32(p + 20, e.data.length, true); v.setUint32(p + 24, e.data.length, true);
    v.setUint16(p + 28, nama[i].length, true); v.setUint16(p + 30, 0, true); v.setUint16(p + 32, 0, true); v.setUint16(p + 34, 0, true);
    v.setUint16(p + 36, 0, true); v.setUint32(p + 38, 0, true); v.setUint32(p + 42, lokal[i].awal, true);
    out.set(nama[i], p + 46); p += 46 + nama[i].length;
  });
  v.setUint32(p, 0x06054B50, true); v.setUint16(p + 4, 0, true); v.setUint16(p + 6, 0, true);
  v.setUint16(p + 8, entri.length, true); v.setUint16(p + 10, entri.length, true);
  v.setUint32(p + 12, p - awalPusat, true); v.setUint32(p + 16, awalPusat, true); v.setUint16(p + 20, 0, true);
  return out;
}

function xlsxEsc(nilai) {
  let s = String(nilai === null || nilai === undefined ? '' : nilai);
  if (s.length > XLSX_TEKS_MAKS) s = s.slice(0, XLSX_TEKS_MAKS - 1) + '…';
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c === 9 || c === 10 || c === 13) { out += ch; continue; }
    if (c < 32 || (c >= 0xD800 && c <= 0xDFFF) || c === 0xFFFE || c === 0xFFFF) continue;
    if (ch === '&') out += '&amp;'; else if (ch === '<') out += '&lt;'; else if (ch === '>') out += '&gt;'; else if (ch === '"') out += '&quot;'; else if (ch === "'") out += '&apos;'; else out += ch;
  }
  return out;
}

function xlsxKolom(i) {
  let s = '';
  let n = i + 1;
  while (n > 0) { const sisa = (n - 1) % 26; s = String.fromCharCode(65 + sisa) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

function xlsxNamaLembar(nama, dipakai) {
  let n = String(nama === null || nama === undefined ? '' : nama).replace(/[\[\]:*?\/\\]/g, ' ').replace(/\s+/g, ' ').trim().replace(/^'+|'+$/g, '');
  if (!n) n = 'Lembar';
  n = n.slice(0, 31);
  let kandidat = n, k = 2;
  while (dipakai.indexOf(kandidat.toLowerCase()) !== -1) {
    const akhir = ' ' + k++;
    kandidat = n.slice(0, 31 - akhir.length) + akhir;
  }
  dipakai.push(kandidat.toLowerCase());
  return kandidat;
}

const XLSX_GAYA = { teks: 2, bulat: 3, desimal2: 4, desimal1: 5 };

function xlsxSel(ref, nilai, gaya) {
  if (nilai === null || nilai === undefined || nilai === '') return '';
  if (typeof nilai === 'number') {
    if (!isFinite(nilai)) return '';
    return '<c r="' + ref + '" s="' + gaya + '"><v>' + nilai + '</v></c>';
  }
  return '<c r="' + ref + '" s="' + gaya + '" t="inlineStr"><is><t xml:space="preserve">' + xlsxEsc(nilai) + '</t></is></c>';
}

function xlsxLembar(def) {
  const judul = def.judul || [];
  const kolom = def.kolom || [];
  const baris = def.baris || [];
  const catatan = def.catatan || [];
  const rows = [];
  let r = 0;
  judul.forEach(function (t, i) {
    r++;
    rows.push('<row r="' + r + '">' + xlsxSel('A' + r, t, i === 0 ? 6 : 8) + '</row>');
  });
  if (judul.length) r++;
  const barisKepala = r + 1;
  r++;
  rows.push('<row r="' + r + '" ht="30" customHeight="1">' + kolom.map(function (k, i) { return xlsxSel(xlsxKolom(i) + r, k.judul, 1); }).join('') + '</row>');
  baris.forEach(function (b) {
    r++;
    let sel = '';
    kolom.forEach(function (k, i) {
      const v = b[i];
      const tipe = k.tipe || 'teks';
      const gaya = XLSX_GAYA[tipe] || 2;
      sel += xlsxSel(xlsxKolom(i) + r, tipe === 'teks' && typeof v === 'number' ? String(v) : v, gaya);
    });
    rows.push('<row r="' + r + '">' + sel + '</row>');
  });
  for (let k = 0; k < (def.barisKosong || 0); k++) {
    r++;
    rows.push('<row r="' + r + '">' + kolom.map(function (kk, i) { return '<c r="' + xlsxKolom(i) + r + '" s="10"/>'; }).join('') + '</row>');
  }
  const barisAkhirTabel = r;
  if (catatan.length) r++;
  catatan.forEach(function (t) { r++; rows.push('<row r="' + r + '">' + xlsxSel('A' + r, t, 8) + '</row>'); });
  const hurufAkhir = xlsxKolom(Math.max(0, kolom.length - 1));
  const rentang = 'A' + barisKepala + ':' + hurufAkhir + Math.max(barisKepala, barisAkhirTabel);
  const cols = kolom.map(function (k, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + (k.lebar || 14) + '"' + (k.gayaKolom ? ' style="' + k.gayaKolom + '"' : '') + ' customWidth="1"/>'; }).join('');
  const xml = XLSX_XML + ''
    + '<worksheet xmlns="http:\/\/schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http:\/\/schemas.openxmlformats.org/officeDocument/2006/relationships">'
    + '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>'
    + '<dimension ref="A1:' + hurufAkhir + Math.max(1, r) + '"/>'
    + '<sheetViews><sheetView workbookViewId="0"' + (def.pilih ? ' tabSelected="1"' : '') + '><pane ySplit="' + barisKepala + '" topLeftCell="A' + (barisKepala + 1) + '" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A' + (barisKepala + 1) + '" sqref="A' + (barisKepala + 1) + '"/></sheetView></sheetViews>'
    + '<sheetFormatPr defaultRowHeight="15"/>'
    + (cols ? '<cols>' + cols + '</cols>' : '')
    + '<sheetData>' + rows.join('') + '</sheetData>'
    + (baris.length ? '<autoFilter ref="' + rentang + '"/>' : '')
    + '<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/>'
    + '<pageSetup paperSize="9" orientation="' + (def.arah === 'tegak' ? 'portrait' : 'landscape') + '" fitToWidth="1" fitToHeight="0"/>'
    + '</worksheet>';
  return { xml: xml, rentang: rentang, ada: baris.length > 0 };
}

const XLSX_STYLES = XLSX_XML + ''
  + '<styleSheet xmlns="http:\/\/schemas.openxmlformats.org/spreadsheetml/2006/main">'
  + '<numFmts count="1"><numFmt numFmtId="164" formatCode="0.0"/></numFmts>'
  + '<fonts count="5">'
  + '<font><sz val="11"/><name val="Calibri"/><family val="2"/></font>'
  + '<font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font>'
  + '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>'
  + '<font><b/><sz val="14"/><name val="Calibri"/><family val="2"/></font>'
  + '<font><i/><sz val="10"/><color rgb="FF595959"/><name val="Calibri"/><family val="2"/></font>'
  + '</fonts>'
  + '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'
  + '<fill><patternFill patternType="solid"><fgColor rgb="FF1E3A8A"/><bgColor indexed="64"/></patternFill></fill></fills>'
  + '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>'
  + '<border><left style="thin"><color rgb="FFBFBFBF"/></left><right style="thin"><color rgb="FFBFBFBF"/></right><top style="thin"><color rgb="FFBFBFBF"/></top><bottom style="thin"><color rgb="FFBFBFBF"/></bottom><diagonal/></border></borders>'
  + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
  + '<cellXfs count="11">'
  + '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
  + '<xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>'
  + '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'
  + '<xf numFmtId="1" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf>'
  + '<xf numFmtId="2" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf>'
  + '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf>'
  + '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
  + '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
  + '<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
  + '<xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
  + '<xf numFmtId="49" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>'
  + '</cellXfs>'
  + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
  + '</styleSheet>';

function xlsxBuat(lembarList, opsi) {
  const o = Object.assign({ judul: '', penulis: 'Siap TKA SD', waktu: new Date() }, opsi || {});
  const waktu = o.waktu instanceof Date && !isNaN(o.waktu) ? o.waktu : new Date();
  const enc = new TextEncoder();
  const dipakai = [];
  const daftar = (lembarList && lembarList.length ? lembarList : [{ nama: 'Lembar', kolom: [], baris: [] }]).map(function (def, i) {
    const nama = xlsxNamaLembar(def.nama, dipakai);
    const l = xlsxLembar(Object.assign({}, def, { pilih: i === 0 }));
    return { nama: nama, xml: l.xml, rentang: l.rentang, ada: l.ada };
  });
  const n = daftar.length;
  const bagian = [];
  bagian.push({ nama: '[Content_Types].xml', isi: XLSX_XML + '<Types xmlns="http:\/\/schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
    + daftar.map(function (l, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('')
    + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>' });
  bagian.push({ nama: '_rels/.rels', isi: XLSX_XML + '<Relationships xmlns="http:\/\/schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http:\/\/schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http:\/\/schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http:\/\/schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>' });
  const nama = function (s) { return xlsxEsc(s); };
  const kutip = function (s) { return "'" + String(s).replace(/'/g, "''") + "'"; };
  const definisi = daftar.map(function (l, i) {
    if (!l.ada) return '';
    const m = /^A(\d+):([A-Z]+)(\d+)$/.exec(l.rentang);
    return '<definedName name="_xlnm._FilterDatabase" localSheetId="' + i + '" hidden="1">' + nama(kutip(l.nama)) + '!$A$' + m[1] + ':$' + m[2] + '$' + m[3] + '</definedName>';
  }).join('');
  bagian.push({ nama: 'xl/workbook.xml', isi: XLSX_XML + '<workbook xmlns="http:\/\/schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http:\/\/schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView activeTab="0"/></bookViews><sheets>'
    + daftar.map(function (l, i) { return '<sheet name="' + nama(l.nama) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') + '</sheets>' + (definisi ? '<definedNames>' + definisi + '</definedNames>' : '') + '</workbook>' });
  bagian.push({ nama: 'xl/_rels/workbook.xml.rels', isi: XLSX_XML + '<Relationships xmlns="http:\/\/schemas.openxmlformats.org/package/2006/relationships">'
    + daftar.map(function (l, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http:\/\/schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('')
    + '<Relationship Id="rId' + (n + 1) + '" Type="http:\/\/schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' });
  bagian.push({ nama: 'xl/styles.xml', isi: XLSX_STYLES });
  daftar.forEach(function (l, i) { bagian.push({ nama: 'xl/worksheets/sheet' + (i + 1) + '.xml', isi: l.xml }); });
  const iso = waktu.toISOString().replace(/\.\d+Z$/, 'Z');
  bagian.push({ nama: 'docProps/core.xml', isi: XLSX_XML + '<cp:coreProperties xmlns:cp="http:\/\/schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http:\/\/purl.org/dc/elements/1.1/" xmlns:dcterms="http:\/\/purl.org/dc/terms/" xmlns:xsi="http:\/\/www.w3.org/2001/XMLSchema-instance"><dc:title>' + xlsxEsc(o.judul) + '</dc:title><dc:creator>' + xlsxEsc(o.penulis) + '</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">' + iso + '</dcterms:created></cp:coreProperties>' });
  bagian.push({ nama: 'docProps/app.xml', isi: XLSX_XML + '<Properties xmlns="http:\/\/schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Siap TKA SD</Application></Properties>' });
  return zipBuat(bagian.map(function (b) { return { nama: b.nama, data: enc.encode(b.isi) }; }), waktu);
}


const hnSt = { q: '', id_paket: '', mapel: '', sekolah: '', kelas: '', status: '', dari: '', sampai: '', nilai_min: '', nilai_maks: '', urut: 'selesai', halaman: 1, ukuran: 30, data: null, paket: [], seq: 0 };
const HN_STATUS = ['Selesai', 'Waktu habis'];
const HN_BATAS_ELIPSIS_TABEL = 240;

function hnKelasNilai(n) {
  if (typeof n !== 'number') return '';
  return n >= 75 ? 'lencana-sukses' : (n >= 50 ? 'lencana-peringatan' : 'lencana-bahaya');
}
function hnNilaiTeks(n) { return typeof n === 'number' ? formatAngka(n, 2) : '—'; }

function hnParam(ekstra) {
  const d = {};
  ['q', 'id_paket', 'mapel', 'sekolah', 'kelas', 'status', 'dari', 'sampai', 'nilai_min', 'nilai_maks'].forEach(function (k) { if (hnSt[k] !== '') d[k] = hnSt[k]; });
  if (hnSt.urut !== 'selesai') d.urut = hnSt.urut;
  if (ekstra && ekstra.ekspor) d.ekspor = true; else { d.halaman = hnSt.halaman; d.ukuran = hnSt.ukuran; }
  return d;
}
function hnAdaSaring() {
  return ['q', 'id_paket', 'mapel', 'sekolah', 'kelas', 'status', 'dari', 'sampai', 'nilai_min', 'nilai_maks'].some(function (k) { return hnSt[k] !== ''; });
}

function renderHasilNilai(p, c) {
  hnSt.halaman = 1;
  const admin = S.pengguna.peran === PERAN.ADMIN;
  pasang(c.wadah, h`
    ${kepalaHalaman('Hasil & Nilai', admin ? 'Hasil semua pengerjaan yang sudah selesai, dari akun siswa maupun peserta dengan kode.' : 'Hasil pengerjaan yang sudah selesai pada paket milik Anda, dari akun siswa maupun peserta dengan kode.')}
    <div class="saring-hasil" role="search">
      <div class="isian hn-cari"><label for="hn-cari">Cari nama</label><div class="cari">${ikon('search')}<input class="kontrol" id="hn-cari" type="search" placeholder="Nama peserta" value="${hnSt.q}" data-masuk="hn-saring" autocomplete="off"></div></div>
      <div class="isian hn-paket"><label for="hn-paket">Paket</label><select class="kontrol" id="hn-paket" data-masuk="hn-saring"><option value="">Semua paket</option></select></div>
      <div class="isian"><label for="hn-mapel">Mata pelajaran</label><select class="kontrol" id="hn-mapel" data-masuk="hn-saring"><option value="">Semua mapel</option>${MAPEL_URUT.map(function (k) { return h`<option value="${k}"${hnSt.mapel === k ? mentah(' selected') : ''}>${MAPEL[k]}</option>`; })}</select></div>
      <div class="isian"><label for="hn-sekolah">Sekolah</label><select class="kontrol" id="hn-sekolah" data-masuk="hn-saring"><option value="">Semua sekolah</option></select></div>
      <div class="isian"><label for="hn-kelas">Kelas</label><select class="kontrol" id="hn-kelas" data-masuk="hn-saring"><option value="">Semua kelas</option></select></div>
      <div class="isian"><label for="hn-status">Status</label><select class="kontrol" id="hn-status" data-masuk="hn-saring"><option value="">Semua</option>${HN_STATUS.map(function (k) { return h`<option value="${k}"${hnSt.status === k ? mentah(' selected') : ''}>${k}</option>`; })}</select></div>
      <div class="isian"><label for="hn-dari">Selesai dari tanggal</label><input class="kontrol" id="hn-dari" type="date" value="${hnSt.dari}" data-masuk="hn-saring"></div>
      <div class="isian"><label for="hn-sampai">Sampai tanggal</label><input class="kontrol" id="hn-sampai" type="date" value="${hnSt.sampai}" data-masuk="hn-saring"></div>
      <div class="isian"><label for="hn-nmin">Nilai minimal</label><input class="kontrol" id="hn-nmin" type="number" inputmode="decimal" min="0" max="100" step="any" value="${hnSt.nilai_min}" data-masuk="hn-saring"></div>
      <div class="isian"><label for="hn-nmaks">Nilai maksimal</label><input class="kontrol" id="hn-nmaks" type="number" inputmode="decimal" min="0" max="100" step="any" value="${hnSt.nilai_maks}" data-masuk="hn-saring"></div>
    </div>
    <div class="hn-bilah">
      <div class="baris-bungkus" id="hn-ringkas" aria-live="polite"></div>
      <div class="hn-kendali">
        <div class="isian hn-urut"><label for="hn-urut">Urutkan</label><select class="kontrol" id="hn-urut" data-masuk="hn-saring"><option value="selesai"${hnSt.urut === 'selesai' ? mentah(' selected') : ''}>Terbaru selesai</option><option value="nilai"${hnSt.urut === 'nilai' ? mentah(' selected') : ''}>Nilai tertinggi</option></select></div>
        <button type="button" class="tombol tombol-garis" data-aksi="hn-reset">${ikon('rotate-ccw')}<span>Atur ulang</span></button>
      </div>
    </div>
    <div id="hn-daftar"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat hasil…</span></div></div>
    <div id="hn-halaman" class="halaman-nav"></div>`);
  fokusJudul();
  panggil('paket.daftar', {}, { ulang: true }).then(function (d) {
    if (!c.ok()) return;
    hnSt.paket = d;
    const sel = el('#hn-paket');
    if (sel) pasang(sel, h`<option value="">Semua paket</option>${d.map(function (x) { return h`<option value="${x.id}"${hnSt.id_paket === x.id ? mentah(' selected') : ''}>${x.nama} (${MAPEL[x.mapel] || x.mapel})</option>`; })}`);
  }).catch(function () {   });
  muatHasilNilai(c.ok);
}

function hnIsiPilihan(id, semuaLabel, daftar, terpilih) {
  const sel = el('#' + id);
  if (!sel) return;
  const ada = daftar.indexOf(terpilih) !== -1;
  pasang(sel, h`<option value="">${semuaLabel}</option>${(ada || !terpilih ? daftar : daftar.concat([terpilih])).map(function (x) { return h`<option value="${x}"${x === terpilih ? mentah(' selected') : ''}>${x}</option>`; })}`);
}

function muatHasilNilai(ok) {
  const seq = ++hnSt.seq;
  return panggil('hasil.daftar', hnParam(), { ulang: true }).then(function (d) {
    if (seq !== hnSt.seq || (ok && !ok())) return;
    hnSt.data = d;
    hnIsiPilihan('hn-sekolah', 'Semua sekolah', d.opsi.sekolah, hnSt.sekolah);
    hnIsiPilihan('hn-kelas', 'Semua kelas', d.opsi.kelas, hnSt.kelas);
    gambarHasilNilai();
  }).catch(function (e) {
    if (seq !== hnSt.seq || (ok && !ok())) return;
    if (e && e.kode === 'VALIDASI') {
      pasang(el('#hn-daftar'), h`<div class="peringatan peringatan-waspada" role="alert" data-uji="hn-galat">${ikon('alert-triangle')}<div><p>${e.message}</p></div></div>`);
      pasang(el('#hn-ringkas'), '');
      pasang(el('#hn-halaman'), '');
      return;
    }
    tampilkanGalatMuat(el('#hn-daftar'), e, true);
  });
}

MASUKAN['hn-saring'] = tundaKe(function () {
  const ambil = function (id) { const x = el('#' + id); return x ? x.value.trim() : null; };
  const v = { q: ambil('hn-cari'), id_paket: ambil('hn-paket'), mapel: ambil('hn-mapel'), sekolah: ambil('hn-sekolah'), kelas: ambil('hn-kelas'), status: ambil('hn-status'),
    dari: ambil('hn-dari'), sampai: ambil('hn-sampai'), nilai_min: ambil('hn-nmin'), nilai_maks: ambil('hn-nmaks'), urut: ambil('hn-urut') };
  if (Object.keys(v).some(function (k) { return v[k] === null; })) return;
  Object.keys(v).forEach(function (k) { hnSt[k] = v[k]; });
  hnSt.halaman = 1;
  muatHasilNilai();
}, 300);

AKSI['hn-reset'] = function () {
  ['q', 'id_paket', 'mapel', 'sekolah', 'kelas', 'status', 'dari', 'sampai', 'nilai_min', 'nilai_maks'].forEach(function (k) { hnSt[k] = ''; });
  hnSt.urut = 'selesai'; hnSt.halaman = 1;
  const peta = { 'hn-cari': '', 'hn-paket': '', 'hn-mapel': '', 'hn-sekolah': '', 'hn-kelas': '', 'hn-status': '', 'hn-dari': '', 'hn-sampai': '', 'hn-nmin': '', 'hn-nmaks': '', 'hn-urut': 'selesai' };
  Object.keys(peta).forEach(function (id) { const x = el('#' + id); if (x) x.value = peta[id]; });
  muatHasilNilai();
};
AKSI['hn-halaman'] = function (b) { hnSt.halaman = Math.max(1, +b.getAttribute('data-ke')); muatHasilNilai(); };

function gambarHasilNilai() {
  const w = el('#hn-daftar');
  const d = hnSt.data;
  if (!w || !d) return;
  const r = d.ringkas;
  pasang(el('#hn-ringkas'), h`<span class="lencana lencana-primer">${ikon('users', 'ikon-sm')} Hasil: <span class="angka" data-uji="hn-jumlah">${formatAngka(r.jumlah)}</span></span>
    <span class="lencana lencana-primer">${ikon('bar-chart', 'ikon-sm')} Rata-rata: <span class="angka" data-uji="hn-rerata">${hnNilaiTeks(r.rerata)}</span></span>
    <span class="lencana lencana-sukses">${ikon('arrow-up', 'ikon-sm')} Tertinggi: <span class="angka" data-uji="hn-tertinggi">${hnNilaiTeks(r.tertinggi)}</span></span>
    <span class="lencana lencana-bahaya">${ikon('arrow-down', 'ikon-sm')} Terendah: <span class="angka" data-uji="hn-terendah">${hnNilaiTeks(r.terendah)}</span></span>`);
  if (!d.daftar.length) {
    const disaring = hnAdaSaring();
    pasang(w, h`<div class="kartu kosong"><span class="ikon-bulat netral">${ikon('trophy')}</span><h3>${disaring ? 'Tidak ada hasil yang cocok' : 'Belum ada hasil'}</h3><p>${disaring ? 'Ubah atau atur ulang penyaring untuk melihat yang lain.' : 'Hasil muncul di sini setelah ada peserta yang menyelesaikan ujian.'}</p></div>`);
    pasang(el('#hn-halaman'), '');
    return;
  }
  pasang(w, h`
    <div class="baris-bungkus jarak-bawah hn-aksi-unduh">
      <button type="button" class="tombol tombol-garis" data-aksi="hn-unduh-xlsx" data-uji="hn-unduh-xlsx">${ikon('download')}<span>Unduh Excel</span></button>
      <button type="button" class="tombol tombol-garis" data-aksi="hn-unduh-pdf" data-uji="hn-unduh-pdf">${ikon('file-text')}<span>Unduh PDF</span></button>
      <span class="bantu">Berisi semua ${formatAngka(d.total)} hasil sesuai penyaring${d.total > d.batasEkspor ? ', paling banyak ' + formatAngka(d.batasEkspor) + ' baris' : ''}.</span>
    </div>
    <div id="hn-unduh" aria-live="polite"></div>
    ${d.tanpaRincian ? h`<p class="bantu" data-uji="hn-tanpa-rincian">${formatAngka(d.tanpaRincian)} hasil pada halaman ini berasal dari versi lama dan tidak punya rincian per soal; nilainya tetap tampil.</p>` : ''}
    <div class="bungkus-tabel bt-rel"><table class="tabel hn-tabel"><caption class="sr-only">Daftar hasil dan nilai</caption>
      <thead><tr><th scope="col">Peserta</th><th scope="col">Kelas</th><th scope="col">Sekolah</th><th scope="col">Paket</th><th scope="col">Nilai</th><th scope="col" class="hn-th-hitung">Benar / Sebagian / Salah / Kosong</th><th scope="col">Durasi</th><th scope="col">Pindah tab</th><th scope="col">Selesai</th><th scope="col">Status</th><th scope="col"><span class="sr-only">Aksi</span></th></tr></thead>
      <tbody>${d.daftar.map(function (x) {
        const rinci = x.benar !== null;
        return h`<tr>
          <td data-label="Peserta" class="pecah"><div class="isi-sel"><div class="tebal">${x.nama}</div><div class="sub-sel">${x.jalur === 'Token' ? 'dengan kode' : 'akun siswa'}${x.nomorUrut > 1 ? ' · percobaan ke-' + x.nomorUrut : ''}</div></div></td>
          <td data-label="Kelas">${x.kelas || '—'}</td>
          <td data-label="Sekolah" class="pecah">${x.sekolah || '—'}</td>
          <td data-label="Paket" class="pecah"><div class="isi-sel"><div>${x.namaPaket}</div><div class="sub-sel">${MAPEL[x.mapel] || x.mapel}</div></div></td>
          <td data-label="Nilai" class="angka">${typeof x.nilai === 'number' ? h`<div class="isi-sel"><span class="lencana hn-nilai ${hnKelasNilai(x.nilai)}">${hnNilaiTeks(x.nilai)}</span><div class="sub-sel">${angkaSkor(x.skor)} / ${angkaSkor(x.skorMaks)}</div></div>` : '—'}</td>
          <td data-label="Benar / Sebagian / Salah / Kosong" class="angka">${rinci ? h`<div class="isi-sel"><span class="hn-hitung hn-b" title="Benar">${x.benar}</span> / <span class="hn-hitung hn-sb" title="Sebagian">${x.sebagian}</span> / <span class="hn-hitung hn-s" title="Salah">${x.salah}</span> / <span class="hn-hitung hn-k" title="Tidak dijawab">${x.kosong}</span></div>` : '—'}</td>
          <td data-label="Durasi" class="angka">${x.durasiDetik === null ? '—' : ekDurasi(x.durasiDetik)}</td>
          <td data-label="Pindah tab" class="angka">${x.pindahTab > 0 ? h`<span class="lencana lencana-peringatan">${x.pindahTab}</span>` : '0'}</td>
          <td data-label="Selesai" class="angka">${x.waktuSelesai ? h`<div class="isi-sel"><div>${ekWaktuAngka(x.waktuSelesai).split(' ')[0]}</div><div class="sub-sel">${ekWaktuAngka(x.waktuSelesai).split(' ')[1]} WIB</div></div>` : '—'}</td>
          <td data-label="Status"><span class="lencana ${KELAS_STATUS[x.status] || ''}">${x.status}</span></td>
          <td class="sel-aksi"><div class="aksi-sel"><button type="button" class="tombol tombol-diam tombol-adaptif" data-aksi="hn-detail" data-id="${x.id}" title="Rincian jawaban">${ikon('file-text')}<span class="teks-aksi">Rincian ${x.nama}</span></button></div></td></tr>`;
      })}</tbody></table></div>
    <p class="bantu jarak-atas">Warna nilai hanya penanda: hijau 75 ke atas, kuning 50 sampai 74,99, merah di bawah 50 (bukan batas kelulusan). Pindah tab = berapa kali peserta meninggalkan halaman ujian; hanya informasi.</p>`);
  const total = Math.max(1, Math.ceil(d.total / d.ukuran));
  pasang(el('#hn-halaman'), total <= 1 ? '' : h`<nav class="halaman-nav-dalam" aria-label="Halaman daftar hasil">
    <button type="button" class="tombol tombol-diam" data-aksi="hn-halaman" data-ke="${d.halaman - 1}"${d.halaman <= 1 ? mentah(' aria-disabled="true"') : ''}>${ikon('chevron-left')}<span>Sebelumnya</span></button>
    <span class="angka teks-redam">Halaman ${formatAngka(d.halaman)} dari ${formatAngka(total)}</span>
    <button type="button" class="tombol tombol-diam" data-aksi="hn-halaman" data-ke="${d.halaman + 1}"${d.halaman >= total ? mentah(' aria-disabled="true"') : ''}><span>Berikutnya</span>${ikon('chevron-right')}</button></nav>`);
}

function hnInfoSaring(f) {
  const out = [];
  if (f.q) out.push(['Nama memuat', f.q]);
  if (f.id_paket) { const p = hnSt.paket.filter(function (x) { return x.id === f.id_paket; })[0]; out.push(['Paket', p ? p.nama : f.id_paket]); }
  if (f.mapel) out.push(['Mata pelajaran', MAPEL[f.mapel] || f.mapel]);
  if (f.sekolah) out.push(['Sekolah', f.sekolah]);
  if (f.kelas) out.push(['Kelas', f.kelas]);
  if (f.status) out.push(['Status', f.status]);
  if (f.dari || f.sampai) out.push(['Selesai', (f.dari ? tanggalLahirTeks(f.dari) : 'awal') + ' s.d. ' + (f.sampai ? tanggalLahirTeks(f.sampai) : 'sekarang')]);
  if (f.nilai_min || f.nilai_maks) out.push(['Rentang nilai', (f.nilai_min || '0') + ' s.d. ' + (f.nilai_maks || '100')]);
  return out;
}

function hnPertanyaanTeks(b, panjang, panjangPernyataan) {
  let t = ekPotong(kayaTeks(b.pertanyaan), panjang);
  if (b.jenis !== 'PG' && !b.bentukBerubah && b.opsi && b.opsi.length) {
    t += '\n' + b.opsi.map(function (o, i) { return (i + 1) + ') ' + ekPotong(kayaTeks(o), panjangPernyataan); }).join('\n');
  }
  return t;
}
function hnJawabanTeks(b, panjang) {
  if (b.bentukBerubah) return { jawaban: '—', kunci: '—' };
  if (b.jenis === 'PG') {
    const ket = function (huruf) {
      if (!huruf) return null;
      const i = 'ABCD'.indexOf(huruf);
      return huruf + '. ' + ekPotong(kayaTeks(b.opsi[i]), panjang);
    };
    return { jawaban: ket(b.jawaban) || 'Tidak dijawab', kunci: ket(b.kunci) || '—' };
  }
  const idx = (b.opsi || []).map(function (o, i) { return i; });
  return {
    jawaban: idx.map(function (i) { return (i + 1) + ') ' + teksBS(jawabanPernyataan(b.jenis, b.jawaban, i)); }).join('\n'),
    kunci: idx.map(function (i) { return (i + 1) + ') ' + (b.kunci ? teksBS(b.kunci[i]) : '—'); }).join('\n')
  };
}
const HN_WARNA_STATUS = { benar: 'benar', sebagian: 'sebagian', salah: 'salah', kosong: 'redam' };
const HN_LABEL_STATUS_PENDEK = { benar: 'Benar', sebagian: 'Sebagian', salah: 'Salah', kosong: 'Tidak dijawab' };

function hnJudulPeserta(d) {
  const ps = d.peserta;
  return [ps.nama, ps.kelas, ps.sekolah].filter(Boolean).join(' · ');
}
function hnDurasiDetail(d) {
  const rg = d.ringkasan;
  const s = (hnMs(rg.waktuSelesai) - hnMs(rg.waktuMulai)) / 1000;
  return isFinite(s) && s >= 0 ? Math.round(s) : null;
}
function hnMs(iso) { return iso ? Date.parse(iso) : NaN; }

function htmlDetailHasil(d) {
  const rg = d.ringkasan, hs = d.hasil || {};
  const dur = hnDurasiDetail(d);
  const stat = function (nilai, label, uji) { return h`<div class="hn-stat"><strong class="angka" data-uji="${uji}">${nilai}</strong><span>${label}</span></div>`; };
  return h`<div class="hn-detail">
    <p class="teks-redam tanpa-margin">${rg.namaPaket} · ${MAPEL[rg.mapel] || rg.mapel} · selesai ${ekWaktuAngka(rg.waktuSelesai) || '—'} <span class="lencana ${KELAS_STATUS[rg.status] || ''}">${rg.status}</span></p>
    <div class="hn-statistik">
      ${stat(hs.nilaiTeks !== undefined ? hs.nilaiTeks : '—', 'Nilai', 'hnd-nilai')}
      ${stat(hs.skor !== undefined ? angkaSkor(hs.skor) + ' / ' + angkaSkor(hs.skorMaks) : '—', 'Skor', 'hnd-skor')}
      ${stat(dur === null ? '—' : ekDurasi(dur), 'Durasi', 'hnd-durasi')}
      ${stat(formatAngka(d.pindahTab) + '×', 'Pindah tab', 'hnd-pindah')}
    </div>
    ${hs.pesan ? h`<div class="peringatan">${ikon('info')}<div><p>${hs.pesan}</p></div></div>` : ''}
    ${hs.dihapus ? h`<p class="bantu" data-uji="catatan-dihapus">${formatAngka(hs.dihapus)} soal dihapus setelah dikerjakan, jadi tidak tampil di rincian. Nilai tetap sesuai hasil saat dikerjakan.</p>` : ''}
    ${hs.butir && hs.butir.length ? h`<div class="bungkus-tabel bt-rel"><table class="tabel hn-rinci"><caption class="sr-only">Rincian jawaban per soal</caption>
      <thead><tr><th scope="col">No</th><th scope="col">Pertanyaan</th><th scope="col">Jawaban siswa</th><th scope="col">Kunci</th><th scope="col">Skor</th><th scope="col">Status</th></tr></thead>
      <tbody>${hs.butir.map(function (b) {
        const jk = hnJawabanTeks(b, 60);
        return h`<tr>
          <td data-label="No" class="angka">${b.no}</td>
          <td data-label="Pertanyaan" class="pecah hn-pertanyaan"><span class="lencana lencana-primer hn-jenis">${LABEL_JENIS_PENDEK[b.jenis]}</span><div>${hnPertanyaanTeks(b, 200, 70)}</div>${b.diubah || b.bentukBerubah ? h`<div class="sub-sel">${b.bentukBerubah ? 'Jenis soal diubah setelah dikerjakan' : 'Soal diubah setelah dikerjakan'}</div>` : ''}</td>
          <td data-label="Jawaban siswa" class="pecah hn-teks-baris">${jk.jawaban}</td>
          <td data-label="Kunci" class="pecah hn-teks-baris">${jk.kunci}</td>
          <td data-label="Skor" class="angka">${angkaSkor(b.skor)}</td>
          <td data-label="Status"><span class="lencana ${KELAS_STATUS_BUTIR[b.status]}">${LABEL_STATUS_BUTIR[b.status]}</span></td></tr>`;
      })}</tbody></table></div>` : ''}
    <div id="hnd-unduh" aria-live="polite"></div>
  </div>`;
}

AKSI['hn-detail'] = function (b) {
  const id = b.getAttribute('data-id');
  panggil('percobaan.detail', { id: id }).then(function (d) {
    modal({
      judul: hnJudulPeserta(d), lebar: true, badan: htmlDetailHasil(d),
      aksi: [
        { id: 'tutup', label: 'Tutup', gaya: 'diam' },
        { id: 'xlsx', label: 'Unduh Excel', gaya: 'garis', onKlik: function (api, tombol) { hnUnduhDetail(tombol, d, 'xlsx'); } },
        { id: 'pdf', label: 'Unduh laporan PDF', gaya: 'utama', onKlik: function (api, tombol) { hnUnduhDetail(tombol, d, 'pdf'); } }
      ]
    });
  }).catch(gagalUmum);
};

function hnUnduhDetail(tombol, d, jenis) {
  const wadah = el('#hnd-unduh');
  pasang(wadah, '');
  kerjakan(tombol, function () {
    return new Promise(function (selesai) { setTimeout(selesai, 0); }).then(function () {
      const bytes = jenis === 'pdf' ? hnPdfDetail(d) : hnXlsxDetail(d);
      ekLapor(wadah, ekNamaBerkas(['hasil', d.peserta.nama, d.ringkasan.namaPaket], jenis), bytes, jenis === 'pdf' ? 'application/pdf' : XLSX_TIPE);
    });
  }).catch(function (e) { ekLaporGalat(wadah, e); });
}

function hnPdfDetail(d) {
  const ps = d.peserta, rg = d.ringkasan, hs = d.hasil || {};
  const dur = hnDurasiDetail(d);
  const dok = pdfBuat({ judul: 'Laporan hasil: ' + ps.nama + ' · ' + rg.namaPaket, penulis: ekPenulis(), arah: 'tegak', kaki: namaApp() + ' · Laporan hasil pengerjaan · dibuat ' + ekWaktuCetak() });
  dok.judul('Laporan Hasil Pengerjaan');
  dok.teks(namaApp() + ' · dibuat ' + ekWaktuCetak(), { ukuran: 9, warna: PDF_WARNA.redam, jarakBawah: 6 });
  const pasangan = [['Nama peserta', ps.nama], ['Sekolah', ps.sekolah || '-'], ['Kelas', ps.kelas || '-']];
  if (ps.username) pasangan.push(['Username', ps.username]);
  pasangan.push(['Jalur', ps.jalur === 'Token' ? 'Dengan kode (tanpa akun)' : 'Akun siswa'], ['Paket', rg.namaPaket], ['Mata pelajaran', (MAPEL[rg.mapel] || rg.mapel) + ' · ' + rg.kategori],
    ['Percobaan ke', String(rg.nomorUrut)], ['Mulai', ekWaktuAngka(rg.waktuMulai) + ' WIB'], ['Selesai', (ekWaktuAngka(rg.waktuSelesai) || '-') + ' WIB'], ['Status', rg.status]);
  dok.pasangan(pasangan, { kolom: 3 });
  dok.kotakAngka([['Nilai', hs.nilaiTeks !== undefined ? hs.nilaiTeks : '-'], ['Skor', hs.skor !== undefined ? angkaSkor(hs.skor) + ' / ' + angkaSkor(hs.skorMaks) : '-'], ['Durasi', dur === null ? '-' : ekDurasi(dur)], ['Pindah tab', formatAngka(d.pindahTab) + 'x']]);
  if (hs.hitung) dok.teks('Benar ' + hs.hitung.benar + ' · Sebagian ' + hs.hitung.sebagian + ' · Salah ' + hs.hitung.salah + ' · Tidak dijawab ' + hs.hitung.kosong, { ukuran: 9.5, tebal: true, jarakBawah: 8 });
  if (hs.pesan) dok.teks(hs.pesan, { ukuran: 9, warna: PDF_WARNA.redam });
  if (hs.butir && hs.butir.length) {
    dok.tabel({
      ukuran: 8.5, maksBaris: 9,
      kolom: [{ judul: 'No', lebar: 0.8, rata: 'kanan' }, { judul: 'Jenis', lebar: 1.5 }, { judul: 'Pertanyaan', lebar: 6 }, { judul: 'Jawaban siswa', lebar: 3.4 }, { judul: 'Kunci', lebar: 3.4 }, { judul: 'Skor', lebar: 1, rata: 'kanan' }, { judul: 'Status', lebar: 1.9 }],
      baris: hs.butir.map(function (b) {
        const jk = hnJawabanTeks(b, 70);
        return [b.no, LABEL_JENIS_PENDEK[b.jenis], hnPertanyaanTeks(b, 220, 80) + (b.bentukBerubah ? '\n(jenis soal diubah setelah dikerjakan)' : (b.diubah ? '\n(soal diubah setelah dikerjakan)' : '')), jk.jawaban, jk.kunci, angkaSkor(b.skor),
          { t: HN_LABEL_STATUS_PENDEK[b.status], tebal: true, warna: PDF_WARNA[HN_WARNA_STATUS[b.status]] }];
      })
    });
  }
  if (hs.dihapus) dok.teks(formatAngka(hs.dihapus) + ' soal dihapus setelah dikerjakan sehingga tidak tampil di rincian. Nilai tetap sesuai hasil saat dikerjakan.', { ukuran: 8.5, warna: PDF_WARNA.redam });
  dok.teks('Teks bacaan dan gambar pada soal tidak dicetak di laporan ini. Pindah tab = berapa kali peserta meninggalkan halaman ujian; hanya informasi, bukan bukti kecurangan.', { ukuran: 8, warna: PDF_WARNA.redam });
  return dok.selesai();
}

function hnXlsxDetail(d) {
  const ps = d.peserta, rg = d.ringkasan, hs = d.hasil || {};
  const dur = hnDurasiDetail(d);
  const ringkas = [['Laporan', 'Hasil pengerjaan satu peserta'], ['Dibuat', ekWaktuCetak()], ['Nama peserta', ps.nama], ['Sekolah', ps.sekolah || ''], ['Kelas', ps.kelas || '']];
  if (ps.username) ringkas.push(['Username', ps.username]);
  ringkas.push(['Jalur', ps.jalur === 'Token' ? 'Dengan kode (tanpa akun)' : 'Akun siswa'], ['Paket', rg.namaPaket], ['Mata pelajaran', MAPEL[rg.mapel] || rg.mapel], ['Kategori', rg.kategori],
    ['Percobaan ke', rg.nomorUrut], ['Mulai (WIB)', ekWaktuAngka(rg.waktuMulai)], ['Selesai (WIB)', ekWaktuAngka(rg.waktuSelesai)], ['Status', rg.status],
    ['Nilai', typeof hs.nilai === 'number' ? hs.nilai : ''], ['Skor', typeof hs.skor === 'number' ? hs.skor : ''], ['Skor maksimum', typeof hs.skorMaks === 'number' ? hs.skorMaks : ''],
    ['Durasi (detik)', dur === null ? '' : dur], ['Pindah tab', d.pindahTab], ['Koneksi terputus', d.putus]);
  if (hs.hitung) ringkas.push(['Benar', hs.hitung.benar], ['Sebagian', hs.hitung.sebagian], ['Salah', hs.hitung.salah], ['Tidak dijawab', hs.hitung.kosong]);
  const lembar = [{
    nama: 'Ringkasan', kolom: [{ judul: 'Keterangan', lebar: 26 }, { judul: 'Isi', lebar: 46, tipe: 'teks' }],
    baris: ringkas.map(function (r) { return [r[0], typeof r[1] === 'number' ? String(r[1]).replace('.', ',') : r[1]]; }), arah: 'tegak'
  }];
  if (hs.butir && hs.butir.length) {
    lembar.push({
      nama: 'Rincian', arah: 'datar',
      kolom: [{ judul: 'No', lebar: 6, tipe: 'bulat' }, { judul: 'Jenis', lebar: 14 }, { judul: 'Pertanyaan', lebar: 60 }, { judul: 'Jawaban siswa', lebar: 34 }, { judul: 'Kunci', lebar: 34 }, { judul: 'Skor', lebar: 8, tipe: 'desimal1' }, { judul: 'Status', lebar: 14 }],
      baris: hs.butir.map(function (b) { const jk = hnJawabanTeks(b, 200); return [b.no, LABEL_JENIS_PENDEK[b.jenis], hnPertanyaanTeks(b, 600, 200), jk.jawaban, jk.kunci, b.skor, HN_LABEL_STATUS_PENDEK[b.status]]; })
    });
  }
  return xlsxBuat(lembar, { judul: 'Hasil ' + ps.nama + ' · ' + rg.namaPaket, penulis: ekPenulis() });
}

AKSI['hn-unduh-xlsx'] = function (b) { hnUnduhDaftar(b, 'xlsx'); };
AKSI['hn-unduh-pdf'] = function (b) { hnUnduhDaftar(b, 'pdf'); };

function hnUnduhDaftar(tombol, jenis) {
  const wadah = el('#hn-unduh');
  pasang(wadah, '');
  const f = {};
  ['q', 'id_paket', 'mapel', 'sekolah', 'kelas', 'status', 'dari', 'sampai', 'nilai_min', 'nilai_maks'].forEach(function (k) { f[k] = hnSt[k]; });
  kerjakan(tombol, function () {
    return panggil('hasil.daftar', hnParam({ ekspor: true }), { ulang: true }).then(function (d) {
      const bytes = jenis === 'pdf' ? hnPdfDaftar(d, f) : hnXlsxDaftar(d, f);
      ekLapor(wadah, ekNamaBerkas(['hasil-nilai'], jenis), bytes, jenis === 'pdf' ? 'application/pdf' : XLSX_TIPE);
    });
  }).catch(function (e) { ekLaporGalat(wadah, e); });
}

function hnPdfDaftar(d, f) {
  const r = d.ringkas;
  const dok = pdfBuat({ judul: 'Hasil & Nilai', penulis: ekPenulis(), arah: 'datar', kaki: namaApp() + ' · Hasil & Nilai · dibuat ' + ekWaktuCetak() });
  dok.judul('Hasil & Nilai');
  dok.teks(namaApp() + ' · dibuat ' + ekWaktuCetak(), { ukuran: 9, warna: PDF_WARNA.redam, jarakBawah: 6 });
  const info = hnInfoSaring(f);
  dok.pasangan(info.length ? info : [['Penyaring', 'Tanpa penyaring (semua hasil yang dapat Anda lihat)']], { kolom: 3 });
  dok.kotakAngka([['Jumlah hasil', formatAngka(r.jumlah)], ['Rata-rata nilai', hnNilaiTeks(r.rerata)], ['Nilai tertinggi', hnNilaiTeks(r.tertinggi)], ['Nilai terendah', hnNilaiTeks(r.terendah)]]);
  if (d.dipotong) dok.teks('Laporan ini memuat ' + formatAngka(d.daftar.length) + ' dari ' + formatAngka(d.total) + ' hasil (batas ' + formatAngka(d.batasEkspor) + '). Persempit penyaring untuk mendapatkan sisanya.', { ukuran: 9, tebal: true, warna: PDF_WARNA.salah });
  dok.tabel({
    ukuran: 8, maksBaris: 4,
    kolom: [{ judul: 'No', lebar: 0.7, rata: 'kanan' }, { judul: 'Peserta', lebar: 3.2 }, { judul: 'Kelas', lebar: 1 }, { judul: 'Sekolah', lebar: 2.6 }, { judul: 'Paket', lebar: 3.6 }, { judul: 'Nilai', lebar: 1.2, rata: 'kanan' },
      { judul: 'Skor', lebar: 1.4, rata: 'kanan' }, { judul: 'B / Sb / S / K', lebar: 2, rata: 'tengah' }, { judul: 'Durasi', lebar: 1.8 }, { judul: 'Pindah tab', lebar: 1, rata: 'kanan' }, { judul: 'Selesai', lebar: 2.3 }, { judul: 'Status', lebar: 1.5 }],
    baris: d.daftar.map(function (x, i) {
      return [(d.halaman - 1) * d.ukuran + i + 1, x.nama, x.kelas || '-', x.sekolah || '-', x.namaPaket + ' · ' + (MAPEL[x.mapel] || x.mapel),
        { t: hnNilaiTeks(x.nilai), tebal: true, rata: 'kanan' }, typeof x.skor === 'number' ? angkaSkor(x.skor) + ' / ' + angkaSkor(x.skorMaks) : '-',
        x.benar === null ? '-' : x.benar + ' / ' + x.sebagian + ' / ' + x.salah + ' / ' + x.kosong, x.durasiDetik === null ? '-' : ekDurasi(x.durasiDetik), x.pindahTab, ekWaktuAngka(x.waktuSelesai) || '-', x.status];
    })
  });
  dok.teks('B = benar, Sb = sebagian, S = salah, K = tidak dijawab. Pindah tab = berapa kali peserta meninggalkan halaman ujian; hanya informasi, bukan bukti kecurangan.', { ukuran: 8, warna: PDF_WARNA.redam });
  return dok.selesai();
}

function hnXlsxDaftar(d, f) {
  const r = d.ringkas;
  const info = hnInfoSaring(f);
  const ringkas = [['Laporan', 'Hasil & Nilai'], ['Dibuat', ekWaktuCetak()], ['Dibuat oleh', ekPenulis()]]
    .concat(info.length ? info : [['Penyaring', 'Tanpa penyaring']])
    .concat([['Jumlah hasil', String(r.jumlah)], ['Rata-rata nilai', hnNilaiTeks(r.rerata)], ['Nilai tertinggi', hnNilaiTeks(r.tertinggi)], ['Nilai terendah', hnNilaiTeks(r.terendah)]]);
  if (d.dipotong) ringkas.push(['Catatan', 'Hanya ' + formatAngka(d.daftar.length) + ' dari ' + formatAngka(d.total) + ' hasil yang dimuat (batas ' + formatAngka(d.batasEkspor) + ').']);
  return xlsxBuat([
    {
      nama: 'Hasil & Nilai', arah: 'datar',
      kolom: [{ judul: 'No', lebar: 6, tipe: 'bulat' }, { judul: 'Peserta', lebar: 28 }, { judul: 'Jalur', lebar: 12 }, { judul: 'Kelas', lebar: 8 }, { judul: 'Sekolah', lebar: 24 }, { judul: 'Paket', lebar: 30 }, { judul: 'Mata pelajaran', lebar: 18 },
        { judul: 'Kategori', lebar: 16 }, { judul: 'Percobaan ke', lebar: 10, tipe: 'bulat' }, { judul: 'Nilai', lebar: 9, tipe: 'desimal2' }, { judul: 'Skor', lebar: 8, tipe: 'desimal1' }, { judul: 'Skor maksimum', lebar: 10, tipe: 'desimal1' },
        { judul: 'Benar', lebar: 8, tipe: 'bulat' }, { judul: 'Sebagian', lebar: 9, tipe: 'bulat' }, { judul: 'Salah', lebar: 8, tipe: 'bulat' }, { judul: 'Tidak dijawab', lebar: 11, tipe: 'bulat' }, { judul: 'Durasi (detik)', lebar: 10, tipe: 'bulat' }, { judul: 'Durasi', lebar: 14 },
        { judul: 'Pindah tab', lebar: 9, tipe: 'bulat' }, { judul: 'Koneksi terputus', lebar: 11, tipe: 'bulat' }, { judul: 'Mulai (WIB)', lebar: 17 }, { judul: 'Selesai (WIB)', lebar: 17 }, { judul: 'Status', lebar: 12 }],
      baris: d.daftar.map(function (x, i) {
        return [(d.halaman - 1) * d.ukuran + i + 1, x.nama, x.jalur === 'Token' ? 'Dengan kode' : 'Akun siswa', x.kelas || '', x.sekolah || '', x.namaPaket, MAPEL[x.mapel] || x.mapel, x.kategori, x.nomorUrut,
          typeof x.nilai === 'number' ? x.nilai : null, typeof x.skor === 'number' ? x.skor : null, typeof x.skorMaks === 'number' ? x.skorMaks : null, x.benar, x.sebagian, x.salah, x.kosong,
          x.durasiDetik, x.durasiDetik === null ? '' : ekDurasi(x.durasiDetik), x.pindahTab, x.putus, ekWaktuAngka(x.waktuMulai), ekWaktuAngka(x.waktuSelesai), x.status];
      })
    },
    { nama: 'Ringkasan', arah: 'tegak', kolom: [{ judul: 'Keterangan', lebar: 24 }, { judul: 'Isi', lebar: 56 }], baris: ringkas }
  ], { judul: 'Hasil & Nilai', penulis: ekPenulis() });
}


let pgAsli = null;

function renderPengaturan(p, c) {
  Promise.all([panggil('pengaturan.ambil', {}, { ulang: true }), panggil('sekolah.daftar', { semua: true }, { ulang: true })]).then(function (hasil) {
    if (!c.ok()) return;
    pgAsli = hasil[0].pengaturan;
    const g = pgAsli;
    pasang(c.wadah, h`
      ${kepalaHalaman('Pengaturan', 'Identitas aplikasi dan daftar sekolah. Aturan skor tidak dapat diubah dari sini.')}
      <div class="profil-kisi">
        <div class="kolom">
          <section class="kartu" aria-labelledby="h-ident-app"><div class="kartu-judul"><span class="ikon-bulat">${ikon('settings')}</span><h3 id="h-ident-app">Identitas aplikasi</h3></div>
            <form id="f-pengaturan" data-kirim="pengaturan-simpan" novalidate>
              <div data-galat aria-live="polite"></div>
              <div class="isian"><label for="pg-nama">Nama aplikasi</label><input class="kontrol" id="pg-nama" name="nama_aplikasi" type="text" maxlength="60" required value="${g.nama_aplikasi}"></div>
              <div class="isian"><label for="pg-logo">Tautan logo <span class="opsional">(opsional)</span></label><input class="kontrol" id="pg-logo" name="logo" type="url" maxlength="500" inputmode="url" placeholder="https:&#47;&#47;…" value="${g.logo}" aria-describedby="pg-logo-b"><p class="bantu" id="pg-logo-b">Harus diawali https:&#47;&#47;. Kosongkan untuk memakai ikon bawaan.</p></div>
              <div class="isian"><span class="label" id="pg-warna-l">Warna dominan</span>
                <fieldset class="fieldset-polos jarak-bawah" data-uji="pg-preset"><legend class="bantu">Pilihan cepat</legend>
                  <div class="preset-warna">${WARNA_PRESET.map(function (p) {
                    return h`<label class="preset"><input type="radio" name="pg-preset" value="${p.warna}" data-masuk="pg-warna-preset" data-uji="pg-preset-${p.id}"><span class="preset-kotak" data-warna="${p.warna}" aria-hidden="true"></span><span class="preset-nama">${p.nama}</span></label>`;
                  })}</div></fieldset>
                <div class="warna-baris" role="group" aria-labelledby="pg-warna-l">
                  <input class="kontrol" type="color" id="pg-warna-pilih" aria-label="Pilih warna sendiri" value="${(g.warna_dominan || '#005EA4').toLowerCase()}" data-masuk="pg-warna-pilih">
                  <input class="kontrol" type="text" id="pg-warna" name="warna_dominan" maxlength="7" aria-label="Kode warna heksadesimal" value="${g.warna_dominan}" data-masuk="pg-warna-teks" autocomplete="off" spellcheck="false">
                  <span class="contoh-warna" id="pg-warna-contoh" aria-hidden="true">Contoh tombol</span></div>
                <p class="bantu" id="pg-warna-info" aria-live="polite"></p>
                <div class="pt-kisi" data-uji="pg-pratinjau">${['terang', 'gelap'].map(function (m) {
                  return h`<figure class="pt-panel" data-pt="${m}" data-uji="pg-pt-${m}"><div class="pt-bingkai" aria-hidden="true">
                      <div class="pt-sisi"><span class="pt-menu pt-menu-aktif">Beranda</span><span class="pt-menu">Paket</span></div>
                      <div class="pt-isi"><div class="pt-judul">Judul halaman</div><p class="pt-teks">Teks biasa dan <span class="pt-aksen">teks aksen</span></p>
                        <div class="pt-baris"><span class="pt-tombol">Tombol utama</span><span class="pt-lembut">Terpilih</span></div></div></div>
                    <figcaption>Tema ${m}</figcaption></figure>`;
                })}</div>
                <p class="bantu" id="pg-pt-ringkas" aria-live="polite" data-uji="pg-pt-ringkas"></p></div>
              <div class="isian"><label for="pg-kontak">Kontak <span class="opsional">(tampil di kaki beranda)</span></label><input class="kontrol" id="pg-kontak" name="kontak" type="text" maxlength="200" value="${g.kontak}" placeholder="Contoh: admin@sekolah.sch.id atau 0812…"></div>
              <div class="isian"><label for="pg-jeda">Jeda simpan otomatis (detik)</label><input class="kontrol angka" id="pg-jeda" name="jeda_autosave_detik" type="number" min="10" max="60" step="1" inputmode="numeric" required value="${g.jeda_autosave_detik}" aria-describedby="pg-jeda-b"><p class="bantu" id="pg-jeda-b">10–60 detik. Dipakai saat siswa mengerjakan paket (Tahap 2).</p></div>
              <div class="aksi-form"><button type="submit" class="tombol">${ikon('save')}<span>Simpan pengaturan</span></button></div>
            </form></section>
        </div>
        <div class="kolom">
          <section class="kartu" aria-labelledby="h-sekolah"><div class="kartu-judul"><span class="ikon-bulat">${ikon('home')}</span><h3 id="h-sekolah">Daftar sekolah</h3></div>
            <p class="bantu">Menjadi saran saat siswa mengisi “asal sekolah”. Siswa tetap boleh mengetik sekolah lain.</p>
            <form data-kirim="sekolah-tambah" class="baris-bungkus rata-atas" novalidate>
              <div class="isian lentur"><label class="sr-only" for="sk-nama">Nama sekolah baru</label><input class="kontrol" id="sk-nama" name="nama" type="text" maxlength="100" placeholder="Nama sekolah baru" autocomplete="off"></div>
              <button type="submit" class="tombol tombol-garis">${ikon('plus')}<span>Tambah</span></button>
            </form>
            <div id="sk-daftar" class="jarak-atas">${daftarSekolahAdmin(hasil[1])}</div></section>
          <section class="kartu" aria-labelledby="h-media"><div class="kartu-judul"><span class="ikon-bulat">${ikon('image')}</span><h3 id="h-media">Gambar soal</h3></div>
            <p class="bantu">Gambar soal disimpan di Drive (folder TKA-MEDIA) dengan tautan “siapa pun yang punya tautan”. Siapa pun yang memegang tautannya dapat membukanya, jadi jangan unggah gambar yang bersifat rahasia.</p>
            <p class="bantu">Pola alamat tampil saat ini: <strong id="md-pola-skrg">${g.media_url_pola || 'thumbnail'}</strong></p>
            <div class="aksi-form"><button type="button" class="tombol tombol-garis" data-aksi="media-diagnosa">${ikon('image')}<span>Uji tampil gambar</span></button></div></section>
          ${htmlKartuPdfPengaturan(g)}
          ${htmlKartuVideoPengaturan(g)}
          <section class="kartu" aria-labelledby="h-skor"><div class="kartu-judul"><span class="ikon-bulat netral">${ikon('lock')}</span><h3 id="h-skor">Aturan skor (terkunci)</h3></div>
            <ul class="aturan-terkunci"><li><strong>Pilihan ganda:</strong> benar = 1, salah atau kosong = 0.</li>
              <li><strong>MCMA dan Benar–Salah (3 pernyataan):</strong> 3 posisi cocok = 1, 1–2 cocok = 0,5, 0 cocok = 0. Jawaban seragam (BBB/SSS) = 0.</li>
              <li><strong>Nilai akhir:</strong> (skor ÷ skor maksimum) × 100, dibulatkan ke 2 desimal, ditulis dengan koma.</li></ul>
            <p class="bantu jarak-atas">Aturan ini (versi skor-v1) dikunci di kode aplikasi supaya nilai antar-paket dan antar-waktu tetap dapat dibandingkan. Tidak ada layar yang dapat mengubahnya.</p></section>
        </div>
      </div>`);
    infoWarna();
    fokusJudul();
  }).catch(function (e) { if (c.ok()) tampilkanGalatMuat(c.wadah, e, true); });
}

function daftarSekolahAdmin(daftar) {
  if (!daftar || !daftar.length) return h`<p class="teks-redam tanpa-margin">Belum ada sekolah di daftar.</p>`;
  return h`<ul class="daftar-sekolah">${daftar.map(function (s) {
    return h`<li><span class="nama">${s.nama}</span><span class="lencana ${s.aktif ? 'lencana-sukses' : ''}">${s.aktif ? 'Aktif' : 'Nonaktif'}</span>
      <button type="button" class="tombol tombol-diam tombol-adaptif" data-aksi="sekolah-aktif" data-id="${s.id}" data-ke="${s.aktif ? '0' : '1'}" aria-label="${s.aktif ? 'Nonaktifkan' : 'Aktifkan'} ${s.nama}">${ikon(s.aktif ? 'slash' : 'check')}<span class="teks-aksi">${s.aktif ? 'Nonaktifkan' : 'Aktifkan'}</span></button></li>`;
  })}</ul>`;
}
function muatSekolahAdmin() {
  return panggil('sekolah.daftar', { semua: true }).then(function (d) { const w = el('#sk-daftar'); if (w) pasang(w, daftarSekolahAdmin(d)); }).catch(gagalUmum);
}
KIRIM['sekolah-tambah'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  if (!v.nama || v.nama.length < 3) { galatIsian(form, 'nama', 'Nama sekolah minimal 3 karakter.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('sekolah.tambah', { nama: v.nama }).then(function () { form.reset(); toast('Sekolah ditambahkan.', 'sukses'); return muatSekolahAdmin(); });
  }).catch(function (e) { if (e.kode === 'DUPLIKAT' || e.kode === 'VALIDASI') galatIsian(form, 'nama', e.message); else gagalUmum(e); })
    .then(function () { form.removeAttribute('data-sibuk'); });
};
AKSI['sekolah-aktif'] = function (b) {
  panggil('sekolah.setAktif', { id: b.getAttribute('data-id'), aktif: b.getAttribute('data-ke') === '1' }).then(muatSekolahAdmin).catch(gagalUmum);
};

function infoWarna() {
  const t = el('#pg-warna'), i = el('#pg-warna-info'), cth = el('#pg-warna-contoh');
  if (!t || !i) return;
  const w = t.value.trim().toUpperCase();
  const valid = /^#[0-9A-F]{6}$/.test(w);
  tandaiPreset(valid ? w : '');
  if (!valid) { i.textContent = 'Tulis kode warna 6 digit, contoh #005EA4.'; i.className = 'bantu'; if (cth) cth.style.background = ''; pratinjauTema(''); return; }
  const k = kontras(w, '#FFFFFF');
  if (cth) cth.style.background = w;
  if (k >= 4.5) { i.textContent = 'Kontras dengan teks putih ' + formatAngka(k, 1) + ' : 1 — memenuhi syarat keterbacaan (minimal 4,5 : 1).'; i.className = 'bantu status-kunci ok'; }
  else { i.textContent = 'Kontras dengan teks putih hanya ' + formatAngka(k, 1) + ' : 1 (minimal 4,5 : 1). Pilih warna yang lebih gelap.'; i.className = 'bantu status-kunci salah'; }
  pratinjauTema(w);
}

function tandaiPreset(w) {
  semua('.preset input[type="radio"]').forEach(function (r) { r.checked = !!w && r.value.toUpperCase() === w; });
  semua('.preset-kotak').forEach(function (k) { k.style.background = k.getAttribute('data-warna'); });
}

const PT_TETAP = { terang: { teks: '#0F172A', tepi: '#E2E8F0' }, gelap: { teks: '#E8EEF8', tepi: '#26354F' } };
function pratinjauTema(w) {
  const ringkas = el('#pg-pt-ringkas');
  const tema = w ? turunkanTema(w) : null;
  const sah = !!(tema && tema.ok);
  semua('.pt-panel').forEach(function (panel) {
    const m = panel.getAttribute('data-pt');
    panel.classList.toggle('pt-mati', !sah);
    if (!sah) return;
    const t = tema[m], perm = WARNA_PERMUKAAN[m], tetap = PT_TETAP[m];
    const set = {
      '--pt-bg': perm.bg, '--pt-kartu': perm.surface, '--pt-teks': tetap.teks, '--pt-tepi': tetap.tepi,
      '--pt-utama': t.primary, '--pt-di-utama': t['on-primary'], '--pt-aksen': t['primary-text'],
      '--pt-lembut': t['primary-soft'], '--pt-di-lembut': t['on-primary-soft'],
      '--pt-sisi': t['sidebar-bg'], '--pt-sisi-teks': t['sidebar-text'], '--pt-sisi-aktif': t['sidebar-active-bg'], '--pt-sisi-aktif-teks': t['sidebar-active-text']
    };
    Object.keys(set).forEach(function (k) { panel.style.setProperty(k, set[k]); });
  });
  if (!ringkas) return;
  if (!sah) {
    ringkas.textContent = tema ? 'Pratinjau belum tersedia. ' + tema.pesan : 'Pratinjau tema terang dan gelap muncul setelah kode warna sah.';
    ringkas.className = 'bantu';
    return;
  }
  const r = ringkasKeterbacaan(tema);
  ringkas.textContent = r.teks;
  ringkas.className = r.ok ? 'bantu status-kunci ok' : 'bantu status-kunci salah';
}
MASUKAN['pg-warna-preset'] = function (inp) {
  const w = String(inp.value || '').toUpperCase();
  const t = el('#pg-warna'), p = el('#pg-warna-pilih');
  if (t) t.value = w;
  if (p) p.value = w.toLowerCase();
  infoWarna();
};
MASUKAN['pg-warna-pilih'] = function (inp) { const t = el('#pg-warna'); if (t) { t.value = inp.value.toUpperCase(); infoWarna(); } };
MASUKAN['pg-warna-teks'] = function (inp) {
  const w = inp.value.trim();
  const p = el('#pg-warna-pilih');
  if (p && /^#[0-9A-Fa-f]{6}$/.test(w)) p.value = w.toLowerCase();
  infoWarna();
};

KIRIM['pengaturan-simpan'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  if (!v.nama_aplikasi || v.nama_aplikasi.length < 2) { galatIsian(form, 'nama_aplikasi', 'Nama aplikasi minimal 2 karakter.'); return; }
  if (v.logo && !urlHttps(v.logo)) { galatIsian(form, 'logo', 'Tautan logo harus diawali https:\/\/ dan tanpa spasi.'); return; }
  if (!/^#[0-9A-Fa-f]{6}$/.test(v.warna_dominan)) { galatIsian(form, 'warna_dominan', 'Kode warna harus 6 digit heksadesimal, contoh #005EA4.'); return; }
  const jeda = parseInt(v.jeda_autosave_detik, 10);
  if (!(jeda >= 10 && jeda <= 60)) { galatIsian(form, 'jeda_autosave_detik', 'Jeda harus 10–60 detik.'); return; }
  const baru = { nama_aplikasi: v.nama_aplikasi, logo: v.logo, warna_dominan: v.warna_dominan.toUpperCase(), kontak: v.kontak, jeda_autosave_detik: String(jeda) };
  const berubah = Object.keys(baru).filter(function (k) { return String(baru[k]) !== String(pgAsli[k]); });
  if (!berubah.length) { toast('Tidak ada perubahan untuk disimpan.', 'info'); return; }
  form.setAttribute('data-sibuk', 'ya');
  const gagal = [];
  kerjakan(tombolKirim(form), function () {
    let rantai = Promise.resolve();
    berubah.forEach(function (k) {
      rantai = rantai.then(function () {
        return panggil('pengaturan.simpan', { kunci: k, nilai: baru[k] }).then(function () { pgAsli[k] = baru[k]; }, function (e) { gagal.push({ k: k, e: e }); });
      });
    });
    return rantai.then(function () { return muatInfo(); });
  }).then(function () {
    if (gagal.length) {
      gagal.forEach(function (g) { galatIsian(form, g.k, g.e.message); });
      toast(gagal.length + ' pengaturan gagal disimpan; perubahan lain tersimpan.', 'galat');
    } else toast('Pengaturan disimpan.', 'sukses');
    S.rangkaPeran = null;
    if (!gagal.length) navigateTo('pengaturan', {}, { tanpaRiwayat: true });
  }).catch(gagalUmum).then(function () { form.removeAttribute('data-sibuk'); });
};

const POLA_NAMA = { thumbnail: 'drive.google.com/thumbnail (bawaan)', lh3: 'lh3.googleusercontent.com', uc: 'drive.google.com/uc' };
AKSI['media-diagnosa'] = function (b) {
  kerjakan(b, function () { return panggil('media.diagnosa', {}); }).then(function (d) {
    let hasil = {};
    const api = modal({
      judul: 'Uji tampil gambar', lebar: true,
      badan: h`<div class="peringatan peringatan-info" role="note">${ikon('info')}<div><p>Uji ini memeriksa apakah gambar benar-benar tampil di <strong>halaman yang sedang Anda buka</strong>. Agar hasilnya mewakili siswa, buka aplikasi dari alamat Blogger yang dipakai siswa, <strong>di jendela penyamaran (incognito) tanpa masuk ke akun Google</strong>. Akun Google Anda sendiri bisa melihat berkas Anda walau tautannya tidak publik, sehingga hasilnya menyesatkan.</p></div></div>
        <fieldset class="isian fieldset-polos jarak-atas"><legend class="label">Pola alamat gambar</legend>
          <ul class="md-uji" role="list">${d.kandidat.map(function (k) {
            return h`<li class="md-baris"><label class="md-pilih"><input type="radio" name="md-pola" value="${k.pola}"${k.pola === d.polaSaatIni ? mentah(' checked') : ''}> <span>${POLA_NAMA[k.pola] || k.pola}${k.pola === d.polaSaatIni ? ' — dipakai sekarang' : ''}</span></label>
              <img class="md-gambar" alt="Gambar uji" width="48" height="48" data-pola="${k.pola}" data-src="${k.url}" referrerpolicy="no-referrer">
              <span class="md-status lencana" id="md-s-${k.pola}" role="status">Memuat…</span></li>`;
          })}</ul></fieldset>
        <p class="bantu" id="md-ringkas" aria-live="polite"></p>`,
      aksi: [
        { id: 'tutup', label: 'Tutup', gaya: 'diam' },
        { id: 'pakai', label: 'Pakai pola terpilih', gaya: 'utama', onKlik: function (a, tombol) {
          const r = el('input[name="md-pola"]:checked', a.el);
          if (!r) return;
          if (r.value === pgAsli.media_url_pola) { toast('Pola itu sudah dipakai.', 'info'); return; }
          const simpan = function () {
            return kerjakan(tombol, function () {
              return panggil('pengaturan.simpan', { kunci: 'media_url_pola', nilai: r.value }).then(function () {
                pgAsli.media_url_pola = r.value;
                const t = el('#md-pola-skrg'); if (t) t.textContent = r.value;
                toast('Pola alamat gambar diganti ke ' + r.value + '.', 'sukses');
                a.tutup('pakai');
              });
            }).catch(gagalUmum);
          };
          if (hasil[r.value] === 'ok') { simpan(); return; }
          konfirmasi({ judul: 'Pola ini tidak tampil pada uji', pesan: 'Gambar dengan pola ini tidak tampil di halaman ini pada uji tadi. Siswa mungkin tidak bisa melihat gambar soal. Tetap dipakai?', ya: 'Tetap pakai', bahaya: true }).then(function (ya) { if (ya) simpan(); });
        } }
      ]
    });
    api.selesai.then(function () { panggil('media.selesaiDiagnosa', { id: d.id }).catch(function () {   }); });
    const ringkas = function () {
      const n = d.kandidat.length;
      const selesai = d.kandidat.filter(function (k) { return hasil[k.pola]; });
      if (selesai.length < n) return;
      const ok = d.kandidat.filter(function (k) { return hasil[k.pola] === 'ok'; });
      const w = el('#md-ringkas', api.el);
      if (!w) return;
      w.textContent = ok.length
        ? ok.length + ' dari ' + n + ' pola tampil. Pilih salah satu yang tampil lalu tekan “Pakai pola terpilih”.'
        : 'Tidak ada pola yang tampil. Penyebab umum: kebijakan berbagi Google Workspace sekolah melarang tautan publik, atau uji ini dijalankan dari alamat yang berbeda dari yang dipakai siswa. Gambar soal tidak akan tampil bagi siswa sebelum ini diatasi; hubungi administrator domain sekolah.';
    };
    semua('img.md-gambar', api.el).forEach(function (im) {
      const pola = im.getAttribute('data-pola');
      const lencana = el('#md-s-' + pola, api.el);
      const tandai = function (st) {
        if (hasil[pola]) return;
        hasil[pola] = st;
        if (lencana) { lencana.textContent = st === 'ok' ? 'Tampil' : (st === 'waktu' ? 'Tidak ada jawaban' : 'Tidak tampil'); lencana.className = 'md-status lencana ' + (st === 'ok' ? 'lencana-sukses' : 'lencana-bahaya'); }
        ringkas();
      };
      im.addEventListener('load', function () { tandai(im.naturalWidth > 0 ? 'ok' : 'gagal'); });
      im.addEventListener('error', function () { tandai('gagal'); });
      setTimeout(function () { tandai('waktu'); }, 12000);
      const u = urlHttps(im.getAttribute('data-src'));
      if (u) im.src = u; else tandai('gagal');
    });
  }).catch(gagalUmum);
};


const bnSt = { data: null, seq: 0, hasil: null, memproses: 0, nama: '', fokus: null };
const BN_GALAT_FORM = ['VALIDASI', 'FORMAT', 'UKURAN', 'UKURAN_PIKSEL', 'BATAS', 'DRIVE', 'TIDAK_ADA', 'STATUS', 'PERMINTAAN', 'BELUM_PASANG', 'TERKUNCI'];

function bnHostTautan(u) {
  const m = /^https:\/\/([^\/?#]+)/i.exec(String(u || ''));
  return m ? m[1] : '';
}

function renderBannerAdmin(p, c) {
  pasang(c.wadah, h`
    ${kepalaHalaman('Banner beranda', 'Pengumuman bergambar di beranda publik. Pengunjung tidak perlu masuk untuk melihatnya.', h`<button type="button" class="tombol" data-aksi="banner-baru" data-uji="bn-baru">${ikon('plus')}<span>Tambah banner</span></button>`)}
    <div id="bn-isi"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat banner…</span></div></div>`);
  fokusJudul();
  muatBannerAdmin(c.ok);
}

function muatBannerAdmin(ok) {
  const seq = ++bnSt.seq;
  return panggil('banner.daftar', {}, { ulang: true }).then(function (d) {
    if (seq !== bnSt.seq || (ok && !ok())) return;
    bnSt.data = d;
    gambarBannerAdmin();
  }).catch(function (e) {
    if (seq !== bnSt.seq || (ok && !ok())) return;
    tampilkanGalatMuat(el('#bn-isi'), e, true);
  });
}

function bnKartu(b, i, n) {
  const u = bnUrlGambar(b.url, false);
  const judul = b.judul || '(tanpa judul)';
  const host = bnHostTautan(b.tautan);
  return h`<article class="kartu banner-admin${b.aktif ? '' : ' nonaktif'}" data-uji="bn-kartu" data-id="${b.id}">
    <div class="bna-gambar">${b.gambarAda && u ? h`<img src="${u}" alt="" width="${b.lebar || ''}" height="${b.tinggi || ''}" decoding="async" referrerpolicy="no-referrer" loading="lazy" data-bna-gambar>` : h`<span class="bna-hilang">${ikon('image')}<span>${b.gambarAda ? 'Gambar tidak termuat' : 'Gambar hilang'}</span></span>`}</div>
    <div class="bna-isi">
      <h3>${judul}</h3>
      ${b.teks ? h`<p class="bna-teks">${b.teks}</p>` : ''}
      <div class="meta">
        <span class="lencana ${b.aktif ? 'lencana-sukses' : ''}" data-uji="bn-status">${ikon(b.aktif ? 'check-circle' : 'slash', 'ikon-sm')} ${b.aktif ? 'Aktif' : 'Nonaktif'}</span>
        <span class="lencana">Urutan ${formatAngka(i + 1)} dari ${formatAngka(n)}</span>
        ${b.gambarAda ? '' : h`<span class="lencana lencana-bahaya">${ikon('alert-triangle', 'ikon-sm')} Gambar hilang</span>`}
        ${host ? h`<span class="lencana">${ikon('external-link', 'ikon-sm')} ${host}</span>` : ''}
      </div>
      ${b.alt ? h`<p class="bantu tanpa-margin">Teks pengganti: ${b.alt}</p>` : ''}
    </div>
    <div class="bna-aksi">
      <div class="baris-bungkus">
        <button type="button" class="tombol tombol-diam" data-aksi="banner-geser" data-id="${b.id}" data-arah="naik" aria-label="Naikkan banner ${judul}"${i === 0 ? mentah(' aria-disabled="true"') : ''} data-uji="bn-naik">${ikon('arrow-up')}<span>Naik</span></button>
        <button type="button" class="tombol tombol-diam" data-aksi="banner-geser" data-id="${b.id}" data-arah="turun" aria-label="Turunkan banner ${judul}"${i === n - 1 ? mentah(' aria-disabled="true"') : ''} data-uji="bn-turun">${ikon('arrow-down')}<span>Turun</span></button>
        <button type="button" class="tombol tombol-garis" data-aksi="banner-ubah" data-id="${b.id}" aria-label="Ubah banner ${judul}" data-uji="bn-ubah">${ikon('edit')}<span>Ubah</span></button>
      </div>
      <div class="baris-bungkus">
        <button type="button" class="tombol tombol-garis" data-aksi="banner-aktif" data-id="${b.id}" data-ke="${b.aktif ? '0' : '1'}" aria-label="${b.aktif ? 'Nonaktifkan' : 'Aktifkan'} banner ${judul}" data-uji="bn-aktif">${ikon(b.aktif ? 'slash' : 'check')}<span>${b.aktif ? 'Nonaktifkan' : 'Aktifkan'}</span></button>
        <button type="button" class="tombol tombol-bahaya-garis rata-kanan" data-aksi="banner-hapus" data-id="${b.id}" aria-label="Hapus banner ${judul}" data-uji="bn-hapus">${ikon('trash')}<span>Hapus</span></button>
      </div>
    </div></article>`;
}

function gambarBannerAdmin() {
  const wadah = el('#bn-isi');
  const d = bnSt.data;
  if (!wadah || !d) return;
  const aktif = d.banner.filter(function (b) { return b.aktif; });
  const n = d.banner.length;
  const penuh = n >= d.maks;
  pasang(wadah, h`
    <section class="kartu jarak-bawah" aria-labelledby="bn-pr-j"><div class="kartu-judul"><span class="ikon-bulat">${ikon('eye')}</span><h3 id="bn-pr-j">Pratinjau di beranda</h3></div>
      <div class="bn-pratinjau" id="bn-pratinjau">${htmlBanner(aktif, { pratinjau: true, admin: true, label: 'Pratinjau banner beranda' })}</div>
      <p class="bantu jarak-atas-kecil" data-uji="bn-hitung">${formatAngka(aktif.length)} banner aktif dari ${formatAngka(n)} (maksimal ${formatAngka(d.maks)}). Pratinjau memakai tampilan yang sama dengan beranda; yang tampil hanya banner aktif yang gambarnya ada.</p>
    </section>
    ${n === 0
      ? h`<div class="kartu kosong" data-uji="bn-kosong"><span class="ikon-bulat netral">${ikon('megaphone')}</span><h3>Belum ada banner</h3><p>Tambahkan pengumuman bergambar untuk beranda. Tanpa banner, beranda menampilkan panel sambutan.</p><button type="button" class="tombol" data-aksi="banner-baru">${ikon('plus')}<span>Tambah banner</span></button></div>`
      : h`<div class="bna-daftar" id="bn-daftar">${d.banner.map(function (b, i) { return bnKartu(b, i, n); })}</div>`}
    ${penuh ? h`<div class="peringatan peringatan-info jarak-atas" data-uji="bn-penuh">${ikon('info')}<div><p>Jumlah banner sudah mencapai batas ${formatAngka(d.maks)}. Hapus yang tidak dipakai untuk menambah yang baru.</p></div></div>` : ''}`);
  const root = el('#bn-pratinjau [data-banner]');
  if (root) pasangBanner(root);
  const daftar = el('#bn-daftar');
  if (daftar) daftar.addEventListener('error', function (e) {
    const im = e.target;
    if (!im || im.tagName !== 'IMG' || !im.hasAttribute('data-bna-gambar')) return;
    const w = im.parentNode;
    if (w) w.innerHTML = '<span class="bna-hilang">' + ikon('image') + '<span>Gambar tidak termuat</span></span>';
  }, true);
  if (bnSt.fokus) {
    const f = bnSt.fokus; bnSt.fokus = null;
    let t = el('[data-aksi="' + f.aksi + '"][data-id="' + f.id + '"]' + (f.arah ? '[data-arah="' + f.arah + '"]' : ''));
    if (t && t.getAttribute('aria-disabled') === 'true' && f.arah) t = el('[data-aksi="' + f.aksi + '"][data-id="' + f.id + '"]:not([aria-disabled="true"])') || t;
    if (t) { try { t.focus(); } catch (er) {   } }
  }
}

AKSI['banner-aktif'] = function (b) {
  const id = b.getAttribute('data-id'), ke = b.getAttribute('data-ke') === '1';
  bnSt.fokus = { aksi: 'banner-aktif', id: id };
  kerjakan(b, function () { return panggil('banner.status', { id: id, aktif: ke }); }).then(function (r) {
    if (!r) return;
    if (r.berubah) toast(ke ? 'Banner diaktifkan dan tampil di beranda.' : 'Banner dinonaktifkan; tidak lagi tampil di beranda.', 'sukses');
    return muatBannerAdmin();
  }).catch(function (e) { gagalUmum(e); return muatBannerAdmin(); });
};

AKSI['banner-geser'] = function (b) {
  const id = b.getAttribute('data-id'), arah = b.getAttribute('data-arah');
  bnSt.fokus = { aksi: 'banner-geser', id: id, arah: arah };
  kerjakan(b, function () { return panggil('banner.geser', { id: id, arah: arah }); }).then(function (r) {
    if (!r) return;
    return muatBannerAdmin();
  }).catch(function (e) { gagalUmum(e); return muatBannerAdmin(); });
};

AKSI['banner-hapus'] = function (b) {
  const id = b.getAttribute('data-id');
  const m = ((bnSt.data && bnSt.data.banner) || []).filter(function (x) { return x.id === id; })[0];
  if (!m) return;
  konfirmasi({
    judul: 'Hapus banner?', ya: 'Hapus banner', bahaya: true,
    pesan: 'Banner ' + (m.judul ? '“' + m.judul + '” ' : '') + 'dihapus beserta gambarnya (dibuang ke tempat sampah Drive) dan langsung hilang dari beranda. Untuk menyembunyikan sementara tanpa menghapus, pilih Nonaktifkan.'
  }).then(function (ya) {
    if (!ya) return;
    panggil('banner.hapus', { id: id }).then(function () {
      toast('Banner dihapus.', 'sukses');
      return muatBannerAdmin();
    }).catch(function (e) { gagalUmum(e); return muatBannerAdmin(); });
  });
};

function formBanner(m) {
  const baru = !m;
  const v = m || { judul: '', teks: '', alt: '', tautan: '', labelTautan: '', aktif: true };
  const u = m && m.gambarAda ? bnUrlGambar(m.url, false) : '';
  return h`<form id="f-banner" data-kirim="banner-simpan" data-id="${m ? m.id : ''}" novalidate>
    <div data-galat aria-live="polite"></div>
    <div class="isian"><label for="bn-f-berkas">${baru ? 'Gambar banner' : 'Ganti gambar (boleh dikosongkan)'}</label>
      <input class="kontrol" id="bn-f-berkas" name="berkas" type="file" accept="image/jpeg,image/png,image/webp" data-masuk="banner-berkas" aria-describedby="bn-f-berkas-b">
      <p class="bantu" id="bn-f-berkas-b">JPG, PNG, atau WebP. Ukuran yang disarankan 1280×560 piksel (mendatar, rasio 16:7); minimal ${formatAngka(320)}×${formatAngka(120)} piksel. Gambar dikecilkan otomatis hingga 1280 piksel dan dipotong di tengah mengikuti rasio 16:7 di beranda, jadi letakkan hal penting di tengah. Jangan menaruh teks penting di dalam gambar; tulis di kolom teks di bawah.</p>
      <div id="bn-pilihan" class="bn-pilihan" aria-live="polite">${u ? h`<figure class="bn-fig"><div class="banner-gambar"><img src="${u}" alt="Gambar banner saat ini" referrerpolicy="no-referrer"></div><figcaption class="bantu">Gambar saat ini</figcaption></figure>` : ''}</div></div>
    <div class="isian"><label for="bn-f-judul">Judul</label><input class="kontrol" id="bn-f-judul" name="judul" type="text" maxlength="80" value="${v.judul}" placeholder="Contoh: Try Out Bersama Oktober"></div>
    <div class="isian"><label for="bn-f-teks">Teks</label><textarea class="kontrol" id="bn-f-teks" name="teks" rows="3" maxlength="200" placeholder="Satu atau dua kalimat singkat">${v.teks}</textarea></div>
    <div class="isian"><label for="bn-f-alt">Teks pengganti gambar</label><input class="kontrol" id="bn-f-alt" name="alt" type="text" maxlength="200" value="${v.alt}" aria-describedby="bn-f-alt-b" placeholder="Contoh: Siswa sedang mengerjakan try out di kelas">
      <p class="bantu" id="bn-f-alt-b">Dibacakan pembaca layar dan tampil bila gambar gagal dimuat. Isi judul atau teks pengganti (boleh keduanya).</p></div>
    <div class="kelompok-isian">
      <div class="isian"><label for="bn-f-tautan">Tautan (opsional)</label><input class="kontrol" id="bn-f-tautan" name="tautan" type="url" maxlength="500" inputmode="url" value="${v.tautan}" autocomplete="off" placeholder="https:&#47;&#47;…"></div>
      <div class="isian"><label for="bn-f-label">Label tautan</label><input class="kontrol" id="bn-f-label" name="label_tautan" type="text" maxlength="30" value="${v.labelTautan}" placeholder="Selengkapnya"></div>
    </div>
    <p class="bantu">Tautan harus diawali https:&#47;&#47; dan dibuka di tab baru. Label hanya berlaku bila tautan diisi.</p>
    ${baru ? h`<label class="gb-hiasan"><input type="checkbox" name="aktif" checked><span>Langsung aktifkan di beranda</span></label>` : ''}
  </form>`;
}

AKSI['banner-baru'] = function () {
  bnSt.hasil = null; bnSt.nama = ''; bnSt.memproses++;
  modal({
    judul: 'Tambah banner', lebar: true, badan: formBanner(null),
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'simpan', label: 'Simpan banner', gaya: 'utama', tipe: 'submit', form: 'f-banner' }]
  });
};
AKSI['banner-ubah'] = function (b) {
  const id = b.getAttribute('data-id');
  const m = ((bnSt.data && bnSt.data.banner) || []).filter(function (x) { return x.id === id; })[0];
  if (!m) return;
  bnSt.hasil = null; bnSt.nama = ''; bnSt.memproses++;
  modal({
    judul: 'Ubah banner', lebar: true, badan: formBanner(m),
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'simpan', label: 'Simpan perubahan', gaya: 'utama', tipe: 'submit', form: 'f-banner' }]
  });
};

MASUKAN['banner-berkas'] = function (r) {
  const form = r.form;
  const kotak = el('#bn-pilihan', form);
  bnSt.hasil = null;
  bersihGalat(form);
  const file = r.files && r.files[0];
  if (!file) return;
  const nomor = ++bnSt.memproses;
  pasang(kotak, h`<p class="bantu"><span class="spinner" aria-hidden="true"></span> Memeriksa dan mengecilkan gambar…</p>`);
  gbKompres(file).then(function (hsl) {
    if (nomor !== bnSt.memproses || !document.body.contains(form)) return;
    bnSt.hasil = hsl;
    bnSt.nama = file.name || 'banner';
    const url = URL.createObjectURL(hsl.blob);
    const kecil = hsl.lebar < 320 || hsl.tinggi < 120;
    pasang(kotak, h`<figure class="bn-fig" data-uji="bn-pratinjau-pilihan"><div class="banner-gambar"><img src="${url}" alt="Pratinjau gambar yang dipilih"></div>
      <figcaption class="bantu">${formatAngka(hsl.lebar, 0)} × ${formatAngka(hsl.tinggi, 0)} piksel · ${gbUkuranTeks(hsl.blob.size)}${hsl.blob.size < file.size ? ' (dari ' + gbUkuranTeks(file.size) + ')' : ''}. Yang tampil di beranda adalah bagian tengah gambar.</figcaption></figure>
      ${kecil ? h`<div class="peringatan peringatan-bahaya" role="alert">${ikon('alert-circle')}<div><p>Gambar terlalu kecil. Pakai gambar minimal 320×120 piksel.</p></div></div>` : ''}`);
    const gam = el('img', kotak);
    if (gam) gam.addEventListener('load', function () { try { URL.revokeObjectURL(url); } catch (e) {   } });
  }).catch(function (e) {
    if (nomor !== bnSt.memproses || !document.body.contains(form)) return;
    pasang(kotak, h``);
    r.value = '';
    galatIsian(form, 'berkas', e.kode === 'FORMAT' || e.kode === 'UKURAN' ? e.message : 'Gambar tidak bisa diproses. Coba gambar lain.');
  });
};

KIRIM['banner-simpan'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  const id = form.getAttribute('data-id');
  const baru = !id;
  const berkasDipilih = el('#bn-f-berkas', form).files.length > 0;
  if (berkasDipilih && bnSt.memproses && !bnSt.hasil) { galatIsian(form, 'berkas', 'Tunggu sebentar, gambar sedang dikecilkan.'); return; }
  if (baru && !bnSt.hasil) { galatIsian(form, 'berkas', 'Pilih gambar banner dulu.'); return; }
  if (bnSt.hasil && (bnSt.hasil.lebar < 320 || bnSt.hasil.tinggi < 120)) { galatIsian(form, 'berkas', 'Gambar terlalu kecil. Pakai gambar minimal 320×120 piksel.'); return; }
  if (!v.judul && !v.alt) { galatIsian(form, 'alt', 'Isi judul atau teks pengganti gambar, supaya pembaca layar dapat menjelaskan banner ini.'); return; }
  if (v.tautan && !urlHttps(v.tautan)) { galatIsian(form, 'tautan', 'Tautan harus diawali https:\/\/ dan tidak boleh berisi spasi.'); return; }
  if (v.label_tautan && !v.tautan) { galatIsian(form, 'label_tautan', 'Label hanya berarti bila tautan diisi.'); return; }
  form.setAttribute('data-sibuk', 'ya');
  const hsl = bnSt.hasil;
  kerjakan(tombolKirim(form), function () {
    const data = { judul: v.judul, teks: v.teks, alt: v.alt, tautan: v.tautan, label_tautan: v.label_tautan };
    if (id) data.id = id; else data.aktif = !!v.aktif;
    const langkah = hsl ? gbBase64(hsl.blob).then(function (b64) { data.gambar = { data: b64, tipe: hsl.tipe, nama: bnSt.nama || 'banner' }; }) : Promise.resolve();
    return langkah.then(function () { return panggil('banner.simpan', data); });
  }).then(function (r) {
    if (!r) return;
    const api = modalTeratas(); if (api) api.tutup('disimpan');
    bnSt.hasil = null;
    toast(baru ? 'Banner dibuat.' : 'Perubahan banner disimpan.', 'sukses');
    return muatBannerAdmin();
  }).catch(function (e) {
    if (e && BN_GALAT_FORM.indexOf(e.kode) >= 0) galatForm(form, e.message); else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};


const auditSt = { aksi: '', batas: '100', data: [] };

function renderAudit(p, c) {
  const admin = S.pengguna.peran === PERAN.ADMIN;
  const aksiOpsi = Object.keys(LABEL_AKSI).sort(function (a, b) { return LABEL_AKSI[a] < LABEL_AKSI[b] ? -1 : 1; });
  pasang(c.wadah, h`
    ${kepalaHalaman(admin ? 'Log audit' : 'Log aktivitas saya', admin ? 'Jejak perubahan penting di aplikasi, tersambung dalam rantai hash.' : 'Aktivitas Anda yang tercatat di aplikasi.',
      admin ? h`<button type="button" class="tombol tombol-diam" data-aksi="audit-verifikasi">${ikon('shield')}<span>Verifikasi rantai</span></button><button type="button" class="tombol tombol-diam" data-aksi="audit-salin">${ikon('save')}<span>Salin ke berkas</span></button>` : '')}
    ${admin ? h`<div class="peringatan jarak-bawah">${ikon('info')}<div>
      <p><strong>Apa yang dibuktikan verifikasi?</strong> Verifikasi memeriksa bahwa tiap entri tersambung ke entri sebelumnya, jadi entri yang diubah atau dihapus sebagian akan terdeteksi.</p>
      <p>Pemilik spreadsheet yang menulis ulang <em>seluruh</em> rantai tidak terdeteksi oleh verifikasi saja. Karena itu jalankan <strong>Salin ke berkas</strong> secara rutin: salinannya tidak bisa diubah dari spreadsheet dan dipakai sebagai pembanding.</p></div></div>
    <div id="audit-hasil" aria-live="polite"></div>` : ''}
    <div class="saring saring-2" role="search">
      <div class="isian"><label class="sr-only" for="au-aksi">Jenis aktivitas</label><select class="kontrol" id="au-aksi" data-masuk="audit-saring"><option value="">Semua jenis aktivitas</option>${aksiOpsi.map(function (k) { return h`<option value="${k}"${auditSt.aksi === k ? mentah(' selected') : ''}>${LABEL_AKSI[k]}</option>`; })}</select></div>
      <div class="isian"><label class="sr-only" for="au-batas">Jumlah entri</label><select class="kontrol" id="au-batas" data-masuk="audit-saring">${['50', '100', '200'].map(function (n) { return h`<option value="${n}"${auditSt.batas === n ? mentah(' selected') : ''}>${n} entri terbaru</option>`; })}</select></div>
    </div>
    <div id="audit-daftar"><div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat log…</span></div></div>`);
  fokusJudul();
  muatAudit(c.ok);
}

function muatAudit(ok) {
  return panggil('audit.daftar', { batas: parseInt(auditSt.batas, 10), aksi: auditSt.aksi }, { ulang: true }).then(function (d) {
    if (ok && !ok()) return;
    auditSt.data = d;
    const w = el('#audit-daftar'); if (!w) return;
    if (!d.length) { pasang(w, h`<div class="bungkus-tabel"><div class="tabel-kosong">Belum ada entri log${auditSt.aksi ? ' untuk jenis ini' : ''}.</div></div>`); return; }
    pasang(w, h`<div class="bungkus-tabel"><table class="tabel"><caption class="sr-only">Entri log audit terbaru</caption>
      <thead><tr><th scope="col">No</th><th scope="col">Waktu</th><th scope="col">Pelaku</th><th scope="col">Aktivitas</th><th scope="col">Ringkasan</th></tr></thead>
      <tbody>${d.map(function (e) {
        const gagal = e.aksi === 'akses_ditolak' || /gagal|ditolak/.test(e.aksi);
        return h`<tr><td data-label="No" class="angka">${e.no}</td><td data-label="Waktu" class="waktu-sel">${waktuWIB(e.waktu)}</td><td data-label="Pelaku" class="pecah">${e.pelaku}</td>
          <td data-label="Aktivitas"><span class="lencana ${gagal ? 'lencana-bahaya' : 'lencana-primer'}">${labelAksi(e.aksi)}</span></td><td data-label="Ringkasan" class="log-ringkasan">${e.ringkasan || '—'}</td></tr>`;
      })}</tbody></table></div>`);
  }).catch(function (e) { if (!ok || ok()) tampilkanGalatMuat(el('#audit-daftar'), e, true); });
}
MASUKAN['audit-saring'] = function () {
  const a = el('#au-aksi'), b = el('#au-batas'); if (!a || !b) return;
  auditSt.aksi = a.value; auditSt.batas = b.value;
  muatAudit();
};

AKSI['audit-verifikasi'] = function (b) {
  kerjakan(b, function () {
    return panggil('audit.verifikasi', {}).then(function (r) {
      const w = el('#audit-hasil'); if (!w) return;
      pasang(w, h`<div class="peringatan ${r.ok ? 'peringatan-sukses' : 'peringatan-bahaya'} jarak-bawah" role="status">${ikon(r.ok ? 'check-circle' : 'alert-triangle')}<div><p><strong>${r.ok ? 'Rantai utuh.' : 'Rantai bermasalah.'}</strong> ${r.pesan}</p>${r.ok ? h`<p>${formatAngka(r.jumlah)} entri diperiksa dari awal.</p>` : ''}</div></div>`);
    });
  }).catch(gagalUmum);
};
AKSI['audit-salin'] = function (b) {
  kerjakan(b, function () {
    return panggil('audit.salin', {}).then(function (r) {
      const w = el('#audit-hasil'); if (!w) return;
      const s = r.salin, v = r.verifikasi;
      pasang(w, h`<div class="peringatan ${v.ok ? 'peringatan-sukses' : 'peringatan-bahaya'} jarak-bawah" role="status">${ikon(v.ok ? 'check-circle' : 'alert-triangle')}<div>
        <p><strong>${s.disalin ? formatAngka(s.disalin) + ' entri baru disalin ke berkas.' : 'Tidak ada entri baru untuk disalin.'}</strong></p>
        <p>${v.ok ? 'Pembandingan dengan log: ' : 'Pembandingan gagal: '}${v.pesan}</p></div></div>`);
    });
  }).catch(gagalUmum);
};


const LABEL_JENIS_BACKUP = { manual: 'Manual', harian: 'Harian', pengaman: 'Pengaman sebelum restore', sebelum_perubahan: 'Sebelum migrasi skema' };
let backupSt = { status: null, daftar: [] };

function ujiTeks(b) {
  const u = String(b.ujiRestore || '');
  if (!u) return h`<span class="lencana">Belum diuji</span>`;
  const m = /^lulus\s+(\S+?)(?::\s|$)/.exec(u);
  if (m || /^lulus/.test(u)) {
    const iso = m ? m[1] : (/^lulus\s+(\S+)/.exec(u) || [])[1];
    return h`<span class="lencana lencana-sukses">${ikon('check', 'ikon-sm')} Lulus</span> <span class="teks-redam kecil">${tanggalWIB(iso)}</span>`;
  }
  return h`<span class="lencana lencana-bahaya">Gagal uji</span>`;
}

function renderBackup(p, c) {
  Promise.all([panggil('backup.status', {}, { ulang: true }), panggil('backup.daftar', {}, { ulang: true })]).then(function (hasil) {
    if (!c.ok()) return;
    backupSt = { status: hasil[0], daftar: hasil[1] };
    gambarBackup(c.wadah);
    fokusJudul();
  }).catch(function (e) { if (c.ok()) tampilkanGalatMuat(c.wadah, e, true); });
}

function gambarBackup(wadah) {
  const st = backupSt.status, daftar = backupSt.daftar;
  pasang(wadah, h`
    ${kepalaHalaman('Backup & pulihkan', 'Salinan data lengkap di Google Drive, beserta pengujian pemulihannya.', h`<button type="button" class="tombol" data-aksi="backup-buat">${ikon('hard-drive')}<span>Buat backup sekarang</span></button>`)}
    ${st.pemeliharaan ? h`<div class="peringatan peringatan-waspada jarak-bawah">${ikon('alert-triangle')}<div><p><strong>Mode pemeliharaan aktif.</strong> Pemulihan sedang berjalan atau terhenti. Pengguna lain tidak bisa memakai aplikasi sampai selesai.</p></div></div>` : ''}
    <div class="dasbor-2">
      ${kartuBackup(st, false)}
      <section class="kartu" aria-labelledby="h-cara"><div class="kartu-judul"><span class="ikon-bulat">${ikon('help-circle')}</span><h3 id="h-cara">Cara menguji pemulihan</h3></div>
        <ol class="langkah-uji">
          <li>Buat backup, lalu tunggu statusnya <strong>terverifikasi</strong>.</li>
          <li>Klik <strong>Uji restore</strong>. Sistem membuat salinan uji di Drive dan membandingkan skema, jumlah baris, dan ringkasan nilai.</li>
          <li>Buka salinan uji, lalu cocokkan beberapa data secara manual (akun, paket, soal).</li>
          <li>Hanya setelah uji lulus, tombol <strong>Pulihkan</strong> aktif. Sistem membuat backup pengaman dulu dan memulihkan otomatis bila gagal.</li>
        </ol>
        <p class="bantu jarak-atas">Backup harian otomatis berjalan bila pemicu waktu sudah dipasang (fungsi pasangPemicu di editor Apps Script).</p></section>
    </div>
    <h3 class="jarak-atas">Riwayat backup</h3>
    ${daftar.length ? h`<div class="bungkus-tabel"><table class="tabel"><caption class="sr-only">Riwayat backup</caption>
      <thead><tr><th scope="col">Waktu</th><th scope="col">Jenis</th><th scope="col">Verifikasi</th><th scope="col">Uji restore</th><th scope="col"><span class="sr-only">Aksi</span></th></tr></thead>
      <tbody>${daftar.map(function (b) {
        const lulusVerif = b.verifikasi === 'lulus';
        const lulusUji = /^lulus/.test(b.ujiRestore || '');
        return h`<tr><td data-label="Waktu" class="waktu-sel">${waktuWIB(b.waktu)}</td><td data-label="Jenis">${LABEL_JENIS_BACKUP[b.jenis] || b.jenis}</td>
          <td data-label="Verifikasi"><span class="lencana ${lulusVerif ? 'lencana-sukses' : 'lencana-bahaya'}">${lulusVerif ? 'Terverifikasi' : 'Gagal'}</span>${!lulusVerif && b.catatan ? h`<div class="kecil teks-redam pecah">${b.catatan}</div>` : ''}</td>
          <td data-label="Uji restore">${ujiTeks(b)}</td>
          <td class="sel-aksi"><div class="aksi-sel">
            <button type="button" class="tombol tombol-diam" data-aksi="backup-uji" data-id="${b.id}"${lulusVerif ? '' : mentah(' aria-disabled="true"')}>${ikon('check-circle')}<span>Uji restore</span></button>
            <button type="button" class="tombol tombol-bahaya-garis" data-aksi="backup-pulihkan" data-id="${b.id}"${lulusUji ? '' : mentah(' aria-disabled="true" title="Aktif setelah uji restore lulus"')}>${ikon('rotate-ccw')}<span>Pulihkan</span></button></div></td></tr>`;
      })}</tbody></table></div>`
      : h`<div class="kartu kosong"><span class="ikon-bulat netral">${ikon('database')}</span><h3>Belum ada backup</h3><p>Klik “Buat backup sekarang” untuk membuat salinan pertama.</p></div>`}`);
}
function segarkanBackup() {
  return Promise.all([panggil('backup.status', {}), panggil('backup.daftar', {})]).then(function (hasil) {
    backupSt = { status: hasil[0], daftar: hasil[1] };
    if (S.halaman === 'backup') gambarBackup(el('#isi'));
  }).catch(gagalUmum);
}

AKSI['backup-buat'] = function (b) {
  kerjakan(b, function () {
    return panggil('backup.buat', {}).then(function (r) {
      toast(r.verifikasi === 'lulus' ? 'Backup dibuat dan terverifikasi.' : 'Backup dibuat tetapi GAGAL verifikasi. Lihat catatannya.', r.verifikasi === 'lulus' ? 'sukses' : 'galat');
      return segarkanBackup();
    });
  }).catch(gagalUmum);
};

AKSI['backup-uji'] = function (b) {
  const id = b.getAttribute('data-id');
  kerjakan(b, function () {
    return panggil('backup.ujiRestore', { id: id }).then(function (r) {
      segarkanBackup();
      const url = String(r.urlSalinanUji || '');
      const aman = /^https:\/\/(docs|drive)\.google\.com\x2F/.test(url) ? url : '';
      modal({
        judul: r.lulus ? 'Uji restore lulus' : 'Uji restore GAGAL',
        badan: h`<div class="peringatan ${r.lulus ? 'peringatan-sukses' : 'peringatan-bahaya'}" role="status">${ikon(r.lulus ? 'check-circle' : 'alert-triangle')}<div>
            <p><strong>${r.lulus ? 'Skema, jumlah baris, dan ringkasan nilai cocok dengan catatan backup.' : 'Ada ketidakcocokan:'}</strong></p>
            ${r.lulus ? '' : h`<ul>${(r.masalah || []).map(function (m) { return h`<li>${m}</li>`; })}</ul>`}</div></div>
          <p class="tanpa-margin"><strong>Ini belum bukti penuh.</strong> Pencocokan otomatis tidak menggantikan pemeriksaan manual. Buka salinan uji, lalu cocokkan beberapa akun, paket, dan soal dengan data asli.</p>
          ${aman ? h`<p class="tanpa-margin"><a href="${aman}" target="_blank" rel="noopener noreferrer">Buka salinan uji di Google Drive</a></p>` : ''}`,
        aksi: [{ id: 'ok', label: 'Mengerti', gaya: 'utama' }]
      });
    });
  }).catch(function (e) { gagalUmum(e); segarkanBackup(); });
};

AKSI['backup-pulihkan'] = function (b) {
  const id = b.getAttribute('data-id');
  const item = backupSt.daftar.filter(function (x) { return x.id === id; })[0];
  modal({
    judul: 'Pulihkan data dari backup?', lebar: true,
    badan: h`<div class="peringatan peringatan-bahaya">${ikon('alert-triangle')}<div><p><strong>Data saat ini akan diganti</strong> dengan isi backup tanggal ${waktuWIB(item && item.waktu)}. Perubahan setelah waktu itu hilang.</p></div></div>
      <ul class="langkah-uji">
        <li>Sistem membuat backup pengaman dari data sekarang lebih dulu.</li>
        <li>Aplikasi masuk mode pemeliharaan selama pemulihan; pengguna lain tidak bisa memakainya.</li>
        <li>Setelah pemulihan, sistem memeriksa hasilnya. Bila gagal, data dikembalikan dari backup pengaman.</li>
        <li>Log audit, riwayat backup, dan sesi tidak ditimpa.</li></ul>
      <form id="f-pulihkan" data-kirim="backup-pulihkan" data-id="${id}" novalidate><div data-galat aria-live="polite"></div>
        <div class="isian"><label for="pl-ketik">Ketik <strong>PULIHKAN</strong> (huruf besar semua) untuk melanjutkan</label>
          <input class="kontrol" id="pl-ketik" name="konfirmasi" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" data-masuk="pulihkan-ketik"></div></form>`,
    aksi: [{ id: 'batal', label: 'Batal', gaya: 'diam' }, { id: 'pulihkan', label: 'Pulihkan sekarang', gaya: 'bahaya', tipe: 'submit', form: 'f-pulihkan' }],
    saatBuka: function (api) { const t = el('[data-modal-aksi="1"]', api.el); if (t) t.setAttribute('aria-disabled', 'true'); }
  });
};
MASUKAN['pulihkan-ketik'] = function (inp) {
  const api = modalTeratas(); if (!api) return;
  const t = el('[data-modal-aksi="1"]', api.el);
  if (t) { if (inp.value === 'PULIHKAN') t.removeAttribute('aria-disabled'); else t.setAttribute('aria-disabled', 'true'); }
};
KIRIM['backup-pulihkan'] = function (form) {
  bersihGalat(form);
  const v = nilaiForm(form);
  if (v.konfirmasi !== 'PULIHKAN') { galatIsian(form, 'konfirmasi', 'Ketik PULIHKAN (huruf besar semua).'); return; }
  const api = modalTeratas();
  form.setAttribute('data-sibuk', 'ya');
  kerjakan(tombolKirim(form), function () {
    return panggil('backup.pulihkan', { id: form.getAttribute('data-id'), konfirmasi: 'PULIHKAN' }).then(function (r) {
      if (api) api.tutup('selesai');
      modal({
        judul: 'Pemulihan selesai', tahan: true,
        badan: h`<div class="peringatan peringatan-sukses">${ikon('check-circle')}<div><p>${r.pesan}</p></div></div><p class="tanpa-margin">Periksa beberapa data penting (akun, paket, soal) untuk memastikan hasilnya sesuai harapan.</p>`,
        aksi: [{ id: 'ok', label: 'Muat ulang data', gaya: 'utama' }]
      }).selesai.then(function () { navigateTo('backup', {}, { tanpaRiwayat: true }); });
    });
  }).catch(function (e) {
    if (['KONFIRMASI', 'BELUM_DIUJI', 'BACKUP_GAGAL', 'BERKAS_HILANG', 'SKEMA', 'PENGAMAN_GAGAL', 'RESTORE_GAGAL'].indexOf(e.kode) >= 0) galatForm(form, e.message);
    else gagalUmum(e);
  }).then(function () { form.removeAttribute('data-sibuk'); });
};


function bundelDariAwal() {
  const a = window.SiapAwal;
  if (!a || !a.janji || typeof a.janji.then !== 'function') return Promise.resolve(null);
  return a.janji.then(function (r) {
    const d = r && r.ok && r.json && r.json.success ? r.json.data : null;
    return d && typeof d === 'object' && d.info && typeof d.info === 'object' ? d : null;
  }, function () { return null; });
}

function layarAwal() {
  return S.pengguna ? (S.pengguna.langkahWajib ? 'wajib' : 'dasbor') : 'beranda';
}

function infoBeda(a, b) {
  return ['nama_aplikasi', 'logo', 'warna_dominan', 'kontak', 'versi', 'belumDipasang', 'mode_pemeliharaan'].some(function (k) { return (a[k] || '') !== (b[k] || ''); });
}

function layarKonfigurasi() {
  pasang(el('#akar'), h`<main class="halaman-masuk" id="isi-publik" tabindex="-1"><section class="kartu kartu-masuk" role="alert">
    <span class="logo-besar">${ikon('alert-triangle', 'ikon-xl')}</span>
    <h1 id="judul-masuk" tabindex="-1">Alamat server belum diatur</h1>
    <p class="teks-redam">Buka berkas <strong>js/config.js</strong> di repository GitHub, isi <strong>GAS_URL</strong> dengan alamat web app Apps Script (berakhiran <strong>/exec</strong>), simpan, lalu unggah ulang. Setelah itu muat ulang halaman ini.</p>
  </section></main>`);
}

function layarAwalHilang() {
  pasang(el('#akar'), h`<main class="halaman-masuk" id="isi-publik" tabindex="-1"><section class="kartu kartu-masuk" role="alert">
    <span class="logo-besar">${ikon('alert-triangle', 'ikon-xl')}</span>
    <h1 id="judul-masuk" tabindex="-1">Halaman tidak lengkap</h1>
    <p class="teks-redam">Skrip awal tidak berjalan. Biasanya karena berkas <strong>index.html</strong> di repository berbeda dari paket aslinya (diubah, atau terunggah sebagian). Unggah ulang <strong>index.html</strong> dari paket asli, lalu muat ulang halaman ini dengan Ctrl+F5.</p>
  </section></main>`);
}

function mulai() {
  try { if (window.__siapDiag) window.__siapDiag.mulai = true; } catch (e) {   }
  muatTema();
  document.addEventListener('error', function (e) {
    const t = e.target;
    if (!t || t.tagName !== 'IMG') return;
    const wadah = t.parentNode;
    if (wadah && wadah.classList && wadah.classList.contains('logo')) pasang(wadah, ikon('graduation-cap', 'ikon-lg'));
    else t.style.display = 'none';
  }, true);

  const tr = transport();
  if (!tr) { layarAwalHilang(); return; }
  if (!tr.sah) { layarKonfigurasi(); return; }

  const janji = bundelDariAwal();
  const adaSesi = !!bacaLokal('sesi', KUNCI_SESI);
  let sebelum = null;
  if (!adaSesi && pulihkanSnapshot() && !S.info.belumDipasang) {
    sebelum = Object.assign({}, S.info);
    daftarkanTerbang('beranda.publik', {}, janji, function (b) { return b.beranda; });
    navigateTo('beranda', {}, { tanpaRiwayat: true });
  } else if (!el('#akar .pemuat-rangka') && !el('#akar .pemuat')) {
    pasang(el('#akar'), h`<div class="pemuat" role="status"><span class="spinner" aria-hidden="true"></span><span>Memuat aplikasi…</span></div>`);
  }

  const pet = [
    setTimeout(function () { petunjuk('Menghubungkan ke server…'); }, 2500),
    setTimeout(function () { petunjuk('Server masih belum menjawab. Mohon tunggu sebentar, jangan tutup halaman ini.'); }, 9000)
  ];
  function petunjuk(teks) {
    const isi = el('#akar .pemuat-rangka .rk-isi');
    if (!isi) return;
    let p = el('.rk-petunjuk', isi);
    if (!p) { p = document.createElement('p'); p.className = 'rk-petunjuk'; isi.appendChild(p); }
    p.textContent = teks;
  }
  function selesaiPetunjuk() { pet.forEach(clearTimeout); }

  function segarkanTamu() {
    if (!sebelum || S.halaman !== 'beranda' || !infoBeda(sebelum, S.info)) return;
    if (S.sentuhan > S.renderMulai) return;
    navigateTo('beranda', {}, { tanpaRiwayat: true, senyap: true });
  }

  function lanjut() {
    selesaiPetunjuk();
    simpanSnapshot();
    if (sebelum) segarkanTamu(); else navigateTo(layarAwal(), {}, { tanpaRiwayat: true });
  }

  janji.then(function (b) {
    if (b) {
      if (sebelum && S.pengguna) terapkanInfo(b.info); else terapkanBundel(b);
      lanjut();
      return;
    }
    return Promise.all([muatInfo(), adaSesi ? pulihkanSesi() : Promise.resolve(false)]).then(lanjut);
  }).catch(function () {
    selesaiPetunjuk();
    if (!sebelum) navigateTo('beranda', {}, { tanpaRiwayat: true });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mulai); else mulai();

})();
