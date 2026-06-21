// Step 2: fixed data version
// Source: Asset simulator.xlsx / Assets, Settings, Scenario
// Next step: replace these constants with Google Sheets CSV loading.

const assets = [
  {
    asset_id: "ACWI",
    asset_name: "emaxis slim all country",
    asset_class: "global_equity",
    asset_type: "mutual_fund",
    value_currency: "JPY",
    exposure_currency: "USD",
    current_value: 550000,
    current_principal: 550000,
    expected_return_annual: 5,
    target_weight: 0.7,
    monthly_contribution: 110000,
    include: true
  },
  {
    asset_id: "SP500",
    asset_name: "emaxis slim sp500",
    asset_class: "us_equity",
    asset_type: "mutual_fund",
    value_currency: "JPY",
    exposure_currency: "USD",
    current_value: 500000,
    current_principal: 360000,
    expected_return_annual: 5,
    target_weight: 0.1,
    monthly_contribution: 20000,
    include: true
  },
  {
    asset_id: "GOLD",
    asset_name: "sbi ishares gold",
    asset_class: "gold",
    asset_type: "mutual_fund",
    value_currency: "JPY",
    exposure_currency: "USD",
    current_value: 130000,
    current_principal: 130000,
    expected_return_annual: 2.5,
    target_weight: 0.05,
    monthly_contribution: 20000,
    include: true
  },
  {
    asset_id: "NIKKEI225",
    asset_name: "emaxis slim NIKKEI225",
    asset_class: "JP_equity",
    asset_type: "mutual_fund",
    value_currency: "JPY",
    exposure_currency: "JPY",
    current_value: 10000,
    current_principal: 10000,
    expected_return_annual: 5,
    target_weight: 0.1,
    monthly_contribution: 20000,
    include: true
  },
  {
    asset_id: "CASH",
    asset_name: "crash reserve",
    asset_class: "cash",
    asset_type: "cash",
    value_currency: "JPY",
    exposure_currency: "JPY",
    current_value: 500000,
    current_principal: 500000,
    expected_return_annual: 0,
    target_weight: 0.05,
    monthly_contribution: 0,
    include: true
  },
  {
    asset_id: "DC",
    asset_name: "企業DC・全世界株式",
    asset_class: "global_equity",
    asset_type: "mutual_fund",
    value_currency: "JPY",
    exposure_currency: "USD",
    current_value: 300000,
    current_principal: 250000,
    expected_return_annual: 5,
    target_weight: 0,
    monthly_contribution: 30000,
    include: true
  },
  {
    asset_id: "DAIKIN",
    asset_name: "DAIKIN",
    asset_class: "JP_equity",
    asset_type: "stock",
    value_currency: "JPY",
    exposure_currency: "JPY",
    current_value: 155000,
    current_principal: 125500,
    expected_return_annual: 4,
    target_weight: 0,
    monthly_contribution: 30000,
    include: true
  },
  {
    asset_id: "MUFG",
    asset_name: "MUFG",
    asset_class: "JP_equity",
    asset_type: "stock",
    value_currency: "JPY",
    exposure_currency: "JPY",
    current_value: 260000,
    current_principal: 165000,
    expected_return_annual: 4,
    target_weight: 0,
    monthly_contribution: 0,
    include: true
  },
  {
    asset_id: "tripla",
    asset_name: "tripla",
    asset_class: "JP_equity",
    asset_type: "stock",
    value_currency: "JPY",
    exposure_currency: "JPY",
    current_value: 169000,
    current_principal: 175000,
    expected_return_annual: 4,
    target_weight: 0,
    monthly_contribution: 0,
    include: true
  },
  {
    asset_id: "NTT",
    asset_name: "NTT",
    asset_class: "JP_equity",
    asset_type: "stock",
    value_currency: "JPY",
    exposure_currency: "JPY",
    current_value: 14400,
    current_principal: 15200,
    expected_return_annual: 4,
    target_weight: 0,
    monthly_contribution: 0,
    include: true
  },
  {
    asset_id: "SPCX",
    asset_name: "SpaceX",
    asset_class: "us_equity",
    asset_type: "stock",
    value_currency: "JPY",
    exposure_currency: "USD",
    current_value: 29800,
    current_principal: 26400,
    expected_return_annual: 4,
    target_weight: 0,
    monthly_contribution: 0,
    include: true
  }
];

