import { useEffect } from "react";
import { useApp } from "../../context/useApp";

export default function Toast() {
  const { toastMessage, clearToast } = useApp();

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(clearToast, 2400);
    return () => window.clearTimeout(timer);
  }, [toastMessage, clearToast]);

  if (!toastMessage) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 print:hidden"
    >
      <p className="rounded border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-800 shadow-[0_6px_18px_rgba(17,24,39,0.12)]">
        {toastMessage.text}
      </p>
    </div>
  );
}
