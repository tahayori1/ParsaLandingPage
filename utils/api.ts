import type { Language, Course, UserInfo } from '../types';

const API_BASE_URL = 'https://api.parsa-li.com/webhook/d941ca98-b8fc-4a10-aba8-a6e17706f3ca';
const COURSES_STORAGE_KEY = 'parsa-courses';

// --- Hashing Utility ---
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


// --- Admin Authentication ---
export async function loginAdmin(username: string, password: string): Promise<{ token: string }> {
    const hashedPassword = await hashPassword(password);
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: hashedPassword }),
    });

    if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
    }
    
    const data = await response.json();
    if (!data.token) {
        throw new Error('Login response did not include a token.');
    }
    
    return data;
}


// --- Local Storage Functions for Admin ---

export function loadCoursesFromLocal(): Course[] | null {
    try {
        const localData = localStorage.getItem(COURSES_STORAGE_KEY);
        if (localData) {
            return JSON.parse(localData);
        }
        return null;
    } catch (error) {
        console.error("Failed to load courses from local storage", error);
        return null;
    }
}

export function saveCoursesToLocal(courses: Course[]): void {
    try {
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    } catch (error) {
        console.error("Failed to save courses to local storage", error);
    }
}

// --- Data Fetching Functions ---

async function fetchCoursesFromServer(): Promise<Course[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        if (!response.ok) {
            throw new Error(`Failed to fetch courses: ${response.statusText}`);
        }
        const coursesData: Course[] = await response.json();
        
        // Add a unique slug to each course for URL routing and save to local storage
        const processedCourses = coursesData.map(course => ({
            ...course,
            slug: `${course.language}-${course.level}-${course.id}`.replace(/\s/g, '-')
        }));

        saveCoursesToLocal(processedCourses);
        return processedCourses;
    } catch (error) {
        console.error("Failed to load or process courses from server", error);
        return [];
    }
}

export async function fetchAllLanguages(courses: Course[]): Promise<Language[]> {
    try {
        const languagesResponse = await fetch(`${API_BASE_URL}/languages`);
        if (!languagesResponse.ok) {
            throw new Error(`Failed to fetch languages: ${languagesResponse.statusText}`);
        }
        const languagesData: Omit<Language, 'courseCount'>[] = await languagesResponse.json();
        
        // Add the courseCount to each language based on the current course list.
        return languagesData.map(lang => ({
            ...lang,
            courseCount: courses.filter(c => c.language === lang.name).length
        }));
    } catch (error) {
        console.error("Failed to load or process languages", error);
        return [];
    }
}

export async function fetchAllCourses(): Promise<Course[]> {
    const localCourses = loadCoursesFromLocal();
    if (localCourses) {
        console.log("Loaded courses from localStorage.");
        return localCourses;
    }
    console.log("Fetching courses from server and priming localStorage.");
    return fetchCoursesFromServer();
}

// This function remains for local profile updates as no API endpoint was specified
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
    
    console.log('Submitting consultation request to API:', payload);

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorData}`);
        }

        console.log('Consultation request submitted successfully.');
    } catch (error) {
        console.error('Failed to submit consultation request:', error);
        throw error; // Re-throw the error to be handled by the UI
    }
}