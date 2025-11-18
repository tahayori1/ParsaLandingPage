import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Course, UserInfo, Language } from './types';
import { updateSEOMetadataForCourse } from './utils/helpers';
import { fetchAllCourses, fetchAllLanguages, submitConsultationRequest, submitUserInfo, saveCoursesToLocal, loginAdmin } from './utils/api';
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
    const [view, setView] = useState(window.location.hash);
    const [isAdmin, setIsAdmin] = useState(() => !!sessionStorage.getItem('adminAuthToken'));
    const [isCourseFormModalOpen, setIsCourseFormModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);


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
        await submitUserInfo(info);
        localStorage.setItem('userInfo', JSON.stringify(info));
        setUserInfo(info);
    }, []);
    
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedCourses = await fetchAllCourses();
            const fetchedLanguages = await fetchAllLanguages(fetchedCourses);
            
            setLanguages(fetchedLanguages);
            setAllCourses(fetchedCourses);

        } catch (error) {
            console.error("Failed to load initial data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        
        const handleHashChange = () => {
            const newHash = window.location.hash;
            setView(newHash);
        };
        
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);

    }, [loadData]);

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
            } else {
                 setSelectedCourse(null);
            }
        };

        handleHistoryChange();
        window.addEventListener('popstate', handleHistoryChange);
        return () => window.removeEventListener('popstate', handleHistoryChange);
    }, [allCourses]);

    // Admin Handlers
    const handleAdminLogin = async (username: string, password: string): Promise<boolean> => {
        try {
            const { token } = await loginAdmin(username, password);
            if (token) {
                sessionStorage.setItem('adminAuthToken', token);
                setIsAdmin(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Admin login failed:", error);
            return false;
        }
    };

    const handleAdminLogout = () => {
        sessionStorage.removeItem('adminAuthToken');
        setIsAdmin(false);
        window.location.hash = '#/';
    };
    
    const handleSaveCourse = (courseToSave: Course) => {
        let updatedCourses;
        if (courseToSave.id) { // Editing existing course
            updatedCourses = allCourses.map(c => c.id === courseToSave.id ? courseToSave : c);
        } else { // Adding new course
            const newId = Math.max(...allCourses.map(c => c.id || 0)) + 1;
            const newCourse = { ...courseToSave, id: newId, slug: `${courseToSave.language}-${courseToSave.level}-${newId}`.replace(/\s/g, '-') };
            updatedCourses = [...allCourses, newCourse];
        }
        setAllCourses(updatedCourses);
        saveCoursesToLocal(updatedCourses);
        setIsCourseFormModalOpen(false);
        setEditingCourse(null);
    };

    const handleDeleteCourse = (courseId: number) => {
        if (window.confirm('آیا از حذف این دوره اطمینان دارید؟')) {
            const updatedCourses = allCourses.filter(c => c.id !== courseId);
            setAllCourses(updatedCourses);
            saveCoursesToLocal(updatedCourses);
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


    const handleSelectCourse = useCallback((course: Course) => {
        const newHash = `#/course/${course.slug}`;
        setSelectedCourse(course);
        updateSEOMetadataForCourse(course);
        if (window.location.hash !== newHash) {
             history.pushState({ courseId: course.id }, '', newHash);
        }
    }, []);

    const handleCloseCourseModal = useCallback(() => {
        history.back();
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
        
        const fullUserInfo: UserInfo = {
            ...(userInfo || {}),
            ...info,
            courseOfInterest: selectedCourse.language
        };
        
        localStorage.setItem('userInfo', JSON.stringify(fullUserInfo));
        setUserInfo(fullUserInfo);
        
        await submitConsultationRequest({ userInfo: fullUserInfo, course: selectedCourse });
    }, [selectedCourse, userInfo]);

    const handleOpenProfileModal = useCallback(() => {
        if (userInfo) {
            setIsProfileModalOpen(true);
        } else {
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
    const languageCount = useMemo(() => languages.length, [languages]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-parsa-light-bg"><div className="text-xl font-semibold text-parsa-gray-600">درحال بارگذاری اطلاعات...</div></div>;
    }

    const renderMainApp = () => (
        <>
            <UrgencyBanner />
            <Header courseCount={courseCount} onOpenProfile={handleOpenProfileModal} />
            <main>
                <Hero />
                <QuickStats languageCount={languageCount} courseCount={courseCount} />
                <CourseCatalog 
                    languages={languages}
                    allCourses={allCourses}
                    onSelectCourse={handleSelectCourse}
                    onRequestConsultation={handleRequestConsultation}
                />
                 <Suspense fallback={<div className="text-center p-12 font-semibold">درحال بارگذاری...</div>}>
                    <Testimonials />
                    <Benefits />
                    <CTA whatsappNumber={WHATSAPP_NUMBER} />
                </Suspense>
            </main>
            <Suspense fallback={null}>
                <Footer phoneNumbers={STATIC_PHONE_NUMBERS} />
            </Suspense>

            {/* Modals with guards to prevent rendering on admin page */}
            <Suspense fallback={null}>
                {selectedCourse && view !== '#/admin' && (
                    <ClassDetailsModal 
                        course={selectedCourse} 
                        onClose={handleCloseCourseModal}
                        onOpenConsultation={() => handleRequestConsultation(selectedCourse)}
                    />
                )}
                {isConsultationModalOpen && selectedCourse && view !== '#/admin' && (
                     <ConsultationModal 
                        course={selectedCourse}
                        userInfo={userInfo}
                        onClose={handleCloseConsultation}
                        onUpdateAndConfirm={handleUserInfoSubmitAndConsult}
                     />
                )}
                {isProfileModalOpen && userInfo && view !== '#/admin' && (
                    <UserProfileModal 
                        currentUserInfo={userInfo}
                        onClose={handleCloseProfileModal}
                        onUpdate={onUpdateUserInfo}
                    />
                )}
                {isUserInfoModalOpen && view !== '#/admin' && (
                     <UserInfoModal
                        onSubmit={handleSubmitUserInfoForProfile}
                        onClose={() => {
                            setIsUserInfoModalOpen(false);
                            setPostUserInfoAction(null);
                        }}
                        title="اطلاعات شما"
                        description="برای مشاهده پروفایل، لطفا اطلاعات خود را وارد کنید."
                        submitText="ثبت و ادامه"
                    />
                )}
            </Suspense>

            <Suspense fallback={null}>
                  <Chatbot
                      userInfo={userInfo}
                      onUpdateUserInfo={onUpdateUserInfo}
                  />
            </Suspense>
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
                        onAdd={handleAddNewCourse}
                        onEdit={handleEditCourse}
                        onDelete={handleDeleteCourse}
                        onLogout={handleAdminLogout}
                    />
                    {isCourseFormModalOpen && (
                        <CourseFormModal
                            initialData={editingCourse}
                            onSave={handleSaveCourse}
                            onClose={() => setIsCourseFormModalOpen(false)}
                        />
                    )}
                </>
            )}
        </Suspense>
    );

    return view.startsWith('#/admin') ? renderAdmin() : renderMainApp();
};

export default MainApp;