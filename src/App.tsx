import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DiseasePage } from './pages/DiseasePage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { CasesPage } from './pages/CasesPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { ReferencePage } from './pages/ReferencePage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-med-cream text-navy-light font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/disease/:slug" element={<DiseasePage />} />
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:caseId" element={<CaseDetailPage />} />
          <Route path="/reference" element={<ReferencePage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
