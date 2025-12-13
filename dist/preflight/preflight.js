export function generatePreflight() {
    return `
@layer base {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  html {
    line-height: 1.15; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }
  body {
    margin: 0; /* 1 */
    line-height: inherit; /* 2 */
    text-rendering: optimizeSpeed; /* 3 */
    -webkit-font-smoothing: antialiased; /* 4 */
    -moz-osx-font-smoothing: grayscale; /* 5 */
  }
  hr {
    height: 0;
    color: inherit; /* 1 */
    border-top-width: 1px; /* 2 */
  }
  abbr:where([title]) {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
    -webkit-text-decoration-skip-ink: none;
    text-decoration-skip-ink: none;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  ol,
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ol {
    padding-left: 1.5em;
  }
  ul {
    padding-left: 1.5em;
  }
  dt {
    font-weight: bold;
  }
  dd {
    margin: 0;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }
  img,
  svg,
  video,
  canvas,
  audio,
  iframe,
  embed,
  object {
    display: block; /* 1 */
    vertical-align: middle; /* 2 */
  }
  img,
  video {
    max-width: 100%;
    height: auto;
  }
  table {
    text-indent: 0; /* 1 */
    border-color: inherit; /* 2 */
    border-collapse: collapse; /* 3 */
  }
  button,
  [role="button"] {
    cursor: pointer;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit; /* 1 */
    font-size: 100%; /* 1 */
    line-height: inherit; /* 1 */
    color: inherit; /* 1 */
    margin: 0; /* 2 */
    border-width: 0; /* 3 */
    padding: 0; /* 3 */
  }
  button,
  select {
    text-transform: none;
  }
  button,
  [type='button'],
  [type='reset'],
  [type='submit'] {
    -webkit-appearance: button; /* 2 */
    background-color: transparent; /* 3 */
    background-image: none; /* 4 */
  }
  button:focus {
    outline: 1px dotted;
    outline: 5px auto -webkit-focus-ring-color;
  }
  input::placeholder,
  textarea::placeholder {
    color: inherit;
    opacity: 0.5;
  }
  button,
  [role="button"] {
    cursor: pointer;
  }
  :-moz-focusring {
    outline: auto;
  }
  select {
    background-color: transparent;
  }
  select:not([size]):not([multiple]) {
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari and Chrome */
    appearance: none; /* Modern browsers */
  }
  select::-ms-expand {
    display: none; /* IE 10+ */
  }
  [type='search'] {
    -webkit-appearance: textfield; /* 1 */
    outline-offset: -2px; /* 2 */
  }
  [type='search']::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-file-upload-button {
    -webkit-appearance: button; /* 1 */
    font: inherit; /* 2 */
  }
  [hidden] {
    display: none;
  }
  /* Additional Tailwind-like resets */
  [type='text'],
  [type='email'],
  [type='url'],
  [type='password'],
  [type='number'],
  [type='date'],
  [type='datetime-local'],
  [type='month'],
  [type='search'],
  [type='tel'],
  [type='time'],
  [type='week'],
  [multiple],
  textarea,
  select {
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid;
    border-radius: 0;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    line-height: inherit;
    color: #374151;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  input[type='file'] {
    background: transparent none repeat 0 0 / auto size;
    cursor: pointer;
  }
  input[type='file']:focus {
    outline: 1px dotted #000;
    outline: 5px auto -webkit-focus-ring-color;
  }
  fieldset {
    margin: 0;
    padding: 0.35em 0 0.75em;
    border: 1px solid #c0c0c0;
  }
  legend {
    padding: 0;
    border: 0;
  }
  label {
    display: block;
    margin: 0 0 0.5rem;
  }
  /* Focus styles */
  *:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  /* Placeholder color */
  input::placeholder,
  textarea::placeholder {
    opacity: 1;
    color: #9ca3af;
  }
  /* Line height for body */
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 1rem;
  }
}
`;
}
// Export for use in the main Garur setup
export default { generatePreflight };
