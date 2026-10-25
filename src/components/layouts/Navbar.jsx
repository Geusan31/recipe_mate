import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "../../context/useApp";
import Button from "../ui/Button";

const links = [
  { to: "/", label: "Beranda", end: true },
  { to: "/resep", label: "Resep" },
  { to: "/kategori", label: "Kategori" },
  { to: "/masak-dengan-bahan", label: "Masak Dengan Bahan" },
  { to: "/perencana-makan", label: "Perencana Makan" },
  { to: "/favorit", label: "Favorit" },
];

function AuthActions({ user, onLogout, onNavigate, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {user ? (
        <>
          <span className="font-semibold text-gray-800">
            Hai, {user.name.split(" ")[0]}
          </span>
          <Button variant="outline" className="px-5 py-2" onClick={onLogout}>
            Keluar
          </Button>
        </>
      ) : (
        <>
          <Button
            to="/login"
            variant="outline"
            className="px-5 py-2"
            onClick={onNavigate}
          >
            Masuk
          </Button>
          <Button to="/register" className="px-5 py-2" onClick={onNavigate}>
            Daftar
          </Button>
        </>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, toast } = useApp();

  function handleLogout() {
    logout();
    setOpen(false);
    toast("Kamu sudah keluar");
  }

  return (
    <header className="sticky top-0 z-[100] border-b border-gray-200 bg-white print:hidden">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 p-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="text-2xl font-extrabold tracking-tight text-amber-600 lg:justify-self-start"
        >
          RecipeMate
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu-panel"
          aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
          onClick={() => setOpen((value) => !value)}
          className="flex flex-col items-center gap-1 rounded border border-gray-200 bg-white px-4 py-2 lg:hidden"
        >
          <span className="h-0.5 w-5 rounded bg-gray-800" />
          <span className="h-0.5 w-5 rounded bg-gray-800" />
          <span className="h-0.5 w-5 rounded bg-gray-800" />
        </button>

        <div
          id="menu-panel"
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-full flex-col gap-4 border-b border-gray-200 bg-white p-4 shadow-lg lg:static lg:col-start-2 lg:flex lg:flex-row lg:items-center lg:gap-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          <ul className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-center lg:gap-x-4 lg:gap-y-3 xl:gap-x-6">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold text-amber-600"
                      : "font-medium text-gray-800"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <AuthActions
            user={user}
            onLogout={handleLogout}
            onNavigate={() => setOpen(false)}
            className="border-t border-gray-200 pt-4 lg:hidden"
          />
        </div>

        <div className="hidden lg:col-start-3 lg:flex lg:justify-end">
          <AuthActions
            user={user}
            onLogout={handleLogout}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </nav>
    </header>
  );
}
