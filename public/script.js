/**
 * ============================================================
 *  Daily Sales & Revenue Report Dashboard — Frontend Logic
 *  Renders real daily sales KPIs, Chart.js visualisations,
 *  agent leaderboards, and email HTML with QuickChart images.
 * ============================================================
 */

/* ---------- Configuration ---------- */
const CONFIG = {
  API_BASE: 'http://localhost:3000',
  DATA_URL: '/data/data.json',
};

/* ---------- DOM References ---------- */
const $kpiGrid         = document.getElementById('kpi-grid');
const $headerDate      = document.getElementById('header-date');
const $btnRefresh      = document.getElementById('btn-refresh');
const $btnSend         = document.getElementById('btn-send-report');
const $modalOverlay    = document.getElementById('modal-overlay');
const $modalPreview    = document.getElementById('modal-preview');
const $modalClose      = document.getElementById('modal-close');
const $modalCancel     = document.getElementById('modal-cancel');
const $modalConfirm    = document.getElementById('modal-confirm');
const $toastContainer  = document.getElementById('toast-container');
const $agentLeaderboard = document.getElementById('agent-leaderboard');

/* ---------- State ---------- */
let allData       = [];
let todayData     = {};
let yesterdayData = {};

/* ============================================================
   DATA LOADING
   ============================================================ */
async function fetchData() {
  try {
    const resp = await fetch(CONFIG.DATA_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    allData = await resp.json();

    allData.sort((a, b) => a.date.localeCompare(b.date));

    todayData     = allData[allData.length - 1];
    yesterdayData = allData.length > 1 ? allData[allData.length - 2] : todayData;

    render();
  } catch (err) {
    console.error('Failed to load data:', err);
    showToast('Failed to load report data. Check console.', 'error');
  }
}

/* ============================================================
   RENDERING
   ============================================================ */
function render() {
  renderHeader();
  renderKPIs();
  renderCharts();
  renderLeaderboard();
}

/* ---------- Header Date ---------- */
function renderHeader() {
  const d = new Date(todayData.date + 'T00:00:00');
  const formatted = d.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  $headerDate.textContent = formatted;
}

/* ---------- Currency Formatter ---------- */
function fmtINR(num) {
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

/* ---------- KPI Cards ---------- */
function renderKPIs() {
  const todayRev     = todayData.totalRevenue || 0;
  const yesterdayRev = yesterdayData.totalRevenue || 0;
  const diffRev      = todayRev - yesterdayRev;

  const todayCount     = todayData.salesCount || 0;
  const yesterdayCount = yesterdayData.salesCount || 0;
  const diffCount      = todayCount - yesterdayCount;

  const todayAOV     = todayCount > 0 ? Math.round(todayRev / todayCount) : 0;
  const yesterdayAOV = yesterdayCount > 0 ? Math.round(yesterdayRev / yesterdayCount) : 0;
  const diffAOV      = todayAOV - yesterdayAOV;

  const organicCount = todayData.sources?.Organic?.count || 0;
  const renewalCount = todayData.sources?.Renewals?.count || 0;
  const eventsCount  = todayData.sources?.Events?.count || 0;

  // Find top agent
  let topAgentName = '—';
  let topAgentRev  = 0;
  if (todayData.agents) {
    const sortedAgents = Object.entries(todayData.agents).sort((a, b) => b[1].revenue - a[1].revenue);
    if (sortedAgents.length > 0) {
      topAgentName = sortedAgents[0][0];
      topAgentRev  = sortedAgents[0][1].revenue;
    }
  }

  const kpis = [
    {
      label: 'Total Revenue Today',
      value: fmtINR(todayRev),
      change: diffRev,
      isCurrency: true,
      icon: '💰',
      accent: 'emerald',
    },
    {
      label: 'Deals Closed Today',
      value: todayCount.toString(),
      change: diffCount,
      suffix: ' deals',
      icon: '🤝',
      accent: 'indigo',
    },
    {
      label: 'Average Deal Size (AOV)',
      value: fmtINR(todayAOV),
      change: diffAOV,
      isCurrency: true,
      icon: '📊',
      accent: 'cyan',
    },
    {
      label: 'Organic Deals',
      value: organicCount.toString(),
      change: organicCount - (yesterdayData.sources?.Organic?.count || 0),
      suffix: ' deals',
      icon: '🌱',
      accent: 'amber',
    },
    {
      label: 'Renewals / Upgrades',
      value: (renewalCount + (todayData.sources?.Upgrade?.count || 0)).toString(),
      change: (renewalCount + (todayData.sources?.Upgrade?.count || 0)) - ((yesterdayData.sources?.Renewals?.count || 0) + (yesterdayData.sources?.Upgrade?.count || 0)),
      suffix: ' deals',
      icon: '🔄',
      accent: 'violet',
    },
    {
      label: 'Top Agent Today',
      value: topAgentName.split(' ')[0], // First name for big display
      subValue: fmtINR(topAgentRev),
      icon: '👑',
      accent: 'rose',
      customTrend: `${topAgentName} (${fmtINR(topAgentRev)})`,
    },
  ];

  $kpiGrid.innerHTML = kpis.map((k, i) => {
    let trendHTML = '';
    if (k.customTrend) {
      trendHTML = `<span class="kpi-card__trend kpi-card__trend--up">${k.customTrend}</span>`;
    } else {
      const dir = k.change > 0 ? 'up' : k.change < 0 ? 'down' : 'neutral';
      const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '—';
      const sign = k.change > 0 ? '+' : '';
      const formattedDiff = k.isCurrency ? `${sign}${fmtINR(k.change)}` : `${sign}${k.change}${k.suffix || ''}`;
      trendHTML = `<span class="kpi-card__trend kpi-card__trend--${dir}">${arrow} ${formattedDiff} vs yesterday</span>`;
    }

    return `
      <div class="kpi-card fade-in" data-accent="${k.accent}" style="animation-delay:${i * 0.05}s">
        <div class="kpi-card__icon">${k.icon}</div>
        <p class="kpi-card__label">${k.label}</p>
        <p class="kpi-card__value">${k.value}</p>
        ${trendHTML}
      </div>`;
  }).join('');
}

/* ---------- Charts ---------- */
let chartRevenue, chartPlan, chartChannel;

function renderCharts() {
  [chartRevenue, chartPlan, chartChannel].forEach(c => c?.destroy());

  renderRevenueChart();
  renderPlanChart();
  renderChannelChart();
}

/* 1. Daily Revenue Trend */
function renderRevenueChart() {
  const labels = allData.map(d => formatShortDate(d.date));
  const data   = allData.map(d => d.totalRevenue);

  const ctx = document.getElementById('chart-revenue').getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 240);
  grad.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
  grad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

  chartRevenue = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Daily Revenue (₹)',
        data,
        borderColor: '#818cf8',
        backgroundColor: grad,
        borderWidth: 2.5,
        pointRadius: 3.5,
        pointBackgroundColor: '#818cf8',
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle(),
          callbacks: {
            label: (ctx) => ` Revenue: ${fmtINR(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: { ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(255,255,255,.04)' } },
        y: {
          beginAtZero: true,
          grace: '8%',
          ticks: {
            color: '#64748b',
            font: { family: 'Inter', size: 11 },
            callback: (v) => '₹' + (v / 1000) + 'k',
          },
          grid: { color: 'rgba(255,255,255,.04)' },
        },
      },
    },
  });
}

/* 2. Plan Distribution Donut */
function renderPlanChart() {
  // Aggregate plans month to date or today
  const plans = todayData.plans || {};
  const labels = Object.keys(plans);
  const data = Object.values(plans).map(p => p.count);

  const colors = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#f43f5e'];

  chartPlan = new Chart(document.getElementById('chart-plan'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 0,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 14, usePointStyle: true } },
        tooltip: {
          ...tooltipStyle(),
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed} deals (${fmtINR(plans[ctx.label]?.revenue || 0)})`,
          },
        },
      },
    },
  });
}

