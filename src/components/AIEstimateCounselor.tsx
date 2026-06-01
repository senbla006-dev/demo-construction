import * as React from "react";
import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Layers, 
  DollarSign, 
  FileText, 
  Loader2, 
  ShieldCheck, 
  Cpu, 
  ListTodo, 
  Sparkles,
  TriangleAlert,
  Calendar,
  Wrench,
  ChevronRight,
  Download,
  Activity
} from "lucide-react";
import { EstimateInput, EstimateResult } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function AIEstimateCounselor() {
  const [formData, setFormData] = useState<EstimateInput>({
    projectType: "Commercial Skyscraper",
    scale: "Mega-Scale (200,000+ SQFT)",
    city: "New York, NY",
    budget: "$40,000,000 - $80,000,000",
    customDetails: ""
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cinematic engineering progression messages
  const loadingMessages = [
    "DETERMINING GEOTECHNICAL BASE SOIL DENSITIES...",
    "SIMULATING STRUCTURAL STEEL SHEAR FRAME DEFLECTIONS...",
    "MAPPING REGIONAL MUNICIPAL CODES & HEIGHT POLICIES...",
    "ESTIMATING REBAR DENSITY & GRADE C80 CONCRETE HYDRATION MODULES...",
    "COMPILING MASTER DRAFT TIMELINE & CRITICAL ROADMAP PATHWAYS..."
  ];

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
         if (prev >= loadingMessages.length - 1) {
           return prev;
         }
         return prev + 1;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingStep(0);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Lead estimator is currently processing another query. Please retry.");
      }

      const data = await response.json();
      
      if (data.fallbackData && !data.projectName) {
        setResult(data.fallbackData);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to sync directly with the server's AI core. Displaying direct engineering specifications instead.");
      
      setResult({
        projectName: `Elite ${formData.projectType} Prime`,
        suggestedScope: `A high-performance ${formData.scale.toLowerCase()} complex precisely mapped for ${formData.city}. Engineered with monolithic reinforced baseline frames, low-E triple insulation paneling, and strategic load-distribution columns configured to absorb modern wind-shear velocity vectors.`,
        estimatedCostRange: `${formData.budget} (Fully Capital Optimized)`,
        engineeringRequirements: [
          "Dynamic wind tunnel validation and axial heavy mass foundation support piles",
          "Zoning compliant subterranean concrete moisture barrier shell shoring",
          "Redundant commercial thermal HVAC grids with smart automated dampening nodes",
          "Advanced steel framing reinforcement incorporating Class-4 structural shear braces"
        ],
        materialsList: [
          "High-tensile Grade 60 structural reinforced structural steel",
          "Monolithic C80 ultra-high-density structural concrete formula",
          "Low-emissivity glass panels with custom perimeter copper alloy frame clamps",
          "Basalt and sound-isolating composite insulation backing walls"
        ],
        estimatedDurationMonths: 20,
        riskMitigationAlerts: [
          "Municipal daylight acoustic limits require offsite steel logistics orchestration",
          "Soil saturation conditions mandate continuous high-flow water evacuation during initial digging"
        ],
        projectPhases: [
          { phaseName: "Site Preparation & Shoring", description: "Dirt grading, driving secant concrete wall piles.", durationWeeks: 8, percentageOfBudget: 15 },
          { phaseName: "Substructure Concrete Casting", description: "Hydration concrete foundation pouring, foundation reinforcement cages.", durationWeeks: 12, percentageOfBudget: 25 },
          { phaseName: "Vertical Superstructure Erecting", description: "Bolting horizontal wide-flange beams, structural core scaffolding.", durationWeeks: 14, percentageOfBudget: 35 },
          { phaseName: "Perimeter Cladding & Envelope", description: "Mounting insulated smart curtain panels, building waterproofing.", durationWeeks: 10, percentageOfBudget: 15 },
          { phaseName: "Interior Mechanical Commissioning", description: "MEP testing, structural signature checks, city safety sign-off.", durationWeeks: 12, percentageOfBudget: 10 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans" id="estimator-panel">
      <div className="glass-panel rounded-2xl border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-[#050810]/70">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-[1px] w-6 bg-white animate-pulse" />
              <p className="text-[10px] font-mono tracking-[0.2em] text-slate-300 font-bold uppercase">
                AI CONSTRUCTION ARCHITECT ENGINE
              </p>
            </div>
            <h3 className="text-2xl md:text-3xl font-sans font-black uppercase text-slate-100 tracking-tighter">
              Project Estimator & Cost Modeler
            </h3>
          </div>
          <div className="flex items-center gap-3 bg-white/5 py-1.5 px-4 rounded-lg border border-white/15 self-start md:self-auto font-mono text-xs text-slate-300">
            <Activity className="w-4 h-4 text-white animate-pulse" />
            <span className="font-bold">US-STND V3.5 Live Core</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isLoading && !result && (
            <motion.form 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-300" />
                    Development Type
                  </label>
                  <select
                    className="w-full bg-[#050810] border border-white/10 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-white transition-colors font-sans cursor-pointer focus:ring-1 focus:ring-white"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  >
                    <option value="Commercial Skyscraper">Commercial Skyscraper</option>
                    <option value="Heavy Civil Infrastructure">Heavy Civil Infrastructure</option>
                    <option value="Industrial Automated Hub">Industrial Automated Hub</option>
                    <option value="Ultra-Luxury Residential Estate">Ultra-Luxury Residential Estate</option>
                    <option value="Advanced Medical & R&D Laboratory">Advanced Medical & R&D Laboratory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-slate-300" />
                    Scale & Development Volume
                  </label>
                  <select
                    className="w-full bg-[#050810] border border-white/10 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-white transition-colors font-sans cursor-pointer focus:ring-1 focus:ring-white"
                    value={formData.scale}
                    onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                  >
                    <option value="Large-Scale (50,000 - 150,000 SQFT)">Large-Scale (50,000 - 150,000 SQFT)</option>
                    <option value="Mega-Scale (150,000 - 500,000 SQFT)">Mega-Scale (150,000 - 500,000 SQFT)</option>
                    <option value="Gigastructure / Master Plan (500,000+ SQFT)">Gigastructure / Master Plan (500,000+ SQFT)</option>
                    <option value="Bespoke Signature Architectural Landmark">Bespoke Signature Architectural Landmark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-300" />
                    Municipal Location (Codes Apply)
                  </label>
                  <select
                    className="w-full bg-[#050810] border border-white/10 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-white transition-colors font-sans cursor-pointer focus:ring-1 focus:ring-white"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    <option value="New York, NY">New York, NY (High Density, Seismic Sub-soil)</option>
                    <option value="Miami, FL">Miami, FL (Wind-shear, High Water Table, Coastal High-Load)</option>
                    <option value="Houston, TX">Houston, TX (Heavy Foundations, Expansive Clay)</option>
                    <option value="Los Angeles, CA">Los Angeles, CA (High Seismic Fault Zone D, Solar-Grid)</option>
                    <option value="Chicago, IL">Chicago, IL (High Frost Depth, Dynamic Aerodynamics)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-slate-300" />
                    Target Budget Range (USD)
                  </label>
                  <select
                    className="w-full bg-[#050810] border border-white/10 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-white transition-colors font-sans cursor-pointer focus:ring-1 focus:ring-white"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  >
                    <option value="$10,000,000 - $25,000,000">$10,000,000 - $25,000,000 USD</option>
                    <option value="$25,000,000 - $75,000,000">$25,000,000 - $75,000,000 USD</option>
                    <option value="$75,000,000 - $150,000,000">$75,000,000 - $150,000,000 USD</option>
                    <option value="$150,000,000+">$150,000,000+ USD (Master Infrastructure Scale)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-300" />
                  Custom Requirements & Material Mandates
                </label>
                <textarea
                  className="w-full bg-[#050810] border border-white/10 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-white transition-colors font-sans h-28 focus:ring-1 focus:ring-white resize-none placeholder:text-gray-600"
                  placeholder="Specify any localized constraints, custom helipad request, automated backup solar power cells, acoustic isolators, zero-carbon composite materials, or fast-track timelines..."
                  value={formData.customDetails}
                  onChange={(e) => setFormData({ ...formData, customDetails: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-[#050810] hover:bg-slate-100 font-sans font-black uppercase tracking-wider rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2.5 cursor-pointer text-xs md:text-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#050810] fill-[#050810]" />
                  Synthesize AI Structural Report & Estimates
                </button>
              </div>
            </motion.form>
          )}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center justify-center gap-6"
            >
              <div className="relative">
                <Loader2 className="w-16 h-16 text-white animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-slate-300" />
                </div>
              </div>
              <div className="text-center space-y-2 max-w-lg">
                <h4 className="text-slate-300 font-mono text-xs tracking-widest uppercase animate-pulse font-bold">
                  ESTIMATING STRUCTURAL BLUEPRINT MODEL...
                </h4>
                <p className="text-slate-400 font-sans text-sm font-medium tracking-wide min-h-[40px]">
                  {loadingMessages[loadingStep]}
                </p>
                <div className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 14, ease: "linear" }}
                    className="h-full bg-white" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {/* Report Header Block */}
              <div className="relative border-l-2 border-white bg-white/5 p-5 rounded-r-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    CERTIFIED STRUCTURAL ARCHITECT PROPOSAL
                  </span>
                  <h4 className="text-2xl font-sans font-black uppercase text-slate-100 tracking-tight">
                    {result.projectName}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Target Site: {formData.city} | Authority: BuildElite Estimator Core 3.5
                  </p>
                </div>
                <div className="bg-white/5 border border-white/15 px-4 py-3 rounded-lg text-right flex flex-col md:items-end justify-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">ESTIMATED CAPITAL INVESTMENT</span>
                  <span className="text-lg md:text-xl font-sans font-extrabold text-white">{result.estimatedCostRange}</span>
                </div>
              </div>

              {/* Grid 1: Scope, Materials & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-[#050810]/40 border border-white/5 p-5 rounded-xl space-y-2">
                    <h5 className="font-mono text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                      <FileText className="w-3.5 h-3.5 text-slate-300" />
                      Architectural Scope & Strategy
                    </h5>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {result.suggestedScope}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#050810]/40 border border-white/5 p-5 rounded-xl space-y-3">
                      <h5 className="font-mono text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <Wrench className="w-3.5 h-3.5 text-slate-300" />
                        Key Engineering Directives
                      </h5>
                      <ul className="space-y-2">
                        {result.engineeringRequirements.map((req, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#050810]/40 border border-white/5 p-5 rounded-xl space-y-3">
                      <h5 className="font-mono text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <Layers className="w-3.5 h-3.5 text-slate-300" />
                        Premium Specified Materials
                      </h5>
                      <ul className="space-y-2">
                        {result.materialsList.map((material, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                            <span>{material}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Sidebar Specs Cards */}
                <div className="space-y-4">
                  <div className="bg-[#050810]/40 border border-white/5 p-5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">DURATION PLAN</span>
                      <span className="text-2xl font-sans font-bold text-slate-100">{result.estimatedDurationMonths} Months</span>
                    </div>
                    <Calendar className="w-8 h-8 text-white/10" />
                  </div>

                  <div className="bg-[#050810]/40 border border-white/5 p-5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">COMPLIANCE INDEX</span>
                      <span className="text-2xl font-sans font-bold text-slate-100">Class-A / US</span>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-white/5" />
                  </div>

                  {result.riskMitigationAlerts && result.riskMitigationAlerts.length > 0 && (
                    <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-3">
                      <h5 className="font-mono text-[10px] text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <TriangleAlert className="w-3.5 h-3.5 text-white animate-pulse" />
                        Risk Mitigation Directives
                      </h5>
                      <ul className="space-y-2">
                        {result.riskMitigationAlerts.map((alert, i) => (
                          <li key={i} className="text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
                            <ChevronRight className="w-3 h-3 text-white mt-0.5 flex-shrink-0" />
                            <span>{alert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Master Phase Schedule Layout */}
              <div className="bg-[#050810]/40 border border-white/5 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                  <h5 className="font-mono text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-slate-300" />
                    Proposed Phase Breakdown & Capital Allocations
                  </h5>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Critical path roadmap</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01]">
                        <th className="p-4 text-[10px] font-mono text-slate-500 uppercase">Phase Name</th>
                        <th className="p-4 text-[10px] font-mono text-slate-500 uppercase">Specific Deliverables & Operations</th>
                        <th className="p-4 text-[10px] font-mono text-slate-500 uppercase text-center">Weeks</th>
                        <th className="p-4 text-[10px] font-mono text-slate-500 uppercase text-right">Capital Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {result.projectPhases.map((phase, index) => (
                        <tr key={index} className="hover:bg-white/[0.01]">
                           <td className="p-4 font-sans font-bold uppercase text-slate-200">{phase.phaseName}</td>
                           <td className="p-4 text-slate-400 max-w-xs">{phase.description}</td>
                           <td className="p-4 text-center font-mono text-slate-300">{phase.durationWeeks} wks</td>
                           <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-mono text-white font-bold">{phase.percentageOfBudget}%</span>
                              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: `${phase.percentageOfBudget}%` }} />
                              </div>
                            </div>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reset/Submit New Block */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/5 gap-4">
                <button
                  onClick={() => setResult(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-lg text-xs font-mono uppercase tracking-widest transition-all cursor-pointer"
                >
                  Configure New Estimate Parameters
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500">Document generated secure: ID BD-{Math.floor(1000 + Math.random() * 9000)}</span>
                  <button 
                    onClick={() => {
                      const text = JSON.stringify(result, null, 2);
                      const blob = new Blob([text], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `BuildElite_Estimate_${formData.city.split(",")[0].replace(" ", "")}.json`;
                      a.click();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-slate-300 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export JSON
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
