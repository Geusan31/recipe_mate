import PageHeader from "../components/ui/PageHeader";
import { legalPages } from "../data/legal";

export default function LegalPage({ type }) {
  const page = legalPages[type];

  return (
    <>
      <PageHeader title={page.title} description={page.description} />

      <nav aria-label="Daftar isi" className="mb-16 max-w-[760px] rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Daftar Isi</h2>
        <ul className="flex flex-col gap-2">
          {page.sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-amber-600">
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <article className="max-w-[800px]">
        {page.sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-16 scroll-mt-24">
            <h2 className="mb-4 text-2xl font-bold">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-4 text-gray-600">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </>
  );
}
