/**
 * ============================================================
 *  Google Sheets Live Data Sync
 *  Fetches real-time sales records from Google Sheets, parses
 *  dates, agents, plans, and sources, and updates data/data.json
 * ============================================================
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const SPREADSHEET_ID = '1AMJ0DLL2JV9gl58h5yRPgTZyBzwSOL1cyrhpyA5Qz9c';
const SHEET_NAME     = 'Sales/Rev (Auto)';
const OUTPUT_FILE    = path.join(__dirname, '..', 'data', 'data.json');

function fetchSheetCSV(spreadsheetId, sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          let data = '';
          redirectRes.on('data', chunk => data += chunk);
          redirectRes.on('end', () => resolve(data));
        }).on('error', reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseDate(rawDate) {
  if (!rawDate) return null;
  const clean = rawDate.replace(/"/g, '').trim();
  if (!clean) return null;

  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      let p1 = parseInt(parts[0], 10);
      let p2 = parseInt(parts[1], 10);
      let y  = parts[2].trim();
      if (y.length === 2) y = '20' + y;

      let m, d;
      // Handle August mixed formatting in source sheet (8/D/YYYY vs DD/08/YYYY)
      if (p1 === 8) {
        m = 8;
        d = p2;
      } else if (p2 === 8) {
        m = 8;
        d = p1;
      } else if (p1 > 12) {
        // DD/MM/YYYY
        d = p1;
        m = p2;
      } else {
        // MM/DD/YYYY
        m = p1;
        d = p2;
      }
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
  }
  return clean;
}

async function syncSalesData() {
  console.log(`📡 Fetching sales data from Google Sheet: "${SHEET_NAME}"...`);
  const csv = await fetchSheetCSV(SPREADSHEET_ID, SHEET_NAME);
  const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length <= 1) {
    throw new Error('No records returned from sheet.');
  }

  console.log(`📊 Processing ${lines.length} rows...`);
  const recordsByDate = {};

  // Skip header (row 0) and summary total row (row 1)
  for (let i = 2; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]).map(c => c.replace(/^"|"$/g, '').trim());
    const rawDate = cols[1];
    const agent   = cols[3];
    const rawRev  = cols[4];
    const plan    = cols[6];
    const count   = parseInt(cols[7], 10) || 1;
    const source  = cols[8] || 'Organic';

    if (!agent || !rawRev || !rawDate) continue;
    const rev = parseFloat(rawRev.replace(/,/g, '')) || 0;
    if (rev <= 0) continue;

    const isoDate = parseDate(rawDate);
    if (!isoDate || isoDate.length !== 10) continue;

    if (!recordsByDate[isoDate]) {
      recordsByDate[isoDate] = {
        date: isoDate,
        totalRevenue: 0,
        salesCount: 0,
        transactions: 0,
        agents: {},
        plans: {},
        sources: {}
      };
    }

    const day = recordsByDate[isoDate];
    day.totalRevenue += rev;
    day.salesCount += count;
    day.transactions += 1;

    // Agents
    if (!day.agents[agent]) day.agents[agent] = { revenue: 0, count: 0 };
    day.agents[agent].revenue += rev;
    day.agents[agent].count += count;

    // Plans
    const cleanPlan = plan || 'Annual Max';
    if (!day.plans[cleanPlan]) day.plans[cleanPlan] = { revenue: 0, count: 0 };
    day.plans[cleanPlan].revenue += rev;
    day.plans[cleanPlan].count += count;

    // Sources
    const cleanSource = source || 'Organic';
    if (!day.sources[cleanSource]) day.sources[cleanSource] = { revenue: 0, count: 0 };
    day.sources[cleanSource].revenue += rev;
    day.sources[cleanSource].count += count;
  }

  const sortedDays = Object.values(recordsByDate).sort((a, b) => a.date.localeCompare(b.date));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedDays, null, 2), 'utf-8');
  console.log(`✅ Successfully synced ${sortedDays.length} days of data to ${OUTPUT_FILE}`);

  return sortedDays;
}

if (require.main === module) {
  syncSalesData().catch(err => {
    console.error('❌ Error syncing data:', err);
    process.exit(1);
  });
}

module.exports = { syncSalesData, fetchSheetCSV };
