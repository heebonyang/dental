// ──────────────────────────────────────────────────────────
// AI ANALYSIS SERVICE
// ──────────────────────────────────────────────────────────
// Architecture:
//   1. MockAIService  — built-in keyword extractor (no API key needed)
//   2. ClaudeAIService — plug-in slot for Anthropic Claude API
//   3. OpenAIService  — plug-in slot for OpenAI GPT API
//   4. CustomAPIService — generic REST endpoint slot
//
// To activate a real service, set NEXT_PUBLIC_AI_PROVIDER in .env.local
// ──────────────────────────────────────────────────────────

import type {
  AIAnalysisInput,
  AIAnalysisResult,
  AIAnalysisService,
  AIKeyword,
  DiagnosisSuggestion,
  RecommendedTreatment,
} from "./types";

// ── Keyword dictionary ────────────────────────────────────
interface KeywordDef {
  terms: string[];
  category: AIKeyword["category"];
  relevance: number;
}

const KEYWORD_DICTIONARY: KeywordDef[] = [
  // Conditions
  { terms: ["caries","cavity","cavities","충치","우식","decay","decayed","우식증"],              category: "condition", relevance: 0.95 },
  { terms: ["periodontal","periodontitis","gingivitis","치주","잇몸병","gum disease","치주염"],  category: "condition", relevance: 0.93 },
  { terms: ["abscess","농양","infection","감염"],                                                 category: "condition", relevance: 0.91 },
  { terms: ["fracture","frx","crack","cracked","균열","파절","치아균열"],                        category: "condition", relevance: 0.90 },
  { terms: ["impacted","매복","매복치"],                                                          category: "condition", relevance: 0.88 },
  { terms: ["calculus","tartar","치석","plaque","치태"],                                          category: "condition", relevance: 0.80 },
  { terms: ["mobility","동요도","loose tooth","흔들림"],                                          category: "condition", relevance: 0.85 },
  { terms: ["furcation","치근분지부"],                                                            category: "condition", relevance: 0.87 },
  { terms: ["recession","치은퇴축","gingival recession"],                                        category: "condition", relevance: 0.82 },
  { terms: ["erosion","마모","abrasion","attrition","마모증"],                                   category: "condition", relevance: 0.78 },
  { terms: ["sensitivity","시림","hypersensitivity","과민반응","민감"],                          category: "symptom",   relevance: 0.82 },
  { terms: ["pain","통증","ache","아픔","tender","tenderness","두드림 통증"],                     category: "symptom",   relevance: 0.88 },
  { terms: ["swelling","부종","edema","붓기"],                                                   category: "symptom",   relevance: 0.86 },
  { terms: ["bleeding","출혈","피가 남","blood on probing","bop"],                               category: "symptom",   relevance: 0.84 },
  { terms: ["halitosis","bad breath","구취"],                                                    category: "symptom",   relevance: 0.75 },
  // Treatments
  { terms: ["extraction","발치","exo","뽑기"],                                                  category: "treatment", relevance: 0.93 },
  { terms: ["root canal","rct","endodontic","신경치료","근관치료"],                              category: "treatment", relevance: 0.95 },
  { terms: ["filling","restoration","충전","레진","수복"],                                       category: "treatment", relevance: 0.90 },
  { terms: ["crown","크라운","보철","cap","dental cap"],                                         category: "treatment", relevance: 0.90 },
  { terms: ["implant","임플란트","fixture","픽스쳐"],                                            category: "treatment", relevance: 0.92 },
  { terms: ["scaling","스케일링","prophylaxis","치석제거","supra","subgingival"],                category: "treatment", relevance: 0.88 },
  { terms: ["bridge","브릿지","fixed partial denture","fpd"],                                   category: "treatment", relevance: 0.88 },
  { terms: ["sealant","실란트","pit and fissure"],                                              category: "treatment", relevance: 0.80 },
  { terms: ["bleaching","whitening","미백"],                                                    category: "treatment", relevance: 0.75 },
  { terms: ["veneer","베니어","라미네이트"],                                                     category: "treatment", relevance: 0.80 },
  { terms: ["splint","교합안정장치","night guard","나이트가드"],                                  category: "treatment", relevance: 0.78 },
  // Anatomy
  { terms: ["molar","구치","대구치","어금니"],                                                   category: "anatomy",   relevance: 0.70 },
  { terms: ["premolar","소구치","프리몰라"],                                                     category: "anatomy",   relevance: 0.70 },
  { terms: ["incisor","전치","앞니"],                                                            category: "anatomy",   relevance: 0.70 },
  { terms: ["canine","견치","송곳니"],                                                           category: "anatomy",   relevance: 0.70 },
  { terms: ["wisdom tooth","third molar","사랑니","#17","#16","#26","#27","#36","#37","#46","#47"], category: "anatomy", relevance: 0.72 },
  { terms: ["enamel","법랑질"],                                                                 category: "anatomy",   relevance: 0.65 },
  { terms: ["dentin","상아질","dentine"],                                                       category: "anatomy",   relevance: 0.65 },
  { terms: ["pulp","치수"],                                                                     category: "anatomy",   relevance: 0.72 },
  { terms: ["root","치근"],                                                                     category: "anatomy",   relevance: 0.65 },
  { terms: ["mesial","distal","occlusal","buccal","lingual","incisal"],                        category: "anatomy",   relevance: 0.60 },
  // Materials
  { terms: ["composite","레진","resin","GC","glass ionomer"],                                  category: "material",  relevance: 0.75 },
  { terms: ["amalgam","아말감"],                                                                 category: "material",  relevance: 0.75 },
  { terms: ["zirconia","지르코니아"],                                                            category: "material",  relevance: 0.78 },
  { terms: ["gold","골드","금"],                                                                  category: "material",  relevance: 0.73 },
  { terms: ["pfm","porcelain fused"],                                                           category: "material",  relevance: 0.75 },
  { terms: ["gutta percha","거터퍼챠"],                                                         category: "material",  relevance: 0.72 },
  // Modifiers / context
  { terms: ["acute","만성","chronic","진행성","progressive","stable","안정"],                   category: "modifier",  relevance: 0.60 },
  { terms: ["generalized","전반적","localized","국소적"],                                       category: "modifier",  relevance: 0.60 },
  { terms: ["watch","monitor","recall","관찰","경과관찰"],                                       category: "modifier",  relevance: 0.65 },
];

