
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Download, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import { cn } from '../lib/utils';

const LanguageSwitcher = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLanguageChange = (newLanguage: 'en' | 'es') => {
    navigate(`/${newLanguage}`, { replace: true });
  };

  return (
    <div className="fixed top-4 w-full flex justify-between px-4 z-50">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          className="text-sm font-bold text-black"
          onClick={() => window.open('https://maps.me/', '_blank', 'noopener,noreferrer')}
        >
          <Download size={16} />
          <Map size={16} />
          {isMobile ? '' : t('mapApp')}
        </Button>
        
        <a 
          href="https://www.linkedin.com/in/alan-chismechian/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-2 font-bold transition-all hover:scale-105",
            "bg-white/90 px-3 py-1.5 rounded-md shadow-sm border border-purple-600/20",
            "hover:bg-white hover:shadow-md"
          )}
        >
          <span className="hidden sm:inline text-lg font-roobert">Design by Alan</span>
          <div className="flex items-center justify-center w-7 h-7">
            <svg 
              viewBox="0 0 24 24" 
              className="w-full h-full text-[#0A66C2]" 
              fill="currentColor"
            >
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
          </div>
        </a>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant={language === 'es' ? 'default' : 'outline'}
          onClick={() => handleLanguageChange('es')}
          className="text-sm"
        >
          ES
        </Button>
        <Button
          variant={language === 'en' ? 'default' : 'outline'}
          onClick={() => handleLanguageChange('en')}
          className="text-sm"
        >
          EN
        </Button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
