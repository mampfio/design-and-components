// Renders the Tokens page from design/tokens.json, the design system's only source of values.
// The WebJar's scripts/generate-tokens.mjs turns the same file into CSS; this only documents it.
const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const themed = (v) => (typeof v === "string" ? { light: v, dark: v } : v);
const swatch = (colour) => `<span class="swatch" style="background:${escapeHtml(colour)}"></span>${escapeHtml(colour)}`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const code = (s) => `<code>${escapeHtml(s)}</code>`;

export function tokensPage(tokens) {
  const colours = table(
    ["Token", "Light", "Dark", "Use"],
    tokens.color.tokens.map((t) => {
      const v = themed(t.value);
      return [code(`--${t.name}`), swatch(v.light), swatch(v.dark), escapeHtml(t.usage ?? "")];
    }),
  );

  const families = table(
    ["Family", "Variable", "Stack"],
    Object.entries(tokens.type.families).map(([key, stack]) => [code(key), code(`--font-${key}`), code(stack)]),
  );

  const styles = tokens.type.groups
    .flatMap((g) => g.styles.map((s) => ({ ...s, family: s.family ?? g.family })))
    .map((s) => [
      `<span style="font: var(--text-${escapeHtml(s.name)})${s.letterSpacing ? `; letter-spacing: ${escapeHtml(s.letterSpacing)}` : ""}">${escapeHtml(s.sample ?? s.name)}</span>`,
      `${code(`.mf-${s.name}`)}<br>${code(`--text-${s.name}`)}`,
      `${escapeHtml(s.fontSize)} / ${escapeHtml(s.lineHeight)}, ${escapeHtml(s.fontWeight)}${s.letterSpacing ? `, ${escapeHtml(s.letterSpacing)}` : ""}<br>${code(s.family)}`,
      escapeHtml(s.usage ?? ""),
    ]);

  const simple = (group, preview) =>
    table(
      ["Token", "Value", "", "Use"],
      tokens[group].tokens.map((t) => [code(`--${t.name}`), code(t.value), preview(t), escapeHtml(t.usage ?? "")]),
    );
  const shadows = table(
    ["Token", "Light", "Dark", "Use"],
    tokens.shadow.tokens.map((t) => {
      const v = themed(t.value);
      return [code(`--${t.name}`), code(v.light), code(v.dark), escapeHtml(t.usage ?? "")];
    }),
  );

  return `<h1>Tokens</h1>
<p>Every value of the Mampfio design system, from <code>design/tokens.json</code>. Pages that load the WebJar get them as CSS custom properties: <code>color: var(--ink)</code>, <code>padding: var(--space-4)</code>, <code>font: var(--text-body)</code>. Colours switch with <code>data-theme</code>; everything else is the same in both themes.</p>
<h2>Colour</h2>
${colours}
<h2>Type</h2>
${table(["Sample", "Class and variable", "Size / line, weight", "Use"], styles)}
<h3>Families</h3>
${families}
<h2>Spacing</h2>
${simple("spacing", (t) => `<span class="bar" style="width:${escapeHtml(t.value)}"></span>`)}
<h2>Radius</h2>
${simple("radius", (t) => `<span class="corner" style="border-radius:${escapeHtml(t.value)}"></span>`)}
<h2>Shadow</h2>
${shadows}`;
}
