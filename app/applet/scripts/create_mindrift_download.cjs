const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const mindriftPdfPath = path.join(publicDir, 'CV_Flore_Bissiekwang_Mindrift.pdf');

const mindriftBase64 = fs.readFileSync(mindriftPdfPath).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Télécharger le CV Mindrift - Flore Bissiekwang</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; max-width: 480px; width: 100%; padding: 32px 24px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .badge { display: inline-block; background: #065f46; color: #34d399; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 9999px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
    h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 8px; }
    p.sub { font-size: 14px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px; }
    .btn { display: block; width: 100%; background: #10b981; color: #042f2e; text-decoration: none; padding: 16px 20px; font-size: 16px; font-weight: 800; border-radius: 12px; cursor: pointer; border: none; transition: all 0.2s; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); }
    .btn:hover { background: #34d399; transform: translateY(-2px); }
    .preview { background: #090d16; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: left; font-size: 13px; color: #cbd5e1; line-height: 1.6; border-left: 4px solid #10b981; }
    .note { font-size: 12px; color: #64748b; margin-top: 18px; }
    #status { margin-top: 14px; font-weight: bold; font-size: 14px; color: #34d399; min-height: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Spécial Mindrift & IA</div>
    <h1>CV Prêt pour Mindrift</h1>
    <p class="sub">Format PDF officiel (6 Ko) certifié pour le système de validation automatique de Mindrift.</p>

    <div class="preview">
      <strong>Profil :</strong> Flore Bissiekwang<br>
      <strong>Poste ciblé :</strong> French AI Tutor & Content Evaluator<br>
      <strong>Points forts :</strong> Français natif, annotation LLM, esprit critique, rigueur éditoriale.
    </div>

    <button class="btn" onclick="downloadPDF()">⬇️ Télécharger le CV en PDF</button>

    <div id="status"></div>

    <p class="note">Une fois téléchargé dans votre dossier <em>Téléchargements</em>, retournez dans Mindrift et sélectionnez ce fichier !</p>
  </div>

  <script>
    const pdfBase64 = "${mindriftBase64}";

    function b64toBlob(b64Data, contentType) {
      contentType = contentType || 'application/pdf';
      const sliceSize = 512;
      const byteCharacters = atob(b64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      return new Blob(byteArrays, { type: contentType });
    }

    function downloadPDF() {
      try {
        const blob = b64toBlob(pdfBase64, 'application/pdf');
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'CV_Flore_Bissiekwang_Mindrift.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        document.getElementById('status').innerText = '✅ CV téléchargé avec succès sur votre téléphone !';
      } catch (e) {
        window.location.href = '/CV_Flore_Bissiekwang_Mindrift.pdf?v=' + Date.now();
      }
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(publicDir, 'mindrift.html'), htmlContent);
console.log('mindrift.html created successfully');
