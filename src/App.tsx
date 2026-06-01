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
  const [selectedMachineIndex, setSelectedMachineIndex] = useState<number>(0);
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

      // Determine active section index based on current scroll depth (6 sections total, max index 5)
      const sectionHeight = window.innerHeight;
      const currentSection = Math.min(
        5,
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
    { label: "02 DIVISIONS", desc: "Vision & Expertise" },
    { label: "03 SHOWCASE", desc: "Project Showroom" },
    { label: "04 FLIGHT CORE", desc: "Fleet & Framework" },
    { label: "05 STANDARDS", desc: "Process & Safety" },
    { label: "06 INQUIRE", desc: "AI Pricing Model" }
  ];

  return (
    <div className="relative min-h-[600vh] text-slate-100 font-sans z-10 selection:bg-orange-500 selection:text-slate-950">
      
      {/* Immersive Scroll-Scrub Connected Video Background */}
      <ScrollVideoBG progress={scrollProgress} />

      {/* FIXED PREMIUM NAVIGATION HEADER */}
      <header className="fixed top-0 inset-x-0 h-20 bg-gradient-to-b from-[#050810]/95 to-[#050810]/0 z-40 px-4 sm:px-12 flex items-center justify-between border-b border-white/[0.03] backdrop-blur-sm">
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl font-black tracking-tighter text-white">BUILDELITE</span>
          <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-slate-400 font-semibold font-mono">
            Construction Group
          </span>
        </div>

        {/* Desktop Quick Jump Tabs */}
        <nav className="hidden lg:flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300">
          <button onClick={() => scrollToSection(1)} className="hover:text-white transition-all cursor-pointer">Experience</button>
          <button onClick={() => scrollToSection(2)} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Portfolio</button>
          <button onClick={() => scrollToSection(3)} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Machinery</button>
          <button onClick={() => scrollToSection(5)} className="opacity-50 text-white border border-white/20 hover:border-white px-4 py-1 -mt-1 transition-all rounded bg-white/5 cursor-pointer font-bold tracking-widest text-[9px]">Contact</button>
        </nav>

        {/* Ambient construction sound toggle & live indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAmbientAudioOn(!ambientAudioOn)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              ambientAudioOn 
                ? "bg-white/10 border-white/30 text-white" 
                : "bg-white/5 border-white/5 text-slate-400"
            }`}
            title="Toggle simulated low industrial engine hum and distant rivets sounds"
          >
            {ambientAudioOn ? <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            <span className="hidden sm:inline">{ambientAudioOn ? "AMBIENT: ACTIVE" : "AMBIENT: MUTED"}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[8px] sm:text-[9px] font-mono text-slate-300 select-none">
            <span className="h-1 w-1 rounded-full bg-white animate-ping" />
            <span className="tracking-widest uppercase">SSL ACTIVE</span>
          </div>
        </div>
      </header>

      {/* FLOATING SIDEBAR INDEX NAVIGATOR */}
      <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2.5 font-mono">
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
              <div className={`w-3 transition-all duration-300 ${
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
      <section className="h-screen w-full relative flex items-center px-4 sm:px-12 md:px-24">
        <div className="w-full grid grid-cols-12 gap-6 items-center mt-12 sm:mt-20">
          
          {/* Aesthetic column left */}
          <div className="hidden md:flex col-span-1 flex-col items-center justify-center space-y-6">
            <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent mx-auto"></div>
            <div className="text-[8px] font-mono origin-left -rotate-90 whitespace-nowrap tracking-[0.5em] text-slate-400">SCROLL SYSTEM</div>
            <div className="space-y-2.5 pt-10 flex flex-col items-center">
              <div className="w-2   h-2 rounded-full bg-white"></div>
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
            </div>
          </div>

          {/* Central Headline */}
          <div className="col-span-12 md:col-span-8 space-y-4 sm:space-y-5">
            <div className="flex items-center space-x-3 opacity-75">
              <span className="h-[1px] w-8 bg-white"></span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-bold text-slate-200">Establishing Foundations</span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase font-sans text-white"
            >
              Building the<br />
              Future of<br />
              <span className="text-stroke-white text-transparent">America</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md pt-1"
            >
              Engineering Excellence. Structural Precision. Trusted Construction. BuildElite defines the new standard of US infrastructure through cinematic precision and relentless quality control.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-3 pt-3"
            >
              <button
                onClick={() => scrollToSection(5)}
                className="px-5 py-3 bg-white text-[#050810] font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center gap-1.5 cursor-pointer"
              >
                Request Estimate
                <ChevronRight className="w-3.5 h-3.5 text-[#050810]" />
              </button>
              <button
                onClick={() => scrollToSection(1)}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/20 text-[10px] sm:text-xs font-mono uppercase tracking-widest rounded transition-all cursor-pointer"
              >
                Inspect divisions
              </button>
            </motion.div>
          </div>

          {/* Right Status Panel */}
          <div className="col-span-12 md:col-span-3 flex flex-col space-y-6 md:space-y-8 mt-4 md:mt-0">
            <div className="backdrop-blur-md bg-white/5 border-l-2 border-white/30 p-4 sm:p-5 space-y-3 rounded-r">
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">Current Section</div>
              <div className="text-xl font-bold font-mono">01 <span className="text-xs font-normal opacity-50 ml-1.5">/ 06</span></div>
              <div className="text-xs font-semibold border-b border-white/10 pb-1.5 text-slate-200">Hero Cinematic Intro</div>
              <p className="text-[8px] text-slate-500 leading-tight uppercase font-mono">
                Next: Corporate Vision & Divisions
              </p>
            </div>

            <div className="space-y-4 hidden sm:block">
              <div className="space-y-1">
                <div className="text-[8px] uppercase tracking-widest opacity-50 font-mono text-slate-300">Structural Trust Ratio</div>
                <div className="h-[2px] w-full bg-slate-800">
                  <div className="h-full bg-white w-[88%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] uppercase tracking-widest opacity-50 font-mono text-slate-300">Safety Compliance</div>
                <div className="h-[2px] w-full bg-slate-800">
                  <div className="h-full bg-white w-full"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Down Scroll Animation indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-500 font-mono text-[8px] tracking-widest pointer-events-none">
          <span className="uppercase text-[7px] opacity-60">Scroll to deploy story</span>
          <div className="w-4 h-7 border border-white/20 rounded-full relative">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMPANY VISION & DIVISIONS */}
      <section className="min-h-screen w-full flex items-center px-4 sm:px-12 md:px-24 py-16 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Vision Statement & Condensed stats */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-6 bg-white opacity-60" />
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-300 font-bold">01 / ESTABLISHED NATIONWIDE AUTHORITY</p>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-none">
              A Legacy Forged in Steel <br />
              <span className="text-transparent text-stroke-white opacity-80">& Concrete Precision</span>
            </h3>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
              At BuildElite, we don't just pour foundations; we engineer national resilience. Our mission centers on delivering zero-defect commercial landmarks, heavy terminals, and storm-proof coastal facilities.
            </p>

            {/* Quick clean visual stats cards to remove clutter */}
            <div className="grid grid-cols-2 gap-3.5 pt-3">
              <div className="bg-white/[0.03] border border-white/5 p-3.5 rounded">
                <span className="text-2xl font-sans font-black text-white block">50+</span>
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block">Years Active</span>
              </div>
              <div className="bg-white/[0.03] border border-white/5 p-3.5 rounded">
                <span className="text-2xl font-sans font-black text-white block">340+</span>
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block">Megastructures</span>
              </div>
              <div className="bg-white/[0.03] border border-white/5 p-3.5 rounded">
                <span className="text-2xl font-sans font-black text-white block">Zero</span>
                <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest block">Incidents</span>
              </div>
              <div className="bg-white/[0.03] border border-white/5 p-3.5 rounded">
                <span className="text-2xl font-sans font-black text-white block">$6.4B</span>
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block">Assets Built</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Divisions Hub */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Corporate Divisions</span>
              <span className="text-[9px] font-mono text-slate-500">Tap to inspect division specs</span>
            </div>

            {/* Horizontal Flex pile for tabs (fluid and ultra compact on mobile) */}
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`px-3.5 py-2 rounded text-[10px] font-mono uppercase border transition-all cursor-pointer ${
                    selectedService.id === srv.id 
                      ? "bg-white text-[#050810] border-white font-bold" 
                      : "bg-[#0b0f19]/20 border-white/5 text-slate-300 hover:border-white/20"
                  }`}
                >
                  {srv.title.split(" & ")[0].split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Selected Service Spec Frame */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedService.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white/[0.02] p-5 sm:p-6 rounded-lg border border-white/10 space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded border border-white/15">
                    {selectedService.iconName === "Building2" && <Building2 className="w-5 h-5 text-white" />}
                    {selectedService.iconName === "HardHat" && <HardHat className="w-5 h-5 text-white" />}
                    {selectedService.iconName === "Factory" && <Factory className="w-5 h-5 text-white" />}
                    {selectedService.iconName === "ShieldCheck" && <ShieldCheck className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-sans font-bold uppercase text-slate-100">{selectedService.title}</h4>
                    <span className="text-[9px] font-mono text-slate-500 tracking-wider block">LEVEL-A US SPECIFICATION REGISTRY</span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                  {selectedService.description}
                </p>

                <div className="space-y-2 pt-1 border-t border-white/5">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Division Capabilities</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedService.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <Zap className="w-3 h-3 text-slate-300 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-[9px] font-mono text-slate-400">
                  <span className="text-slate-500">STANDARD ARCHITECTURE: </span> {selectedService.specs}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* SECTION 3: THE PREMIUM PORTFOLIO */}
      <section className="min-h-screen w-full flex items-center px-4 sm:px-12 md:px-24 py-16 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-300 font-bold flex items-center gap-2">
                <span className="h-[1px] w-6 bg-white" />
                02 / THE PREMIUM PORTFOLIO
              </p>
              <h3 className="text-2xl sm:text-3xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-none">
                Erected High-End Landmarks
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Active Structural Case Studies</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Visual Screen on Left */}
            <div className="lg:col-span-7 relative group rounded-xl overflow-hidden border border-white/10 shadow-2xl min-h-[280px] sm:min-h-[380px]">
              {/* Highlight Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
              
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full absolute inset-0 object-cover object-center transform scale-101 group-hover:scale-104 transition-transform duration-700 filter brightness-[0.85] contrast-[1.05]"
              />

              <div className="absolute bottom-5 left-5 right-5 z-20 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-mono tracking-wider text-slate-200">{selectedProject.city}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-sans font-black uppercase text-white">{selectedProject.title}</h4>
                <p className="text-xs text-slate-300 font-light max-w-lg leading-normal">{selectedProject.description}</p>
              </div>
            </div>

            {/* Spec Sheet on Right */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#050810]/60 p-5 rounded-xl border border-white/5 backdrop-blur-md">
              <div className="space-y-5">
                <div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase block mb-2 font-bold tracking-widest">SELECT ACTIVE UNIT</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PROJECTS.map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => setSelectedProject(proj)}
                        className={`px-2.5 py-1.5 text-[9px] font-mono rounded border transition-all cursor-pointer ${
                          selectedProject.id === proj.id 
                            ? "bg-white text-[#050810] border-white font-bold" 
                            : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                        }`}
                      >
                        {proj.title.split(" ")[1] || proj.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">PROJECT TYPE</span>
                    <span className="text-slate-100 font-medium font-mono">{selectedProject.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">YEAR COMPLETED</span>
                    <span className="text-slate-100 font-medium font-mono">{selectedProject.year}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block mb-2 font-bold tracking-widest">CONSTRUCTION ENGINEERING CONSTANTS</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedProject.stats.map((stat, i) => (
                      <div key={i} className="bg-white/[0.02] p-2.5 rounded border border-white/[0.05] space-y-0.5">
                        <span className="text-[8px] font-mono text-slate-500 uppercase block">{stat.label}</span>
                        <span className="text-xs sm:text-sm font-sans font-extrabold text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-4">
                <button
                  onClick={() => scrollToSection(5)}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[9px] font-mono uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Request Spec Proposal
                  <ArrowUpRight className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HARD CIVIL LOGISTICS & PHYSICS FRAME */}
      <section className="min-h-screen w-full flex items-center px-4 sm:px-12 md:px-24 py-16 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Machinery Specs Selector */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-1">
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-300 font-bold flex items-center gap-2">
                <span className="h-[1px] w-6 bg-white" />
                03 / HARD CIVIL LOGISTICS CORE
              </p>
              <h3 className="text-2xl sm:text-3xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-none">
                High-Payload Industrial Fleet
              </h3>
            </div>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
              We own and deploy extreme machinery to secure excavation speed. Tap a model unit below to view dynamic engine specifications and capacities:
            </p>

            {/* Industrial Pile list selector */}
            <div className="flex flex-col gap-2">
              {MACHINES.map((machine, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedMachineIndex(i);
                    handleMachineInteraction(i);
                  }}
                  className={`text-left p-3.5 rounded border transition-all duration-350 cursor-pointer flex items-center justify-between ${
                    selectedMachineIndex === i 
                      ? "bg-white/10 border-white/30 text-white" 
                      : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/15"
                  }`}
                >
                  <div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">{machine.type}</span>
                    <h4 className="text-xs sm:text-sm font-sans font-bold uppercase">{machine.name}</h4>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-500 ${selectedMachineIndex === i ? "text-white translate-x-1" : ""}`} />
                </button>
              ))}
            </div>

            {/* Rendered Machine stats panel directly in context */}
            <div className="bg-white/[0.02] p-4 rounded border border-white/5 space-y-1 text-xs">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">MAX CAPACITY RATING:</span>
                <span className="text-slate-300 font-bold">{MACHINES[selectedMachineIndex].capacity.split(" / ")[0]}</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">ENGINE SYSTEM HP:</span>
                <span className="text-slate-300">{MACHINES[selectedMachineIndex].powerRating}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono italic pt-1 border-t border-white/[0.03] mt-1.5">
                {MACHINES[selectedMachineIndex].usage}
              </p>
            </div>
          </div>

          {/* Right Column: Physical steel deflection framework */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Structural Physics & Resilience</span>
              <span className="text-[8px] font-mono text-emerald-400">Deflection Monitor Active</span>
            </div>

            <div className="glass-panel rounded-xl border border-white/10 overflow-hidden shadow-2xl relative bg-[#050810]/50 h-[240px] sm:h-[320px]">
              <img
                src="/src/assets/images/structural_steel_1780318362692.png"
                alt="Structural Steel Grid"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-[1.08] brightness-75 select-none"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-transparent p-5 space-y-2 z-20">
                <div className="flex gap-4 items-center">
                  <div className="flex-1 space-y-1">
                    <span className="text-[8px] font-mono text-slate-300 uppercase tracking-widest font-bold">AXIAL LOAD TOLERANCE GRID</span>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full animate-pulse" style={{ width: "88%" }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white">88% Normal</span>
                </div>
                <p className="text-[10px] text-slate-400 font-light font-mono leading-tight">
                  High-ductility steel junctions mapped via Finite Element Analysis (FEA) to absorb massive stress loads.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: SAFETY culture & PROCESS TIME STAGE GATES */}
      <section className="min-h-screen w-full flex items-center px-4 sm:px-12 md:px-24 py-16 relative bg-transparent">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-8 max-w-2xl space-y-1.5">
            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-300 font-bold inline-flex items-center gap-2">
              <span className="h-[1px] w-4 bg-white" />
              04 / STANDARDS, SECURITY & TIMELINE
            </p>
            <h3 className="text-2xl sm:text-3xl font-sans font-black uppercase text-slate-100 tracking-tighter leading-none">
              Rigid Compliance & Execution Gates
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm font-light">
              We maintain rigid compliance rules with daily site risk audits, fast-tracking construction through structured geotechnical stage-gates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Box: Safety indicators (Highly clean list tags to replace giant cards) */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold mb-1">OSHA COMPLIANCE INDEX</span>
              
              {SAFETY_METRICS.map((metric, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded flex items-center gap-4 hover:border-white/20 transition-all">
                  <div className="p-2.5 bg-white/5 rounded text-white flex-shrink-0">
                    {metric.iconName === "ShieldAlert" && <ShieldAlert className="w-4 h-4" />}
                    {metric.iconName === "Award" && <Award className="w-4 h-4" />}
                    {metric.iconName === "BookOpen" && <BookOpen className="w-4 h-4" />}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-sans font-black text-white">{metric.title}</span>
                    <span className="text-[9px] font-mono tracking-wider text-slate-400 block font-semibold">{metric.value}</span>
                  </div>
                </div>
              ))}
              
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-center font-mono text-emerald-400 tracking-wider">
                LOST-TIME INJURY (LTIF) SCORE : 0.00 ZERO LEVEL
              </div>
            </div>

            {/* Right Box: Streamlined active timeline stages */}
            <div className="lg:col-span-8 bg-[#050810]/50 p-5 rounded-xl border border-white/5 backdrop-blur-md flex flex-col justify-center space-y-4">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">DELIVERABLE ROADMAP STATS</span>

              {/* Keep 3 key scrolly stages to avoid "toufu" long scrolls */}
              <div className="space-y-3">
                <div className="border-l-2 border-white/20 pl-4 py-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-slate-200">STAGE 01</span>
                    <h5 className="text-xs sm:text-sm font-sans font-bold uppercase text-slate-200">Soil Geotechnical Drill & Master Planning</h5>
                  </div>
                  <p className="text-slate-400 text-xs font-light leading-relaxed">
                    Boring core samples, soil classifications, density mapping, and structural permits to secure foundations under AASHTO parameters.
                  </p>
                </div>

                <div className="border-l-2 border-white/20 pl-4 py-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-slate-200">STAGE 02</span>
                    <h5 className="text-xs sm:text-sm font-sans font-bold uppercase text-slate-200">Concrete Casting & High Axial Foundations</h5>
                  </div>
                  <p className="text-slate-400 text-xs font-light leading-relaxed">
                    Assembling rebar cages, water-sealing subdrain membranes, and pouring solid substructures resisting loads up to 10,000 PSI.
                  </p>
                </div>

                <div className="border-l-2 border-white/25 pl-4 py-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-slate-200">STAGE 03</span>
                    <h5 className="text-xs sm:text-sm font-sans font-bold uppercase text-slate-200">Framing Superstructure & High Cladding Handover</h5>
                  </div>
                  <p className="text-slate-400 text-xs font-light leading-relaxed">
                    Erecting structural columns and dynamic shear dampers followed by custom window glazing cladding, fit-out design and client handover.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CALL TO ACTION (CTA), ESTIMATOR FORM & FOOTER */}
      <section className="min-h-screen w-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-16 relative bg-gradient-to-t from-[#050810]/40 via-[#050810]/15 to-transparent">
        <div className="max-w-6xl mx-auto w-full space-y-10 sm:space-y-12">
          
          {/* Form and Counselor Panel */}
          <AIEstimateCounselor />

          {/* Quick Contact & Footer Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/10 text-[11px] sm:text-xs font-mono text-slate-400">
            
            {/* Column 1: Info and offices */}
            <div className="space-y-2.5">
              <h5 className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">PRIMARY CORPORATE OFFICES</h5>
              <div className="space-y-1.5 text-slate-400 text-[10px] leading-relaxed">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white flex-shrink-0" />
                  <span>Suite 800, 72 Wall Street, NY, New York</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white flex-shrink-0" />
                  <span>1000 Energy Way, Houston, Texas</span>
                </p>
              </div>
            </div>

            {/* Column 2: Quick Communication form */}
            <div className="space-y-2.5">
              <h5 className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">CONNECT WITH ADVISORY</h5>
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
                      className="flex-1 bg-white/5 border border-white/15 p-2 rounded text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-white hover:bg-slate-200 text-[#050810] font-sans font-black uppercase text-[10px] tracking-wider rounded transition-all cursor-pointer"
                    >
                      Sync
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded text-[10px] text-emerald-400"
                  >
                    Structural supervisor synchronized successfully.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Column 3: Custom Domain Delivery info & footer closing */}
            <div className="space-y-2.5">
              <h5 className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">DOMAIN & STATIC STATIONS</h5>
              <p className="text-[10px] text-slate-500 leading-normal font-light">
                Securely optimized: buildeliteconstruction.com. Served via high-performance scrollytelling.
              </p>
              <p className="text-[10px] text-slate-400 font-bold pt-1 font-mono">
                © {new Date().getFullYear()} BuildElite Corporation. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
