// Ganti link di bawah ini dengan link asli. Selain file ini tidak perlu diubah.
window.SITE_DATA = {
  // Video orientasi masalah. Isi link embed YouTube (https://www.youtube.com/embed/ID_VIDEO)
  // atau link file video (.mp4). Kosongkan "" untuk menampilkan placeholder.
  videoUrl: 'https://www.youtube.com/embed/NL1bXtuJeJY',
  // Link tonton langsung di YouTube (dipakai sebagai cadangan di bawah video). Kosongkan "" kalau tidak perlu.
  videoWatchUrl: 'https://www.youtube.com/watch?v=NL1bXtuJeJY',

  // Kartu latihan yang membuka link luar (Wordwall, LiveWorksheets, Quizizz, dll).
  // qr: gambar QR yang ditampilkan di kartu (opsional). Taruh file di assets/qr/.
  // ikon: nama ikon dari sprite di index.html. Pilihan: search, help, grid, pencil, target, play,
  // book, file, trophy, eye, bubble, link, bulb, checklist, list, tag, chart, flask.
  latihan: [
    {
      judul: 'Temukan Perbedaan Makna Tersurat dan Tersirat',
      deskripsi: 'Pilah kalimat yang maknanya tertulis jelas dan yang harus disimpulkan sendiri.',
      ikon: 'search',
      warna: '#3a86ff',
      qr: 'assets/qr/perbedaan-tersurat-tersirat.png',
      url: 'https://q.me-qr.com/9p4h8hsp'
    },
    {
      judul: 'Teka-Teki Teks LHO',
      deskripsi: 'Pecahkan teka-teki seputar teks laporan hasil observasi dan makna tersiratnya.',
      ikon: 'help',
      warna: '#ff0054',
      qr: 'assets/qr/teka-teki-lho.png',
      url: 'https://q.me-qr.com/9p4h8hsp'
    },
    {
      judul: 'Teka-Teki Silang Teks LHO',
      deskripsi: 'Isi kotak-kotak silang dengan istilah penting dari materi makna tersirat dalam teks LHO.',
      ikon: 'grid',
      warna: '#06d6a0',
      qr: 'assets/qr/tts-lho.png',
      url: 'https://q.me-qr.com/kwtp97m8'
    }
  ]
};
