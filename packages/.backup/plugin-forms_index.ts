export default {
  name: "@garursaili/plugin-forms",
  version: "1.1.0",
  setup(api) {
    api.addAtRule(`@layer garur-forms {
      input:not([type="checkbox"]):not([type="radio"]), textarea, select {
        appearance: none;
        background-color: color-mix(in oklab, var(--garur-surface) 50%, transparent);
        border: 1px solid var(--garur-border-subtle);
        border-radius: 0.5rem;
        color: var(--garur-fg);
        font: inherit;
        padding: 0.625rem 0.875rem;
        transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
      }
      input:focus, textarea:focus, select:focus {
        outline: none;
        background-color: var(--garur-surface);
        border-color: var(--garur-primary);
        box-shadow: 0 0 0 4px color-mix(in oklab, var(--garur-primary) 15%, transparent), inset 0 1px 2px rgba(0,0,0,0.02);
      }
      input::placeholder, textarea::placeholder { color: var(--garur-muted); opacity: 0.6; }
      button { 
        transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1); 
        &:active { transform: scale(0.98); }
      }
    }`);
  },
};
