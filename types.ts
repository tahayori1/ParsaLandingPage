
export interface Language {
    id?: number;
    name: string;
    description: string;
    image: string;
    courseCount?: number;
}

export interface Course {
    id?: number;
    language: string; // e.g., 'انگلیسی'
    level: string; // e.g., 'مقدماتی A1'
    type: 'گروهی' | 'خصوصی';
    format: 'حضوری' | 'آنلاین';
    schedule: string; // e.g., 'شنبه و دوشنبه ۱۸:۰۰ - ۱۹:۳۰'
    price: number;
    status: 'در حال ثبت نام' | 'تکمیل ظرفیت' | 'شروع به زودی';
    description: string;
    slug: string;
    tags: string[]; // e.g., ['مکالمه', 'کودکان']
}

export interface UserInfo {
    name: string;
    phone: string;
    city: string; // We can keep this for demographic data
    courseOfInterest?: string; // Replaces carOfInterest
}

export interface RegisteredUser {
    id: number;
    name: string;
    phone: string;
    city: string;
    courseOfInterest: string;
    level: string;
    type: string;
    format: string;
    schedule: string;
    price: number;
    description: string;
    created_at: string; // ISO 8601 string
}

export interface ClubMember {
    id?: number;
    name: string;
    phone_number: string;
    status: '🟢فعال' | '🔴غیرفعال';
    magic_number?: number;
    discount_code?: string | null;
    datetime?: string | null;
    created_at?: string;
}