const settings = {
  start_date: "2026-07-01",
  simulation_years: 50,
  monthly_total_contribution: 230000,
  default_expected_return: 3,
  snapshot_month: 60,
  contribution_timing: "beginning",
  display_interval: "yearly"
};

const scenarios = [
  {
    scenario_id: "base",
    scenario_name: "基本シナリオ",
    expected_return_adjustment: 0,
    crash_month: null,
    crash_rate: null,
    recovery_months: null,
    include: true
  },
  {
    scenario_id: "low_return",
    scenario_name: "低利回りシナリオ",
    expected_return_adjustment: -2,
    crash_month: null,
    crash_rate: null,
    recovery_months: null,
    include: true
  },
  {
    scenario_id: "high_return",
    scenario_name: "高利回りシナリオ",
    expected_return_adjustment: 2,
    crash_month: null,
    crash_rate: null,
    recovery_months: null,
    include: true
  },
  {
    scenario_id: "bear_market",
    scenario_name: "暴落シナリオ",
    expected_return_adjustment: 0,
    crash_month: 24,
    crash_rate: -30,
    recovery_months: 36,
    include: true
  }
];

const labelMap = {
  global_equity: "全世界株式",
  us_equity: "米国株式",
  JP_equity: "日本株式",
  japan_equity: "日本株式",
  gold: "ゴールド",
  cash: "現金",
  mutual_fund: "投資信託",
  stock: "個別株",
  JPY: "JPY",
  USD: "USD"
};

let assetTrendChart;
let portfolioPieChart;
let latestResults = [];

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0
});

const compactYenFormatter = new Intl.NumberFormat("ja-JP", {
  notation: "compact",
  maximumFractionDigits: 1
});

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function formatYen(value) {
  return yenFormatter.format(Math.round(value));
}