// ── Diagnosis inference rules ──────────────────────────────
interface DiagnosisRule {
  triggers: string[];    // keywords that activate this rule
  diagnosis: string;
  icdCode: string | null;
  severity: DiagnosisSuggestion["severity"];
  evidenceKey: string;
}

const DIAGNOSIS_RULES: DiagnosisRule[] = [
  { triggers: ["caries","cavity","decay","충치","우식"],          diagnosis: "Dental caries",                icdCode: "K02.9", severity: "moderate", evidenceKey: "Caries-related terms detected" },
  { triggers: ["periodontal","periodontitis","furcation","BOP"],  diagnosis: "Periodontitis",                icdCode: "K05.3", severity: "moderate", evidenceKey: "Periodontal indicators detected" },
  { triggers: ["gingivitis","bleeding","출혈"],                   diagnosis: "Gingivitis",                   icdCode: "K05.1", severity: "mild",     evidenceKey: "Bleeding/gingivitis terms detected" },
  { triggers: ["pulp","pulpitis","root canal","신경","통증"],      diagnosis: "Pulpitis / Irreversible pulpitis", icdCode: "K04.0", severity: "severe", evidenceKey: "Pulp-related terms detected" },
  { triggers: ["abscess","농양","infection","감염"],              diagnosis: "Periapical abscess",           icdCode: "K04.6", severity: "severe", evidenceKey: "Abscess/infection terms detected" },
  { triggers: ["fracture","crack","파절"],                        diagnosis: "Tooth fracture / Cracked tooth syndrome", icdCode: "S02.5", severity: "moderate", evidenceKey: "Fracture terms detected" },
  { triggers: ["impacted","매복"],                                diagnosis: "Impacted tooth",               icdCode: "K01.1", severity: "moderate", evidenceKey: "Impaction terms detected" },
  { triggers: ["erosion","abrasion","attrition","마모"],          diagnosis: "Tooth wear / Erosion",         icdCode: "K03.2", severity: "mild",     evidenceKey: "Wear/erosion terms detected" },
  { triggers: ["sensitivity","시림","hypersensitivity"],          diagnosis: "Dentine hypersensitivity",     icdCode: "K03.9", severity: "mild",     evidenceKey: "Sensitivity terms detected" },
  { triggers: ["recession","치은퇴축"],                          diagnosis: "Gingival recession",           icdCode: "K06.0", severity: "mild",     evidenceKey: "Recession terms detected" },
];

