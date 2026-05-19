
/* global WebImporter */

/**
 * Cards parser.
 * Converts a grid / list of fund-product cards (or any repeated card
 * pattern) into an AEM EDS Cards block table.
 *
 * Each card row becomes:  [ image | heading + body + link ]
 * If no image is present the cell is left empty so the block still
 * renders correctly.
 */
export default function parse(element, { document }) {
  // Try common card child selectors; fall back to direct children
  const cardItems = [
    ...element.querySelectorAll(
      '[class*="card"], [class*="item"], [class*="fund"], [class*="product"], article, li'
    ),
  ];

  // If the heuristic found nothing useful, treat each direct child as a card
  const items =
    cardItems.length > 0
      ? cardItems
      : [...element.children];

  if (items.length === 0) {
    // Nothing to convert — leave element untouched
    return;
  }

  const rows = [['Cards']];

  items.forEach((card) => {
    const img = card.querySelector('img') || null;

    // Text container
    const textWrapper = document.createElement('div');

    const title =
      card.querySelector('h2, h3, h4, [class*="title"], [class*="name"], [class*="heading"]');
    const body =
      card.querySelector('p, [class*="desc"], [class*="body"], [class*="text"]');
    const link = card.querySelector('a[href]');

    if (title) textWrapper.appendChild(title.cloneNode(true));
    if (body) textWrapper.appendChild(body.cloneNode(true));
    if (link) textWrapper.appendChild(link.cloneNode(true));

    // If we couldn't find structured children, use raw text
    if (!title && !body && !link) {
      const p = document.createElement('p');
      p.textContent = card.textContent.trim().slice(0, 200);
      textWrapper.appendChild(p);
    }

    if (img) {
      rows.push([img.cloneNode(true), textWrapper]);
    } else {
      rows.push([textWrapper]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
