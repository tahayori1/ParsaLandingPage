
import type { Language, Course, UserInfo, RegisteredUser, ClubMember } from '../types';

const API_BASE_URL = 'https://api.parsa-li.com/webhook/d941ca98-b8fc-4a10-aba8-a6e17706f3ca';
const CLUB_MEMBERS_API_URL = '/club/members';

// --- Types ---

type RequestOptions = RequestInit & {
    skipAuth?: boolean;
    responseType?: 'json' | 'text' | 'void';
};

interface LoginResponse {
    token: string;
}

interface ClubRegistrationData {
    first_name: string;
    last_name: string;
    mobile: string;
}

// --- Helper Functions ---

/**
 * Hashes a password using SHA-256 for secure transmission.
 */
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const getToken = () => sessionStorage.getItem('adminAuthToken');

/**
 * Centralized request wrapper for handling fetch, auth headers, and response parsing.
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { skipAuth = false, responseType, headers: customHeaders, ...fetchOptions } = options;
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(customHeaders || {}),
    };

    if (!skipAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    // Construct URL: Handle absolute URLs vs relative endpoints
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        });

        if (!response.ok) {
            // Attempt to extract a meaningful error message
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorText = await response.text();
                // Try parsing as JSON first
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson && errorJson.message) {
                        errorMessage = errorJson.message;
                    } else {
                        errorMessage = errorText; // Fallback to raw text if no message field
                    }
                } catch {
                    if (errorText) errorMessage = errorText; // Fallback if not JSON
                }
            } catch (e) {
                // Ignore parsing errors
            }
            throw new Error(errorMessage);
        }

        // Handle specific response types requested by caller
        if (responseType === 'void' || response.status === 204) {
            return {} as T;
        }

        if (responseType === 'text') {
            const text = await response.text();
            return text as unknown as T;
        }

        // Default to JSON, but fallback to text if Content-Type isn't JSON (like club/verify sometimes)
        const contentType = response.headers.get("content-type");
        if (contentType && !contentType.includes("application/json")) {
             const text = await response.text();
             return text as unknown as T;
        }

        return await response.json();
    } catch (error) {
        console.error(`API Request Failed: ${endpoint}`, error);
        throw error;
    }
}

// --- Admin Authentication ---

export async function loginAdmin(username: string, password: string): Promise<LoginResponse> {
    const hashedPassword = await hashPassword(password);
    
    // The login endpoint might return an object OR an array based on previous context.
    // We request it as 'unknown' first to validate the shape.
    const data = await request<unknown>('/login', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ username, password: hashedPassword }),
    });

    // Handle array response: [{ "token": "..." }]
    if (Array.isArray(data) && data.length > 0 && (data[0] as any).token) {
        return { token: (data[0] as any).token };
    }
    
    // Handle object response: { "token": "..." }
    if (data && typeof data === 'object' && 'token' in data) {
        return data as LoginResponse;
    }
    
    throw new Error('پاسخ سرور معتبر نیست (توکن دریافت نشد).');
}

// --- Data Fetching Functions (Public) ---

export async function fetchAllCourses(): Promise<Course[]> {
    const coursesData = await request<Course[]>('/courses', { skipAuth: true });
    return coursesData.map(course => ({
        ...course,
        // Generate a client-side slug for routing
        slug: `${course.language}-${course.level}-${course.id}`.replace(/\s+/g, '-')
    }));
}

export async function fetchAllLanguages(): Promise<Language[]> {
    return request<Language[]>('/languages', { skipAuth: true });
}

// --- Course Management API (Admin) ---

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
        responseType: 'void'
    });
}

// --- Language Management API (Admin) ---

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
        responseType: 'void'
    });
}

// --- Registered Users API (Admin) ---

export async function fetchRegisteredUsers(): Promise<RegisteredUser[]> {
    return request<RegisteredUser[]>('/registers', {
        method: 'GET',
    });
}

// --- Club API (Public) ---

export async function registerClubUser(data: ClubRegistrationData): Promise<unknown> {
    return request<unknown>('/club/register', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify(data),
    });
}

export async function requestClubCode(mobile: string): Promise<unknown> {
    return request<unknown>('/club/code', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ mobile }),
    });
}

export async function verifyClubCode(mobile: string, code: string): Promise<string> {
    return request<string>('/club/verify', {
        method: 'POST',
        skipAuth: true,
        responseType: 'text', // Explicitly expect text response
        body: JSON.stringify({ mobile, code }),
    });
}

// --- Club Members Management API (Admin) ---

export async function fetchClubMembers(): Promise<ClubMember[]> {
    return request<ClubMember[]>(CLUB_MEMBERS_API_URL, {
        method: 'GET',
    });
}

export async function addClubMember(member: Omit<ClubMember, 'id'>): Promise<ClubMember> {
    return request<ClubMember>(CLUB_MEMBERS_API_URL, {
        method: 'POST',
        body: JSON.stringify(member),
    });
}

export async function updateClubMember(member: ClubMember): Promise<ClubMember> {
    return request<ClubMember>(`${CLUB_MEMBERS_API_URL}?id=${member.id}`, {
        method: 'PUT',
        body: JSON.stringify(member),
    });
}

export async function deleteClubMember(memberId: number): Promise<void> {
    return request<void>(`${CLUB_MEMBERS_API_URL}?id=${memberId}`, {
        method: 'DELETE',
        responseType: 'void'
    });
}

// --- User-facing Interaction Functions ---

export async function submitUserInfo(userInfo: UserInfo): Promise<void> {
    // Simulated local delay for UX purposes
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
    
    // Note: This uses the main register endpoint, not the club one.
    // We assume this endpoint returns text or JSON, handle appropriately via generic request if needed.
    // But for now, keeping consistent with previous implementation logic via request wrapper.
    await request<void>('/register', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify(payload),
    });
}
