import { FONT_SIZE } from "./models/font-size.model";

export function appendContentElement({
  fontColor = "#000",
  fontSize = FONT_SIZE.XXX_LARGE,
  text = "N/A",
  topDs = 0,
}) {
  const template = document.createElement("template");
  template.innerHTML = `
        <div class="textBlock chrome-fixed chrome-font-${fontSize}" style="
            top: ${topDs}rem;
    "><span class="textColor01 textPricing" style="color: ${fontColor};">${text}</span></div>
    `;

  const node = document.importNode(template.content, true);
  const div = node.querySelector("div");
  document.body.appendChild(node);
  return div;
}
