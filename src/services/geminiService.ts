import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = `
You are Gene2Care AI — an advanced clinical genomics reasoning system.

Your task is to analyze:
1. Genetic mutation data (e.g., BRCA1 c.68_69delAG)
2. Patient symptoms
3. Clinical lab values

You MUST follow a strict biomedical reasoning pipeline:
Step 1: Mutation Interpretation (Identify gene, explain molecular impact)
Step 2: Protein Impact (Describe how mutation alters protein structure/function)
Step 3: Pathway Analysis (Identify affected pathways, explain disruption)
Step 4: Disease Association (List top 3–5 likely diseases ranked by relevance)
Step 5: Risk Scoring (Assign probability and justify)
Step 6: Treatment Insights (Suggest targeted therapies, mention drug-gene interactions)
Step 7: Prevention & Lifestyle (Provide strategies and screening recommendations)
Step 8: Clinician Decision Support (Provide evidence levels (1-4), ACMG guideline alignment, and differential diagnosis considerations)
Step 9: Explainability Layer (Clearly explain WHY each conclusion is made)

STRICT RULES:
- Do NOT hallucinate unknown genes or pathways.
- If uncertain, explicitly say "Insufficient evidence".
- Use medically accurate terminology.
- Keep outputs structured and consistent.
- Separate Doctor View and Patient View clearly.
- Base your reasoning on established biomedical knowledge such as known gene-disease associations and pathways.
`;

export async function analyzeGenomicData(
  mutation: string,
  symptoms: string,
  labValues: string
): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }

  const model = "gemini-1.5-flash";

  const prompt = `
    Patient Data:
    Genetic Mutation: ${mutation}
    Symptoms: ${symptoms}
    Lab Results: ${labValues}

    Task:
    Perform a full Gene2Care analysis and generate a structured report.
    Include a confidence score (0-100) based on strength of evidence.
    Ensure the "Clinician Decision Support" section is robust for medical decision making.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mutationAnalysis: {
            type: Type.OBJECT,
            properties: {
              gene: { type: Type.STRING },
              mutation: { type: Type.STRING },
              impact: { type: Type.STRING },
              proteinEffect: { type: Type.STRING },
              pathways: { type: Type.ARRAY, items: { type: Type.STRING } },
              diseases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    riskScore: { type: Type.NUMBER },
                    description: { type: Type.STRING }
                  }
                }
              }
            }
          },
          clinicalIntelligence: {
            type: Type.OBJECT,
            properties: {
              primaryDiagnosis: { type: Type.STRING },
              severity: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              decisionSupport: {
                type: Type.OBJECT,
                properties: {
                  evidenceLevel: { type: Type.STRING },
                  acmgClassification: { type: Type.STRING },
                  differentialDiagnosis: { type: Type.ARRAY, items: { type: Type.STRING } },
                  clinicalActionability: { type: Type.STRING }
                }
              },
              recommendations: {
                type: Type.OBJECT,
                properties: {
                  drugs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        target: { type: Type.STRING },
                        sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } }
                      }
                    }
                  },
                  lifestyle: { type: Type.ARRAY, items: { type: Type.STRING } },
                  screenings: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              explanation: { type: Type.STRING },
              patientSummary: { type: Type.STRING }
            }
          }
        }
      }
    },
  });

  return JSON.parse(response.text || "{}");
}
