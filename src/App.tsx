import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowRight, CheckCircle2, AlertTriangle, Gauge } from "lucide-react";

const styles = `
  * { box-sizing: border-box; }
  html, body, #root { margin: 0; min-height: 100%; font-family: 'Davivienda Regular', Arial, sans-serif; background: #efefef; color: #222; }
  .app-shell { min-height: 100vh; background: #efefef; }
  .container { max-width: 1480px; margin: 0 auto; padding: 24px 20px; }
  .sticky-nav { position: sticky; top: 0; z-index: 50; border-top: 1px solid #dedede; border-bottom: 1px solid #dedede; background: rgba(239,239,239,0.96); backdrop-filter: blur(8px); }
  .nav-wrap { max-width: 1480px; margin: 0 auto; padding: 10px 20px; display: flex; flex-wrap: wrap; gap: 8px; }
  .nav-btn { border: 1px solid #d8d8d8; background: #fff; color: #333; border-radius: 999px; padding: 10px 16px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all .2s ease; font-family: 'Davivienda Regular', Arial, sans-serif; }
  .nav-btn:hover { border-color: #ff1d25; color: #ff1d25; }
  .nav-btn.active { border-color: #ff1d25; background: #ff1d25; color: #fff; }
  .header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; }
  .brand-wrap { display: flex; gap: 18px; align-items: flex-start; }
  .brand-icon { width: 78px; height: 78px; flex: 0 0 auto; display: flex; align-items: center; justify-content: center; }
  .brand-logo-img { width: 100%; height: 100%; object-fit: contain; }
  .header-title { font-size: 44px; line-height: 1; font-weight: 900; letter-spacing: -0.02em; color: #111; margin: 0; font-family: 'Davivienda Condensed', Arial, sans-serif; }
  .header-subtitle { margin: 10px 0 0; font-size: 20px; line-height: 1.25; color: #111; font-family: 'Davivienda Regular', Arial, sans-serif; }
  .cut-top, .cut-main, .cut-bottom, .month-title, .activation-title, .activation-value, .margin-title, .summary-value, .big-num, .portfolio-value-title, .portfolio-value-num, .portfolio-total-pill, .metric-side-label, .metric-side-value, .nps-meta-title, .nps-meta-value, .glossary-title, .service-metric-value, .kpi-top-title, .kpi-real-green, .kpi-real-red, .kpi-success, .kpi-danger, .table-line-name, .section-note-title { font-family: 'Davivienda Condensed', Arial, sans-serif; }
  .income-sub, .summary-label, .tiny-meta, .stats-label, .stats-value, .kpi-top-label, .kpi-sub-label, .kpi-small-value, .portfolio-value-sub, .metric-side-legend, .section-note-desc, .soft-alert, .month-small, .service-metric-label, .insight-title, .insight-text, .glossary-text, .period-note, .compare-badges, .compare-badge, .period-btn, .cut-close, .cut-mode, .table-pill, .data-table td, .data-table th, .mini-table th, .mini-table td, .pill { font-family: 'Davivienda Regular', Arial, sans-serif; }
  .compare-badges { margin-top: 12px; display: inline-flex; flex-wrap: wrap; gap: 8px; align-items: center; border: 1px solid #dedede; background: #fff; border-radius: 999px; padding: 8px 12px; font-size: 13px; font-weight: 700; color: #555; }
  .compare-badge { background: #f4f4f4; color: #333; border-radius: 999px; padding: 4px 10px; }
  .cut-box { position: relative; }
  .cut-button {
    width: 180px;
    border: 0;
    border-radius: 8px;
    background: #ff1d25;
    color: white;
    padding: 18px 20px 20px;
    text-align: center;
    cursor: pointer;
    transition: all .2s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
  }
  .cut-button:hover { box-shadow: 0 12px 26px rgba(255,29,37,.25); }
  .cut-top { font-size: 14px; line-height: 1; letter-spacing: 1px; margin-bottom: 4px; }
  .cut-main { font-size: 30px; line-height: 1.1; font-weight: 900; letter-spacing: .05em; margin: 2px 0; }
  .cut-bottom { font-size: 14px; line-height: 1; margin-top: 4px; }
  .cut-panel { position: absolute; right: 0; top: calc(100% + 10px); width: 340px; z-index: 70; border: 1px solid #d7d7d7; background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 20px 40px rgba(0,0,0,.12); }
  .cut-panel-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .cut-close { border: 1px solid #dedede; background: #fff; color: #666; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer; }
  .cut-close:hover { background: #f7f7f7; }
  .cut-modes { margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f4f4f4; border-radius: 10px; padding: 4px; }
  .cut-mode { border: 0; background: transparent; border-radius: 8px; padding: 10px 12px; font-size: 13px; font-weight: 800; cursor: pointer; color: #666; }
  .cut-mode.active { background: #fff; color: #111; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
  .period-grid { margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .period-btn { border: 1px solid #dfdfdf; background: #fafafa; color: #222; border-radius: 10px; padding: 12px; text-align: left; cursor: pointer; transition: all .2s ease; }
  .period-btn:hover { border-color: #ffb7ba; background: #fff; }
  .period-btn.active { border-color: #ff1d25; background: #fff3f4; box-shadow: 0 8px 20px rgba(255,29,37,.08); }
  .period-note { margin-top: 16px; border: 1px solid #ededed; background: #fafafa; border-radius: 10px; padding: 12px; font-size: 12px; line-height: 1.6; color: #666; }
  .section-band { border-radius: 4px; background: #ff1d25; color: #fff; text-align: center; font-size: 34px; line-height: 1; font-weight: 900; padding: 14px 20px; font-family: 'Davivienda Condensed', Arial, sans-serif; }
  .page-card { border: 1px solid #d8d8d8; background: #f7f7f7; border-radius: 10px; padding: 20px; transition: box-shadow .25s ease, transform .25s ease; }
  .page-card:hover { box-shadow: 0 18px 36px rgba(0,0,0,.05); }
  .hover-card { transition: all .28s ease; }
  .hover-card:hover { transform: translateY(-4px); box-shadow: 0 18px 42px rgba(0,0,0,.08); background: #fff; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  .grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .income-card { border: 1px solid #d9d9d9; background: #f8f8f8; border-radius: 10px; padding: 24px; text-align: center; box-shadow: 0 1px 0 rgba(0,0,0,.02); }
  .income-title { font-size: 16px; font-weight: 800; color: #222; font-family: 'Davivienda Condensed', Arial, sans-serif; }
  .income-sub { margin-top: 4px; font-size: 12px; color: #9a9a9a; }
  .income-value { margin-top: 8px; font-size: 34px; line-height: 1; font-weight: 900; color: #111; font-family: 'Davivienda Condensed', Arial, sans-serif; }
  .pill-col { margin-top: 18px; display: flex; flex-direction: column; gap: 8px; align-items: center; }
  .pill { display: inline-flex; align-items: center; border-radius: 999px; padding: 8px 14px; font-size: 13px; font-weight: 700; }
  .pill-green { background: #bfeac0; color: #4e8a4d; }
  .pill-yellow { background: #f5d65f; color: #6e5d18; }
  .pill-red { background: #f8b8bb; color: #d7333b; }
  .summary-box { border: 1px solid #e1e1e1; background: #fafafa; border-radius: 8px; padding: 24px; }
  .summary-label { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #9b9b9b; }
  .summary-value { font-size: 18px; font-weight: 900; color: #222; }
  .summary-row { margin-top: 20px; display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; }
  .summary-midline { height: 2px; background: #d9d9d9; }
  .summary-pill { border-radius: 999px; background: #bde8bf; padding: 10px 16px; text-align: center; font-size: 18px; font-weight: 800; color: #5d965e; }
  .summary-foot { margin-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: center; }
  .margin-box { border: 1px solid #e0e0e0; background: #fafafa; border-radius: 8px; padding: 20px; }
  .margin-title { font-size: 17px; font-weight: 900; color: #262626; margin: 0; }
  .tiny-meta { margin-top: 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #9a9a9a; }
  .big-num { font-size: 20px; font-weight: 900; color: #222; }
  .big-num-muted { color: #555; }
  .top-right { text-align: right; }
  .state-pill { display: inline-flex; border-radius: 999px; padding: 6px 14px; font-size: 14px; font-weight: 800; }
  .state-green { background: #bfeac0; color: #51914f; }
  .state-red { background: #f8b8bb; color: #d7333b; }
  .state-line-green { color: #5f9d5e; font-size: 14px; font-weight: 800; margin-top: 8px; }
  .state-line-red { color: #d84d57; font-size: 14px; font-weight: 800; margin-top: 8px; }
  .helper-box { border-radius: 10px; padding: 20px; border: 1px solid; }
  .helper-green { border-color: #b8ddbe; background: #eef8ef; }
  .helper-yellow { border-color: #e0cd7d; background: #f9f2d6; }
  .helper-red { border-color: #f1b1b1; background: #fdeeee; }
  .helper-head { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 900; color: #222; font-family: 'Davivienda Condensed', Arial, sans-serif; }
  .helper-text { margin-top: 10px; font-size: 14px; line-height: 1.7; color: #555; font-family: 'Davivienda Regular', Arial, sans-serif; }
  .data-table-wrap { overflow: hidden; border: 1px solid #d8d8d8; border-radius: 18px; background: #ffffff; }
  .data-table-scroll { overflow-x: auto; }
  .data-table { min-width: 100%; border-collapse: separate; border-spacing: 0; text-align: left; font-size: 16px; table-layout: fixed; font-family: 'Davivienda Regular', Arial, sans-serif; }
  .data-table th { background: #e10600; color: #ffffff; padding: 14px 14px; font-weight: 700; white-space: nowrap; border-bottom: 0; font-family: 'Davivienda Condensed', Arial, sans-serif; font-size: 15px; }
  .data-table th:first-child { border-top-left-radius: 18px; }
  .data-table th:last-child { border-top-right-radius: 18px; }
  .data-table td { padding: 11px 14px; border-top: 1px solid #ececec; background: #ffffff; color: #243b63; font-weight: 500; vertical-align: middle; }
  .data-table tbody tr:nth-child(odd) td { background: #fbfbfb; }
  .data-table tbody tr:hover td { background: #f7f7f7; }
  .data-table th:first-child, .data-table td:first-child { width: 330px; }
  .data-table th:nth-child(2), .data-table td:nth-child(2),
  .data-table th:nth-child(3), .data-table td:nth-child(3),
  .data-table th:nth-child(5), .data-table td:nth-child(5),
  .data-table th:nth-child(6), .data-table td:nth-child(6) { width: 140px; }
  .data-table th:nth-child(4), .data-table td:nth-child(4),
  .data-table th:nth-child(7), .data-table td:nth-child(7) { width: 120px; }
  .data-table th:nth-child(8), .data-table td:nth-child(8) { width: 170px; }
  .table-line-name { font-family: 'Davivienda Condensed', Arial, sans-serif; font-size: 16px; color: #243b63; }
  .table-pill { display: inline-flex; align-items: center; justify-content: center; min-width: 70px; padding: 6px 14px; border-radius: 999px; font-size: 15px; font-weight: 800; line-height: 1; }
  .table-pill.green { background: #d8efdd; color: #12703c; }
  .table-pill.yellow { background: #f4e2a4; color: #8a6410; }
  .table-pill.red { background: #f3d0d3; color: #b02b33; }
  .table-pill.gray { background: #e5e7eb; color: #41546f; }
  .section-note-title { font-size: 18px; font-weight: 900; color: #1f1f1f; }
  .section-note-desc { margin-top: 4px; font-size: 14px; color: #5d5d5d; }
  .soft-alert { background: #fdeeee; color: #4b4b4b; font-size: 15px; border-radius: 10px; padding: 12px 14px; }
  .month-card { border: 1px solid #d9d9d9; background: #fbfbfb; border-radius: 8px; padding: 16px; }
  .month-card-head { display: flex; justify-content: space-between; gap: 8px; align-items: flex-start; }
  .month-small { font-size: 13px; font-weight: 800; text-transform: uppercase; color: #a4a4a4; }
  .month-title { font-size: 22px; font-weight: 900; color: #333; }
  .fact-pill { background: #fdecec; color: #f03b32; border-radius: 6px; padding: 6px 10px; font-size: 12px; font-weight: 800; }
  .activation-title { margin-top: 34px; text-align: center; font-size: 22px; font-weight: 800; color: #707070; }
  .activation-value { margin-top: 8px; text-align: center; font-size: 54px; line-height: 1; font-weight: 900; color: #ff1d25; }
  .stats-row { margin-top: 28px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center; }
  .stats-label { font-size: 13px; font-weight: 700; color: #666; }
  .stats-value { margin-top: 4px; font-size: 22px; font-weight: 900; color: #333; }
  .mini-table-wrap { overflow: hidden; border: 1px solid #d8d8d8; background: #fff; border-radius: 8px; }
  .mini-table { min-width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; }
  .mini-table th { background: #ff1d25; color: #fff; padding: 16px; font-weight: 800; }
  .mini-table td { background: #f7f7f7; color: #444; padding: 20px 16px; border-top: 1px solid #e6e6e6; }
  .mini-table tbody tr:hover td { background: #fff; }
  .mini-table td:first-child, .mini-table th:first-child { text-align: left; }
  .kpi-compare-card { border: 1px solid #dcdcdc; background: #fbfbfb; border-radius: 8px; padding: 16px; }
  .kpi-top-label { font-size: 12px; color: #9a9a9a; }
  .kpi-top-title { font-size: 18px; font-weight: 900; color: #333; }
  .kpi-real-box-green { margin-top: 16px; border-radius: 6px; background: #e3f3e5; padding: 14px 16px; }
  .kpi-real-box-red { margin-top: 16px; border-radius: 6px; background: #fdecec; padding: 14px 16px; }
  .kpi-sub-label { font-size: 11px; color: #888; }
  .kpi-real-green { font-size: 36px; line-height: 1; font-weight: 900; color: #16834a; }
  .kpi-real-red { font-size: 36px; line-height: 1; font-weight: 900; color: #ff3131; }
  .kpi-grid-2 { margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .kpi-small-box { border-radius: 6px; background: #f1f2f5; padding: 12px; }
  .kpi-small-box-alt { border-radius: 6px; background: #fafafa; padding: 12px; }
  .kpi-small-value { font-size: 18px; font-weight: 900; color: #555; }
  .kpi-success { font-size: 22px; font-weight: 900; color: #16834a; }
  .kpi-danger { font-size: 22px; font-weight: 900; color: #ff3131; }
  .portfolio-shell { display: grid; grid-template-columns: minmax(0,1fr) 420px; gap: 16px; }
  .portfolio-chart-card { border: 1px solid #dfdfdf; background: #f7f7f7; border-radius: 12px; padding: 16px; }
  .portfolio-value-card { border: 1px solid #d7d7d7; background: #f9f9f9; border-radius: 12px; padding: 16px; }
  .portfolio-value-title { font-size: 22px; font-weight: 900; color: #242424; }
  .portfolio-value-sub { margin-top: 4px; font-size: 16px; color: #8b8b8b; }
  .portfolio-value-num { font-size: 22px; font-weight: 900; color: #333; }
  .portfolio-total { border: 1px solid #eccfd1; background: #fdf0f0; border-radius: 12px; padding: 16px; }
  .portfolio-total-pill { border-radius: 8px; background: #fff2f2; padding: 8px 12px; font-size: 26px; font-weight: 900; color: #ff4e4e; }
  .churn-card-inner { display: grid; grid-template-columns: minmax(0,1.3fr) 420px; gap: 20px; border: 1px solid #f1c7c9; background: #fbfbfb; border-radius: 14px; padding: 24px; }
  .chart-panel { border: 1px solid #ececec; background: #fff; border-radius: 16px; padding: 18px 24px; box-shadow: inset 0 1px 0 rgba(255,255,255,.9); }
  .chart-panel:hover { box-shadow: 0 18px 36px rgba(0,0,0,.05); }
  .chart-title-inline { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px; font-size: 17px; font-weight: 800; color: #222; }
  .chart-dot-inline { width: 16px; height: 16px; border-radius: 999px; }
  .metric-side-box { border: 1px solid #e2e2e2; background: #fff; border-radius: 18px; padding: 28px 32px; }
  .metric-side-label { font-size: 24px; line-height: 1.2; color: #111; }
  .metric-side-value { margin-top: 16px; font-size: 60px; line-height: 1; font-weight: 900; color: #111; }
  .metric-side-chip { align-self: flex-end; border: 1px solid #d7d7d7; background: #f9f9f9; border-radius: 18px; padding: 20px 32px; text-align: center; box-shadow: 0 6px 18px rgba(0,0,0,.03); }
  .metric-side-chip .top { font-size: 18px; color: #333; }
  .metric-side-chip .bottom { font-size: 34px; font-weight: 900; color: #111; }
  .metric-side-legend { margin-top: 18px; display: flex; align-items: center; gap: 12px; font-size: 20px; color: #444; }
  .nps-meta-card { border: 1px solid #dedede; background: #fbf6f6; border-radius: 10px; padding: 24px; text-align: center; }
  .nps-meta-bar { width: 70%; height: 6px; border-radius: 999px; margin: 0 auto 16px; }
  .nps-meta-title { font-size: 18px; color: #333; }
  .nps-meta-value { margin-top: 12px; font-size: 32px; font-weight: 900; color: #111; }
  .month-service-col { border: 1px solid #d9d9d9; background: #f9f9f9; border-radius: 10px; padding: 16px; }
  .month-service-head { display: flex; align-items: flex-start; justify-content: space-between; }
  .month-service-code { font-size: 16px; font-weight: 900; color: #ff3434; }
  .service-metric { border: 1px solid #dedede; background: #fff; border-radius: 10px; padding: 18px; }
  .service-metric-head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
  .service-metric-label { font-size: 18px; color: #555; }
  .service-metric-value { font-size: 34px; line-height: 1; font-weight: 900; color: #111; }
  .trend-chip-up { background: #eef1f4; color: #295d7d; border-radius: 8px; padding: 8px 14px; font-size: 16px; font-weight: 700; }
  .trend-chip-down { background: #f8edd2; color: #e28d07; border-radius: 8px; padding: 8px 14px; font-size: 16px; font-weight: 700; }
  .progress-row { margin-top: 14px; display: flex; align-items: center; gap: 12px; }
  .progress-track { height: 10px; flex: 1; border-radius: 999px; background: #c9c9c9; overflow: hidden; }
  .progress-fill { height: 10px; border-radius: 999px; }
  .progress-value { font-size: 18px; font-weight: 800; color: #333; }
  .insight-box { background: #efefef; border-radius: 10px; padding: 16px; }
  .insight-title { font-size: 18px; font-weight: 900; color: #7a7a7a; text-transform: uppercase; }
  .insight-text { margin-top: 8px; font-size: 15px; line-height: 1.7; color: #555; }
  .glossary-card { border: 1px solid #dedede; background: #f9f9f9; border-radius: 10px; padding: 20px; }
  .glossary-head { display: flex; align-items: center; gap: 16px; }
  .glossary-dot { width: 32px; height: 32px; border-radius: 999px; }
  .glossary-title { font-size: 22px; font-weight: 900; color: #111; }
  .glossary-text { margin-top: 12px; font-size: 16px; line-height: 1.7; color: #555; }
  .hero-grid { max-width: 1500px; margin: 0 auto; min-height: calc(100vh - 30px); display: grid; grid-template-columns: 1.05fr 1fr; gap: 40px; align-items: center; padding: 40px 32px; }
  .hero-left { padding-left: 16px; padding-top: 24px; }
  .hero-logo { margin-bottom: 48px; display: flex; align-items: flex-end; gap: 16px; }
  .hero-logo-main { font-size: 100px; line-height: .8; font-weight: 900; font-style: italic; color: #111; }
  .hero-logo-sub { margin-bottom: 8px; font-size: 24px; color: #ff1d25; }
  .hero-title-1 { max-width: 560px; font-size: 66px; line-height: .98; letter-spacing: -0.03em; color: #111; font-family: 'Davivienda Regular', Arial, sans-serif; }
  .hero-title-2 { max-width: 560px; font-size: 74px; line-height: .96; letter-spacing: -0.04em; font-weight: 900; color: #111; font-family: 'Davivienda Condensed', Arial, sans-serif; }
  .hero-cta { margin-top: 64px; width: 370px; height: 104px; border: 0; border-radius: 999px; background: #f10600; color: #fff; font-size: 36px; font-weight: 900; cursor: pointer; transition: background .2s ease, transform .2s ease; }
  .hero-cta:hover { background: #d90700; transform: translateY(-2px); }
  .hero-footer { margin-top: 112px; font-size: 22px; color: #333; }
  .hero-right { position: relative; display: flex; align-items: center; justify-content: center; min-height: 760px; }
  .hero-circle-pink { position: absolute; right: 16%; top: 18%; width: 170px; height: 170px; border-radius: 999px; background: rgba(247,183,190,.7); }
  .hero-ring { position: absolute; right: 2%; top: 11%; width: 620px; height: 620px; border-radius: 999px; border: 26px solid rgba(255,255,255,.6); }
  .hero-glow { position: absolute; right: 16%; top: 28%; width: 340px; height: 340px; border-radius: 999px; background: radial-gradient(circle, rgba(255,182,193,.6) 0%, rgba(255,255,255,0) 70%); }
  .hero-mockup { position: relative; z-index: 10; width: 620px; height: 770px; overflow: hidden; border-radius: 46%; background: linear-gradient(180deg,#fff 0%,#f2f2f2 100%); box-shadow: 0 20px 60px rgba(0,0,0,.08); }
  .hero-mockup::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 62% 40%, rgba(255,186,196,.55), rgba(255,255,255,0) 40%); }
  .hero-inner { position: absolute; left: 14%; right: 14%; top: 10%; height: 76%; border-radius: 32px; background: linear-gradient(180deg,#fdfdfd 0%,#f1f1f1 100%); }
  .hero-phone { position: absolute; left: 22%; right: 22%; top: 18%; height: 56%; border-radius: 28px; background: linear-gradient(180deg,#111827 0%,#1f2937 12%,#f5f5f5 13%,#fbfbfb 100%); padding: 16px; }
  .hero-notch { width: 96px; height: 8px; border-radius: 999px; margin: 0 auto; background: #111827; }
  .hero-screen { margin-top: 32px; height: 72%; border-radius: 20px; background: linear-gradient(180deg,#fdfdfd 0%,#eceff3 100%); }
  .hero-note { position: absolute; left: 16%; bottom: 14%; font-size: 14px; font-weight: 700; color: #444; }
  .next-wrap { max-width: 1480px; margin: 0 auto; padding: 0 20px 40px; display: flex; justify-content: flex-end; }
  .next-btn { height: 48px; border: 0; border-radius: 999px; background: #ff1d25; color: #fff; padding: 0 24px; display: inline-flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 800; cursor: pointer; }
  .next-btn:hover { background: #e4151c; }
  @media (max-width: 1280px) {
    .grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-3, .grid-2, .portfolio-shell, .churn-card-inner { grid-template-columns: 1fr; }
    .hero-grid { grid-template-columns: 1fr; }
    .hero-left { padding-left: 0; }
    .hero-right { min-height: 520px; }
  }
  @media (max-width: 768px) {
    .header { flex-direction: column; }
    .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
    .header-title { font-size: 34px; }
    .section-band { font-size: 28px; }
    .hero-title-1 { font-size: 48px; }
    .hero-title-2 { font-size: 56px; }
    .hero-cta { width: 100%; max-width: 370px; }
    .hero-logo-main { font-size: 72px; }
    .cut-button { width: 100%; }
    .cut-panel { width: min(340px, calc(100vw - 40px)); right: 0; }
  }
`;

