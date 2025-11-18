import React from 'react';
import { formatPhoneNumber } from '../utils/helpers';

interface FooterProps {
    phoneNumbers: string[];
}

const Footer: React.FC<FooterProps> = ({ phoneNumbers }) => {
    return (
        <footer className="bg-parsa-gray-800 text-parsa-gray-200 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                             <img src="/icons/logo-white.svg" alt="موسسه زبان پارسا" className="h-12 w-auto" />
                             <h3 className="text-xl font-bold text-white">موسسه زبان پارسا</h3>
                        </div>
                        <p className="text-parsa-gray-300 mb-4 leading-relaxed">
                           موسسه زبان پارسا، پیشرو در ارائه خدمات نوین آموزشی زبان‌های خارجی در شیراز با بیش از یک دهه سابقه درخشان.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-parsa-gray-700 rounded-full flex items-center justify-center hover:bg-parsa-teal-500 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919 1.266-.057 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"></path></svg>
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-parsa-gray-700 rounded-full flex items-center justify-center hover:bg-parsa-teal-500 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path></svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">اطلاعات تماس</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-parsa-teal-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <div>
                                    <p className="text-sm">شیراز، بلوار شهید بهشتی، حدفاصل چهارراه بنفشه به سمت چهارراه خلدبرین.</p>
                                </div>
                            </div>
                            <div className="space-y-2" dir="ltr">
                                {phoneNumbers.map(phone => (
                                    <div key={phone} className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-parsa-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                        <div className="text-sm">
                                            <a href={`tel:${phone.replace(/-/g, '')}`} className="hover:text-parsa-teal-400 transition-colors" style={{ direction: 'ltr' }}>{phone}</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">ساعات کاری</h4>
                        <div className="space-y-2 text-sm text-parsa-gray-300">
                            <p>شنبه تا پنج‌شنبه:</p>
                            <p>۰۹:۰۰ صبح تا ۲۰:۰۰ شب</p>
                            <p>جمعه‌ها:</p>
                            <p>۱۰:۰۰ صبح تا ۱۶:۰۰ بعدازظهر</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-parsa-gray-700 mt-8 pt-8 text-center text-sm text-parsa-gray-400">
                    <p>© ۱۴۰۴ موسسه زبان پارسا. تمامی حقوق محفوظ است.</p>
                    <a href="#/admin" className="text-parsa-gray-500 hover:text-parsa-teal-400 transition-colors mt-2 inline-block">ورود مدیر</a>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);