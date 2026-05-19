
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Row 0: trigger label + modal id
  // Row 1: modal title
  // Row 2+: modal body content rows

  const triggerRow = rows[0];
  const cells0 = [...triggerRow.children];
  const triggerLabel = cells0[0] ? cells0[0].textContent.trim() : 'Open';
  const modalId = cells0[1] ? cells0[1].textContent.trim() : `modal-${Math.random().toString(36).slice(2)}`;

  // Build trigger button
  const trigger = document.createElement('button');
  trigger.classList.add('modal-content-trigger');
  trigger.textContent = triggerLabel;
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', modalId);

  // Build modal overlay
  const overlay = document.createElement('div');
  overlay.classList.add('modal-content-overlay');
  overlay.id = modalId;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('tabindex', '-1');

  const dialog = document.createElement('div');
  dialog.classList.add('modal-content-dialog');

  // Header
  const header = document.createElement('div');
  header.classList.add('modal-content-header');

  const titleRow = rows[1];
  const titleText = titleRow ? (titleRow.firstElementChild ? titleRow.firstElementChild.textContent.trim() : '') : '';
  const titleEl = document.createElement('h4');
  titleEl.classList.add('modal-content-title');
  titleEl.textContent = titleText;

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal-content-close');
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';

  header.appendChild(titleEl);
  header.appendChild(closeBtn);

  // Body
  const body = document.createElement('div');
  body.classList.add('modal-content-body');

  for (let i = 2; i < rows.length; i += 1) {
    const contentCell = rows[i].firstElementChild;
    if (contentCell) {
      const section = document.createElement('div');
      section.classList.add('modal-content-section');
      section.innerHTML = contentCell.innerHTML;
      body.appendChild(section);
    }
  }

  dialog.appendChild(header);
  dialog.appendChild(body);
  overlay.appendChild(dialog);

  // Clear block and rebuild
  block.innerHTML = '';
  block.appendChild(trigger);
  block.appendChild(overlay);

  // Open / close logic
  function openModal() {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    trigger.focus();
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();

    // Trap focus inside dialog
    if (e.key === 'Tab') {
      const focusable = [...dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