function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function formatYearMonth(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getSnapshotText(month) {
  if (month === 0) return "現在";
  if (month % 12 === 0) return `${month / 12}年後`;
  return `${month}か月後`;
}

function getMonthlyContribution(asset, settings) {
  const direct = toNumber(asset.monthly_contribution, 0);
  if (direct !== 0) return direct;

  // monthly_contributionが空欄の場合だけ、target_weightから補完するための保険。
  const targetWeight = toNumber(asset.target_weight, 0);
  return toNumber(settings.monthly_total_contribution, 0) * targetWeight;
}

function getMonthlyRate(asset, scenario, settings) {
  const baseAnnualReturn = toNumber(
    asset.expected_return_annual,
    toNumber(settings.default_expected_return, 0)
  );
  const adjustedAnnualReturn = Math.max(
    -99,
    baseAnnualReturn + toNumber(scenario.expected_return_adjustment, 0)
  );
  return Math.pow(1 + adjustedAnnualReturn / 100, 1 / 12) - 1;
}

function simulatePortfolio(assets, settings, scenario) {
  const months = toNumber(settings.simulation_years, 30) * 12;
  const startDate = new Date(settings.start_date);
  const includedAssets = assets.filter(asset => asset.include === true || asset.include === "TRUE");

  let current = includedAssets.map(asset => ({
    ...asset,
    value: toNumber(asset.current_value, 0),
    principal: toNumber(asset.current_principal, 0),
    monthlyContribution: getMonthlyContribution(asset, settings)
  }));

  const rows = [];

  for (let month = 0; month <= months; month += 1) {
    const date = addMonths(startDate, month);

    for (const asset of current) {
      rows.push({
        month,
        date,
        dateLabel: formatYearMonth(date),
        asset_id: asset.asset_id,
        asset_name: asset.asset_name,
        asset_class: asset.asset_class,
        asset_type: asset.asset_type,
        value_currency: asset.value_currency,
        exposure_currency: asset.exposure_currency,
        principal: asset.principal,
        value: asset.value,
        contribution: month === 0 ? 0 : asset.monthlyContribution
      });
    }

    if (month === months) break;

    current = current.map(asset => {
      const monthlyRate = getMonthlyRate(asset, scenario, settings);
      const contribution = asset.monthlyContribution;
      const isBeginning = settings.contribution_timing === "beginning";

      let nextPrincipal;
      let nextValue;

      if (isBeginning) {
        nextPrincipal = asset.principal + contribution;
        nextValue = (asset.value + contribution) * (1 + monthlyRate);
      } else {
        nextPrincipal = asset.principal + contribution;
        nextValue = asset.value * (1 + monthlyRate) + contribution;
      }

      const crashMonth = scenario.crash_month === null ? null : toNumber(scenario.crash_month, null);
      const crashRate = scenario.crash_rate === null ? null : toNumber(scenario.crash_rate, null);
      const isCrashTarget = asset.asset_class !== "cash" && asset.asset_type !== "cash";

      if (crashMonth !== null && crashRate !== null && month + 1 === crashMonth && isCrashTarget) {
        nextValue *= 1 + crashRate / 100;
      }

      return {
        ...asset,
        principal: nextPrincipal,
        value: Math.max(0, nextValue)
      };
    });
  }

  return rows;
}

function groupByMonth(rows) {
  const byMonth = new Map();

  for (const row of rows) {
    if (!byMonth.has(row.month)) {
      byMonth.set(row.month, {
        month: row.month,
        dateLabel: row.dateLabel,
        principal: 0,
        value: 0
      });
    }

    const item = byMonth.get(row.month);
    item.principal += row.principal;
    item.value += row.value;
  }

  return Array.from(byMonth.values()).map(item => ({
    ...item,
    profit: item.value - item.principal,
    profitRate: item.principal === 0 ? 0 : (item.value - item.principal) / item.principal * 100
  }));
}

function groupSnapshot(rows, selectedMonth, key) {
  const targetRows = rows.filter(row => row.month === selectedMonth);
  const grouped = new Map();

  for (const row of targetRows) {
    const rawLabel = row[key] || "unknown";
    const label = labelMap[rawLabel] || rawLabel;

    if (!grouped.has(label)) grouped.set(label, 0);
    grouped.set(label, grouped.get(label) + row.value);
  }

  return Array.from(grouped.entries())
    .map(([label, value]) => ({ label, value }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);
}

function getYearlyTrendData(monthlyTotals) {
  return monthlyTotals.filter(item => item.month % 12 === 0);
}

function updateSummaryCards(monthlyTotals, selectedMonth) {
  const current = monthlyTotals.find(item => item.month === 0);
  const snapshot = monthlyTotals.find(item => item.month === selectedMonth) || monthlyTotals[0];
  const totalMonthlyContribution = assets
    .filter(asset => asset.include === true || asset.include === "TRUE")
    .reduce((sum, asset) => sum + getMonthlyContribution(asset, settings), 0);

  document.getElementById("currentValue").textContent = formatYen(current.value);
  document.getElementById("monthlyContribution").textContent = formatYen(totalMonthlyContribution);
  document.getElementById("snapshotValue").textContent = formatYen(snapshot.value);
  document.getElementById("snapshotProfit").textContent = formatYen(snapshot.profit);
}

function updateSummaryTable(monthlyTotals) {
  const checkpoints = [0, 12, 36, 60, 120, 240, 360, 600];
  const tbody = document.getElementById("summaryTableBody");
  tbody.innerHTML = "";

  for (const month of checkpoints) {
    const item = monthlyTotals.find(row => row.month === month);
    if (!item) continue;

    const tr = document.createElement("tr");
    const values = [
      getSnapshotText(month),
      formatYen(item.principal),
      formatYen(item.value),
      formatYen(item.profit),
      formatPercent(item.profitRate)
    ];

    for (const value of values) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
}

function renderTrendChart(yearlyData) {
  const ctx = document.getElementById("assetTrendChart");

  if (assetTrendChart) assetTrendChart.destroy();

  assetTrendChart = new Chart(ctx, {
    data: {
      labels: yearlyData.map(item => item.month === 0 ? "現在" : `${item.month / 12}年後`),
      datasets: [
        {
          type: "bar",
          label: "評価額",
          data: yearlyData.map(item => Math.round(item.value)),
          borderWidth: 0,
          borderRadius: 8
        },
        {
          type: "line",
          label: "元本",
          data: yearlyData.map(item => Math.round(item.principal)),
          tension: 0.25,
          pointRadius: 2,
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${formatYen(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12
          }
        },
        y: {
          ticks: {
            callback(value) {
              return `¥${compactYenFormatter.format(value)}`;
            }
          }
        }
      }
    }
  });
}

function renderPieChart(snapshotData, selectedMonth, mode) {
  const ctx = document.getElementById("portfolioPieChart");

  if (portfolioPieChart) portfolioPieChart.destroy();

  portfolioPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: snapshotData.map(item => item.label),
      datasets: [
        {
          label: "評価額",
          data: snapshotData.map(item => Math.round(item.value)),
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label(context) {
              const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
              const value = context.parsed;
              const share = total === 0 ? 0 : value / total * 100;
              return `${context.label}: ${formatYen(value)} (${share.toFixed(1)}%)`;
            }
          }
        }
      }
    }
  });

  const modeLabel = {
    asset_class: "資産クラス別",
    asset_name: "銘柄別",
    exposure_currency: "実質通貨別",
    asset_type: "商品タイプ別"
  }[mode];

  document.getElementById("pieDescription").textContent = `${getSnapshotText(selectedMonth)}の${modeLabel}比率です。`;
}