/* 3. Acquisition Channels Bar */
function renderChannelChart() {
  const sources = todayData.sources || {};
  const labels = Object.keys(sources);
  const data = labels.map(s => sources[s].revenue);
  const counts = labels.map(s => sources[s].count);

  chartChannel = new Chart(document.getElementById('chart-channel'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Revenue by Source (₹)',
        data,
        backgroundColor: ['#34d399', '#818cf8', '#22d3ee', '#fbbf24'],
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 56,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle(),
          callbacks: {
            label: (ctx) => ` Revenue: ${fmtINR(ctx.parsed.y)} (${counts[ctx.dataIndex]} deals)`,
          },
        },
      },
      scales: {
        x: { ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#64748b',
            font: { family: 'Inter', size: 11 },
            callback: (v) => '₹' + (v / 1000) + 'k',
          },
          grid: { color: 'rgba(255,255,255,.04)' },
        },
      },
    },
  });
}

/* ---------- Agent Leaderboard ---------- */
function renderLeaderboard() {
  const agents = todayData.agents || {};
  const sorted = Object.entries(agents).sort((a, b) => b[1].revenue - a[1].revenue);

  if (sorted.length === 0) {
    $agentLeaderboard.innerHTML = '<p style="color:#64748b;">No agent data recorded for today.</p>';
    return;
  }

  $agentLeaderboard.innerHTML = sorted.map(([agentName, data], idx) => {
    const rank = idx + 1;
    const rankClass = rank <= 3 ? `agent-rank--${rank}` : '';
    return `
      <div class="agent-item">
        <div class="agent-info">
          <div class="agent-rank ${rankClass}">#${rank}</div>
          <div>
            <div class="agent-name">${agentName}</div>
            <div class="agent-deals">${data.count} deal${data.count > 1 ? 's' : ''} closed</div>
          </div>
        </div>
        <div class="agent-revenue">${fmtINR(data.revenue)}</div>
      </div>
    `;
  }).join('');
}

