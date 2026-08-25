/**
 * ============================================================
 *  Daily Sales & Revenue Report — Express Backend
 *
 *  Features:
 *    • Serves /public static files & /data/data.json
 *    • POST /api/send-report — sends the formatted HTML email with charts
 *    • node-cron job: auto-sends the daily sales report at 10:00 AM IST
 * ============================================================
 */

require('dotenv').config();
const express    = require('express');
const path       = require('path');
const fs         = require('fs');
const nodemailer = require('nodemailer');
const cron       = require('node-cron');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ---------- Middleware ---------- */
app.use(express.json({ limit: '2mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ---------- Static files ---------- */
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/data', express.static(path.join(__dirname, '..', 'data')));

/* ---------- Nodemailer Transporter ---------- */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/* ---------- Helpers ---------- */
function getRecipients() {
  const filePath = path.join(__dirname, '..', 'config', 'employees.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { recipients } = JSON.parse(raw);
  return recipients;
}

function getAllReportData() {
  const filePath = path.join(__dirname, '..', 'data', 'data.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  data.sort((a, b) => a.date.localeCompare(b.date));
  return data;
}

function fmtINR(num) {
  return '₹' + Math.round(num || 0).toLocaleString('en-IN');
}

function formatShortDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function quickChartURL(config, width = 560, height = 280) {
  const json = JSON.stringify(config);
  return `https://quickchart.io/chart?c=${encodeURIComponent(json)}&w=${width}&h=${height}&bkg=white&f=png`;
}

/**
 * Server-side HTML Builder for Cron 10:00 AM automated email
 */
function buildEmailHTMLServer(allData) {
  const today = allData[allData.length - 1];
  const yesterday = allData.length > 1 ? allData[allData.length - 2] : today;

  const d = new Date(today.date + 'T00:00:00');
  const dateStr = d.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const todayRev     = today.totalRevenue || 0;
  const yesterdayRev = yesterday.totalRevenue || 0;
  const diffRev      = todayRev - yesterdayRev;
  const diffRevStr   = (diffRev >= 0 ? '+' : '') + fmtINR(diffRev);
  const diffColor    = diffRev >= 0 ? '#059669' : '#e11d48';

  const todayCount     = today.salesCount || 0;
  const yesterdayCount = yesterday.salesCount || 0;
  const todayAOV       = todayCount > 0 ? Math.round(todayRev / todayCount) : 0;

  const trendChartImg = quickChartURL({
    type: 'line',
    data: {
      labels: allData.map(d => formatShortDate(d.date)),
      datasets: [{
        label: 'Daily Revenue (INR)',
        data: allData.map(d => d.totalRevenue),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.15)',
        fill: true, tension: 0.35, pointRadius: 2,
      }],
    },
    options: {
      plugins: { legend: { labels: { font: { size: 12 } } } },
      scales: { x: { ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } },
    },
  });

  const sortedAgents = Object.entries(today.agents || {}).sort((a, b) => b[1].revenue - a[1].revenue);

  return `
  <div style="font-family:'Inter',Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:28px 32px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;">📈 Daily Sales &amp; Revenue Report</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.9);font-size:14px;">${dateStr}</p>
    </div>

    <div style="padding:26px 32px;">
      <h2 style="margin:0 0 16px;font-size:16px;color:#1e293b;font-weight:700;">Executive KPI Summary</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 8px;color:#64748b;">Total Revenue</td>
          <td style="padding:10px 8px;text-align:right;font-weight:800;color:#059669;font-size:16px;">${fmtINR(todayRev)}</td>
          <td style="padding:10px 8px;text-align:right;color:${diffColor};font-weight:600;font-size:13px;">${diffRevStr} vs yday</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 8px;color:#64748b;">Deals Closed</td>
          <td style="padding:10px 8px;text-align:right;font-weight:700;color:#1e293b;">${todayCount}</td>
          <td style="padding:10px 8px;text-align:right;color:#64748b;">${todayCount - yesterdayCount >= 0 ? '+' : ''}${todayCount - yesterdayCount} deals</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 8px;color:#64748b;">Average Deal Size (AOV)</td>
          <td style="padding:10px 8px;text-align:right;font-weight:700;color:#1e293b;">${fmtINR(todayAOV)}</td>
          <td style="padding:10px 8px;"></td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 8px;color:#64748b;">Organic Deals</td>
          <td style="padding:10px 8px;text-align:right;font-weight:700;color:#1e293b;">${today.sources?.Organic?.count || 0}</td>
          <td style="padding:10px 8px;text-align:right;color:#64748b;">${fmtINR(today.sources?.Organic?.revenue || 0)}</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 8px;color:#64748b;">Events &amp; Renewals</td>
          <td style="padding:10px 8px;text-align:right;font-weight:700;color:#1e293b;">${(today.sources?.Events?.count || 0) + (today.sources?.Renewals?.count || 0)}</td>
          <td style="padding:10px 8px;text-align:right;color:#64748b;">${fmtINR((today.sources?.Events?.revenue || 0) + (today.sources?.Renewals?.revenue || 0))}</td>
        </tr>
      </table>
    </div>

    <div style="padding:0 32px 24px;">
      <h2 style="margin:0 0 12px;font-size:16px;color:#1e293b;font-weight:700;">📊 Revenue Growth (Month to Date)</h2>
      <img src="${trendChartImg}" alt="Daily Revenue Trend" style="width:100%;max-width:576px;border-radius:8px;border:1px solid #e2e8f0;" />
    </div>

    <div style="padding:0 32px 24px;">
      <h2 style="margin:0 0 12px;font-size:16px;color:#1e293b;font-weight:700;">🏆 Top Agent Performance Today</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0;text-align:left;color:#64748b;">
            <th style="padding:8px;">Agent Name</th>
            <th style="padding:8px;text-align:center;">Deals</th>
            <th style="padding:8px;text-align:right;">Revenue Closed</th>
          </tr>
        </thead>
        <tbody>
          ${sortedAgents.map(([agent, val], idx) => `
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:9px 8px;font-weight:600;color:#334155;">#${idx + 1} ${agent}</td>
              <td style="padding:9px 8px;text-align:center;color:#64748b;">${val.count}</td>
              <td style="padding:9px 8px;text-align:right;font-weight:700;color:#059669;">${fmtINR(val.revenue)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div style="background:#f8fafc;padding:18px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">
      Automated Daily Sales Intelligence Report • Generated at 10:00 AM IST
    </div>
  </div>`;
}

/* ---------- API Routes ---------- */
app.post('/api/send-report', async (req, res) => {
  try {
    const { subject, html } = req.body;

    if (!subject || !html) {
      return res.status(400).json({ error: 'Missing subject or html in request body.' });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({
        error: 'SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in .env file.',
      });
    }

    const recipients = getRecipients();
    const toList = recipients.map(r => `"${r.name}" <${r.email}>`).join(', ');

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: toList,
      subject,
      html,
    });

    console.log(`✅ Report sent — Message ID: ${info.messageId}`);
    res.json({ success: true, messageId: info.messageId, recipientCount: recipients.length });
  } catch (err) {
    console.error('❌ Email send error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ---------- Cron Job: Auto-send daily at 10:00 AM IST ---------- */
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 10 * * *';

cron.schedule(CRON_SCHEDULE, async () => {
  console.log(`⏰ Cron triggered at ${new Date().toISOString()} — sending daily sales report...`);

  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ SMTP credentials not set in .env. Skipping automated cron email.');
      return;
    }

    const allData = getAllReportData();
    const today = allData[allData.length - 1];
    const d = new Date(today.date + 'T00:00:00');
    const dateStr = d.toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric',
    });

    const html = buildEmailHTMLServer(allData);
    const recipients = getRecipients();
    const toList = recipients.map(r => `"${r.name}" <${r.email}>`).join(', ');

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: toList,
      subject: `📈 Daily Sales Report — ${dateStr} [${fmtINR(today.totalRevenue)}]`,
      html,
    });

    console.log(`✅ Automated 10:00 AM Sales Report sent — Message ID: ${info.messageId}`);
  } catch (err) {
    console.error('❌ Cron email error:', err);
  }
}, { timezone: 'Asia/Kolkata' });

console.log(`📅 Cron scheduled: "${CRON_SCHEDULE}" (10:00 AM IST daily)`);

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
  console.log(`\n🚀 Daily Sales Report Server running at http://localhost:${PORT}\n`);
});
