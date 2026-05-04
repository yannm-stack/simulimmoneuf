/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import Home from "./pages/Home";
import PTZ from "./pages/PTZ";
import PTZCalculator from "./pages/PTZCalculator";
import Simulation from "./pages/Simulation";
import Results from "./pages/Results";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import GuideEtapes from "./pages/GuideEtapes";
import GuideGaranties from "./pages/GuideGaranties";
import GuideAvantages from "./pages/GuideAvantages";
import MeetingRequest from "./pages/MeetingRequest";
import NotaryFeesCalculator from "./pages/NotaryFeesCalculator";
import MentionsLegales from "./pages/MentionsLegales";
import Cookies from "./pages/Cookies";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookieConsent from "./components/CookieConsent";
import InstallPWA from "./components/InstallPWA";

import { ErrorBoundary } from "./components/ErrorBoundary";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white pb-[80px] md:pb-0">
        <Navbar />
        <main>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ptz" element={<PTZ />} />
              <Route path="/simulateur-ptz" element={<PTZCalculator />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/results" element={<Results />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/guide/etapes" element={<GuideEtapes />} />
              <Route path="/guide/garanties" element={<GuideGaranties />} />
              <Route path="/guide/avantages" element={<GuideAvantages />} />
              <Route path="/calcul-frais-de-notaire" element={<NotaryFeesCalculator />} />
              <Route path="/etude-projet" element={<MeetingRequest />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
        <MobileNav />
        <CookieConsent />
        <InstallPWA />
      </div>
    </BrowserRouter>
  );
}
