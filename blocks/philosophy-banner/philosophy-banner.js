
export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('philosophy-banner-row');
    const cells = [...row.children];

    if (cells[0]) {
      // Cell 0: heading
      cells[0].classList.add('philosophy-banner-heading');
    }
    if (cells[1]) {
      // Cell 1: body text + read more link
      cells[1].classList.add('philosophy-banner-body');
      const link = cells[1].querySelector('a');
      if (link) {
        link.classList.add('philosophy-banner-readmore');
      }
    }
    if (cells[2]) {
      // Cell 2: optional background image URL
      const bgUrl = cells[2].textContent.trim();
      if (bgUrl) {
        block.style.backgroundImage = `url('${bgUrl}')`;
        block.style.backgroundSize = '100% 100%';
        block.style.backgroundRepeat = 'no-repeat';
      }
      cells[2].style.display = 'none';
    }
  });
}
