import React from 'react';
import './styles/index.css';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import HowItWorksSection from './components/HowItWorksSection';
import IntegrationSection from './components/IntegrationSection';
import UseCasesSection from './components/UseCasesSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 antialiased selection:bg-blue-200 selection:text-blue-900">
      {/* Video Background */}
      <div className="video-background-container top-0 w-full -z-10 absolute h-screen">
        <video 
          src="https://cdn.midjourney.com/video/af6b100b-cd15-4257-b845-8a5388a23f1b/3.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        />
      </div>
      
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <IntegrationSection />
      <UseCasesSection />
      <Footer />
    </div>
  );
};

export default App;
