import express from "express";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import Parser from "rss-parser";
import nodemailer from "nodemailer";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const rssParser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8'
  },
});

const app = express();

// Configure Nodemailer for OVH
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "ssl0.ovh.net",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: (process.env.SMTP_PORT || "465") === "465", 
  auth: {
    user: process.env.SMTP_USER || "contact@simulimmoneuf.fr",
    pass: process.env.SMTP_PASSWORD || "",
  },
});

const escapeHtml = (unsafe: any) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatValue = (val: any) => {
  if (typeof val === 'boolean') return val ? 'Oui' : 'Non';
  if (val === undefined || val === null || val === '') return '-';
  if (typeof val === 'number') return val.toLocaleString('fr-FR');
  return escapeHtml(val);
};

const generateTableHtml = (title: string, data: any, intro: string) => {
  const s = data.simulationData || data;
  
  const getHousingStatus = (status: string) => {
    const map: any = {
      'locataire': 'Locataire',
      'proprietaire': 'Propriétaire',
      'heberge': 'Hébergé gratuitement',
      'fonction': 'Logement de fonction'
    };
    return map[status] || status;
  };

  return `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5;">
    <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">${title}</h2>
    <p>${intro}</p>
    
    <h3 style="color: #475569; border-left: 4px solid #16a34a; padding-left: 10px; margin-top: 25px;">👤 Profil & Contact</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 220px;">Prénom / Nom</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatValue(data.firstName || s.firstName)} ${formatValue(data.lastName || s.lastName)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">E-mail</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;"><a href="mailto:${data.email || s.email}">${formatValue(data.email || s.email)}</a></td>
      </tr>
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Téléphone</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatValue(data.phone || s.phone)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Âges des acquéreurs</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">Acq 1: ${formatValue(s.age1)} ans ${s.isCouple ? ` / Acq 2: ${formatValue(s.age2)} ans` : ''}</td>
      </tr>
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Situation Maritale</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${s.isCouple ? 'En couple' : 'SÉP / Célibataire'} (${formatValue(s.maritalStatus)})</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Enfants à charge</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatValue(s.children)}</td>
      </tr>
    </table>

    <h3 style="color: #475569; border-left: 4px solid #16a34a; padding-left: 10px; margin-top: 25px;">🏠 Situation Résidence Principale</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 220px;">Primo-accédant</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${s.primo === 'yes' ? 'OUI' : 'NON'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Situation actuelle</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${getHousingStatus(s.housingStatus)}</td>
      </tr>
      ${s.housingStatus !== 'proprietaire' ? `
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Non-Proprio depuis</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${s.nonOwnerDuration === 'moreThan2Years' ? 'Plus de 2 ans' : 'Moins de 2 ans'}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Déjà été propriétaire ?</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${s.wasPrimaryOwnerBefore === 'yes' ? 'Oui' : 'Non'}</td>
      </tr>
    </table>

    <h3 style="color: #475569; border-left: 4px solid #16a34a; padding-left: 10px; margin-top: 25px;">💼 Revenus & Emplois</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 220px;">Revenu Net (Acq 1)</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatValue(s.rev1Net)} € / mois (sur ${s.rev1Months || 12} mois)</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Autres revenus (Acq 1)</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatValue(s.rev1Other || s.rev1?.other)} €</td>
      </tr>
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Contrat / Ancienneté (Acq 1)</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${s.contractType1 || '-'} - ${s.seniority1 || '-'} ${s.trialFinished1 ? '(Essai fini)' : s.trialEnd1 ? `(Fin essai : ${s.trialEnd1} mois)` : ''}</td>
      </tr>
      ${s.isCouple ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Revenu Net (Acq 2)</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatValue(s.rev2Net)} € / mois (sur ${s.rev2Months || 12} mois)</td>
      </tr>
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Contrat / Ancienneté (Acq 2)</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${s.contractType2 || '-'} - ${s.seniority2 || '-'} ${s.trialFinished2 ? '(Essai fini)' : s.trialEnd2 ? `(Fin essai : ${s.trialEnd2} mois)` : ''}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">RFR cumulé</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; color: #2563eb;">${formatValue(s.rfr)} €</td>
      </tr>
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Charges mensuelles</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatValue(s.existingCreditMonthly)} € / mois</td>
      </tr>
    </table>

    <h3 style="color: #475569; border-left: 4px solid #16a34a; padding-left: 10px; margin-top: 25px;">🏢 Détails du Projet Souhaité</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 220px;">Type de bien</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0; text-transform: capitalize;">${s.propertyType || '-'} - ${s.rooms || '-'} pièces</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Étage / Extérieur</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${s.floor || '-'} / Extérieur : ${s.hasExterior ? 'OUI' : 'NON'}</td>
      </tr>
      <tr style="background: #f8fafc;">
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Parking / Localisation</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">Parking : ${s.hasParking ? 'OUI' : 'NON'} / ${formatValue(s.city)} (Zone ${formatValue(s.zone)})</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Date de livraison</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; color: #c2410c;">${s.deliveryQuarter || '-'} ${s.deliveryYear || ''}</td>
      </tr>
    </table>

    <h3 style="color: #475569; border-left: 4px solid #16a34a; padding-left: 10px; margin-top: 25px;">📉 Capacité de Financement</h3>
    <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #10b981;">
      <p style="margin: 5px 0;"><strong>Budget Total Acquisition :</strong> <span style="font-size: 1.25em; color: #059669;">${formatValue(s.curNetPrice)} €</span></p>
      <p style="margin: 5px 0;"><strong>Apport personnel :</strong> ${formatValue(s.apport)} €</p>
      <p style="margin: 5px 0;"><strong>Mensualité cible :</strong> ${formatValue(s.maxMonthlyPayment)} € / mois (max)</p>
      <p style="margin: 5px 0;"><strong>PTZ estimé :</strong> ${formatValue(s.ptzAmount)} €</p>
    </div>
    
    <p style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
      Demande transmise techniquement par <strong>SimulImmoNeuf</strong>.
    </p>
  </div>
