
/* eslint-disable */
/* global WebImporter */

/**
 * Import orchestrator for:
 *   https://singapore.nipponindiaim.com/
 *
 * NOTE: This page is fully client-rendered (React + Owl Carousel).
 * The importer runs inside helix-importer-ui which executes JS, so the
 * rendered DOM will be available.  Selectors below are intentionally
 * broad / heuristic; tighten them after inspecting the live rendered
 * markup in the importer preview pane.
 *
 * Block mapping
 * ─────────────
 * hero    → existing /blocks/hero/     (reused, no new files)
 * cards   → existing /blocks/cards/    (reused, no new files)
 * columns → existing /blocks/columns/  (reused, no new files)
 */

import heroParser    from './parsers/hero.js';
import cardsParser   from './parsers/cards.js';
import columnsParser from './parsers/columns.js';

const parsers = {
  hero:    heroParser,
  cards:   cardsParser,
  columns: columnsParser,
};

/**
 * PAGE_TEMPLATE
 * Each `instances` array lists CSS selectors tried in order.
 * querySelectorAll is used, so multiple matches are all processed.
 *
 * Selector strategy for a client-rendered React app:
 *   - Prefer semantic / role-based selectors first
 *   - Fall back to class-fragment matches ([class*="…"])
 *   - The `section` / `main` fallbacks ensure something is always found
 */
const PAGE_TEMPLATE = {
  name: 'index',
  description: 'NAM Singapore homepage — hero banner, fund cards, info columns',
  urls: ['https://singapore.nipponindiaim.com/'],
  blocks: [
    {
      name: 'hero',
      instances: [
        // Typical React app hero patterns
        '[class*="hero"]',
        '[class*="banner"]',
        '[class*="slider"]',
        '[class*="carousel"]',
        // Owl Carousel wrapper (used on this site)
        '.owl-carousel',
        // Generic fallback — first full-width section
        'main > section:first-of-type',
        'main > div:first-child',
        '#root > div > section:first-of-type',
        '#root > div > div:first-child',
      ],
    },
    {
      name: 'cards',
      instances: [
        '[class*="fund"]',
        '[class*="product"]',
        '[class*="card-grid"]',
        '[class*="cards"]',
        '[class*="grid"]',
        // List-based card patterns
        'ul[class*="list"]',
        // Section containing multiple article/li children
        'section:has(article)',
        'section:has(li)',
      ],
    },
    {
      name: 'columns',
      instances: [
        '[class*="columns"]',
        '[class*="two-col"]',
        '[class*="split"]',
        '[class*="highlights"]',
        '[class*="stats"]',
        '[class*="features"]',
        '[class*="why"]',
        // Generic multi-column divs (2–4 children)
        'section[class*="row"]',
        'div[class*="row"]:not([class*="card"]):not([class*="fund"])',
      ],
    },
  ],
};

/**
 * Walk the template block definitions and collect every matching DOM
 * element together with its block name and matched selector.
 * Deduplicates: an element matched by an earlier selector is not
 * re-processed by a later one (even for a different block).
 */
function findBlocksOnPage(document, template) {
  const seen = new WeakSet();
  const out  = [];

  template.blocks.forEach((def) => {
    def.instances.forEach((selector) => {
      let matches;
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        // :has() not supported in all environments — skip gracefully
        console.warn(`Selector skipped (unsupported): ${selector}`, e.message);
        return;
      }

      matches.forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        out.push({ name: def.name, selector, element: el });
      });
    });
  });

  return out;
}

export default {
  /**
   * Main transform entry-point called by helix-importer-ui.
   *
   * @param {{ document: Document, url: string, params: object }} payload
   * @returns {Array<{ element: Element, path: string, report: object }>}
   */
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // ── 1. Discover blocks ──────────────────────────────────────────────
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // ── 2. Parse / replace each block ──────────────────────────────────
    pageBlocks.forEach((b) => {
      const parser = parsers[b.name];
      if (parser) {
        try {
          parser(b.element, { document, url, params });
        } catch (e) {
          console.error(`[importer] Failed to parse block "${b.name}" (${b.selector})`, e);
        }
      }
    });

    // ── 3. Standard AEM EDS post-processing ────────────────────────────
    // Horizontal rule signals end of main content to the DA editor
    const hr = document.createElement('hr');
    main.appendChild(hr);

    // Metadata table (title, description, etc.)
    WebImporter.rules.createMetadata(main, document);

    // Hoist CSS background-images to <img> tags
    WebImporter.rules.transformBackgroundImages(main, document);

    // Make image src attributes absolute / point to the source origin
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // ── 4. Compute output path ──────────────────────────────────────────
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname
        .replace(/\/$/, '')
        .replace(/\.html$/, '') || '/index'
    );

    // ── 5. Return result ────────────────────────────────────────────────
    return [
      {
        element: main,
        path,
        report: {
          title:    document.title,
          template: PAGE_TEMPLATE.name,
          blocks:   pageBlocks.map((b) => `${b.name} (${b.selector})`),
          note:     'Client-rendered page — selectors are heuristic; verify in importer preview.',
        },
      },
    ];
  },
};
