
import type { Language, Course, UserInfo } from '../types';

const API_BASE_URL = 'https://api.parsa-li.com/webhook/d941ca98-b8fc-4a10-aba8-a6e17706f3ca';

// --- Hashing Utility ---
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const getToken = () => sessionStorage.getItem('adminAuthToken');

// --- Admin Authentication ---
export async function loginAdmin(username: string, password: string): Promise<{ token: string }> {
    const hashedPassword = await hashPassword(password);
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: hashedPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
    }
    
    if (!data.token) {
        throw new Error('Login response did not include a token.');
    }
    
    return data;
}

// --- Data Fetching Functions ---
export async function fetchAllCourses(): Promise<Course[]> {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error(`Failed to fetch courses: ${response.statusText}`);
    const coursesData: Course[] = await response.json();
    return coursesData.map(course => ({
        ...course,
        slug: `${course.language}-${course.level}-${course.id}`.replace(/\s/g, '-')
    }));
}

export async function fetchAllLanguages(): Promise<Omit<Language, 'courseCount'>[]> {
    const response = await fetch(`${API_BASE_URL}/languages`);
    if (!response.ok) throw new Error(`Failed to fetch languages: ${response.statusText}`);
    return response.json();
}

// --- Course Management API ---
export async function addCourse(course: Omit<Course, 'id' | 'slug'>): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error('Failed to add course');
    return response.json();
}

export async function updateCourse(course: Course): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses?id=${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
}

export async function deleteCourse(courseId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/courses?id=${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error('Failed to delete course');
}

// --- Language Management API ---
export async function addLanguage(language: Omit<Language, 'id' | 'courseCount'>): Promise<Language> {
    const response = await fetch(`${API_BASE_URL}/languages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(language),
    });
    if (!response.ok) throw new Error('Failed to add language');
    return response.json();
}

export async function updateLanguage(language: Language): Promise<Language> {
    const response = await fetch(`${API_BASE_URL}/languages?id=${language.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(language),
    });
    if (!response.ok) throw new Error('Failed to update language');
    return response.json();
}

export async function deleteLanguage(languageId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/languages?id=${languageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error('Failed to delete language');
}


// --- User-facing Functions ---
export async function submitUserInfo(userInfo: UserInfo): Promise<void> {
    console.log('Updating user info locally:', userInfo);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('User info updated locally.');
    return Promise.resolve();
}

export async function submitConsultationRequest(request: {
    userInfo: UserInfo,
    course: Course
}): Promise<void> {
    const { userInfo, course } = request;
    const payload = {
        name: userInfo.name, phone: userInfo.phone, city: userInfo.city,
        courseOfInterest: course.language, level: course.level, type: course.type,
        format: course.format, schedule: course.schedule, price: course.price,
        description: `درخواست مشاوره برای دوره: ${course.language} - ${course.level}`,
    };
    
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorData}`);
    }
}
