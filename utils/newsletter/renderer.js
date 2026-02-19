// utils/newsletter/render.js
// JSON-alapú hírlevél sablon → HTML renderelő motor (frontend verzió)

export function renderNewsletterHtml(blocks, subscriber = {}) {
  let html = "";

  for (const block of blocks) {
    switch (block.type) {
      case "header":
        html += renderHeader(block.props);
        break;

      case "hero":
        html += renderHero(block.props);
        break;

      case "title":
        html += renderTitle(block.props);
        break;

      case "paragraph":
        html += renderParagraph(block.props);
        break;

      case "image":
        html += renderImage(block.props);
        break;

      case "imageLeft":
        html += renderImageLeft(block.props);
        break;

      case "imageRight":
        html += renderImageRight(block.props);
        break;

      case "button":
        html += renderButton(block.props);
        break;

      case "divider":
        html += renderDivider();
        break;

      case "footer":
        html += renderFooter(block.props);
        break;

      default:
        console.warn("Unknown block type:", block.type);
    }
  }

  // 🔄 Változók behelyettesítése
  html = html.replace(/{{firstname}}/g, subscriber.firstname || "");
  html = html.replace(/{{name}}/g, subscriber.name || "");
  html = html.replace(/{{email}}/g, subscriber.email || "");

  return wrapHtmlDocument(html);
}

/* -----------------------------------------------------
   BLOKK RENDERELŐK
----------------------------------------------------- */

function renderHeader({ title = "", subtitle = "", logo = "" }) {
  return `
  <table width="100%" style="background:#ffffff;padding:20px 0;text-align:center;">
    <tr>
      <td>
        ${logo ? `<img src="${logo}" alt="Logo" style="max-width:120px;margin-bottom:10px;" />` : ""}
        <h1 style="font-family:Arial,sans-serif;color:#333;margin:0;">${title}</h1>
        <p style="font-family:Arial,sans-serif;color:#666;margin:5px 0 0;">${subtitle}</p>
      </td>
    </tr>
  </table>`;
}

function renderHero({ title = "", subtitle = "", image = "" }) {
  return `
  <table width="100%" style="background:#f7f7f7;padding:40px 0;text-align:center;">
    <tr>
      <td>
        ${image ? `<img src="${image}" style="max-width:100%;border-radius:8px;margin-bottom:20px;" />` : ""}
        <h2 style="font-family:Arial,sans-serif;color:#222;margin:0;">${title}</h2>
        <p style="font-family:Arial,sans-serif;color:#555;margin-top:10px;">${subtitle}</p>
      </td>
    </tr>
  </table>`;
}

function renderTitle({ text = "" }) {
  return `
  <h2 style="font-family:Arial,sans-serif;color:#222;text-align:center;margin:30px 0 10px;">
    ${text}
  </h2>`;
}

function renderParagraph({ text = "" }) {
  return `
  <p style="font-family:Arial,sans-serif;color:#444;line-height:1.6;font-size:16px;padding:0 20px;">
    ${text}
  </p>`;
}

function renderImage({ url = "", alt = "" }) {
  return `
  <div style="text-align:center;margin:20px 0;">
    <img src="${url}" alt="${alt}" style="max-width:100%;border-radius:8px;" />
  </div>`;
}

function renderImageLeft({ url = "", alt = "", text = "" }) {
  return `
  <table width="100%" style="padding:20px;">
    <tr>
      <td width="40%">
        <img src="${url}" alt="${alt}" style="max-width:100%;border-radius:8px;" />
      </td>
      <td width="60%" style="padding-left:20px;font-family:Arial,sans-serif;color:#444;line-height:1.6;">
        ${text}
      </td>
    </tr>
  </table>`;
}

function renderImageRight({ url = "", alt = "", text = "" }) {
  return `
  <table width="100%" style="padding:20px;">
    <tr>
      <td width="60%" style="padding-right:20px;font-family:Arial,sans-serif;color:#444;line-height:1.6;">
        ${text}
      </td>
      <td width="40%">
        <img src="${url}" alt="${alt}" style="max-width:100%;border-radius:8px;" />
      </td>
    </tr>
  </table>`;
}

function renderButton({ label = "Kattints ide", url = "#" }) {
  return `
  <div style="text-align:center;margin:30px 0;">
    <a href="${url}"
       style="background:#4CAF50;color:white;padding:12px 24px;border-radius:6px;
              text-decoration:none;font-family:Arial,sans-serif;font-size:16px;">
      ${label}
    </a>
  </div>`;
}

function renderDivider() {
  return `
  <hr style="border:0;border-top:1px solid #ddd;margin:30px 0;" />`;
}

function renderFooter({ text = "" }) {
  return `
  <table width="100%" style="background:#f0f0f0;padding:20px;text-align:center;margin-top:40px;">
    <tr>
      <td>
        <p style="font-family:Arial,sans-serif;color:#777;font-size:13px;margin:0;">
          ${text}
        </p>
      </td>
    </tr>
  </table>`;
}

/* -----------------------------------------------------
   HTML WRAPPER (email kompatibilis)
----------------------------------------------------- */

function wrapHtmlDocument(content) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Newsletter</title>
  </head>
  <body style="margin:0;padding:0;background:#fafafa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;margin:auto;background:white;">
      <tr>
        <td>
          ${content}
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}
