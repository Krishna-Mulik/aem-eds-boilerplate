
/* global WebImporter */
export default function parse(element, { document }) {
  const modalId = element.id || 'modal';

  // Find the trigger in the footer (li with data-target matching this modal)
  const triggerSelector = `[data-target="#${modalId}"]`;
  const triggerEl = document.querySelector(triggerSelector);
  const triggerLabel = triggerEl ? triggerEl.textContent.trim() : modalId;

  const titleEl = element.querySelector('.modal-title, .modal-header h4');
  const modalTitle = titleEl ? titleEl.textContent.trim() : '';

  const bodyEl = element.querySelector('.modal-body');

  const triggerCell = document.createElement('p');
  triggerCell.textContent = triggerLabel;

  const idCell = document.createElement('p');
  idCell.textContent = modalId;

  const titleCell = document.createElement('p');
  titleCell.textContent = modalTitle;

  const cells = [
    ['Modal Content'],
    [triggerCell, idCell],
    [titleCell],
  ];

  if (bodyEl) {
    const bodyClone = bodyEl.cloneNode(true);
    cells.push([bodyClone]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
