
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
            // Common styles for both mobile and desktop wrappers
            className="group bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl animate-fade-in cursor-pointer overflow-hidden"
        >
            {/* Mobile List Item View (default, hidden on sm and larger) */}
            <div className="flex sm:hidden items-center p-3 gap-3 relative flex-row-reverse"> {/* flex-row-reverse for RTL layout */}
                <img
                    src={language.image}
                    alt={`آموزش زبان ${language.name}`}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    loading="lazy"
                />
                <div className="flex-grow pr-3"> {/* Added padding to separate from image */}
                    <h3 className="text-lg font-bold text-parsa-brown-800">{language.name}</h3>
                    <p className="text-sm text-parsa-gray-600">{language.description}</p>
                </div>
                {language.courseCount && language.courseCount > 0 && (
                    <div className="absolute top-2 left-2 bg-parsa-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                        {language.courseCount} دوره فعال
                    </div>
                )}
                {/* Navigation arrow for mobile list items */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-parsa-gray-400 rtl:-scale-x-100 flex-shrink-0 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </div>

            {/* Desktop Card View (hidden on mobile, visible on sm and larger) */}
            <div className="hidden sm:block relative h-full">
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
        </div>
    );
};

export default LanguageCard;