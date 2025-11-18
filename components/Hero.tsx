
import React from 'react';

const Hero: React.FC = () => {
    const handleScrollToCourses = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const coursesElement = document.getElementById('courses');
        if (coursesElement) {
            coursesElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section 
            className="bg-cover bg-center text-white py-20 md:py-32 relative"
            style={{ backgroundImage: "url('/icons/hero-bg.jpg')" }}
            aria-label="Students learning in a modern classroom"
        >
            <div className="absolute inset-0 bg-parsa-blue-900 opacity-70" aria-hidden="true"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center animate-fade-in">
                    <h2 className="text-2xl md:text-5xl font-extrabold mb-6 leading-tight">
                        آینده خود را با یادگیری یک
                        <span className="text-parsa-teal-300"> زبان جدید</span>
                         بسازید
                    </h2>
                    <p className="text-base md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                        کلاس‌های حضوری و آنلاین • اساتید مجرب • مدرک معتبر
                    </p>
                    <div className="flex justify-center">
                        <a href="#courses" onClick={handleScrollToCourses} className="bg-gradient-to-r from-parsa-teal-500 to-parsa-teal-600 hover:from-parsa-teal-600 hover:to-parsa-teal-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg inline-flex items-center justify-center gap-3 hover:shadow-xl transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                            مشاهده لیست دوره‌ها
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(Hero);
