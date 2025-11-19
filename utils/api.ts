
import type { Language, Course, UserInfo, RegisteredUser } from '../types';

const API_BASE_URL = 'https://api.parsa-li.com/webhook/d941ca98-b8fc-4a10-aba8-a6e17706f3ca';

// --- Helper Functions ---

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const getToken = () => sessionStorage.getItem('adminAuthToken');

/**
 * Generic wrapper for fetch requests to handle headers, errors, and JSON parsing.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            // Try to parse error message from JSON, fallback to status text
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (e) {
                // Ignore JSON parse error for error responses
            }
            throw new Error(errorMessage);
        }

        // Return empty object for 204 No Content, otherwise parse JSON
        if (response.status === 204) {
            return {} as T;
        }

        return await response.json();
    } catch (error) {
        console.error(`API Request Failed: ${endpoint}`, error);
        throw error;
    }
}

// --- Admin Authentication ---

export async function loginAdmin(username: string, password: string): Promise<{ token: string }> {
    const hashedPassword = await hashPassword(password);
    
    // Login endpoint usually doesn't need the Bearer token header, but needs Content-Type
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: hashedPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'ورود ناموفق بود. لطفا نام کاربری و رمز عبور را بررسی کنید.');
    }
    
    // Handle array response: [{ "token": "12345" }]
    if (Array.isArray(data) && data.length > 0 && data[0]?.token) {
        return { token: data[0].token };
    }
    
    // Handle object response: { "token": "12345" }
    if (data && data.token) {
        return { token: data.token };
    }
    
    throw new Error('پاسخ سرور معتبر نیست (توکن دریافت نشد).');
}

// --- Data Fetching Functions ---

export async function fetchAllCourses(): Promise<Course[]> {
    const coursesData = await request<Course[]>('/courses');
    return coursesData.map(course => ({
        ...course,
        slug: `${course.language}-${course.level}-${course.id}`.replace(/\s+/g, '-')
    }));
}

export async function fetchAllLanguages(): Promise<Language[]> {
    return request<Language[]>('/languages');
}

// --- Course Management API ---

export async function addCourse(course: Omit<Course, 'id' | 'slug'>): Promise<Course> {
    return request<Course>('/courses', {
        method: 'POST',
        body: JSON.stringify(course),
    });
}

export async function updateCourse(course: Course): Promise<Course> {
    return request<Course>(`/courses?id=${course.id}`, {
        method: 'PUT',
        body: JSON.stringify(course),
    });
}

export async function deleteCourse(courseId: number): Promise<void> {
    return request<void>(`/courses?id=${courseId}`, {
        method: 'DELETE',
    });
}

// --- Language Management API ---

export async function addLanguage(language: Omit<Language, 'id' | 'courseCount'>): Promise<Language> {
    return request<Language>('/languages', {
        method: 'POST',
        body: JSON.stringify(language),
    });
}

export async function updateLanguage(language: Language): Promise<Language> {
    return request<Language>(`/languages?id=${language.id}`, {
        method: 'PUT',
        body: JSON.stringify(language),
    });
}

export async function deleteLanguage(languageId: number): Promise<void> {
    return request<void>(`/languages?id=${languageId}`, {
        method: 'DELETE',
    });
}

// --- Registered Users API ---

export async function fetchRegisteredUsers(): Promise<RegisteredUser[]> {
    return request<RegisteredUser[]>('/registers', {
        method: 'GET',
    });
}

// --- User-facing Functions ---

export async function submitUserInfo(userInfo: UserInfo): Promise<void> {
    // Simulated delay for UX
    return new Promise(resolve => setTimeout(resolve, 500));
}

export async function submitConsultationRequest(requestData: {
    userInfo: UserInfo,
    course: Course
}): Promise<void> {
    const { userInfo, course } = requestData;
    const payload = {
        name: userInfo.name,
        phone: userInfo.phone,
        city: userInfo.city,
        courseOfInterest: course.language,
        level: course.level,
        type: course.type,
        format: course.format,
        schedule: course.schedule,
        price: course.price,
        description: `درخواست مشاوره برای دوره: ${course.language} - ${course.level}`,
    };
    
    // This endpoint might be public or protected depending on backend. 
    // Assuming public submission doesn't need admin token.
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
}
