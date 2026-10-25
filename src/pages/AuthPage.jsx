import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { useApp } from "../context/useApp";

const emptyForm = { name: "", email: "", password: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage({ mode }) {
  return <AuthForm key={mode} mode={mode} />;
}

function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, toast } = useApp();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate() {
    const next = {};

    if (isRegister && !form.name.trim()) next.name = "Nama tidak boleh kosong";
    if (!emailPattern.test(form.email.trim())) next.email = "Format email belum benar";
    if (form.password.length < (isRegister ? 8 : 6)) {
      next.password = `Kata sandi minimal ${isRegister ? 8 : 6} karakter`;
    }

    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      toast(Object.values(nextErrors)[0]);
      return;
    }

    const name = isRegister ? form.name.trim() : form.email.split("@")[0];
    login({ name, email: form.email.trim() });
    toast(
      isRegister
        ? `Akun berhasil dibuat. Selamat datang, ${name}!`
        : "Berhasil masuk. Selamat memasak!",
    );
    navigate("/", { replace: true });
  }

  return (
    <>
      <PageHeader
        boxed
        center
        title={isRegister ? "Buat Akun" : "Masuk"}
        description={
          isRegister
            ? "Daftar untuk menyimpan resep favorit dan merencanakan menu masakanmu."
            : "Masuk ke akun RecipeMate kamu untuk menyimpan resep favorit dan merencanakan menu masakan."
        }
      />

      <section className="mb-16">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex max-w-[480px] flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6"
        >
          {isRegister && (
            <div className="flex flex-col gap-2">
              <label htmlFor="auth-nama">Nama</label>
              <input
                id="auth-nama"
                name="nama"
                type="text"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Nama lengkap kamu"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="contoh@email.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="auth-password">Kata Sandi</label>
            <input
              id="auth-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              placeholder="Masukkan kata sandi"
              autoComplete={isRegister ? "new-password" : "current-password"}
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="self-start text-sm font-semibold text-amber-600 hover:underline"
            >
              {showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            </button>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <Button type="submit">{isRegister ? "Daftar" : "Masuk"}</Button>

          <p className="text-center text-gray-600">
            {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
            <Link to={isRegister ? "/login" : "/register"} className="font-semibold text-amber-600">
              {isRegister ? "Masuk di sini" : "Daftar di sini"}
            </Link>
          </p>
        </form>
      </section>
    </>
  );
}
