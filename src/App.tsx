/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, Truck, Sparkles, UserCheck, 
  Clock, ShieldCheck, Zap, ArrowRight, Building2, 
  CheckCircle2, Phone, Mail, MapPin, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Types
type PageType = 'home' | 'services' | 'employers' | 'jobseekers' | 'whyus' | 'about' | 'contact';

interface PageProps {
  navigate: (page: PageType) => void;
}

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle sticky header effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (page: PageType) => {
    setActivePage(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { label: string; value: PageType }[] = [
    { label: 'Home', value: 'home' },
    { label: 'Services', value: 'services' },
    { label: 'Employers', value: 'employers' },
    { label: 'Job Seekers', value: 'jobseekers' },
    { label: 'Why Us', value: 'whyus' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-brand-accent/30">
      {/* --- NAVIGATION --- */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-sm py-3 border-b border-slate-100' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => navigate('home')}>
            <span className={`text-2xl font-bold tracking-tighter transition-colors font-display ${
              scrolled ? 'text-brand-dark' : 'text-brand-dark'
            }`}>
              DEVELOPER SINGH<span className="text-blue-600 group-hover:animate-pulse">.</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button 
                key={item.value}
                onClick={() => navigate(item.value)}
                className={`text-sm font-semibold hover:text-blue-600 transition-colors ${
                  activePage === item.value ? 'text-blue-600' : 'text-brand-dark'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => navigate('employers')}
              className="bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-brand-dark/10"
            >
              Request Staff
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-brand-dark" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 p-6"
          >
            {navItems.map((item) => (
              <button 
                key={item.value}
                onClick={() => navigate(item.value)}
                className={`text-3xl font-bold font-display ${
                  activePage === item.value ? 'text-blue-600' : 'text-brand-dark'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              className="bg-brand-dark text-white px-10 py-4 rounded-full font-bold text-xl w-full max-w-xs shadow-xl"
              onClick={() => navigate('employers')}
            >
              Request Staff
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PAGE CONTENT ROUTING --- */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activePage === 'home' && <HomePage navigate={navigate} />}
            {activePage === 'services' && <ServicesPage navigate={navigate} />}
            {activePage === 'employers' && <EmployersPage />}
            {activePage === 'jobseekers' && <JobSeekersPage />}
            {activePage === 'whyus' && <WhyChooseUsPage navigate={navigate} />}
            {activePage === 'about' && <AboutUsPage />}
            {activePage === 'contact' && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-brand-dark text-white pt-24 pb-12">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-display">DEVELOPER SINGH CORPORATION</h2>
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
              Leading nationwide staffing solutions across Canada. Dependable, pre-screened workers for modern industrial needs including warehouse, cleaning, and general labour.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-300">
                <Phone size={18} className="text-blue-400" /> 
                <span className="font-medium">647-695-4420</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail size={18} className="text-blue-400" />
                <span className="font-medium">contact@developersingh.ca</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Sparkles size={18} className="text-green-400" />
                <span className="font-medium">career@developersingh.com</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate('services')}>Warehouse Staffing</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate('services')}>Cleaning Staffing</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate('services')}>General Labour</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate('jobseekers')}>Career Portal</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Service Areas</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-center"><MapPin size={14} className="mr-2 text-blue-400" /> Overall Ontario</li>
              <li className="flex items-center"><MapPin size={14} className="mr-2 text-blue-400" /> Quebec</li>
              <li className="flex items-center"><MapPin size={14} className="mr-2 text-blue-400" /> Montreal</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 border-t border-slate-800 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-4 text-center md:text-left">
          <p>© 2024 Developer Singh Corporation. All Rights Reserved. Serving Businesses Across Canada.</p>
          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                PAGE COMPONENTS                             */
/* -------------------------------------------------------------------------- */

// --- 1. HOME PAGE ---
const HomePage: React.FC<PageProps> = ({ navigate }) => (
  <div className="space-y-0">
    {/* HERO SECTION - SPLIT LAYOUT */}
    <section className="relative min-h-[calc(100vh-80px)] grid lg:grid-cols-2 bg-brand-light overflow-hidden">
      {/* Left Column: Content */}
      <div className="flex flex-col justify-center px-6 lg:px-24 py-20 space-y-10 z-20 relative">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit"
        >
          <span>Available Nationwide in Canada</span>
        </motion.div>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-dark leading-[1.1] font-display">
          Reliable Workforce <br/>Solutions <span className="text-blue-600 underline underline-offset-8 decoration-4">Across Canada</span>
        </h1>
        
        <p className="text-lg text-slate-600 max-w-md leading-relaxed">
          We provide dependable, pre-screened workers for warehouse, cleaning, and general labour needs—delivered within 24–48 hours.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <button 
            onClick={() => navigate('employers')} 
            className="group bg-brand-dark text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-900 shadow-xl flex items-center justify-center transition-all"
          >
            Request Staff <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('jobseekers')} 
            className="border-2 border-brand-dark text-brand-dark px-10 py-4 rounded-xl font-bold hover:bg-brand-dark hover:text-white transition-all text-lg"
          >
            Apply for Jobs
          </button>
        </div>
      </div>

      {/* Right Column: Visual and Glass Card */}
      <div className="relative bg-brand-dark h-[500px] lg:h-auto overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200" 
            alt="Warehouse Operations" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-brand-light lg:to-brand-light z-10"></div>
        
        <div className="relative h-full flex items-center justify-center z-20 px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[40px] w-full max-w-sm text-white shadow-2xl relative"
          >
            <div className="bg-green-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-4xl font-black mb-2 tracking-tight font-display">24-48 HR</h3>
            <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-8">Verified Deployment</p>
            
            <div className="space-y-5">
              <div className="flex items-center space-x-4 text-sm font-medium">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold">1</div>
                <span className="text-white/90">Overall Ontario</span>
              </div>
              <div className="flex items-center space-x-4 text-sm font-medium">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold">2</div>
                <span className="text-white/90">Quebec</span>
              </div>
              <div className="flex items-center space-x-4 text-sm font-medium">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold">3</div>
                <span className="text-white/90">Montreal</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* TRUST INDICATORS - OVERLAP ON LIGHT BG */}
    <section className="container mx-auto px-6 -mt-16 lg:-mt-24 relative z-30 pb-20">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { 
            icon: <Truck />, 
            title: "Warehouse Staffing", 
            desc: "Expert pickers, packers, and forklift operators ready for duty.",
            image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=600"
          },
          { 
            icon: <Sparkles />, 
            title: "Cleaning Staffing", 
            desc: "Commercial and industrial sanitation teams for clean workspaces.",
            image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600"
          },
          { 
            icon: <Building2 />, 
            title: "General Labour", 
            desc: "Versatile help for assembly, construction, and manual tasks.",
            image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600"
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className="h-40 relative">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors duration-500"></div>
              <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-brand-dark text-lg font-display">{item.title}</h4>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              <button 
                onClick={() => navigate('services')}
                className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors"
              >
                Learn More <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* TRUST INDICATORS - CORE VALUES */}
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12 text-center lg:text-left">
        {[
          { icon: <Clock className="mx-auto lg:mx-0" />, title: "Rapid Placement", desc: "Urgent staffing requests filled in hours, not weeks. Our speed is your advantage." },
          { icon: <UserCheck className="mx-auto lg:mx-0" />, title: "Reliable Workforce", desc: "All candidates undergo multi-stage background checks and skills screening." },
          { icon: <Zap className="mx-auto lg:mx-0" />, title: "Flexible Scaling", desc: "Easily scale up or down based on your seasonal demand and operational needs." }
        ].map((item, idx) => (
          <div key={idx} className="space-y-4">
            <div className="text-blue-600">{React.cloneElement(item.icon as React.ReactElement, { size: 32 })}</div>
            <h3 className="text-xl font-bold text-brand-dark font-display">{item.title}</h3>
            <p className="text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section className="bg-brand-light py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3">
            <h2 className="text-4xl lg:text-5xl font-black text-brand-dark font-display leading-tight">Our 3-Step Simple Process</h2>
            <p className="text-slate-500 mt-6 text-lg">We take the complexity out of industrial hiring so you can focus on your business goals.</p>
            <button 
              onClick={() => navigate('employers')} 
              className="mt-8 bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition-colors"
            >
              Get Started
            </button>
          </div>
          <div className="lg:w-2/3 grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Submit Request", text: "Tell us about the number of workers and specific roles needed." },
              { step: "02", title: "Match & Verify", text: "We match candidates from our pre-screened national talent pool." },
              { step: "03", title: "Deployment", text: "Workers arrive at your site within 24–48 hours, fully prepped." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 group">
                <span className="text-6xl font-black text-brand-dark/5 group-hover:text-blue-100 transition-colors duration-500 font-display">{item.step}</span>
                <h4 className="text-xl font-bold text-brand-dark font-display">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section className="container mx-auto px-6 py-24">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Robert K.", company: "Logistics Hub Manager", text: "Developer Singh Corp saved us during the peak holiday season. They had 15 workers on-site in 24 hours." },
          { name: "Sarah L.", company: "Facility Director", text: "The cleaning crew they sent was professional and thorough. Best staffing experience in Canada." },
          { name: "Mike T.", company: "Construction Supervisor", text: "Reliable general labourers are hard to find. Developer Singh provides top-tier candidates every time." }
        ].map((t, idx) => (
          <div key={idx} className="bg-brand-light p-8 rounded-3xl border-l-[6px] border-blue-600 shadow-sm hover:shadow-md transition-shadow">
            <p className="italic text-slate-600 mb-8 font-medium leading-relaxed">"{t.text}"</p>
            <div>
              <p className="font-bold text-brand-dark text-lg font-display">{t.name}</p>
              <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">{t.company}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* FINAL CTA */}
    <section className="py-24 text-center bg-brand-dark relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
      
      <div className="container mx-auto px-6 space-y-10 relative z-10 text-white">
        <h2 className="text-5xl lg:text-7xl font-extrabold font-display leading-[1.1]">Reliable workers in <br/><span className="text-blue-400">24–48 Hours</span></h2>
        <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">Join hundreds of Canadian business leaders who trust Developer Singh for their critical workforce needs.</p>
        <button 
          onClick={() => navigate('employers')} 
          className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
        >
          Start Staffing Today
        </button>
      </div>
    </section>
  </div>
);

// --- 2. SERVICES PAGE ---
const ServicesPage: React.FC<PageProps> = ({ navigate }) => (
  <div className="container mx-auto px-6 py-20 space-y-32">
    <div className="text-center space-y-6">
      <h1 className="text-5xl lg:text-7xl font-black text-brand-dark font-display">Our Expertise</h1>
      <p className="text-xl text-slate-500 max-w-2xl mx-auto">Comprehensive workforce solutions designed to meet the rigorous demands of modern industrial operations.</p>
    </div>

    {/* Warehouse Section */}
    <section className="grid md:grid-cols-2 gap-20 items-center">
      <div className="space-y-8 order-2 md:order-1">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-lg text-sm font-bold">
          <Truck size={16} /> <span>LOGISTICS & SUPPLY CHAIN</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-brand-dark font-display">Warehouse Staffing</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          From e-commerce fulfillment centers to major distribution hubs, we provide the muscle and the organization your warehouse needs to move inventory efficiently.
        </p>
        <ul className="space-y-4">
          {['Pick/Pack Operations', 'Loading & Unloading', 'Inventory Cycle Counting', 'Forklift & Reach Certified Operators'].map(item => (
            <li key={item} className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-green-500 mr-3 shrink-0" size={20} /> {item}</li>
          ))}
        </ul>
          <button 
            onClick={() => navigate('employers')} 
            className="bg-brand-dark text-white px-10 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-xl shadow-brand-dark/10"
          >
            Request Warehouse Staff
          </button>
      </div>
      <div className="bg-slate-100 aspect-square rounded-[3rem] order-1 md:order-2 overflow-hidden shadow-2xl relative group">
        <img src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Warehouse Staffing" />
        <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors duration-500"></div>
      </div>
    </section>

    {/* Cleaning Section */}
    <section className="grid md:grid-cols-2 gap-20 items-center">
      <div className="bg-slate-100 aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative group">
        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Cleaning Staffing" />
        <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors duration-500"></div>
      </div>
      <div className="space-y-8">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-lg text-sm font-bold">
          <Sparkles size={16} /> <span>COMMERCIAL SANITATION</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-brand-dark font-display">Cleaning Staffing</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Maintain a safe, hygienic, and professional environment with our reliable cleaning specialized workforce. We provide personnel for daily maintenance or deep sanitization.
        </p>
        <ul className="space-y-4">
          {['Large-Scale Commercial Cleaning', 'Office Complex Sanitation', 'Industrial Facility Floor Care', 'Event Support & Post-Cleanup'].map(item => (
            <li key={item} className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-green-500 mr-3 shrink-0" size={20} /> {item}</li>
          ))}
        </ul>
        <button 
          onClick={() => navigate('employers')} 
          className="bg-brand-dark text-white px-10 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-xl shadow-brand-dark/10"
        >
          Request Cleaners
        </button>
      </div>
    </section>

    {/* General Labour */}
    <section className="grid md:grid-cols-2 gap-20 items-center pb-20">
      <div className="space-y-8 order-2 md:order-1">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-lg text-sm font-bold">
          <Building2 size={16} /> <span>INDUSTRIAL SUPPORT</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-brand-dark font-display">General Labour</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Need extra hands for a specific project? Our general labour pool is ready to deploy for various manual tasks, ensuring you never fall behind schedule.
        </p>
        <ul className="space-y-4">
          {['Flexible Daily Workforce', 'Short & Long-term Project Support', 'Assembly Line Specialists', 'Construction Site Manual Help'].map(item => (
            <li key={item} className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-green-500 mr-3 shrink-0" size={20} /> {item}</li>
          ))}
        </ul>
        <button 
          onClick={() => navigate('employers')} 
          className="bg-brand-dark text-white px-10 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-xl shadow-brand-dark/10"
        >
          Request Labourers
        </button>
      </div>
      <div className="bg-slate-100 aspect-square rounded-[3rem] order-1 md:order-2 overflow-hidden shadow-2xl relative group">
        <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="General Labour" />
        <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors duration-500"></div>
      </div>
    </section>
  </div>
);

// --- 3. EMPLOYERS PAGE ---
const EmployersPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    workersNeeded: '',
    sector: 'Warehouse',
    requirements: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'staffing-requests'), {
        ...formData,
        workersNeeded: formData.workersNeeded ? parseInt(formData.workersNeeded) : 0,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', company: '', email: '', workersNeeded: '', sector: 'Warehouse', requirements: '' });
    } catch (error) {
      setStatus('error');
      handleFirestoreError(error, OperationType.WRITE, 'staffing-requests');
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 flex flex-col items-center">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-24">
        <div className="space-y-10">
          <div className="rounded-[2.5rem] overflow-hidden mb-10 aspect-video lg:aspect-auto lg:h-[300px] shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200" 
              alt="Professional Staffing" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-brand-dark font-display leading-tight">Hire Reliable Workers Without the Friction</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Stop sifting through infinite CVs. We maintain a verified database of pre-vetted, high-quality professionals ready to move your business forward.
          </p>
          
          <div className="space-y-12 py-6">
            {[
              { step: 1, title: "Submit Your Request", desc: "Share your headcount needs and timelines via our secure form or a quick direct call." },
              { step: 2, title: "We Screen & Authenticate", desc: "We match candidates against your specific requirements and operational environment." },
              { step: 3, title: "Deployment Unleashed", desc: "Your new personnel arrive at your site, fully prepped and ready for immediate output." }
            ].map((item) => (
              <div key={item.step} className="flex space-x-6 group">
                <div className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-brand-dark font-display mb-2">{item.title}</h4>
                  <p className="text-slate-500 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-3xl border border-slate-100 flex flex-col h-fit sticky top-24">
          <h3 className="text-3xl font-black mb-10 text-brand-dark font-display">Staffing Inquiry</h3>
          
          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 p-8 rounded-2xl text-center space-y-4 border border-green-100">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-2xl font-bold text-green-800">Request Received!</h4>
              <p className="text-green-700">A staffing specialist will contact you within 24 hours.</p>
              <button onClick={() => setStatus('idle')} className="text-green-700 font-bold hover:underline">Send another request</button>
            </motion.div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Company</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Corp Inc." 
                    className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium" 
                    required 
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Business Email</label>
                <input 
                  type="email" 
                  placeholder="john@company.ca" 
                  className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Workers Needed</label>
                  <input 
                    type="number" 
                    placeholder="5" 
                    className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium" 
                    value={formData.workersNeeded}
                    onChange={(e) => setFormData({...formData, workersNeeded: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Sector</label>
                  <div className="relative">
                    <select 
                      className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium appearance-none cursor-pointer"
                      value={formData.sector}
                      onChange={(e) => setFormData({...formData, sector: e.target.value})}
                    >
                      <option>Warehouse</option>
                      <option>Cleaning</option>
                      <option>General Labour</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={20} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Specific Requirements</label>
                <textarea 
                  placeholder="Tell us about the shifts or required certifications..." 
                  rows={4} 
                  className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium resize-none"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-200 mt-4 disabled:bg-slate-400 disabled:shadow-none"
              >
                {status === 'loading' ? 'Sending...' : 'Request Talent'}
              </button>
              {status === 'error' && <p className="text-red-500 text-center text-sm font-bold">Failed to send. Please try again.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 4. JOB SEEKERS PAGE ---
const JobSeekersPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: 'None (Entry Level)',
    availability: 'All-Time / Flexible'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'job-applications'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ fullName: '', email: '', phone: '', experience: 'None (Entry Level)', availability: 'All-Time / Flexible' });
    } catch (error) {
      setStatus('error');
      handleFirestoreError(error, OperationType.WRITE, 'job-applications');
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 flex justify-center">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-20">
        <div className="lg:w-1/2 space-y-12">
          <div className="rounded-[3rem] overflow-hidden aspect-[16/9] shadow-xl border-8 border-slate-50">
            <img 
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800" 
              alt="Career Opportunities" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-brand-dark font-display leading-tight">Empower Your Career in Canada</h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            Join a workforce that values your reliability and time. We connect you with top-tier companies offering competitive pay and stable environments.
          </p>
          <div className="space-y-8">
            {[
              { title: "Ultra-Flexible Shifts", desc: "Choose assignments that fit your lifestyle—morning, afternoon, or overnight blocks." },
              { title: "Rapid Onboarding", desc: "From application to your first day on-site in as little as 48 hours for top candidates." },
              { title: "Career Progression", desc: "Gain experience with Canada's leading logistics and service industry leaders." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="bg-green-100 p-3 rounded-xl h-fit text-green-600 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-brand-dark font-display">{item.title}</h4>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 bg-white rounded-[3rem] p-10 lg:p-14 shadow-3xl border border-slate-100 h-fit">
          <h3 className="text-3xl font-black mb-4 font-display text-brand-dark">Apply to Join</h3>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Mail size={14} /> Send Resume: career@developersingh.com
          </p>
          
          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-50 p-8 rounded-2xl text-center space-y-4 border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto shadow-lg">
                <Sparkles size={32} />
              </div>
              <h4 className="text-2xl font-bold text-blue-800">Application Sent!</h4>
              <p className="text-blue-700">Thank you for applying. Our talent team will review your profile and reach out shortly.</p>
              <button onClick={() => setStatus('idle')} className="text-blue-700 font-bold hover:underline">Submit another application</button>
            </motion.div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Jane Cooper" 
                  className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium" 
                  required 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="jane@mail.com" 
                    className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 647-695-4420" 
                    className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Experience</label>
                  <div className="relative">
                    <select 
                      className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium appearance-none cursor-pointer"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    >
                      <option>None (Entry Level)</option>
                      <option>1-2 Years</option>
                      <option>3+ Years</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={20} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Availability</label>
                  <div className="relative">
                    <select 
                      className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium appearance-none cursor-pointer"
                      value={formData.availability}
                      onChange={(e) => setFormData({...formData, availability: e.target.value})}
                    >
                      <option>All-Time / Flexible</option>
                      <option>Mornings Only</option>
                      <option>Evenings Only</option>
                      <option>Weekends</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={20} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Apply via Resume</label>
                <div className="border-2 border-dashed border-slate-200 p-8 rounded-xl text-center group hover:border-blue-400 transition-colors cursor-pointer bg-slate-50/50">
                  <MapPin className="mx-auto mb-3 text-slate-300 group-hover:text-blue-400 transition-colors" size={24} />
                  <p className="text-slate-400 text-xs font-bold">Drop Resume (PDF/DOCX) or Click</p>
                </div>
              </div>
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all active:scale-95 shadow-xl mt-4 shrink-0 disabled:bg-slate-400"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Application'}
              </button>
              {status === 'error' && <p className="text-red-500 text-center text-sm font-bold">Failed to submit. Please try again.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 5. WHY CHOOSE US PAGE ---
const WhyChooseUsPage: React.FC<PageProps> = ({ navigate }) => (
  <div className="container mx-auto px-6 py-20 space-y-32">
    <div className="relative rounded-[3rem] overflow-hidden h-[400px] mb-12 shadow-2xl">
      <img 
        src="https://images.unsplash.com/photo-1600880212340-02d956ea202c?auto=format&fit=crop&q=80&w=1200" 
        alt="Partnering for success" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-brand-dark/40 flex items-center justify-center">
        <div className="text-center space-y-8 px-6 drop-shadow-2xl">
          <h1 className="text-5xl lg:text-7xl font-black text-white font-display">Why Choose Developer Singh?</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">We aren't just an agency; we are a precision-engineered workforce engine built for the Canadian landscape.</p>
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { icon: <Zap size={32} />, title: "Instant Deployment", text: "Workers deployed within 24–48 hours of your request." },
        { icon: <ShieldCheck size={32} />, title: "Deep Vetting", text: "Multi-point background checks for ultimate reliability." },
        { icon: <Sparkles size={32} />, title: "Elastic Scaling", text: "Scale your talent pool up or down as project demands shift." },
        { icon: <UserCheck size={32} />, title: "White-Glove Support", text: "Dedicated account managers for large-scale enterprise contracts." }
      ].map((item, idx) => (
        <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-3xl transition-all duration-500 hover:-translate-y-3">
          <div className="text-blue-600 mb-8">{item.icon}</div>
          <h4 className="text-2xl font-bold text-brand-dark mb-4 font-display">{item.title}</h4>
          <p className="text-slate-500 leading-relaxed font-medium">{item.text}</p>
        </div>
      ))}
    </div>

    {/* COMPARISON TABLE */}
    <div className="max-w-5xl mx-auto bg-brand-dark rounded-[3.5rem] p-12 lg:p-20 shadow-3xl text-white">
      <div className="text-center mb-16 space-y-4">
        <h3 className="text-3xl font-black font-display text-blue-400 uppercase tracking-widest">The Staffing Gap</h3>
        <p className="text-slate-400 text-lg">Compare our operational excellence against standard market offerings.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-8 text-xl font-display uppercase tracking-widest">Metrics</th>
              <th className="pb-8 text-center text-xl text-slate-500 font-display">Traditional Agencies</th>
              <th className="pb-8 text-center text-xl text-blue-400 font-display">Developer Singh Corp.</th>
            </tr>
          </thead>
          <tbody className="text-lg">
            {[
              ["Turnaround Time", "7-14 Business Days", "24-48 Working Hours"],
              ["Candidate Screening", "Basic Interview Only", "Social/Criminal/Auth Backgrounds"],
              ["Service Footprint", "Local / Regional Only", "Nationwide Across Canada"],
              ["Workforce Flex", "Rigid Monthly Contracts", "On-Demand Resource Scaling"]
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-white/5 group">
                <td className="py-8 font-bold group-hover:text-blue-400 transition-colors uppercase text-sm tracking-widest">{row[0]}</td>
                <td className="py-8 text-center text-slate-500 italic">{row[1]}</td>
                <td className="py-8 text-center font-black text-blue-400 group-hover:scale-105 transition-transform">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="text-center">
      <button 
        onClick={() => navigate('employers')} 
        className="bg-blue-600 text-white px-14 py-6 rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-300"
      >
        Start Staffing Today
      </button>
    </div>
  </div>
);

// --- 6. ABOUT US PAGE ---
const AboutUsPage: React.FC = () => (
  <div className="container mx-auto px-6 py-24">
    <div className="max-w-5xl mx-auto space-y-24">
      <div className="text-center space-y-10">
        <h1 className="text-5xl lg:text-8xl font-black text-brand-dark font-display leading-tight italic decoration-blue-600 decoration-[10px] underline underline-offset-[20px]">Our Mission</h1>
        <div className="max-w-3xl mx-auto pt-10">
          <p className="text-2xl lg:text-4xl text-slate-700 leading-snug font-medium">
            "Developer Singh Corporation exists to build the most dependable industrial workforce infrastructure in Canada—bridging the gap between ambitious businesses and reliable talent with zero friction."
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-16 pt-10">
        {[
          { label: "VELOCITY", val: "48H", desc: "Maximum deployment window for qualified workers across provinces." },
          { label: "INTEGRITY", val: "100%", desc: "Of our workforce is background verified and identity authenticated." },
          { label: "ACCESSIBILITY", val: "24/7", desc: "Support for critical logistics facilities operating round the clock." }
        ].map((item, i) => (
          <div key={i} className="space-y-4 text-center md:text-left">
            <h3 className="text-5xl font-black text-blue-600 font-display leading-none">{item.val}</h3>
            <h4 className="text-xl font-bold text-brand-dark uppercase tracking-widest">{item.label}</h4>
            <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-[3rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-4xl font-black text-brand-dark font-display">A National Legacy</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Founded with a vision to revolutionize the temporary staffing landscape, Developer Singh Corp. has grown from a local service provider to a nationwide partner for Canada's largest logistics and manufacturing firms.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            We believe that every successful operation is built on the backs of reliable people. Our job is to find them, verify them, and get them to you when you need them most.
          </p>
        </div>
        <div className="lg:w-1/2 rounded-full overflow-hidden aspect-square border-[12px] border-white shadow-2xl">
          <img src="https://images.unsplash.com/photo-1556740734-7193f4e2423c?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Corporate & Service Excellence" />
        </div>
      </div>
    </div>
  </div>
);

// --- 7. CONTACT PAGE ---
const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'contact-inquiries'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ fullName: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      handleFirestoreError(error, OperationType.WRITE, 'contact-inquiries');
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-24 items-start">
        <div className="space-y-12">
          <div className="rounded-[3rem] overflow-hidden aspect-video shadow-2xl mb-12">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
              alt="Modern Corporate HQ" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-black text-brand-dark font-display leading-[1.1]">Let's Build Your <span className="text-blue-600">Workforce</span></h1>
            <p className="text-xl text-slate-500 leading-relaxed">Serving diverse businesses across every Canadian time zone. Get in touch for immediate consultation on your staffing requirements.</p>
          </div>
          
          <div className="grid gap-10">
            {[
              { icon: <Mail />, label: "Corporate Email", val: "contact@developersingh.ca" },
              { icon: <Briefcase />, label: "Career & Jobs", val: "career@developersingh.com" },
              { icon: <Phone />, label: "Toll-Free Staffing Line", val: "647-695-4420" },
              { icon: <MapPin />, label: "National HQ", val: "Ontario, Quebec" }
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-6 group">
                <div className="p-5 bg-blue-50 text-blue-600 rounded-3xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 28 })}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{item.label}</p>
                  <p className="text-2xl font-black text-brand-dark font-display">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-brand-light rounded-[2rem] border border-slate-100 flex items-center space-x-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg animate-bounce">
              <Zap size={32} />
            </div>
            <div>
              <h5 className="font-bold text-brand-dark text-lg">Urgent Request?</h5>
              <p className="text-slate-500">Call our 24/7 priority deployment hotline for action within 12 hours.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 lg:p-14 rounded-[3.5rem] shadow-3xl border border-slate-50 flex flex-col h-full ring-1 ring-slate-100 sticky top-24">
          <h3 className="text-3xl font-black mb-10 text-brand-dark font-display">Send a Message</h3>
          
          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-50 p-8 rounded-2xl text-center space-y-4 border border-slate-200">
              <div className="w-16 h-16 bg-brand-dark rounded-full flex items-center justify-center text-white mx-auto shadow-lg">
                <Mail size={32} />
              </div>
              <h4 className="text-2xl font-bold text-brand-dark">Message Sent!</h4>
              <p className="text-slate-600">We've received your inquiry and will respond as soon as possible.</p>
              <button onClick={() => setStatus('idle')} className="text-brand-dark font-bold hover:underline">Send another message</button>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Full Name</label>
                <input 
                  type="text" 
                  placeholder="Johnathan Doe" 
                  className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium" 
                  required 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Connection</label>
                <input 
                  type="email" 
                  placeholder="john@company.com" 
                  className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="Staffing Request / Partnership" 
                  className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium" 
                  required 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Message Body</label>
                <textarea 
                  placeholder="How can our workforce improve your bottom line?" 
                  rows={5} 
                  className="w-full p-4 bg-brand-light rounded-xl outline-none focus:ring-2 ring-blue-500/20 border-2 border-transparent focus:border-blue-500/50 transition-all font-medium resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-brand-dark text-white py-5 rounded-xl font-bold text-xl hover:bg-black transition-all active:scale-95 shadow-2xl shadow-brand-dark/20 mt-4 flex items-center justify-center disabled:bg-slate-400"
              >
                {status === 'loading' ? 'Sending...' : <>Send Inquiry <ChevronRight className="ml-2" /></>}
              </button>
              {status === 'error' && <p className="text-red-500 text-center text-sm font-bold">Failed to send message. Please try again.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
