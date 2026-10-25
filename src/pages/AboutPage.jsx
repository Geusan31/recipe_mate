import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

const features = [
  {
    title: "Pencarian Resep",
    description: "Temukan resep berdasarkan nama masakan, bahan, atau kata kunci tertentu.",
    to: "/resep",
    action: "Jelajahi Resep",
  },
  {
    title: "Kategori Masakan",
    description: "Telusuri resep berdasarkan waktu makan, jenis hidangan, dan gaya masakan.",
    to: "/kategori",
    action: "Lihat Kategori",
  },
  {
    title: "Masak Dengan Bahan",
    description: "Pilih bahan yang sudah ada di dapur dan temukan resep yang bisa dibuat.",
    to: "/masak-dengan-bahan",
    action: "Pilih Bahan",
  },
  {
    title: "Resep Favorit",
    description: "Simpan resep pilihanmu agar mudah ditemukan kembali kapan saja.",
    to: "/favorit",
    action: "Buka Favorit",
  },
  {
    title: "Perencana Makan",
    description: "Susun menu sarapan, makan siang, dan makan malam untuk seminggu penuh.",
    to: "/perencana-makan",
    action: "Atur Menu",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Tentang RecipeMate"
        description="Platform pencarian dan eksplorasi resep masakan yang membantu kamu menemukan inspirasi memasak setiap hari."
      />

      <section className="mb-16 max-w-[800px]">
        <h2 className="mb-3 text-2xl font-bold">Apa Itu RecipeMate?</h2>
        <p className="mb-4 text-gray-600">
          RecipeMate hadir untuk menjawab pertanyaan yang sering muncul di benak kita setiap hari:
          masak apa ya hari ini?
        </p>
        <p className="text-gray-600">
          Di sini kamu bisa mencari resep berdasarkan nama masakan, menelusuri berdasarkan kategori,
          atau bahkan menemukan resep hanya dari bahan yang sudah ada di dapur. Tidak perlu repot
          membeli bahan khusus, RecipeMate membantu kamu memasak dengan apa yang sudah kamu punya.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-3 text-2xl font-bold">Fitur Utama</h2>
        <p className="mb-8 max-w-[700px] text-gray-600">
          Semua yang kamu butuhkan untuk merencanakan dan menikmati masakan sehari-hari.
        </p>
        <ul className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-6"
            >
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="mb-6 flex-1 text-gray-600">{feature.description}</p>
              <Button to={feature.to} variant="light">
                {feature.action}
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16 max-w-[800px]">
        <h2 className="mb-3 text-2xl font-bold">Untuk Siapa RecipeMate?</h2>
        <p className="text-gray-600">
          RecipeMate cocok untuk siapa saja yang ingin memasak lebih sering, lebih teratur, atau
          lebih percaya diri di dapur. Mulai dari mahasiswa yang baru belajar memasak, orang tua
          yang menyiapkan menu keluarga, hingga siapa pun yang ingin mengurangi kebingungan saat
          memilih menu harian.
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white px-4 py-12 text-center">
        <h2 className="mb-3 text-2xl font-bold">Siap Mulai Memasak?</h2>
        <p className="mx-auto mb-8 max-w-[600px] text-gray-600">
          Temukan resep yang sesuai dengan bahan dan selera kamu hari ini.
        </p>
        <Button to="/resep">Jelajahi Resep</Button>
      </section>
    </>
  );
}
