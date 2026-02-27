import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, BookOpen, ArrowRight, Microscope, Activity,
  HeartPulse, ShieldCheck, GraduationCap, Users, FileText,
  ChevronRight, Star, Clock, Globe
} from 'lucide-react';

const BloodDoctorLogo = ({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) => {
  const textSize = size === "large" ? "text-4xl md:text-5xl" : size === "small" ? "text-lg" : "text-2xl md:text-3xl";
  const iconSize = size === "large" ? 32 : size === "small" ? 16 : 24;
  return (
    <div className={`flex items-center gap-2 font-serif font-bold tracking-tight ${textSize} ${className}`}>
      <span className="text-slate-900">Blood</span>
      <Droplets size={iconSize} className="text-red-600 fill-red-600 animate-pulse" />
      <span className="text-red-700">Doctor</span>
    </div>
  );
};

const FloatingCell = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <div
    className="absolute rounded-full opacity-10 animate-pulse"
    style={{
      left: x, top: y, width: size, height: size,
      background: 'radial-gradient(circle, #991b1b 0%, transparent 70%)',
      animationDelay: `${delay}s`,
      animationDuration: '4s'
    }}
  />
);

const ReviewCard = ({
  title, subtitle, description, status, path, icon, accent
}: {
  title: string; subtitle: string; description: string; status: "live" | "coming-soon"; path?: string; icon: React.ReactNode; accent: string;
}) => {
  const card = (
    <div className={`group relative p-8 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 h-full flex flex-col ${status === 'live' ? 'hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 cursor-pointer' : 'opacity-60'}`}>
      <div className="flex items-start justify-between mb-6">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${accent} text-white shadow-lg`}>
          {icon}
        </div>
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status === 'live' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
          {status === 'live' ? 'Live' : 'Coming Soon'}
        </span>
      </div>
      <h3 className="font-serif text-2xl text-slate-900 mb-1 leading-tight">{title}</h3>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{subtitle}</p>
      <p className="text-slate-500 text-sm leading-relaxed flex-grow">{description}</p>
      {status === 'live' && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
          <span>Open Review</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </div>
  );

  if (status === 'live' && path) {
    return <Link to={path} className="block h-full">{card}</Link>;
  }
  return card;
};

const StatCard = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => (
  <div className="text-center p-6">
    <div className="flex justify-center mb-3 text-red-700">{icon}</div>
    <div className="font-serif text-3xl md:text-4xl text-slate-900 mb-1">{value}</div>
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
  </div>
);

export const BloodDoctorHome: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-red-100 font-sans">

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <BloodDoctorLogo size="small" />
          <div className="flex items-center gap-6">
            <a href="#reviews" className="hidden md:inline text-[10px] font-bold tracking-widest text-slate-500 uppercase hover:text-red-700 transition-colors">Reviews</a>
            <a href="#about" className="hidden md:inline text-[10px] font-bold tracking-widest text-slate-500 uppercase hover:text-red-700 transition-colors">About</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
        {/* Decorative floating cells */}
        <FloatingCell delay={0} x="10%" y="20%" size={200} />
        <FloatingCell delay={1.5} x="75%" y="15%" size={150} />
        <FloatingCell delay={0.8} x="60%" y="65%" size={180} />
        <FloatingCell delay={2} x="20%" y="70%" size={120} />
        <FloatingCell delay={1} x="85%" y="50%" size={100} />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-slate-50"></div>

        <div className="relative z-10 container mx-auto px-6 text-center pt-20">
          <div className="inline-block px-5 py-2 border border-red-200 text-red-700 text-[10px] tracking-[0.3em] uppercase font-black rounded-full bg-red-50/80 backdrop-blur-sm mb-8">
            Clinical Haematology Education Platform
          </div>

          <BloodDoctorLogo size="large" className="justify-center mb-8" />

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-6 font-light">
            Interactive state-of-the-art clinical reviews in haematology, produced for medical education by senior clinicians and pathologists.
          </p>

          <div className="mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Curated & Produced by</p>
            <p className="font-serif text-xl text-slate-800">Dr Abdul Mannan <span className="text-sm font-sans font-medium text-slate-500 ml-1 italic">FRCPath FCPS</span></p>
          </div>

          <a href="#reviews" className="inline-flex items-center gap-3 px-8 py-4 bg-red-800 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-red-900 transition-colors shadow-lg hover:shadow-xl">
            <BookOpen size={18} />
            Browse Reviews
          </a>
        </div>
      </header>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="1" label="Published Review" icon={<FileText size={24} />} />
            <StatCard value="BJH" label="Journal Source" icon={<BookOpen size={24} />} />
            <StatCard value="2025" label="Latest Publication" icon={<Clock size={24} />} />
            <StatCard value="HHU" label="Academic Partner" icon={<GraduationCap size={24} />} />
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section id="reviews" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-2 text-red-700 mb-4">
              <BookOpen size={24} />
              <span className="text-xs font-black tracking-widest uppercase">Clinical Reviews</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-slate-900">State-of-the-Art Reviews</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Comprehensive, interactive clinical reviews distilled from leading haematology journals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ReviewCard
              title="CMML"
              subtitle="Chronic Myelomonocytic Leukaemia"
              description="Complete clinical management review covering pathogenesis, molecular landscape, diagnostic criteria, prognostic scoring, and therapeutic pathways. Based on Nachtkamp et al., BJH 2025."
              status="live"
              path="/cmml-review"
              icon={<Microscope size={24} />}
              accent="bg-red-800"
            />
            <ReviewCard
              title="MDS"
              subtitle="Myelodysplastic Syndromes"
              description="Upcoming interactive review covering classification, risk stratification, and modern treatment approaches for myelodysplastic syndromes."
              status="coming-soon"
              icon={<Activity size={24} />}
              accent="bg-slate-400"
            />
            <ReviewCard
              title="AML"
              subtitle="Acute Myeloid Leukaemia"
              description="Planned review covering molecular classification, targeted therapies, and transplantation decisions in acute myeloid leukaemia."
              status="coming-soon"
              icon={<HeartPulse size={24} />}
              accent="bg-slate-400"
            />
          </div>
        </div>
      </section>

      {/* About / Mission */}
      <section id="about" className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <div className="flex items-center gap-2 text-red-700 mb-4">
                <ShieldCheck size={24} />
                <span className="text-xs font-black tracking-widest uppercase">Our Mission</span>
              </div>
              <h2 className="font-serif text-4xl mb-6 text-slate-900">Bridging Research & Practice</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Blood Doctor transforms landmark haematology publications into interactive, visually rich clinical reviews designed for practicing clinicians, trainees, and medical educators.
                </p>
                <p>
                  Each review is meticulously produced from peer-reviewed literature, featuring interactive diagnostic tools, prognostic calculators, and treatment decision frameworks.
                </p>
                <p className="font-medium text-slate-800">
                  Our goal is to make complex haematological knowledge accessible, memorable, and immediately applicable at the point of care.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Globe size={20} className="text-red-700" />
                  <h4 className="font-bold text-slate-900 text-sm">Evidence-Based</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Every review is grounded in peer-reviewed publications from leading journals like the British Journal of Haematology.</p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Star size={20} className="text-red-700" />
                  <h4 className="font-bold text-slate-900 text-sm">Interactive Learning</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Features like diagnostic checklists, prognostic calculators, and treatment trees bring clinical data to life.</p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Users size={20} className="text-red-700" />
                  <h4 className="font-bold text-slate-900 text-sm">Expert Curation</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Produced by Dr Abdul Mannan (FRCPath FCPS), a senior medical engineer with deep expertise in haematology diagnostics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="text-center md:text-left">
              <BloodDoctorLogo size="small" className="[&_span]:text-white mb-2" />
              <p className="text-xs text-slate-600 mt-2">Clinical Haematology Education Platform</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-300 font-serif text-lg">Dr Abdul Mannan</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-600">FRCPath FCPS</p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Medical Disclaimer</a>
            </div>
            <div className="text-[9px] text-slate-700 uppercase tracking-[0.3em]">
              © 2025 Blood Doctor. For medical educational use only.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
