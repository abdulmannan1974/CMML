import { Link } from 'react-router-dom';
import { ShieldCheck, Droplets } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-500 py-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <Link to="/" className="text-white font-serif font-bold text-2xl mb-2 flex items-center gap-2">
            <ShieldCheck className="text-med-red" size={28} />
            Blood Doctor
          </Link>
          <p className="text-xs text-slate-500 mt-2">
            Hematology Education Platform
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 font-serif font-bold tracking-tight text-slate-400">
            <span>Blood</span>
            <Droplets size={14} className="text-red-600 fill-red-600" />
            <span className="text-red-400">Doctor</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">
            Curated by Dr Abdul Mannan
          </p>
        </div>
        <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/reference" className="hover:text-white transition-colors">Reference</Link>
          <Link to="/cases" className="hover:text-white transition-colors">Cases</Link>
        </div>
      </div>
      <div className="text-center mt-12 text-[9px] text-slate-700 uppercase tracking-[0.3em]">
        For medical educational use only.
      </div>
    </footer>
  );
}
