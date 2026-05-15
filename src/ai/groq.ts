import Groq from "groq-sdk";

export type AnalysisInput = {
  content: string;
  sourceType?: "text" | "upload" | "url" | "email" | "chat";
  url?: string;
  companyName?: string;
  recruiterName?: string;
  channel?: string;
  locale?: string;
};

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type VerificationSummary = {
  domain: string | null;
  checkedUrl: string | null;
  websiteReachable: boolean | null;
  usesHttps: boolean | null;
  domainAgeDays: number | null;
  domainRecentlyRegistered: boolean;
  suspiciousTld: boolean;
  officialEmailPresent: boolean;
  officialCareersPageLikely: boolean;
  linkedinReferencePresent: boolean;
  verificationWarnings: string[];
  verificationSignals: string[];
  verificationStatus: "unverified" | "partial" | "verified" | "high-risk";
};

export type RiskDimensionScores = {
  paymentRisk: number;
  urgencyRisk: number;
  impersonationRisk: number;
  privacyRisk: number;
  communicationRisk: number;
  credibilityRisk: number;
};

export type DetectionSignal = {
  label: string;
  severity: RiskLevel;
  category: keyof RiskDimensionScores;
  weight: number;
  evidence: string[];
};

export type AnalysisResult = {
  riskScore: number;
  riskLevel: RiskLevel;
  scamType: string;
  redFlags: string[];
  greenFlags: string[];
  verification: VerificationSummary;
  explanation: string;
  recommendedAction: string;
  confidenceScore: number;
  recommendedActions: string[];
  riskDimensions: RiskDimensionScores;
  detectedSignals: DetectionSignal[];
  suspiciousIndicators: string[];
  extractedEntities: {
    urls: string[];
    emails: string[];
    phoneNumbers: string[];
    moneyAmounts: string[];
    platforms: string[];
  };
  requiresImmediateAttention: boolean;
  analysisVersion: string;
  provider: "heuristic" | "groq+heuristic";
};

type HeuristicRule = {
  label: string;
  category: keyof RiskDimensionScores;
  weight: number;
  severity: RiskLevel;
  patterns: RegExp[];
  scamType?: string;
};

const ANALYSIS_VERSION = "2.1.0";

const heuristicRules: HeuristicRule[] = [
  {
    label: "Advance payment request",
    category: "paymentRisk",
    weight: 28,
    severity: "Critical",
    scamType: "Advance Fee Scam",
    patterns: [
      /\bsecurity deposit\b/i,
      /\bregistration fee\b/i,
      /\bprocessing fee\b/i,
      /\btraining fee\b/i,
      /\brefundable amount\b/i,
      /\bpay(?:ment)? .* before onboarding\b/i,
      /\bdeposit\b.{0,30}\b(?:rs|inr|\$|usd|eur|gbp)\b/i,
    ],
  },
  {
    label: "Gift card or crypto payment",
    category: "paymentRisk",
    weight: 30,
    severity: "Critical",
    scamType: "Payment Diversion Scam",
    patterns: [/\bgift card\b/i, /\bcrypto(?:currency)?\b/i, /\busdt\b/i, /\bbitcoin\b/i],
  },
  {
    label: "Equipment purchase or reimbursement setup",
    category: "paymentRisk",
    weight: 24,
    severity: "Critical",
    scamType: "Equipment Purchase Scam",
    patterns: [
      /\bbuy (?:your|the) equipment\b/i,
      /\bpurchase (?:a |your )?(?:laptop|device|software|kit)\b/i,
      /\breimbursement after\b/i,
      /\bwe will reimburse\b/i,
      /\bvendor approved by company\b/i,
      /\bsend invoice for reimbursement\b/i,
    ],
  },
  {
    label: "Artificial urgency",
    category: "urgencyRisk",
    weight: 14,
    severity: "High",
    patterns: [
      /\bonly \d+ slots? left\b/i,
      /\bimmediate(?:ly)? join\b/i,
      /\bapply within \d+ hours?\b/i,
      /\bact now\b/i,
      /\bfinal warning\b/i,
      /\burgent hiring\b/i,
    ],
  },
  {
    label: "Off-platform communication push",
    category: "communicationRisk",
    weight: 18,
    severity: "High",
    scamType: "Messaging App Recruitment Scam",
    patterns: [
      /\btelegram\b/i,
      /\bwhatsapp\b/i,
      /\bsignal app\b/i,
      /\bdiscord\b/i,
      /\bcontact .* privately\b/i,
    ],
  },
  {
    label: "Sensitive identity request",
    category: "privacyRisk",
    weight: 18,
    severity: "High",
    patterns: [
      /\baadhaar\b/i,
      /\bpan card\b/i,
      /\bpassport copy\b/i,
      /\bbank details?\b/i,
      /\bssn\b/i,
      /\bdriver'?s license\b/i,
      /\bselfie with id\b/i,
      /\bverification document\b/i,
    ],
  },
  {
    label: "Suspicious guaranteed income claim",
    category: "credibilityRisk",
    weight: 12,
    severity: "Medium",
    scamType: "Fake Job Offer",
    patterns: [
      /\bguaranteed income\b/i,
      /\bno experience required\b/i,
      /\bearn \b.{0,20}\bper day\b/i,
      /\bwork 1-2 hours\b/i,
      /\b100% placement\b/i,
      /\bearn \b.{0,20}\bper week\b/i,
      /\bweekly payout\b/i,
      /\bhigh salary for simple tasks\b/i,
    ],
  },
  {
    label: "Interview bypass or instant hiring",
    category: "credibilityRisk",
    weight: 18,
    severity: "High",
    scamType: "Fake Job Offer",
    patterns: [
      /\bwithout interview\b/i,
      /\bno interview required\b/i,
      /\bselected(?: immediately)?\b/i,
      /\binstant joining\b/i,
      /\binstant offer letter\b/i,
      /\bjob is confirmed\b/i,
    ],
  },
  {
    label: "Task scam or engagement farming",
    category: "credibilityRisk",
    weight: 20,
    severity: "High",
    scamType: "Task Scam",
    patterns: [
      /\blike and subscribe\b/i,
      /\brate products?\b/i,
      /\bsubmit reviews?\b/i,
      /\bcomplete \d+ tasks?\b/i,
      /\bdata entry from home\b/i,
      /\btyping job\b/i,
      /\bcopy paste job\b/i,
    ],
  },
  {
    label: "Impersonation language",
    category: "impersonationRisk",
    weight: 16,
    severity: "High",
    scamType: "Impersonation Scam",
    patterns: [
      /\bofficial recruitment partner\b/i,
      /\bverified hr manager\b/i,
      /\bon behalf of\b/i,
      /\bcompany laptop courier\b/i,
      /\bemployee id will be issued after payment\b/i,
    ],
  },
  {
    label: "Poor credibility markers",
    category: "credibilityRisk",
    weight: 10,
    severity: "Medium",
    patterns: [
      /\bkindly do the needful\b/i,
      /\bselected urgently\b/i,
      /\bwithout interview\b/i,
      /\bimmediate offer letter\b/i,
      /\brandom gmail\.com\b/i,
    ],
  },
];

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Groq({ apiKey });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function collectMatches(content: string, regex: RegExp) {
  const matches = content.match(regex);
  return matches ? unique(matches.map((match) => match.trim())) : [];
}

