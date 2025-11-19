
import React from 'react';

interface HeaderProps {
    courseCount: number;
    onOpenProfile: () => void;
    onOpenClub?: () => void; // Added prop
}

const Header: React.FC<HeaderProps> = ({ courseCount, onOpenProfile, onOpenClub }) => {
    return (
        <header className="bg-white text-parsa-gray-800 sticky top-0 z-50 shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <img src="https://parsa-li.com/wp-content/uploads/sites/158/2024/04/logo.png"
                            alt="لوگوی موسسه زبان پارسا"
                            className="h-12 md:h-14 w-auto" 
                            width="56" 
                            height="56"
                        />
                        <div>
                            <h1 className="text-lg md:text-xl font-bold text-parsa-brown-800">موسسه زبان پارسا</h1>
                            <p className="text-xs md:text-sm text-parsa-gray-500">آموزش زبان از سال ۱۳۸۰</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Club Button (Visible on all sizes) */}
                        {onOpenClub && (
                            <button 
                                onClick={onOpenClub}
                                className="bg-parsa-brown-100 text-parsa-brown-800 hover:bg-parsa-brown-200 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 transition-colors"
                            >
                                <svg className="w-4 h-4 text-parsa-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <span className="hidden md:inline">باشگاه زبان‌آموزان</span>
                                <span className="md:hidden">باشگاه</span>
                            </button>
                        )}

                        <div className="hidden lg:flex items-center gap-4">
                            <div className="bg-parsa-orange-100 text-parsa-orange-800 px-3 py-1.5 rounded-full text-sm font-semibold">
                                <span>{courseCount}</span> دوره فعال
                            </div>
                             <button 
                                onClick={onOpenProfile} 
                                title="پروفایل کاربری" 
                                aria-label="مشاهده پروفایل کاربری"
                                className="p-2 rounded-full hover:bg-parsa-gray-100 transition-colors"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-parsa-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                        </div>
                        {/* Mobile Profile Button */}
                         <button 
                            onClick={onOpenProfile} 
                            title="پروفایل کاربری" 
                            aria-label="مشاهده پروفایل کاربری"
                            className="p-2 rounded-full hover:bg-parsa-gray-100 transition-colors lg:hidden"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-parsa-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);
