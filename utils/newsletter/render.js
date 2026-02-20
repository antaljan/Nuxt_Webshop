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
   BLOKK RENDERELŐK (modernizált dizájn)
----------------------------------------------------- */

function renderHeader({ title = "", subtitle = "", logo = "" }) {
  return `
  <div style="display:flex;align-items:center;gap:20px;padding:20px;background-color:#f7f7f7;font-family:Arial,sans-serif;">
    <img src="${logo || 'https://antaligyongyi.hu/favicon.ico'}"
         alt="Antali Gyöngyi Coaching"
         style="height:60px;width:auto;" />

    <div>
      <h1 style="margin:0;font-size:24px;color:#333;">
        ${title || "A Te utad a te életed!"}
      </h1>

      <p style="margin:5px 0 0;font-size:14px;color:#666;">
        ${subtitle || "Coaching, ami segít megtalálni az utad – személyesen vagy online."}
      </p>
    </div>
  </div>`;
}

function renderHero({ title = "", subtitle = "", image = "" }) {
  return `
  <div style="
    background-image: url('${image}');
    background-size: cover;
    background-position: center;
    padding: 70px 20px;
    text-align: center;
    color: white;
    font-family: Arial, sans-serif;
    border-radius: 8px;
    margin: 20px 0;
  ">
    <h2 style="font-size:30px;margin-bottom:10px;text-shadow:0 2px 4px rgba(0,0,0,0.4);">
      ${title}
    </h2>

    <p style="font-size:18px;margin-bottom:20px;text-shadow:0 2px 4px rgba(0,0,0,0.4);">
      ${subtitle}
    </p>
  </div>`;
}

function renderTitle({ text = "" }) {
  return `
  <h2 style="
    font-family:Arial,sans-serif;
    color:#222;
    text-align:center;
    margin:40px 0 15px;
    font-size:26px;
    letter-spacing:0.5px;
  ">
    ${text}
  </h2>`;
}

function renderParagraph({ text = "" }) {
  return `
  <p style="
    font-family:Arial,sans-serif;
    color:#444;
    line-height:1.7;
    font-size:17px;
    padding:0 25px;
    margin:15px 0;
  ">
    ${text}
  </p>`;
}

function renderImage({ url = "", alt = "" }) {
  return `
  <div style="text-align:center;margin:25px 0;">
    <img src="${url}" alt="${alt}" style="
      max-width:100%;
      border-radius:10px;
      box-shadow:0 4px 12px rgba(0,0,0,0.15);
    " />
  </div>`;
}

function renderImageLeft({ url = "", alt = "", text = "" }) {
  return `
  <table width="100%" style="padding:25px;">
    <tr>
      <td width="40%" style="vertical-align:top;">
        <img src="${url}" alt="${alt}" style="
          max-width:100%;
          border-radius:10px;
          box-shadow:0 4px 12px rgba(0,0,0,0.15);
        " />
      </td>

      <td width="60%" style="
        padding-left:25px;
        font-family:Arial,sans-serif;
        color:#444;
        line-height:1.7;
        font-size:16px;
      ">
        ${text}
      </td>
    </tr>
  </table>`;
}

function renderImageRight({ url = "", alt = "", text = "" }) {
  return `
  <table width="100%" style="padding:25px;">
    <tr>
      <td width="60%" style="
        padding-right:25px;
        font-family:Arial,sans-serif;
        color:#444;
        line-height:1.7;
        font-size:16px;
      ">
        ${text}
      </td>

      <td width="40%" style="vertical-align:top;">
        <img src="${url}" alt="${alt}" style="
          max-width:100%;
          border-radius:10px;
          box-shadow:0 4px 12px rgba(0,0,0,0.15);
        " />
      </td>
    </tr>
  </table>`;
}

function renderButton({ label = "Kattints ide", url = "#" }) {
  return `
  <div style="text-align:center;margin:35px 0;">
    <a href="${url}"
       style="
         background:#4CAF50;
         color:white;
         padding:14px 28px;
         border-radius:6px;
         text-decoration:none;
         font-family:Arial,sans-serif;
         font-size:17px;
         display:inline-block;
         box-shadow:0 3px 8px rgba(0,0,0,0.2);
       ">
      ${label}
    </a>
  </div>`;
}

function renderDivider() {
  return `
  <hr style="
    border:0;
    border-top:1px solid #e0e0e0;
    margin:40px 0;
  " />`;
}

function renderFooter({ text = "" }) {
  return `
  <div style="background-color:#f8f8f8;padding:20px;text-align:center;font-family:Arial,sans-serif;color:#555;font-size:14px;margin-top:40px;">
    
    <p style="margin:0 0 10px 0;color:#333;">
      Kedves {{firstname}}, köszönöm, hogy engem választottál!
    </p>

    <p style="margin:0 0 15px 0;">
      Antali Gyöngyi • 
      <a href="mailto:info@yowayoli.com" style="color:#0077cc;text-decoration:none;">
        info@yowayoli.com
      </a>
    </p>

    <div style="display:inline-block;margin-top:10px;">
      <a href="https://antaligyongyi.hu" style="margin:0 10px;color:#0077cc;text-decoration:none;">Weboldal</a> |
      <a href="https://www.facebook.com/profile.php?id=100064353450604" style="margin:0 10px;color:#0077cc;text-decoration:none;">Facebook</a> |
      <a href="https://www.instagram.com/antaligyongyiedit/" style="margin:0 10px;color:#0077cc;text-decoration:none;">Instagram</a> |
      <a href="https://antaligyongyi.hu/gdpr" style="margin:0 10px;color:#0077cc;text-decoration:none;">GDPR</a>
    </div>

    ${text ? `<p style="margin-top:20px;color:#777;font-size:13px;">${text}</p>` : ""}
  </div>`;
}

/* -----------------------------------------------------
   HTML WRAPPER (frontend preview)
----------------------------------------------------- */

function wrapHtmlDocument(content) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Newsletter Preview</title>
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
export function renderNewsletterPreview({ blocks, subscriber }) {
  return renderNewsletterHtml(blocks, subscriber)
}