function extractEntities(content: string) {
  return {
    urls: unique(content.match(/https?:\/\/[^\s)]+/gi) ?? []),
    emails: unique(content.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) ?? []),
    phoneNumbers: unique(content.match(/\+?\d[\d\s\-()]{7,}\d/g) ?? []),
    moneyAmounts: unique(
      content.match(/(?:₹|\b(?:rs\.?|inr|\$|usd|eur|gbp))\s?\d[\d,]*(?:\.\d{1,2})?(?:\s?(?:k|lakh|lakhs|lac))?/gi) ?? []
    ),
    platforms: unique(
      collectMatches(content, /\b(?:telegram|whatsapp|signal|discord|skype|teams)\b/gi)
    ),
  };
}

function summarizeScamType(signals: DetectionSignal[]) {
  const weightedTypes = new Map<string, number>();

  for (const rule of heuristicRules) {
    if (!rule.scamType) continue;
    const matched = signals.find((signal) => signal.label === rule.label);
    if (matched) {
      weightedTypes.set(rule.scamType, (weightedTypes.get(rule.scamType) ?? 0) + matched.weight);
    }
  }

  const top = [...weightedTypes.entries()].sort((a, b) => b[1] - a[1])[0];
  return top?.[0] ?? "Suspicious Recruitment Pattern";
}

function extractDomain(value: string) {
  const emailDomain = value.match(/@([A-Z0-9.-]+\.[A-Z]{2,})/i);
  if (emailDomain) {
    return emailDomain[1].toLowerCase();
  }

  try {
    const parsed = new URL(value);
    return parsed.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return null;
  }
}

function normalizeCompanyToken(companyName?: string) {
  return (companyName ?? "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function countCompanyMentions(content: string, companyName?: string) {
  if (!companyName?.trim()) {
    return 0;
  }

  const escaped = companyName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  return content.match(regex)?.length ?? 0;
}

function parseCompensationAmount(value: string) {
  const normalized = value.toLowerCase().replace(/,/g, "");
  const numberMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!numberMatch) {
    return null;
  }

  let amount = Number(numberMatch[1]);

  if (normalized.includes("lakh") || normalized.includes("lakhs") || normalized.includes("lac")) {
    amount *= 100000;
  } else if (/\bk\b/.test(normalized)) {
    amount *= 1000;
  }

  return Number.isFinite(amount) ? amount : null;
}

function getUppercaseRatio(content: string) {
  const letters = content.match(/[A-Za-z]/g) ?? [];
  if (letters.length === 0) {
    return 0;
  }

  const uppercase = content.match(/[A-Z]/g) ?? [];
  return uppercase.length / letters.length;
}

