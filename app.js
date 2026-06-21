// Step 5: Portfolio composition detail version
// Data flow:
//   config.js -> CSV URLs -> fetch CSV -> normalize rows -> validate -> simulate -> render charts

const fallbackAssets = [
  {
    asset_id: "ACWI",
    asset_name: "emaxis slim all country",
    asset_class: "global_equity",
    asset_type: "mutual_fund",
    value_currency: "JPY",
    exposure_currency: "USD",
    account_type: "nisa_growth",
    current_value: 550000,
    current_principal: 550000,
    expected_return_annual: 5,
    target_weight: 0.7,
    monthly_contribution: 110000,
    has_monthly_contribution: true,
    include: true
  },
  {
    asset_id: "SP500",
    asset_name: "emaxis slim sp500",
    asset_class: "us_equity",
    asset_type: "mutual_fund",
    value_currency: "JPY",
    exposure_currency: "USD",
    account_type: "nisa_growth",
    current_value: 500000,
    current_principal: 360000,
    expected_return_annual: 5,
    target_weight: 0.1,
    monthly_contribution: 20000,
    has_monthly_contribution: true,
    include: true
  },
  {
    asset_id: "GOLD",
    asset_name: "sbi ishares gold",
    asset_class: "gold",
    asset_type: "mutual_fund",
    value_currency: "JPY",
    exposure_currency: "USD",
    account_type: "nisa_growth",
    current_value: 130000,
    current_principal: 130000,
    expected_return_annual: 2.5,
    target_weight: 0.05,
    monthly_contribution: 20000,
    has_monthly_contribution: true,
    include: true
  },
  {
    asset_id: "NIKKEI225",
    asset_name: "emaxis slim NIKKEI225",
    asset_class: "JP_equity",
    asset_type: "mutual_fund",
    value_currency: "JPY",
    exposure_currency: "JPY",
    account_type: "nisa_growth",
    current_value: 10000,
    current_principal: 10000,
    expected_return_annual: 5,
    target_weight: 0.1,
    monthly_contribution: 20000,
    has_monthly_contribution: true,
    include: true
  },
  {
    asset_id: "CASH",
    asset_name: "crash reserve",
    asset_class: "cash",
    asset_type: "cash",
    value_currency: "JPY",
    exposure_currency: "JPY",
    account_type: "cash",
    current_value: 500000,
    current_principal: 500000,
    expected_return_annual: 0,
    target_weight: 0.05,
    monthly_contribution: 0,
    has_monthly_contribution: true,
    include: true
  },
  {
    asset_id: "DC",
    asset_name: "企業DC・全世界株式",
    asset_class: "global_equity",
    asset_type: "mutual_fund",
    value_currency: "JPY",
    exposure_currency: "USD",
    account_type: "dc",
    current_value: 300000,
    current_principal: 250000,
    expected_return_annual: 5,
    target_weight: 0,
    monthly_contribution: 30000,
    has_monthly_contribution: true,
    include: true
  },
  {
    asset_id: "DAIKIN",
    asset_name: "DAIKIN",
    asset_class: "JP_equity",
    asset_type: "stock",
    value_currency: "JPY",
    exposure_currency: "JPY",
    account_type: "taxable",
    current_value: 155000,
    current_principal: 125500,
    expected_return_annual: 4,
    target_weight: 0,
    monthly_contribution: 30000,
    has_monthly_contribution: true,
    include: true
  },
  {
    asset_id: "MUFG",
    asset_name: "MUFG",
    asset_class: "JP_equity",
    asset_type: "stock",
    value_currency: "JPY",
    exposure_currency: "JPY",
    account_type: "taxable",
    current_value: 260000,
    current_principal: 165000,
    expected_return_annual: 4,
    target_weight: 0,
    monthly_contribution: 0,
    has_monthly_contribution: true,
    include: true
  },
  {
    asset_id: "tripla",
    asset_name: "tripla",
    asset_class: "JP_equity",
    asset_type: "stock",
    value_currency: "JPY",
    exposure_currency: "JPY",
    account_type: "taxable",
    current_value: 169000,
    current_principal: 175000,
    expected_return_annual: 4,
    target_weight: 0,
    monthly_contribution: 0,
    has_monthly_contribution: true,
    include: true
  },
  {
    asset_id: "NTT",
    asset_name: "NTT",
    asset_class: "JP_equity",
    asset_type: "stock",
    value_currency: "JPY",
    exposure_currency: "JPY",
    account_type: "taxable",
    current_value: 14400,
    current_principal: 15200,
    expected_return_annual: 4,
    target_weight: 0,
    monthly_contribution: 0,
    has_monthly_contribution: true,
    include: true
  },
  {
    asset_id: "SPCX",
    asset_name: "SpaceX",
    asset_class: "us_equity",
    asset_type: "stock",
    value_currency: "JPY",
    exposure_currency: "USD",
    account_type: "taxable",
    current_value: 29800,
    current_principal: 26400,
    expected_return_annual: 4,
    target_weight: 0,
    monthly_contribution: 0,
    has_monthly_contribution: true,
    include: true
  }
];

