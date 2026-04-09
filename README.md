# Gene2Care AI: Clinical Genomics Intelligence Platform

https://youtu.be/JTAtPIiw_-Q?si=uohmZXLbZPupiL_j

Gene2Care AI is an advanced clinical reasoning system designed to bridge the gap between raw genomic data and actionable medical care. By leveraging state-of-the-art LLM reasoning (Google Gemini), the platform transforms complex genetic variants into structured clinical insights for both healthcare providers and patients.

## 🧬 Core Workflow: The Biological Chain Reaction

The platform follows a strict biomedical reasoning pipeline to ensure clinical-grade interpretation:
**Gene → Protein → Pathway → Disease → Treatment**

1.  **Mutation Interpretation**: Identification of the gene and molecular impact (HGVS/VCF).
2.  **Protein Impact**: Analysis of structural and functional alterations in the encoded protein.
3.  **Pathway Mapping**: Visualization of disrupted biological pathways (e.g., DNA Repair, Ion Transport).
4.  **Disease Prediction**: Evidence-based risk scoring for hereditary and somatic conditions.
5.  **Precision Treatment**: Targeted therapy suggestions, lifestyle modifications, and screening protocols.

## 🚀 Key Features

### 1. Dual-Perspective Interface
The application features a unique **Perspective Switcher** that reconfigures the UI for two distinct user groups:
*   **Clinician Portal**: High-density data, technical terminology, molecular reasoning, and "Red Flag" alerts.
*   **Patient Portal**: Approachable "Health Summaries," simplified risk assessments, and actionable lifestyle tips.

### 2. Clinician Decision-Driven Model
The platform incorporates a specialized decision support layer for healthcare providers:
*   **Evidence Stratification**: Grading of clinical evidence (Levels 1-4) for each finding.
*   **Guideline Alignment**: Automatic mapping of variants to **ACMG (American College of Medical Genetics)** classifications.
*   **Differential Diagnosis**: AI-suggested alternative diagnoses to consider based on the genomic-phenotypic overlap.
*   **Clinical Actionability**: Clear statements on how the genomic data should influence immediate clinical decisions.

### 3. Clinical Sample Cases (MedPaLM Inspired)
Pre-loaded high-fidelity samples allow users to demonstrate the system's reasoning capabilities:
*   **Lynch Syndrome (MLH1)**: DNA mismatch repair disruption.
*   **Cystic Fibrosis (CFTR)**: Ion transport and protein folding analysis.
*   **Familial Hypercholesterolemia (LDLR)**: Cholesterol receptor pathway disruption.

### 3. Insights Dashboard
Real-time data visualization using **Recharts** to monitor:
*   Genomic analysis volume and trends.
*   Risk level distribution across the patient population.
*   Live activity feeds of biological chain reactions.

### 4. Case History Vault
A secure, searchable repository of all previous analyses, allowing for longitudinal tracking of patient genomic health.

## 🛠 Technology Stack

*   **Framework**: React 19 (TypeScript)
*   **AI Engine**: Google Gemini (via `@google/genai`)
*   **Styling**: Tailwind CSS
*   **Animations**: Motion (framer-motion)
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **Markdown**: React Markdown

## 🚦 Getting Started

### Prerequisites
*   Node.js 18+
*   A Google Gemini API Key (set as `GEMINI_API_KEY` in environment variables)

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## ⚠️ Benign Errors
In the AI Studio development environment, you may see a console error:
`[vite] failed to connect to websocket`.
This is **benign** and expected behavior due to Hot Module Replacement (HMR) being disabled for stability during AI code generation. It does not affect application performance.

## 🛡 Disclaimer
Gene2Care AI is a clinical reasoning **demonstrator**. All generated insights should be verified by a board-certified geneticist or medical professional before being used in a clinical setting.
