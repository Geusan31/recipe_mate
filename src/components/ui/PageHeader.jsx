export default function PageHeader({
  title,
  description,
  boxed = false,
  center = false,
  children,
}) {
  return (
    <section
      className={`mb-12 ${boxed ? "rounded-lg border border-gray-200 bg-white px-4 py-16" : ""} ${
        center ? "text-center" : ""
      }`}
    >
      <h1 className="mb-3 text-4xl font-extrabold leading-[1.2] text-gray-800">
        {title}
      </h1>
      {description && (
        <p
          className={`text-lg text-gray-600 ${center ? "mx-auto max-w-[700px]" : "max-w-[700px]"}`}
        >
          {description}
        </p>
      )}
      {children}
    </section>
  );
}
