
export default function decorate(block) {
  const rows = [...block.children];

  // Row 0: nav links (primary)
  // Row 1: secondary links (modals / legal)

  rows.forEach((row, idx) => {
    row.classList.add(idx === 0 ? 'pms-footer-nav' : 'pms-footer-legal');
    const cells = [...row.children];
    cells.forEach((cell) => {
      cell.classList.add('pms-footer-cell');
      // Each cell contains a list of links
      const links = cell.querySelectorAll('a');
      links.forEach((link) => {
        link.classList.add('pms-footer-link');
      });
    });
  });
}
