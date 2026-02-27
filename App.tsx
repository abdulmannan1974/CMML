import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { BloodDoctorHome } from './components/BloodDoctorHome';
import { CMMLReview } from './components/CMMLReview';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<BloodDoctorHome />} />
        <Route path="/cmml-review" element={<CMMLReview />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