`;};

// Global Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// General Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// Stricter Rate Limiting for API routes that send emails
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV, vercel: !!process.env.VERCEL });
});

// API Route: Fetch Rates from MoneyVox
app.get("/api/rates", async (req, res) => {
  try {
    const { data } = await axios.get("https://www.moneyvox.fr/credit/barometre-taux.php", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 8000
    });
    const $ = cheerio.load(data);
    
    const ratesMap: Map<number, { avgRate?: number, midRate?: number, topRate?: number }> = new Map();
    
    $("table").each((_, table) => {
      const headers: string[] = [];
      $(table).find("tr").first().find("th, td").each((__, cell) => {
        headers.push($(cell).text().trim().toLowerCase());
      });

      const hasDurations = headers.some(h => h.includes("ans"));
      if (!hasDurations) return;

      $(table).find("tr").each((rowIdx, row) => {
        if (rowIdx === 0) return;

        const cells = $(row).find("td, th");
        const rowLabel = $(cells[0]).text().trim().toLowerCase();
        
        const cleanRate = (s: string) => {
          const cleaned = s.replace(",", ".").replace(/[^0-9.]/g, "");
          return cleaned ? parseFloat(cleaned) : NaN;
        };

        const isBonRow = rowLabel === "bon taux";
        const isTresBonRow = rowLabel.includes("très bon");
        const isTopRow = rowLabel.includes("excellent");

        if (isBonRow || isTresBonRow || isTopRow) {
          cells.each((cellIdx, cell) => {
            if (cellIdx === 0) return;
            
            const headerText = headers[cellIdx];
            if (headerText && headerText.includes("ans")) {
              const years = parseInt(headerText);
              const rateValue = cleanRate($(cell).text().trim());
              
              if (!isNaN(years) && !isNaN(rateValue)) {
                const existing = ratesMap.get(years) || {};
                if (isBonRow) existing.avgRate = rateValue;
                if (isTresBonRow) existing.midRate = rateValue;
                if (isTopRow) existing.topRate = rateValue;
                ratesMap.set(years, existing);
              }
            }
          });
        }
      });
    });

    const ratesList = Array.from(ratesMap.entries())
      .map(([years, vals]) => ({
        years,
        avgRate: vals.avgRate || 0,
        midRate: vals.midRate || vals.avgRate || 0,
        topRate: vals.topRate || vals.midRate || vals.avgRate || 0
      }))
      .filter(r => r.avgRate > 0);

    if (ratesList.length < 2) {
      return res.json([
        { years: 7, avgRate: 3.20, midRate: 2.98, topRate: 2.70 },
        { years: 10, avgRate: 3.30, midRate: 3.05, topRate: 2.70 },
        { years: 15, avgRate: 3.47, midRate: 3.22, topRate: 2.90 },
        { years: 20, avgRate: 3.56, midRate: 3.34, topRate: 3.05 },
        { years: 25, avgRate: 3.65, midRate: 3.42, topRate: 3.15 },
      ].sort((a, b) => a.years - b.years));
    }

    res.json(ratesList.sort((a, b) => a.years - b.years));
  } catch (error) {
    console.error("Error fetching rates:", error);
    res.json([
      { years: 7, avgRate: 3.20, midRate: 2.98, topRate: 2.70 },
      { years: 10, avgRate: 3.30, midRate: 3.05, topRate: 2.70 },
      { years: 15, avgRate: 3.47, midRate: 3.22, topRate: 2.90 },
      { years: 20, avgRate: 3.56, midRate: 3.34, topRate: 3.05 },
      { years: 25, avgRate: 3.65, midRate: 3.42, topRate: 3.15 },
    ]);
  }
});

// API Route: Handle Document Requests
app.post("/api/request-docs", apiLimiter, express.json(), async (req, res) => {
  try {
    const data = req.body;
    console.log("Document request received for:", data.clientName || `${data.firstName} ${data.lastName}`);
    
    if (!process.env.SMTP_PASSWORD) {
      console.warn("SMTP_PASSWORD not set. Email not sent.");
      return res.json({ success: true, message: "Logged (SMTP not configured)" });
    }

    const mailOptions = {
      from: `"SimulImmoNeuf" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || "contact@simulimmoneuf.fr",
      subject: `Dossier Immoneuf : ${data.firstName || data.clientName} ${data.lastName || ''}`,
      text: `Nouveau dossier de simulation reçu.`,
      html: generateTableHtml(
        "Dossier de Simulation", 
        data, 
        "Un client vient de terminer une simulation complète sur votre site."
      ),
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// API Route: Handle Meeting Requests
app.post("/api/request-meeting", apiLimiter, express.json(), async (req, res) => {
  try {
    const data = req.body;
    console.log("Meeting request received from:", data.email);

    if (!process.env.SMTP_PASSWORD) {
      console.warn("SMTP_PASSWORD not set. Email not sent.");
      return res.json({ success: true, message: "Logged (SMTP not configured)" });
    }

    const mailOptions = {
      from: `"SimulImmoNeuf" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || "contact@simulimmoneuf.fr",
      subject: `DEMANDE D'ÉTUDE : ${data.firstName} ${data.lastName}`,
      text: `Demande de rappel / étude de projet reçue.`,
      html: generateTableHtml(
        "Demande d'Étude de Projet", 
        data, 
        "Ce client souhaite être recontacté après avoir consulté ses résultats détaillés."
      ),
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending meeting request email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// API Route: Fetch Blog/News from MoneyVox RSS
app.get("/api/news", async (req, res) => {
  try {
    console.log("Fetching MoneyVox news...");
    const url = "https://www.moneyvox.fr/actu/rss.php";
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      timeout: 10000,
      responseType: 'text' // Force string response to avoid auto-parsing issues
    });

    if (!response.data) {
      throw new Error("Empty response from MoneyVox");
    }

    const feed = await rssParser.parseString(response.data);
    
    if (!feed || !feed.items || feed.items.length === 0) {
      throw new Error("No items found in feed");
    }

    const formattedNews = feed.items.slice(0, 10).map((item: any) => {
      let imageUrl = item.enclosure?.url;
      if (!imageUrl && item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }
      
      if (!imageUrl && item['media:content']) {
        imageUrl = item['media:content']?.$?.url;
      }

      const summary = (item.contentSnippet || item.content || "")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .slice(0, 180)
        .trim();

      return {
        title: item.title || "Actualité Immobilière",
        link: item.link || "https://www.moneyvox.fr/actu/",
        pubDate: item.pubDate || new Date().toISOString(),
        content: summary + (summary.length >= 180 ? "..." : ""),
        creator: item.creator || "MoneyVox",
        image: imageUrl || `https://picsum.photos/seed/${encodeURIComponent(item.title || 'news')}/800/600`
      };
    });

    res.json(formattedNews);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("MoneyVox RSS Error, trying JS fallback...", errorMsg);
    
    try {
      // Secondary dynamic fallback: Parse the JS script they provided
      const jsUrl = "https://www.moneyvox.fr/actu/javascript.php";
      const jsRes = await axios.get(jsUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      
      const news: any[] = [];
      const regex = /document\.write\('<li><a href="([^"]+)"[^>]*>([^<]+)<\/a><\/li>'\);/g;
      let match;
      
      while ((match = regex.exec(jsRes.data)) !== null && news.length < 10) {
        news.push({
          title: match[2].replace(/&#039;/g, "'").replace(/&quot;/g, '"'),
          link: match[1],
          pubDate: new Date().toISOString(),
          content: "Consultez l'article complet sur MoneyVox.fr pour plus de détails sur cette actualité immobilière et économique.",
          image: `https://picsum.photos/seed/${encodeURIComponent(match[2])}/800/600`
        });
      }
      
      if (news.length > 0) {
        console.log(`Parsed ${news.length} items from JS fallback.`);
        return res.json(news);
      }
    } catch (jsError) {
      console.error("MoneyVox JS Fallback also failed:", jsError instanceof Error ? jsError.message : String(jsError));
    }

    // Final static fallback data
    res.json([
      {
        title: "Taux immobilier : la baisse se confirme pour ce printemps",
        link: "https://www.moneyvox.fr/credit/actualites",
        pubDate: new Date().toISOString(),
        content: "Les banques françaises affichent des baisses de taux significatives, redonnant du pouvoir d'achat aux emprunteurs...",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Investissement Locatif : Pourquoi choisir le neuf en 2024 ?",
        link: "https://www.moneyvox.fr/placement/actualites",
        pubDate: new Date().toISOString(),
        content: "Entre normes énergétiques strictes et avantages fiscaux, le marché du neuf reste une valeur refuge pour les investisseurs...",
        image: "https://images.unsplash.com/photo-1460317442991-0ec239f636a3?auto=format&fit=crop&q=80&w=800"
      }
    ]);
  }
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite not found or failed to start, skipping middleware.");
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"), (err) => {
        if (err) {
          res.status(500).send("Error serving index.html. Ensure 'npm run build' was executed.");
        }
      });
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

startServer();

export default app;