function isGenericEmailDomain(email: string) {
  return /@gmail\.com|@yahoo\.com|@outlook\.com|@hotmail\.com/i.test(email);
}

function buildVerificationSummary(partial?: Partial<VerificationSummary>): VerificationSummary {
  return {
    domain: partial?.domain ?? null,
    checkedUrl: partial?.checkedUrl ?? null,
    websiteReachable: partial?.websiteReachable ?? null,
    usesHttps: partial?.usesHttps ?? null,
    domainAgeDays: partial?.domainAgeDays ?? null,
    domainRecentlyRegistered: partial?.domainRecentlyRegistered ?? false,
    suspiciousTld: partial?.suspiciousTld ?? false,
    officialEmailPresent: partial?.officialEmailPresent ?? false,
    officialCareersPageLikely: partial?.officialCareersPageLikely ?? false,
    linkedinReferencePresent: partial?.linkedinReferencePresent ?? false,
    verificationWarnings: unique(partial?.verificationWarnings ?? []).slice(0, 8),
    verificationSignals: unique(partial?.verificationSignals ?? []).slice(0, 8),
    verificationStatus: partial?.verificationStatus ?? "unverified",
  };
}

function getPrimaryReferenceUrl(input: AnalysisInput, entities: AnalysisResult["extractedEntities"]) {
  if (input.url?.trim()) {
    return input.url.trim();
  }

  return entities.urls[0] ?? null;
}

