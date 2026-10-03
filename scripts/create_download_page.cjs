const fs = require('fs');
const path = require('path');

const cvPdfPath = path.join(__dirname, '../public/CV_BISSIEK_WANG_Beneditte_Flore.pdf');
const lettrePdfPath = path.join(__dirname, '../public/Lettre_de_Motivation_Flore_Wang.pdf');
const lettreSyscoliaPdfPath = path.join(__dirname, '../public/Lettre_de_Motivation_SYSCOLIA_Flore_Wang.pdf');

const cvBase64 = fs.existsSync(cvPdfPath) ? fs.readFileSync(cvPdfPath).toString('base64') : '';
const lettreBase64 = fs.existsSync(lettrePdfPath) ? fs.readFileSync(lettrePdfPath).toString('base64') : '';
const lettreSyscoliaBase64 = fs.existsSync(lettreSyscoliaPdfPath) ? fs.readFileSync(lettreSyscoliaPdfPath).toString('base64') : '';

const timeStamp = Date.now();

// 1. Interactive Letter Viewer for SYSCOLIA (Dedicated page)
const lettreSyscoliaHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lettre de Motivation SYSCOLIA — Flore WANG</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #0b0f19; color: #1e293b; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 16px; }
    .toolbar { max-width: 800px; width: 100%; display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .toolbar .title { color: #f8fafc; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    .toolbar .buttons { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; cursor: pointer; border: none; transition: all 0.15s ease; }
    .btn-primary { background: #4f46e5; color: white; box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
    .btn-primary:hover { background: #4338ca; }
    .btn-secondary { background: #1e293b; color: #f1f5f9; border: 1px solid #334155; }
    .btn-secondary:hover { background: #334155; }
    .sheet { background: #ffffff; max-width: 800px; width: 100%; padding: 48px 44px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); min-height: 1050px; display: flex; flex-direction: column; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 20px; }
    .sender h2 { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
    .sender p { font-size: 13.5px; color: #334155; line-height: 1.5; }
    .recipient { text-align: right; }
    .recipient .city { font-size: 13px; color: #64748b; margin-bottom: 6px; }
    .recipient .role { font-size: 14px; font-weight: 700; color: #0f172a; line-height: 1.3; }
    .recipient .company { font-size: 15px; font-weight: 800; color: #4338ca; margin-top: 2px; }
    .recipient .address { font-size: 12.5px; color: #64748b; }
    .divider { height: 1px; background: #e2e8f0; margin-bottom: 24px; }
    .objet { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
    .salutation { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
    .paragraph { font-size: 13.5px; color: #334155; line-height: 1.7; text-align: justify; margin-bottom: 15px; }
    .signature-container { margin-top: 24px; display: flex; justify-content: flex-end; }
    .signature-block { text-align: right; }
    .signature-name { font-size: 16px; font-weight: 800; color: #0f172a; }
    @media print {
      body { background: white; padding: 0; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; border: none; padding: 18mm; width: 100%; max-width: 100%; }
    }
    @media (max-width: 600px) {
      .sheet { padding: 24px 18px; }
      .header { flex-direction: column; gap: 16px; }
      .recipient { text-align: left; }
      .signature-container { justify-content: flex-start; }
      .signature-block { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="title">
      <span>✉️</span>
      <span>Lettre de Motivation — SYSCOLIA</span>
    </div>
    <div class="buttons">
      <button onclick="downloadPdf()" class="btn btn-primary">
        <span>📥</span>
        <span>Télécharger PDF SYSCOLIA</span>
      </button>
      <button onclick="window.print()" class="btn btn-secondary">
        <span>🖨️</span>
        <span>Imprimer</span>
      </button>
      <a href="/telecharger.html" class="btn btn-secondary">
        <span>📂</span>
        <span>Espace Téléchargements</span>
      </a>
    </div>
  </div>

  <div class="sheet" id="lettre-sheet">
    <div class="header">
      <div class="sender">
        <h2>Flore WANG</h2>
        <p>Douala, Bonamoussadi</p>
        <p>Tél : (+237) 651 88 77 22</p>
        <p>E-mail : florewang03@gmail.com</p>
      </div>
      <div class="recipient">
        <p class="city">Douala, Cameroun</p>
        <p class="role">À l'attention de la Direction</p>
        <p class="company">SYSCOLIA</p>
        <p class="address">Douala, Cameroun</p>
      </div>
    </div>

    <div class="divider"></div>

    <div class="objet">
      Objet : Candidature au poste de Développeuse d’Applications Web
    </div>

    <div class="salutation">
      Madame, Monsieur,
    </div>

    <p class="paragraph">
      Acteur de référence dans la formation professionnelle en ligne et la digitalisation des compétences, SYSCOLIA se distingue par la qualité et l’accessibilité de ses plateformes éducatives. Particulièrement sensible à vos initiatives d’apprentissage numérique et au développement de vos outils web interactifs, je vous propose ma candidature pour participer activement au développement et à l’évolution de vos applications.
    </p>

    <p class="paragraph">
      Titulaire d’un BTS en Gestion des Systèmes d’Information et d’une Licence en Génie Logiciel, j’ai développé une solide maîtrise technique dans la conception et l’implémentation de solutions logicielles. Je maîtrise l’écosystème JavaScript moderne, avec des compétences concrètes sur <strong>React.js</strong> pour la conception d’interfaces réactives et fluides, ainsi que <strong>Node.js</strong> et <strong>Express</strong> pour la création d’API REST fiables et sécurisées.
    </p>

    <p class="paragraph">
      Sur le plan des données, mon expérience me permet de modéliser et structurer efficacement des bases relationnelles <strong>MySQL</strong>, tout en assurant une intégration fluide entre le front-end et le back-end. J’ai notamment participé à la conception de tableaux de bord, de formulaires dynamiques et d’outils de suivi d’utilisateurs, des fonctionnalités essentielles pour une plateforme de gestion et d’apprentissage en ligne comme la vôtre.
    </p>

    <p class="paragraph">
      Rigoureuse, force de proposition et habituée à travailler avec méthode et respect des délais, je souhaite mettre mon énergie au service des projets de SYSCOLIA. Qu’il s’agisse de développer de nouveaux modules, d’améliorer l’expérience utilisateur de vos apprenants ou d’assurer la robustesse technique de vos services numériques, je saurai m’adapter rapidement à vos exigences.
    </p>

    <p class="paragraph">
      Je me tiens à votre entière disposition pour convenir d’un entretien au cours duquel je pourrai vous détailler mon profil et vous exposer comment mes compétences s’alignent avec les objectifs de SYSCOLIA.
    </p>

    <p class="paragraph">
      Dans l’attente de votre réponse, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations les plus distinguées.
    </p>

    <div class="signature-container">
      <div class="signature-block">
        <p class="signature-name">Flore WANG</p>
      </div>
    </div>
  </div>

  <script>
    const lettreSyscoliaBase64 = "${lettreSyscoliaBase64}";

    function downloadPdf() {
      try {
        const byteCharacters = atob(lettreSyscoliaBase64);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }
        const blob = new Blob(byteArrays, { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Lettre_de_Motivation_SYSCOLIA_Flore_Wang.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } catch (err) {
        window.location.href = '/Lettre_de_Motivation_SYSCOLIA_Flore_Wang.pdf?t=' + Date.now();
      }
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../public/lettre-syscolia.html'), lettreSyscoliaHtml);

// 2. Interactive Letter Viewer general
const lettreHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lettre de Motivation — Flore WANG</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #0b0f19; color: #1e293b; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 16px; }
    .toolbar { max-width: 800px; width: 100%; display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .toolbar .title { color: #f8fafc; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    .toolbar .buttons { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; cursor: pointer; border: none; transition: all 0.15s ease; }
    .btn-primary { background: #4f46e5; color: white; box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
    .btn-primary:hover { background: #4338ca; }
    .btn-secondary { background: #1e293b; color: #f1f5f9; border: 1px solid #334155; }
    .btn-secondary:hover { background: #334155; }
    .sheet { background: #ffffff; max-width: 800px; width: 100%; padding: 48px 44px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); min-height: 1050px; display: flex; flex-direction: column; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 20px; }
    .sender h2 { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
    .sender p { font-size: 13.5px; color: #334155; line-height: 1.5; }
    .recipient { text-align: right; }
    .recipient .city { font-size: 13px; color: #64748b; margin-bottom: 12px; }
    .recipient .role { font-size: 14px; font-weight: 700; color: #0f172a; line-height: 1.4; max-width: 280px; }
    .divider { height: 1px; background: #e2e8f0; margin-bottom: 28px; }
    .objet { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 24px; }
    .salutation { font-size: 14.5px; font-weight: 600; color: #0f172a; margin-bottom: 18px; }
    .paragraph { font-size: 14px; color: #334155; line-height: 1.75; text-align: justify; margin-bottom: 18px; }
    .signature-container { margin-top: 36px; display: flex; justify-content: flex-end; }
    .signature-block { text-align: right; }
    .signature-name { font-size: 16px; font-weight: 800; color: #0f172a; }
    @media print {
      body { background: white; padding: 0; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; border: none; padding: 20mm; width: 100%; max-width: 100%; }
    }
    @media (max-width: 600px) {
      .sheet { padding: 24px 18px; }
      .header { flex-direction: column; gap: 16px; }
      .recipient { text-align: left; }
      .signature-container { justify-content: flex-start; }
      .signature-block { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="title">
      <span>✉️</span>
      <span>Lettre de Motivation Officielle</span>
    </div>
    <div class="buttons">
      <button onclick="downloadPdf()" class="btn btn-primary">
        <span>📥</span>
        <span>Télécharger PDF officiel</span>
      </button>
      <button onclick="window.print()" class="btn btn-secondary">
        <span>🖨️</span>
        <span>Imprimer</span>
      </button>
      <a href="/lettre-syscolia.html" class="btn btn-secondary">
        <span>🏢</span>
        <span>Version SYSCOLIA</span>
      </a>
      <a href="/" class="btn btn-secondary">
        <span>🏠</span>
        <span>Retour au Portfolio</span>
      </a>
    </div>
  </div>

  <div class="sheet" id="lettre-sheet">
    <div class="header">
      <div class="sender">
        <h2>Flore WANG</h2>
        <p>Douala, Bonamoussadi</p>
        <p>Tél : (+237) 651 88 77 22</p>
        <p>E-mail : florewang03@gmail.com</p>
      </div>
      <div class="recipient">
        <p class="city">Douala, Cameroun</p>
        <p class="role">À l'attention du Responsable des Ressources Humaines</p>
      </div>
    </div>

    <div class="divider"></div>

    <div class="objet">
      Objet : Candidature au stage de Développeur d’Applications Web
    </div>

    <div class="salutation">
      Madame, Monsieur,
    </div>

    <p class="paragraph">
      Titulaire d’une Licence en Génie Logiciel, je souhaite vous soumettre ma candidature pour le stage de Développeur d’Applications Web publié sur Expert du CV. Je souhaite aujourd’hui mettre en pratique mes connaissances techniques au sein d’un environnement professionnel et continuer à développer mes compétences dans le domaine du développement web.
    </p>

    <p class="paragraph">
      Au cours de ma formation et de mes projets, j’ai acquis des connaissances en JavaScript, React.js, Node.js/Express, API REST, MySQL ainsi qu’en Git/GitHub. J’ai notamment participé à la conception et au développement d’applications web, ce qui m’a permis de travailler sur la partie frontend et backend, la gestion des données et la mise en place d’API.
    </p>

    <p class="paragraph">
      Sérieuse, motivée et désireuse d’apprendre, je souhaite intégrer une équipe qui me permettra de consolider mes acquis, de découvrir davantage les pratiques professionnelles du développement d’applications web et de contribuer concrètement aux projets qui me seront confiés.
    </p>

    <p class="paragraph">
      Je serais heureuse de pouvoir échanger avec vous lors d’un entretien afin de vous présenter plus en détail mon parcours, mes compétences et ma motivation.
    </p>

    <p class="paragraph">
      Dans l’attente de votre retour, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.
    </p>

    <div class="signature-container">
      <div class="signature-block">
        <p class="signature-name">Flore WANG</p>
      </div>
    </div>
  </div>

  <script>
    const lettreBase64 = "${lettreBase64}";

    function downloadPdf() {
      try {
        const byteCharacters = atob(lettreBase64);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }
        const blob = new Blob(byteArrays, { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Lettre_de_Motivation_Flore_Wang.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } catch (err) {
        window.location.href = '/Lettre_de_Motivation_Flore_Wang.pdf?t=' + Date.now();
      }
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../public/lettre.html'), lettreHtml);
fs.writeFileSync(path.join(__dirname, '../public/lettre-motivation.html'), lettreHtml);

// 3. Download hub with anti-cache timestamps
const downloadHubHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documents & Téléchargements — Flore WANG</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #0b0f19; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 24px 16px; }
    .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 20px; padding: 32px 24px; max-width: 580px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5); text-align: center; }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(99, 102, 241, 0.15); border: 1px solid #6366f1; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #a5b4fc; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px; }
    h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; color: #ffffff; }
    .subtitle { font-size: 13px; color: #94a3b8; margin-bottom: 24px; line-height: 1.5; }
    .doc-section { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 20px 16px; margin-bottom: 18px; text-align: left; }
    .doc-title { font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
    .doc-desc { font-size: 12px; color: #94a3b8; margin-bottom: 14px; line-height: 1.5; }
    .btn-download-syscolia { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; text-decoration: none; margin-bottom: 8px; box-shadow: 0 4px 16px rgba(79, 70, 229, 0.4); }
    .btn-download-lettre { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background: #312e81; color: white; border: none; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none; margin-bottom: 8px; }
    .btn-download-cv { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px; background: #059669; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; text-decoration: none; margin-bottom: 8px; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4); }
    .btn-view { display: block; width: 100%; padding: 10px; background: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; text-align: center; margin-bottom: 6px; }
    .status { font-size: 12px; color: #34d399; margin: 8px 0; text-align: center; font-weight: 600; min-height: 18px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Espace Candidature & Documents RH</span>
    <h1>Flore WANG</h1>
    <p class="subtitle">
      Douala, Bonamoussadi &bull; (+237) 651 88 77 22<br>
      <span style="color:#cbd5e1;">florewang03@gmail.com</span>
    </p>

    <!-- SECTION 1: LETTRE DE MOTIVATION SYSCOLIA (PRIORITAIRE) -->
    <div class="doc-section" style="border-left: 4px solid #818cf8;">
      <div class="doc-title">
        <span>🏢</span>
        <span>Lettre de Motivation — Entreprise SYSCOLIA</span>
      </div>
      <p class="doc-desc">
        ✓ <strong>Destinataire :</strong> À l'attention de la Direction, SYSCOLIA — Douala, Cameroun<br>
        ✓ <strong>Objet :</strong> Candidature au poste de Développeuse d’Applications Web<br>
        ✓ <strong>Arguments employeur :</strong> Plateformes e-learning, React.js, Node.js/Express, bases MySQL, tableaux de bord & suivi utilisateurs
      </p>
      
      <button class="btn-download-syscolia" onclick="downloadLettreSyscolia()">
        <span>📥</span>
        <span>Télécharger la Lettre SYSCOLIA (PDF)</span>
      </button>
      <a href="/lettre-syscolia.html" class="btn-view" style="background:#1e1b4b; color:#c7d2fe; border-color:#4338ca;">
        👁️ Lire la lettre SYSCOLIA directement à l'écran
      </a>
      <a href="/Lettre_de_Motivation_SYSCOLIA_Flore_Wang.pdf?v=${timeStamp}" target="_blank" class="btn-view">
        📄 Ouvrir le PDF SYSCOLIA dans le navigateur
      </a>
    </div>

    <!-- SECTION 2: CURRICULUM VITAE -->
    <div class="doc-section" style="border-left: 4px solid #10b981;">
      <div class="doc-title">
        <span>📄</span>
        <span>Curriculum Vitae (CV)</span>
      </div>
      <p class="doc-desc">
        CV professionnel standardisé : Titulaire Licence Génie Logiciel, BTS GSI, React.js, Node.js, MySQL (Douala Bonamoussadi, 651 88 77 22).
      </p>

      <button class="btn-download-cv" onclick="downloadCV()">
        <span>📥</span>
        <span>Télécharger le CV (PDF)</span>
      </button>
      <a href="/CV_BISSIEK_WANG_Beneditte_Flore.pdf?v=${timeStamp}" target="_blank" class="btn-view">
        👁️ Ouvrir le CV dans le navigateur
      </a>
    </div>

    <!-- SECTION 3: LETTRE GÉNÉRALE / STAGE -->
    <div class="doc-section" style="border-left: 4px solid #64748b;">
      <div class="doc-title">
        <span>✉️</span>
        <span>Lettre de Motivation Générale (Stage Web)</span>
      </div>
      <p class="doc-desc">
        Modèle officiel polyvalent avec signature épurée "Flore WANG".
      </p>

      <button class="btn-download-lettre" onclick="downloadLettre()">
        <span>📥</span>
        <span>Télécharger Lettre Générale (PDF)</span>
      </button>
      <a href="/lettre.html" class="btn-view">
        👁️ Lire la lettre générale à l'écran
      </a>
    </div>

    <div id="status" class="status"></div>
  </div>

  <script>
    const cvBase64 = "${cvBase64}";
    const lettreBase64 = "${lettreBase64}";
    const lettreSyscoliaBase64 = "${lettreSyscoliaBase64}";

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

    function downloadLettreSyscolia() {
      try {
        const blob = b64toBlob(lettreSyscoliaBase64, 'application/pdf');
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Lettre_de_Motivation_SYSCOLIA_Flore_Wang.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        document.getElementById('status').innerText = '✅ Lettre SYSCOLIA téléchargée avec succès !';
      } catch (e) {
        window.location.href = '/Lettre_de_Motivation_SYSCOLIA_Flore_Wang.pdf?v=' + Date.now();
      }
    }

    function downloadLettre() {
      try {
        const blob = b64toBlob(lettreBase64, 'application/pdf');
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Lettre_de_Motivation_Flore_Wang.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        document.getElementById('status').innerText = '✅ Lettre générale téléchargée avec succès !';
      } catch (e) {
        window.location.href = '/Lettre_de_Motivation_Flore_Wang.pdf?v=' + Date.now();
      }
    }

    function downloadCV() {
      try {
        const blob = b64toBlob(cvBase64, 'application/pdf');
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'CV_BISSIEK_WANG_Beneditte_Flore.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        document.getElementById('status').innerText = '✅ Curriculum Vitae téléchargé avec succès !';
      } catch (e) {
        window.location.href = '/CV_BISSIEK_WANG_Beneditte_Flore.pdf?v=' + Date.now();
      }
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../public/telecharger.html'), downloadHubHtml);
fs.writeFileSync(path.join(__dirname, '../public/download.html'), downloadHubHtml);
console.log('lettre-syscolia.html, lettre.html & telecharger.html created successfully');
