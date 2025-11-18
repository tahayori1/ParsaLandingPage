
import React, { useState, useCallback, useEffect } from 'react';
import { Course, UserInfo } from '../types';
import { cities } from '../constants';

interface ConsultationModalProps {
    course: Course;
    userInfo: UserInfo | null;
    onClose: () => void;
    onUpdateAndConfirm: (userInfo: UserInfo) => Promise<void>;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ course, userInfo, onClose, onUpdateAndConfirm }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const [name, setName] = useState(userInfo?.name || '');
    const [phone, setPhone] = useState(userInfo?.phone || '');
    const [city, setCity] = useState(userInfo?.city || cities[0]);
    const [formError, setFormError] = useState<string | null>(null);

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
    
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsSubmitting(true);
        setFormError(null);
        setSubmitMessage(null);

        try {
            await onUpdateAndConfirm({ name, phone, city });
            setSubmitMessage('درخواست شما با موفقیت ثبت شد. کارشناسان ما به زودی برای هماهنگی با شما تماس خواهند گرفت.');
            setTimeout(onClose, 3000);
        } catch (err) {
            setFormError('خطا در ارسال اطلاعات. لطفا مجددا تلاش کنید.');
            console.error(err);
            setIsSubmitting(false);
        }
    };
    
    return (
        <div 
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                        <h3 className="text-2xl font-bold text-parsa-gray-800">درخواست مشاوره و تعیین سطح</h3>
                        <button onClick={onClose} className="p-2 hover:bg-parsa-gray-100 rounded-full transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {!submitMessage ? (
                        <>
                            <div className="bg-parsa-blue-50 p-4 rounded-lg mb-4 border border-parsa-blue-100">
                                <h4 className="font-medium text-parsa-blue-800 mb-2">دوره انتخابی:</h4>
                                <p className="text-sm text-parsa-blue-900">{`${course.language} - سطح ${course.level} (${course.type} / ${course.format})`}</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <p className="text-parsa-gray-600 text-sm">
                                    {userInfo
                                        ? 'اطلاعات زیر برای هماهنگی استفاده خواهد شد. در صورت نیاز آن را ویرایش کنید.'
                                        : 'برای ثبت درخواست، لطفا اطلاعات خود را وارد کنید.'}
                                </p>
                                <div>
                                    <label className="block text-xs font-medium text-parsa-gray-700 mb-1">نام و نام خانوادگی</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-parsa-gray-700 mb-1">شماره تماس</label>
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-blue-500" placeholder="09123456789" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-parsa-gray-700 mb-1">شهر</label>
                                    <select value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-blue-500 bg-white">
                                        <option value="" disabled>انتخاب کنید...</option>
                                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                {formError && <p className="text-danger text-sm text-center">{formError}</p>}
                                <button type="submit" disabled={!isFormValid || isSubmitting} className="w-full bg-gradient-to-r from-parsa-teal-500 to-parsa-teal-600 hover:from-parsa-teal-600 hover:to-parsa-teal-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                    {isSubmitting ? 'در حال ارسال...' : 'ثبت و درخواست مشاوره'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className={`text-center p-4 rounded-lg ${submitMessage.includes('موفقیت') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {submitMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsultationModal;
