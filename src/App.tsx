import { useEffect, useState, useRef } from "react";
import { 
  Building2, 
  HardHat, 
  Factory, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  ShieldAlert, 
  Wrench, 
  ChevronRight, 
  Zap, 
  Compass, 
  Briefcase, 
  MapPin, 
  ArrowUpRight, 
  Volume2, 
  VolumeX, 
  Anchor, 
  Waves,
  Scale,
  Sparkles,
  Hammer,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ScrollVideoBG from "./components/ScrollVideoBG";
import AIEstimateCounselor from "./components/AIEstimateCounselor";
import { PROJECTS, SERVICES, MACHINES, PROCESS_STEPS, SAFETY_METRICS } from "./data";
import { Project, ServiceItem } from "./types";

export default function App() {
  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<number>(0);
  
  // Interactive States
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);
  const [selectedService, setSelectedService] = useState<ServiceItem>(SERVICES[0]);
  const [ambientAudioOn, setAmbientAudioOn] = useState<boolean>(false);
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);
  const [shakingMachineIndex, setShakingMachineIndex] = useState<number | null>(null);

  // Audio Context references for synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humOscRef = useRef<OscillatorNode | null>(null);
  const hammerIntervalRef = useRef<number | null>(null);

  // Scroll tracking handle
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? currentScroll / totalHeight : 0;
      
      setScrollY(currentScroll);
      setScrollProgress(progress);

      // Determine active section index based on current scroll depth
      const sectionHeight = window.innerHeight;
      const currentSection = Math.min(
        9,
        Math.floor((currentScroll + sectionHeight * 0.4) / sectionHeight)
      );
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Web Audio Synthesis for Ambient Construction Sounds (Optional Premium Effect)
  useEffect(() => {
    if (ambientAudioOn) {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtxClass();
        audioCtxRef.current = ctx;

        // Create low engine frequency hum (Caterpillar D11 simulator)
        const humOsc = ctx.createOscillator();
        const humGain = ctx.createGain();
        const humFilter = ctx.createBiquadFilter();

        humOsc.type = "sawtooth";
        humOsc.frequency.setValueAtTime(52, ctx.currentTime); // 52 Hz hum
        humFilter.type = "lowpass";
        humFilter.frequency.setValueAtTime(110, ctx.currentTime); // Lowpass for subterranean feel
        humGain.gain.setValueAtTime(0.04, ctx.currentTime); // Subdued quiet hum

        humOsc.connect(humFilter);
        humFilter.connect(humGain);
        humGain.connect(ctx.destination);
        humOsc.start();
        humOscRef.current = humOsc;

        // Random distant metallic strikes
        const playMetallicStrike = () => {
          if (!audioCtxRef.current) return;
          const ctxNow = audioCtxRef.current;
          
          const strikeOsc = ctxNow.createOscillator();
          const strikeGain = ctxNow.createGain();
          const strikeFilter = ctxNow.createBiquadFilter();

          strikeOsc.type = "sine";
          // Distant ring frequency
          const freq = 650 + Math.random() * 350;
          strikeOsc.frequency.setValueAtTime(freq, ctxNow.currentTime);
          
          strikeFilter.type = "bandpass";
          strikeFilter.frequency.setValueAtTime(freq, ctxNow.currentTime);
          strikeFilter.Q.setValueAtTime(4, ctxNow.currentTime);

          strikeGain.gain.setValueAtTime(0.0, ctxNow.currentTime);
          strikeGain.gain.linearRampToValueAtTime(0.02, ctxNow.currentTime + 0.04);
          strikeGain.gain.exponentialRampToValueAtTime(0.001, ctxNow.currentTime + 1.2);

          strikeOsc.connect(strikeFilter);
          strikeFilter.connect(strikeGain);
          strikeGain.connect(ctxNow.destination);

          strikeOsc.start();
          strikeOsc.stop(ctxNow.currentTime + 1.5);
        };

        hammerIntervalRef.current = window.setInterval(() => {
          if (Math.random() > 0.4) {
            playMetallicStrike();
          }
        }, 3200);

      } catch (err) {
        console.warn("Audio Context blocked or failed to load:", err);
      }
    } else {
      cleanupAudio();
    }

    return () => cleanupAudio();
  }, [ambientAudioOn]);

  const cleanupAudio = () => {
    if (humOscRef.current) {
      try { humOscRef.current.stop(); } catch(e){}
      humOscRef.current = null;
    }
    if (hammerIntervalRef.current) {
      clearInterval(hammerIntervalRef.current);
      hammerIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch(e){}
      audioCtxRef.current = null;
    }
  };

  const scrollToSection = (index: number) => {
    const sectionHeight = window.innerHeight;
    window.scrollTo({
      top: index * sectionHeight,
      behavior: "smooth"
    });
  };

  const handleMachineInteraction = (index: number) => {
    setShakingMachineIndex(index);
    setTimeout(() => setShakingMachineIndex(null), 1000);
  };

  const SECTIONS_METADATA = [
    { label: "01 INTRO", desc: "Hero Entrance" },
    { label: "02 VISION", desc: "Company Overview" },
    { label: "03 EXPERTISE", desc: "Specialized Services" },
    { label: "04 SHOWCASE", desc: "Project Showroom" },
    { label: "05 MACHINERY", desc: "Heavy Logistics Units" },
    { label: "06 STRUCTURAL", desc: "Engineering Precision" },
    { label: "07 SECURITY", desc: "OSHA & Compliance" },
    { label: "08 SCHEDULE", desc: "Deployment Phases" },
    { label: "09 REVEAL", desc: "Completed Skyscraper" },
    { label: "10 ESTIMATOR", desc: "AI Pricing Model" }
  ];

  return (
    <div className="relative min-h-[1000vh] text-slate-100 font-sans z-10 selection:bg-orange-500 selection:text-slate-950">
      
      {/* Immersive Scroll-Scrub Connected Video Background */}
      <ScrollVideoBG progress={scrollProgress} />

      {/* FIXED PREMIUM NAVIGATION HEADER */}
      <header className="fixed top-0 inset-x-0 h-20 bg-gradient-to-b from-[#050810]/95 to-[#050810]/0 z-40 px-6 sm:px-12 flex items-center justify-between border-b border-white/[0.03] backdrop-blur-sm">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black tracking-tighter text-white">BUILDELITE</span>
          <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-slate-400 font-semibold font-mono">
            Construction Group
          </span>
        </div>

        {/* Desktop Quick Jump Tabs */}
        <nav className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300">
          <button onClick={() => scrollToSection(1)} className="hover:text-white border-b border-white pb-0.5 transition-all cursor-pointer">Experience</button>
          <button onClick={() => scrollToSection(2)} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Portfolio</button>
          <button onClick={() => scrollToSection(4)} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Machinery</button>
          <button onClick={() => scrollToSection(9)} className="opacity-50 text-white border border-white/20 hover:border-white px-4 py-1 -mt-1 transition-all rounded bg-white/5 cursor-pointer font-bold tracking-widest text-[9px]">Contact</button>
        </nav>

        {/* Ambient construction sound toggle & live indicator */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAmbientAudioOn(!ambientAudioOn)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              ambientAudioOn 
                ? "bg-white/10 border-white/30 text-white" 
                : "bg-white/5 border-white/5 text-slate-400"
            }`}
            title="Toggle simulated low industrial engine hum and distant rivets sounds"
          >
            {ambientAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{ambientAudioOn ? "AMBIENT: ACTIVE" : "AMBIENT: MUTED"}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded text-[9px] font-mono text-slate-300 select-none">
            <span className="h-1 w-1 rounded-full bg-white animate-ping" />
            <span className="tracking-widest uppercase">SSL ACTIVE</span>
          </div>
        </div>
      </header>

      {/* FLOATING SIDEBAR INDEX NAVIGATOR (GSAP-style indicator) */}
      <div className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 font-mono">
        {SECTIONS_METADATA.map((meta, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSection(idx)}
            className="group flex items-center justify-end gap-3 text-right cursor-pointer"
          >
            <div className={`overflow-hidden transition-all duration-300 ${
              activeSection === idx 
                ? "max-w-[150px] opacity-100" 
                : "max-w-[0px] opacity-0 group-hover:max-w-[120px] group-hover:opacity-60"
            }`}>
              <span className="text-[9px] text-slate-400 tracking-wider block font-semibold uppercase">{meta.desc}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-[8px] tracking-tight ${activeSection === idx ? "text-white font-bold" : "text-gray-500 group-hover:text-gray-300"}`}>
                {meta.label.split(" ")[0]}
              </span>
              <div className={`w-3.5 transition-all duration-300 ${
                activeSection === idx 
                  ? "h-1 bg-white" 
                  : "h-[2px] bg-white/20 group-hover:bg-white/50"
              }`} />
            </div>
          </button>
        ))}
      </div>

      {/* SECTIONS CONDUIT FLOW - NATURAL SCROLL ON TOP */}
      
      {/* SECTION 1: HERO INTRO (CINEMATIC ENTRY) */}
      <section className="h-screen w-full relative flex items-center px-6 sm:px-12 md:px-24">
        <div className="w-full grid grid-cols-12 gap-8 items-center mt-20">
          
          {/* Aesthetic column left */}
          <div className="hidden md:flex col-span-1 flex-col items-center justify-center space-y-6">
            <div className="w-[1px] h-28 bg-gradient-to-b from-white to-transparent mx-auto"></div>
            <div className="text-[9px] font-mono origin-left -rotate-90 whitespace-nowrap tracking-[0.5em] text-slate-400">SCROLL PROGRESS</div>
            <div className="space-y-3 pt-12 flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
            </div>
          </div>

          {/* Central Headline */}
          <div className="col-span-12 md:col-span-8 space-y-5">
            <div className="flex items-center space-x-4 opacity-70">
              <span className="h-[1px] w-12 bg-white"></span>
              <span className="text-xs uppercase tracking-[0.4em] font-bold text-slate-200">Establishing Foundations</span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase font-sans text-white"
            >
              Building the<br />
              Future of<br />
              <span className="text-stroke-white text-transparent">America</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="text-slate-400 text-sm leading-relaxed max-w-md pt-2"
            >
              Engineering Excellence. Structural Precision. Trusted Construction. BuildElite defines the new standard of US infrastructure through cinematic precision and relentless quality control.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <button
                onClick={() => scrollToSection(9)}
                className="px-6 py-3.5 bg-white text-[#050810] font-sans font-bold text-xs uppercase tracking-wider rounded transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-2 cursor-pointer"
              >
                Request Estimate
                <ChevronRight className="w-4 h-4 ml-0.5 text-[#050810]" />
              </button>
              <button
                onClick={() => scrollToSection(1)}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/20 text-xs font-mono uppercase tracking-widest rounded transition-all cursor-pointer"
              >
                Analyze legacy sheet
              </button>
            </motion.div>
          </div>

          {/* Right Status Panel */}
          <div className="col-span-12 md:col-span-3 flex flex-col space-y-12">
            <div className="backdrop-blur-md bg-white/5 border-l-2 border-white/20 p-6 space-y-4 rounded-r">
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">Current Section</div>
              <div className="text-2xl font-bold font-mono">01 <span className="text-xs font-normal opacity-50 ml-2">/ 10</span></div>
              <div className="text-sm font-semibold border-b border-white/10 pb-2 text-slate-200">Hero Cinematic Intro</div>
              <p className="text-[9px] text-slate-500 leading-tight uppercase font-mono">
                Next: Mission Statement & Authority
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-widest opacity-50 font-mono text-slate-300">Structural Trust Ratio</div>
                <div className="h-[2px] w-full bg-slate-800">
                  <div className="h-full bg-white w-[88%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-widest opacity-50 font-mono text-slate-300">Safety Compliance</div>
                <div className="h-[2px] w-full bg-slate-800">
                  <div className="h-full bg-white w-full"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Down Scroll Animation indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 font-mono text-[9px] tracking-widest scroll-indicator pointer-events-none">
          <span className="uppercase text-[8px] opacity-60">Scroll to deploy narrative</span>
          <div className="w-5 h-8 border border-white/30 rounded-full relative">
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2.5 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMPANY OVERVIEW */}
      <section className="min-h-screen w-full flex items-center px-6 sm:px-12 md:px-24 py-20 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-8 bg-white opacity-60" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 font-bold">01 / ESTABLISHED NATIONWIDE AUTHORITY</p>
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-none">
              A Legacy Forged in Steel <br />
              <span className="text-transparent text-stroke-white opacity-80">& Concrete Precision</span>
            </h3>

            <p className="text-slate-400 text-sm leading-relaxed font-light">
              At BuildElite Construction, we don't just pour foundations; we engineer national resilience. Established with specialized engineering roots, our mission centers on delivering zero-defect commercial landmarks, heavy logistics terminals, and prestige developments across coastal storm zones.
            </p>
            
            <p className="text-slate-500 text-sm leading-relaxed font-light">
              Through strategic relationships with lead US steel rolling mills and certified geotechnical safety commissions, we fast-track architectural dreams with unmatched load-bearing parameters and OSHA award-winning site orchestration.
            </p>

            <div className="pt-4 flex items-center gap-6 border-t border-white/10">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">QUALITY SECURE INDEX</span>
                <span className="text-slate-200 text-xs font-semibold block">AASHTO Core Class</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">PRIMARY FOCUS HUBS</span>
                <span className="text-slate-200 text-xs font-semibold block">TX, NY, FL, CA</span>
              </div>
            </div>
          </div>

          {/* Metric Stats Cards Grill */}
          <div className="grid grid-cols-2 gap-4">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/35 p-6 rounded transition-all duration-300 space-y-2 group">
              <span className="text-4xl font-sans font-black text-white block tracking-tighter">50+</span>
              <h4 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Years Active</h4>
              <p className="text-[11px] text-slate-500 leading-normal font-light">Serving core American master planning networks.</p>
            </div>

            <div className="backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/35 p-6 rounded transition-all duration-300 space-y-2 group">
              <span className="text-4xl font-sans font-black text-white block tracking-tighter">340+</span>
              <h4 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Megastructures</h4>
              <p className="text-[11px] text-slate-500 leading-normal font-light">Erected in major high-density metropolitan spots.</p>
            </div>

            <div className="backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/35 p-6 rounded transition-all duration-300 space-y-2 group">
              <span className="text-4xl font-sans font-black text-white block tracking-tighter">Zero</span>
              <h4 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Major Incidents</h4>
              <p className="text-[11px] text-emerald-400 leading-normal font-light font-mono">Class-A OSHA safety record.</p>
            </div>

            <div className="backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/35 p-6 rounded transition-all duration-300 space-y-2 group">
              <span className="text-4xl font-sans font-black text-white block tracking-tighter">$6.4B</span>
              <h4 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Assets Built</h4>
              <p className="text-[11px] text-slate-500 leading-normal font-light">Representing institutional quality engineering.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SERVICES SECTION */}
      <section className="min-h-screen w-full flex items-center px-6 sm:px-12 md:px-24 py-20 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 font-bold flex items-center gap-2">
                <span className="h-[1px] w-6 bg-white" />
                02 / ARCHITECTURAL DIVISIONS
              </p>
              <h3 className="text-3xl sm:text-4xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-none">
                Comprehensive Engineering Solutions
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-500 max-w-sm tracking-wide">
              Click division below to inspect engineering features and specifications sheets instantly.
            </p>
          </div>

          {/* Division Selector Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Nav Cards List */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {SERVICES.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`text-left p-5 rounded-lg border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                    selectedService.id === srv.id 
                      ? "bg-white/10 border-white/30 text-white" 
                      : "bg-[#0b0f19]/25 border-white/5 hover:border-white/15 text-slate-300"
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-sans font-bold uppercase tracking-wide">
                      {srv.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">Division Level</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                    selectedService.id === srv.id ? "text-white translate-x-1" : "text-slate-600 group-hover:text-slate-400"
                  }`} />
                </button>
              ))}
            </div>

            {/* Spec Reveal Frame */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="glass-panel-heavy p-6 md:p-8 rounded-xl border border-white/10 h-full flex flex-col justify-between"
                >
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/5 rounded border border-white/15">
                        {selectedService.iconName === "Building2" && <Building2 className="w-6 h-6 text-white" />}
                        {selectedService.iconName === "HardHat" && <HardHat className="w-6 h-6 text-white" />}
                        {selectedService.iconName === "Factory" && <Factory className="w-6 h-6 text-white" />}
                        {selectedService.iconName === "ShieldCheck" && <ShieldCheck className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h4 className="text-lg font-sans font-bold uppercase text-slate-200">{selectedService.title}</h4>
                        <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">Active US Certification Code</span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed leading-6 font-light">
                      {selectedService.description}
                    </p>

                    <div className="space-y-3">
                      <h5 className="text-[11px] font-mono uppercase text-slate-400 tracking-wider font-semibold">DIVISION CAPABILITIES</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedService.features.map((feat, i) => (
                           <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded border border-white/5">
                            <Zap className="w-3.5 h-3.5 text-slate-200 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">SPECIFICATION ARCHITECTURE</span>
                      <p className="text-xs font-mono text-slate-300 font-light">{selectedService.specs}</p>
                    </div>
                    <button 
                      onClick={() => scrollToSection(9)}
                      className="text-xs font-mono font-bold text-white flex items-center gap-1 hover:underline transition-all cursor-pointer"
                    >
                      Draft division budget
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PROJECT SHOWCASE */}
      <section className="min-h-screen w-full flex items-center px-6 sm:px-12 md:px-24 py-20 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 font-bold flex items-center gap-2">
                <span className="h-[1px] w-6 bg-white" />
                03 / THE PREMIUM PORTFOLIO
              </p>
              <h3 className="text-3xl sm:text-4xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-none">
                Erected High-End Landmarks
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">4 Core Active Case Studies</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Visual Screen on Left */}
            <div className="lg:col-span-7 relative group rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Highlight Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
              
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full min-h-[400px] object-cover object-center transform scale-102 group-hover:scale-105 transition-transform duration-700 filter brightness-[0.8] contrast-[1.05]"
              />

              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-mono tracking-wider text-slate-200">{selectedProject.city}</span>
                </div>
                <h4 className="text-2xl font-sans font-black uppercase text-white">{selectedProject.title}</h4>
                <p className="text-xs text-slate-300 font-light max-w-lg leading-normal">{selectedProject.description}</p>
              </div>
            </div>

            {/* Spec Sheet on Right */}
            <div className="lg:col-span-5 flex flex-col justify-between glass-panel p-6 rounded-xl border border-white/5 bg-[#050810]/50">
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">SELECTED ANALYSIS UNIT</span>
                  <div className="flex flex-wrap gap-2">
                    {PROJECTS.map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => setSelectedProject(proj)}
                        className={`px-3 py-1.5 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                          selectedProject.id === proj.id 
                            ? "bg-white/10 border-white/30 text-white font-bold" 
                            : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                        }`}
                      >
                        {proj.title.split(" ")[1] || proj.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">PROJECT TYPE</span>
                    <span className="text-xs text-slate-100 font-medium font-mono">{selectedProject.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">YEAR COMPLETED</span>
                    <span className="text-xs text-slate-100 font-medium font-mono">{selectedProject.year}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-3">CONSTRUCTION ENGINEERING CONSTANTS</span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {selectedProject.stats.map((stat, i) => (
                      <div key={i} className="bg-[#050810] p-3 rounded border border-white/[0.03] space-y-1">
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">{stat.label}</span>
                        <span className="text-sm font-sans font-extrabold text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-6">
                <button
                  onClick={() => scrollToSection(9)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[10px] font-mono uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Request Duplicate Spec Proposal
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HEAVY MACHINERY SECTION */}
      <section className="min-h-screen w-full flex items-center px-6 sm:px-12 md:px-24 py-20 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-12 space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 font-bold flex items-center gap-2">
              <span className="h-[1px] w-6 bg-white" />
              04 / HARD CIVIL LOGISTICS CORE
            </p>
            <h3 className="text-3xl sm:text-4xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-none">
              High-Payload Industrial Fleet
            </h3>
            <p className="text-xs text-slate-500 font-light max-w-xl">
              We own and deploy extreme machinery to secure excavation speed. Move your pointer over units to simulate engine turbine vibration feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MACHINES.map((machine, i) => (
              <div
                key={i}
                onMouseEnter={() => handleMachineInteraction(i)}
                className={`glass-panel p-6 rounded-xl border border-white/5 bg-[#050810]/50 relative overflow-hidden transition-all duration-300 hover:border-white/30 flex flex-col justify-between ${
                  shakingMachineIndex === i ? "animate-[bounce_0.25s_infinite]" : ""
                }`}
              >
                {/* Visual grid accent lines in card */}
                <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-white/[0.02] -mr-4 -mt-4" />

                <div className="space-y-4">
                  <div className="inline-flex py-1 px-2.5 rounded bg-white/5 border border-white/15 text-[9px] font-mono text-slate-300 uppercase font-semibold">
                    {machine.type}
                  </div>
                  <h4 className="text-lg font-sans font-bold uppercase text-slate-200">{machine.name}</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed leading-5">
                    {machine.usage}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-500">RATED OPERATION HP</span>
                      <span className="text-white font-bold">{machine.powerRating}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: i === 0 ? "75%" : i === 1 ? "95%" : "85%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-500">EFFICIENCY CERTIFICATION</span>
                      <span className="text-slate-300">{machine.efficiency}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-[10px] font-mono bg-white/[0.01] p-2 rounded">
                    <span className="text-slate-500">MAX CAPACITY</span>
                    <span className="text-slate-200">{machine.capacity.split(" / ")[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 glass-panel p-4.5 rounded-lg border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#050810]/50">
            <span className="text-xs text-slate-400 font-light">All industrial equipment units are equipped with real-time telemetry nodes and anti-collision warning grids.</span>
            <span className="text-[10px] font-mono text-orange-500 font-bold uppercase tracking-widest">Fleet Ready : 100% Active</span>
          </div>
        </div>
      </section>

      {/* SECTION 6: STRUCTURAL ENGINEERING (STEEL FRAMEWORKS) */}
      <section className="min-h-screen w-full flex items-center px-6 sm:px-12 md:px-24 py-20 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-8 bg-white opacity-60" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 font-bold">05 / PHYSICS & RESILIENCE SYSTEMS</p>
            </div>
            <h3 className="text-3xl sm:text-4xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-tight">
              Grade-60 Frame <br />
              <span className="text-transparent text-stroke-white opacity-85">Deflection Ratios</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              We operate under extreme architectural precision metrics. To handle complex structural vibrations when crafting high-altitude frameworks, we mandate rigid shear trusses with integrated dynamic mass tuning.
            </p>

            <div className="space-y-4">
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded space-y-1">
                <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block font-semibold">HYDRATION HEATING MATRIX</span>
                <p className="text-xs text-slate-500 font-light">Specialized low-hydration exothermic concrete formulas are computer-calculated to eliminate inner cracking during thick foundational pours.</p>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 rounded space-y-1">
                <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block font-semibold">SEISMIC SHEAR FORCE RESISTANCE</span>
                <p className="text-xs text-slate-500 font-light">High-ductility steel junctions mapped via Finite Element Analysis (FEA) to absorb and dissipate massive ground wave displacement nodes.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="glass-panel rounded-xl border border-white/10 overflow-hidden shadow-2xl relative bg-[#050810]/50">
              <div className="absolute top-4 right-4 z-20 bg-white/5 border border-white/15 px-3 py-1 rounded text-[9px] font-mono text-slate-300 uppercase">
                Acoustic deflection monitor active
              </div>
              
              <img
                src="/src/assets/images/structural_steel_1780318362692.png"
                alt="Structural Steel Grid"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] object-cover filter contrast-[1.05] brightness-75 select-none"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-transparent p-6 z-10 space-y-3">
                <div className="flex gap-4 items-center">
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-mono text-slate-300 uppercase">AXIAL LOAD TOLERANCE GRID</span>
                    <div className="h-1 bg-white/15 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full animate-pulse" style={{ width: "88%" }} />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">88% Normal</span>
                </div>
                <p className="text-xs text-slate-400 font-light font-mono">
                  A high-resolution photograph capturing the multi-level interconnecting structural steel framework grids engineered with dynamic dampening shear nodes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: SAFETY & EXPERTISE (OSHA HIGH STANDARDS) */}
      <section className="min-h-screen w-full flex items-center px-6 sm:px-12 md:px-24 py-20 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 font-bold inline-flex items-center gap-2">
              <span className="h-[1px] w-4 bg-white" />
              06 / TRUST, INTEGRITY, METRICS
            </p>
            <h3 className="text-3xl sm:text-4xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-none">
              Safety-First Culture, No Compromises
            </h3>
            <p className="text-slate-400 text-sm font-light">
              We maintain rigid compliance rules with daily site risk audits, ensuring all field technicians operate at absolute peak safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAFETY_METRICS.map((metric, i) => (
              <div key={i} className="glass-panel p-6 rounded-xl border border-white/5 space-y-4 relative group hover:border-white/35 transition-all bg-[#050810]/50">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/5 rounded border border-white/15 text-white">
                    {metric.iconName === "ShieldAlert" && <ShieldAlert className="w-5 h-5" />}
                    {metric.iconName === "Award" && <Award className="w-5 h-5" />}
                    {metric.iconName === "BookOpen" && <BookOpen className="w-5 h-5" />}
                  </div>
                  <span className="font-mono text-xs text-slate-500">Benchmark SEC-0{i+1}</span>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-lg font-sans font-bold uppercase text-slate-100">{metric.title}</h4>
                  <span className="text-[11px] font-mono tracking-wider text-slate-300 uppercase block font-semibold">{metric.value}</span>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    {metric.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-[#0b0f19]/45 border border-white/5 rounded-lg text-center font-mono text-[9px] text-gray-400 tracking-widest uppercase">
            ESTIMATED LOST-TIME INJURY FREQUENCY (LTIF) SCORE : <span className="text-green-400 font-bold">0.00 ZERO LEVEL</span>
          </div>
        </div>
      </section>

      {/* SECTION 8: TIMELINE / PROCESS SECTION */}
      <section className="min-h-screen w-full flex items-center px-6 sm:px-12 md:px-24 py-20 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-14 space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 font-bold flex items-center gap-2">
              <span className="h-[1px] w-6 bg-white" />
              07 / PROGRESS ROADMAP
            </p>
            <h3 className="text-3xl sm:text-4xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-none">
              Rigid Engineering Stage Gates
            </h3>
            <p className="text-xs text-slate-500 max-w-lg font-light">
              How we execute projects from initial soil geotechnical drillings through steel mounting to final handover.
            </p>
          </div>

          {/* Stepper Timeline Visualizer */}
          <div className="space-y-4">
            {PROCESS_STEPS.map((step, idx) => (
              <div 
                key={idx}
                className="glass-panel p-5 rounded-lg border border-white/5 bg-[#050810]/50 transition-all duration-300 hover:bg-white/[0.015] hover:border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6"
              >
                {/* Index & Title Block */}
                <div className="flex items-center gap-4 md:w-1/3">
                  <span className="text-4xl font-sans font-black text-transparent text-stroke-white opacity-40 leading-none">{step.number}</span>
                  <div>
                    <h4 className="text-sm font-sans font-bold uppercase text-slate-200">{step.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400 tracking-wider block">{step.duration}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-xs leading-relaxed md:w-1/3 font-light leading-5">
                  {step.description}
                </p>

                {/* Core Deliverable */}
                <div className="md:w-1/4 bg-white/5 border border-white/10 px-4 py-2.5 rounded flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block font-semibold leading-none">TARGET DELIVERABLE</span>
                    <span className="text-[11px] text-slate-300 block truncate font-light">{step.deliverable}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL BUILDING REVEAL */}
      <section className="min-h-screen w-full flex items-center px-6 sm:px-12 md:px-24 py-20 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-xl border border-white/10 overflow-hidden shadow-2xl relative">
              {/* Overlay with subtle visual targets */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 px-3 py-1 rounded text-[9px] font-mono text-slate-300 pointer-events-none">
                <span className="h-1 w-1 bg-white rounded-full animate-ping" />
                <span>CAMERA SIGHT REVEAL : MANHATTAN GRID</span>
              </div>
              
              <img
                src="/src/assets/images/elite_skyscraper_1780318341081.png"
                alt="Elite Skyscraper sunset reveal"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] object-cover filter contrast-[1.08] brightness-[0.75]"
              />

              {/* Decorative dynamic vector target to symbolize structural alignment */}
              <div className="absolute inset-y-12 left-1/2 -translate-x-1/2 w-[1px] bg-white/20 pointer-events-none z-10 select-none animate-pulse" />
              <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-[1px] bg-white/20 pointer-events-none z-10 select-none animate-pulse" />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-transparent p-6 z-10">
                <div className="flex gap-2 items-center text-xs font-mono text-slate-300 mb-1 font-semibold">
                  <span>SPECIFICATION NO: SF-T78</span>
                  <span>|</span>
                  <span>AMERICAN FLAG HOISTED ON INTEGRATED CAPSTONE CAP</span>
                </div>
                <p className="text-slate-400 text-xs font-light leading-relaxed">
                  The photorealistic depiction of the BuildElite commercial skyscraper centerpiece finished in high-grade wind-shear solar low-emissivity structural cladding during golden hour.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-8 bg-white opacity-60" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 font-bold">08 / PRESTIGE LANDMARK</p>
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-sans font-black uppercase text-[#F8FAFC] tracking-tighter leading-none">
              A Golden Hour <br />
              <span className="text-transparent text-stroke-white opacity-85 block mt-1">Structural Majesty</span>
            </h3>

            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Our structures represent local community milestones. This skyscraper tower features a fully integrated flag anchor capstone holding the American flag at heights exceeding 1,100 feet, boasting a storm defense layout designed to withstand sustained winds up to 180 mph.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0" />
                <span>Integrated rooftop solar shell collecting 25% of baseline mechanical system energy</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0" />
                <span>Zoning height-compliance optimized via active mass damper modules</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0" />
                <span>Eco-certified zero emissions water-sealed sub-level mechanical chambers</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/5">
              <button
                onClick={() => scrollToSection(9)}
                className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-1.5 hover:underline transition-colors cursor-pointer"
              >
                Estimate similar tall blueprint
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: CALL TO ACTION (CTA) & ESTIMATOR FORM */}
      <section className="min-h-screen w-full flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 relative bg-gradient-to-t from-[#050810]/40 via-[#050810]/15 to-transparent">
        <div className="max-w-6xl mx-auto w-full space-y-12">
          
          {/* Form and Counselor Panel */}
          <AIEstimateCounselor />

          {/* Quick Contact & Footer Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/10 text-xs font-mono text-slate-400">
            
            {/* Column 1: Info and offices */}
            <div className="space-y-3">
              <h5 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">PRIMARY CORPORATE OFFICES</h5>
              <div className="space-y-2 text-slate-400 leading-relaxed text-[11px]">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-white flex-shrink-0" />
                  <span>Suite 800, 72 Wall Street, NY, New York</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-white flex-shrink-0" />
                  <span>1000 Energy Way, Houston, Texas</span>
                </p>
              </div>
            </div>

            {/* Column 2: Quick Communication form */}
            <div className="space-y-3">
              <h5 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">CONNECT WITH ADVISORY</h5>
              <AnimatePresence mode="wait">
                {!contactSuccess ? (
                  <motion.form
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSuccess(true);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="email"
                      required
                      placeholder="foreman-contact@email.com"
                      className="flex-1 bg-white/5 border border-white/10 p-2 rounded text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white hover:bg-slate-200 text-[#050810] font-sans font-black uppercase text-[10px] tracking-wider rounded transition-all cursor-pointer"
                    >
                      Sync
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[11px] text-emerald-400"
                  >
                    Structural supervisor synchronized. We will wire connection shortly.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Column 3: Custom Domain Delivery info & footer closing */}
            <div className="space-y-3">
              <h5 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">DOMAIN & STATIC STATIONS</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                Securely optimized as requested: buildeliteconstruction.com. Served via Cloudflare edge caching, CDN acceleration, and high-performance video timeline scrub pipelines.
              </p>
              <p className="text-[11px] text-slate-400 font-bold pt-2 font-mono">
                © {new Date().getFullYear()} BuildElite Corporation. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