const fallbackSettings = {
  start_date: "2026-07-01",
  simulation_years: 50,
  monthly_total_contribution: 230000,
  default_expected_return: 3,
  snapshot_month: 60,
  contribution_timing: "beginning",
  display_interval: "yearly",
  include_emergency_cash: true
};

const fallbackScenarios = [
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
  bond: "債券",
  crypto: "暗号資産",
  mutual_fund: "投資信託",
  stock: "個別株",
  etf: "ETF",
  index: "指数",
  nisa_growth: "NISA成長投資枠",
  nisa_tsumitate: "NISAつみたて投資枠",
  taxable: "特定/一般口座",
  dc: "企業DC",
  JPY: "JPY",
  USD: "USD"
};

const displayIntervalLabelMap = {
  monthly: "月次",
  quarterly: "四半期",
  yearly: "年次"
};

let assets = [];
let settings = {};
let scenarios = [];
let assetTrendChart;
let portfolioPieChart;
let latestResults = [];
let latestValidation = null;
let controlsInitialized = false;

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0
});

const compactYenFormatter = new Intl.NumberFormat("ja-JP", {
  notation: "compact",
  maximumFractionDigits: 1
});

function setStatus(message, type = "normal") {
  const element = document.getElementById("dataSourceStatus");
  if (!element) return;
  element.textContent = message;
  const colors = {
    normal: "",
    success: "#047857",
    warning: "#b45309",
    error: "#b91c1c"
  };
  element.style.color = colors[type] || "";
}

function setLastLoadedAt(date) {
  const element = document.getElementById("lastLoadedAt");
  if (!element) return;
  if (!date) {
    element.textContent = "最終読込：-";
    return;
  }
  element.textContent = `最終読込：${date.toLocaleString("ja-JP")}`;
}

function cleanString(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/^\uFEFF/, "").trim();
}

function normalizeHeader(value) {
  return cleanString(value)
    .toLowerCase()
    .replace(/[\s\-]+/g, "_")
    .replace(/__+/g, "_");
}

function isBlank(value) {
  return cleanString(value) === "";
}

function toHalfWidthNumberText(value) {
  return String(value)
    .replace(/[０-９]/g, char => String.fromCharCode(char.charCodeAt(0) - 0xFEE0))
    .replace(/[．]/g, ".")
    .replace(/[，]/g, ",")
    .replace(/[−–—]/g, "-")
    .replace(/[％]/g, "%");
}

function toNullableNumber(value) {
  if (value === null || value === undefined) return null;
  const text = cleanString(toHalfWidthNumberText(value));
  if (text === "" || text === "-" || text === "—" || text === "N/A") return null;

  const cleaned = text
    .replace(/[￥¥,\s]/g, "")
    .replace(/%$/g, "")
    .trim();

  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : null;
}

function toNumber(value, fallback = 0) {
  const numeric = toNullableNumber(value);
  return numeric === null ? fallback : numeric;
}

function toBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  const text = cleanString(value).toLowerCase();
  if (["true", "yes", "y", "1", "on", "○", "〇", "はい", "有", "有効"].includes(text)) return true;
  if (["false", "no", "n", "0", "off", "×", "いいえ", "無", "無効"].includes(text)) return false;
  return fallback;
}

function formatYen(value) {
  return yenFormatter.format(Math.round(toNumber(value, 0)));
}

function formatPercent(value) {
  return `${toNumber(value, 0).toFixed(1)}%`;
}

