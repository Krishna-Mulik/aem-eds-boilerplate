
/* global WebImporter */

/**
 * Columns parser.
 * Converts a two- or three-column layout section into an AEM EDS
 * Columns block table.  Each direct child that looks like a column
 * becomes one cell in a single row.
 *
 * Typical use-cases on this page:
 *   - "Why invest with us" split layout
 *   - Statistics / highlights bar
 *   - Contact / disclaimer split
 */
export default function parse(element, { document }) {
  // Prefer explicit column children; fall back to all direct children
  const colCandidates = [
    ...element.querySelectorAll(
      ':scope > [class*="col"], :scope > [class*="column"], :scope > [class*="cell"], :scope > div, :scope > section'
    ),
  ];

  const cols =
    colCandidates.length >= 2
      ? colCandidates
      : [...element.children];

  if (cols.length < 2) {
    // Single child — not really a columns block; skip
    return;
  }

  // Build one row with N cells
  const dataRow = cols.map((col) => {
    const wrapper = document.createElement('div');

    // Clone meaningful children: headings, paragraphs, images, links
    [...col.childNodes].forEach((node) => {
      wrapper.appendChild(node.cloneNode(true));
    });

    return wrapper;
  });

  const cells = [
    ['Columns'],
    dataRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
