
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Course, UserInfo, Language } from './types';
import { updateSEOMetadataForCourse } from './utils/helpers';
import * as api from './utils/api';
import UrgencyBanner from './components/UrgencyBanner';

import Header from './components/Header';
import Hero from './components/Hero';
import QuickStats from './components/QuickStats';
import CourseCatalog from './components/CarInventory'; // Re-using file

const Testimonials = lazy(() => import('./components/Testimonials'));
const Benefits = lazy(() => import('./components/Benefits'));
const CTA = lazy(() => import('./components/CTA'));
const Footer = lazy(() => import('./components/Footer'));
const ClassDetailsModal = lazy(() => import('./components/CarModal')); // Re-using file
const ConsultationModal = lazy(() => import('./components/ConsultationModal'));
const UserProfileModal = lazy(() => import('./components/UserProfileModal'));
const UserInfoModal = lazy(() => import('./components/UserInfoModal'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const CourseFormModal = lazy(() => import('./components/CourseFormModal'));
const LanguageFormModal = lazy(() => import('./components/LanguageFormModal'));

const STATIC_PHONE_NUMBERS = ['09173162644', '09013443574', '071-32331829', '071-32357641'];
const WHATSAPP_NUMBER = '09173162644';

const MainApp: React.FC = () => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
    const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState<boolean>(false);
    const [postUserInfoAction, setPostUserInfoAction] = useState<'profile' | null>(null);

    // Admin state
    const [view, setView] = useState(window.location.hash || '#/');
    const [isAdmin, setIsAdmin] = useState(() => !!sessionStorage.getItem('adminAuthToken'));
    const [isCourseFormModalOpen, setIsCourseFormModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isLanguageFormModalOpen, setIsLanguageFormModalOpen] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);


    const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
        try {
            const storedUserInfo = localStorage.getItem('userInfo');
            return storedUserInfo ? JSON.parse(storedUserInfo) : null;
        } catch (error) {
            console.error('Failed to parse user info from localStorage', error);
            localStorage.removeItem('userInfo');
            return null;
        }
    });
    
    const onUpdateUserInfo = useCallback(async (info: UserInfo) => {
        await api.submitUserInfo(info);
        localStorage.setItem('userInfo', JSON.stringify(info));
        setUserInfo(info);
    }, []);
    
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedCourses = await api.fetchAllCourses();
            const baseLanguages = await api.fetchAllLanguages();
            
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

    useEffect(() => {
        const handleRouteChange = () => {
            const currentHash = window.location.hash || '#/';
            if (currentHash.startsWith('#/admin')) {
                setSelectedCourse(null);
                setIsConsultationModalOpen(false);
                setIsProfileModalOpen(false);
                setIsUserInfoModalOpen(false);
            }
            setView(currentHash);
        };
        handleRouteChange();
        window.addEventListener('hashchange', handleRouteChange);
        return () => window.removeEventListener('hashchange', handleRouteChange);
    }, []);


    useEffect(() => {
        if (allCourses.length === 0) return;
        const handleHistoryChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/course/')) {
                const slug = hash.substring(8);
                const course = allCourses.find(c => c.slug === slug);
                if(course) {
                    setSelectedCourse(course);
                    updateSEOMetadataForCourse(course);
                }
            } else if (!hash.startsWith('#/admin')) {
                 setSelectedCourse(null);
            }
        };
        handleHistoryChange();
        window.addEventListener('popstate', handleHistoryChange);
        return () => window.removeEventListener('popstate', handleHistoryChange);
    }, [allCourses]);

    // Admin Handlers
    const handleAdminLogin = async (username: string, password: string): Promise<boolean | string> => {
        try {
            const { token } = await api.loginAdmin(username, password);
            if (token) {
                sessionStorage.setItem('adminAuthToken', token);
                setIsAdmin(true);
                return true;
            }
            return 'توکن دریافت نشد.';
        } catch (error) {
            console.error("Admin login failed:", error);
            return error instanceof Error ? error.message : 'خطای ناشناخته در ورود.';
        }
    };

    const handleAdminLogout = () => {
        sessionStorage.removeItem('adminAuthToken');
        setIsAdmin(false);
        window.location.hash = '#/';
    };
    
    // Course Handlers
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
            console.error("Failed to save course:", error);
            alert("خطا در ذخیره سازی دوره. لطفا دوباره تلاش کنید.");
        }
    };

    const handleDeleteCourse = async (courseId: number) => {
        if (window.confirm('آیا از حذف این دوره اطمینان دارید؟')) {
            try {
                await api.deleteCourse(courseId);
                await loadData();
            } catch (error) {
                 console.error("Failed to delete course:", error);
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

    // Language Handlers
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
            console.error("Failed to save language:", error);
            alert("خطا در ذخیره سازی زبان. لطفا دوباره تلاش کنید.");
        }
    };

    const handleDeleteLanguage = async (langId: number) => {
        if (window.confirm('آیا از حذف این زبان اطمینان دارید؟ حذف زبان ممکن است باعث ایجاد مشکل در دوره‌های مرتبط شود.')) {
            try {
                await api.deleteLanguage(langId);
                await loadData();
            } catch (error) {
                 console.error("Failed to delete language:", error);
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


    const handleSelectCourse = useCallback((course: Course) => {
        const newHash = `#/course/${course.slug}`;
        setSelectedCourse(course);
        updateSEOMetadataForCourse(course);
        if (window.location.hash !== newHash) {
             history.pushState({ courseId: course.id }, '', newHash);
        }
    }, []);

    const handleCloseCourseModal = useCallback(() => {
        if (window.location.hash.startsWith('#/course/')) {
            history.back();
        } else {
            setSelectedCourse(null);
        }
    }, []);

    const handleRequestConsultation = useCallback((course: Course) => {
        setSelectedCourse(course);
        setIsConsultationModalOpen(true); 
    }, []);

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
            setIsUserInfoModalOpen(true);
        }
    }, [userInfo]);

    const handleCloseProfileModal = useCallback(() => setIsProfileModalOpen(false), []);

    const handleSubmitUserInfoForProfile = useCallback(async (info: UserInfo) => {
        await onUpdateUserInfo(info);
        setIsUserInfoModalOpen(false);
        setIsProfileModalOpen(true);
        setPostUserInfoAction(null);
    }, [onUpdateUserInfo]);

    const courseCount = useMemo(() => allCourses.length, [allCourses]);

    useEffect(() => { loadData(); }, [loadData]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-parsa-light-bg"><div className="text-xl font-semibold text-parsa-gray-600">درحال بارگذاری اطلاعات...</div></div>;
    }

    const renderMainApp = () => (
        <>
            <UrgencyBanner />
            <Header courseCount={courseCount} onOpenProfile={handleOpenProfileModal} />
            <main>
                <Hero />
                <QuickStats languageCount={languages.length} courseCount={courseCount} />
                <CourseCatalog languages={languages} allCourses={allCourses} onSelectCourse={handleSelectCourse} onRequestConsultation={handleRequestConsultation} />
                 <Suspense fallback={<div className="text-center p-12 font-semibold">درحال بارگذاری...</div>}>
                    <Testimonials />
                    <Benefits />
                    <CTA whatsappNumber={WHATSAPP_NUMBER} />
                </Suspense>
            </main>
            <Suspense fallback={null}><Footer phoneNumbers={STATIC_PHONE_NUMBERS} /></Suspense>
            <Suspense fallback={null}>
                {selectedCourse && <ClassDetailsModal course={selectedCourse} onClose={handleCloseCourseModal} onOpenConsultation={() => handleRequestConsultation(selectedCourse)} />}
                {isConsultationModalOpen && selectedCourse && <ConsultationModal course={selectedCourse} userInfo={userInfo} onClose={handleCloseConsultation} onUpdateAndConfirm={handleUserInfoSubmitAndConsult} />}
                {isProfileModalOpen && userInfo && <UserProfileModal currentUserInfo={userInfo} onClose={handleCloseProfileModal} onUpdate={onUpdateUserInfo} />}
                {isUserInfoModalOpen && <UserInfoModal onSubmit={handleSubmitUserInfoForProfile} onClose={() => { setIsUserInfoModalOpen(false); setPostUserInfoAction(null); }} title="اطلاعات شما" description="برای مشاهده پروفایل، لطفا اطلاعات خود را وارد کنید." submitText="ثبت و ادامه" />}
            </Suspense>
            <Suspense fallback={null}><Chatbot userInfo={userInfo} onUpdateUserInfo={onUpdateUserInfo} /></Suspense>
        </>
    );

    const renderAdmin = () => (
         <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Admin...</div>}>
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
                        <CourseFormModal initialData={editingCourse} onSave={handleSaveCourse} onClose={() => setIsCourseFormModalOpen(false)} />
                    )}
                    {isLanguageFormModalOpen && (
                        <LanguageFormModal initialData={editingLanguage} onSave={handleSaveLanguage} onClose={() => setIsLanguageFormModalOpen(false)} />
                    )}
                </>
            )}
        </Suspense>
    );

    return view.startsWith('#/admin') ? renderAdmin() : renderMainApp();
};

export default MainApp;
