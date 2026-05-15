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

// Trust proxy headers (needed for express-rate-limit behind a proxy)
app.set("trust proxy", 1);

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

// In-memory log for debugging (not persistent)
const leadHistory: any[] = [];
const addLeadToHistory = (type: string, data: any, status: string, error?: string) => {
  leadHistory.unshift({
    timestamp: new Date().toISOString(),
    type,
    email: data.email || data.clientName || 'Sans nom',
    status,
    error,
    destination: process.env.CRM_URL || "Default CRM"
  });
  if (leadHistory.length > 10) leadHistory.pop();
};

const forwardToCRM = async (data: any) => {
  try {
    const rawCrmUrl = process.env.CRM_URL || "https://ais-pre-olgpljin4bh4c35p6o4fot-649204832248.europe-west2.run.app/api/leads";
    
    // Check if it's the development URL (which often requires authentication)
    if (rawCrmUrl.includes('-dev-')) {
      console.warn("CRM_URL contains '-dev-'. External webhooks MUST use '-pre-' (Shared App URL) to avoid authentication errors.");
    }

    // Detect recursive loops: if the CRM_URL is the same as the current app's public URL
    const appUrl = (process.env.APP_URL || '').replace('https://', '').replace('http://', '').split('/')[0];
    const targetUrl = rawCrmUrl.replace('https://', '').replace('http://', '').split('/')[0];

    if (appUrl && targetUrl && appUrl === targetUrl) {
      console.warn("RECURSION DETECTED: CRM_URL is pointing to this application itself. Forwarding cancelled.");
      addLeadToHistory("Forward", data, "Cancelled (Recursion)");
      return;
    }
    
    // Ensure we have a valid URL
    const crmUrl = rawCrmUrl.endsWith('/') ? `${rawCrmUrl}api/leads` : (rawCrmUrl.includes('/api/') ? rawCrmUrl : `${rawCrmUrl}/api/leads`);
    
    console.log("Forwarding lead to CRM:", crmUrl);
    
    // Structure the data for the CRM
    const payload = {
      firstName: data.firstName || data.clientName?.split(' ')[0] || "Prospect",
      lastName: data.lastName || data.clientName?.split(' ').slice(1).join(' ') || "Web",
      email: data.email || "non-precise@test.fr",
      phone: data.phone || "",
      source: "SimulImmoNeuf",
      type: data.simulationData ? "Study Request" : "Simulation Result",
      simulation: data.simulationData || data,
      metadata: {
        agent: "AI-Studio-Bridge",
        host: process.env.APP_URL || 'unknown',
        originalClient: data.clientName || 'unknown'
      },
      createdAt: new Date().toISOString()
    };

    const response = await axios.post(crmUrl, payload, { 
      timeout: 12000, 
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("Lead forwarded to CRM successfully. Status:", response.status);
    addLeadToHistory("Forward", data, `Success (${response.status})`);
  } catch (err) {
    let errorMsg = "Unknown Error";
    let status = "Error";
    if (axios.isAxiosError(err)) {
      status = `Axios Error (${err.response?.status || err.code})`;
      errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      console.error("Failed to forward lead to CRM. Status:", err.response?.status, "Data:", err.response?.data);
      if (err.code === 'ECONNABORTED') console.error("CRM Request timed out (12s)");
    } else {
      errorMsg = err instanceof Error ? err.message : String(err);
      console.error("Failed to forward lead to CRM error:", errorMsg);
    }
    addLeadToHistory("Forward", data, status, errorMsg);
  }
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
  validate: { trustProxy: false }, // Disables the check now that we set trust proxy
});
app.use(generalLimiter);

// Stricter Rate Limiting for API routes that send emails
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100, // Increased for testing and higher volume
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    env: process.env.NODE_ENV, 
    smtp_configured: !!process.env.SMTP_PASSWORD,
    crm_configured: !!process.env.CRM_URL,
    crm_url: process.env.CRM_URL || "Default (ais-pre-olgpljin...)",
    app_url: process.env.APP_URL || "Not set",
    recent_activity: leadHistory
  });
});

// API Route: Test CRM Connection
app.get("/api/test-crm", async (req, res) => {
  const testData = {
    firstName: "Test",
    lastName: "Diagnostic",
    email: "test-diagnostic@simulimmoneuf.fr",
    phone: "0102030405",
    simulationData: { diagnostic: true, date: new Date().toISOString() }
  };
  
  console.log("Starting CRM forwarding diagnostic...");
  const rawCrmUrl = process.env.CRM_URL || "https://ais-pre-olgpljin4bh4c35p6o4fot-649204832248.europe-west2.run.app/api/leads";
  
  try {
    await forwardToCRM(testData);
    res.json({ 
      message: "Diagnostic lancé. Vérifiez les logs.", 
      crm_url_configured: rawCrmUrl,
      is_dev_url: rawCrmUrl.includes('-dev-') 
    });
  } catch (err) {
    res.status(500).json({ error: "Diagnostic failure", details: String(err) });
  }
});

