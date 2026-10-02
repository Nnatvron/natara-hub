const quizzes = [
  {
    id: "quiz-algoritma-dasar",
    materialId: "algoritma-dasar",
    questions: [
      {
        question:
          "Apa yang dimaksud dengan algoritma dalam pemrograman?",
        options: [
          "Langkah-langkah sistematis untuk menyelesaikan masalah",
          "Bahasa pemrograman tertentu",
          "Perangkat keras komputer",
          "Sistem operasi komputer",
        ],
        answer:
          "Langkah-langkah sistematis untuk menyelesaikan masalah",
        explanation:
          "Algoritma adalah serangkaian langkah yang tersusun secara logis dan sistematis untuk menyelesaikan suatu masalah.",
      },
      {
        question:
          "Jika sebuah program ingin menentukan apakah angka merupakan bilangan genap, konsep apa yang paling tepat digunakan?",
        options: [
          "Memeriksa sisa pembagian angka dengan 2",
          "Mengubah angka menjadi teks",
          "Menghapus angka dari variabel",
          "Menggunakan array",
        ],
        answer:
          "Memeriksa sisa pembagian angka dengan 2",
        explanation:
          "Bilangan genap memiliki sisa 0 ketika dibagi 2. Dalam JavaScript, pengecekan ini dapat dilakukan menggunakan operator modulus (%).",
      },
      {
        question:
          "Apa tujuan utama membuat algoritma sebelum menulis kode?",
        options: [
          "Mempermudah perancangan solusi",
          "Mempercepat koneksi internet",
          "Mengurangi kapasitas RAM",
          "Menghapus kebutuhan komputer",
        ],
        answer:
          "Mempermudah perancangan solusi",
        explanation:
          "Algoritma membantu programmer memahami dan merancang solusi sebelum menerapkannya ke dalam kode program.",
      },
      {
        question:
          "Manakah yang merupakan contoh algoritma sederhana?",
        options: [
          "Langkah membuat teh dari awal sampai selesai",
          "Nama sebuah komputer",
          "Ukuran monitor",
          "Jenis kabel jaringan",
        ],
        answer:
          "Langkah membuat teh dari awal sampai selesai",
        explanation:
          "Algoritma dapat ditemukan dalam aktivitas sehari-hari selama terdapat langkah-langkah terurut untuk mencapai tujuan tertentu.",
      },
      {
        question:
          "Dalam algoritma, mengapa langkah harus disusun secara berurutan?",
        options: [
          "Agar proses dapat dilakukan secara logis",
          "Agar komputer menjadi lebih besar",
          "Agar program tidak membutuhkan input",
          "Agar semua data menjadi teks",
        ],
        answer:
          "Agar proses dapat dilakukan secara logis",
        explanation:
          "Urutan langkah yang benar membantu memastikan proses berjalan sesuai tujuan dan menghasilkan output yang diharapkan.",
      },
    ],
  },

  {
    id: "quiz-flowchart-dasar",
    materialId: "flowchart-dasar",
    questions: [
      {
        question:
          "Apa fungsi utama flowchart?",
        options: [
          "Menggambarkan alur proses secara visual",
          "Menyimpan database",
          "Menggantikan sistem operasi",
          "Menghapus kode program",
        ],
        answer:
          "Menggambarkan alur proses secara visual",
        explanation:
          "Flowchart digunakan untuk menggambarkan alur algoritma atau proses secara visual.",
      },
      {
        question:
          "Simbol apa yang biasanya digunakan untuk menunjukkan proses?",
        options: [
          "Persegi panjang",
          "Lingkaran",
          "Segitiga",
          "Garis putus-putus",
        ],
        answer: "Persegi panjang",
        explanation:
          "Dalam flowchart standar, persegi panjang digunakan untuk menunjukkan sebuah proses atau instruksi.",
      },
      {
        question:
          "Simbol diamond pada flowchart biasanya digunakan untuk apa?",
        options: [
          "Decision atau percabangan",
          "Input data",
          "Output data",
          "Awal program",
        ],
        answer: "Decision atau percabangan",
        explanation:
          "Diamond digunakan untuk menunjukkan kondisi atau keputusan yang biasanya menghasilkan cabang seperti Ya/Tidak.",
      },
      {
        question:
          "Apa fungsi garis panah pada flowchart?",
        options: [
          "Menunjukkan arah alur proses",
          "Menunjukkan ukuran program",
          "Menyimpan data",
          "Menghapus proses",
        ],
        answer: "Menunjukkan arah alur proses",
        explanation:
          "Panah membantu menunjukkan urutan dan arah perpindahan dari satu proses ke proses lainnya.",
      },
      {
        question:
          "Flowchart biasanya dibuat sebelum coding karena...",
        options: [
          "Membantu memahami alur program",
          "Menggantikan bahasa pemrograman",
          "Membuat komputer lebih cepat",
          "Menghilangkan semua error",
        ],
        answer: "Membantu memahami alur program",
        explanation:
          "Flowchart membantu programmer memvisualisasikan logika sebelum diterjemahkan menjadi kode.",
      },
    ],
  },

  {
    id: "quiz-pseudocode",
    materialId: "pseudocode",
    questions: [
      {
        question:
          "Apa tujuan utama pseudocode?",
        options: [
          "Merancang logika program dengan bahasa sederhana",
          "Menghubungkan komputer ke internet",
          "Mengganti sistem operasi",
          "Menyimpan database",
        ],
        answer:
          "Merancang logika program dengan bahasa sederhana",
        explanation:
          "Pseudocode digunakan untuk merancang logika program tanpa terikat aturan sintaks bahasa pemrograman tertentu.",
      },
      {
        question:
          "Pseudocode biasanya menggunakan bahasa yang...",
        options: [
          "Mudah dipahami manusia",
          "Hanya dapat dipahami komputer",
          "Selalu berupa angka",
          "Selalu berupa kode mesin",
        ],
        answer: "Mudah dipahami manusia",
        explanation:
          "Pseudocode dibuat agar logika program mudah dibaca dan dipahami oleh manusia.",
      },
      {
        question:
          "Apakah pseudocode harus mengikuti sintaks JavaScript?",
        options: [
          "Tidak",
          "Ya",
          "Hanya saat menggunakan browser",
          "Hanya saat menggunakan HTML",
        ],
        answer: "Tidak",
        explanation:
          "Pseudocode tidak terikat pada sintaks bahasa pemrograman tertentu.",
      },
      {
        question:
          "Manakah contoh pseudocode yang benar?",
        options: [
          "INPUT nama → OUTPUT nama",
          "npm install react",
          "<html></html>",
          "SELECT * FROM users",
        ],
        answer: "INPUT nama → OUTPUT nama",
        explanation:
          "Pseudocode menggunakan instruksi sederhana untuk menggambarkan logika program.",
      },
      {
        question:
          "Apa keuntungan menggunakan pseudocode?",
        options: [
          "Mempermudah perencanaan program",
          "Meningkatkan kapasitas hard disk",
          "Mempercepat internet",
          "Mengganti kebutuhan testing",
        ],
        answer: "Mempermudah perencanaan program",
        explanation:
          "Pseudocode membantu programmer fokus pada logika sebelum memikirkan detail sintaks.",
      },
    ],
  },

  {
    id: "quiz-variabel-dasar",
    materialId: "variabel-dasar",
    questions: [
      {
        question:
          "Apa fungsi utama variabel dalam sebuah program?",
        options: [
          "Menyimpan dan mengelola data",
          "Menghapus sistem operasi",
          "Menghubungkan komputer ke internet",
          "Menggambar flowchart",
        ],
        answer: "Menyimpan dan mengelola data",
        explanation:
          "Variabel digunakan sebagai tempat untuk menyimpan nilai yang dapat digunakan oleh program.",
      },
      {
        question:
          "Manakah contoh deklarasi variabel JavaScript yang benar?",
        options: [
          "let nama = 'Natar';",
          "variable nama = Natar;",
          "data nama Natar;",
          "create nama = Natar;",
        ],
        answer: "let nama = 'Natar';",
        explanation:
          "JavaScript menggunakan let, const, atau var untuk mendeklarasikan variabel.",
      },
      {
        question:
          "Apa perbedaan utama let dan const?",
        options: [
          "Nilai let dapat diubah, sedangkan const tidak dapat di-assign ulang",
          "const hanya untuk angka",
          "let hanya untuk teks",
          "Tidak ada perbedaan",
        ],
        answer:
          "Nilai let dapat diubah, sedangkan const tidak dapat di-assign ulang",
        explanation:
          "let dapat diberikan nilai baru, sedangkan const tidak dapat di-assign ulang setelah deklarasi.",
      },
      {
        question:
          "Manakah yang merupakan nama variabel yang valid?",
        options: [
          "namaMahasiswa",
          "123nama",
          "nama mahasiswa",
          "const",
        ],
        answer: "namaMahasiswa",
        explanation:
          "Nama variabel tidak boleh diawali angka, tidak boleh mengandung spasi, dan tidak boleh menggunakan reserved keyword.",
      },
      {
        question:
          "Apa output dari kode `let umur = 18; console.log(umur);`?",
        options: [
          "18",
          "umur",
          "Error",
          "Tidak ada output",
        ],
        answer: "18",
        explanation:
          "console.log(umur) menampilkan nilai yang tersimpan di dalam variabel umur.",
      },
    ],
  },

  {
    id: "quiz-tipe-data",
    materialId: "tipe-data",
    questions: [
      {
        question:
          "Manakah yang termasuk tipe data untuk menyimpan teks?",
        options: [
          "String",
          "Boolean",
          "Number",
          "Array",
        ],
        answer: "String",
        explanation:
          "String digunakan untuk menyimpan data berupa teks atau kumpulan karakter.",
      },
      {
        question:
          "Tipe data Boolean biasanya memiliki nilai...",
        options: [
          "true atau false",
          "0 sampai 100",
          "Teks panjang",
          "Array angka",
        ],
        answer: "true atau false",
        explanation:
          "Boolean hanya memiliki dua nilai logika, yaitu true dan false.",
      },
      {
        question:
          "Angka 25 dalam JavaScript termasuk tipe data...",
        options: [
          "Number",
          "String",
          "Boolean",
          "Object",
        ],
        answer: "Number",
        explanation:
          "Nilai numerik seperti 25 termasuk tipe data Number.",
      },
      {
        question:
          "Nilai `'18'` berbeda dengan `18` karena...",
        options: [
          "'18' adalah String sedangkan 18 adalah Number",
          "Keduanya selalu sama",
          "'18' adalah Boolean",
          "18 adalah String",
        ],
        answer:
          "'18' adalah String sedangkan 18 adalah Number",
        explanation:
          "Tanda kutip membuat 18 menjadi data teks atau String.",
      },
      {
        question:
          "Tipe data yang digunakan untuk menyimpan kumpulan nilai adalah...",
        options: [
          "Array",
          "Boolean",
          "Number",
          "String",
        ],
        answer: "Array",
        explanation:
          "Array digunakan untuk menyimpan beberapa nilai dalam satu struktur data.",
      },
    ],
  },

  {
    id: "quiz-input-output",
    materialId: "input-output",
    questions: [
      {
        question:
          "Urutan konsep dasar sebuah program yang paling umum adalah...",
        options: [
          "Input → Process → Output",
          "Output → Input → Process",
          "Process → Output → Input",
          "Input → Output → Process",
        ],
        answer: "Input → Process → Output",
        explanation:
          "Program biasanya menerima input, memproses data tersebut, lalu menghasilkan output.",
      },
      {
        question:
          "Apa yang dimaksud dengan input?",
        options: [
          "Data yang diberikan kepada program",
          "Hasil akhir program",
          "Error program",
          "File sistem operasi",
        ],
        answer: "Data yang diberikan kepada program",
        explanation:
          "Input adalah data atau informasi yang diterima oleh program untuk diproses.",
      },
      {
        question:
          "Apa yang dimaksud dengan output?",
        options: [
          "Hasil yang dihasilkan setelah proses",
          "Data sebelum diproses",
          "Nama variabel",
          "Bahasa pemrograman",
        ],
        answer: "Hasil yang dihasilkan setelah proses",
        explanation:
          "Output merupakan hasil yang diberikan program setelah melakukan proses terhadap input.",
      },
      {
        question:
          "Dalam program kalkulator, angka yang dimasukkan pengguna merupakan...",
        options: [
          "Input",
          "Output",
          "Process",
          "Database",
        ],
        answer: "Input",
        explanation:
          "Angka yang dimasukkan pengguna menjadi data awal yang akan diproses oleh program.",
      },
      {
        question:
          "Hasil `console.log(10 + 5)` merupakan...",
        options: [
          "15",
          "10 + 5",
          "Error",
          "5",
        ],
        answer: "15",
        explanation:
          "Program melakukan proses penjumlahan 10 + 5 dan menghasilkan output 15.",
      },
    ],
  },
];

export default quizzes;