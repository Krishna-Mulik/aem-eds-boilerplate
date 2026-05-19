
/* global WebImporter */
export default function parse(element, { document }) {
  // Section heading
  const headingEl = element.querySelector('.our-productshome h3');
  const headingText = headingEl ? headingEl.textContent.trim() : 'OUR INVESTMENT APPROACHES';

  const headingCell = document.createElement('p');
  headingCell.textContent = headingText;

  const cells = [
    ['Product Cards'],
    [headingCell],
  ];

  // Each product card
  const cards = element.querySelectorAll('.our-products-inner2');
  cards.forEach((card) => {
    const titleEl = card.querySelector('h3');
    const title = titleEl ? titleEl.textContent.trim() : '';

    // Description: look for a <p> with content (not just whitespace)
    let descHTML = '';
    const descDiv = card.querySelector('[id^="divProductObj"]');
    if (descDiv && descDiv.nextElementSibling && descDiv.nextElementSibling.tagName === 'P') {
      descHTML = descDiv.nextElementSibling.innerHTML;
    } else {
      // Try any <p> inside the card
      const pEls = card.querySelectorAll('p');
      pEls.forEach((pEl) => {
        if (pEl.textContent.trim()) descHTML += pEl.outerHTML;
      });
    }

    const descCell = document.createElement('div');
    descCell.innerHTML = descHTML;

    // Link
    const linkEl = card.querySelector('a');
    const href = linkEl ? linkEl.getAttribute('href') : '#';
    const img = linkEl ? linkEl.querySelector('img') : null;

    const hrefCell = document.createElement('p');
    hrefCell.textContent = href;

    const linkLabelCell = document.createElement('div');
    if (img) {
      linkLabelCell.appendChild(img.cloneNode(true));
    } else {
      linkLabelCell.textContent = 'Know More';
    }

    const titleCell = document.createElement('p');
    titleCell.textContent = title;

    cells.push([titleCell, descCell, hrefCell, linkLabelCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
