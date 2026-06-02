/* Flat emerald Tasker mark — matches favicon + landing page */
export default function LogoMark({ size = 28 }) {
  return (
    <span className="app-logo-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 32 32" fill="none">
        <path
          d="M9.5 16.5l4.2 4.2L22.5 11.5"
          stroke="#fff"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
