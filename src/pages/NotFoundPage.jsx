import EmptyState from "../components/ui/EmptyState";

export default function NotFoundPage() {
  return (
    <div className="py-10">
      <h1 className="sr-only">Halaman tidak ditemukan</h1>
      <EmptyState
        title="Halaman tidak ditemukan"
        description="Halaman yang kamu cari mungkin sudah dipindahkan atau tidak tersedia."
        actionLabel="Kembali ke Beranda"
        actionTo="/"
      />
    </div>
  );
}
