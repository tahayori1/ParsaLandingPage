
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Course, Language } from '../types';
import ClassCard from './CarCard'; // Re-using file, component renamed inside
import LanguageCard from './CarModelCard'; // Re-using file, component renamed inside
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
    
    useEffect(() => {
        // Reset filters when language changes
        setFilters({ type: 'all', format: 'all' });
    }, [selectedLanguage]);

    const filteredCourses = useMemo(() => {
        if (!selectedLanguage) return [];
        return allCourses
            .filter(c => c.language === selectedLanguage)
            .filter(c => filters.type === 'all' || c.type === filters.type)
            .filter(c => filters.format === 'all' || c.format === filters.format);
    }, [selectedLanguage, allCourses, filters]);
    
    const handleFilterChange = (type: 'type' | 'format', value: string) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

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
                            <LanguageCard key={lang.name} language={lang} onSelectLanguage={onSelectLanguage} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="courses" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 text-parsa-brown-800">دوره های زبان {selectedLanguage}</h2>
                    <p className="text-base md:text-lg text-parsa-gray-600 max-w-2xl mx-auto">از میان کلاس‌های متنوع، بهترین گزینه را برای یادگیری انتخاب کنید.</p>
                </div>
                
                <div className="mb-8 p-4 bg-parsa-gray-50 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-parsa-gray-700">نوع کلاس:</span>
                        <div className="flex gap-2">
                             <button onClick={() => handleFilterChange('type', 'all')} className={`px-3 py-1 text-sm rounded-full ${filters.type === 'all' ? 'bg-parsa-orange-500 text-white' : 'bg-white text-parsa-gray-600'}`}>همه</button>
                             <button onClick={() => handleFilterChange('type', 'گروهی')} className={`px-3 py-1 text-sm rounded-full ${filters.type === 'گروهی' ? 'bg-parsa-orange-500 text-white' : 'bg-white text-parsa-gray-600'}`}>گروهی</button>
                             <button onClick={() => handleFilterChange('type', 'خصوصی')} className={`px-3 py-1 text-sm rounded-full ${filters.type === 'خصوصی' ? 'bg-parsa-orange-500 text-white' : 'bg-white text-parsa-gray-600'}`}>خصوصی</button>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-parsa-gray-700">فرمت کلاس:</span>
                        <div className="flex gap-2">
                             <button onClick={() => handleFilterChange('format', 'all')} className={`px-3 py-1 text-sm rounded-full ${filters.format === 'all' ? 'bg-parsa-orange-500 text-white' : 'bg-white text-parsa-gray-600'}`}>همه</button>
                             <button onClick={() => handleFilterChange('format', 'حضوری')} className={`px-3 py-1 text-sm rounded-full ${filters.format === 'حضوری' ? 'bg-parsa-orange-500 text-white' : 'bg-white text-parsa-gray-600'}`}>حضوری</button>
                             <button onClick={() => handleFilterChange('format', 'آنلاین')} className={`px-3 py-1 text-sm rounded-full ${filters.format === 'آنلاین' ? 'bg-parsa-orange-500 text-white' : 'bg-white text-parsa-gray-600'}`}>آنلاین</button>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-8">
                     <button onClick={onGoBack} className="text-parsa-orange-600 hover:text-parsa-orange-800 hover:underline inline-flex items-center gap-2 transition-colors font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        بازگشت به لیست زبان‌ها
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <ClassCard key={course.id} course={course} onSelectCourse={onSelectCourse} onRequestConsultation={onRequestConsultation} />
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
