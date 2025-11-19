
import React, { useState } from 'react';

const faqs = [
    {
        question: "چرا موسسه زبان پارسا بهترین آموزشگاه زبان در شیراز است؟",
        answer: "موسسه زبان پارسا با بیش از دو دهه تجربه، استفاده از اساتید Native و مجرب، ارائه مدارک معتبر و برگزاری کلاس‌های متنوع (حضوری و آنلاین) در بلوار شهید بهشتی شیراز، بالاترین آمار قبولی در آزمون‌های بین‌المللی را دارد."
    },
    {
        question: "آیا کلاس‌های زبان آلمانی و فرانسه هم برگزار می‌شود؟",
        answer: "بله، علاوه بر انگلیسی، دپارتمان‌های تخصصی زبان آلمانی (ویژه مهاجرت)، فرانسه، ترکی استانبولی، ایتالیایی و اسپانیایی در موسسه پارسا فعال هستند."
    },
    {
        question: "شرایط کلاس‌های آنلاین چگونه است؟",
        answer: "کلاس‌های آنلاین ما بر روی پلتفرم‌های اختصاصی با کیفیت بالا برگزار می‌شود و برای زبان‌آموزانی که در شیراز نیستند یا امکان شرکت حضوری ندارند، گزینه‌ای ایده‌آل است."
    },
    {
        question: "چطور می‌توانم تعیین سطح شوم؟",
        answer: "تعیین سطح در موسسه پارسا کاملاً رایگان است. شما می‌توانید به صورت حضوری مراجعه کنید یا از طریق دکمه درخواست مشاوره در همین سایت، اطلاعات خود را ثبت کنید تا کارشناسان ما با شما تماس بگیرند."
    },
    {
        question: "آیا برای آزمون آیلتس (IELTS) دوره دارید؟",
        answer: "بله، دوره‌های تخصصی Pre-IELTS و IELTS با تمرکز بر چهار مهارت اصلی و برگزاری آزمون‌های Mock (آزمایشی) به صورت فشرده و عادی برگزار می‌شود."
    }
];

const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-parsa-gray-200 last:border-0">
            <button 
                className="w-full py-4 text-right flex items-center justify-between focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-semibold text-parsa-brown-800">{question}</h3>
                <span className={`text-parsa-orange-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-parsa-gray-600 leading-relaxed">{answer}</p>
            </div>
        </div>
    );
};

const FAQ: React.FC = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 text-parsa-brown-800">سوالات متداول</h2>
                    <p className="text-base md:text-lg text-parsa-gray-600">پاسخ به پرسش‌های پرتکرار شما درباره کلاس‌ها</p>
                </div>
                <div className="max-w-3xl mx-auto bg-parsa-gray-50 rounded-2xl p-6 md:p-8 shadow-sm">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default React.memo(FAQ);
