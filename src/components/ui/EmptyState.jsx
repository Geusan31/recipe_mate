import Button from "./Button";

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-16 text-center">
      <h2 className="mb-2 text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-lg text-gray-600">{description}</p>
      {actionTo && (
        <Button
          to={actionTo}
          variant="light"
          className="mx-auto mt-6 max-w-[220px]"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
