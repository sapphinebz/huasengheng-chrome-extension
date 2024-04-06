export function appendContentElement({
  fontColor = "#000",
  text = "N/A",
  topDs = 0,
}) {
  const template = document.createElement("template");
  template.innerHTML = `
        <div class="textBlock" style="
            color: rgb(15, 177, 83);
            position: fixed;
            font-size: xxx-large;
            top: ${topDs}rem;
            right: 1rem;
            z-index: 99999;
            background-color:white;
    "><span class="textColor01 textPricing" style="color: ${fontColor};">${text}</span></div>
    `;

  const node = document.importNode(template.content, true);
  const div = node.querySelector("div");
  document.body.appendChild(node);
  return div;
}
