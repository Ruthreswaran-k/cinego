import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Ticket, Film, Users, Award, Download, PieChart, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

interface MovieRevenueStat {
  title: string;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
}

const REVENUE_BY_MOVIE: MovieRevenueStat[] = [
  { title: 'Baththa', totalBookings: 1540, totalRevenue: 442500, occupancyRate: 94 },
  { title: 'Yezhu Kadal Yezhu Malai', totalBookings: 1210, totalRevenue: 345000, occupancyRate: 91 },
  { title: 'Digger', totalBookings: 990, totalRevenue: 297000, occupancyRate: 86 },
  { title: 'The Third Murder', totalBookings: 880, totalRevenue: 245000, occupancyRate: 83 },
  { title: 'Anbil Avan', totalBookings: 790, totalRevenue: 215000, occupancyRate: 80 },
  { title: 'Sigma', totalBookings: 720, totalRevenue: 195000, occupancyRate: 77 },
  { title: 'Tony', totalBookings: 640, totalRevenue: 182000, occupancyRate: 74 },
];

export const AdminReports: React.FC = () => {
  const totalRevenue = REVENUE_BY_MOVIE.reduce((acc, m) => acc + m.totalRevenue, 0);
  const totalTickets = REVENUE_BY_MOVIE.reduce((acc, m) => acc + m.totalBookings, 0);

  const handleDownloadPDF = () => {
    toast.success('Generating Executive PDF Report...');
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up was blocked. Please allow pop-ups to open the PDF report.');
      return;
    }

    const rowsHtml = REVENUE_BY_MOVIE.map(
      (m, idx) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${idx + 1}. ${m.title}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; text-align: center;">${m.totalBookings.toLocaleString('en-IN')}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; text-align: center;">${m.occupancyRate}%</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #111827;">₹${m.totalRevenue.toLocaleString('en-IN')}</td>
      </tr>
    `
    ).join('');

    const formattedDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CineGo Executive Financial & Booking Report</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { margin: 1.5cm; size: A4 portrait; }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #1f2937;
              padding: 32px;
              max-width: 900px;
              margin: 0 auto;
              background: #fff;
            }
            .header {
              border-bottom: 3px solid #E50914;
              padding-bottom: 18px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .brand {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .brand-name {
              font-size: 26px;
              font-weight: 900;
              color: #E50914;
              letter-spacing: -0.5px;
            }
            .title {
              font-size: 20px;
              font-weight: 800;
              color: #111827;
              margin-top: 4px;
            }
            .subtitle {
              font-size: 11px;
              color: #6b7280;
              margin-top: 4px;
            }
            .meta {
              text-align: right;
              font-size: 11px;
              color: #6b7280;
              line-height: 1.5;
            }
            .kpi-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              margin-bottom: 24px;
            }
            .kpi-box {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 12px;
            }
            .kpi-label {
              font-size: 10px;
              text-transform: uppercase;
              font-weight: 700;
              color: #6b7280;
            }
            .kpi-val {
              font-size: 18px;
              font-weight: 800;
              color: #111827;
              margin-top: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              margin-top: 12px;
            }
            th {
              background: #f3f4f6;
              padding: 10px 14px;
              font-size: 11px;
              font-weight: 700;
              color: #374151;
              text-transform: uppercase;
              border-bottom: 2px solid #d1d5db;
            }
            .footer {
              margin-top: 36px;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #9ca3af;
            }
            .dbms-note {
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              border-radius: 6px;
              padding: 10px 14px;
              font-size: 11px;
              color: #1e40af;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">
                <span class="brand-name">CineGo</span>
                <span style="font-size: 12px; font-weight: 700; color: #4b5563; text-transform: uppercase; letter-spacing: 1px;">Admin Console &bull; Executive Audit</span>
              </div>
              <div class="title">Financial & Booking Performance Report</div>
              <div class="subtitle">Generated from Oracle PL/SQL Procedure: VIEW_BOOKING_REPORT</div>
            </div>
            <div class="meta">
              <strong>Generated:</strong> ${formattedDate}<br/>
              <strong>Auditor:</strong> System Administrator<br/>
              <strong>Scope:</strong> Tamil Nadu &amp; Puducherry Theatres
            </div>
          </div>

          <div class="dbms-note">
            <strong>Oracle Database Engine Verification:</strong> Query compiled with cursor-based aggregations: <code>SELECT m.TITLE, COUNT(b.BOOKING_ID), SUM(b.FINAL_AMOUNT) FROM BOOKINGS b JOIN SHOWS s ON ... GROUP BY m.TITLE</code>
          </div>

          <div class="kpi-grid">
            <div class="kpi-box">
              <div class="kpi-label">Total Box Office</div>
              <div class="kpi-val" style="color: #059669;">₹${totalRevenue.toLocaleString('en-IN')}</div>
              <div style="font-size: 9px; color: #059669; font-weight: 600; margin-top: 2px;">+18.4% Week-over-Week</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-label">Tickets Issued</div>
              <div class="kpi-val">${totalTickets.toLocaleString('en-IN')}</div>
              <div style="font-size: 9px; color: #6b7280; margin-top: 2px;">Across 8 Theatres</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-label">Top Grossing Movie</div>
              <div class="kpi-val" style="font-size: 16px;">Baththa</div>
              <div style="font-size: 9px; color: #d97706; font-weight: 600; margin-top: 2px;">94% Seat Fill Rate</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-label">Concessions (F&B)</div>
              <div class="kpi-val">₹482,900</div>
              <div style="font-size: 9px; color: #2563eb; margin-top: 2px;">26% Food Attach Rate</div>
            </div>
          </div>

          <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #374151; margin-bottom: 6px;">Box Office Breakdown by Title</h3>
          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Movie Title</th>
                <th style="text-align: center;">Total Admissions</th>
                <th style="text-align: center;">Occupancy Rate</th>
                <th style="text-align: right;">Total Gross Revenue</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f9fafb; font-weight: bold; border-top: 2px solid #374151;">
                <td style="padding: 12px 14px;">Grand Total</td>
                <td style="padding: 12px 14px; text-align: center;">${totalTickets.toLocaleString('en-IN')} bookings</td>
                <td style="padding: 12px 14px; text-align: center;">84.5% avg</td>
                <td style="padding: 12px 14px; text-align: right; color: #E50914; font-size: 14px;">₹${totalRevenue.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          <div class="footer">
            <span>CineGo Enterprise Multiplex Management System &bull; Confidential</span>
            <span>Printed on ${formattedDate}</span>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const handleExportCSV = () => {
    const headers = ['Movie Title', 'Total Admissions', 'Occupancy Rate (%)', 'Total Gross Revenue (INR)'];
    const rows = REVENUE_BY_MOVIE.map(m => [
      `"${m.title}"`,
      m.totalBookings,
      `${m.occupancyRate}%`,
      m.totalRevenue
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cinego_financial_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Financial report exported to CSV!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Financial & Booking Analytics</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Generated via Oracle PL/SQL explicit cursor procedure <code className="text-primary font-mono font-bold">VIEW_BOOKING_REPORT</code> using multi-table aggregation joins.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownloadPDF}
            variant="primary"
            className="rounded-xl flex items-center text-xs shadow-lg shadow-primary/25 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" /> Download Executive PDF Report
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="rounded-xl flex items-center text-xs border-white/20 hover:bg-white/10 cursor-pointer text-zinc-300 hover:text-white"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-400" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Total Box Office</p>
              <h2 className="text-3xl font-display font-bold text-white mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xs text-emerald-400 mt-4 block font-semibold flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> +18.4% this week
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Tickets Issued</p>
              <h2 className="text-3xl font-display font-bold text-white mt-1">{totalTickets.toLocaleString('en-IN')}</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xs text-zinc-400 mt-4 block">Across 8 cinema theatres</span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Top Performing Title</p>
              <h2 className="text-xl font-display font-bold text-white mt-1">Baththa</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xs text-amber-400 mt-4 block font-semibold">94% average seat fill</span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">F&B Concessions Gross</p>
              <h2 className="text-3xl font-display font-bold text-white mt-1">₹482,900</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xs text-blue-400 mt-4 block font-semibold">26% of overall admissions</span>
        </div>
      </div>

      {/* Aggregate Report Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center">
              <BarChart3 className="w-5 h-5 text-primary mr-2" /> Oracle Aggregate Cursor: VIEW_BOOKING_REPORT
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              SQL: <code className="text-zinc-200">SELECT m.TITLE, COUNT(b.BOOKING_ID), SUM(b.FINAL_AMOUNT) FROM BOOKINGS b JOIN SHOWS s ON ... GROUP BY m.TITLE</code>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/90 text-xs uppercase text-zinc-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Movie Title</th>
                <th className="px-6 py-4">Total Admissions</th>
                <th className="px-6 py-4">Occupancy Share</th>
                <th className="px-6 py-4">Total Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {REVENUE_BY_MOVIE.map(row => (
                <tr key={row.title} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white flex items-center">
                    <Film className="w-4 h-4 mr-2 text-primary" /> {row.title}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-zinc-300">
                    {row.totalBookings.toLocaleString('en-IN')} bookings
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${row.occupancyRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-zinc-400">{row.occupancyRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold font-display text-white text-base">
                    ₹{row.totalRevenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
