
import React from 'react';

const benefits = [
    { 
        icon: <svg className="w-6 md:w-8 h-6 md:h-8 text-parsa-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>, 
        title: "اساتید مجرب و Native", 
        description: "بهره‌گیری از بهترین اساتید با تجربه بین‌المللی",
        color: "blue"
    },
    { 
        icon: <svg className="w-6 md:w-8 h-6 md:h-8 text-parsa-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>, 
        title: "مدرک معتبر", 
        description: "ارائه مدرک رسمی و معتبر پایان دوره",
        color: "teal"
    },
    { 
        icon: <svg className="w-6 md:w-8 h-6 md:h-8 text-parsa-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M12 14.75L2 9l10-5 10 5-10 5.75z"></path></svg>, 
        title: "متدولوژی مدرن", 
        description: "جدیدترین روش‌های آموزشی برای یادگیری سریع و عمیق",
        color: "blue"
    },
    { 
        icon: <svg className="w-6 md:w-8 h-6 md:h-8 text-parsa-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9"></path></svg>, 
        title: "کلاس‌های آنلاین", 
        description: "امکان شرکت در کلاس‌ها از سراسر ایران و جهان",
        color: "teal"
    },
    { 
        icon: <svg className="w-6 md:w-8 h-6 md:h-8 text-parsa-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>, 
        title: "منابع آموزشی", 
        description: "دسترسی به کتابخانه و منابع دیجیتال کامل",
        color: "blue"
    },
    { 
        icon: <svg className="w-6 md:w-8 h-6 md:h-8 text-parsa-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>, 
        title: "مشاوره و پشتیبانی", 
        description: "پشتیبانی کامل آموزشی و مشاوره رایگان",
        color: "teal"
    }
];

const Benefit: React.FC<typeof benefits[0]> = ({ icon, title, description, color }) => {
     const colorClasses = {
        teal: 'bg-parsa-teal-100',
        blue: 'bg-parsa-blue-100',
    };
    return (
        <div className="text-center">
            <div className={`w-12 md:w-16 h-12 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
                {icon}
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-parsa-gray-800">{title}</h3>
            <p className="text-sm md:text-base text-parsa-gray-600">{description}</p>
        </div>
    )
};

const MemoizedBenefit = React.memo(Benefit);

const Benefits: React.FC = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 text-parsa-gray-800">چرا موسسه زبان پارسا؟</h2>
                    <p className="text-base md:text-lg text-parsa-gray-600">مزایای تحصیل در بهترین آموزشگاه زبان شیراز</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {benefits.map((b, i) => <MemoizedBenefit key={i} {...b} />)}
                </div>
            </div>
        </section>
    );
};

export default React.memo(Benefits);
