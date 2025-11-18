
import React, { useEffect, useCallback, useState } from 'react';
import { Course } from '../types';
import { formatPrice } from '../utils/helpers';

interface ClassDetailsModalProps {
    course: Course;
    onClose: () => void;
    onOpenConsultation: () => void;
}

const ClassDetailsModal: React.FC<ClassDetailsModalProps> = ({ course, onClose, onOpenConsultation }) => {
    const [shareFeedback, setShareFeedback] = useState('');
    
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

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#/course/${course.slug}`;
        const shareTitle = `دوره ${course.language} ${course.level} در موسسه پارسا`;
        const shareText = `این دوره زبان ${course.language} در موسسه پارسا رو ببین!`;

        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                setShareFeedback('لینک کپی شد!');
                setTimeout(() => setShareFeedback(''), 2000);
            } catch (error) {
                setShareFeedback('خطا در کپی لینک');
                setTimeout(() => setShareFeedback(''), 2000);
            }
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-parsa-gray-200 p-6 rounded-t-2xl z-10">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {/* Image removed */}
                            <div>
                                <h3 id="course-modal-title" className="text-2xl font-bold text-parsa-brown-800">{course.language}</h3>
                                <p className="text-parsa-gray-600">{`سطح ${course.level}`}</p>
                            </div>
                        </div>
                        <button onClick={onClose} aria-label="بستن پنجره" className="p-2 hover:bg-parsa-gray-100 rounded-full transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-gradient-to-r from-parsa-brown-50 to-parsa-brown-100 p-6 rounded-xl border border-parsa-brown-200">
                        <div className="flex items-center gap-3 mb-2">
                             <svg className="w-6 h-6 text-parsa-brown-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>
                            <h4 className="text-lg font-bold text-parsa-brown-700">شهریه دوره</h4>
                        </div>
                        <p className="text-2xl font-bold text-parsa-brown-800">{formatPrice(course.price)}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="flex justify-between py-3 border-b border-parsa-gray-100"><span className="text-parsa-gray-500">نوع کلاس:</span><span className="font-medium text-parsa-gray-700">{course.type}</span></div>
                        <div className="flex justify-between py-3 border-b border-parsa-gray-100"><span className="text-parsa-gray-500">فرمت کلاس:</span><span className="font-medium text-parsa-gray-700">{course.format}</span></div>
                        <div className="flex justify-between py-3 border-b border-parsa-gray-100"><span className="text-parsa-gray-500">برنامه کلاسی:</span><span className="font-medium text-parsa-gray-700">{course.schedule}</span></div>
                        <div className="flex justify-between py-3 border-b border-parsa-gray-100"><span className="text-parsa-gray-500">وضعیت:</span><span className="font-medium text-parsa-gray-700">{course.status}</span></div>
                    </div>
                     
                    <div className="bg-parsa-gray-50 p-6 rounded-xl">
                        <h4 className="text-lg font-bold text-parsa-brown-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            توضیحات دوره
                        </h4>
                        <div className="text-parsa-gray-700 leading-relaxed space-y-2">
                             <p>{course.description}</p>
                             {course.tags.length > 0 && <div className="flex flex-wrap gap-2 pt-2">{course.tags.map(tag => <span key={tag} className="text-xs bg-parsa-gray-200 text-parsa-gray-600 px-2 py-1 rounded-full">{tag}</span>)}</div>}
                        </div>
                    </div>
                     
                    <div className="bg-gradient-to-r from-parsa-orange-50 to-parsa-orange-100 p-6 rounded-xl border border-parsa-orange-200 flex flex-wrap items-center justify-between gap-4">
                       <div>
                         <h4 className="text-lg font-bold text-parsa-orange-700 mb-2">برای ثبت‌نام و مشاوره رایگان اقدام کنید</h4>
                         <button onClick={onOpenConsultation} disabled={course.status === 'تکمیل ظرفیت'} className="bg-gradient-to-r from-parsa-orange-500 to-parsa-orange-600 hover:from-parsa-orange-600 hover:to-parsa-orange-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            {course.status === 'تکمیل ظرفیت' ? 'ظرفیت تکمیل' : 'درخواست مشاوره'}
                        </button>
                       </div>
                       <div className="relative">
                            <button onClick={handleShare} className="bg-white/80 backdrop-blur-sm border border-parsa-orange-200 text-parsa-orange-600 px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>
                                اشتراک‌گذاری
                            </button>
                            {shareFeedback && <span className="absolute -bottom-6 right-0 text-xs bg-parsa-gray-800 text-white px-2 py-1 rounded">{shareFeedback}</span>}
                       </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ClassDetailsModal);
