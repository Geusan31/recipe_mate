import { Link } from "react-router-dom";

const variants = {
  primary:
    "inline-block rounded bg-amber-600 px-5 py-2.5 font-semibold text-white hover:bg-amber-700 hover:text-white",
  outline:
    "inline-block rounded border border-gray-200 bg-white px-5 py-2.5 font-semibold text-gray-800 hover:border-amber-600 hover:text-amber-600",
  light:
    "block rounded border border-gray-200 bg-bg-body p-3 text-center font-semibold hover:border-amber-600 hover:bg-amber-600 hover:text-white",
};

export default function Button({
  to,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const classes = `${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
