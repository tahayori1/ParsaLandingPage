
import React from 'react';

const testimonials = [
    {
        quote: "کلاس‌های آیلتس موسسه پارسا واقعا فوق‌العاده بود. با کمک اساتید حرفه‌ای تونستم نمره ۷.۵ بگیرم. بهترین تجربه آموزشی من بود.",
        initials: "م.ر",
        name: "مریم رضایی",
        car: "زبان‌آموز دوره IELTS",
        color: "orange"
    },
    {
        quote: "پسرم در دوره کودکان انگلیسی شرکت کرد و الان با اعتماد به نفس انگلیسی صحبت می‌کنه. محیط کلاس‌ها شاد و آموزنده است.",
        initials: "ع.ن",
        name: "علی نظری",
        car: "والدین زبان‌آموز خردسال",
        color: "brown"
    },
    {
        quote: "دوره مکالمه آلمانی رو به صورت آنلاین شرکت کردم. کیفیت کلاس‌ها و پشتیبانی موسسه عالی بود و تونستم خیلی سریع پیشرفت کنم.",
        initials: "س.ح",
        name: "سارا حسینی",
        car: "زبان‌آموز دوره آلمانی",
        color: "gray"
    }
];

const TestimonialCard: React.FC<typeof testimonials[0]> = ({ quote, initials, name, car, color }) => {
    const colorClasses = {
        orange: 'bg-parsa-orange-100 text-parsa-orange-800',
        brown: 'bg-parsa-brown-100 text-parsa-brown-800',
        gray: 'bg-parsa-gray-100 text-parsa-gray-700',
    };
    
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex items-center mb-4 text-yellow-400">
                <span>⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-parsa-gray-700 mb-4 leading-relaxed text-sm md:text-base">"{quote}"</p>
            <div className="flex items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center mr-3 font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>
                    {initials}
                </div>
                <div>
                    <p className="font-semibold text-parsa-gray-800">{name}</p>
                    <p className="text-xs text-parsa-gray-500">{car}</p>
                </div>
            </div>
        </div>
    );
};

const MemoizedTestimonialCard = React.memo(TestimonialCard);

const Testimonials: React.FC = () => {
    return (
        <section className="py-16 bg-parsa-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 text-parsa-brown-800">نظرات زبان‌آموزان ما</h2>
                    <p className="text-base md:text-lg text-parsa-gray-600">تجربه موفق دانشجویان موسسه زبان پارسا</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((t, index) => <MemoizedTestimonialCard key={index} {...t} />)}
                </div>
            </div>
        </section>
    );
};

export default React.memo(Testimonials);