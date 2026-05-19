
/* global WebImporter */
export default function parse(element, { document }) {
  const anchor = element.querySelector('a');
  if (!anchor) return;

  const linkEl = anchor.cloneNode(true);

  const cells = [
    ['CTA Banner'],
    [linkEl],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
