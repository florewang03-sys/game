const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateLettreMotivation() {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, '../public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'Lettre_de_Motivation_Flore_Wang.pdf');
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 54, bottom: 54, left: 54, right: 54 },
      info: {
        Title: 'Lettre de Motivation — Flore WANG',
        Author: 'Flore WANG',
        Subject: 'Candidature au stage de Développeur d’Applications Web',
        Keywords: 'Lettre de motivation, Développeur Web, Stage, Flore Wang',
        CreationDate: new Date()
      }
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    const PAGE_WIDTH = 595.28;
    const MARGIN_X = 54;
    const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN_X * 2);

    let currentY = 56;

    // 1. TOP HEADER: CANDIDATE INFO (LEFT) & RECRUITER INFO / DATE (RIGHT)
    // Candidate Info (Gauche)
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#0f172a')
      .text('Flore WANG', MARGIN_X, currentY);
    
    doc.font('Helvetica').fontSize(9.5).fillColor('#334155');
    doc.text('Douala, Bonamoussadi', MARGIN_X, currentY + 18);
    doc.text('Tél : (+237) 651 88 77 22', MARGIN_X, currentY + 32);
    doc.text('E-mail : florewang03@gmail.com', MARGIN_X, currentY + 46);

    // Destinataire (Droite) : Responsable des Ressources Humaines
    const rightColX = 250;
    doc.font('Helvetica').fontSize(9.5).fillColor('#475569')
      .text('Douala, Cameroun', rightColX, currentY, { align: 'right', width: CONTENT_WIDTH - (rightColX - MARGIN_X) });
    
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a')
      .text('À l\'attention du Responsable des Ressources Humaines', rightColX, currentY + 28, { align: 'right', width: CONTENT_WIDTH - (rightColX - MARGIN_X) });

    currentY += 80;

    // Horizontal subtle separator
    doc.strokeColor('#e2e8f0').lineWidth(0.8)
      .moveTo(MARGIN_X, currentY).lineTo(MARGIN_X + CONTENT_WIDTH, currentY).stroke();

    currentY += 24;

    // 2. OBJET DE LA CANDIDATURE
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a')
      .text('Objet : Candidature au stage de Développeur d’Applications Web', MARGIN_X, currentY);

    currentY += 28;

    // 3. FORMULE D'APPEL
    doc.font('Helvetica').fontSize(10).fillColor('#0f172a')
      .text('Madame, Monsieur,', MARGIN_X, currentY);

    currentY += 22;

    // 4. CORPS DU TEXTE
    const paragraphs = [
      "Titulaire d'une Licence en Génie Logiciel, je souhaite vous soumettre ma candidature pour le stage de Développeur d'Applications Web publié sur Expert du CV. Je souhaite aujourd'hui mettre en pratique mes connaissances techniques au sein d'un environnement professionnel et continuer à développer mes compétences dans le domaine du développement web.",
      
      "Au cours de ma formation et de mes projets, j'ai acquis des connaissances en JavaScript, React.js, Node.js/Express, API REST, MySQL ainsi qu'en Git/GitHub. J'ai notamment participé à la conception et au développement d'applications web, ce qui m'a permis de travailler sur la partie frontend et backend, la gestion des données et la mise en place d'API.",
      
      "Sérieuse, motivée et désireuse d'apprendre, je souhaite intégrer une équipe qui me permettra de consolider mes acquis, de découvrir davantage les pratiques professionnelles du développement d'applications web et de contribuer concrètement aux projets qui me seront confiés.",
      
      "Je serais heureuse de pouvoir échanger avec vous lors d'un entretien afin de vous présenter plus en détail mon parcours, mes compétences et ma motivation.",
      
      "Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."
    ];

    for (const para of paragraphs) {
      doc.font('Helvetica').fontSize(10).fillColor('#1e293b')
        .text(para, MARGIN_X, currentY, {
          width: CONTENT_WIDTH,
          align: 'justify',
          lineGap: 4.5
        });
      const h = doc.heightOfString(para, { width: CONTENT_WIDTH, lineGap: 4.5 });
      currentY += h + 14;
    }

    currentY += 20;

    // 5. SIGNATURE (Uniquement Flore WANG, sans mention à la fin)
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a')
      .text('Flore WANG', rightColX, currentY, { align: 'right', width: CONTENT_WIDTH - (rightColX - MARGIN_X) });

    doc.end();

    writeStream.on('finish', () => {
      fs.copyFileSync(outputPath, path.join(outputDir, 'lettre_de_motivation.pdf'));
      console.log('Lettre PDF générée avec succès (taille:', fs.statSync(outputPath).size, 'octets)');
      resolve();
    });

    writeStream.on('error', reject);
  });
}

generateLettreMotivation().catch(err => {
  console.error('Erreur génération lettre:', err);
  process.exit(1);
});
