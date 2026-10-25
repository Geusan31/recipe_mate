import { Link } from "react-router-dom";

const groups = [
  {
    title: "Jelajahi",
    links: [
      { to: "/resep", label: "Resep" },
      { to: "/kategori", label: "Kategori" },
      { to: "/masak-dengan-bahan", label: "Masak Dengan Bahan" },
      { to: "/perencana-makan", label: "Perencana Makan" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { to: "/tentang", label: "Tentang" },
      { to: "/kontak", label: "Kontak" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privasi", label: "Kebijakan Privasi" },
      { to: "/syarat", label: "Syarat & Ketentuan" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white px-4 pb-6 pt-16 print:hidden">
      <div className="mx-auto mb-12 max-w-[1200px] md:flex md:items-center md:justify-between md:text-left">
        <p className="mb-3 text-2xl font-extrabold tracking-tight text-amber-600">
          RecipeMate
        </p>
        <p className="max-w-[350px] text-gray-600 md:text-right">
          Temukan inspirasi masakan baru setiap hari. Dari dapur sederhana
          hingga sajian spesial — semua ada di RecipeMate.
        </p>
      </div>

      <nav className="mx-auto mb-16 grid max-w-[1200px] gap-10 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        {groups.map((group) => (
          <section key={group.title}>
            <h3 className="mb-5 text-lg font-bold text-gray-800">
              {group.title}
            </h3>
            <ul className="flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <div className="mx-auto max-w-[1200px] border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
        <small>
          &copy; {new Date().getFullYear()} RecipeMate. Hak cipta dilindungi.
        </small>
      </div>
    </footer>
  );
}
