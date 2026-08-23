import "./StatCard.css";

/**
 * StatCard — one of the four top dashboard metrics.
 *
 * @param {object} props
 * @param {React.ComponentType} props.icon - a lucide-react icon component
 * @param {string} props.label - e.g. "Profile Completion"
 * @param {string|number} props.value - e.g. "85%" — pass real value from Supabase/AI service later
 * @param {string} [props.footer] - small helper text under the value
 * @param {string} [props.footerHref] - if set, footer renders as a link
 * @param {"violet"|"blue"|"teal"|"orange"} [props.accent] - color theme
 * @param {number} [props.progress] - optional 0–100, renders a thin progress bar
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  footer,
  footerHref,
  accent = "violet",
  progress,
}) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card-icon">
        <Icon size={20} strokeWidth={2} />
      </div>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value mono-stat">{value}</p>

      {typeof progress === "number" && (
        <div className="stat-card-progress">
          <div className="stat-card-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {footer &&
        (footerHref ? (
          <a href={footerHref} className="stat-card-footer stat-card-footer--link">
            {footer} →
          </a>
        ) : (
          <p className="stat-card-footer">{footer}</p>
        ))}
    </div>
  );
}