/* ---------- Helper Styles & Dates ---------- */
function tooltipStyle() {
  return {
    backgroundColor: '#1e293b',
    titleColor: '#f1f5f9',
    bodyColor: '#cbd5e1',
    borderColor: 'rgba(255,255,255,.1)',
    borderWidth: 1,
    cornerRadius: 8,
    padding: 12,
    titleFont: { family: 'Inter', weight: '600' },
    bodyFont:  { family: 'Inter' },
  };
}

function formatShortDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

/* ============================================================
   EMAIL REPORT GENERATION (WITH QUICKCHART VISUALS)
   ============================================================ */
function quickChartURL(config, width = 560, height = 280) {
  const json = JSON.stringify(config);
  return `https://quickchart.io/chart?c=${encodeURIComponent(json)}&w=${width}&h=${height}&bkg=white&f=png`;
}

function buildEmailHTML() {
  const d = new Date(todayData.date + 'T00:00:00');
  const dateStr = d.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const todayRev     = todayData.totalRevenue || 0;
  const yesterdayRev = yesterdayData.totalRevenue || 0;
  const diffRev      = todayRev - yesterdayRev;
  const diffRevStr   = (diffRev >= 0 ? '+' : '') + fmtINR(diffRev);
  const diffColor    = diffRev >= 0 ? '#059669' : '#e11d48';

  const todayCount     = todayData.salesCount || 0;
  const yesterdayCount = yesterdayData.salesCount || 0;

  const todayAOV = todayCount > 0 ? Math.round(todayRev / todayCount) : 0;

  // Chart Images via QuickChart
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

  const sortedAgents = Object.entries(todayData.agents || {}).sort((a, b) => b[1].revenue - a[1].revenue);

  return `
  <div style="font-family:'Inter',Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:28px 32px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;">📈 Daily Sales &amp; Revenue Report</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.9);font-size:14px;">${dateStr}</p>
    </div>

    <!-- KPI Table -->
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
          <td style="padding:10px 8px;text-align:right;font-weight:700;color:#1e293b;">${todayData.sources?.Organic?.count || 0}</td>
          <td style="padding:10px 8px;text-align:right;color:#64748b;">${fmtINR(todayData.sources?.Organic?.revenue || 0)}</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 8px;color:#64748b;">Events &amp; Renewals</td>
          <td style="padding:10px 8px;text-align:right;font-weight:700;color:#1e293b;">${(todayData.sources?.Events?.count || 0) + (todayData.sources?.Renewals?.count || 0)}</td>
          <td style="padding:10px 8px;text-align:right;color:#64748b;">${fmtINR((todayData.sources?.Events?.revenue || 0) + (todayData.sources?.Renewals?.revenue || 0))}</td>
        </tr>
      </table>
    </div>

    <!-- Revenue Trend Visual Chart -->
    <div style="padding:0 32px 24px;">
      <h2 style="margin:0 0 12px;font-size:16px;color:#1e293b;font-weight:700;">📊 Revenue Growth (Month to Date)</h2>
      <img src="${trendChartImg}" alt="Daily Revenue Trend" style="width:100%;max-width:576px;border-radius:8px;border:1px solid #e2e8f0;" />
    </div>

    <!-- Agent Leaderboard -->
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

    <!-- Footer -->
    <div style="background:#f8fafc;padding:18px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">
      Automated Daily Sales Intelligence Report • Generated at 10:00 AM IST
    </div>
  </div>`;
}

/* ============================================================
   MODAL & SEND FLOW
   ============================================================ */
function openModal() {
  $modalPreview.innerHTML = buildEmailHTML();
  $modalOverlay.classList.add('active');
}

function closeModal() {
  $modalOverlay.classList.remove('active');
}

async function sendReport() {
  closeModal();

  const html = buildEmailHTML();
  const d = new Date(todayData.date + 'T00:00:00');
  const dateStr = d.toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  $btnSend.disabled = true;
  const originalHTML = $btnSend.innerHTML;
  $btnSend.innerHTML = '<span class="spinner"></span> Sending…';

  try {
    const resp = await fetch(`${CONFIG.API_BASE}/api/send-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: `📈 Daily Sales Report — ${dateStr} [${fmtINR(todayData.totalRevenue || 0)}]`,
        html,
        reportData: todayData,
      }),
    });

    const result = await resp.json();

    if (resp.ok) {
      showToast(`Report sent to ${result.recipientCount} recipient(s)!`, 'success');
    } else {
      throw new Error(result.error || 'Server error');
    }
  } catch (err) {
    console.error('Send failed:', err);
    showToast(`Send failed: ${err.message}`, 'error');
  } finally {
    $btnSend.disabled = false;
    $btnSend.innerHTML = originalHTML;
  }
}

/* ============================================================
   TOASTS & EVENTS
   ============================================================ */
function showToast(message, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
  $toastContainer.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 4500);
}

$btnRefresh.addEventListener('click', fetchData);
$btnSend.addEventListener('click', openModal);
$modalClose.addEventListener('click', closeModal);
$modalCancel.addEventListener('click', closeModal);
$modalConfirm.addEventListener('click', sendReport);
$modalOverlay.addEventListener('click', (e) => { if (e.target === $modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* Init */
fetchData();
