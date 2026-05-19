
/* global WebImporter */
export default function parse(element, { document }) {
  const headingEl = element.querySelector('h3');
  const heading = headingEl ? headingEl.textContent.trim() : 'INVESTMENT PHILOSOPHY';

  const bodyEl = element.querySelector('p');
  const bodyClone = bodyEl ? bodyEl.cloneNode(true) : document.createElement('p');

  const readMoreLink = element.querySelector('a');
  const readMoreHref = readMoreLink ? readMoreLink.getAttribute('href') : '/Home/investmentphilosophy';

  // Extract background image from inline style
  const bgContainer = element.querySelector('[style*="background-image"]');
  let bgUrl = '';
  if (bgContainer) {
    const styleVal = bgContainer.getAttribute('style') || '';
    const match = styleVal.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    if (match) bgUrl = match[1];
  }

  const headingCell = document.createElement('p');
  headingCell.textContent = heading;

  const readMoreCell = document.createElement('p');
  readMoreCell.textContent = readMoreHref;

  const bgCell = document.createElement('p');
  bgCell.textContent = bgUrl;

  const cells = [
    ['Philosophy Banner'],
    [headingCell, bodyClone, readMoreCell, bgCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
