
/* global WebImporter */
export default function parse(element, { document }) {
  const p = element.querySelector('p');
  const textNode = p ? p.cloneNode(true) : element.cloneNode(true);

  const cells = [
    ['PMS Intro'],
    [textNode],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
