
export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('cta-banner-row');
    const cells = [...row.children];
    if (cells.length >= 1) {
      const linkCell = cells[0];
      linkCell.classList.add('cta-banner-link-cell');
      const anchor = linkCell.querySelector('a');
      if (anchor) {
        anchor.classList.add('cta-banner-link');
      }
    }
  });
}
