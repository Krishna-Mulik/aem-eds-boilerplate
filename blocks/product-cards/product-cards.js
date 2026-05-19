
export default function decorate(block) {
  // Expected authored structure:
  // Row 0: section heading
  // Row 1..N: [title, description, link-href, link-label]

  const rows = [...block.children];
  if (rows.length === 0) return;

  // First row is the section heading
  const headingRow = rows[0];
  headingRow.classList.add('product-cards-heading');
  const headingCell = headingRow.firstElementChild;
  if (headingCell) {
    const h3 = headingCell.querySelector('h3') || headingCell.querySelector('h2') || headingCell.querySelector('p');
    if (h3) h3.classList.add('product-cards-section-title');
  }

  // Build the grid wrapper
  const grid = document.createElement('div');
  grid.classList.add('product-cards-grid');

  // Remaining rows are cards
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const cells = [...row.children];

    const card = document.createElement('div');
    card.classList.add('product-card');

    // Cell 0: title
    const titleText = cells[0] ? cells[0].textContent.trim() : '';
    const titleEl = document.createElement('h3');
    titleEl.classList.add('product-card-title');
    titleEl.textContent = titleText;
    card.appendChild(titleEl);

    // Cell 1: description
    if (cells[1]) {
      const desc = document.createElement('div');
      desc.classList.add('product-card-desc');
      desc.innerHTML = cells[1].innerHTML;
      card.appendChild(desc);
    }

    // Cell 2: link href, Cell 3: link label (or image)
    const href = cells[2] ? cells[2].textContent.trim() : '#';
    const linkEl = document.createElement('a');
    linkEl.classList.add('product-card-link');
    linkEl.href = href;

    if (cells[3]) {
      const img = cells[3].querySelector('img');
      if (img) {
        linkEl.appendChild(img.cloneNode(true));
      } else {
        linkEl.textContent = cells[3].textContent.trim() || 'Know More';
      }
    } else {
      linkEl.textContent = 'Know More';
    }

    card.appendChild(linkEl);
    grid.appendChild(card);
    row.remove();
  }

  block.appendChild(grid);
}
