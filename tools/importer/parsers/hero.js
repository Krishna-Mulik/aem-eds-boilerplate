
/* global WebImporter */

/**
 * Hero / banner parser.
 * Handles the top full-width banner section which typically contains
 * a background image, headline, sub-headline and a CTA link.
 *
 * Because the source page is client-rendered the exact class names are
 * unknown at authoring time; the selector passed in from the orchestrator
 * is therefore intentionally broad.  We do our best to pull the most
 * meaningful child nodes and fall back gracefully when they are absent.
 */
export default function parse(element, { document }) {
  // --- headline ---
  const heading =
    element.querySelector('h1, h2, [class*="title"], [class*="heading"], [class*="banner-text"]') ||
    (() => {
      const h = document.createElement('h1');
      h.textContent = element.textContent.trim().slice(0, 120) || 'Welcome';
      return h;
    })();

  // --- sub-text / description ---
  const sub =
    element.querySelector('p, [class*="subtitle"], [class*="description"], [class*="tagline"]');

  // --- CTA link ---
  const cta = element.querySelector('a[href]');

  // --- background / hero image ---
  // Could be an <img> tag or a CSS background-image on the element itself
  let img = element.querySelector('img');
  if (!img) {
    const style = element.getAttribute('style') || '';
    const bgMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    if (bgMatch) {
      img = document.createElement('img');
      img.src = bgMatch[1];
      img.alt = 'Hero background';
    }
  }

  // Build content cell — combine whatever we found
  const contentWrapper = document.createElement('div');
  if (img) contentWrapper.appendChild(img);
  if (heading) contentWrapper.appendChild(heading);
  if (sub) contentWrapper.appendChild(sub);
  if (cta) contentWrapper.appendChild(cta);

  const cells = [
    ['Hero'],
    [contentWrapper],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