// API Route: Lead Webhook (for external calls from simulimmoneuf.fr)
app.post("/api/leads", apiLimiter, express.json(), async (req, res) => {
  try {
    const data = req.body;
    const identifier = data.email || data.clientName || 'Sans nom';
    console.log("Lead received from external source:", identifier);
    addLeadToHistory("Incoming", data, "Received");

    // 1. Send to CRM
    await forwardToCRM(data);

    // 2. Send Email if SMTP is configured
    if (process.env.SMTP_PASSWORD) {
      const mailOptions = {
        from: `"SimulImmoNeuf" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || "contact@simulimmoneuf.fr",
        subject: `NOUVEAU PROSPECT (Site Web) : ${data.firstName || data.clientName || 'Sans nom'}`,
        text: `Nouveau prospect reçu via webhook.`,
        html: generateTableHtml(
          "Prospect Site Web", 
          data, 
          "Ce lead a été transmis automatiquement depuis votre site externe."
        ),
      };
      await transporter.sendMail(mailOptions);
    }

    res.json({ success: true, message: "Lead processed and forwarded" });
  } catch (error) {
    console.error("Error processing external lead:", error);
    res.status(500).json({ error: "Failed to process lead" });
  }
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
    
    // Always forward to CRM first or in parallel
    await forwardToCRM(data);

    if (!process.env.SMTP_PASSWORD) {
      console.warn("SMTP_PASSWORD not set. Email not sent.");
      return res.json({ success: true, message: "Lead forwarded to CRM (SMTP not configured)" });
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
    
    res.json({ success: true, message: "Email sent and lead forwarded to CRM" });
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

    // Always forward to CRM first or in parallel
    await forwardToCRM(data);

    if (!process.env.SMTP_PASSWORD) {
      console.warn("SMTP_PASSWORD not set. Email not sent.");
      return res.json({ success: true, message: "Lead forwarded to CRM (SMTP not configured)" });
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

    res.json({ success: true, message: "Email sent and lead forwarded to CRM" });
  } catch (error) {
    console.error("Error sending meeting request email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// API Route: Fetch Blog/News from MoneyVox RSS
app.get("/api/news", async (req, res) => {
  try {
    console.log("Fetching MoneyVox news...");
    
    // First attempt: Standard RSS XML
    const url = "https://www.moneyvox.fr/actu/rss.php";
    let formattedNews: any[] = [];
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml'
        },
        timeout: 12000,
        responseType: 'arraybuffer' // Fetch as buffer to handle encoding manually if needed
      });

      // Try decoding as UTF-8 first, then try ISO-8859-1 if needed
      let xmlContent = Buffer.from(response.data).toString('utf-8');
      if (xmlContent.includes('encoding="ISO-8859-1"') || xmlContent.includes('encoding="iso-8859-1"')) {
        // Simple manual replacement for common French characters if we can't use iconv-lite
        // Or just let rss-parser try its best
      }

      const feed = await rssParser.parseString(xmlContent);
      
      if (feed && feed.items && feed.items.length > 0) {
        formattedNews = feed.items.slice(0, 10).map((item: any) => {
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
      }
    } catch (rssError) {
      console.warn("RSS XML Fetch failed, trying JS script...", rssError instanceof Error ? rssError.message : String(rssError));
    }

    // Second attempt: JS Fallback (user specifically requested this)
    if (formattedNews.length === 0) {
      try {
        const jsUrl = "https://www.moneyvox.fr/actu/javascript.php";
        const jsRes = await axios.get(jsUrl, {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' 
          },
          timeout: 8000,
          responseType: 'arraybuffer'
        });
        
        // Decode JS script which is likely ISO-8859-1
        const jsData = Buffer.from(jsRes.data).toString('latin1'); 
        
        const regex = /document\.write\('<li><a href="([^"]+)"[^>]*>([^<]+)<\/a><\/li>'\);/g;
        let match;
        
        while ((match = regex.exec(jsData)) !== null && formattedNews.length < 10) {
          const rawTitle = match[2]
            .replace(/&#039;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");

          formattedNews.push({
            title: rawTitle,
            link: match[1],
            pubDate: new Date().toISOString(),
            content: "Retrouvez toute l'actualité immobilière et les conseils d'épargne en détail sur le site MoneyVox.",
            image: `https://picsum.photos/seed/${encodeURIComponent(rawTitle)}/800/600`
          });
        }
        
        if (formattedNews.length > 0) {
          console.log(`Success: Parsed ${formattedNews.length} items from JS fallback.`);
        }
      } catch (jsError) {
        console.error("MoneyVox JS Fallback also failed:", jsError instanceof Error ? jsError.message : String(jsError));
      }
    }

    if (formattedNews.length === 0) {
      throw new Error("All fetch methods failed for MoneyVox");
    }

    res.json(formattedNews);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Critical MoneyVox Error:", errorMsg);
    
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
