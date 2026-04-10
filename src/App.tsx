import React, { useState } from 'react';
import { 
  Dna, 
  Activity, 
  Stethoscope, 
  ShieldAlert, 
  Microscope, 
  Pill, 
  HeartPulse, 
  ChevronRight, 
  Loader2,
  FileText,
  AlertTriangle,
  Info,
  LayoutDashboard,
  FlaskConical,
  History,
  Settings,
  LogOut,
  Search,
  Bell,
  User,
  ExternalLink,
  Target,
  Zap,
  BookOpen,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { analyzeGenomicData } from './services/geminiService';
import { AnalysisResult } from './types';
import { cn } from './lib/utils';

const CHART_COLORS = ['#141414', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

const MOCK_DASHBOARD_DATA = {
  distribution: [
    { name: 'BRCA1', count: 450 },
    { name: 'TP53', count: 320 },
    { name: 'EGFR', count: 280 },
    { name: 'KRAS', count: 210 },
    { name: 'PTEN', count: 180 },
  ],
  riskLevels: [
    { name: 'Critical', value: 15, color: '#EF4444' },
    { name: 'High', value: 35, color: '#F97316' },
    { name: 'Moderate', value: 30, color: '#3B82F6' },
    { name: 'Low', value: 20, color: '#10B981' },
  ],
  monthlyTrend: [
    { month: 'Jan', analyses: 85 },
    { month: 'Feb', analyses: 120 },
    { month: 'Mar', analyses: 190 },
    { month: 'Apr', analyses: 240 },
    { month: 'May', analyses: 310 },
    { month: 'Jun', analyses: 450 },
  ]
};

const MOCK_HISTORY = [
  { id: 'CASE-8902', patient: 'Anonymous-F', mutation: 'MLH1 c.1852_1854delAAG', date: '2026-04-08', risk: 'High', status: 'Finalized' },
  { id: 'CASE-8895', patient: 'Anonymous-G', mutation: 'CFTR p.Phe508del', date: '2026-04-07', risk: 'Critical', status: 'Finalized' },
  { id: 'CASE-8890', patient: 'Anonymous-H', mutation: 'LDLR p.Glu101Lys', date: '2026-04-06', risk: 'High', status: 'Finalized' },
  { id: 'CASE-8821', patient: 'Anonymous-A', mutation: 'BRCA1 c.68_69delAG', date: '2026-04-05', risk: 'Critical', status: 'Finalized' },
  { id: 'CASE-8819', patient: 'Anonymous-B', mutation: 'TP53 p.R248Q', date: '2026-04-03', risk: 'High', status: 'Finalized' },
  { id: 'CASE-8815', patient: 'Anonymous-C', mutation: 'EGFR L858R', date: '2026-04-01', risk: 'Moderate', status: 'Pending Review' },
  { id: 'CASE-8798', patient: 'Anonymous-D', mutation: 'KRAS G12D', date: '2026-03-28', risk: 'High', status: 'Finalized' },
];

const MOCK_LYNCH_RESULT: AnalysisResult = {
  mutationAnalysis: {
    gene: "MLH1",
    mutation: "c.1852_1854delAAG",
    impact: "This deletion causes a frameshift mutation in the MLH1 gene, leading to a truncated and non-functional protein.",
    proteinEffect: "The MLH1 protein is a key component of the DNA mismatch repair (MMR) complex. This mutation disrupts its ability to bind with PMS2, effectively disabling the MMR system.",
    pathways: ["DNA Mismatch Repair", "Cell Cycle Regulation", "Genomic Stability"],
    diseases: [
      { name: "Lynch Syndrome", riskScore: 0.95, description: "Hereditary non-polyposis colorectal cancer (HNPCC)." },
      { name: "Colorectal Cancer", riskScore: 0.85, description: "High risk of early-onset colorectal adenocarcinoma." },
      { name: "Endometrial Cancer", riskScore: 0.45, description: "Increased risk in female patients." }
    ]
  },
  clinicalIntelligence: {
    primaryDiagnosis: "Lynch Syndrome (MLH1-associated)",
    severity: "High",
    confidenceScore: 98,
    redFlags: ["MSI-High Status", "Early-onset Family History", "Abdominal Pain"],
    decisionSupport: {
      evidenceLevel: "Level 1",
      acmgClassification: "Pathogenic",
      differentialDiagnosis: ["Constitutional Mismatch Repair Deficiency (CMMRD)", "Muir-Torre Syndrome"],
      clinicalActionability: "Immediate referral to genetic counseling and high-frequency colonoscopy (every 1-2 years) is indicated."
    },
    recommendations: {
      drugs: [
        { name: "Pembrolizumab", target: "PD-1", sideEffects: ["Fatigue", "Rash", "Colitis"] },
        { name: "Aspirin", target: "COX-1/2", sideEffects: ["GI Bleed", "Tinnitus"] }
      ],
      lifestyle: ["High-fiber diet", "Regular physical activity", "Smoking cessation"],
      screenings: ["Colonoscopy every 12 months", "Endometrial biopsy (annual)", "Transvaginal ultrasound"]
    },
    explanation: "The patient presents with a pathogenic deletion in MLH1 and MSI-H status, which are hallmarks of Lynch Syndrome. The molecular disruption of the MMR pathway leads to rapid accumulation of mutations, significantly increasing cancer risk.",
    patientSummary: "Your genetic test shows a change in the MLH1 gene. This means your body has a harder time fixing small errors in your DNA. This condition, called Lynch Syndrome, increases the risk of certain cancers, but with regular check-ups and the right care plan, we can manage these risks effectively."
  }
};

const MOCK_CF_RESULT: AnalysisResult = {
  mutationAnalysis: {
    gene: "CFTR",
    mutation: "p.Phe508del",
    impact: "This classic deletion of phenylalanine at position 508 leads to severe misfolding of the CFTR protein.",
    proteinEffect: "The misfolded CFTR protein is recognized by cellular quality control mechanisms and degraded in the endoplasmic reticulum, preventing it from reaching the cell surface to function as a chloride channel.",
    pathways: ["Ion Transport", "Protein Folding & Trafficking", "Mucociliary Clearance"],
    diseases: [
      { name: "Cystic Fibrosis", riskScore: 0.99, description: "Multisystem disorder affecting lungs, pancreas, and sweat glands." },
      { name: "Bronchiectasis", riskScore: 0.90, description: "Permanent enlargement of parts of the airways of the lung." },
      { name: "Pancreatic Insufficiency", riskScore: 0.80, description: "Inability of the pancreas to produce enough enzymes for digestion." }
    ]
  },
  clinicalIntelligence: {
    primaryDiagnosis: "Cystic Fibrosis (Classic Phenotype)",
    severity: "Critical",
    confidenceScore: 100,
    redFlags: ["Sweat Chloride > 60 mmol/L", "Recurrent Pseudomonas infections", "Failure to thrive"],
    decisionSupport: {
      evidenceLevel: "Level 1",
      acmgClassification: "Pathogenic",
      differentialDiagnosis: ["Primary Ciliary Dyskinesia", "Shwachman-Diamond Syndrome"],
      clinicalActionability: "Immediate initiation of CFTR modulator therapy (e.g., Elexacaftor/Tezacaftor/Ivacaftor) and referral to a CF care center."
    },
    recommendations: {
      drugs: [
        { name: "Trikafta", target: "CFTR Protein", sideEffects: ["Liver enzyme elevation", "Abdominal pain"] },
        { name: "Tobramycin (Inhaled)", target: "Bacterial Ribosome", sideEffects: ["Voice alteration", "Tinnitus"] }
      ],
      lifestyle: ["High-calorie diet", "Chest physiotherapy", "Airway clearance techniques"],
      screenings: ["Sputum culture (quarterly)", "Pulmonary function tests", "Abdominal ultrasound"]
    },
    explanation: "The p.Phe508del mutation is the most common cause of CF. It results in a 'Class II' defect where the protein never reaches the cell membrane, leading to thick mucus and systemic complications.",
    patientSummary: "Your test confirms Cystic Fibrosis caused by the common F508del mutation. This means your body's salt-moving system doesn't work correctly, leading to thick mucus in the lungs and digestive system. Modern 'modulator' drugs can now target the root cause of this protein error."
  }
};

const MOCK_FH_RESULT: AnalysisResult = {
  mutationAnalysis: {
    gene: "LDLR",
    mutation: "p.Glu101Lys",
    impact: "A missense mutation in the ligand-binding domain of the LDL receptor.",
    proteinEffect: "This mutation reduces the receptor's affinity for LDL particles, significantly impairing the liver's ability to clear 'bad' cholesterol from the bloodstream.",
    pathways: ["Lipid Metabolism", "Receptor-Mediated Endocytosis", "Cholesterol Homeostasis"],
    diseases: [
      { name: "Familial Hypercholesterolemia", riskScore: 0.92, description: "Genetic disorder characterized by very high LDL cholesterol levels." },
      { name: "Coronary Artery Disease", riskScore: 0.75, description: "Early-onset atherosclerosis and heart disease risk." },
      { name: "Xanthomatosis", riskScore: 0.40, description: "Cholesterol deposits in tendons or skin." }
    ]
  },
  clinicalIntelligence: {
    primaryDiagnosis: "HeFH (Heterozygous Familial Hypercholesterolemia)",
    severity: "High",
    confidenceScore: 95,
    redFlags: ["LDL-C > 190 mg/dL", "Family history of early MI", "Tendon Xanthomas"],
    decisionSupport: {
      evidenceLevel: "Level 1",
      acmgClassification: "Pathogenic",
      differentialDiagnosis: ["Sitosterolemia", "Lysosomal Acid Lipase Deficiency"],
      clinicalActionability: "Aggressive lipid-lowering therapy required to reach LDL-C goal < 70 mg/dL (or 50% reduction)."
    },
    recommendations: {
      drugs: [
        { name: "Atorvastatin", target: "HMG-CoA Reductase", sideEffects: ["Myalgia", "Liver enzyme elevation"] },
        { name: "Evolocumab (PCSK9i)", target: "PCSK9", sideEffects: ["Injection site reaction", "Nasopharyngitis"] }
      ],
      lifestyle: ["Heart-healthy diet (DASH/Mediterranean)", "Aerobic exercise 150min/week", "Weight management"],
      screenings: ["Lipid panel every 3 months", "Carotid intima-media thickness", "Cardiac CT (Calcium score)"]
    },
    explanation: "The LDLR mutation prevents efficient removal of LDL from circulation. This leads to lifelong exposure to high cholesterol, accelerating plaque buildup in the arteries from a young age.",
    patientSummary: "You have a genetic condition called FH that makes your cholesterol very high, regardless of diet. Your liver can't 'grab' the cholesterol out of your blood effectively. Starting treatment early is the best way to protect your heart and prevent future issues."
  }
};

const CLINICAL_SAMPLES = [
  {
    name: "Lynch Syndrome",
    mutation: "MLH1 c.1852_1854delAAG",
    symptoms: "History of early-onset colorectal cancer in family, persistent abdominal pain",
    lab: "Microsatellite Instability (MSI-H) detected in biopsy",
    icon: ShieldAlert,
    result: MOCK_LYNCH_RESULT
  },
  {
    name: "Cystic Fibrosis",
    mutation: "CFTR p.Phe508del",
    symptoms: "Chronic cough, recurrent lung infections, salty-tasting skin",
    lab: "Sweat chloride test: 85 mmol/L",
    icon: Activity,
    result: MOCK_CF_RESULT
  },
  {
    name: "FH (Cholesterol)",
    mutation: "LDLR p.Glu101Lys",
    symptoms: "Xanthomas on Achilles tendon, early-onset CAD",
    lab: "LDL-C: 280 mg/dL",
    icon: HeartPulse,
    result: MOCK_FH_RESULT
  }
];

type View = 'overview' | 'analysis' | 'dashboard' | 'history';

export default function App() {
  const [activeView, setActiveView] = useState<View>('analysis');
  const [mutation, setMutation] = useState('MLH1 c.1852_1854delAAG');
  const [symptoms, setSymptoms] = useState('History of early-onset colorectal cancer in family, persistent abdominal pain');
  const [labValues, setLabValues] = useState('Microsatellite Instability (MSI-H) detected in biopsy');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(MOCK_LYNCH_RESULT);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'doctor' | 'patient'>('doctor');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeGenomicData(mutation, symptoms, labValues);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: View, icon: any, label: string }) => (
    <button
      onClick={() => setActiveView(id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        activeView === id 
          ? "bg-[#141414] text-white shadow-lg shadow-black/10" 
          : "text-gray-500 hover:bg-gray-100 hover:text-[#141414]"
      )}
    >
      <Icon size={20} className={cn(activeView === id ? "text-white" : "group-hover:text-[#141414]")} />
      <span className="text-sm font-medium tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#141414] font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen z-50">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#141414] text-white rounded-xl">
              <Dna size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none">Gene2Care</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1 font-semibold">AI Intelligence</p>
            </div>
          </div>

          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button 
              onClick={() => setViewMode('doctor')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                viewMode === 'doctor' ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Stethoscope size={14} /> Clinician
            </button>
            <button 
              onClick={() => setViewMode('patient')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                viewMode === 'patient' ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <HeartPulse size={14} /> Patient
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="px-4 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              {viewMode === 'doctor' ? 'Clinical Menu' : 'Patient Portal'}
            </p>
          </div>
          <SidebarItem 
            id="overview" 
            icon={BookOpen} 
            label={viewMode === 'doctor' ? "Project Overview" : "About Gene2Care"} 
          />
          <SidebarItem 
            id="analysis" 
            icon={FlaskConical} 
            label={viewMode === 'doctor' ? "Genomic Analysis" : "My Health Analysis"} 
          />
          <SidebarItem 
            id="dashboard" 
            icon={LayoutDashboard} 
            label={viewMode === 'doctor' ? "Insights Dashboard" : "Health Dashboard"} 
          />
          <SidebarItem 
            id="history" 
            icon={History} 
            label={viewMode === 'doctor' ? "Case History" : "My Reports"} 
          />
          
          <div className="pt-8 px-4 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">System</p>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-all">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-colors",
              viewMode === 'doctor' ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
            )}>
              {viewMode === 'doctor' ? <Stethoscope size={20} /> : <User size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">
                {viewMode === 'doctor' ? "Dr. Clinical AI" : "Alex Patient"}
              </p>
              <p className="text-[10px] text-gray-500 truncate uppercase tracking-widest font-bold">
                {viewMode === 'doctor' ? "Senior Geneticist" : "Verified Patient"}
              </p>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300",
              viewMode === 'doctor' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-green-50 text-green-600 border-green-100"
            )}>
              {viewMode === 'doctor' ? 'Clinician Portal' : 'Patient Portal'}
            </div>
            <div className="h-6 w-[1px] bg-gray-200 mx-2" />
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 w-80 lg:w-96">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder={viewMode === 'doctor' ? "Search patient records, mutations..." : "Search my reports, health tips..."}
                className="bg-transparent border-none focus:outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">System Active</span>
            </div>
            <button className="relative p-2 text-gray-400 hover:text-[#141414] transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-gray-200" />
            <button className="bg-[#141414] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all">
              {viewMode === 'doctor' ? 'New Case' : 'Request Analysis'}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Next-Gen Clinical AI</span>
                  </div>
                  <h2 className="text-5xl font-bold tracking-tight">Bridging Genomics & Care</h2>
                  <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Gene2Care AI is an advanced clinical reasoning system designed to transform raw genetic data into actionable medical intelligence.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <Target size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-3">Precision Analysis</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Deep interpretation of genetic variants using multi-layer biomedical reasoning pipelines.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                      <Activity size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-3">Pathway Mapping</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Visualizing how mutations disrupt biological pathways and protein structures.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                      <ShieldAlert size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-3">Risk Intelligence</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Evidence-based risk scoring for hereditary conditions and targeted therapy suggestions.
                    </p>
                  </div>
                </div>

                <div className="bg-[#141414] text-white p-12 rounded-3xl relative overflow-hidden">
                  <div className="relative z-10 max-w-lg">
                    <h3 className="text-3xl font-bold mb-6">The Gene2Care Mission</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                      Our mission is to empower clinicians with AI-driven insights that reduce the time from genetic testing to personalized treatment, ensuring every patient receives care tailored to their unique genetic profile.
                    </p>
                    <button 
                      onClick={() => setActiveView('analysis')}
                      className="bg-white text-[#141414] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-all flex items-center gap-2"
                    >
                      Start Analysis <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <Dna size={400} className="translate-x-1/4 -translate-y-1/4" />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold tracking-tight">Our Technology Stack</h3>
                    <p className="text-sm text-gray-500 mt-2">Built with industry-leading tools for clinical-grade performance.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Google Gemini', desc: 'Advanced LLM Reasoning', icon: Zap },
                      { name: 'React 19', desc: 'Modern UI Framework', icon: Activity },
                      { name: 'Tailwind CSS', desc: 'Utility-First Styling', icon: LayoutDashboard },
                      { name: 'Recharts', desc: 'Data Visualization', icon: Activity },
                    ].map((tech, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 text-center space-y-2">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <tech.icon size={20} className="text-gray-400" />
                        </div>
                        <p className="text-xs font-bold">{tech.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{tech.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'analysis' && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left: Input */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gray-100 text-black rounded-lg">
                        <FlaskConical size={20} />
                      </div>
                      <h2 className="font-bold text-xl text-black">Patient Intake</h2>
                    </div>

                    <div className="mb-8">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-4">Clinical Sample Cases</p>
                      <div className="grid grid-cols-1 gap-2">
                        {CLINICAL_SAMPLES.map((sample, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setMutation(sample.mutation);
                              setSymptoms(sample.symptoms);
                              setLabValues(sample.lab);
                              if ('result' in sample) {
                                setResult(sample.result as AnalysisResult);
                              }
                            }}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all group text-left"
                          >
                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                              <sample.icon size={16} className="text-gray-400 group-hover:text-black" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-black">{sample.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono truncate w-40">{sample.mutation}</p>
                            </div>
                            <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-black" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Genetic Mutation / VCF</label>
                        <textarea 
                          value={mutation}
                          onChange={(e) => setMutation(e.target.value)}
                          placeholder="e.g. BRCA1 c.68_69delAG"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all min-h-[100px]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Clinical Symptoms</label>
                        <textarea 
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          placeholder="Describe patient symptoms..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all min-h-[100px]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Lab Values (Optional)</label>
                        <input 
                          type="text"
                          value={labValues}
                          onChange={(e) => setLabValues(e.target.value)}
                          placeholder="e.g. CA-125: 45 U/mL"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all"
                        />
                      </div>

                      <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full bg-[#141414] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-black/10"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Sequencing...
                          </>
                        ) : (
                          <>
                            <Zap size={18} />
                            Run Intelligence
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-red-700">
                      <AlertTriangle size={20} className="shrink-0" />
                      <p className="text-xs font-medium">{error}</p>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-black mb-4">ClinVar Integration</h3>
                    <div className="space-y-3">
                      <a href="#" className="flex items-center justify-between text-xs font-medium text-gray-600 hover:text-[#141414] group">
                        ClinVar Database <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <a href="#" className="flex items-center justify-between text-xs font-medium text-gray-600 hover:text-[#141414] group">
                        OMIM Catalog <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <a href="#" className="flex items-center justify-between text-xs font-medium text-gray-600 hover:text-[#141414] group">
                        NCBI Gene Search <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Output */}
                <div className="lg:col-span-8">
                  <AnimatePresence mode="wait">
                    {!result && !isAnalyzing ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center bg-white/50"
                      >
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                          <Microscope size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 tracking-tight">Awaiting Genomic Data</h3>
                        <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
                          Enter patient mutation and clinical context to generate a comprehensive intelligence report.
                        </p>
                      </motion.div>
                    ) : isAnalyzing ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center space-y-8 p-12 bg-white rounded-3xl border border-gray-200 shadow-sm"
                      >
                        <div className="relative">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-40 h-40 border-4 border-gray-100 border-t-[#141414] rounded-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Dna size={40} className="text-[#141414] animate-pulse" />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="text-xl font-bold mb-2">Analyzing Biological Chain Reaction</h3>
                          <p className="text-sm text-gray-400">Gene → Protein → Pathway → Disease</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                      >
                        {/* Result Header */}
                        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <span className={cn(
                                  "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                                  result.clinicalIntelligence.severity === 'Critical' ? "bg-red-50 text-red-600 border border-red-100" :
                                  result.clinicalIntelligence.severity === 'High' ? "bg-orange-50 text-orange-600 border border-orange-100" :
                                  "bg-blue-50 text-blue-600 border border-blue-100"
                                )}>
                                  {result.clinicalIntelligence.severity} Risk Profile
                                </span>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confidence:</span>
                                  <span className="text-[10px] font-bold text-[#141414]">{result.clinicalIntelligence.confidenceScore}%</span>
                                </div>
                              </div>
                              <h2 className="text-4xl font-bold tracking-tight">{result.clinicalIntelligence.primaryDiagnosis}</h2>
                            </div>
                            
                            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 self-start md:self-center">
                              <button 
                                onClick={() => setViewMode('doctor')}
                                className={cn(
                                  "px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all",
                                  viewMode === 'doctor' ? "bg-white text-[#141414] shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                              >
                                Doctor
                              </button>
                              <button 
                                onClick={() => setViewMode('patient')}
                                className={cn(
                                  "px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all",
                                  viewMode === 'patient' ? "bg-white text-[#141414] shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                              >
                                Patient
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Mutation Card */}
                          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-black uppercase tracking-tight">
                                {viewMode === 'doctor' ? 'Molecular Profile' : 'Genetic Signature'}
                              </h3>
                              <Microscope size={18} className="text-black" />
                            </div>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Gene</p>
                                  <p className="text-lg font-bold font-mono">{result.mutationAnalysis.gene}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Variant</p>
                                  <p className="text-lg font-bold font-mono">{result.mutationAnalysis.mutation}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-black uppercase mb-2">
                                  {viewMode === 'doctor' ? 'Mutation Impact' : 'What this means'}
                                </p>
                                <p className="text-sm leading-relaxed text-gray-600">{result.mutationAnalysis.impact}</p>
                              </div>
                              {viewMode === 'doctor' && (
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                  <p className="text-sm font-bold text-black uppercase mb-2">Protein Structure</p>
                                  <p className="text-sm italic text-gray-700 leading-relaxed">{result.mutationAnalysis.proteinEffect}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold text-black uppercase mb-3">
                                  {viewMode === 'doctor' ? 'Pathway Disruption' : 'Affected Systems'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {result.mutationAnalysis.pathways.map((p, i) => (
                                    <span key={i} className="text-[10px] font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">{p}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Risk Card */}
                          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-black uppercase tracking-tight">
                                {viewMode === 'doctor' ? 'Disease Risk Matrix' : 'Health Risk Assessment'}
                              </h3>
                              <ShieldAlert size={18} className="text-black" />
                            </div>
                            <div className="space-y-6">
                              {result.mutationAnalysis.diseases.map((d, i) => (
                                <div key={i} className="space-y-3">
                                  <div className="flex justify-between items-end">
                                    <div>
                                      <p className="text-sm font-bold">{d.name}</p>
                                      <p className="text-[10px] text-gray-400 italic">{d.description}</p>
                                    </div>
                                    <span className="text-sm font-bold font-mono">{(d.riskScore * 100).toFixed(0)}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${d.riskScore * 100}%` }}
                                      transition={{ duration: 1.2, ease: "easeOut" }}
                                      className={cn(
                                        "h-full rounded-full",
                                        d.riskScore > 0.7 ? "bg-red-500" : d.riskScore > 0.4 ? "bg-orange-400" : "bg-blue-500"
                                      )}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Treatment Engine */}
                          <div className="md:col-span-2 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                              <h3 className="text-sm font-bold text-black uppercase tracking-tight">Precision Treatment Plan</h3>
                              <Pill size={18} className="text-black" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-blue-600">
                                  <Pill size={16} />
                                  <h4 className="text-xs font-bold uppercase tracking-widest">Therapies</h4>
                                </div>
                                <div className="space-y-4">
                                  {result.clinicalIntelligence.recommendations.drugs.map((drug, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                      <p className="text-sm font-bold mb-1">{drug.name}</p>
                                      <p className="text-[10px] text-gray-400 mb-3">Target: {drug.target}</p>
                                      {viewMode === 'doctor' && (
                                        <div className="flex flex-wrap gap-1.5">
                                          {drug.sideEffects.map((se, j) => (
                                            <span key={j} className="text-[8px] font-bold bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-500">{se}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-green-600">
                                  <HeartPulse size={16} />
                                  <h4 className="text-xs font-bold uppercase tracking-widest">Lifestyle</h4>
                                </div>
                                <ul className="space-y-3">
                                  {result.clinicalIntelligence.recommendations.lifestyle.map((l, i) => (
                                    <li key={i} className="text-xs text-gray-600 flex items-start gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                      <span className="leading-relaxed">{l}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-purple-600">
                                  <Stethoscope size={16} />
                                  <h4 className="text-xs font-bold uppercase tracking-widest">Screenings</h4>
                                </div>
                                <ul className="space-y-3">
                                  {result.clinicalIntelligence.recommendations.screenings.map((s, i) => (
                                    <li key={i} className="text-xs text-gray-600 flex items-start gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                                      <span className="leading-relaxed">{s}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Clinician Decision Support (Doctor Only) */}
                          {viewMode === 'doctor' && result.clinicalIntelligence.decisionSupport && (
                            <div className="md:col-span-2 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-8">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h3 className="text-sm font-bold text-black uppercase tracking-tight">Clinician Decision Support</h3>
                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Evidence-Based Reasoning Model</p>
                                </div>
                                <Activity size={18} className="text-black" />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-2">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Evidence Level</p>
                                  <div className="flex items-center gap-2">
                                    <div className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md">
                                      {result.clinicalIntelligence.decisionSupport.evidenceLevel}
                                    </div>
                                    <span className="text-xs font-bold text-gray-600">Clinical Grade</span>
                                  </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-2">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ACMG Classification</p>
                                  <p className="text-sm font-bold text-black">{result.clinicalIntelligence.decisionSupport.acmgClassification}</p>
                                </div>

                                <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-2">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clinical Actionability</p>
                                  <p className="text-sm text-gray-600 leading-relaxed">{result.clinicalIntelligence.decisionSupport.clinicalActionability}</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Differential Diagnosis Considerations</h4>
                                <div className="flex flex-wrap gap-3">
                                  {result.clinicalIntelligence.decisionSupport.differentialDiagnosis.map((dd, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                      <span className="text-xs font-medium text-gray-700">{dd}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Reasoning / Summary */}
                          <div className={cn(
                            "md:col-span-2 rounded-[2rem] p-10 shadow-2xl transition-all duration-500",
                            viewMode === 'doctor' 
                              ? "bg-[#141414] text-white shadow-black/20" 
                              : "bg-[#f5f5f0] text-black shadow-gray-200"
                          )}>
                            <div className="flex items-center gap-4 mb-8">
                              <div className={cn(
                                "p-3 rounded-2xl",
                                viewMode === 'doctor' ? "bg-white/10 text-white" : "bg-black/5 text-black"
                              )}>
                                {viewMode === 'doctor' ? <Info size={24} /> : <HeartPulse size={24} />}
                              </div>
                              <h3 className={cn(
                                "text-3xl font-bold tracking-tight",
                                viewMode === 'doctor' ? "text-white" : "text-black"
                              )}>
                                {viewMode === 'doctor' ? "Clinical Reasoning" : "Health Summary"}
                              </h3>
                            </div>
                            
                            <div className={cn(
                              "prose prose-sm max-w-none prose-p:leading-loose",
                              viewMode === 'doctor' 
                                ? "prose-invert prose-p:text-gray-400 prose-strong:text-white prose-li:text-gray-400" 
                                : "prose-p:text-gray-700 prose-strong:text-black prose-li:text-gray-700 prose-headings:text-black font-medium"
                            )}>
                              <Markdown>
                                {viewMode === 'doctor' 
                                  ? result.clinicalIntelligence.explanation 
                                  : result.clinicalIntelligence.patientSummary}
                              </Markdown>
                            </div>

                            {viewMode === 'doctor' && (
                              <div className="mt-10 pt-8 border-t border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                  <ShieldAlert size={18} className="text-red-500" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Critical Red Flags</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                  {result.clinicalIntelligence.redFlags.map((flag, i) => (
                                    <span key={i} className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-400">
                                      {flag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-black">
                      {viewMode === 'doctor' ? 'Intelligence Dashboard' : 'My Health Dashboard'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {viewMode === 'doctor' 
                        ? 'Real-time monitoring of genomic analysis trends and system performance.' 
                        : 'Overview of your personal genomic insights and health trends.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
                      <Filter size={14} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#141414] rounded-xl text-xs font-bold text-white hover:bg-opacity-90 transition-all">
                      <Download size={14} /> Export Report
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Analyses Run', value: '1,284', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
                    { label: 'High Risk Detected', value: '142', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50', trend: '+5%' },
                    { label: 'Avg Confidence', value: '94.2%', icon: Target, color: 'text-green-600', bg: 'bg-green-50', trend: '+2%' },
                    { label: 'Research Citations', value: '8.4k', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+18%' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, "text-black")}>
                          <stat.icon size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{stat.trend}</span>
                      </div>
                      <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-black">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-bold text-black uppercase tracking-tight">
                        {viewMode === 'doctor' ? 'Genomic Analysis Volume' : 'My Analysis Timeline'}
                      </h3>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-black" />
                          <span className="text-[10px] font-bold text-black uppercase">
                            {viewMode === 'doctor' ? 'Analyses' : 'Reports'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_DASHBOARD_DATA.monthlyTrend}>
                          <defs>
                            <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 600, fill: '#94A3B8' }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 600, fill: '#94A3B8' }}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                            labelStyle={{ display: 'none' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="analyses" 
                            stroke="#141414" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorAnalyses)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <h3 className="text-sm font-bold text-black uppercase tracking-tight mb-8">Risk Distribution</h3>
                    <div className="h-64 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={MOCK_DASHBOARD_DATA.riskLevels}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            {MOCK_DASHBOARD_DATA.riskLevels.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-2xl font-bold">1.2k</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {MOCK_DASHBOARD_DATA.riskLevels.map((level, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: level.color }} />
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{level.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <h3 className="text-sm font-bold text-black uppercase tracking-tight mb-8">Top Targeted Genes</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_DASHBOARD_DATA.distribution} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#141414' }}
                            width={60}
                          />
                          <Tooltip 
                            cursor={{ fill: '#F8F9FA' }}
                            contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: '12px', color: '#fff' }}
                          />
                          <Bar 
                            dataKey="count" 
                            fill="#141414" 
                            radius={[0, 8, 8, 0]} 
                            barSize={24}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-black uppercase tracking-tight">
                      {viewMode === 'doctor' ? 'Live Activity Feed' : 'Recent Health Activity'}
                    </h3>
                    <div className="space-y-6">
                      {[
                        { type: 'Analysis', name: 'BRCA1 Variant', time: '2 mins ago', status: 'Complete' },
                        { type: 'Report', name: 'TP53 Screening', time: '1 hour ago', status: 'Exported' },
                        { type: 'Analysis', name: 'EGFR Mutation', time: '3 hours ago', status: 'Complete' },
                        { type: 'System', name: 'Database Update', time: '5 hours ago', status: 'Success' },
                        { type: 'Analysis', name: 'KRAS Variant', time: '6 hours ago', status: 'Complete' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div className="flex-1">
                            <p className="text-sm font-bold">{item.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.type} • {item.time}</p>
                          </div>
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-black">
                      {viewMode === 'doctor' ? 'Case History Vault' : 'My Medical Reports'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {viewMode === 'doctor' 
                        ? 'Access and manage all previous genomic analysis reports.' 
                        : 'View and download your personal genetic analysis history.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-500">
                      <Calendar size={14} /> All Time
                    </div>
                    <button className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-[#141414]">
                      <Filter size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black">
                          {viewMode === 'doctor' ? 'Case ID' : 'Report ID'}
                        </th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black">
                          {viewMode === 'doctor' ? 'Patient' : 'Type'}
                        </th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black">Mutation</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black">Date</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black">
                          {viewMode === 'doctor' ? 'Risk Level' : 'Priority'}
                        </th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black">Status</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {MOCK_HISTORY.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-5 text-xs font-bold font-mono">{item.id}</td>
                          <td className="px-8 py-5 text-xs font-medium text-gray-600">{item.patient}</td>
                          <td className="px-8 py-5 text-xs font-mono text-gray-500">{item.mutation}</td>
                          <td className="px-8 py-5 text-xs text-gray-400">{item.date}</td>
                          <td className="px-8 py-5">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest",
                              item.risk === 'Critical' ? "bg-red-50 text-red-600" :
                              item.risk === 'High' ? "bg-orange-50 text-orange-600" :
                              "bg-blue-50 text-blue-600"
                            )}>
                              {item.risk}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full", item.status === 'Finalized' ? "bg-green-500" : "bg-orange-500")} />
                              <span className="text-[10px] font-bold text-gray-500 uppercase">{item.status}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <button className="p-2 text-gray-400 hover:text-[#141414] transition-colors">
                              <FileText size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Showing 5 of 1,284 cases</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 hover:text-[#141414] transition-all">Prev</button>
                      <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 hover:text-[#141414] transition-all">Next</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="h-16 border-t border-gray-200 px-8 flex items-center justify-between bg-white text-[10px] uppercase tracking-widest font-bold text-gray-400">
          <p>&copy; 2026 Gene2Care AI Intelligence System</p>
          <div className="flex gap-6">
            <span className="hover:text-[#141414] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#141414] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#141414] cursor-pointer transition-colors">Support</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