const COLORS = {
  darkPurple: "#28105f",
  yellow: "#f1d554",
  blue: "#4d7ef7",
  red: "#ff1d25",
  deepBlue: "#15516f",
  green: "#20a751",
  orange: "#f1a10a",
};

const MONTHS_ES = [
  { upper: "ENERO", title: "Enero", short: "Ene" },
  { upper: "FEBRERO", title: "Febrero", short: "Feb" },
  { upper: "MARZO", title: "Marzo", short: "Mar" },
  { upper: "ABRIL", title: "Abril", short: "Abr" },
  { upper: "MAYO", title: "Mayo", short: "May" },
  { upper: "JUNIO", title: "Junio", short: "Jun" },
  { upper: "JULIO", title: "Julio", short: "Jul" },
  { upper: "AGOSTO", title: "Agosto", short: "Ago" },
  { upper: "SEPTIEMBRE", title: "Septiembre", short: "Sep" },
  { upper: "OCTUBRE", title: "Octubre", short: "Oct" },
  { upper: "NOVIEMBRE", title: "Noviembre", short: "Nov" },
  { upper: "DICIEMBRE", title: "Diciembre", short: "Dic" },
];

const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "ingresos", label: "Ingresos" },
  { id: "vinculacion", label: "Vinculación y facturación" },
  { id: "transaccionales", label: "Transaccionales y Clientes Churn" },
  { id: "nps", label: "NPS" },
];

