export default {
  name: "@garursaili/plugin-forms",
  version: "2.0.0",
  setup(api) {
    api.addAtRule(`@layer garur-forms {
      input:not([type="checkbox"]):not([type="radio"]), textarea, select {
        appearance: none;
        background-color: color-mix(in oklab, var(--garur-surface) 50%, transparent);
        border: 1px solid var(--garur-border-subtle);
        border-radius: 0.75rem;
        color: var(--garur-fg);
        font: inherit;
        font-size: 0.9375rem;
        letter-spacing: -0.011em;
        padding: 0.75rem 1rem;
        transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.04);
      }
      input:focus, textarea:focus, select:focus {
        outline: none;
        background-color: var(--garur-surface);
        border-color: var(--garur-primary);
        box-shadow: 0 0 0 4px color-mix(in oklab, var(--garur-primary) 15%, transparent), inset 0 1px 0 rgba(255,255,255,0.6);
      }
      input::placeholder, textarea::placeholder { color: var(--garur-muted); opacity: 0.6; }
      button {
        transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
        &:active { transform: scale(0.97); }
      }
    }`);
  },
};
