import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Toast from "../ui/Toast";

export default function Layout() {
  const { pathname } = useLocation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      setShowTop(window.scrollY > 400);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-10 print:max-w-none print:p-0">
        <Outlet />
      </main>
      <Footer />
      {showTop && (
        <button
          type="button"
          aria-label="Kembali ke atas"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 z-[90] rounded border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-800 hover:border-amber-600 print:hidden"
        >
          ↑
        </button>
      )}
      <Toast />
    </div>
  );
}
