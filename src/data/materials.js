const materials = [
  // ==========================================
  // MODULE 01 — ALGORITMA & LOGIKA
  // ==========================================

{
  id: "algoritma-dasar",
  courseId: "pemrograman-dasar",
  moduleId: "algoritma-logika",
  title: "Apa Itu Algoritma?",
  description:
    "Memahami pengertian algoritma dan bagaimana algoritma digunakan untuk menyelesaikan masalah.",
  duration: "8 menit",
  type: "Materi",

  sections: [
    {
      title: "Apa itu Algoritma?",
      content:
        "Algoritma adalah urutan langkah yang logis, sistematis, dan terstruktur untuk menyelesaikan suatu masalah. Dalam pemrograman, algoritma biasanya dibuat terlebih dahulu sebelum kita menulis kode.",
    },

    {
      title: "Pahami Sederhananya",
      content:
        "Bayangkan kamu ingin membuat mi instan. Kamu perlu menyiapkan air, merebusnya, memasukkan mi, menambahkan bumbu, lalu menyajikannya. Urutan langkah tersebut merupakan contoh sederhana dari algoritma.",
    },

    {
      title: "Contoh dalam Pemrograman",
      content:
        "Misalnya kita ingin menentukan apakah sebuah angka merupakan bilangan genap. Program perlu menerima angka, membagi angka tersebut dengan 2, kemudian memeriksa sisa pembagiannya.",
    },
  ],

  codeExample: {
    language: "javascript",
    title: "Contoh sederhana",
    code: `const angka = 10;

if (angka % 2 === 0) {
  console.log("Bilangan genap");
} else {
  console.log("Bilangan ganjil");
}`,
  },

  quickCheck: {
    question:
      "Jika angka = 8, apa hasil yang ditampilkan program?",
    options: [
      "Bilangan genap",
      "Bilangan ganjil",
      "Error",
      "Tidak ada output",
    ],
    answer: "Bilangan genap",
  },
},

  {
    id: "flowchart-dasar",
    courseId: "pemrograman-dasar",
    moduleId: "algoritma-logika",
    title: "Flowchart Dasar",
    description:
      "Mengenal flowchart sebagai cara visual untuk menggambarkan alur sebuah algoritma.",
    duration: "10 menit",
    type: "Materi",
    sections: [
      {
        title: "Apa itu Flowchart?",
        content:
          "Flowchart adalah diagram yang digunakan untuk menggambarkan alur proses atau algoritma menggunakan simbol-simbol tertentu.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Kalau algoritma adalah daftar langkah, flowchart adalah cara menggambar langkah-langkah tersebut agar alurnya lebih mudah dilihat.",
      },
      {
        title: "Simbol Dasar",
        content:
          "Beberapa simbol dasar flowchart antara lain terminator untuk mulai dan selesai, process untuk proses, decision untuk kondisi, dan arrow untuk menunjukkan arah alur.",
      },
    ],
  },

  {
    id: "pseudocode",
    courseId: "pemrograman-dasar",
    moduleId: "algoritma-logika",
    title: "Pseudocode",
    description:
      "Belajar menuliskan algoritma menggunakan bahasa sederhana sebelum diterjemahkan menjadi kode program.",
    duration: "9 menit",
    type: "Materi",
    sections: [
      {
        title: "Apa itu Pseudocode?",
        content:
          "Pseudocode adalah cara menuliskan algoritma menggunakan struktur yang menyerupai kode program tetapi tetap menggunakan bahasa yang mudah dipahami manusia.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Pseudocode bisa dianggap sebagai jembatan antara ide dan kode. Kita menentukan logikanya terlebih dahulu sebelum memikirkan sintaks bahasa pemrograman.",
      },
      {
        title: "Contoh",
        content:
          "Contoh sederhana: MULAI, masukkan nilai, jika nilai >= 75 tampilkan 'Lulus', jika tidak tampilkan 'Tidak Lulus', kemudian SELESAI.",
      },
    ],
  },

  // ==========================================
  // MODULE 02 — VARIABEL & TIPE DATA
  // ==========================================

{
  id: "variabel-dasar",
  courseId: "pemrograman-dasar",
  moduleId: "variabel-tipe-data",
  title: "Variabel",
  description:
    "Memahami variabel sebagai tempat untuk menyimpan data yang digunakan oleh program.",
  duration: "8 menit",
  type: "Materi",

  sections: [
    {
      title: "Apa itu Variabel?",
      content:
        "Variabel adalah tempat penyimpanan data yang memiliki nama. Program dapat menggunakan nama tersebut untuk mengakses data yang disimpan.",
    },

    {
      title: "Pahami Sederhananya",
      content:
        "Bayangkan variabel seperti sebuah kotak yang memiliki label. Kotak bernama nama dapat menyimpan teks, sedangkan kotak bernama umur dapat menyimpan angka.",
    },

    {
      title: "Kapan Variabel Digunakan?",
      content:
        "Variabel digunakan ketika sebuah nilai perlu disimpan dan digunakan kembali selama program berjalan.",
    },
  ],

  codeExample: {
    language: "javascript",
    title: "Membuat variabel",
    code: `const nama = "Natravell";
let umur = 18;

console.log(nama);
console.log(umur);`,
  },

  quickCheck: {
    question:
      "Variabel digunakan untuk apa?",
    options: [
      "Menyimpan dan mengelola data",
      "Mematikan komputer",
      "Menghapus sistem operasi",
      "Menghubungkan kabel jaringan",
    ],
    answer: "Menyimpan dan mengelola data",
  },
},

  {
    id: "tipe-data",
    courseId: "pemrograman-dasar",
    moduleId: "variabel-tipe-data",
    title: "Tipe Data",
    description:
      "Mengenal jenis data yang umum digunakan dalam pemrograman.",
    duration: "10 menit",
    type: "Materi",
    sections: [
      {
        title: "Apa itu Tipe Data?",
        content:
          "Tipe data menentukan jenis nilai yang disimpan oleh sebuah variabel.",
      },
      {
        title: "Jenis Data Dasar",
        content:
          "Beberapa tipe data yang umum adalah string untuk teks, number untuk angka, boolean untuk true atau false, serta array dan object untuk struktur data.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Kalau variabel adalah wadah, tipe data menjelaskan jenis isi dari wadah tersebut.",
      },
    ],
  },

  {
    id: "input-output",
    courseId: "pemrograman-dasar",
    moduleId: "variabel-tipe-data",
    title: "Input & Output",
    description:
      "Memahami bagaimana program menerima data dan menampilkan hasil.",
    duration: "9 menit",
    type: "Materi",
    sections: [
      {
        title: "Input",
        content:
          "Input adalah data yang diberikan kepada program untuk diproses.",
      },
      {
        title: "Output",
        content:
          "Output adalah informasi atau hasil yang diberikan program setelah melakukan proses terhadap input.",
      },
      {
        title: "Alur Dasar",
        content:
          "Konsep dasar program dapat dipahami melalui pola Input → Process → Output.",
      },
    ],
  },

  // ==========================================
  // MODULE 03 — OPERATOR
  // ==========================================

  {
    id: "operator-aritmatika",
    courseId: "pemrograman-dasar",
    moduleId: "operator",
    title: "Operator Aritmatika",
    description:
      "Mempelajari operator yang digunakan untuk melakukan operasi matematika.",
    duration: "8 menit",
    type: "Materi",
    sections: [
      {
        title: "Operator Aritmatika",
        content:
          "Operator aritmatika digunakan untuk melakukan operasi seperti penjumlahan, pengurangan, perkalian, pembagian, dan sisa pembagian.",
      },
      {
        title: "Contoh",
        content:
          "Operator + digunakan untuk penjumlahan, - untuk pengurangan, * untuk perkalian, / untuk pembagian, dan % untuk mendapatkan sisa pembagian.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Operator aritmatika bekerja seperti tombol operasi pada kalkulator.",
      },
    ],
  },

  {
    id: "operator-perbandingan",
    courseId: "pemrograman-dasar",
    moduleId: "operator",
    title: "Operator Perbandingan",
    description:
      "Memahami operator untuk membandingkan dua nilai.",
    duration: "8 menit",
    type: "Materi",
    sections: [
      {
        title: "Perbandingan",
        content:
          "Operator perbandingan digunakan untuk mengetahui hubungan antara dua nilai, misalnya apakah sama, lebih besar, atau lebih kecil.",
      },
      {
        title: "Contoh",
        content:
          "Operator yang umum digunakan antara lain ===, !==, >, <, >=, dan <=.",
      },
      {
        title: "Hasil Perbandingan",
        content:
          "Hasil operasi perbandingan biasanya berupa nilai boolean, yaitu true atau false.",
      },
    ],
  },

  {
    id: "operator-logika",
    courseId: "pemrograman-dasar",
    moduleId: "operator",
    title: "Operator Logika",
    description:
      "Mempelajari operator AND, OR, dan NOT untuk menggabungkan kondisi.",
    duration: "9 menit",
    type: "Materi",
    sections: [
      {
        title: "Konsep Logika",
        content:
          "Operator logika digunakan ketika program perlu memeriksa lebih dari satu kondisi.",
      },
      {
        title: "AND, OR, NOT",
        content:
          "AND digunakan ketika semua kondisi harus benar, OR ketika salah satu kondisi benar, dan NOT untuk membalik nilai boolean.",
      },
      {
        title: "Contoh",
        content:
          "Misalnya seseorang boleh mengikuti ujian jika sudah terdaftar AND sudah membayar administrasi.",
      },
    ],
  },

  // ==========================================
  // MODULE 04 — PERCABANGAN
  // ==========================================

  {
    id: "percabangan-if",
    courseId: "pemrograman-dasar",
    moduleId: "percabangan",
    title: "If",
    description:
      "Memahami percabangan dasar menggunakan kondisi if.",
    duration: "8 menit",
    type: "Materi",
    sections: [
      {
        title: "Apa itu If?",
        content:
          "If digunakan untuk menjalankan sebuah instruksi hanya ketika kondisi tertentu bernilai benar.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "If seperti mengatakan: jika kondisi ini terjadi, lakukan sesuatu.",
      },
      {
        title: "Contoh",
        content:
          "Jika nilai ujian lebih besar atau sama dengan 75, program dapat menampilkan pesan 'Lulus'.",
      },
    ],
  },

  {
    id: "percabangan-if-else",
    courseId: "pemrograman-dasar",
    moduleId: "percabangan",
    title: "If Else",
    description:
      "Membuat program menentukan dua kemungkinan berdasarkan kondisi.",
    duration: "9 menit",
    type: "Materi",
    sections: [
      {
        title: "If Else",
        content:
          "If else digunakan ketika program memiliki dua kemungkinan tindakan berdasarkan kondisi.",
      },
      {
        title: "Contoh",
        content:
          "Jika nilai >= 75 tampilkan Lulus, jika tidak tampilkan Tidak Lulus.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "If else seperti memilih antara dua jalan berdasarkan kondisi yang diberikan.",
      },
    ],
  },

  {
    id: "switch",
    courseId: "pemrograman-dasar",
    moduleId: "percabangan",
    title: "Switch",
    description:
      "Memahami switch untuk menangani beberapa pilihan nilai.",
    duration: "9 menit",
    type: "Materi",
    sections: [
      {
        title: "Apa itu Switch?",
        content:
          "Switch digunakan untuk memilih tindakan berdasarkan nilai dari sebuah ekspresi.",
      },
      {
        title: "Kapan Digunakan?",
        content:
          "Switch dapat digunakan ketika terdapat banyak kemungkinan nilai yang perlu diperiksa.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Switch seperti menu pilihan: ketika pengguna memilih pilihan tertentu, program menjalankan tindakan yang sesuai.",
      },
    ],
  },

  // ==========================================
  // MODULE 05 — PERULANGAN
  // ==========================================

  {
    id: "perulangan-for",
    courseId: "pemrograman-dasar",
    moduleId: "perulangan",
    title: "For Loop",
    description:
      "Memahami perulangan for untuk menjalankan instruksi dengan jumlah pengulangan tertentu.",
    duration: "9 menit",
    type: "Materi",
    sections: [
      {
        title: "Apa itu For?",
        content:
          "For digunakan ketika kita mengetahui atau dapat menentukan pola pengulangan yang ingin dilakukan.",
      },
      {
        title: "Contoh",
        content:
          "For dapat digunakan untuk menampilkan angka 1 sampai 10 tanpa menulis perintah yang sama sebanyak sepuluh kali.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "For seperti mengatakan: ulangi pekerjaan ini sebanyak jumlah yang sudah ditentukan.",
      },
    ],
  },

  {
    id: "perulangan-while",
    courseId: "pemrograman-dasar",
    moduleId: "perulangan",
    title: "While Loop",
    description:
      "Mempelajari perulangan yang berjalan selama kondisi tertentu masih terpenuhi.",
    duration: "9 menit",
    type: "Materi",
    sections: [
      {
        title: "Apa itu While?",
        content:
          "While menjalankan blok kode selama kondisi yang diberikan masih bernilai true.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "While seperti mengatakan: selama kondisi ini masih benar, terus lakukan pekerjaan tersebut.",
      },
      {
        title: "Hal yang Perlu Diperhatikan",
        content:
          "Pastikan kondisi pada while dapat berubah agar program tidak mengalami infinite loop.",
      },
    ],
  },

  {
    id: "perulangan-do-while",
    courseId: "pemrograman-dasar",
    moduleId: "perulangan",
    title: "Do While",
    description:
      "Memahami perulangan yang selalu menjalankan instruksi setidaknya satu kali.",
    duration: "8 menit",
    type: "Materi",
    sections: [
      {
        title: "Konsep Do While",
        content:
          "Do while menjalankan blok kode terlebih dahulu kemudian memeriksa kondisi.",
      },
      {
        title: "Perbedaannya",
        content:
          "Berbeda dengan while, do while akan menjalankan blok kode minimal satu kali meskipun kondisi awalnya false.",
      },
      {
        title: "Kapan Digunakan?",
        content:
          "Do while cocok ketika sebuah proses harus dilakukan terlebih dahulu sebelum kondisi diperiksa.",
      },
    ],
  },

  // ==========================================
  // MODULE 06 — FUNCTION
  // ==========================================

  {
    id: "function-dasar",
    courseId: "pemrograman-dasar",
    moduleId: "function",
    title: "Konsep Function",
    description:
      "Memahami function sebagai blok kode yang dapat digunakan kembali.",
    duration: "9 menit",
    type: "Materi",
    sections: [
      {
        title: "Apa itu Function?",
        content:
          "Function adalah blok kode yang dibuat untuk menjalankan tugas tertentu dan dapat dipanggil ketika diperlukan.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Function seperti sebuah mesin kecil. Kita memberikan input jika diperlukan, mesin melakukan proses, lalu dapat menghasilkan output.",
      },
      {
        title: "Manfaat Function",
        content:
          "Function membuat program lebih terstruktur, mengurangi pengulangan kode, dan membuat kode lebih mudah dipelihara.",
      },
    ],
  },

  {
    id: "function-parameter",
    courseId: "pemrograman-dasar",
    moduleId: "function",
    title: "Parameter & Argument",
    description:
      "Memahami cara mengirim data ke dalam function.",
    duration: "9 menit",
    type: "Materi",
    sections: [
      {
        title: "Parameter",
        content:
          "Parameter adalah variabel yang didefinisikan pada function untuk menerima data.",
      },
      {
        title: "Argument",
        content:
          "Argument adalah nilai sebenarnya yang diberikan ketika function dipanggil.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Parameter adalah tempat untuk menerima pesanan, sedangkan argument adalah pesanan yang benar-benar diberikan.",
      },
    ],
  },

  {
    id: "function-return",
    courseId: "pemrograman-dasar",
    moduleId: "function",
    title: "Return Value",
    description:
      "Memahami cara function mengembalikan sebuah nilai.",
    duration: "8 menit",
    type: "Materi",
    sections: [
      {
        title: "Return",
        content:
          "Return digunakan untuk mengembalikan sebuah nilai dari function kepada bagian program yang memanggilnya.",
      },
      {
        title: "Contoh Penggunaan",
        content:
          "Sebuah function dapat menerima dua angka, menjumlahkannya, kemudian mengembalikan hasil penjumlahan tersebut.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Function menerima sesuatu, mengerjakannya, lalu return mengirimkan hasilnya kembali.",
      },
    ],
  },

  // ==========================================
  // MODULE 07 — ARRAY
  // ==========================================

  {
    id: "array-dasar",
    courseId: "pemrograman-dasar",
    moduleId: "array",
    title: "Array Dasar",
    description:
      "Memahami array sebagai struktur untuk menyimpan banyak nilai dalam satu variabel.",
    duration: "9 menit",
    type: "Materi",
    sections: [
      {
        title: "Apa itu Array?",
        content:
          "Array adalah struktur data yang dapat menyimpan beberapa nilai dalam satu variabel.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Jika variabel biasa seperti satu kotak, array seperti satu rak yang memiliki banyak tempat untuk menyimpan data.",
      },
      {
        title: "Contoh",
        content:
          "Array dapat digunakan untuk menyimpan daftar nama mahasiswa, daftar nilai, atau daftar produk.",
      },
    ],
  },

  {
    id: "akses-array",
    courseId: "pemrograman-dasar",
    moduleId: "array",
    title: "Mengakses Data Array",
    description:
      "Belajar mengambil nilai tertentu dari dalam array.",
    duration: "8 menit",
    type: "Materi",
    sections: [
      {
        title: "Index Array",
        content:
          "Setiap data dalam array memiliki posisi yang disebut index. Dalam banyak bahasa pemrograman, index dimulai dari angka 0.",
      },
      {
        title: "Contoh",
        content:
          "Jika array memiliki data A, B, dan C, maka A berada pada index 0, B pada index 1, dan C pada index 2.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Index seperti nomor kursi yang digunakan untuk menemukan posisi data tertentu.",
      },
    ],
  },

  {
    id: "perulangan-array",
    courseId: "pemrograman-dasar",
    moduleId: "array",
    title: "Perulangan Array",
    description:
      "Menggunakan perulangan untuk memproses setiap data dalam array.",
    duration: "10 menit",
    type: "Materi",
    sections: [
      {
        title: "Mengapa Menggunakan Loop?",
        content:
          "Loop memungkinkan kita memproses banyak data dalam array tanpa harus menulis instruksi yang sama untuk setiap elemen.",
      },
      {
        title: "Contoh",
        content:
          "Kita dapat menggunakan for untuk membaca setiap nama mahasiswa yang terdapat dalam array.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Daripada membuka setiap kotak satu per satu secara manual, loop membantu kita memeriksa semua kotak secara otomatis.",
      },
    ],
  },

  // ==========================================
  // MODULE 08 — MINI PROJECT
  // ==========================================

  {
    id: "analisis-masalah",
    courseId: "pemrograman-dasar",
    moduleId: "mini-project",
    title: "Analisis Masalah",
    description:
      "Belajar memahami masalah sebelum mulai membuat program.",
    duration: "10 menit",
    type: "Project",
    sections: [
      {
        title: "Kenapa Analisis Penting?",
        content:
          "Program yang baik dimulai dari pemahaman masalah yang jelas. Sebelum menulis kode, kita perlu mengetahui input, proses, dan output yang dibutuhkan.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Jangan langsung coding. Pahami dulu masalah yang ingin diselesaikan, siapa yang menggunakan program, dan hasil apa yang diharapkan.",
      },
      {
        title: "Contoh",
        content:
          "Jika membuat program menghitung nilai mahasiswa, tentukan terlebih dahulu nilai apa saja yang diperlukan dan bagaimana hasil akhirnya dihitung.",
      },
    ],
  },

  {
    id: "membuat-algoritma-project",
    courseId: "pemrograman-dasar",
    moduleId: "mini-project",
    title: "Membuat Algoritma",
    description:
      "Mengubah masalah menjadi langkah-langkah penyelesaian yang terstruktur.",
    duration: "12 menit",
    type: "Project",
    sections: [
      {
        title: "Dari Masalah ke Algoritma",
        content:
          "Setelah masalah dipahami, buat urutan langkah yang dapat digunakan untuk menghasilkan solusi.",
      },
      {
        title: "Gunakan Flowchart",
        content:
          "Flowchart dapat membantu melihat alur program sebelum implementasi dilakukan.",
      },
      {
        title: "Quick Check",
        content:
          "Pastikan setiap langkah memiliki tujuan yang jelas dan menghasilkan alur yang dapat dijalankan dari awal sampai akhir.",
      },
    ],
  },

  {
    id: "implementasi-program",
    courseId: "pemrograman-dasar",
    moduleId: "mini-project",
    title: "Implementasi Program",
    description:
      "Menerjemahkan algoritma menjadi program sederhana.",
    duration: "15 menit",
    type: "Project",
    sections: [
      {
        title: "Mulai Coding",
        content:
          "Setelah algoritma selesai, terjemahkan setiap langkah menjadi sintaks bahasa pemrograman yang digunakan.",
      },
      {
        title: "Testing",
        content:
          "Jalankan program dengan beberapa input berbeda untuk memastikan hasilnya sesuai dengan yang diharapkan.",
      },
      {
        title: "Pahami Sederhananya",
        content:
          "Algoritma adalah rencana, sedangkan coding adalah proses mengubah rencana tersebut menjadi sesuatu yang dapat dijalankan komputer.",
      },
    ],
  },
];

export default materials;