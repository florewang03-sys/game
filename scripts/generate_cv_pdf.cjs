const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateCV() {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, '../public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

  const outputPath = path.join(outputDir, 'CV_BISSIEK_WANG_Beneditte_Flore.pdf');
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    autoFirstPage: true,
    info: {
      Title: 'Curriculum Vitae — BISSIEK WANG Beneditte Flore',
      Author: 'BISSIEK WANG Beneditte Flore',
      Subject: 'Développeuse Full-Stack',
      Keywords: 'Full-Stack, React, Node.js, MySQL, Génie Logiciel, IUGET',
      CreationDate: new Date()
    }
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const SIDEBAR_WIDTH = 195;

  // 1. Draw Left Sidebar Background
  doc.rect(0, 0, SIDEBAR_WIDTH, PAGE_HEIGHT).fill('#0f172a');

  // Decorative subtle accent top strip
  doc.rect(0, 0, SIDEBAR_WIDTH, 4).fill('#6366f1');

  // ==================== LEFT SIDEBAR CONTENT ====================
  const sMargin = 16;
  const sWidth = SIDEBAR_WIDTH - (sMargin * 2);
  let sY = 28;

  // Name Header
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#ffffff')
    .text('BISSIEK WANG', sMargin, sY, { width: sWidth });
  sY += 17;

  doc.font('Helvetica-Bold').fontSize(12).fillColor('#a5b4fc')
    .text('Beneditte Flore', sMargin, sY, { width: sWidth });
  sY += 15;

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#2dd4bf')
    .text('DÉVELOPPEUSE FULL-STACK', sMargin, sY, { width: sWidth, characterSpacing: 0.5 });
  sY += 18;

  // Divider
  doc.strokeColor('#334155').lineWidth(0.75).moveTo(sMargin, sY).lineTo(sMargin + sWidth, sY).stroke();
  sY += 12;

  // Helper section header
  function drawSidebarSectionHeader(title) {
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#94a3b8')
      .text(title, sMargin, sY, { width: sWidth, characterSpacing: 0.5 });
    sY += 11;
    doc.strokeColor('#1e293b').lineWidth(0.5).moveTo(sMargin, sY).lineTo(sMargin + sWidth, sY).stroke();
    sY += 7;
  }

  // CONTACT
  drawSidebarSectionHeader('CONTACT');

  const contacts = [
    { label: 'Tél : 651 88 77 22', link: 'tel:+237651887722', color: '#ffffff' },
    { label: 'Tél : 697 20 44 31', link: 'tel:+237697204431', color: '#e2e8f0' },
    { label: 'florewang03@gmail.com', link: 'mailto:florewang03@gmail.com', color: '#cbd5e1' },
    { label: 'Douala, Bonamoussadi', color: '#38bdf8' },
    { label: 'Née le 14/04/2006', color: '#94a3b8' }
  ];

  for (const c of contacts) {
    doc.font('Helvetica').fontSize(8).fillColor(c.color);
    if (c.link) {
      doc.text(c.label, sMargin, sY, { width: sWidth, link: c.link, underline: false });
    } else {
      doc.text(c.label, sMargin, sY, { width: sWidth });
    }
    sY += 13;
  }
  sY += 4;

  // Divider
  doc.strokeColor('#334155').lineWidth(0.75).moveTo(sMargin, sY).lineTo(sMargin + sWidth, sY).stroke();
  sY += 11;

  // COMPÉTENCES TECHNIQUES (Pure vector bullet dots - No unicode font glyphs)
  drawSidebarSectionHeader('COMPÉTENCES TECHNIQUES');

  const techSkills = [
    'React.js, JavaScript, CSS',
    'Node.js / Express',
    'API REST',
    'JWT (authentification)',
    'Bases en Java',
    'MySQL',
    'Git / GitHub',
    'VS Code, NetBeans',
    'Réseaux LAN, MAN, WAN (bases)',
    'Canva (maîtrise)'
  ];

  for (const skill of techSkills) {
    doc.circle(sMargin + 3, sY + 4, 1.4).fill('#818cf8');
    doc.font('Helvetica').fontSize(7.5).fillColor('#f1f5f9')
      .text(skill, sMargin + 10, sY, { width: sWidth - 10 });
    sY += 12.5;
  }
  sY += 4;

  // Divider
  doc.strokeColor('#334155').lineWidth(0.75).moveTo(sMargin, sY).lineTo(sMargin + sWidth, sY).stroke();
  sY += 11;

  // COMPÉTENCES TRANSVERSALES (Pure vector bullet dots)
  drawSidebarSectionHeader('COMPÉTENCES TRANSVERSALES');

  const softSkills = [
    'Travail en équipe',
    'Rigueur',
    'Capacité d\'adaptation'
  ];

  for (const soft of softSkills) {
    doc.circle(sMargin + 3, sY + 4, 1.4).fill('#2dd4bf');
    doc.font('Helvetica').fontSize(7.5).fillColor('#f1f5f9')
      .text(soft, sMargin + 10, sY, { width: sWidth - 10 });
    sY += 12.5;
  }
  sY += 4;

  // Divider
  doc.strokeColor('#334155').lineWidth(0.75).moveTo(sMargin, sY).lineTo(sMargin + sWidth, sY).stroke();
  sY += 11;

  // FORMATION
  drawSidebarSectionHeader('FORMATION');

  const degrees = [
    { name: 'Licence Génie Logiciel', inst: 'IUGET — 2026' },
    { name: 'BTS Gestion des Systèmes d\'Information', inst: 'IUGET — 2025' },
    { name: 'Baccalauréat A4', inst: '2023' }
  ];

  for (const d of degrees) {
    doc.font('Helvetica-Bold').fontSize(7.8).fillColor('#ffffff').text(d.name, sMargin, sY, { width: sWidth });
    sY += 10;
    doc.font('Helvetica').fontSize(7.2).fillColor('#a5b4fc').text(d.inst, sMargin, sY, { width: sWidth });
    sY += 13;
  }

  // ==================== RIGHT CONTENT AREA ====================
  const rMargin = 220;
  const rWidth = PAGE_WIDTH - rMargin - 26;
  let rY = 28;

  // PROFIL Section
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a').text('PROFIL', rMargin, rY, { characterSpacing: 0.5 });
  rY += 14;
  doc.strokeColor('#0f172a').lineWidth(1.5).moveTo(rMargin, rY).lineTo(rMargin + rWidth, rY).stroke();
  rY += 10;

  const profileText = "Jeune développeuse full-stack, titulaire d'une Licence en Génie Logiciel, avec une expérience en développement web et en systèmes d'information. Autonome sur React.js, Node.js et MySQL, j'ai également participé à la conception et au développement d'applications web de gestion de prospects et d'interactions commerciales. Rigoureuse et orientée résultats, je souhaite mettre mes compétences en pratique et contribuer à des projets concrets au sein d'une équipe professionnelle.";

  doc.font('Helvetica').fontSize(8.5).fillColor('#334155')
    .text(profileText, rMargin, rY, {
      width: rWidth,
      align: 'justify',
      lineGap: 3
    });

  const profileHeight = doc.heightOfString(profileText, { width: rWidth, lineGap: 3 });
  rY += profileHeight + 22;

  // EXPÉRIENCE PROFESSIONNELLE Section
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a').text('EXPÉRIENCE PROFESSIONNELLE', rMargin, rY, { characterSpacing: 0.5 });
  rY += 14;
  doc.strokeColor('#0f172a').lineWidth(1.5).moveTo(rMargin, rY).lineTo(rMargin + rWidth, rY).stroke();
  rY += 12;

  // Helper for experiences with pure vector bullets (guaranteed NO "%" or corrupted symbols)
  function drawExperience(role, orgLine, bullets) {
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f172a').text(role, rMargin, rY, { width: rWidth });
    rY += 12;

    doc.font('Helvetica-Bold').fontSize(8).fillColor('#475569')
      .text(orgLine.company, rMargin, rY, { continued: true })
      .font('Helvetica').fillColor('#64748b')
      .text('  |  ' + orgLine.period);
    rY += 13;

    for (const bullet of bullets) {
      // Draw a crisp, modern vector rounded dot bullet
      doc.circle(rMargin + 4, rY + 4.2, 1.8).fill('#4f46e5');

      // Draw bullet text indented with clean typography
      doc.font('Helvetica').fontSize(8.2).fillColor('#334155')
        .text(bullet, rMargin + 12, rY, { width: rWidth - 12, lineGap: 2.2 });

      const bHeight = doc.heightOfString(bullet, { width: rWidth - 12, lineGap: 2.2 });
      rY += bHeight + 5;
    }
    rY += 8;
  }

  // 1. Freelance
  drawExperience(
    'Développeuse Freelance — Application front-end pour une église',
    { company: 'Freelance', period: 'Avril 2026 — Aujourd\'hui' },
    [
      'Développement de l\'interface front-end d\'une plateforme web pour une église, de la conception à l\'intégration.',
      'Utilisation de React.js, CSS et JavaScript pour construire des composants réutilisables et une expérience utilisateur soignée.'
    ]
  );

  // 2. Kaiidou Lab SARL
  drawExperience(
    'Stagiaire en Génie Logiciel',
    { company: 'Kaiidou Lab SARL', period: '27 janvier — 7 avril 2026' },
    [
      'Mise à jour de logiciels de gestion comptable et commerciale pour les clients de l\'entreprise.',
      'Installation et configuration des logiciels EasyProcess, EasyGC et EasyCompta sur les machines clientes et serveurs.',
      'Réalisation des sauvegardes régulières des données de l\'entreprise.',
      'Conception et développement d\'une application web de gestion des prospects et des interactions commerciales.'
    ]
  );

  // 3. BNR Company
  drawExperience(
    'Stagiaire en Gestion des Systèmes d\'Information',
    { company: 'BNR Company', period: 'Juillet 2025' },
    [
      'Apprentissage approfondi du HTML et du CSS à travers des cas pratiques.',
      'Reproduction de modèles de factures destinés à être intégrés dans le système de gestion de l\'entreprise.'
    ]
  );

  // Bottom subtle footer
  doc.strokeColor('#e2e8f0').lineWidth(0.5).moveTo(rMargin, PAGE_HEIGHT - 30).lineTo(rMargin + rWidth, PAGE_HEIGHT - 30).stroke();
  doc.font('Helvetica').fontSize(7).fillColor('#94a3b8')
    .text('Curriculum Vitae officiel — BISSIEK WANG Beneditte Flore • florewang03@gmail.com', rMargin, PAGE_HEIGHT - 22, {
      width: rWidth,
      align: 'center'
    });

  doc.end();

    writeStream.on('finish', () => {
      console.log('PDF generated at:', outputPath, 'size:', fs.statSync(outputPath).size);
      fs.copyFileSync(outputPath, path.join(outputDir, 'CV_BISSIEK_WANG.pdf'));
      fs.copyFileSync(outputPath, path.join(outputDir, 'cv.pdf'));
      resolve();
    });

    writeStream.on('error', reject);
  });
}

generateCV().catch(err => {
  console.error('Erreur génération CV:', err);
  process.exit(1);
});
