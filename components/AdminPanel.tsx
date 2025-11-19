import React, { useState, useEffect, useCallback } from 'react';
import { Course, Language, RegisteredUser } from '../types';
import { formatPrice, formatPhoneNumber } from '../utils/helpers';
import * as api from '../utils/api';

interface AdminPanelProps {
    courses: Course[];
    languages: Language[];
    onAddCourse: () => void;
    onEditCourse: (course: Course) => void;
    onDeleteCourse: (courseId: number) => void;
    onAddLanguage: () => void;
    onEditLanguage: (language: Language) => void;
    onDeleteLanguage: (languageId: number) => void;
    onLogout: () => void;
}

type ActiveTab = 'courses' | 'languages' | 'users';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    courses, languages, 
    onAddCourse, onEditCourse, onDeleteCourse,
    onAddLanguage, onEditLanguage, onDeleteLanguage,
    onLogout 
}) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('courses');
    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState<string | null>(null);

    const loadRegisteredUsers = useCallback(async () => {
        setIsLoadingUsers(true);
        setUsersError(null);
        try {
            const users = await api.fetchRegisteredUsers();
            setRegisteredUsers(users);
        } catch (error) {
            console.error('Failed to fetch registered users:', error);
            setUsersError(error instanceof Error ? error.message : 'خطا در بارگذاری لیست کاربران ثبت‌نامی.');
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            loadRegisteredUsers();
        } else {
            // Clear users data when switching away from the users tab
            setRegisteredUsers([]);
            setUsersError(null);
        }
    }, [activeTab, loadRegisteredUsers]);

    const handleGoToMainSite = () => {
        window.location.hash = '#/'; // Navigate to homepage
        onLogout(); // Log out from admin session
    };
    
    return (
        <div className="bg-parsa-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center justify-between pb-4 border-b border-parsa-gray-200 mb-6">
                    <div className="flex items-center gap-3">
                        <img src="https://parsa-li.com/wp-content/uploads/sites/158/2024/04/logo.png" alt="Parsa Institute" className="h-10 w-auto"/>
                        <h1 className="text-2xl font-bold text-parsa-brown-800">پنل مدیریت</h1>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleGoToMainSite}
                            className="bg-parsa-gray-200 text-parsa-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-parsa-gray-300 transition-colors text-sm"
                        >
                            بازگشت به سایت اصلی
                        </button>
                        <button 
                            onClick={onLogout}
                            className="bg-parsa-gray-200 text-parsa-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-parsa-gray-300 transition-colors text-sm"
                        >
                            خروج
                        </button>
                    </div>
                </header>
                
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-4 space-x-reverse" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('courses')}
                            className={`${activeTab === 'courses' ? 'border-parsa-orange-500 text-parsa-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            مدیریت دوره‌ها
                        </button>
                        <button
                            onClick={() => setActiveTab('languages')}
                            className={`${activeTab === 'languages' ? 'border-parsa-orange-500 text-parsa-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            مدیریت زبان‌ها
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`${activeTab === 'users' ? 'border-parsa-orange-500 text-parsa-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            مدیریت کاربران ثبت‌نامی
                        </button>
                    </nav>
                </div>

                {activeTab === 'courses' && (
                    <div>
                        <div className="mb-6 text-left">
                            <button
                                onClick={onAddCourse}
                                className="bg-parsa-orange-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-parsa-orange-600 transition-colors shadow-sm inline-flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                افزودن دوره جدید
                            </button>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                             <table className="w-full text-sm text-right text-parsa-gray-600">
                                <thead className="text-xs text-parsa-gray-700 uppercase bg-parsa-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">زبان</th>
                                        <th scope="col" className="px-6 py-3">سطح</th>
                                        <th scope="col" className="px-6 py-3">نوع/فرمت</th>
                                        <th scope="col" className="px-6 py-3">شهریه</th>
                                        <th scope="col" className="px-6 py-3">وضعیت</th>
                                        <th scope="col" className="px-6 py-3 text-center">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-4">دوره ای یافت نشد.</td></tr>
                                    ) : (
                                        courses.map(course => (
                                            <tr key={course.id} className="bg-white border-b hover:bg-parsa-gray-50">
                                                <td className="px-6 py-4 font-medium text-parsa-brown-900 whitespace-nowrap">{course.language}</td>
                                                <td className="px-6 py-4">{course.level}</td>
                                                <td className="px-6 py-4">{course.type} / {course.format}</td>
                                                <td className="px-6 py-4" dir="ltr">{formatPrice(course.price)}</td>
                                                <td className="px-6 py-4">{course.status}</td>
                                                <td className="px-6 py-4 text-center space-x-2 space-x-reverse">
                                                    <button onClick={() => onEditCourse(course)} className="font-medium text-parsa-orange-600 hover:underline">ویرایش</button>
                                                    <button onClick={() => onDeleteCourse(course.id!)} className="font-medium text-danger hover:underline">حذف</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'languages' && (
                    <div>
                         <div className="mb-6 text-left">
                            <button
                                onClick={onAddLanguage}
                                className="bg-parsa-orange-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-parsa-orange-600 transition-colors shadow-sm inline-flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                افزودن زبان جدید
                            </button>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                            <table className="w-full text-sm text-right text-parsa-gray-600">
                                <thead className="text-xs text-parsa-gray-700 uppercase bg-parsa-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">نام زبان</th>
                                        <th scope="col" className="px-6 py-3">توضیحات</th>
                                        <th scope="col" className="px-6 py-3 text-center">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {languages.length === 0 ? (
                                        <tr><td colSpan={3} className="text-center py-4">زبانی یافت نشد.</td></tr>
                                    ) : (
                                        languages.map(lang => (
                                            <tr key={lang.id} className="bg-white border-b hover:bg-parsa-gray-50">
                                                <td className="px-6 py-4 font-medium text-parsa-brown-900">{lang.name}</td>
                                                <td className="px-6 py-4">{lang.description}</td>
                                                <td className="px-6 py-4 text-center space-x-2 space-x-reverse">
                                                    <button onClick={() => onEditLanguage(lang)} className="font-medium text-parsa-orange-600 hover:underline">ویرایش</button>
                                                    <button onClick={() => onDeleteLanguage(lang.id!)} className="font-medium text-danger hover:underline">حذف</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Registered Users Tab */}
                {activeTab === 'users' && (
                    <div>
                        <div className="mb-6 text-left">
                            <button
                                onClick={loadRegisteredUsers} // Refresh button
                                className="bg-parsa-gray-200 text-parsa-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-parsa-gray-300 transition-colors shadow-sm inline-flex items-center gap-2 disabled:opacity-50"
                                disabled={isLoadingUsers}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${isLoadingUsers ? 'animate-spin' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.922v-.007M2.975 20.318h4.922m0 0a3 3 0 10-4.922 0M16.023 9.348a3 3 0 110-4.922m0 4.922h-5.922m-4.922 0h-5.922m0 0a3 3 0 100-4.922m0 4.922V17.25m-4.922 0h-5.922m0 0a3 3 0 100-4.922m0 4.922V17.25m-4.922-4.922a3 3 0 110-4.922m0 4.922h-5.922m-4.922 0h-5.922m0 0a3 3 0 100-4.922m0 4.922V17.25m-4.922-4.922a3 3 0 110-4.922m0 4.922h-5.922m-4.922 0h-5.922m0 0a3 3 0 100-4.922m0 4.922V17.25" />
                                </svg>
                                {isLoadingUsers ? 'درحال بارگذاری...' : 'بارگذاری مجدد لیست'}
                            </button>
                        </div>
                        {usersError && (
                            <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm mb-4">
                                {usersError}
                            </div>
                        )}
                        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                            <table className="w-full text-sm text-right text-parsa-gray-600">
                                <thead className="text-xs text-parsa-gray-700 uppercase bg-parsa-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">نام</th>
                                        <th scope="col" className="px-6 py-3">شماره تماس</th>
                                        <th scope="col" className="px-6 py-3">شهر</th>
                                        <th scope="col" className="px-6 py-3">دوره مورد علاقه</th>
                                        <th scope="col" className="px-6 py-3">سطح</th>
                                        <th scope="col" className="px-6 py-3">نوع</th>
                                        <th scope="col" className="px-6 py-3">شهریه</th>
                                        <th scope="col" className="px-6 py-3">تاریخ ثبت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoadingUsers ? (
                                        <tr><td colSpan={8} className="text-center py-4 text-parsa-gray-500">درحال بارگذاری کاربران...</td></tr>
                                    ) : registeredUsers.length === 0 ? (
                                        <tr><td colSpan={8} className="text-center py-4">کاربر ثبت‌نامی یافت نشد.</td></tr>
                                    ) : (
                                        registeredUsers.map(user => (
                                            <tr key={user.id} className="bg-white border-b hover:bg-parsa-gray-50">
                                                <td className="px-6 py-4 font-medium text-parsa-brown-900 whitespace-nowrap">{user.name}</td>
                                                <td className="px-6 py-4" dir="ltr">{formatPhoneNumber(user.phone)}</td>
                                                <td className="px-6 py-4">{user.city}</td>
                                                <td className="px-6 py-4">{user.courseOfInterest}</td>
                                                <td className="px-6 py-4">{user.level}</td>
                                                <td className="px-6 py-4">{user.type}</td>
                                                <td className="px-6 py-4" dir="ltr">{formatPrice(user.price)}</td>
                                                <td className="px-6 py-4" dir="ltr">{new Date(user.created_at).toLocaleDateString('fa-IR')}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminPanel;