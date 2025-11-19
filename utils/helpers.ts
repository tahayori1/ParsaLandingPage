
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

const injectStructuredData = (schema: object | object[]) => {
    removeStructuredData();
    const script = document.createElement('script');
    script.id = SCHEMA_SCRIPT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
};

// For a specific course (modal view)
export const updateSEOMetadataForCourse = (course: Course) => {
    const title = `دوره ${course.language} ${course.level} در شیراز | ${course.type} ${course.format}`;
    document.title = title;
    
    const description = `ثبت نام در بهترین دوره ${course.language} شیراز سطح ${course.level}. کلاس ${course.type} به صورت ${course.format} با شهریه ${formatPrice(course.price)}. همین حالا در موسسه پارسا تعیین سطح دهید.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);

    const canonicalUrl = BASE_URL + '#/course/' + course.slug;
    document.querySelector('#canonicalLink')?.setAttribute('href', canonicalUrl);
    
    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": `${course.language} - ${course.level}`,
        "description": course.description,
        "provider": {
            "@type": "LanguageSchool",
            "name": "موسسه زبان پارسا",
            "url": BASE_URL,
            "image": "https://parsa-li.com/wp-content/uploads/sites/158/2024/04/logo.png"
        },
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "price": course.price,
            "priceCurrency": "IRR",
            "availability": course.status === 'تکمیل ظرفیت' ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            "url": canonicalUrl
        },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": course.format === 'آنلاین' ? "online" : "onsite",
            "courseWorkload": course.schedule
        }
    };
    
    // Add Breadcrumb schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "خانه",
            "item": BASE_URL
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": "دوره ها",
            "item": BASE_URL + "#/courses"
        }, {
            "@type": "ListItem",
            "position": 3,
            "name": `${course.language} ${course.level}`
        }]
    };

    injectStructuredData([courseSchema, breadcrumbSchema]);
};

// For a language page (list of courses)
export const updateSEOMetadataForLanguage = (language: Language) => {
    const title = `آموزش زبان ${language.name} در شیراز | کلاس‌های ${language.name} موسسه پارسا`;
    document.title = title;
    
    const description = `لیست کامل دوره‌های آموزش زبان ${language.name} در شیراز. کلاس‌های مکالمه، آیلتس و تافل با اساتید مجرب. برای مشاهده برنامه کلاسی و شهریه‌ها کلیک کنید.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);

    const canonicalUrl = BASE_URL + `#/language/${encodeURIComponent(language.name.replace(/\s/g, '-'))}`;
    document.querySelector('#canonicalLink')?.setAttribute('href', canonicalUrl);

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "خانه",
            "item": BASE_URL
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": `دوره های ${language.name}`
        }]
    };
    injectStructuredData(breadcrumbSchema);
};

// For the main homepage
export const resetSEOMetadata = () => {
    const defaultTitle = 'موسسه زبان پارسا - بهترین آموزشگاه زبان در شیراز | انگلیسی، آلمانی، آیلتس';
    document.title = defaultTitle;
    
    const defaultDescription = 'موسسه زبان پارسا در شیراز با سابقه درخشان در آموزش انگلیسی، آلمانی، فرانسه، ترکی و ... . کلاس‌های حضوری و آنلاین، کودکان و بزرگسالان. تعیین سطح رایگان.';
    document.querySelector('meta[name="description"]')?.setAttribute('content', defaultDescription);

    document.querySelector('#canonicalLink')?.setAttribute('href', BASE_URL);
    
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LanguageSchool",
        "name": "موسسه زبان پارسا",
        "alternateName": "Parsa Language Institute",
        "url": BASE_URL,
        "logo": "https://parsa-li.com/wp-content/uploads/sites/158/2024/04/logo.png",
        "image": "https://parsa-li.com/wp-content/uploads/sites/158/2024/04/logo.png",
        "description": "بهترین موسسه زبان در شیراز ارائه دهنده دوره های آیلتس، تافل، انگلیسی، آلمانی و فرانسه.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "بلوار شهید بهشتی، حدفاصل چهارراه بنفشه به سمت چهارراه خلدبرین",
            "addressLocality": "شیراز",
            "addressRegion": "فارس",
            "postalCode": "71000", 
            "addressCountry": "IR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 29.6275, 
            "longitude": 52.5167 
        },
        "telephone": "+989173162644",
        "email": "info@parsalanguage.com",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
                "opens": "09:00",
                "closes": "20:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Friday",
                "opens": "10:00",
                "closes": "16:00"
            }
        ],
        "priceRange": "$$",
        "sameAs": [
            "https://instagram.com/parsa_institute",
            "https://wa.me/989173162644"
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "بهترین آموزشگاه زبان در شیراز کجاست؟",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "موسسه زبان پارسا با بهره‌گیری از اساتید مجرب و متدهای نوین آموزشی، یکی از بهترین مراکز آموزش زبان در شیراز واقع در بلوار شهید بهشتی است."
                }
            },
            {
                "@type": "Question",
                "name": "آیا کلاس‌های زبان پارسا مدرک معتبر دارند؟",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "بله، پس از پایان هر دوره به زبان‌آموزان مدرک معتبر و رسمی پایان دوره اعطا می‌شود."
                }
            },
            {
                "@type": "Question",
                "name": "آیا کلاس آنلاین زبان هم دارید؟",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "بله، موسسه پارسا کلاس‌های آنلاین را با کیفیت بالا و پلتفرم اختصاصی برای تمام زبان‌ها برگزار می‌کند."
                }
            }
        ]
    };

    injectStructuredData([localBusinessSchema, faqSchema]);
};