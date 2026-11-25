import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { SiteProvider } from "./context/SiteData";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Work from "./pages/Work";
import ProjectDetail from "./pages/ProjectDetail";
import Industries from "./pages/Industries";
import IndustryDetail from "./pages/IndustryDetail";
import Technology from "./pages/Technology";
import Process from "./pages/Process";
import Careers from "./pages/Careers";
import CareerDetail from "./pages/CareerDetail";
import Internship from "./pages/Internship";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route path="admin" element={<Admin />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="work" element={<Work />} />
          <Route path="work/:slug" element={<ProjectDetail />} />
          <Route path="industries" element={<Industries />} />
          <Route path="industries/:slug" element={<IndustryDetail />} />
          <Route path="technology" element={<Technology />} />
          <Route path="process" element={<Process />} />
          <Route path="insights" element={<Navigate to="/about" replace />} />
          <Route path="insights/:slug" element={<Navigate to="/about" replace />} />
          <Route path="careers" element={<Careers />} />
          <Route path="careers/:slug" element={<CareerDetail />} />
          <Route path="internship" element={<Internship />} />
          <Route path="internship/:slug" element={<CareerDetail />} />
          <Route path="internshipportal" element={<Navigate to="/internship" replace />} />
          <Route path="internshipportal/*" element={<Navigate to="/internship" replace />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </SiteProvider>
  );
}
