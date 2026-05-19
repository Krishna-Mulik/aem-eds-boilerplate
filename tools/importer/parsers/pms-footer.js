
/* global WebImporter */
export default function parse(element, { document }) {
  // Primary nav links
  const primaryLinks = element.querySelectorAll('.width4 .floating-box a');
  const primaryCell = document.createElement('div');
  primaryLinks.forEach((link) => {
    const a = link.cloneNode(true);
    primaryCell.appendChild(a);
    primaryCell.appendChild(document.createTextNode(' | '));
  });

  // Legal / secondary links (footer-width section)
  const legalItems = element.querySelectorAll('.footer-width .floating-box');
  const legalCell = document.createElement('div');
  legalItems.forEach((item) => {
    const link = item.querySelector('a');
    if (link) {
      const a = link.cloneNode(true);
      legalCell.appendChild(a);
    } else {
      // Modal trigger — keep as text
      const span = document.createElement('span');
      span.textContent = item.textContent.trim();
      legalCell.appendChild(span);
    }
    legalCell.appendChild(document.createTextNode(' | '));
  });

  const cells = [
    ['PMS Footer'],
    [primaryCell],
    [legalCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
