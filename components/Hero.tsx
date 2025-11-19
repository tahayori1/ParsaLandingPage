
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
            className="relative py-20 md:py-32 overflow-hidden"
            aria-label="Students learning in a modern classroom"
        >
            {/* SEO FIX: Using an actual img tag instead of background-image allows Google to index the image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://x264.storage.iran.liara.space/parsa/parsa%20hearo%20section.png" 
                    alt="محیط آموزشی موسسه زبان پارسا در شیراز" 
                    className="w-full h-full object-cover object-center"
                    loading="eager" // Important for LCP (Core Web Vitals)
                    width="1920"
                    height="1080"
                />
                <div className="absolute inset-0 bg-parsa-brown-900 opacity-80" aria-hidden="true"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-white">
                <div className="text-center animate-fade-in">
                    <h1 className="text-2xl md:text-5xl font-extrabold mb-6 leading-tight">
                        بهترین آموزشگاه زبان در <span className="text-parsa-orange-300">شیراز</span>
                    </h1>
                    <p className="text-base md:text-xl mb-8 opacity-90 max-w-3xl mx-auto font-light">
                        با موسسه زبان پارسا، آینده خود را بسازید. برگزاری دوره‌های تخصصی انگلیسی، آلمانی، آیلتس و ... به صورت حضوری و آنلاین با مدرک معتبر.
                    </p>
                    <div className="flex justify-center">
                        <a href="#courses" onClick={handleScrollToCourses} className="bg-gradient-to-r from-parsa-orange-500 to-parsa-orange-600 hover:from-parsa-orange-600 hover:to-parsa-orange-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg inline-flex items-center justify-center gap-3 hover:shadow-xl transition-all">
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