function ensureUrlProtocol(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function getHostname(value: string) {
  try {
    return new URL(ensureUrlProtocol(value)).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "user-agent": "VeriHireAI/2.2 verification",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function probeWebsite(url: string) {
  const httpsUrl = ensureUrlProtocol(url).replace(/^http:\/\//i, "https://");

  try {
    const headResponse = await fetchWithTimeout(httpsUrl, { method: "HEAD", redirect: "follow" });
    return {
      ok: headResponse.ok,
      status: headResponse.status,
      finalUrl: headResponse.url || httpsUrl,
      usesHttps: /^https:\/\//i.test(headResponse.url || httpsUrl),
    };
  } catch {
    try {
      const getResponse = await fetchWithTimeout(httpsUrl, { method: "GET", redirect: "follow" });
      return {
        ok: getResponse.ok,
        status: getResponse.status,
        finalUrl: getResponse.url || httpsUrl,
        usesHttps: /^https:\/\//i.test(getResponse.url || httpsUrl),
      };
    } catch {
      return {
        ok: false,
        status: null,
        finalUrl: httpsUrl,
        usesHttps: /^https:\/\//i.test(httpsUrl),
      };
    }
  }
}

async function lookupDomainAgeDays(domain: string) {
  try {
    const response = await fetchWithTimeout(`https://rdap.org/domain/${domain}`, { method: "GET" }, 6500);
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      events?: Array<{ eventAction?: string; eventDate?: string }>;
    };

    const registrationEvent = data.events?.find((event) =>
      /registration|created/i.test(event.eventAction ?? "")
    );

    if (!registrationEvent?.eventDate) {
      return null;
    }

    const createdAt = new Date(registrationEvent.eventDate).getTime();
    if (Number.isNaN(createdAt)) {
      return null;
    }

    return Math.max(0, Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24)));
  } catch {
    return null;
  }
}

function heuristicAnalyze(input: AnalysisInput): AnalysisResult {
  const normalized = input.content.replace(/\s+/g, " ").trim();
  const lowerContent = normalized.toLowerCase();
  const entities = extractEntities(normalized);
  const greenFlags: string[] = [];

  const riskDimensions: RiskDimensionScores = {
    paymentRisk: 0,
    urgencyRisk: 0,
    impersonationRisk: 0,
    privacyRisk: 0,
    communicationRisk: 0,
    credibilityRisk: 0,
  };

  const detectedSignals: DetectionSignal[] = [];
  const redFlags: string[] = [];

  for (const rule of heuristicRules) {
    const evidence = unique(rule.patterns.flatMap((pattern) => collectMatches(normalized, pattern)));
    if (evidence.length === 0) continue;

    riskDimensions[rule.category] = clamp(riskDimensions[rule.category] + rule.weight, 0, 100);
    detectedSignals.push({
      label: rule.label,
      severity: rule.severity,
      category: rule.category,
      weight: rule.weight,
      evidence: evidence.slice(0, 3),
    });
    redFlags.push(`${rule.label}: ${evidence.slice(0, 2).join(", ")}`);
  }

  if (entities.urls.some((url) => /bit\.ly|tinyurl|t\.co|shorturl/i.test(url))) {
    riskDimensions.communicationRisk = clamp(riskDimensions.communicationRisk + 12, 0, 100);
    redFlags.push("Shortened or obfuscated links detected.");
  }

  if (entities.emails.some((email) => isGenericEmailDomain(email))) {
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk + 10, 0, 100);
    redFlags.push("Recruitment contact uses a generic email domain.");
  }

  if (entities.phoneNumbers.length > 0 && entities.emails.length === 0 && entities.urls.length === 0) {
    riskDimensions.communicationRisk = clamp(riskDimensions.communicationRisk + 10, 0, 100);
    redFlags.push("Listing relies on phone-only contact with no verifiable email or website.");
  }

  if (input.url && !/^https:\/\//i.test(input.url)) {
    riskDimensions.communicationRisk = clamp(riskDimensions.communicationRisk + 8, 0, 100);
    redFlags.push("Submitted URL does not use HTTPS.");
  }

  const salaryValues = entities.moneyAmounts
    .map(parseCompensationAmount)
    .filter((value): value is number => typeof value === "number");
  const highestSalarySignal = salaryValues.length > 0 ? Math.max(...salaryValues) : 0;
  const hasLowEffortLanguage = /\b(?:2|two|1-2|one to two)\s+hours?\b|\bsimple work\b|\beasy income\b/i.test(normalized);
  const hasNoExperienceLanguage = /\bno experience required\b|\bfreshers?\b|\bno skills required\b/i.test(normalized);

  if (
    highestSalarySignal >= 100000 &&
    (lowerContent.includes("week") || lowerContent.includes("/week") || lowerContent.includes("per week"))
  ) {
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk + 24, 0, 100);
    redFlags.push("Unrealistic weekly compensation claim detected.");
  }

  if (highestSalarySignal >= 100000 && hasNoExperienceLanguage && hasLowEffortLanguage) {
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk + 25, 0, 100);
    redFlags.push("High income is paired with low effort and no-experience claims.");
  }

  if (
    /\b(remote|work from home|wfh|part[- ]time)\b/i.test(normalized) &&
    /\b(?:\$\s?\d{3,}|\b(?:usd|inr|rs\.?)\s?\d[\d,]*)\b/i.test(normalized) &&
    /\b(no experience required|without interview|instant joining|copy paste job|data entry)\b/i.test(normalized)
  ) {
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk + 18, 0, 100);
    redFlags.push("Unrealistic remote-work compensation is paired with very low qualification requirements.");
  }

  if (
    (lowerContent.includes("telegram") || lowerContent.includes("whatsapp")) &&
    /\b(without interview|no interview required|selected immediately|instant offer letter)\b/i.test(normalized)
  ) {
    riskDimensions.communicationRisk = clamp(riskDimensions.communicationRisk + 14, 0, 100);
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk + 10, 0, 100);
    redFlags.push("Off-platform messaging is combined with instant hiring language.");
  }

  if (riskDimensions.paymentRisk >= 20 && riskDimensions.privacyRisk >= 18) {
    riskDimensions.paymentRisk = clamp(riskDimensions.paymentRisk + 10, 0, 100);
    riskDimensions.privacyRisk = clamp(riskDimensions.privacyRisk + 8, 0, 100);
    redFlags.push("The posting asks for both money and sensitive personal information.");
  }

  if (riskDimensions.communicationRisk >= 18 && riskDimensions.credibilityRisk >= 18) {
    riskDimensions.communicationRisk = clamp(riskDimensions.communicationRisk + 8, 0, 100);
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk + 8, 0, 100);
    redFlags.push("Multiple trust and verification issues appear across the contact method and job claims.");
  }

  const companyMentionCount = countCompanyMentions(normalized, input.companyName);
  if (
    input.companyName?.trim() &&
    companyMentionCount === 0 &&
    (entities.emails.length > 0 || entities.urls.length > 0)
  ) {
    riskDimensions.impersonationRisk = clamp(riskDimensions.impersonationRisk + 14, 0, 100);
    redFlags.push("The provided company name does not appear in the message body.");
  }

  const companyToken = normalizeCompanyToken(input.companyName);
  const knownCompanyDomains = unique([
    ...entities.emails.map(extractDomain).filter((item): item is string => Boolean(item)),
    ...(input.url ? [extractDomain(input.url)].filter((item): item is string => Boolean(item)) : []),
  ]);

  if (
    companyToken &&
    knownCompanyDomains.length > 0 &&
    !knownCompanyDomains.some((domain) => domain.replace(/[^a-z0-9]/gi, "").includes(companyToken.slice(0, 6)))
  ) {
    riskDimensions.impersonationRisk = clamp(riskDimensions.impersonationRisk + 12, 0, 100);
    redFlags.push("Contact domain does not clearly match the claimed company.");
  }

  if (
    knownCompanyDomains.some((domain) =>
      /\.(xyz|tk|top|buzz|click|work|loan|icu)(?:$|\/)/i.test(domain) || /[a-z]+\d[a-z-]*\./i.test(domain)
    )
  ) {
    riskDimensions.communicationRisk = clamp(riskDimensions.communicationRisk + 16, 0, 100);
    redFlags.push("Suspicious or lookalike domain pattern detected.");
  }

  if (lowerContent.length < 80) {
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk + 6, 0, 100);
  }

  if (lowerContent.length < 140 || /\bsimple work\b|\beasy income\b|\bpart time job available\b/i.test(normalized)) {
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk + 10, 0, 100);
    redFlags.push("Job description is vague or unusually short.");
  }

  const uppercaseRatio = getUppercaseRatio(normalized);
  if (
    (uppercaseRatio > 0.42 && normalized.length > 60) ||
    /!{2,}/.test(normalized) ||
    /\b[A-Z]{5,}\b(?:\s+\b[A-Z]{4,}\b){2,}/.test(normalized)
  ) {
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk + 12, 0, 100);
    redFlags.push("Spammy capitalization or unprofessional formatting detected.");
  }

  if (entities.emails.some((email) => !isGenericEmailDomain(email))) {
    greenFlags.push("Official-looking company email is present.");
  }

  if (/\b(?:interview process|technical interview|hr round|assessment|screening round)\b/i.test(normalized)) {
    greenFlags.push("A structured interview process is described.");
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk - 6, 0, 100);
  }

  if (/\b(?:responsibilities|requirements|skills|experience|qualifications)\b/i.test(normalized) && lowerContent.length >= 180) {
    greenFlags.push("Detailed role requirements are included.");
    riskDimensions.credibilityRisk = clamp(riskDimensions.credibilityRisk - 6, 0, 100);
  }

  if (input.url && /^https:\/\//i.test(input.url) && !/\.(xyz|tk|top|buzz|click|work|loan|icu)(?:$|\/)/i.test(input.url)) {
    greenFlags.push("HTTPS job link is present.");
  }

  const weightedScore = Math.round(
    riskDimensions.paymentRisk * 0.24 +
      riskDimensions.urgencyRisk * 0.14 +
      riskDimensions.impersonationRisk * 0.19 +
      riskDimensions.privacyRisk * 0.15 +
      riskDimensions.communicationRisk * 0.14 +
      riskDimensions.credibilityRisk * 0.14
  );

  const criticalSignals = detectedSignals.filter((signal) => signal.severity === "Critical").length;
  const highSignals = detectedSignals.filter((signal) => signal.severity === "High").length;
  const scoreBoost =
    Math.min(detectedSignals.length * 3, 15) +
    criticalSignals * 6 +
    highSignals * 3 +
    (redFlags.length >= 5 ? 6 : 0);

  let riskScore = clamp(weightedScore + scoreBoost, 0, 100);

  if (criticalSignals >= 1) {
    riskScore = Math.max(riskScore, 58);
  }

  if (criticalSignals >= 1 && highSignals >= 1) {
    riskScore = Math.max(riskScore, 72);
  }

  if (detectedSignals.length >= 4) {
    riskScore = Math.max(riskScore, 64);
  }

  const riskLevel = toRiskLevel(riskScore);
  const scamType = summarizeScamType(detectedSignals);

  const suspiciousIndicators = unique([
    ...redFlags,
    ...(entities.moneyAmounts.length ? ["Monetary requests or compensation claims found."] : []),
    ...(entities.platforms.length ? [`Off-platform channels referenced: ${entities.platforms.join(", ")}.`] : []),
  ]);

  const recommendedActions = [
    riskDimensions.paymentRisk >= 40 ? "Do not send money, deposits, or purchase equipment on behalf of the recruiter." : "",
    riskDimensions.privacyRisk >= 35 ? "Do not share identity documents or banking information until the employer is independently verified." : "",
    riskDimensions.communicationRisk >= 35 ? "Move communication to the company's official domain or verified careers portal." : "",
    riskDimensions.impersonationRisk >= 30 ? "Verify the recruiter against the employer's official careers page and publicly listed HR contacts." : "",
    riskScore >= 60 ? "Verify the company via its official website, LinkedIn page, and public contact information before proceeding." : "",
    riskScore < 60 ? "Request a formal job description, company email confirmation, and interview details before sharing additional information." : "",
  ].filter(Boolean);

  return {
    riskScore,
    riskLevel,
    scamType,
    redFlags: unique(redFlags).slice(0, 8),
    greenFlags: unique(greenFlags).slice(0, 5),
    verification: buildVerificationSummary({
      officialEmailPresent: entities.emails.some(
        (email) => !isGenericEmailDomain(email)
      ),
      linkedinReferencePresent: /\blinkedin\.com\/(?:company|jobs|in)\b/i.test(normalized),
    }),
    explanation:
      detectedSignals.length > 0
        ? `Heuristic screening detected ${detectedSignals.length} suspicious signal(s), with strongest concerns around ${detectedSignals
            .slice(0, 3)
            .map((signal) => signal.label.toLowerCase())
            .join(", ")}.`
        : "Heuristic screening found limited explicit scam markers, but further review may still be required.",
    recommendedAction:
      recommendedActions[0] ??
      "Proceed carefully and verify the recruiter through official company channels before taking any action.",
    confidenceScore: clamp(48 + detectedSignals.length * 7 + (entities.urls.length > 0 ? 5 : 0), 35, 92),
    recommendedActions,
    riskDimensions,
    detectedSignals,
    suspiciousIndicators,
    extractedEntities: entities,
    requiresImmediateAttention: riskScore >= 75 || riskDimensions.paymentRisk >= 40,
    analysisVersion: ANALYSIS_VERSION,
    provider: "heuristic",
  };
}

