const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateMindriftCV() {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, '..', 'public');
    const outputPath = path.join(outputDir, 'CV_Flore_Bissiekwang_Mindrift.pdf');

    // Single page A4 clean layout
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 32, bottom: 32, left: 36, right: 36 },
      info: {
        Title: 'CV Flore Bissiekwang - AI Tutor & French Content Evaluator',
        Author: 'Flore Bissiekwang',
        Subject: 'Mindrift Application Resume'
      }
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;

    // Dimensions
    const sWidth = 185;
    const sMargin = 32;

    // Sidebar Background (Dark Indigo / Slate)
    doc.rect(0, 0, sWidth + sMargin * 1.5, PAGE_HEIGHT).fill('#0f172a');

    // Sidebar Accent Top Bar
    doc.rect(0, 0, sWidth + sMargin * 1.5, 6).fill('#3b82f6');

    // Sidebar Content
    let sY = 36;

    // Name & Title in sidebar
    doc.font('Helvetica-Bold').fontSize(16).fillColor('#ffffff').text('FLORE', sMargin, sY, { width: sWidth });
    sY += 18;
    doc.font('Helvetica-Bold').fontSize(15).fillColor('#60a5fa').text('BISSIEKWANG', sMargin, sY, { width: sWidth });
    sY += 20;

    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#38bdf8')
      .text('AI TUTOR & DATA ANNOTATOR', sMargin, sY, { width: sWidth, characterSpacing: 0.5 });
    sY += 12;
    doc.font('Helvetica').fontSize(8).fillColor('#94a3b8')
      .text('Évaluatrice Linguistique Francophone', sMargin, sY, { width: sWidth });
    sY += 22;

    // Divider
    doc.strokeColor('#334155').lineWidth(0.75).moveTo(sMargin, sY).lineTo(sMargin + sWidth, sY).stroke();
    sY += 14;

    function drawSidebarSection(title) {
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#e2e8f0')
        .text(title, sMargin, sY, { width: sWidth, characterSpacing: 0.5 });
      sY += 11;
      doc.strokeColor('#1e293b').lineWidth(0.5).moveTo(sMargin, sY).lineTo(sMargin + sWidth, sY).stroke();
      sY += 8;
    }

    // CONTACT
    drawSidebarSection('CONTACT');
    const contacts = [
      { label: 'florewang03@gmail.com', color: '#ffffff' },
      { label: '+237 651 88 77 22', color: '#cbd5e1' },
      { label: '+237 697 20 44 31', color: '#cbd5e1' },
      { label: 'Douala, Cameroun', color: '#38bdf8' },
      { label: 'Bonamoussadi', color: '#94a3b8' }
    ];
    for (const c of contacts) {
      doc.font('Helvetica').fontSize(8).fillColor(c.color).text(c.label, sMargin, sY, { width: sWidth });
      sY += 13.5;
    }
    sY += 6;

    // Divider
    doc.strokeColor('#334155').lineWidth(0.75).moveTo(sMargin, sY).lineTo(sMargin + sWidth, sY).stroke();
    sY += 14;

    // LANGUES
    drawSidebarSection('LANGUES');
    const languages = [
      { lang: 'Français', level: 'Langue maternelle (C2)', desc: 'Excellente maîtrise syntaxique et rédactionnelle' },
      { lang: 'Anglais', level: 'Intermédiaire avancé (B2)', desc: 'Compréhension écrite fluide' }
    ];
    for (const l of languages) {
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#ffffff').text(l.lang, sMargin, sY, { width: sWidth });
      sY += 11;
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#38bdf8').text(l.level, sMargin, sY, { width: sWidth });
      sY += 10;
      doc.font('Helvetica').fontSize(7).fillColor('#94a3b8').text(l.desc, sMargin, sY, { width: sWidth });
      sY += 14;
    }
    sY += 2;

    // Divider
    doc.strokeColor('#334155').lineWidth(0.75).moveTo(sMargin, sY).lineTo(sMargin + sWidth, sY).stroke();
    sY += 14;

    // COMPÉTENCES TECHNIQUES
    drawSidebarSection('COMPÉTENCES CLÉS');
    const skills = [
      'Annotation & labellisation IA',
      'Évaluation de modèles LLM',
      'Fact-checking & vérification',
      'Correction grammaticale & style',
      'Rédaction de synthèses claires',
      'Esprit critique & analyse comparative',
      'Respect strict des directives',
      'Google Docs, Workspace, Sheets',
      'Gestion rigoureuse du temps'
    ];
    for (const s of skills) {
      doc.circle(sMargin + 3, sY + 4, 1.5).fill('#38bdf8');
      doc.font('Helvetica').fontSize(7.5).fillColor('#f1f5f9').text(s, sMargin + 10, sY, { width: sWidth - 10 });
      sY += 13;
    }
    sY += 6;

    // Divider
    doc.strokeColor('#334155').lineWidth(0.75).moveTo(sMargin, sY).lineTo(sMargin + sWidth, sY).stroke();
    sY += 14;

    // FORMATION
    drawSidebarSection('FORMATION');
    const edus = [
      { degree: 'Licence Génie Logiciel', place: 'IUGET — Douala (2026)' },
      { degree: 'BTS Systèmes d\'Information', place: 'IUGET — Douala (2025)' },
      { degree: 'Baccalauréat A4 (Lettres/Philo)', place: 'Enseignement Secondaire (2023)' }
    ];
    for (const e of edus) {
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#ffffff').text(e.degree, sMargin, sY, { width: sWidth });
      sY += 10;
      doc.font('Helvetica').fontSize(7.2).fillColor('#94a3b8').text(e.place, sMargin, sY, { width: sWidth });
      sY += 13;
    }

    // ==================== RIGHT MAIN CONTENT ====================
    const rMargin = 222;
    const rWidth = PAGE_WIDTH - rMargin - 32;
    let rY = 36;

    function drawMainHeader(title) {
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a').text(title, rMargin, rY, { characterSpacing: 0.5 });
      rY += 14;
      doc.strokeColor('#2563eb').lineWidth(1.5).moveTo(rMargin, rY).lineTo(rMargin + rWidth, rY).stroke();
      rY += 10;
    }

    // PROFIL PROFESSIONNEL
    drawMainHeader('PROFIL PROFESSIONNEL');
    const profileText = "Rédactrice et évaluatrice de données francophone rigoureuse, dotée d'une formation supérieure en technologies de l'information et d'une excellente maîtrise de la langue française écrite. Spécialisée dans l'évaluation critique de réponses générées par les modèles d'intelligence artificielle (LLM), l'annotation de données sémantiques, la correction stylistique et le contrôle qualité des contenus. Capable de suivre des consignes complexes avec précision, de détecter les inexactitudes factuelles ou stylistiques, et de fournir des justifications argumentées et structurées.";
    doc.font('Helvetica').fontSize(8.5).fillColor('#334155').text(profileText, rMargin, rY, {
      width: rWidth,
      align: 'justify',
      lineGap: 3
    });
    rY += doc.heightOfString(profileText, { width: rWidth, lineGap: 3 }) + 18;

    // EXPÉRIENCE PROFESSIONNELLE
    drawMainHeader('EXPÉRIENCE PROFESSIONNELLE');

    function drawJob(role, company, period, tasks) {
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f172a').text(role, rMargin, rY, { width: rWidth });
      rY += 12;
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#2563eb')
        .text(company, rMargin, rY, { continued: true })
        .font('Helvetica').fillColor('#64748b')
        .text('  |  ' + period);
      rY += 13;

      for (const t of tasks) {
        doc.circle(rMargin + 4, rY + 4, 1.6).fill('#2563eb');
        doc.font('Helvetica').fontSize(8).fillColor('#334155')
          .text(t, rMargin + 12, rY, { width: rWidth - 12, lineGap: 2 });
        rY += doc.heightOfString(t, { width: rWidth - 12, lineGap: 2 }) + 4.5;
      }
      rY += 8;
    }

    // 1. Évaluatrice de données & Rédactrice Freelance
    drawJob(
      'Évaluatrice Linguistique & Rédactrice de Contenu',
      'Freelance / Projets Indépendants',
      '2023 — Aujourd\'hui',
      [
        'Évaluation et comparaison de réponses textuelles pour améliorer la pertinence et la précision de contenus francophones.',
        'Contrôle qualité linguistique : réécriture, correction de fautes grammaticales, amélioration de la fluidité et du niveau de langue.',
        'Rédaction de synthèses comparatives claires explicitant les critères d\'évaluation (vérité factuelle, clarté, absence de biais, conformité aux instructions).',
        'Vérification rigoureuse des sources et identification des hallucinations ou incohérences logiques.'
      ]
    );

    // 2. Gestionnaire de Contenus Web & Systèmes
    drawJob(
      'Assistante Gestion de Données & Conception Web',
      'Kaiidou Lab SARL — Douala',
      'Janvier — Avril 2026',
      [
        'Saisie, structuration et mise à jour de bases d\'informations et de profils commerciaux.',
        'Conception d\'interfaces et rédaction des textes explicatifs pour une application de suivi client.',
        'Vérification de la cohérence des données et application stricte des règles de sécurité et de confidentialité.'
      ]
    );

    // 3. Support Administratif & Relecture de Documents
    drawJob(
      'Relecture de Documents & Support Saisie',
      'BNR Company — Douala',
      'Juillet 2025',
      [
        'Relecture attentive et correction orthographique de factures et courriers administratifs.',
        'Structuration de modèles documentaires et saisie normalisée respectant les directives de l\'entreprise.'
      ]
    );

    // Footer
    doc.strokeColor('#e2e8f0').lineWidth(0.5).moveTo(rMargin, PAGE_HEIGHT - 30).lineTo(rMargin + rWidth, PAGE_HEIGHT - 30).stroke();
    doc.font('Helvetica').fontSize(7.2).fillColor('#94a3b8')
      .text('CV Spécifique AI Tutor & Évaluation Linguistique — Flore Bissiekwang • florewang03@gmail.com', rMargin, PAGE_HEIGHT - 22, {
        width: rWidth,
        align: 'center'
      });

    doc.end();

    writeStream.on('finish', () => {
      console.log('PDF Mindrift generated at:', outputPath, 'size:', fs.statSync(outputPath).size);
      resolve();
    });
    writeStream.on('error', reject);
  });
}

generateMindriftCV().catch(err => {
  console.error(err);
  process.exit(1);
});
