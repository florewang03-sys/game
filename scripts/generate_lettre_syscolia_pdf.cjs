const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateLettreSyscolia() {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, '../public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'Lettre_de_Motivation_SYSCOLIA_Flore_Wang.pdf');
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 54, right: 54 },
      info: {
        Title: 'Lettre de Motivation SYSCOLIA — Flore WANG',
        Author: 'Flore WANG',
        Subject: 'Candidature au poste de Développeuse d’Applications Web — SYSCOLIA',
        Keywords: 'Lettre de motivation, SYSCOLIA, Développeuse Web, Douala, Flore Wang',
        CreationDate: new Date()
      }
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    const PAGE_WIDTH = 595.28;
    const MARGIN_X = 54;
    const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN_X * 2);

    let currentY = 52;

    // 1. TOP HEADER: CANDIDATE INFO (LEFT) & RECRUITER INFO / DATE (RIGHT)
    // Coordonnées Candidate (Gauche)
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#0f172a')
      .text('Flore WANG', MARGIN_X, currentY);
    
    doc.font('Helvetica').fontSize(9.5).fillColor('#334155');
    doc.text('Douala, Bonamoussadi', MARGIN_X, currentY + 18);
    doc.text('Tél : (+237) 651 88 77 22', MARGIN_X, currentY + 32);
    doc.text('E-mail : florewang03@gmail.com', MARGIN_X, currentY + 46);

    // Destinataire SYSCOLIA (Droite)
    const rightColX = 240;
    doc.font('Helvetica').fontSize(9.5).fillColor('#475569')
      .text('Douala, Cameroun', rightColX, currentY, { align: 'right', width: CONTENT_WIDTH - (rightColX - MARGIN_X) });
    
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0f172a')
      .text('À l\'attention de la Direction', rightColX, currentY + 24, { align: 'right', width: CONTENT_WIDTH - (rightColX - MARGIN_X) });

    doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#4338ca')
      .text('SYSCOLIA', rightColX, currentY + 40, { align: 'right', width: CONTENT_WIDTH - (rightColX - MARGIN_X) });
    
    doc.font('Helvetica').fontSize(9).fillColor('#64748b')
      .text('Douala, Cameroun', rightColX, currentY + 56, { align: 'right', width: CONTENT_WIDTH - (rightColX - MARGIN_X) });

    currentY += 88;

    // Ligne séparatrice discrète
    doc.strokeColor('#e2e8f0').lineWidth(0.8)
      .moveTo(MARGIN_X, currentY).lineTo(MARGIN_X + CONTENT_WIDTH, currentY).stroke();

    currentY += 22;

    // 2. OBJET PRÉCIS
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a')
      .text('Objet : Candidature au poste de Développeuse d’Applications Web', MARGIN_X, currentY);

    currentY += 26;

    // 3. FORMULE D'APPEL
    doc.font('Helvetica').fontSize(10).fillColor('#0f172a')
      .text('Madame, Monsieur,', MARGIN_X, currentY);

    currentY += 20;

    // 4. PARAGRAPHES (Structure RH à haute valeur : Entreprise -> Compétences -> Valeur ajoutée -> Entretien)
    const paragraphs = [
      "Acteur de référence dans la formation professionnelle en ligne et la digitalisation des compétences, SYSCOLIA se distingue par la qualité et l'accessibilité de ses plateformes éducatives. Particulièrement sensible à vos initiatives d'apprentissage numérique et au développement de vos outils web interactifs, je vous propose ma candidature pour participer activement au développement et à l'évolution de vos applications.",

      "Titulaire d'un BTS en Gestion des Systèmes d'Information et d'une Licence en Génie Logiciel, j'ai développé une solide maîtrise technique dans la conception et l'implémentation de solutions logicielles. Je maîtrise l'écosystème JavaScript moderne, avec des compétences concrètes sur React.js pour la conception d'interfaces réactives et fluides, ainsi que Node.js et Express pour la création d'API REST fiables et sécurisées.",

      "Sur le plan des données, mon expérience me permet de modéliser et structurer efficacement des bases relationnelles MySQL, tout en assurant une intégration fluide entre le front-end et le back-end. J'ai notamment participé à la conception de tableaux de bord, de formulaires dynamiques et d'outils de suivi d'utilisateurs, des fonctionnalités essentielles pour une plateforme de gestion et d'apprentissage en ligne comme la vôtre.",

      "Rigoureuse, force de proposition et habituée à travailler avec méthode et respect des délais, je souhaite mettre mon énergie au service des projets de SYSCOLIA. Qu'il s'agisse de développer de nouveaux modules, d'améliorer l'expérience utilisateur de vos apprenants ou d'assurer la robustesse technique de vos services numériques, je saurai m'adapter rapidement à vos exigences.",

      "Je me tiens à votre entière disposition pour convenir d'un entretien au cours duquel je pourrai vous détailler mon profil et vous exposer comment mes compétences s'alignent avec les objectifs de SYSCOLIA.",

      "Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations les plus distinguées."
    ];

    for (const para of paragraphs) {
      doc.font('Helvetica').fontSize(9.5).fillColor('#1e293b')
        .text(para, MARGIN_X, currentY, {
          width: CONTENT_WIDTH,
          align: 'justify',
          lineGap: 4
        });
      const h = doc.heightOfString(para, { width: CONTENT_WIDTH, lineGap: 4 });
      currentY += h + 11;
    }

    currentY += 12;

    // 5. SIGNATURE
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a')
      .text('Flore WANG', rightColX, currentY, { align: 'right', width: CONTENT_WIDTH - (rightColX - MARGIN_X) });

    doc.end();

    writeStream.on('finish', () => {
      console.log('Lettre SYSCOLIA PDF générée avec succès (taille:', fs.statSync(outputPath).size, 'octets)');
      resolve();
    });

    writeStream.on('error', reject);
  });
}

generateLettreSyscolia().catch(err => {
  console.error('Erreur génération lettre SYSCOLIA:', err);
  process.exit(1);
});
