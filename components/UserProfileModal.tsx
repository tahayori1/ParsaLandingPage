
import React, { useState, useEffect, useCallback } from 'react';
import { UserInfo } from '../types';
import { cities } from '../constants';

interface UserProfileModalProps {
    currentUserInfo: UserInfo;
    onClose: () => void;
    onUpdate: (userInfo: UserInfo) => Promise<void>;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ currentUserInfo, onClose, onUpdate }) => {
    const [name, setName] = useState(currentUserInfo.name);
    const [phone, setPhone] = useState(currentUserInfo.phone);
    const [city, setCity] = useState(currentUserInfo.city);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    const isFormValid = name && phone && city;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsSubmitting(true);
        setMessage(null);

        const newUserInfo: UserInfo = { ...currentUserInfo, name, phone, city };
        try {
            await onUpdate(newUserInfo);
            setMessage({ type: 'success', text: 'اطلاعات شما با موفقیت بروزرسانی شد.' });
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setMessage({ type: 'error', text: 'خطا در بروزرسانی اطلاعات. لطفا مجددا تلاش کنید.' });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-parsa-gray-800">پروفایل کاربری</h3>
                        <button onClick={onClose} className="p-2 hover:bg-parsa-gray-100 rounded-full transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-2">نام و نام خانوادگی</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-2">شماره تماس</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-4 py-3 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-blue-500" placeholder="09123456789" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-2">شهر</label>
                            <select value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-4 py-3 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-blue-500 bg-white">
                                <option value="" disabled>انتخاب کنید...</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        
                        {message && (
                             <p className={`text-sm text-center p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message.text}
                            </p>
                        )}
                        
                        <div className="flex gap-4 pt-2">
                             <button type="button" onClick={onClose} disabled={isSubmitting} className="w-full bg-parsa-gray-200 text-parsa-gray-700 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors hover:bg-parsa-gray-300">
                                انصراف
                            </button>
                            <button type="submit" disabled={!isFormValid || isSubmitting} className="w-full bg-gradient-to-r from-parsa-blue-500 to-parsa-blue-600 hover:from-parsa-blue-600 hover:to-parsa-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
                                {isSubmitting ? 'در حال بروزرسانی...' : 'بروزرسانی اطلاعات'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