const DATA_URL = `${process.env.PUBLIC_URL}/data/boletin-data.json`;

const dataByPeriod = {
  "2026-02": {
    corteMes: "FEBRERO",
    corteAnio: "2026",
    ingresos: {
      cards: [
        {
          title: "Ingresos Agregador",
          value: "$787,7 M",
          delta: "+ 18,0 % vs ene",
          meta: "95,0 % de meta",
          deltaTone: "green",
          metaTone: "yellow",
        },
        {
          title: "Ingresos Gateway",
          value: "$787,2 M",
          subtitle: "Afiliaciones + transacciones",
          delta: "+ 40,2 % vs ene",
          meta: "95,0 % de meta",
          deltaTone: "green",
          metaTone: "green",
        },
        {
          title: "Otras líneas",
          value: "$49,6 M",
          delta: "- 66,0 % vs ene",
          meta: "38,5 % de meta",
          deltaTone: "red",
          metaTone: "red",
        },
        {
          title: "Ingreso total",
          value: "$1.621,5 M",
          delta: "+ 19,2 % vs ene",
          meta: "104,9 % de meta",
          deltaTone: "green",
          metaTone: "green",
        },
      ],
      summary: {
        total: "$1621,5 M",
        delta: "+ 19,2%",
        cumplimiento: "Cumpl. 104,9%",
        ene: "$1360,9 M",
        ppto: "$1545,9 M",
      },
      margins: [
        {
          title: "Margen bruto",
          real: "$1212,7 M",
          ppto: "$924,1 M",
          pill: "131,2",
          pillTone: "green",
          vsText: "+34,9%",
          vsTone: "green",
          note: "Variación absoluta vs meta: $288,6 M",
          series: [
            { name: "ENE", value: 9500 },
            { name: "FEB REAL", value: 12000 },
            { name: "PPTO", value: 9800 },
          ],
        },
        {
          title: "Margen EBITDA",
          real: "$78,6 M",
          ppto: "-$673,1 M",
          pill: "111,0 %",
          pillTone: "green",
          vsText: "-110,1%",
          vsTone: "red",
          note: "Variación absoluta vs meta: $751,7 M",
          series: [
            { name: "ENE", value: 120 },
            { name: "FEB REAL", value: 700 },
            { name: "PPTO", value: -80 },
          ],
        },
        {
          title: "Margen neto",
          real: "$25,4 M",
          ppto: "-$687,3 M",
          pill: "103,6 %",
          pillTone: "green",
          vsText: "-103,2%",
          vsTone: "red",
          note: "Variación absoluta vs meta: $712,7 M",
          series: [
            { name: "ENE", value: -300 },
            { name: "FEB REAL", value: 60 },
            { name: "PPTO", value: -650 },
          ],
        },
      ],
      table: [
        [
          "Ingresos total",
          "$1.360,9 M",
          "$1.442,9 M",
          "94.3%",
          "$1.621,5 M",
          "$1.545,9 M",
          "104.9%",
          "192%",
        ],
        [
          "ePayco pagos Agregador",
          "$667,3 M",
          "$781,5 M",
          "85.4%",
          "$787,7 M",
          "$828,9 M",
          "95.0%",
          "180%",
        ],
        [
          "ePayco pagos Gateway",
          "$561,4 M",
          "$586,9 M",
          "95.7%",
          "$787,2 M",
          "$622,6 M",
          "126.5%",
          "402%",
        ],
        [
          "ePayco Recaudo",
          "$50,6 M",
          "$43,5 M",
          "116.4%",
          "$8,0 M",
          "$46,1 M",
          "17.4%",
          "-841%",
        ],
        [
          "Suscripciones",
          "$5,4 M",
          "$5,7 M",
          "93.9%",
          "$6,0 M",
          "$6,1 M",
          "98.5%",
          "113%",
        ],
        [
          "ePayco Control",
          "$61,4 M",
          "$45,2 M",
          "136.0%",
          "$26,1 M",
          "$47,9 M",
          "54.5%",
          "-574%",
        ],
        [
          "ePayco Paypal",
          "$6,7 M",
          "$7,8 M",
          "86.0%",
          "$1,2 M",
          "$23,7 M",
          "5.2%",
          "-815%",
        ],
        [
          "ePayco shops",
          "$0,2 M",
          "$0,2 M",
          "139.1%",
          "$0,0 M",
          "$0,2 M",
          "0.0%",
          "-1000%",
        ],
        [
          "ePayco PayOuts",
          "$0,0 M",
          "$0,1 M",
          "4.5%",
          "$0,0 M",
          "$0,1 M",
          "4.3%",
          "0%",
        ],
      ],
    },
    vinculacion: {
      months: [
        {
          label: "Ene-26",
          fact: "Fact. $19,4 M",
          activacion: "27%",
          registros: "1.796",
          vinc: "847",
          ccios: "229",
        },
        {
          label: "Feb-26",
          fact: "Fact. $19,4 M",
          activacion: "37%",
          registros: "2.361",
          vinc: "1.308",
          ccios: "478",
        },
        {
          label: "Mar-26",
          fact: "Fact. $19,4 M",
          activacion: "17%",
          registros: "2.905",
          vinc: "1.575",
          ccios: "268",
        },
      ],
      agregador: [
        ["Registros", "1.093", "1.228", "1.528"],
        ["Vinculaciones", "156", "190", "222"],
        ["Ccios Fact", "229", "478", "268"],
        ["% Activación", "50%", "49%", "29%"],
      ],
      gateway: [
        ["Registros", "703", "1.133", "1.377"],
        ["Vinculaciones", "691", "1.118", "1.353"],
        ["Ccios Fact", "151", "385", "204"],
        ["% Activación", "22%", "34%", "15%"],
      ],
      kpiAgregador: [
        {
          title: "#Transacciones",
          real: "94,42 mil",
          meta: "109,33 mil",
          cumplimiento: "86,36%",
          realPrev: "97,88 mil",
          metaPrev: "103,07 mil",
          tone: "red",
        },
        {
          title: "$ Dinero operado",
          real: "$22,55 mil M",
          meta: "$27,13 mil M",
          cumplimiento: "83,10%",
          realPrev: "$23,68 mil M",
          metaPrev: "$25,58 mil M",
          tone: "red",
        },
        {
          title: "Ticket promedio",
          real: "$238,82 mil",
          meta: "$248,20 mil",
          cumplimiento: "96,22%",
          realPrev: "$241,99 mil",
          metaPrev: "$248,20 mil",
          tone: "green",
        },
        {
          title: "Clientes transaccionales",
          real: "$2,56 mil",
          meta: "3,31 mil",
          cumplimiento: "77,39%",
          realPrev: "2,54 mil",
          metaPrev: "3,12 mil",
          tone: "red",
        },
      ],
      kpiGateway: [
        {
          title: "#Transacciones",
          real: "3,18 M",
          meta: "4,52 M",
          cumplimiento: "70%",
          realPrev: "3,47 M",
          metaPrev: "4,48 M",
          tone: "red",
        },
        {
          title: "Clientes",
          real: "6,82 mil",
          meta: "6,36 M",
          cumplimiento: "107%",
          realPrev: "6,55 mil",
          metaPrev: "6,31 mil",
          tone: "green",
        },
        {
          title: "TXR promedio x cliente",
          real: "467",
          meta: "711",
          cumplimiento: "66%",
          realPrev: "530",
          metaPrev: "711",
          tone: "red",
        },
      ],
    },
    transaccionales: {
      pie: [
        { name: "Portafolio Movistar", value: 35, color: "#1967e8" },
        { name: "Portafolio Wom", value: 8, color: COLORS.darkPurple },
        { name: "Portafolio Davivienda", value: 38, color: "#ea2c20" },
        { name: "Portafolio General", value: 16, color: COLORS.yellow },
        { name: "Portafolio especial", value: 3, color: "#ef7b7b" },
      ],
      values: [
        ["Portafolio Movistar", "1.075.223"],
        ["Portafolio Wom", "231.768"],
        ["Portafolio Davivienda", "1.248.848"],
        ["Portafolio General", "533.710"],
        ["Portafolio especial", "98.515"],
      ],
      total: "3.188.064",
      churnAgregador: {
        activos: [
          { name: "Ene", value: 3834 },
          { name: "Feb", value: 3649 },
        ],
        churn: [
          { name: "Ene", value: 195, rate: "5,09%" },
          { name: "Feb", value: 185, rate: "5,07%" },
        ],
        promedioActivos: "3.742",
        tasaMes: "5,07%",
        promedioChurn: "190",
      },
      churnGateway: {
        activos: [
          { name: "Ene", value: 7339 },
          { name: "Feb", value: 7412 },
        ],
        churn: [
          { name: "Ene", value: 145, rate: "1,98%" },
          { name: "Feb", value: 73, rate: "0,98%" },
        ],
        promedioActivos: "7.376",
        tasaMes: "0,98%",
        promedioChurn: "109",
      },
    },
    nps: {
      metas: [
        { title: "Meta NPS", value: "90", color: "#ef5a5a" },
        { title: "Meta SSA", value: "90", color: COLORS.deepBlue },
        { title: "Meta TEP", value: "10min", color: COLORS.green },
        { title: "Meta TDP", value: "4h", color: COLORS.orange },
      ],
      months: [
        {
          month: "Enero",
          code: "2026-1",
          insight:
            "Inicio del año con NPS y SSA por debajo de meta. TEP aún alto y TDP muy por encima del objetivo.",
          metrics: [
            {
              label: "NPS",
              value: "32,4",
              progress: 36,
              color: COLORS.red,
              trend: "-- Base",
            },
            {
              label: "TEP",
              value: "13,0min",
              progress: 77,
              color: COLORS.green,
              trend: "-- Base",
            },
            {
              label: "SSA",
              value: "41,3",
              progress: 46,
              color: COLORS.deepBlue,
              trend: "-- Base",
            },
            {
              label: "TDP",
              value: "41,3",
              progress: 15,
              color: COLORS.orange,
              trend: "-- Base",
            },
          ],
        },
        {
          month: "Febrero",
          code: "2026-2",
          insight:
            "Mejora relevante en NPS y SSA. TEP supera meta, pero TDP sigue lejos del objetivo esperado.",
          metrics: [
            {
              label: "NPS",
              value: "38,5",
              progress: 57,
              color: COLORS.red,
              trend: "Ascendente",
            },
            {
              label: "TEP",
              value: "5,2min",
              progress: 159,
              color: COLORS.green,
              trend: "Descendente",
            },
            {
              label: "SSA",
              value: "51,0",
              progress: 57,
              color: COLORS.deepBlue,
              trend: "Ascendente",
            },
            {
              label: "TDP",
              value: "12,2h",
              progress: 33,
              color: COLORS.orange,
              trend: "Descendente",
            },
          ],
        },
        {
          month: "Marzo",
          code: "2026-3",
          insight:
            "Continúa la mejora de NPS y SSA. TEP se mantiene sobre meta. TDP mejora, pero aún no cumple el estándar.",
          metrics: [
            {
              label: "NPS",
              value: "56,5",
              progress: 36,
              color: COLORS.red,
              trend: "Ascendente",
            },
            {
              label: "TEP",
              value: "6,3 min",
              progress: 159,
              color: COLORS.green,
              trend: "Ascendente",
            },
            {
              label: "SSA",
              value: "62,5",
              progress: 69,
              color: COLORS.deepBlue,
              trend: "Ascendente",
            },
            {
              label: "TDP",
              value: "24,0h",
              progress: 17,
              color: COLORS.red,
              trend: "Ascendente",
            },
          ],
        },
      ],
      glossary: [
        {
          dot: COLORS.red,
          title: "NPS",
          text: "Net Promoter Score. Mide qué tan dispuestos están los usuarios a recomendar el servicio.",
        },
        {
          dot: "#ff7b7b",
          title: "% Cumplimiento NPS",
          text: "Porcentaje de avance frente a la meta definida para NPS.",
        },
        {
          dot: COLORS.deepBlue,
          title: "SSA",
          text: "Satisfacción del servicio. Refleja el nivel de satisfacción reportado por los usuarios.",
        },
        {
          dot: "#69a8ff",
          title: "% Cumplimiento SSA",
          text: "Porcentaje de avance frente a la meta definida para SSA.",
        },
        {
          dot: COLORS.green,
          title: "TEP",
          text: "Tiempo de Espera Promedio. Mide cuántos minutos espera en promedio el usuario antes de ser atendido.",
        },
        {
          dot: "#47d96f",
          title: "% Cumplimiento TEP",
          text: "Porcentaje de cumplimiento frente a la meta de espera. Un valor superior a 100% indica que el tiempo real estuvo mejor que el objetivo.",
        },
        {
          dot: COLORS.orange,
          title: "TDP",
          text: "Tiempo de Duración Promedio. Mide cuánto dura en promedio la atención o gestión del caso.",
        },
        {
          dot: "#f6bf30",
          title: "% Cumplimiento TDP",
          text: "Porcentaje de cumplimiento frente a la meta de duración promedio.",
        },
      ],
    },
  },
  "2026-03": {
    corteMes: "MARZO",
    corteAnio: "2026",
    ingresos: { cards: [], summary: {}, margins: [], table: [] },
    vinculacion: {
      months: [],
      agregador: [],
      gateway: [],
      kpiAgregador: [],
      kpiGateway: [],
    },
    transaccionales: {
      pie: [],
      values: [],
      total: "",
      churnAgregador: {
        activos: [],
        churn: [],
        promedioActivos: "",
        tasaMes: "",
        promedioChurn: "",
      },
      churnGateway: {
        activos: [],
        churn: [],
        promedioActivos: "",
        tasaMes: "",
        promedioChurn: "",
      },
    },
    nps: {
      metas: [
        { title: "Meta NPS", value: "90", color: "#ef5a5a" },
        { title: "Meta SSA", value: "90", color: COLORS.deepBlue },
        { title: "Meta TEP", value: "10min", color: COLORS.green },
        { title: "Meta TDP", value: "4h", color: COLORS.orange },
      ],
      months: [
        {
          month: "Febrero",
          code: "2026-2",
          insight:
            "Mejora relevante en NPS y SSA. TEP supera meta, pero TDP sigue lejos del objetivo esperado.",
          metrics: [
            {
              label: "NPS",
              value: "38,5",
              progress: 57,
              color: COLORS.red,
              trend: "Ascendente",
            },
            {
              label: "TEP",
              value: "5,2min",
              progress: 159,
              color: COLORS.green,
              trend: "Descendente",
            },
            {
              label: "SSA",
              value: "51,0",
              progress: 57,
              color: COLORS.deepBlue,
              trend: "Ascendente",
            },
            {
              label: "TDP",
              value: "12,2h",
              progress: 33,
              color: COLORS.orange,
              trend: "Descendente",
            },
          ],
        },
        {
          month: "Marzo",
          code: "2026-3",
          insight:
            "Continúa la mejora de NPS y SSA. TEP se mantiene sobre meta. TDP mejora, pero aún no cumple el estándar.",
          metrics: [
            {
              label: "NPS",
              value: "56,5",
              progress: 63,
              color: COLORS.red,
              trend: "Ascendente",
            },
            {
              label: "TEP",
              value: "6,3 min",
              progress: 159,
              color: COLORS.green,
              trend: "Ascendente",
            },
            {
              label: "SSA",
              value: "62,5",
              progress: 69,
              color: COLORS.deepBlue,
              trend: "Ascendente",
            },
            {
              label: "TDP",
              value: "24,0h",
              progress: 17,
              color: COLORS.red,
              trend: "Ascendente",
            },
          ],
        },
      ],
      glossary: [
        {
          dot: COLORS.red,
          title: "NPS",
          text: "Net Promoter Score. Mide qué tan dispuestos están los usuarios a recomendar el servicio.",
        },
        {
          dot: "#ff7b7b",
          title: "% Cumplimiento NPS",
          text: "Porcentaje de avance frente a la meta definida para NPS.",
        },
        {
          dot: COLORS.deepBlue,
          title: "SSA",
          text: "Satisfacción del servicio. Refleja el nivel de satisfacción reportado por los usuarios.",
        },
        {
          dot: "#69a8ff",
          title: "% Cumplimiento SSA",
          text: "Porcentaje de avance frente a la meta definida para SSA.",
        },
        { dot: COLORS.green, title: "TEP", text: "Tiempo de Espera Promedio." },
        {
          dot: COLORS.orange,
          title: "TDP",
          text: "Tiempo de Duración Promedio.",
        },
      ],
    },
  },
};

