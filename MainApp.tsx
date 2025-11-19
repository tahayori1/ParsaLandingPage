
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Course, UserInfo, Language } from './types';
import { updateSEOMetadataForCourse } from './utils/helpers';
import * as api from './utils/api';
import UrgencyBanner from './components/UrgencyBanner';

import Header from './components/Header';
import Hero from './components/Hero';
import QuickStats from './components/QuickStats';
import CourseCatalog from './components/CarInventory';

// Lazy loaded components
const Testimonials = lazy(() => import('./components/Testimonials'));
const Benefits = lazy(() => import('./components/Benefits'));
const CTA = lazy(() => import('./components/CTA'));
const Footer = lazy(() => import('./components/Footer'));
const ClassDetailsModal = lazy(() => import('./components/CarModal'));
const ConsultationModal = lazy(() => import('./components/ConsultationModal'));
const UserProfileModal = lazy(() => import('./components/UserProfileModal'));
const UserInfoModal = lazy(() => import('./components/UserInfoModal'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const CourseFormModal = lazy(() => import('./components/CourseFormModal'));
const LanguageFormModal = lazy(() => import('./components/LanguageFormModal'));

const STATIC_PHONE_NUMBERS = ['09173162644', '09013443574', '071-32331829', '071-32357641'];
const WHATSAPP_NUMBER = '09173162644';

const MainApp: React.FC = () => {
    // Data State
    const [languages, setLanguages] = useState<Language[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // UI State - Main App
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
    const [isUserInfoModalOpen, useStateUserInfoModalOpen] = useState<boolean>(false);
    const [, setPostUserInfoAction] = useState<'profile' | null>(null); // Kept for potential future expansion

    // Routing & Auth State
    const [view, setView] = useState(window.location.hash || '#/');
    const [isAdmin, setIsAdmin] = useState(() => !!sessionStorage.getItem('adminAuthToken'));

    // Admin Modal States
    const [isCourseFormModalOpen, setIsCourseFormModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isLanguageFormModalOpen, setIsLanguageFormModalOpen] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);

    // User Info Persistence
    const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
        try {
            const storedUserInfo = localStorage.getItem('userInfo');
            return storedUserInfo ? JSON.parse(storedUserInfo) : null;
        } catch (error) {
            localStorage.removeItem('userInfo');
            return null;
        }
    });
    
    const onUpdateUserInfo = useCallback(async (info: UserInfo) => {
        await api.submitUserInfo(info);
        localStorage.setItem('userInfo', JSON.stringify(info));
        setUserInfo(info);
    }, []);
    
    // Data Loading
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [fetchedCourses, baseLanguages] = await Promise.all([
                api.fetchAllCourses(),
                api.fetchAllLanguages()
            ]);
            
            // Merge course count into languages
            const fetchedLanguages = baseLanguages.map(lang => ({
                ...lang,
                courseCount: fetchedCourses.filter(c => c.language === lang.name).length
            }));
            
            setLanguages(fetchedLanguages);
            setAllCourses(fetchedCourses);

        } catch (error) {
            console.error("Failed to load initial data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial Load
    useEffect(() => { loadData(); }, [loadData]);

    // Routing Logic
    useEffect(() => {
        const handleRouteChange = () => {
            const currentHash = window.location.hash || '#/';
            
            // Security/UX: Close all modals when entering admin area
            if (currentHash.startsWith('#/admin')) {
                setSelectedCourse(null);
                setIsConsultationModalOpen(false);
                setIsProfileModalOpen(false);
                useStateUserInfoModalOpen(false);
            }
            
            setView(currentHash);
        };

        // Handle initial route
        handleRouteChange();
        window.addEventListener('hashchange', handleRouteChange);
        return () => window.removeEventListener('hashchange', handleRouteChange);
    }, []);

    // Sync URL with selected course (Deep linking)
    useEffect(() => {
        if (allCourses.length === 0) return;

        const hash = window.location.hash;
        if (hash.startsWith('#/course/')) {
            const slug = hash.substring(9); // 9 is length of '#/course/'
            const course = allCourses.find(c => c.slug === slug);
            if(course) {
                setSelectedCourse(course);
                updateSEOMetadataForCourse(course);
            }
        } else if (!hash.startsWith('#/admin') && !hash.startsWith('#/language/')) {
             // Only clear course if we are not in admin or language view
             // But if we are just navigating back to home or list, clear it.
             setSelectedCourse(null);
        }
    }, [allCourses, view]);

    const selectedLanguageNameFromUrl = useMemo(() => {
        if (view.startsWith('#/language/')) {
            // Extract language name from URL, handle encoded characters
            const langSlug = decodeURIComponent(view.substring(11)); // Length of '#/language/'
            // Match slug (hyphenated) back to name (spaced) logic
            const lang = languages.find(l => l.name.replace(/\s/g, '-') === langSlug);
            return lang ? lang.name : null;
        }
        return null;
    }, [view, languages]);

    // --- Admin Handlers ---
    
    const handleAdminLogin = useCallback(async (username: string, password: string): Promise<boolean | string> => {
        try {
            const { token } = await api.loginAdmin(username, password);
            if (token) {
                sessionStorage.setItem('adminAuthToken', token);
                setIsAdmin(true);
                return true;
            }
            return 'توکن دریافت نشد.';
        } catch (error) {
            return error instanceof Error ? error.message : 'خطای ناشناخته در ورود.';
        }
    }, []);

    const handleAdminLogout = useCallback(() => {
        sessionStorage.removeItem('adminAuthToken');
        setIsAdmin(false);
        window.location.hash = '#/';
    }, []);
    
    const handleSaveCourse = async (courseToSave: Course) => {
        try {
            if (courseToSave.id) {
                await api.updateCourse(courseToSave);
            } else {
                await api.addCourse(courseToSave);
            }
            setIsCourseFormModalOpen(false);
            setEditingCourse(null);
            await loadData();
        } catch (error) {
            alert("خطا در ذخیره سازی دوره. لطفا دوباره تلاش کنید.");
        }
    };

    const handleDeleteCourse = async (courseId: number) => {
        if (window.confirm('آیا از حذف این دوره اطمینان دارید؟')) {
            try {
                await api.deleteCourse(courseId);
                await loadData();
            } catch (error) {
                 alert("خطا در حذف دوره.");
            }
        }
    };
    
    const handleEditCourse = (course: Course) => {
        setEditingCourse(course);
        setIsCourseFormModalOpen(true);
    };

    const handleAddNewCourse = () => {
        setEditingCourse(null);
        setIsCourseFormModalOpen(true);
    };

    // --- Language Handlers ---
    
    const handleSaveLanguage = async (langToSave: Language) => {
         try {
            if (langToSave.id) {
                await api.updateLanguage(langToSave);
            } else {
                await api.addLanguage(langToSave);
            }
            setIsLanguageFormModalOpen(false);
            setEditingLanguage(null);
            await loadData();
        } catch (error) {
            alert("خطا در ذخیره سازی زبان. لطفا دوباره تلاش کنید.");
        }
    };

    const handleDeleteLanguage = async (langId: number) => {
        if (window.confirm('آیا از حذف این زبان اطمینان دارید؟ حذف زبان ممکن است باعث ایجاد مشکل در دوره‌های مرتبط شود.')) {
            try {
                await api.deleteLanguage(langId);
                await loadData();
            } catch (error) {
                 alert("خطا در حذف زبان.");
            }
        }
    };

    const handleEditLanguage = (lang: Language) => {
        setEditingLanguage(lang);
        setIsLanguageFormModalOpen(true);
    };

    const handleAddNewLanguage = () => {
        setEditingLanguage(null);
        setIsLanguageFormModalOpen(true);
    };

    // --- User Interaction Handlers ---

    const handleSelectCourse = useCallback((course: Course) => {
        const newHash = `#/course/${course.slug}`;
        if (window.location.hash !== newHash) {
             window.location.hash = newHash;
        }
    }, []);

    const handleCloseCourseModal = useCallback(() => {
        // If we are on a deep link, go back. If not (e.g. opened from list), just close.
        // Simplest strategy for this SPA: go back to language list or home.
        if (window.history.length > 1) {
             window.history.back();
        } else {
             window.location.hash = '#/';
        }
    }, []);

    const handleRequestConsultation = useCallback((course: Course) => {
        // Ensure course is set before opening modal
        if (!selectedCourse || selectedCourse.id !== course.id) {
            setSelectedCourse(course);
        }
        setIsConsultationModalOpen(true); 
    }, [selectedCourse]);

    const handleCloseConsultation = useCallback(() => {
        setIsConsultationModalOpen(false);
    }, []);

    const handleUserInfoSubmitAndConsult = useCallback(async (info: UserInfo) => {
        if (!selectedCourse) throw new Error("No course selected for consultation");
        const fullUserInfo: UserInfo = { ...(userInfo || {}), ...info, courseOfInterest: selectedCourse.language };
        localStorage.setItem('userInfo', JSON.stringify(fullUserInfo));
        setUserInfo(fullUserInfo);
        await api.submitConsultationRequest({ userInfo: fullUserInfo, course: selectedCourse });
    }, [selectedCourse, userInfo]);

    const handleOpenProfileModal = useCallback(() => {
        if (userInfo) setIsProfileModalOpen(true);
        else {
            setPostUserInfoAction('profile');
            useStateUserInfoModalOpen(true);
        }
    }, [userInfo]);

    const handleCloseProfileModal = useCallback(() => setIsProfileModalOpen(false), []);

    const handleSubmitUserInfoForProfile = useCallback(async (info: UserInfo) => {
        await onUpdateUserInfo(info);
        useStateUserInfoModalOpen(false);
        setIsProfileModalOpen(true);
        setPostUserInfoAction(null);
    }, [onUpdateUserInfo]);
    
    const handleSetSelectedLanguage = useCallback((langName: string) => {
        const slug = langName.replace(/\s/g, '-');
        window.location.hash = `#/language/${encodeURIComponent(slug)}`;
    }, []);

    const handleClearSelectedLanguage = useCallback(() => {
        window.location.hash = '#/';
        // Scroll to top of courses section smoothly
        setTimeout(() => {
            const el = document.getElementById('courses');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }, []);

    const courseCount = useMemo(() => allCourses.length, [allCourses]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-parsa-light-bg">
                <div className="text-xl font-semibold text-parsa-gray-600 animate-pulse">درحال بارگذاری اطلاعات...</div>
            </div>
        );
    }

    // --- Render Helpers ---

    const renderMainApp = () => (
        <>
            <UrgencyBanner />
            <Header courseCount={courseCount} onOpenProfile={handleOpenProfileModal} />
            <main>
                <Hero />
                <QuickStats languageCount={languages.length} courseCount={courseCount} />
                <CourseCatalog 
                    languages={languages} 
                    allCourses={allCourses} 
                    selectedLanguage={selectedLanguageNameFromUrl}
                    onSelectLanguage={handleSetSelectedLanguage}
                    onGoBack={handleClearSelectedLanguage}
                    onSelectCourse={handleSelectCourse} 
                    onRequestConsultation={handleRequestConsultation} 
                />
                 <Suspense fallback={<div className="py-12 text-center">درحال بارگذاری...</div>}>
                    <Testimonials />
                    <Benefits />
                    <CTA whatsappNumber={WHATSAPP_NUMBER} />
                </Suspense>
            </main>
            <Suspense fallback={null}><Footer phoneNumbers={STATIC_PHONE_NUMBERS} /></Suspense>
            
            {/* Modals - Only render if NOT in admin view to prevent black screen overlay issues */}
            <Suspense fallback={null}>
                {!view.startsWith('#/admin') && selectedCourse && (
                    <ClassDetailsModal 
                        course={selectedCourse} 
                        onClose={handleCloseCourseModal} 
                        onOpenConsultation={() => handleRequestConsultation(selectedCourse)} 
                    />
                )}
                {!view.startsWith('#/admin') && isConsultationModalOpen && selectedCourse && (
                    <ConsultationModal 
                        course={selectedCourse} 
                        userInfo={userInfo} 
                        onClose={handleCloseConsultation} 
                        onUpdateAndConfirm={handleUserInfoSubmitAndConsult} 
                    />
                )}
                {!view.startsWith('#/admin') && isProfileModalOpen && userInfo && (
                    <UserProfileModal 
                        currentUserInfo={userInfo} 
                        onClose={handleCloseProfileModal} 
                        onUpdate={onUpdateUserInfo} 
                    />
                )}
                {!view.startsWith('#/admin') && isUserInfoModalOpen && (
                    <UserInfoModal 
                        onSubmit={handleSubmitUserInfoForProfile} 
                        onClose={() => { useStateUserInfoModalOpen(false); setPostUserInfoAction(null); }} 
                        title="اطلاعات شما" 
                        description="برای مشاهده پروفایل، لطفا اطلاعات خود را وارد کنید." 
                        submitText="ثبت و ادامه" 
                    />
                )}
            </Suspense>
        </>
    );

    const renderAdmin = () => (
         <Suspense fallback={<div className="flex items-center justify-center h-screen">در حال بارگذاری پنل مدیریت...</div>}>
            {!isAdmin ? (
                <AdminLogin onLogin={handleAdminLogin} />
            ) : (
                <>
                    <AdminPanel 
                        courses={allCourses}
                        languages={languages}
                        onAddCourse={handleAddNewCourse}
                        onEditCourse={handleEditCourse}
                        onDeleteCourse={handleDeleteCourse}
                        onAddLanguage={handleAddNewLanguage}
                        onEditLanguage={handleEditLanguage}
                        onDeleteLanguage={handleDeleteLanguage}
                        onLogout={handleAdminLogout}
                    />
                    {isCourseFormModalOpen && (
                        <CourseFormModal 
                            initialData={editingCourse} 
                            onSave={handleSaveCourse} 
                            onClose={() => setIsCourseFormModalOpen(false)} 
                            availableLanguages={languages}
                        />
                    )}
                    {isLanguageFormModalOpen && (
                        <LanguageFormModal 
                            initialData={editingLanguage} 
                            onSave={handleSaveLanguage} 
                            onClose={() => setIsLanguageFormModalOpen(false)} 
                        />
                    )}
                </>
            )}
        </Suspense>
    );

    return view.startsWith('#/admin') ? renderAdmin() : renderMainApp();
};

export default MainApp;