// ── Mock analysis engine ───────────────────────────────────
function extractKeywords(text: string): AIKeyword[] {
  const lower = text.toLowerCase();
  const found: AIKeyword[] = [];
  const seen = new Set<string>();

  for (const def of KEYWORD_DICTIONARY) {
    for (const term of def.terms) {
      if (lower.includes(term.toLowerCase()) && !seen.has(def.terms[0])) {
        seen.add(def.terms[0]);
        found.push({
          term: def.terms[0],                // canonical form
          category: def.category,
          relevance: def.relevance,
          linkedToothIds: [],                // can be enriched with tooth context
        });
        break;
      }
    }
  }

  // Sort by relevance desc
  return found.sort((a, b) => b.relevance - a.relevance);
}

function inferDiagnoses(
  keywords: AIKeyword[]
): DiagnosisSuggestion[] {
  const kwTerms = keywords.map((k) => k.term.toLowerCase());
  const suggestions: DiagnosisSuggestion[] = [];

  for (const rule of DIAGNOSIS_RULES) {
    const matched = rule.triggers.filter((t) =>
      kwTerms.some((k) => k.includes(t.toLowerCase()) || t.toLowerCase().includes(k))
    );
    if (matched.length > 0) {
      const confidence = Math.min(
        0.95,
        0.5 + matched.length * 0.12
      );
      suggestions.push({
        diagnosis: rule.diagnosis,
        icdCode: rule.icdCode,
        confidence,
        evidenceBasis: [rule.evidenceKey, ...matched],
        severity: rule.severity,
      });
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

function buildRecommendations(
  diagnoses: DiagnosisSuggestion[]
): RecommendedTreatment[] {
  const recs: RecommendedTreatment[] = [];
  const seen = new Set<string>();

  const map: Record<string, { action: string; priority: RecommendedTreatment["priority"] }> = {
    "Dental caries":                  { action: "레진 수복 또는 인레이 치료 (Composite restoration or inlay)", priority: "soon" },
    "Periodontitis":                  { action: "치주 스케일링 및 치근면 활택술 (Scaling & root planing)", priority: "soon" },
    "Gingivitis":                     { action: "구강위생 지도 및 스케일링 (OHI + prophylaxis)", priority: "soon" },
    "Pulpitis / Irreversible pulpitis":{ action: "근관치료 (Root canal treatment)", priority: "immediate" },
    "Periapical abscess":             { action: "즉시 근관치료 또는 발치 (Emergency RCT or extraction)", priority: "immediate" },
    "Tooth fracture / Cracked tooth syndrome": { action: "크라운 보호 또는 발치 평가 (Crown or extraction assessment)", priority: "soon" },
    "Impacted tooth":                 { action: "파노라마 촬영 후 발치 계획 수립 (Panoramic X-ray + extraction plan)", priority: "elective" },
    "Tooth wear / Erosion":           { action: "식이 상담 및 나이트가드 제작 (Diet counseling + night guard)", priority: "elective" },
    "Dentine hypersensitivity":       { action: "지각 과민 처치 (Desensitizing treatment)", priority: "elective" },
    "Gingival recession":             { action: "잇몸 이식 또는 치아경부 수복 평가 (Graft or cervical restoration assessment)", priority: "elective" },
  };

  for (const diag of diagnoses) {
    const m = map[diag.diagnosis];
    if (m && !seen.has(m.action)) {
      seen.add(m.action);
      recs.push({
        action: m.action,
        priority: m.priority,
        linkedToothIds: [],
        estimatedSessions: null,
      });
    }
  }

  return recs;
}

// ──────────────────────────────────────────────────────────
// MOCK AI SERVICE (works without any API key)
// ──────────────────────────────────────────────────────────
export const MockAIService: AIAnalysisService = {
  name: "Mock Dental NLP Engine v1.0",
  isConfigured: true,

  async analyze(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    // Simulate network latency for realism
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const keywords = extractKeywords(input.noteText);
    const diagnoses = inferDiagnoses(keywords);
    const treatments = buildRecommendations(diagnoses);

    const urgency: AIAnalysisResult["urgencyLevel"] =
      diagnoses.some((d) => d.severity === "severe") ? "emergency"
      : diagnoses.some((d) => d.severity === "moderate") ? "urgent"
      : "routine";

    const confidence = keywords.length === 0
      ? 0
      : Math.min(0.92, 0.45 + keywords.length * 0.04);

    return {
      keywords,
      suggestedDiagnoses: diagnoses,
      urgencyLevel: urgency,
      recommendedTreatments: treatments,
      confidence,
      analyzedAt: new Date().toISOString(),
      modelId: "mock-dental-nlp-v1.0",
      tokenCount: input.noteText.split(/\s+/).length,
    };
  },
};

// ──────────────────────────────────────────────────────────
// CLAUDE AI SERVICE SLOT
// Set NEXT_PUBLIC_CLAUDE_API_KEY + NEXT_PUBLIC_AI_PROVIDER=claude
// ──────────────────────────────────────────────────────────
export const ClaudeAIService: AIAnalysisService = {
  name: "Claude (Anthropic)",
  isConfigured: false, // flip to true when API key is configured

  async analyze(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const apiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
    if (!apiKey) throw new Error("Claude API key not configured");

    const systemPrompt = `You are an expert dental AI assistant. Analyze the provided clinical note and return a structured JSON object conforming exactly to the AIAnalysisResult interface. Extract dental keywords, suggest diagnoses with ICD-10 codes, and recommend treatments. Respond ONLY with valid JSON.`;

    const userMessage = `Analyze this dental clinical note:\n\n"${input.noteText}"\n\nPatient context: ${JSON.stringify(input.patientContext ?? {})}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
    const data = await response.json();
    const jsonText = data.content[0].text;
    return JSON.parse(jsonText) as AIAnalysisResult;
  },
};

// ──────────────────────────────────────────────────────────
// OPENAI SERVICE SLOT
// Set NEXT_PUBLIC_OPENAI_API_KEY + NEXT_PUBLIC_AI_PROVIDER=openai
// ──────────────────────────────────────────────────────────
export const OpenAIService: AIAnalysisService = {
  name: "GPT-4o (OpenAI)",
  isConfigured: false,

  async analyze(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an expert dental AI. Return structured JSON analysis of the clinical note.",
          },
          {
            role: "user",
            content: `Analyze: "${input.noteText}"`,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content) as AIAnalysisResult;
  },
};

// ──────────────────────────────────────────────────────────
// CUSTOM REST API SLOT
// Set NEXT_PUBLIC_CUSTOM_AI_ENDPOINT in .env.local
// ──────────────────────────────────────────────────────────
export const CustomAPIService: AIAnalysisService = {
  name: "Custom AI Endpoint",
  isConfigured: !!process.env.NEXT_PUBLIC_CUSTOM_AI_ENDPOINT,

  async analyze(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const endpoint = process.env.NEXT_PUBLIC_CUSTOM_AI_ENDPOINT;
    if (!endpoint) throw new Error("Custom AI endpoint not configured");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) throw new Error(`Custom API error: ${response.status}`);
    return response.json() as Promise<AIAnalysisResult>;
  },
};

// ── Service resolver ───────────────────────────────────────
export function getActiveAIService(): AIAnalysisService {
  const provider = process.env.NEXT_PUBLIC_AI_PROVIDER ?? "mock";
  switch (provider) {
    case "claude": return ClaudeAIService;
    case "openai": return OpenAIService;
    case "custom": return CustomAPIService;
    default:       return MockAIService;
  }
}