function cn(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ");
}

function getPeriodMeta(periodKey) {
  const [year, monthRaw] = String(periodKey).split("-");
  const monthIndex = Math.max(0, Number(monthRaw || 1) - 1);
  const month = MONTHS_ES[monthIndex] || MONTHS_ES[0];
  return {
    key: periodKey,
    year,
    upper: month.upper,
    title: month.title,
    short: `${month.short}-${String(year).slice(-2)}`,
  };
}

function getHeaderCutLabel(selectedPeriods) {
  if (!selectedPeriods?.length)
    return { top: "CORTE", main: "SIN DATOS", bottom: "----" };
  if (selectedPeriods.length === 1) {
    const meta = getPeriodMeta(selectedPeriods[0]);
    return { top: "CORTE", main: meta.upper, bottom: meta.year };
  }
  return {
    top: "CORTE",
    main: `${selectedPeriods.length} MESES`,
    bottom: selectedPeriods
      .map((item) => getPeriodMeta(item).short)
      .join(" · "),
  };
}

function Button({ className = "", children, ...props }) {
  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
}

type SharedHeaderProps = {
  selectedPeriods: any;
  availablePeriods: any;
  onTogglePeriod: any;
  compareMode: any;
  setCompareMode: any;
};

function Header({
  selectedPeriods,
  availablePeriods,
  onTogglePeriod,
  compareMode,
  setCompareMode,
}) {
  const [open, setOpen] = useState(false);
  const cutLabel = getHeaderCutLabel(selectedPeriods);

  return (
    <div className="header">
      <div className="brand-wrap">
        <div className="brand-icon">
          <img
            src="https://i.imgur.com/A4HGzO6.png"
            alt="ePayco logo"
            className="brand-logo-img"
          />
        </div>
        <div>
          <h1 className="header-title">Resultados Mensuales</h1>
          <p className="header-subtitle">
            Resumen de desempeño por líneas de negocio y operación
          </p>
          {selectedPeriods.length > 1 ? (
            <div className="compare-badges">
              <span style={{ color: "#9a9a9a" }}>Comparando:</span>
              {selectedPeriods.map((period) => (
                <span key={period} className="compare-badge">
                  {getPeriodMeta(period).short}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="cut-box">
        <button
          type="button"
          onDoubleClick={() => setOpen((prev) => !prev)}
          className="cut-button"
        >
          <div className="cut-top">{cutLabel.top}</div>
          <div className="cut-main">{cutLabel.main}</div>
          <div className="cut-bottom">{cutLabel.bottom}</div>
        </button>

        {open ? (
          <div className="cut-panel">
            <div className="cut-panel-head">
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#222" }}>
                  Filtro de periodos
                </div>
                <div style={{ fontSize: 12, color: "#777" }}>
                  Doble clic en CORTE para abrir o cerrar.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cut-close"
              >
                Cerrar
              </button>
            </div>

            <div className="cut-modes">
              <button
                type="button"
                onClick={() => setCompareMode(false)}
                className={cn("cut-mode", !compareMode && "active")}
              >
                1 mes
              </button>
              <button
                type="button"
                onClick={() => setCompareMode(true)}
                className={cn("cut-mode", compareMode && "active")}
              >
                Comparar hasta 3
              </button>
            </div>

            <div className="period-grid">
              {availablePeriods.map((period) => {
                const active = selectedPeriods.includes(period);
                const meta = getPeriodMeta(period);
                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() => onTogglePeriod(period)}
                    className={cn("period-btn", active && "active")}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#999",
                        textTransform: "uppercase",
                      }}
                    >
                      Periodo
                    </div>
                    <div
                      style={{ marginTop: 4, fontSize: 16, fontWeight: 900 }}
                    >
                      {meta.title}
                    </div>
                    <div style={{ fontSize: 13, color: "#666" }}>
                      {meta.year}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="period-note">
              {compareMode
                ? "Modo comparación: puedes seleccionar hasta 3 meses. El mes más reciente actúa como principal para la portada y el resto quedan listos para comparativos."
                : "Modo simple: selecciona un solo mes para que todo el boletín muestre únicamente ese corte."}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function NavBar({ current, setCurrent }) {
  return (
    <div className="sticky-nav">
      <div className="nav-wrap">
        {sections.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrent(item.id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={cn("nav-btn", current === item.id && "active")}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionBand({ title }) {
  return <div className="section-band">{title}</div>;
}

function PageCard({ children }) {
  return <div className="page-card">{children}</div>;
}

function MiniHeaderNote({ title, description }) {
  return (
    <div>
      <div className="section-note-title">{title}</div>
      <div className="section-note-desc">{description}</div>
    </div>
  );
}

function DeltaPill({ text, tone }) {
  return (
    <div
      className={cn(
        "pill",
        tone === "green" && "pill-green",
        tone === "yellow" && "pill-yellow",
        tone === "red" && "pill-red"
      )}
    >
      {text}
    </div>
  );
}

function IncomeCard({ item }) {
  return (
    <div className="income-card hover-card">
      <div className="income-title">{item.title}</div>
      {item.subtitle ? (
        <div className="income-sub">{item.subtitle}</div>
      ) : (
        <div style={{ marginTop: 18 }} />
      )}
      <div className="income-value">{item.value}</div>
      <div className="pill-col">
        <DeltaPill text={item.delta} tone={item.deltaTone} />
        <DeltaPill text={item.meta} tone={item.metaTone} />
      </div>
    </div>
  );
}

function TinyLineChart({ data }) {
  if (!data?.length) return null;

  const values = data.map((item) => Number(item.value || 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(1, max - min);
  const domainMin = Math.floor(min - spread * 0.25);
  const domainMax = Math.ceil(max + spread * 0.35);

  return (
    <div style={{ height: 150, width: "100%", paddingTop: 8 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 22, right: 24, left: 10, bottom: 8 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#ececec"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#666" }}
            axisLine={false}
            tickLine={false}
            padding={{ left: 16, right: 16 }}
          />
          <YAxis
            width={34}
            tick={{ fontSize: 10, fill: "#8a8a8a" }}
            axisLine={false}
            tickLine={false}
            domain={[domainMin, domainMax]}
          />
          <Tooltip
            cursor={{ stroke: "#dcdcdc", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #d9d9d9",
              boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4879ff"
            strokeWidth={2.5}
            activeDot={{
              r: 6,
              fill: "#4879ff",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            dot={{ r: 4, fill: "#4879ff", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function MarginBox({ item }) {
  return (
    <div className="margin-box hover-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <div>
          <h3 className="margin-title">{item.title}</h3>
          <div className="tiny-meta">FEB REAL</div>
          <div className="big-num">{item.real}</div>
        </div>
        <div className="top-right">
          <div
            className={cn(
              "state-pill",
              item.pillTone === "green" ? "state-green" : "state-red"
            )}
          >
            {item.pill}
          </div>
          <div className="tiny-meta">PPTO</div>
          <div className="big-num big-num-muted">{item.ppto}</div>
          <div
            className={
              item.vsTone === "green" ? "state-line-green" : "state-line-red"
            }
          >
            {item.vsText}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 13, color: "#6e6e6e" }}>
        {item.note}
      </div>
      <TinyLineChart data={item.series} />
    </div>
  );
}

function HelperBox({ title, text, tone, icon: Icon }) {
  return (
    <div
      className={cn(
        "helper-box hover-card",
        tone === "green" && "helper-green",
        tone === "yellow" && "helper-yellow",
        tone === "red" && "helper-red"
      )}
    >
      <div className="helper-head">
        <Icon size={18} /> {title}
      </div>
      <div className="helper-text">{text}</div>
    </div>
  );
}

function TableBlock({ rows }) {
  const headers = [
    "Línea incluida",
    "Logrado ene",
    "Meta ene",
    "Cumpl. ene",
    "Logrado feb",
    "Meta feb",
    "Cumpl. feb",
    "Variación feb vs ene",
  ];

  const getComplianceTone = (val) => {
    const n = parseFloat(String(val).replace("%", ""));
    if (Number.isNaN(n)) return "gray";
    if (n >= 100) return "green";
    if (n >= 85) return "yellow";
    return "red";
  };

  const getVariationTone = (val) => {
    const n = parseFloat(String(val).replace("%", ""));
    if (Number.isNaN(n)) return "gray";
    if (n > 0) return "green";
    if (n < 0) return "red";
    return "gray";
  };

  const formatVariation = (val) => {
    const raw = String(val).trim().replace("%", "");
    const n = Number(raw);
    if (Number.isNaN(n)) return val;
    const scaled = n / 10;
    const text = scaled.toLocaleString("es-CO", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    if (scaled > 0) return `+${text}%`;
    if (scaled < 0) return `${text}%`;
    return "0,0%";
  };

  return (
    <div className="data-table-wrap">
      <div className="data-table-scroll">
        <table className="data-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              {headers.map((head) => (
                <th key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {row.map((cell, cidx) => {
                  if (cidx === 0)
                    return (
                      <td key={cidx}>
                        <span className="table-line-name">{cell}</span>
                      </td>
                    );
                  if (cidx === 3 || cidx === 6) {
                    const tone = getComplianceTone(cell);
                    return (
                      <td key={cidx}>
                        <span className={cn("table-pill", tone)}>
                          {cell.replace(".", ",")}
                        </span>
                      </td>
                    );
                  }
                  if (cidx === 7) {
                    const tone = getVariationTone(cell);
                    return (
                      <td key={cidx}>
                        <span className={cn("table-pill", tone)}>
                          {formatVariation(cell)}
                        </span>
                      </td>
                    );
                  }
                  return <td key={cidx}>{cell}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MonthActivationCard({ item }) {
  return (
    <div className="month-card hover-card">
      <div className="month-card-head">
        <div>
          <div className="month-small">MES</div>
          <div className="month-title">{item.label}</div>
        </div>
        <div className="fact-pill">{item.fact}</div>
      </div>
      <div className="activation-title">% Activación</div>
      <div className="activation-value">{item.activacion}</div>
      <div className="stats-row">
        <div>
          <div className="stats-label">Registros</div>
          <div className="stats-value">{item.registros}</div>
        </div>
        <div>
          <div className="stats-label">Vinc.</div>
          <div className="stats-value">{item.vinc}</div>
        </div>
        <div>
          <div className="stats-label">Ccios Fact</div>
          <div className="stats-value">{item.ccios}</div>
        </div>
      </div>
    </div>
  );
}

function SmallRedTable({ title, rows }) {
  return (
    <div className="mini-table-wrap">
      <table className="mini-table" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>{title}</th>
            <th>Ene-26</th>
            <th>Feb-26</th>
            <th>Mar-26</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KPICompareCard({ item }) {
  const green = item.tone === "green";
  return (
    <div className="kpi-compare-card hover-card">
      <div className="kpi-top-label">Indicador</div>
      <div className="kpi-top-title">{item.title}</div>
      <div className={green ? "kpi-real-box-green" : "kpi-real-box-red"}>
        <div className="kpi-sub-label">Real Feb-26</div>
        <div className={green ? "kpi-real-green" : "kpi-real-red"}>
          {item.real}
        </div>
      </div>
      <div className="kpi-grid-2">
        <div className="kpi-small-box">
          <div className="kpi-sub-label">Meta Feb-26</div>
          <div className="kpi-small-value">{item.meta}</div>
        </div>
        <div className="kpi-small-box">
          <div className="kpi-sub-label">Cumplimiento Feb 26</div>
          <div className={green ? "kpi-success" : "kpi-danger"}>
            {item.cumplimiento}
          </div>
        </div>
      </div>
      <div className="kpi-grid-2">
        <div className="kpi-small-box-alt">
          <div className="kpi-sub-label">Real Ene-26</div>
          <div className="kpi-small-value">{item.realPrev}</div>
        </div>
        <div className="kpi-small-box-alt">
          <div className="kpi-sub-label">Meta Ene-26</div>
          <div className="kpi-small-value">{item.metaPrev}</div>
        </div>
      </div>
    </div>
  );
}

function ChartPointDot({
  cx,
  cy,
  payload,
  value,
  color,
  showRate = false,
}: {
  cx?: number;
  cy?: number;
  payload?: { rate?: string };
  value?: number | string;
  color: string;
  showRate?: boolean;
}) {
  if (typeof cx !== "number" || typeof cy !== "number") return null;
  return (
    <g style={{ pointerEvents: "none" }}>
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill={color}
        stroke="#ffffff"
        strokeWidth={3}
      />
      <text
        x={cx}
        y={cy - 22}
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#1b1b1b"
      >
        {Number(value).toLocaleString("es-CO")}
      </text>
      {showRate && payload?.rate ? (
        <g transform={`translate(${cx - 40}, ${cy + 14})`}>
          <rect width="80" height="36" rx="9" fill="#ffffff" stroke="#d6d6d6" />
          <text
            x="40"
            y="23"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="#777777"
          >
            {payload.rate}
          </text>
        </g>
      ) : null}
    </g>
  );
}

function ChurnLine({ title, color, data, showRate = false }) {
  if (!data?.length) return null;

  const values = data.map((item) => Number(item.value || 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(1, max - min);
  const domainMin = Math.max(
    0,
    Math.floor(min - spread * (showRate ? 0.4 : 0.3))
  );
  const domainMax = Math.ceil(max + spread * (showRate ? 0.65 : 0.45));

  return (
    <div className="chart-panel hover-card">
      <div className="chart-title-inline">
        <span className="chart-dot-inline" style={{ background: color }} />
        {title}
      </div>
      <div style={{ height: 270 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 38, right: 34, left: 22, bottom: 20 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#c8c8c8"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 16, fill: "#333" }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 28, right: 28 }}
            />
            <YAxis
              width={58}
              tick={{ fontSize: 14, fill: "#333" }}
              axisLine={false}
              tickLine={false}
              domain={[domainMin, domainMax]}
            />
            <Tooltip
              cursor={{ stroke: "#d8d8d8", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #d9d9d9",
                boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={5}
              activeDot={{ r: 9, fill: color, stroke: "#fff", strokeWidth: 3 }}
              dot={(props) => (
                <ChartPointDot {...props} color={color} showRate={showRate} />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChurnCard({ title, dataset, topColor, bottomColor }) {
  if (!dataset?.activos?.length && !dataset?.churn?.length) {
    return (
      <PageCard>
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#000",
            marginBottom: 24,
          }}
        >
          {title}
        </div>
        <div style={{ color: "#666" }}>
          No hay información disponible para este periodo.
        </div>
      </PageCard>
    );
  }

  return (
    <PageCard>
      <div
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: "#000",
          marginBottom: 24,
        }}
      >
        {title}
      </div>
      <div className="churn-card-inner">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <ChurnLine
            title="Clientes activos"
            color={topColor}
            data={dataset.activos}
          />
          <div style={{ height: 1, background: "#ececec" }} />
          <ChurnLine
            title="Churn clientes"
            color={bottomColor}
            data={dataset.churn}
            showRate
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 20,
            padding: "0 8px",
          }}
        >
          <div className="metric-side-box hover-card">
            <div className="metric-side-label">
              Promedio de clientes activos
            </div>
            <div className="metric-side-value">{dataset.promedioActivos}</div>
          </div>
          <div className="metric-side-chip">
            <div className="top">Tasa % mes</div>
            <div className="bottom">{dataset.tasaMes}</div>
          </div>
          <div className="metric-side-box hover-card">
            <div className="metric-side-label">Promedio de Churn clientes</div>
            <div className="metric-side-value">{dataset.promedioChurn}</div>
            <div className="metric-side-legend">
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  background: "#7a7a7a",
                }}
              />{" "}
              Tasa de porcentaje Churn
            </div>
          </div>
        </div>
      </div>
    </PageCard>
  );
}

function PortfolioBlock({ data }) {
  if (!data?.pie?.length)
    return (
      <div style={{ color: "#666" }}>
        No hay información disponible para este periodo.
      </div>
    );

  return (
    <div className="portfolio-shell">
      <div className="portfolio-chart-card">
        <div style={{ height: 460 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.pie}
                cx="50%"
                cy="50%"
                innerRadius={110}
                outerRadius={200}
                dataKey="value"
                label={({ name, value }) => `${name}\n${value}%`}
              >
                {data.pie.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.values.map(([name, value]) => (
          <div key={name} className="portfolio-value-card hover-card">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div className="portfolio-value-title">{name}</div>
                <div className="portfolio-value-sub"># TRX feb-26</div>
              </div>
              <div className="portfolio-value-num">{value}</div>
            </div>
          </div>
        ))}
        <div className="portfolio-total hover-card">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div className="portfolio-value-title">Total</div>
              <div className="portfolio-value-sub"># TRX feb-26</div>
            </div>
            <div className="portfolio-total-pill">{data.total}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaCard({ item }) {
  return (
    <div className="nps-meta-card hover-card">
      <div className="nps-meta-bar" style={{ background: item.color }} />
      <div className="nps-meta-title">{item.title}</div>
      <div className="nps-meta-value">{item.value}</div>
    </div>
  );
}

function Progress({ value, color }) {
  const width = Math.min(value, 100);
  return (
    <div className="progress-row">
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
      <div className="progress-value">{value}%</div>
    </div>
  );
}

function ServiceMetricCard({ metric }) {
  const trendClass =
    metric.trend === "Descendente" ? "trend-chip-down" : "trend-chip-up";
  return (
    <div className="service-metric hover-card">
      <div className="service-metric-head">
        <div>
          <div className="service-metric-label">{metric.label}</div>
          <div className="service-metric-value">{metric.value}</div>
        </div>
        <div className={trendClass}>{metric.trend}</div>
      </div>
      <Progress value={metric.progress} color={metric.color} />
    </div>
  );
}

function MonthServiceColumn({ month }) {
  return (
    <div className="month-service-col hover-card">
      <div className="month-service-head">
        <div>
          <div style={{ fontSize: 16, color: "#999" }}>Mes</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#000" }}>
            {month.month}
          </div>
        </div>
        <div className="month-service-code">{month.code}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: 16,
        }}
      >
        {month.metrics.map((metric) => (
          <ServiceMetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="insight-box" style={{ marginTop: 16 }}>
        <div className="insight-title">Insight</div>
        <div className="insight-text">{month.insight}</div>
      </div>
    </div>
  );
}

function GlossaryCard({ item }) {
  return (
    <div className="glossary-card hover-card">
      <div className="glossary-head">
        <span className="glossary-dot" style={{ background: item.dot }} />
        <div className="glossary-title">{item.title}</div>
      </div>
      <div className="glossary-text">{item.text}</div>
    </div>
  );
}

function InicioPage({ go }) {
  return (
    <div className="app-shell">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-logo">
            <img
              src="https://i.imgur.com/lycMb1G.png"
              alt="logo epayco"
              style={{ height: 90, objectFit: "contain" }}
            />
          </div>
          <div className="hero-title-1">Boletín de</div>
          <div className="hero-title-2">resultados mensuales</div>
          <button className="hero-cta" onClick={() => go("ingresos")}>
            Empezar
          </button>
          <div className="hero-footer">Designed by Team Marketing</div>
        </div>

        <div className="hero-right">
          <img
            src="https://i.imgur.com/CAVEwIo.jpeg"
            alt="preview"
            style={{
              width: "100%",
              maxWidth: 620,
              borderRadius: 24,
              boxShadow: "0 20px 60px rgba(0,0,0,.12)",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function IngresosPage({
  data,
  ...sharedHeaderProps
}: { data: any } & SharedHeaderProps) {
  const hasData = Boolean(data.ingresos?.cards?.length);

  return (
    <div className="app-shell">
      <div
        className="container"
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        <Header {...sharedHeaderProps} />
        <SectionBand title="Ingresos del mes" />
        {hasData ? (
          <>
            <div className="grid-4">
              {data.ingresos.cards.map((item) => (
                <IncomeCard key={item.title} item={item} />
              ))}
            </div>
            <SectionBand title="Márgenes" />
            <PageCard>
              <div className="summary-box hover-card">
                <div className="summary-label">Ingreso total</div>
                <div className="summary-value">
                  {data.ingresos.summary.total}
                </div>
                <div className="summary-row">
                  <div className="summary-pill">
                    {data.ingresos.summary.delta}
                  </div>
                  <div className="summary-midline" />
                  <div className="summary-pill">
                    {data.ingresos.summary.cumplimiento}
                  </div>
                </div>
                <div className="summary-foot">
                  <div>
                    <div className="summary-label">ENE</div>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>
                      {data.ingresos.summary.ene}
                    </div>
                  </div>
                  <div>
                    <div className="summary-label">PPTO</div>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>
                      {data.ingresos.summary.ppto}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-3" style={{ marginTop: 16 }}>
                {data.ingresos.margins.map((item) => (
                  <MarginBox key={item.title} item={item} />
                ))}
              </div>
              <div className="grid-3" style={{ marginTop: 16 }}>
                <HelperBox
                  title="Qué incluye esta sección"
                  text="Ingresos ordinarios como referencia principal del negocio. Agregador, Gateway, Recaudo, Suscripciones, Control, Paypal, Shops y Payouts."
                  tone="green"
                  icon={CheckCircle2}
                />
                <HelperBox
                  title="Cómo leer la meta"
                  text="Meta = presupuesto del mes. Logrado = valor real registrado en el mes. Cumplimiento = logrado dividido por meta."
                  tone="yellow"
                  icon={Gauge}
                />
                <HelperBox
                  title="Lectura simple del mes"
                  text="Gateway supera su meta y Agregador queda cerca. Otras líneas mejoran, pero algunas permanecen por debajo del presupuesto esperado."
                  tone="red"
                  icon={AlertTriangle}
                />
              </div>
            </PageCard>
            <PageCard>
              <TableBlock rows={data.ingresos.table} />
              <div className="grid-3" style={{ marginTop: 20 }}>
                <HelperBox
                  title="Qué leer en verde"
                  text="La píldora verde en cada tarjeta indica la variación de febrero frente a enero. Gateway es el principal impulsor del crecimiento mensual (+40,2%). El ingreso total sube +19,2% y supera presupuesto consolidado (+4,9%)."
                  tone="green"
                  icon={CheckCircle2}
                />
                <HelperBox
                  title="Cumplimiento vs presupuesto"
                  text="Negro = meta presupuestada del mes (PPTO). La píldora de cumplimiento compara real de febrero contra la meta. Verde: cumple o supera, naranja: cerca, rojo: por debajo."
                  tone="yellow"
                  icon={Gauge}
                />
                <HelperBox
                  title="Alertas de depuración"
                  text="Se toma ingresos ordinarios como referencia principal y no servicios ePayco. Se excluye desarrollo de software del bloque operativo mostrado. Los valores fueron normalizados para miles y decimales antes de graficar."
                  tone="red"
                  icon={AlertTriangle}
                />
              </div>
            </PageCard>
          </>
        ) : (
          <PageCard>
            <div style={{ color: "#666" }}>
              No hay información disponible para este periodo.
            </div>
          </PageCard>
        )}
      </div>
    </div>
  );
}

function VinculacionPage({
  data,
  ...sharedHeaderProps
}: { data: any } & SharedHeaderProps) {
  const hasData = Boolean(data.vinculacion?.months?.length);

  return (
    <div className="app-shell">
      <div
        className="container"
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        <Header {...sharedHeaderProps} />
        <SectionBand title="Comportamiento de vinculación y facturación" />
        {hasData ? (
          <>
            <PageCard>
              <MiniHeaderNote
                title="Funnel ePayco"
                description="Lectura mensual compacta con foco en facturación, activación y volumen comercial."
              />
              <div className="soft-alert" style={{ marginTop: 16 }}>
                <b>% de activación:</b> corresponde al porcentaje de comercios
                que realizaron facturación en el periodo.
              </div>
              <div className="grid-3" style={{ marginTop: 16 }}>
                {data.vinculacion.months.map((item) => (
                  <MonthActivationCard key={item.label} item={item} />
                ))}
              </div>
              <div className="grid-2" style={{ marginTop: 16 }}>
                <SmallRedTable
                  title="Agregador"
                  rows={data.vinculacion.agregador}
                />
                <SmallRedTable
                  title="Gateway"
                  rows={data.vinculacion.gateway}
                />
              </div>
            </PageCard>
            <SectionBand title="KPIs" />
            <PageCard>
              <MiniHeaderNote
                title="KPIs Agregador"
                description="Comparación compacta por indicador, con bloques visuales separados para supuesto, real y cumplimiento."
              />
              <div className="grid-4" style={{ marginTop: 16 }}>
                {data.vinculacion.kpiAgregador.map((item) => (
                  <KPICompareCard key={item.title} item={item} />
                ))}
              </div>
            </PageCard>
            <PageCard>
              <MiniHeaderNote
                title="KPIs Gateway"
                description="Comparación compacta por indicador, con bloques visuales separados para supuesto, real y cumplimiento."
              />
              <div className="grid-3" style={{ marginTop: 16 }}>
                {data.vinculacion.kpiGateway.map((item) => (
                  <KPICompareCard key={item.title} item={item} />
                ))}
              </div>
            </PageCard>
            <SectionBand title="Transaccionales" />
            <PageCard>
              <MiniHeaderNote
                title="Participación TRX por negociación"
                description="Distribución de la transaccionalidad Gateway por en el portafolio de negociaciones actuales ePayco."
              />
              <div style={{ marginTop: 16 }}>
                <PortfolioBlock data={data.transaccionales} />
              </div>
            </PageCard>
          </>
        ) : (
          <PageCard>
            <div style={{ color: "#666" }}>
              No hay información disponible para este periodo.
            </div>
          </PageCard>
        )}
      </div>
    </div>
  );
}

function TransaccionalesPage({
  data,
  ...sharedHeaderProps
}: { data: any } & SharedHeaderProps) {
  return (
    <div className="app-shell">
      <div
        className="container"
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        <Header {...sharedHeaderProps} />
        <SectionBand title="Churn de clientes" />
        <PageCard>
          <div style={{ fontSize: 16, lineHeight: 1.8, color: "#444" }}>
            El análisis de churn de clientes se realiza en una ventana de tiempo
            1 - 3 meses, es decir que considera abandono a los comercios que
            llevan 3 meses sin transa.
          </div>
        </PageCard>
        <ChurnCard
          title="Agregador"
          dataset={data.transaccionales.churnAgregador}
          topColor={COLORS.blue}
          bottomColor={COLORS.red}
        />
        <ChurnCard
          title="Gateway"
          dataset={data.transaccionales.churnGateway}
          topColor={COLORS.red}
          bottomColor={COLORS.red}
        />
      </div>
    </div>
  );
}

function NpsPage({
  data,
  ...sharedHeaderProps
}: { data: any } & SharedHeaderProps) {
  return (
    <div className="app-shell">
      <div
        className="container"
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        <Header {...sharedHeaderProps} />
        <SectionBand title="NPS" />
        <PageCard>
          <MiniHeaderNote
            title="Indicadores de servicio y cumplimiento"
            description="Metas base, lectura mensual, significados y tendencia de cumplimiento para NPS, SSA, TEP y TDP"
          />
          <div className="grid-4" style={{ marginTop: 16 }}>
            {data.nps.metas.map((item) => (
              <MetaCard key={item.title} item={item} />
            ))}
          </div>
          <div className="grid-3" style={{ marginTop: 16 }}>
            {data.nps.months.map((month) => (
              <MonthServiceColumn key={month.month} month={month} />
            ))}
          </div>
          <div className="grid-2" style={{ marginTop: 16 }}>
            {data.nps.glossary.map((item) => (
              <GlossaryCard key={item.title} item={item} />
            ))}
          </div>
        </PageCard>
      </div>
    </div>
  );
}

function AppNotice({ title, message }) {
  return (
    <div className="app-shell">
      <style>{styles}</style>
      <div className="container" style={{ paddingTop: 64 }}>
        <PageCard>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#111" }}>
            {title}
          </div>
          <div
            style={{
              marginTop: 12,
              maxWidth: 760,
              fontSize: 16,
              lineHeight: 1.7,
              color: "#555",
            }}
          >
            {message}
          </div>
        </PageCard>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("ingresos");
  const [compareMode, setCompareMode] = useState(false);
  const [externalDataByPeriod, setExternalDataByPeriod] = useState<any>(null);
  const activeDataByPeriod =
    externalDataByPeriod && Object.keys(externalDataByPeriod).length
      ? externalDataByPeriod
      : dataByPeriod;
  const availablePeriods = useMemo(
    () => Object.keys(activeDataByPeriod).sort(),
    [activeDataByPeriod]
  );
  const defaultPeriod = useMemo(() => {
    if (availablePeriods.includes("2026-02")) return "2026-02";
    if (availablePeriods.length) return availablePeriods[availablePeriods.length - 1];
    return undefined;
  }, [availablePeriods]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>(
    defaultPeriod ? [defaultPeriod] : []
  );

  useEffect(() => {
    let cancelled = false;

    async function loadExternalData() {
      try {
        const response = await fetch(DATA_URL, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`No se pudo cargar ${DATA_URL} (${response.status}).`);
        }

        const nextData = await response.json();
        if (!cancelled && nextData && Object.keys(nextData).length) {
          setExternalDataByPeriod(nextData);
        }
      } catch (error) {
        console.warn("No se pudieron cargar los datos externos del boletin.", error);
      }
    }

    loadExternalData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSelectedPeriods((prev) => {
      const valid = prev.filter((item) => availablePeriods.includes(item));
      if (valid.length) return valid;
      return defaultPeriod ? [defaultPeriod] : [];
    });
  }, [availablePeriods, defaultPeriod]);

  const primaryPeriod = useMemo(() => {
    if (!selectedPeriods.length)
      return availablePeriods[availablePeriods.length - 1];
    return [...selectedPeriods].sort().slice(-1)[0];
  }, [selectedPeriods, availablePeriods]);

  const data = useMemo(
    () => (primaryPeriod ? activeDataByPeriod[primaryPeriod] : undefined),
    [activeDataByPeriod, primaryPeriod]
  );

  const togglePeriod = (period) => {
    if (!availablePeriods.includes(period)) return;
    setSelectedPeriods((prev) => {
      if (!compareMode) return [period];
      const exists = prev.includes(period);
      if (exists) {
        const next = prev.filter((item) => item !== period);
        return next.length ? next.sort() : [period];
      }
      const next = [...prev, period].sort();
      return next.slice(-3);
    });
  };

  const sharedHeaderProps = {
    selectedPeriods,
    availablePeriods,
    onTogglePeriod: togglePeriod,
    compareMode,
    setCompareMode,
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (!availablePeriods.length) {
    return (
      <AppNotice
        title="No hay periodos cargados"
        message="El sitio no encontró información disponible para renderizar el boletín. Revisa el archivo public/data/boletin-data.json o carga el archivo de Excel/CSV en la carpeta data para regenerarlo."
      />
    );
  }

  if (!data) {
    return (
      <AppNotice
        title="El periodo seleccionado no existe"
        message="La fuente de datos cambió y el periodo activo dejó de estar disponible. Recarga la página o selecciona un periodo válido después de actualizar el archivo del boletín."
      />
    );
  }

  return (
    <>
      <style>{styles}</style>
      {currentPage !== "inicio" && (
        <NavBar current={currentPage} setCurrent={setCurrentPage} />
      )}

      {currentPage === "inicio" && <InicioPage go={setCurrentPage} />}
      {currentPage === "ingresos" && (
        <IngresosPage data={data} {...sharedHeaderProps} />
      )}
      {currentPage === "vinculacion" && (
        <VinculacionPage data={data} {...sharedHeaderProps} />
      )}
      {currentPage === "transaccionales" && (
        <TransaccionalesPage data={data} {...sharedHeaderProps} />
      )}
      {currentPage === "nps" && <NpsPage data={data} {...sharedHeaderProps} />}

      {currentPage !== "inicio" && (
        <div className="next-wrap">
          <Button
            className="next-btn"
            onClick={() => {
              const order = [
                "ingresos",
                "vinculacion",
                "transaccionales",
                "nps",
              ];
              const idx = order.indexOf(currentPage);
              if (idx >= 0 && idx < order.length - 1) {
                setCurrentPage(order[idx + 1]);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            Siguiente sección
            <ArrowRight size={18} />
          </Button>
        </div>
      )}
    </>
  );
}
