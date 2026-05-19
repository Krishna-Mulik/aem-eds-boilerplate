
# Cards Block

The **Cards** block displays a responsive grid of cards, each containing an image and rich text. This block is ideal for showcasing features, products, or articles in a visually appealing layout.

---

## View Document Source

|-------------------------------|
| Cards                         |
|-------------------------------|
| **Card 1**                    |
| image       | `/path/image-1.png` |
| text        | `<p>Sample text for card 1.</p>` |
|-------------------------------|
| **Card 2**                    |
| image       | `/path/image-2.png` |
| text        | `<p>Sample text for card 2.</p>` |
|-------------------------------|

|-------------------------------------------|
| Section Metadata                          |
|-------------------------------------------|
| style | `dark` (optional)                |
|-------------------------------------------|

---

## Authoring Guidelines

```json
{
  "_items": [
    {
      "image": "/content/dam/path/image-1.png",
      "text": "<p><strong>Feature One</strong></p><p>Description for the first feature.</p>"
    },
    {
      "image": "/content/dam/path/image-2.png",
      "text": "<p><strong>Feature Two</strong></p><p>Description for the second feature.</p>"
    }
  ]
}
```

### Rules:
- **Image**: Use the `reference` field to select an image from the DAM.
- **Text**: Use `richtext` for formatted content. Supported elements:
  - Headings: `<h1>` to `<h6>`
  - Paragraphs: `<p>`
  - Lists: `<ul>`, `<ol>`, `<li>`
  - Links: `<a>`
  - Inline formatting: `<strong>`, `<em>`, `<i>`, `<br>`
- **Repetition**: Add as many cards as needed using the `_items` array.
- **Section Styles**: Apply optional section styles (e.g., `dark`) to customize the background.

---
    