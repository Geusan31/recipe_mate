import { useState } from "react";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { useApp } from "../context/useApp";

const emptyForm = { name: "", email: "", subject: "", message: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const { toast } = useApp();

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate() {
    const next = {};

    if (!form.name.trim()) next.name = "Nama tidak boleh kosong";
    if (!emailPattern.test(form.email.trim())) next.email = "Format email belum benar";
    if (!form.subject.trim()) next.subject = "Subjek tidak boleh kosong";
    if (form.message.trim().length < 10) next.message = "Pesan minimal 10 karakter";

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

    setForm(emptyForm);
    setErrors({});
    toast("Pesan kamu sudah terkirim. Terima kasih!");
  }

  return (
    <>
      <PageHeader
        title="Hubungi Kami"
        description="Ada pertanyaan atau masukan tentang RecipeMate? Tulis pesanmu di bawah ini dan kami akan membacanya."
      />

      <section className="mb-16">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-[760px] rounded-lg border border-gray-200 bg-white p-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-nama">Nama</label>
              <input
                id="contact-nama"
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

            <div className="flex flex-col gap-2">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
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

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="contact-subjek">Subjek</label>
              <input
                id="contact-subjek"
                name="subjek"
                type="text"
                value={form.subject}
                onChange={(event) => update("subject", event.target.value)}
                placeholder="Topik pesan kamu"
                aria-invalid={Boolean(errors.subject)}
              />
              {errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="contact-pesan">Pesan</label>
              <textarea
                id="contact-pesan"
                name="pesan"
                rows={6}
                maxLength={1000}
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
                placeholder="Tulis pesanmu di sini..."
                aria-invalid={Boolean(errors.message)}
              />
              <div className="flex justify-between gap-4 text-sm text-gray-600">
                {errors.message ? (
                  <p className="text-red-600">{errors.message}</p>
                ) : (
                  <span>Minimal 10 karakter.</span>
                )}
                <span>{form.message.length}/1000</span>
              </div>
            </div>
          </div>

          <Button type="submit" className="mt-8">
            Kirim Pesan
          </Button>
        </form>
      </section>
    </>
  );
}
