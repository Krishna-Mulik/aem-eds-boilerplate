
export default function decorate(block) {
  // The block has one row with the intro text in the first cell
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('pms-intro-row');
    const cells = [...row.children];
    cells.forEach((cell) => {
      cell.classList.add('pms-intro-cell');
    });
  });

  // Add CTA link row if present (second row)
  const ctaRow = block.querySelector('.pms-intro-row:nth-child(2)');
  if (ctaRow) {
    ctaRow.classList.add('pms-intro-cta');
  }
}
