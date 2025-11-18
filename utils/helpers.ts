import type { Course, Language } from '../types';

export const formatPhoneNumber = (number: string): string => {
    if(!number) return '';
    const persianNumbers = '۰۱۲۳۴۵۶۷۸۹';
    return number.replace(/\d/g, d => persianNumbers[d]).replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
};

export const formatPrice = (price: number | string): string => {
    if (typeof price === 'string') {
        return price;
    }
    if (typeof price === 'number') {
        return `${price.toLocaleString('fa-IR')} تومان`;
    }
    return String(price);
};

const BASE_URL = window.location.origin + window.location.pathname.replace(/\/$/, '');
const SCHEMA_SCRIPT_ID = 'app-structured-data';

const removeStructuredData = () => {
    const script = document.getElementById(SCHEMA_SCRIPT_ID);
    if (script) {
        script.remove();
    }
};

const injectStructuredData = (schema: object) => {
    removeStructuredData();
    const script = document.createElement('script');
    script.id = SCHEMA_SCRIPT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
};

// For a specific course (modal view)
export const updateSEOMetadataForCourse = (course: Course) => {
    const title = `دوره ${course.language} ${course.level} - ${course.type} و ${course.format} | موسسه زبان پارسا`;
    document.title = title;
    
    const description = `ثبت نام در دوره ${course.language} سطح ${course.level}. کلاس ${course.type} به صورت ${course.format} با شهریه ${formatPrice(course.price)}. ${course.description}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);

    const canonicalUrl = BASE_URL + '#/course/' + course.slug;
    document.querySelector('#canonicalLink')?.setAttribute('href', canonicalUrl);
    
    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": `${course.language} - ${course.level}`,
        "description": course.description,
        "provider": {
            "@type": "Organization",
            "name": "موسسه زبان پارسا",
            "url": BASE_URL
        },
        "offers": {
            "@type": "Offer",
            "price": course.price,
            "priceCurrency": "IRR"
        }
    };
    injectStructuredData(courseSchema);
};

// For a language page (list of courses)
export const updateSEOMetadataForLanguage = (language: Language) => {
    const title = `دوره های آموزش زبان ${language.name} در شیراز | موسسه زبان پارسا`;
    document.title = title;
    
    const description = `مشاهده تمام دوره های زبان ${language.name} در موسسه پارسا. کلاس های حضوری، آنلاین، گروهی و خصوصی برای تمام سطوح از مبتدی تا پیشرفته.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);

    const canonicalUrl = BASE_URL + `#/language/${encodeURIComponent(language.name.replace(/\s/g, '-'))}`;
    document.querySelector('#canonicalLink')?.setAttribute('href', canonicalUrl);
};

// For the main homepage
export const resetSEOMetadata = () => {
    const defaultTitle = 'موسسه زبان پارسا - بهترین آموزشگاه زبان در شیراز';
    document.title = defaultTitle;
    
    const defaultDescription = 'موسسه زبان پارسا در شیراز با دوره های متنوع انگلیسی، آلمانی، فرانسه و ... برای تمام سنین. کلاس های حضوری، آنلاین، گروهی و خصوصی. همین حالا برای تعیین سطح و مشاوره رایگان اقدام کنید.';
    document.querySelector('meta[name="description"]')?.setAttribute('content', defaultDescription);

    document.querySelector('#canonicalLink')?.setAttribute('href', BASE_URL);
    
    const educationalOrgSchema = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "موسسه زبان پارسا",
        "url": BASE_URL,
        "logo": "/icons/logo.png",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "بلوار شهید بهشتی، حدفاصل چهارراه بنفشه به سمت چهارراه خلدبرین",
            "addressLocality": "شیراز",
            "addressRegion": "فارس",
            "addressCountry": "IR"
        },
        "telephone": "+989173162644",
        "email": "info@parsalanguage.com"
    };
    injectStructuredData(educationalOrgSchema);
};