function formatWeight(value) {
  return `${(toNumber(value, 0) * 100).toFixed(1)}%`;
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

function isConfiguredUrl(url) {
  const text = cleanString(url);
  return text !== "" && text.startsWith("http") && !text.includes("PASTE_") && !text.includes("ここに");
}

function normalizeRowKeys(row) {
  const normalized = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[normalizeHeader(key)] = cleanString(value);
  }
  return normalized;
}

async function loadCsv(url, label) {
  const requestUrl = `${url}${url.includes("?") ? "&" : "?"}_=${Date.now()}`;
  const response = await fetch(requestUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${label} CSVを取得できませんでした。HTTP ${response.status}`);
  }

  const csvText = await response.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  if (parsed.errors.length > 0) {
    console.warn(`${label} CSV parse warnings`, parsed.errors);
  }

  return parsed.data.map(normalizeRowKeys);
}

function normalizeAssets(rows) {
  return rows
    .filter(row => cleanString(row.asset_id) !== "")
    .map(row => {
      const monthlyContributionIsFilled = !isBlank(row.monthly_contribution);
      const expectedReturnIsFilled = !isBlank(row.expected_return_annual);

      return {
        asset_id: cleanString(row.asset_id),
        asset_name: cleanString(row.asset_name || row.asset_id),
        asset_class: cleanString(row.asset_class || "unknown"),
        asset_type: cleanString(row.asset_type || "unknown"),
        value_currency: cleanString(row.value_currency || row.currency || "JPY"),
        exposure_currency: cleanString(row.exposure_currency || row.value_currency || row.currency || "JPY"),
        account_type: cleanString(row.account_type || "unspecified"),
        current_value: toNumber(row.current_value, 0),
        current_principal: toNumber(row.current_principal, 0),
        expected_return_annual: expectedReturnIsFilled ? toNumber(row.expected_return_annual, 0) : null,
        target_weight: toNumber(row.target_weight, 0),
        monthly_contribution: monthlyContributionIsFilled ? toNumber(row.monthly_contribution, 0) : null,
        has_monthly_contribution: monthlyContributionIsFilled,
        include: toBoolean(row.include, true)
      };
    });
}

function normalizeSettings(rows) {
  const nextSettings = {};

  for (const row of rows) {
    const key = cleanString(row.key);
    if (key === "") continue;
    nextSettings[key] = cleanString(row.value);
  }

  const displayInterval = cleanString(nextSettings.display_interval || fallbackSettings.display_interval).toLowerCase();
  const safeDisplayInterval = ["monthly", "quarterly", "yearly"].includes(displayInterval)
    ? displayInterval
    : "yearly";

  return {
    start_date: nextSettings.start_date || fallbackSettings.start_date,
    simulation_years: Math.max(1, toNumber(nextSettings.simulation_years, fallbackSettings.simulation_years)),
    monthly_total_contribution: toNumber(nextSettings.monthly_total_contribution, fallbackSettings.monthly_total_contribution),
    default_expected_return: toNumber(nextSettings.default_expected_return, fallbackSettings.default_expected_return),
    snapshot_month: toNumber(nextSettings.snapshot_month, fallbackSettings.snapshot_month),
    contribution_timing: nextSettings.contribution_timing || fallbackSettings.contribution_timing,
    display_interval: safeDisplayInterval,
    include_emergency_cash: toBoolean(nextSettings.include_emergency_cash, true)
  };
}

function normalizeScenarios(rows) {
  const normalized = rows
    .filter(row => cleanString(row.scenario_id) !== "")
    .map(row => ({
      scenario_id: cleanString(row.scenario_id),
      scenario_name: cleanString(row.scenario_name || row.scenario_id),
      expected_return_adjustment: toNumber(row.expected_return_adjustment, 0),
      crash_month: toNullableNumber(row.crash_month),
      crash_rate: toNullableNumber(row.crash_rate),
      recovery_months: toNullableNumber(row.recovery_months),
      include: toBoolean(row.include, true)
    }));

  if (normalized.length > 0) return normalized;
  return fallbackScenarios;
}

function isEmergencyCash(asset) {
  const id = cleanString(asset.asset_id).toLowerCase();
  const name = cleanString(asset.asset_name).toLowerCase();
  const accountType = cleanString(asset.account_type).toLowerCase();
  return id.includes("emergency") || name.includes("生活防衛") || accountType.includes("emergency");
}

function getIncludedAssets(assetList, currentSettings) {
  return assetList.filter(asset => {
    if (asset.include !== true) return false;
    if (currentSettings.include_emergency_cash === false && isEmergencyCash(asset)) return false;
    return true;
  });
}

function getMonthlyContribution(asset, currentSettings) {
  if (asset.has_monthly_contribution) {
    return toNumber(asset.monthly_contribution, 0);
  }

  const targetWeight = toNumber(asset.target_weight, 0);
  return toNumber(currentSettings.monthly_total_contribution, 0) * targetWeight;
}

function getAnnualReturn(asset, currentSettings) {
  if (asset.expected_return_annual !== null && asset.expected_return_annual !== undefined) {
    return toNumber(asset.expected_return_annual, 0);
  }
  return toNumber(currentSettings.default_expected_return, 0);
}

function getMonthlyRate(asset, scenario, currentSettings) {
  const baseAnnualReturn = getAnnualReturn(asset, currentSettings);
  const adjustedAnnualReturn = Math.max(
    -99,
    baseAnnualReturn + toNumber(scenario.expected_return_adjustment, 0)
  );
  return Math.pow(1 + adjustedAnnualReturn / 100, 1 / 12) - 1;
}

function buildValidation(assetList, currentSettings, scenarioList) {
  const messages = [];
  const included = getIncludedAssets(assetList, currentSettings);
  const ids = new Map();
  const duplicateIds = [];

  for (const asset of assetList) {
    const count = ids.get(asset.asset_id) || 0;
    ids.set(asset.asset_id, count + 1);
    if (count === 1) duplicateIds.push(asset.asset_id);

    if (asset.current_value < 0) {
      messages.push({ type: "error", text: `${asset.asset_id}: current_value がマイナスです。` });
    }
    if (asset.current_principal < 0) {
      messages.push({ type: "error", text: `${asset.asset_id}: current_principal がマイナスです。` });
    }
    if (!asset.asset_class || asset.asset_class === "unknown") {
      messages.push({ type: "warning", text: `${asset.asset_id}: asset_class が空欄です。円グラフ分類で unknown になります。` });
    }
    if (asset.expected_return_annual === null) {
      messages.push({ type: "ok", text: `${asset.asset_id}: expected_return_annual 空欄のため default_expected_return ${currentSettings.default_expected_return}% を使用します。` });
    }
  }

  if (duplicateIds.length > 0) {
    messages.push({ type: "error", text: `asset_id が重複しています: ${duplicateIds.join(", ")}` });
  }

  if (scenarioList.filter(item => item.include).length === 0) {
    messages.push({ type: "warning", text: "include=TRUE の Scenario がありません。fallback の基本シナリオを使います。" });
  }

  const currentValue = included.reduce((sum, asset) => sum + toNumber(asset.current_value, 0), 0);
  const currentPrincipal = included.reduce((sum, asset) => sum + toNumber(asset.current_principal, 0), 0);
  const monthlyContribution = included.reduce((sum, asset) => sum + getMonthlyContribution(asset, currentSettings), 0);
  const targetWeightSum = included.reduce((sum, asset) => sum + toNumber(asset.target_weight, 0), 0);
  const blankContributionCount = included.filter(asset => !asset.has_monthly_contribution).length;
  const directContributionCount = included.filter(asset => asset.has_monthly_contribution).length;
  const monthlyTotalSetting = toNumber(currentSettings.monthly_total_contribution, 0);

  if (blankContributionCount > 0 && Math.abs(targetWeightSum - 1) > 0.001) {
    messages.push({
      type: "warning",
      text: `monthly_contribution 空欄の資産がありますが、target_weight 合計が ${formatWeight(targetWeightSum)} です。配分計算を使うなら100%に近づけてください。`
    });
  }

  if (monthlyTotalSetting > 0 && Math.abs(monthlyContribution - monthlyTotalSetting) >= 1) {
    messages.push({
      type: "warning",
      text: `計算上の毎月積立額 ${formatYen(monthlyContribution)} と Settings.monthly_total_contribution ${formatYen(monthlyTotalSetting)} が一致していません。直接入力の monthly_contribution が優先されています。`
    });
  }

  if (messages.filter(item => item.type === "error" || item.type === "warning").length === 0) {
    messages.push({ type: "ok", text: "読み込みチェックは問題ありません。" });
  }

  return {
    rowCount: assetList.length,
    includedCount: included.length,
    currentValue,
    currentPrincipal,
    monthlyContribution,
    targetWeightSum,
    blankContributionCount,
    directContributionCount,
    messages
  };
}

function renderDiagnostics(validation) {
  latestValidation = validation;
  const diagnostics = document.getElementById("sheetDiagnostics");
  const validationList = document.getElementById("validationList");
  if (!diagnostics || !validationList || !validation) return;

  const items = [
    ["Assets行数", `${validation.rowCount}件`],
    ["表示対象Assets", `${validation.includedCount}件`],
    ["現在評価額合計", formatYen(validation.currentValue)],
    ["現在元本合計", formatYen(validation.currentPrincipal)],
    ["毎月積立額", formatYen(validation.monthlyContribution)],
    ["target_weight合計", formatWeight(validation.targetWeightSum)],
    ["直接積立入力", `${validation.directContributionCount}件`],
    ["配分計算入力", `${validation.blankContributionCount}件`]
  ];

  diagnostics.innerHTML = items
    .map(([label, value]) => `<div class="diagnostic-item"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  validationList.innerHTML = validation.messages
    .map(item => `<li class="validation-${item.type}">${item.text}</li>`)
    .join("");
}

async function loadData() {
  const config = window.ASSET_SIMULATOR_CONFIG || {};
  const googleSheets = config.googleSheets || {};
  const urls = {
    assets: googleSheets.assetsCsvUrl,
    settings: googleSheets.settingsCsvUrl,
    scenarios: googleSheets.scenariosCsvUrl
  };

  const allUrlsConfigured = [urls.assets, urls.settings, urls.scenarios].every(isConfiguredUrl);

  if (!allUrlsConfigured) {
    assets = fallbackAssets;
    settings = fallbackSettings;
    scenarios = fallbackScenarios;
    const validation = buildValidation(assets, settings, scenarios);
    renderDiagnostics(validation);
    setStatus("config.jsにCSV URLが未設定です。現在は内蔵サンプルデータで表示しています。", "warning");
    setLastLoadedAt(new Date());
    return;
  }

  try {
    setStatus("GoogleスプレッドシートからCSVを読み込んでいます...", "normal");
    const [assetRows, settingRows, scenarioRows] = await Promise.all([
      loadCsv(urls.assets, "Assets"),
      loadCsv(urls.settings, "Settings"),
      loadCsv(urls.scenarios, "Scenario")
    ]);

    assets = normalizeAssets(assetRows);
    settings = normalizeSettings(settingRows);
    scenarios = normalizeScenarios(scenarioRows);

    if (assets.length === 0) {
      throw new Error("Assets CSVに有効なasset_idがありません。");
    }

    const validation = buildValidation(assets, settings, scenarios);
    renderDiagnostics(validation);

    const hasSeriousIssue = validation.messages.some(item => item.type === "error");
    const hasWarning = validation.messages.some(item => item.type === "warning");
    const statusType = hasSeriousIssue ? "error" : hasWarning ? "warning" : "success";

    setStatus(`Googleスプレッドシート接続中：Assets ${assets.length}件、Scenario ${scenarios.length}件を読み込みました。`, statusType);
    setLastLoadedAt(new Date());
  } catch (error) {
    console.error(error);
    assets = fallbackAssets;
    settings = fallbackSettings;
    scenarios = fallbackScenarios;
    const validation = buildValidation(assets, settings, scenarios);
    renderDiagnostics(validation);
    setStatus(`CSV読み込みに失敗しました。内蔵サンプルデータで表示しています。${error.message}`, "error");
    setLastLoadedAt(new Date());
  }
}

function simulatePortfolio(assetList, currentSettings, scenario) {
  const months = toNumber(currentSettings.simulation_years, 30) * 12;
  const startDate = new Date(currentSettings.start_date);
  const includedAssets = getIncludedAssets(assetList, currentSettings);

  let current = includedAssets.map(asset => ({
    ...asset,
    value: toNumber(asset.current_value, 0),
    principal: toNumber(asset.current_principal, 0),
    monthlyContribution: getMonthlyContribution(asset, currentSettings)
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
        account_type: asset.account_type,
        principal: asset.principal,
        value: asset.value,
        contribution: month === 0 ? 0 : asset.monthlyContribution
      });
    }

    if (month === months) break;

    current = current.map(asset => {
      const monthlyRate = getMonthlyRate(asset, scenario, currentSettings);
      const contribution = asset.monthlyContribution;
      const isBeginning = currentSettings.contribution_timing === "beginning";

      let nextPrincipal;
      let nextValue;

      if (isBeginning) {
        nextPrincipal = asset.principal + contribution;
        nextValue = (asset.value + contribution) * (1 + monthlyRate);
      } else {
        nextPrincipal = asset.principal + contribution;
        nextValue = asset.value * (1 + monthlyRate) + contribution;
      }

      const crashMonth = scenario.crash_month;
      const crashRate = scenario.crash_rate;
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

function getGroupLabel(row, key) {
  const rawLabel = row[key] || "unknown";
  return labelMap[rawLabel] || rawLabel;
}

function buildSnapshotGroups(rows, selectedMonth, key) {
  const targetRows = rows.filter(row => row.month === selectedMonth);
  const grouped = new Map();

  for (const row of targetRows) {
    const label = getGroupLabel(row, key);

    if (!grouped.has(label)) {
      grouped.set(label, {
        label,
        value: 0,
        principal: 0,
        assetCount: 0
      });
    }

    const item = grouped.get(label);
    item.value += row.value;
    item.principal += row.principal;
    item.assetCount += 1;
  }

  const totalValue = Array.from(grouped.values()).reduce((sum, item) => sum + item.value, 0);

  return Array.from(grouped.values())
    .filter(item => item.value > 0)
    .map(item => ({
      ...item,
      profit: item.value - item.principal,
      profitRate: item.principal === 0 ? 0 : (item.value - item.principal) / item.principal * 100,
      share: totalValue === 0 ? 0 : item.value / totalValue * 100
    }))
    .sort((a, b) => b.value - a.value);
}

function combineSmallSnapshotGroups(snapshotGroups, thresholdPercent = 1) {
  const smallGroups = snapshotGroups.filter(item => item.share > 0 && item.share < thresholdPercent);

  if (smallGroups.length <= 1) return snapshotGroups;

  const largeGroups = snapshotGroups.filter(item => item.share >= thresholdPercent);
  const other = smallGroups.reduce(
    (sum, item) => ({
      label: "その他",
      value: sum.value + item.value,
      principal: sum.principal + item.principal,
      assetCount: sum.assetCount + item.assetCount
    }),
    { label: "その他", value: 0, principal: 0, assetCount: 0 }
  );

  other.profit = other.value - other.principal;
  other.profitRate = other.principal === 0 ? 0 : other.profit / other.principal * 100;

  const totalValue = snapshotGroups.reduce((sum, item) => sum + item.value, 0);
  const combined = [...largeGroups, other]
    .map(item => ({
      ...item,
      share: totalValue === 0 ? 0 : item.value / totalValue * 100
    }))
    .sort((a, b) => b.value - a.value);

  return combined;
}

function getTrendData(monthlyTotals) {
  const interval = settings.display_interval || "yearly";
  if (interval === "monthly") return monthlyTotals;
  if (interval === "quarterly") return monthlyTotals.filter(item => item.month % 3 === 0);
  return monthlyTotals.filter(item => item.month % 12 === 0);
}

function getTrendLabel(item) {
  if (item.month === 0) return "現在";
  if ((settings.display_interval || "yearly") === "yearly") return `${item.month / 12}年後`;
  return item.dateLabel;
}

function updateSummaryCards(monthlyTotals, selectedMonth) {
  const current = monthlyTotals.find(item => item.month === 0) || { value: 0, principal: 0 };
  const snapshot = monthlyTotals.find(item => item.month === selectedMonth) || monthlyTotals[0] || { value: 0, principal: 0, profit: 0, profitRate: 0 };
  const totalMonthlyContribution = getIncludedAssets(assets, settings)
    .reduce((sum, asset) => sum + getMonthlyContribution(asset, settings), 0);

  document.getElementById("currentValue").textContent = formatYen(current.value);
  document.getElementById("currentPrincipal").textContent = formatYen(current.principal);
  document.getElementById("monthlyContribution").textContent = formatYen(totalMonthlyContribution);
  document.getElementById("snapshotValue").textContent = formatYen(snapshot.value);
  document.getElementById("snapshotPrincipal").textContent = formatYen(snapshot.principal);
  document.getElementById("snapshotProfit").textContent = formatYen(snapshot.profit);
  document.getElementById("snapshotProfitRate").textContent = formatPercent(snapshot.profitRate);
  document.getElementById("displayIntervalLabel").textContent = displayIntervalLabelMap[settings.display_interval] || settings.display_interval || "年次";
}

function updateSummaryTable(monthlyTotals) {
  const maxMonth = toNumber(settings.simulation_years, 30) * 12;
  const baseCheckpoints = [0, 12, 36, 60, 120, 240, 360, 480, 600];
  const checkpoints = baseCheckpoints.filter(month => month <= maxMonth);
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

function updatePortfolioSnapshotSummary(snapshotData) {
  const groupCount = document.getElementById("portfolioGroupCount");
  const topLabel = document.getElementById("portfolioTopLabel");
  const topShare = document.getElementById("portfolioTopShare");

  if (!groupCount || !topLabel || !topShare) return;

  const top = snapshotData[0];
  groupCount.textContent = `${snapshotData.length}件`;
  topLabel.textContent = top ? top.label : "-";
  topShare.textContent = top ? formatPercent(top.share) : "-";
}

function updateCompositionTable(snapshotData) {
  const tbody = document.getElementById("compositionTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  for (const item of snapshotData) {
    const tr = document.createElement("tr");
    const profitClass = item.profit < 0 ? "negative-value" : item.profit > 0 ? "positive-value" : "";

    tr.innerHTML = `
      <td>${item.label}</td>
      <td>${formatYen(item.value)}</td>
      <td class="composition-share-cell">
        <div class="share-bar">
          <span class="share-track"><span class="share-fill" style="width: ${Math.max(0, Math.min(100, item.share))}%"></span></span>
          <span class="share-value">${formatPercent(item.share)}</span>
        </div>
      </td>
      <td>${formatYen(item.principal)}</td>
      <td class="${profitClass}">${formatYen(item.profit)}</td>
      <td class="${profitClass}">${formatPercent(item.profitRate)}</td>
    `;

    tbody.appendChild(tr);
  }
}

function updateQuickSnapshotButtons(selectedMonth) {
  document.querySelectorAll("[data-snapshot-month]").forEach(button => {
    const month = toNumber(button.dataset.snapshotMonth, -1);
    button.classList.toggle("is-active", month === selectedMonth);
    button.disabled = month > toNumber(settings.simulation_years, 30) * 12;
  });
}

function renderTrendChart(trendData) {
  const ctx = document.getElementById("assetTrendChart");

  if (assetTrendChart) assetTrendChart.destroy();

  assetTrendChart = new Chart(ctx, {
    data: {
      labels: trendData.map(getTrendLabel),
      datasets: [
        {
          type: "bar",
          label: "評価額",
          data: trendData.map(item => Math.round(item.value)),
          borderWidth: 0,
          borderRadius: 8
        },
        {
          type: "line",
          label: "元本",
          data: trendData.map(item => Math.round(item.principal)),
          tension: 0.25,
          pointRadius: trendData.length > 80 ? 0 : 2,
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
    value_currency: "評価通貨別",
    asset_type: "商品タイプ別",
    account_type: "口座区分別"
  }[mode];

  document.getElementById("pieDescription").textContent = `${getSnapshotText(selectedMonth)}の${modeLabel}比率です。`;
}

function updateSnapshotLabels(selectedMonth) {
  const snapshotDate = addMonths(new Date(settings.start_date), selectedMonth);
  document.getElementById("snapshotLabel").textContent = getSnapshotText(selectedMonth);
  document.getElementById("snapshotDateLabel").textContent = formatYearMonth(snapshotDate);
}

function updateDashboard() {
  const scenarioSelect = document.getElementById("scenarioSelect");
  const snapshotRange = document.getElementById("snapshotRange");
  const pieModeSelect = document.getElementById("pieModeSelect");

  const scenarioId = scenarioSelect.value;
  const scenario = scenarios.find(item => item.scenario_id === scenarioId) || scenarios[0] || fallbackScenarios[0];
  const selectedMonth = toNumber(snapshotRange.value, settings.snapshot_month);
  const pieMode = pieModeSelect.value;

  latestResults = simulatePortfolio(assets, settings, scenario);
  const monthlyTotals = groupByMonth(latestResults);
  const trendData = getTrendData(monthlyTotals);
  const groupSmallSlicesToggle = document.getElementById("groupSmallSlicesToggle");
  const shouldGroupSmallSlices = groupSmallSlicesToggle ? groupSmallSlicesToggle.checked : true;
  const rawSnapshotData = buildSnapshotGroups(latestResults, selectedMonth, pieMode);
  const snapshotData = shouldGroupSmallSlices
    ? combineSmallSnapshotGroups(rawSnapshotData)
    : rawSnapshotData;

  updateSnapshotLabels(selectedMonth);
  updateSummaryCards(monthlyTotals, selectedMonth);
  updateSummaryTable(monthlyTotals);
  updatePortfolioSnapshotSummary(snapshotData);
  updateCompositionTable(snapshotData);
  updateQuickSnapshotButtons(selectedMonth);
  renderTrendChart(trendData);
  renderPieChart(snapshotData, selectedMonth, pieMode);
}

function refreshControls() {
  const scenarioSelect = document.getElementById("scenarioSelect");
  const snapshotRange = document.getElementById("snapshotRange");
  const previousScenario = scenarioSelect.value;

  const visibleScenarios = scenarios.filter(item => item.include);
  const scenarioOptions = visibleScenarios.length > 0 ? visibleScenarios : fallbackScenarios;

  scenarioSelect.innerHTML = "";
  for (const scenario of scenarioOptions) {
    const option = document.createElement("option");
    option.value = scenario.scenario_id;
    option.textContent = scenario.scenario_name;
    scenarioSelect.appendChild(option);
  }

  const previousStillExists = scenarioOptions.some(item => item.scenario_id === previousScenario);
  if (previousStillExists) {
    scenarioSelect.value = previousScenario;
  }

  snapshotRange.max = String(toNumber(settings.simulation_years, 30) * 12);
  snapshotRange.step = "1";
  const currentValue = toNumber(snapshotRange.value, settings.snapshot_month);
  const safeValue = Math.min(currentValue, toNumber(snapshotRange.max, 600));
  snapshotRange.value = String(safeValue || toNumber(settings.snapshot_month, 60));
}

function initControlsOnce() {
  if (controlsInitialized) return;

  const scenarioSelect = document.getElementById("scenarioSelect");
  const snapshotRange = document.getElementById("snapshotRange");
  const pieModeSelect = document.getElementById("pieModeSelect");
  const groupSmallSlicesToggle = document.getElementById("groupSmallSlicesToggle");
  const reloadDataButton = document.getElementById("reloadDataButton");

  scenarioSelect.addEventListener("change", updateDashboard);
  snapshotRange.addEventListener("input", updateDashboard);
  pieModeSelect.addEventListener("change", updateDashboard);
  if (groupSmallSlicesToggle) groupSmallSlicesToggle.addEventListener("change", updateDashboard);
  document.querySelectorAll("[data-snapshot-month]").forEach(button => {
    button.addEventListener("click", () => {
      const maxMonth = toNumber(snapshotRange.max, 600);
      const targetMonth = Math.min(toNumber(button.dataset.snapshotMonth, 0), maxMonth);
      snapshotRange.value = String(targetMonth);
      updateDashboard();
    });
  });
  reloadDataButton.addEventListener("click", reloadDataFromSheet);

  controlsInitialized = true;
}

async function reloadDataFromSheet() {
  const button = document.getElementById("reloadDataButton");
  button.disabled = true;
  button.textContent = "再読み込み中...";

  try {
    await loadData();
    refreshControls();
    updateDashboard();
  } finally {
    button.disabled = false;
    button.textContent = "シートを再読み込み";
  }
}

async function initApp() {
  initControlsOnce();
  await loadData();
  refreshControls();
  updateDashboard();
}

initApp();
