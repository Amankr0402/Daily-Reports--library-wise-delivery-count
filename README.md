# 📊 Daily Subscriber Report Dashboard

A lightweight, self-contained dashboard for tracking daily subscriber KPIs, visualising trends, and automatically emailing reports to your team.

![Tech Stack](https://img.shields.io/badge/HTML%20%2B%20CSS%20%2B%20JS-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Chart.js](https://img.shields.io/badge/Chart.js-Visualisations-orange)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **KPI Cards** | Active subscribers, new, cancelled, churn rate, revenue, trial conversions — with trend arrows |
| **30-Day Line Chart** | Active subscriber growth over the past month |
| **7-Day Bar Chart** | New vs cancelled subscribers side by side |
| **Donut Chart** | Subscriber mix by plan tier (Starter / Professional / Enterprise) |
| **Email Reports** | One-click "Send Report to Employees" with a styled HTML email preview |
| **Daily Automation** | Built-in `node-cron` job sends the report every morning at 09:00 |
| **Responsive** | Works on desktop, tablet, and mobile |

---

## 📁 File Structure

```
Daily Reports/
├── public/
│   ├── index.html          # Dashboard UI
│   ├── style.css           # Design system & styles
│   └── script.js           # Frontend logic + Chart.js
├── data/
│   └── data.json           # 30 days of sample subscriber data
├── config/
│   └── employees.json      # Email recipient list
├── server/
│   └── server.js           # Express + Nodemailer + node-cron
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
└── README.md               # You are here
```

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
cd "Daily Reports"
npm install
```

### 2. Configure environment variables

```bash
# Copy the template
cp .env.example .env

# Edit .env with your SMTP credentials
```

### 3. Start the server

```bash
npm start
```

Open **http://localhost:3000** in your browser.

> **Note:** The dashboard will work without the backend too — just open `public/index.html` directly in your browser. The email feature requires the Node.js server to be running.

---

## 📧 Email Setup (SMTP)

The app uses **Nodemailer** to send emails. You need an SMTP provider.

### Option A: Gmail App Password (easiest)

1. Go to [Google Account → Security → 2-Step Verification](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Go to **App passwords** → Generate a new app password for "Mail"
4. Copy the 16-character password into your `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM="Daily Reports <your-email@gmail.com>"
```

### Option B: SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

### Option C: Any SMTP provider

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` to match your provider's settings.

---

## 👥 Managing Recipients

Edit `config/employees.json` to add or remove email recipients:

```json
{
  "recipients": [
    { "name": "Alice Johnson", "email": "alice@company.com" },
    { "name": "Bob Smith",     "email": "bob@company.com" }
  ]
}
```

---

## ⏰ Daily Cron Job

The server includes a **node-cron** scheduled task that automatically sends the daily report email.

- **Default schedule:** Every day at **09:00 AM** (Asia/Kolkata timezone)
- **Customise** by setting `CRON_SCHEDULE` in `.env`:

```env
# Examples:
CRON_SCHEDULE=0 9 * * *       # 09:00 daily
CRON_SCHEDULE=0 8 * * 1-5     # 08:00 weekdays only
CRON_SCHEDULE=*/30 * * * *    # Every 30 minutes (testing)
```

To change the timezone, edit the `timezone` option in `server/server.js`.

---

## 📊 Updating Report Data

Replace `data/data.json` with fresh data from your database or API. The expected format:

```json
[
  {
    "date": "2026-08-24",
    "activeSubscribers": 1355,
    "newSubscribers": 29,
    "cancelled": 16,
    "revenue": 5790,
    "trialConversions": 16,
    "renewals": 42,
    "plans": {
      "starter": 405,
      "professional": 596,
      "enterprise": 354
    }
  }
]
```

To connect a real data source, modify the `fetchData()` function in `public/script.js` (frontend) and add a new route in `server/server.js` (backend).

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3 (vanilla), JavaScript (ES6+) |
| Charts | [Chart.js 4.x](https://www.chartjs.org/) via CDN |
| Backend | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) |
| Email | [Nodemailer](https://nodemailer.com/) |
| Scheduling | [node-cron](https://github.com/node-cron/node-cron) |
| Config | [dotenv](https://github.com/motdotla/dotenv) |

---

## 📝 License

MIT — use freely for personal and commercial projects.
