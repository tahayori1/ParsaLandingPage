
import React, { useState, useMemo, useEffect } from 'react';
import { Course, Language } from '../types';
import ClassCard from './CarCard';
import LanguageCard from './CarModelCard';
import { updateSEOMetadataForLanguage, resetSEOMetadata } from '../utils/helpers';

interface CourseCatalogProps {
    languages: Language[];
    allCourses: Course[];
    selectedLanguage: string | null;
    onSelectLanguage: (langName: string) => void;
    onGoBack: () => void;
    onSelectCourse: (course: Course) => void;
    onRequestConsultation: (course: Course) => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ 
    languages, 
    allCourses, 
    selectedLanguage,
    onSelectLanguage,
    onGoBack,
    onSelectCourse, 
    onRequestConsultation 
}) => {
    const [filters, setFilters] = useState({ type: 'all', format: 'all' });

    // SEO & Metadata Update
    useEffect(() => {
        if (selectedLanguage) {
            const selectedLangData = languages.find(l => l.name === selectedLanguage);
            if (selectedLangData) {
                updateSEOMetadataForLanguage(selectedLangData);
            }
        } else {
            resetSEOMetadata();
        }
    }, [selectedLanguage, languages]);
    
    // Reset filters when language changes
    useEffect(() => {
        setFilters({ type: 'all', format: 'all' });
    }, [selectedLanguage]);

    const filteredCourses = useMemo(() => {
        if (!selectedLanguage) return [];
        
        return allCourses.filter(course => {
            const matchLanguage = course.language === selectedLanguage;
            const matchType = filters.type === 'all' || course.type === filters.type;
            const matchFormat = filters.format === 'all' || course.format === filters.format;
            
            return matchLanguage && matchType && matchFormat;
        });
    }, [selectedLanguage, allCourses, filters]);
    
    const handleFilterChange = (type: 'type' | 'format', value: string) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    // Render Language Selection View
    if (!selectedLanguage) {
        return (
            <section id="courses" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-parsa-brown-800">زبان مورد نظر خود را انتخاب کنید</h2>
                        <p className="text-base md:text-lg text-parsa-gray-600 max-w-2xl mx-auto">جدیدترین دوره‌های آموزشی زبان با بهترین متدولوژی آموزشی.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {languages.map(lang => (
                            <LanguageCard key={lang.id || lang.name} language={lang} onSelectLanguage={onSelectLanguage} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Render Course List View
    return (
        <section id="courses" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 text-parsa-brown-800">دوره های زبان {selectedLanguage}</h2>
                    <p className="text-base md:text-lg text-parsa-gray-600 max-w-2xl mx-auto">از میان کلاس‌های متنوع، بهترین گزینه را برای یادگیری انتخاب کنید.</p>
                </div>
                
                {/* Filters */}
                <div className="mb-8 p-4 bg-parsa-gray-50 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-parsa-gray-700">نوع کلاس:</span>
                        <div className="flex gap-2">
                             {['all', 'گروهی', 'خصوصی'].map(type => (
                                 <button 
                                    key={type}
                                    onClick={() => handleFilterChange('type', type)} 
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                        filters.type === type ? 'bg-parsa-orange-500 text-white' : 'bg-white text-parsa-gray-600 hover:bg-gray-100'
                                    }`}
                                 >
                                    {type === 'all' ? 'همه' : type}
                                 </button>
                             ))}
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-parsa-gray-700">فرمت کلاس:</span>
                        <div className="flex gap-2">
                            {['all', 'حضوری', 'آنلاین'].map(format => (
                                 <button 
                                    key={format}
                                    onClick={() => handleFilterChange('format', format)} 
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                        filters.format === format ? 'bg-parsa-orange-500 text-white' : 'bg-white text-parsa-gray-600 hover:bg-gray-100'
                                    }`}
                                 >
                                    {format === 'all' ? 'همه' : format}
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="text-center mb-8">
                     <button onClick={onGoBack} className="text-parsa-orange-600 hover:text-parsa-orange-800 hover:underline inline-flex items-center gap-2 transition-colors font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        بازگشت به لیست زبان‌ها
                    </button>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <ClassCard 
                                key={course.id} 
                                course={course} 
                                onSelectCourse={onSelectCourse} 
                                onRequestConsultation={onRequestConsultation} 
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-lg text-parsa-gray-500">متاسفانه با فیلترهای انتخابی، کلاسی یافت نشد.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default React.memo(CourseCatalog);