function sanitizeAiResult(raw: unknown, fallback: AnalysisResult): Partial<AnalysisResult> {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const candidate = raw as Record<string, unknown>;
  const score =
    typeof candidate.riskScore === "number" ? clamp(Math.round(candidate.riskScore), 0, 100) : undefined;
  const confidence =
    typeof candidate.confidenceScore === "number"
      ? clamp(Math.round(candidate.confidenceScore), 0, 100)
      : undefined;
  const level =
    typeof candidate.riskLevel === "string" &&
    ["Low", "Medium", "High", "Critical"].includes(candidate.riskLevel)
      ? (candidate.riskLevel as RiskLevel)
      : undefined;

  return {
    riskScore: score,
    riskLevel: level ?? (score !== undefined ? toRiskLevel(score) : undefined),
    scamType:
      typeof candidate.scamType === "string" && candidate.scamType.trim()
        ? candidate.scamType.trim()
        : fallback.scamType,
    redFlags: Array.isArray(candidate.redFlags)
      ? unique(candidate.redFlags.filter((item): item is string => typeof item === "string")).slice(0, 10)
      : fallback.redFlags,
    greenFlags: Array.isArray(candidate.greenFlags)
      ? unique(candidate.greenFlags.filter((item): item is string => typeof item === "string")).slice(0, 6)
      : fallback.greenFlags,
    verification:
      candidate.verification && typeof candidate.verification === "object"
        ? buildVerificationSummary(candidate.verification as Partial<VerificationSummary>)
        : fallback.verification,
    explanation:
      typeof candidate.explanation === "string" && candidate.explanation.trim()
        ? candidate.explanation.trim()
        : fallback.explanation,
    recommendedAction:
      typeof candidate.recommendedAction === "string" && candidate.recommendedAction.trim()
        ? candidate.recommendedAction.trim()
        : fallback.recommendedAction,
    confidenceScore: confidence,
    suspiciousIndicators: Array.isArray(candidate.suspiciousIndicators)
      ? unique(
          candidate.suspiciousIndicators.filter((item): item is string => typeof item === "string")
        ).slice(0, 10)
      : fallback.suspiciousIndicators,
    recommendedActions: Array.isArray(candidate.recommendedActions)
      ? unique(candidate.recommendedActions.filter((item): item is string => typeof item === "string")).slice(0, 8)
      : fallback.recommendedActions,
  };
}

