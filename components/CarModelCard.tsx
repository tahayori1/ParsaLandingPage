
import React from 'react';
import { Language } from '../types';

interface LanguageCardProps {
    language: Language;
    onSelectLanguage: (name: string) => void;
}

const LanguageCard: React.FC<LanguageCardProps> = ({ language, onSelectLanguage }) => {
    return (
        <div 
            onClick={() => onSelectLanguage(language.name)}
            className="group bg-white rounded-xl shadow-lg relative transition-all duration-300 ease-in-out hover:shadow-2xl animate-fade-in cursor-pointer overflow-hidden"
        >
            <img 
                src={language.image} 
                alt={`آموزش زبان ${language.name}`}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold">{language.name}</h3>
                <p className="text-sm opacity-90">{language.description}</p>
            </div>
            {language.courseCount && language.courseCount > 0 && (
                <div className="absolute top-2 right-2 bg-parsa-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                    {language.courseCount} دوره فعال
                </div>
            )}
        </div>
    );
};

export default LanguageCard;