function updateSnapshotLabels(selectedMonth) {
  const snapshotDate = addMonths(new Date(settings.start_date), selectedMonth);
  document.getElementById("snapshotLabel").textContent = getSnapshotText(selectedMonth);
  document.getElementById("snapshotDateLabel").textContent = formatYearMonth(snapshotDate);
}

function updateDashboard() {
  const scenarioId = document.getElementById("scenarioSelect").value;
  const scenario = scenarios.find(item => item.scenario_id === scenarioId) || scenarios[0];
  const selectedMonth = toNumber(document.getElementById("snapshotRange").value, settings.snapshot_month);
  const pieMode = document.getElementById("pieModeSelect").value;

  latestResults = simulatePortfolio(assets, settings, scenario);
  const monthlyTotals = groupByMonth(latestResults);
  const yearlyTrendData = getYearlyTrendData(monthlyTotals);
  const snapshotData = groupSnapshot(latestResults, selectedMonth, pieMode);

  updateSnapshotLabels(selectedMonth);
  updateSummaryCards(monthlyTotals, selectedMonth);
  updateSummaryTable(monthlyTotals);
  renderTrendChart(yearlyTrendData);
  renderPieChart(snapshotData, selectedMonth, pieMode);
}

function initControls() {
  const scenarioSelect = document.getElementById("scenarioSelect");
  const snapshotRange = document.getElementById("snapshotRange");
  const pieModeSelect = document.getElementById("pieModeSelect");

  for (const scenario of scenarios.filter(item => item.include)) {
    const option = document.createElement("option");
    option.value = scenario.scenario_id;
    option.textContent = scenario.scenario_name;
    scenarioSelect.appendChild(option);
  }

  snapshotRange.max = String(settings.simulation_years * 12);
  snapshotRange.value = String(settings.snapshot_month);

  scenarioSelect.addEventListener("change", updateDashboard);
  snapshotRange.addEventListener("input", updateDashboard);
  pieModeSelect.addEventListener("change", updateDashboard);
}

initControls();
updateDashboard();