async function aiAnalyze(input: AnalysisInput, heuristic: AnalysisResult) {
  const groq = getGroqClient();

  if (!groq) {
    return null;
  }

  const prompt = `
You are an AI cybersecurity and recruitment fraud analyst for a job-scam detection platform.

Analyze this recruitment content with strong attention to:
- advance fee scams
- off-platform communication pressure
- identity theft and document harvesting
- fake job offers and unrealistic promises
- recruiter impersonation
- phishing links or suspicious domains
- emotional manipulation and urgency
- privacy and payment risk

Context:
- sourceType: ${input.sourceType ?? "text"}
- url: ${input.url ?? "n/a"}
- companyName: ${input.companyName ?? "n/a"}
- recruiterName: ${input.recruiterName ?? "n/a"}
- channel: ${input.channel ?? "n/a"}
- locale: ${input.locale ?? "n/a"}

Heuristic pre-screen summary:
${JSON.stringify(
    {
      riskScore: heuristic.riskScore,
      riskLevel: heuristic.riskLevel,
      scamType: heuristic.scamType,
      redFlags: heuristic.redFlags,
      greenFlags: heuristic.greenFlags,
      verification: heuristic.verification,
      riskDimensions: heuristic.riskDimensions,
      suspiciousIndicators: heuristic.suspiciousIndicators,
    },
    null,
    2
  )}

Return STRICT JSON only with this exact shape:
{
  "riskScore": number,
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "scamType": string,
  "redFlags": string[],
  "greenFlags": string[],
  "verification": {
    "domain": string | null,
    "checkedUrl": string | null,
    "websiteReachable": boolean | null,
    "usesHttps": boolean | null,
    "domainAgeDays": number | null,
    "domainRecentlyRegistered": boolean,
    "suspiciousTld": boolean,
    "officialEmailPresent": boolean,
    "officialCareersPageLikely": boolean,
    "linkedinReferencePresent": boolean,
    "verificationWarnings": string[],
    "verificationSignals": string[],
    "verificationStatus": "unverified" | "partial" | "verified" | "high-risk"
  },
  "explanation": string,
  "recommendedAction": string,
  "confidenceScore": number,
  "recommendedActions": string[],
  "suspiciousIndicators": string[]
}

Content:
${input.content}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_completion_tokens: 900,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You produce conservative, evidence-based fraud assessments. Never omit payment, impersonation, urgency, or privacy risks when present. When evidence is mixed, prefer Medium over Low and High over Medium rather than understating risk.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return JSON.parse(completion.choices[0].message.content || "{}");
}

function mergeAnalyses(heuristic: AnalysisResult, aiPartial: Partial<AnalysisResult> | null): AnalysisResult {
  if (!aiPartial) {
    return heuristic;
  }

  const mergedScore =
    typeof aiPartial.riskScore === "number"
      ? Math.max(
          heuristic.riskScore,
          clamp(Math.round(heuristic.riskScore * 0.45 + aiPartial.riskScore * 0.55), 0, 100)
        )
      : heuristic.riskScore;

  const severityOrder: RiskLevel[] = ["Low", "Medium", "High", "Critical"];
  const mergedLevel =
    aiPartial.riskLevel &&
    severityOrder.indexOf(aiPartial.riskLevel) >= severityOrder.indexOf(heuristic.riskLevel)
      ? aiPartial.riskLevel
      : toRiskLevel(mergedScore);

  const mergedFlags = unique([...(heuristic.redFlags ?? []), ...(aiPartial.redFlags ?? [])]).slice(0, 10);
  const mergedGreenFlags = unique([...(heuristic.greenFlags ?? []), ...(aiPartial.greenFlags ?? [])]).slice(0, 6);
  const mergedVerification = buildVerificationSummary({
    ...heuristic.verification,
    ...(aiPartial.verification ?? {}),
    verificationWarnings: unique([
      ...(heuristic.verification.verificationWarnings ?? []),
      ...(aiPartial.verification?.verificationWarnings ?? []),
    ]),
    verificationSignals: unique([
      ...(heuristic.verification.verificationSignals ?? []),
      ...(aiPartial.verification?.verificationSignals ?? []),
    ]),
  });
  const mergedIndicators = unique([
    ...(heuristic.suspiciousIndicators ?? []),
    ...(aiPartial.suspiciousIndicators ?? []),
  ]).slice(0, 12);
  const mergedActions = unique([
    ...(aiPartial.recommendedActions ?? []),
    ...(heuristic.recommendedActions ?? []),
  ]).slice(0, 8);

  return {
    ...heuristic,
    riskScore: mergedScore,
    riskLevel: mergedLevel,
    scamType: aiPartial.scamType ?? heuristic.scamType,
    redFlags: mergedFlags,
    greenFlags: mergedGreenFlags,
    verification: mergedVerification,
    explanation: aiPartial.explanation ?? heuristic.explanation,
    recommendedAction: aiPartial.recommendedAction ?? heuristic.recommendedAction,
    confidenceScore: clamp(
      Math.round(((aiPartial.confidenceScore ?? heuristic.confidenceScore) + heuristic.confidenceScore) / 2),
      0,
      100
    ),
    recommendedActions: mergedActions,
    suspiciousIndicators: mergedIndicators,
    requiresImmediateAttention:
      mergedScore >= 75 || heuristic.requiresImmediateAttention || mergedFlags.length >= 5,
    provider: "groq+heuristic",
  };
}

async function applyLiveVerification(input: AnalysisInput, base: AnalysisResult): Promise<AnalysisResult> {
  const candidateUrl = getPrimaryReferenceUrl(input, base.extractedEntities);
  const officialEmailPresent = base.extractedEntities.emails.some(
    (email) => !isGenericEmailDomain(email)
  );
  const linkedinReferencePresent =
    /\blinkedin\.com\/(?:company|jobs|in)\b/i.test(input.content) ||
    base.extractedEntities.urls.some((url) => /linkedin\.com/i.test(url));

  if (!candidateUrl && !officialEmailPresent) {
    const verification = buildVerificationSummary({
      ...base.verification,
      officialEmailPresent,
      linkedinReferencePresent,
      verificationWarnings: [
        ...base.verification.verificationWarnings,
        "No official website or company email was provided for verification.",
      ],
      verificationStatus: "unverified",
    });

    return {
      ...base,
      riskScore: clamp(base.riskScore + 8, 0, 100),
      riskLevel: toRiskLevel(clamp(base.riskScore + 8, 0, 100)),
      redFlags: unique([...base.redFlags, "No official website or company email was provided for verification."]).slice(0, 10),
      suspiciousIndicators: unique([
        ...base.suspiciousIndicators,
        "No official employer infrastructure was available to verify.",
      ]).slice(0, 12),
      verification,
      explanation: `${base.explanation} Live verification could not confirm any official employer infrastructure.`,
    };
  }

  const checkedUrl = candidateUrl
    ? ensureUrlProtocol(candidateUrl)
    : `https://${extractDomain(base.extractedEntities.emails[0] ?? "") ?? ""}`;
  const domain = getHostname(checkedUrl);
  const suspiciousTld = domain ? /\.(xyz|tk|top|buzz|click|work|loan|icu)$/i.test(domain) : false;
  const officialCareersPageLikely = /\/(?:careers?|jobs?|apply|recruitment)\b/i.test(checkedUrl);

  const [websiteProbe, domainAgeDays] = await Promise.all([
    probeWebsite(checkedUrl),
    domain ? lookupDomainAgeDays(domain) : Promise.resolve(null),
  ]);

  const domainRecentlyRegistered = domainAgeDays !== null && domainAgeDays < 30;
  const verificationWarnings = [...base.verification.verificationWarnings];
  const verificationSignals = [...base.verification.verificationSignals];

  let adjustedRisk = base.riskScore;
  const redFlags = [...base.redFlags];
  const greenFlags = [...base.greenFlags];
  const suspiciousIndicators = [...base.suspiciousIndicators];
  const recommendedActions = [...base.recommendedActions];

  if (!websiteProbe.ok) {
    adjustedRisk += 18;
    verificationWarnings.push("The referenced company website or job URL could not be reached.");
    redFlags.push("Official website could not be reached during live verification.");
    suspiciousIndicators.push("Live website verification failed.");
    recommendedActions.push("Do not trust the posting until the employer website and job page can be opened directly.");
  } else {
    verificationSignals.push("The referenced website responded successfully.");
    greenFlags.push("Company website responded during live verification.");
  }

  if (websiteProbe.usesHttps) {
    verificationSignals.push("The verified website uses HTTPS.");
  } else {
    adjustedRisk += 8;
    verificationWarnings.push("The verified website did not confirm HTTPS.");
    redFlags.push("Live verification did not confirm a secure HTTPS website.");
  }

  if (domainRecentlyRegistered) {
    adjustedRisk += 22;
    verificationWarnings.push(`The domain appears recently registered (${domainAgeDays} days old).`);
    redFlags.push(`Domain appears newly registered (${domainAgeDays} days old).`);
    suspiciousIndicators.push("Recently registered domains are common in scam campaigns.");
  } else if (typeof domainAgeDays === "number" && domainAgeDays >= 180) {
    verificationSignals.push(`Domain age appears established (${domainAgeDays} days old).`);
    greenFlags.push("Domain age appears established.");
    adjustedRisk -= 4;
  }

  if (suspiciousTld) {
    adjustedRisk += 14;
    verificationWarnings.push("The domain uses a high-risk or uncommon TLD often seen in scams.");
    redFlags.push("Domain uses a suspicious TLD.");
  }

  if (officialEmailPresent) {
    verificationSignals.push("A non-generic company email is present.");
    adjustedRisk -= 4;
  }

  if (officialCareersPageLikely) {
    verificationSignals.push("The URL structure resembles an official careers or jobs page.");
    greenFlags.push("URL looks like a company careers page.");
    adjustedRisk -= 4;
  }

  if (linkedinReferencePresent) {
    verificationSignals.push("LinkedIn company or recruiter reference is present.");
    greenFlags.push("LinkedIn reference found in the posting.");
    adjustedRisk -= 2;
  }

  const verificationStatus: VerificationSummary["verificationStatus"] =
    !websiteProbe.ok || domainRecentlyRegistered || suspiciousTld
      ? "high-risk"
      : websiteProbe.ok && (officialEmailPresent || officialCareersPageLikely || linkedinReferencePresent)
        ? "verified"
        : "partial";

  const riskScore = clamp(Math.round(adjustedRisk), 0, 100);
  const verification = buildVerificationSummary({
    domain,
    checkedUrl,
    websiteReachable: websiteProbe.ok,
    usesHttps: websiteProbe.usesHttps,
    domainAgeDays,
    domainRecentlyRegistered,
    suspiciousTld,
    officialEmailPresent,
    officialCareersPageLikely,
    linkedinReferencePresent,
    verificationWarnings,
    verificationSignals,
    verificationStatus,
  });

  return {
    ...base,
    riskScore,
    riskLevel: toRiskLevel(riskScore),
    redFlags: unique(redFlags).slice(0, 10),
    greenFlags: unique(greenFlags).slice(0, 6),
    suspiciousIndicators: unique(suspiciousIndicators).slice(0, 12),
    recommendedActions: unique(recommendedActions).slice(0, 8),
    recommendedAction:
      unique(recommendedActions)[0] ??
      base.recommendedAction,
    verification,
    requiresImmediateAttention:
      riskScore >= 75 || base.requiresImmediateAttention || verificationStatus === "high-risk",
    explanation: `${base.explanation} Live verification status: ${verificationStatus.replace("-", " ")}.`,
  };
}

export async function analyzeJobFraud(input: AnalysisInput): Promise<AnalysisResult> {
  const heuristic = heuristicAnalyze(input);

  try {
    const aiRaw = await aiAnalyze(input, heuristic);
    const sanitized = sanitizeAiResult(aiRaw, heuristic);
    const merged = mergeAnalyses(heuristic, sanitized);
    return await applyLiveVerification(input, merged);
  } catch (error) {
    console.error("Groq Analysis Error:", error);
    return await applyLiveVerification(input, heuristic);
  }
}
