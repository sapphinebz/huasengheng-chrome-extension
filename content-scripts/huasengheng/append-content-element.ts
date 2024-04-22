import { FONT_SIZE } from "./models/font-size.model";

let chromeFixedEl: HTMLDivElement;

export function appendContentElement({ fontColor = "#000", text = "N/A" }) {
  if (!chromeFixedEl) {
    chromeFixedEl = document.createElement("div");
    chromeFixedEl.classList.add("chrome-fixed");
    chromeFixedEl.classList.add("chrome-font");
    document.body.appendChild(chromeFixedEl);
  }
  const template = document.createElement("template");
  template.innerHTML = `
        <div class="textBlock>
        <span class="textColor01 textPricing" style="color: ${fontColor};">${text}</span>
        </div>
    `;

  const node = document.importNode(template.content, true);
  const div = node.querySelector("div");
  chromeFixedEl.appendChild(node);
  return div;
}
