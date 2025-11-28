
import React, { useState } from 'react';
import { Language } from '../types';

interface BulkEditCourseModalProps {
    count: number;
    languages: Language[];
    onSave: (updates: { language?: string; type?: string; format?: string; status?: string }) => void;
    onClose: () => void;
}

const BulkEditCourseModal: React.FC<BulkEditCourseModalProps> = ({ count, languages, onSave, onClose }) => {
    const [updates, setUpdates] = useState({
        language: '',
        type: '',
        format: '',
        status: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdates(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Filter out empty values (no change)
        const finalUpdates: any = {};
        if (updates.language) finalUpdates.language = updates.language;
        if (updates.type) finalUpdates.type = updates.type;
        if (updates.format) finalUpdates.format = updates.format;
        if (updates.status) finalUpdates.status = updates.status;
        
        onSave(finalUpdates);
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="sticky top-0 bg-white border-b p-6 z-10 rounded-t-2xl">
                        <h3 className="text-xl font-bold text-parsa-brown-800">
                            ویرایش گروهی ({count} دوره)
                        </h3>
                        <p className="text-sm text-parsa-gray-600 mt-1">
                            فقط فیلد‌هایی که تغییر می‌دهید اعمال خواهند شد.
                        </p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">تغییر زبان</label>
                            <select name="language" value={updates.language} onChange={handleChange} className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white">
                                <option value="">(بدون تغییر)</option>
                                {languages.map(lang => (
                                    <option key={lang.id || lang.name} value={lang.name}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">تغییر نوع کلاس</label>
                            <select name="type" value={updates.type} onChange={handleChange} className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white">
                                <option value="">(بدون تغییر)</option>
                                <option value="گروهی">گروهی</option>
                                <option value="خصوصی">خصوصی</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">تغییر فرمت کلاس</label>
                            <select name="format" value={updates.format} onChange={handleChange} className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white">
                                <option value="">(بدون تغییر)</option>
                                <option value="حضوری">حضوری</option>
                                <option value="آنلاین">آنلاین</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">تغییر وضعیت</label>
                            <select name="status" value={updates.status} onChange={handleChange} className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white">
                                <option value="">(بدون تغییر)</option>
                                <option value="در حال ثبت نام">در حال ثبت نام</option>
                                <option value="تکمیل ظرفیت">تکمیل ظرفیت</option>
                                <option value="شروع به زودی">شروع به زودی</option>
                            </select>
                        </div>
                    </div>
                    <div className="sticky bottom-0 bg-parsa-gray-50 border-t p-4 flex justify-end gap-3 rounded-b-2xl">
                        <button type="button" onClick={onClose} className="bg-parsa-gray-200 text-parsa-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-parsa-gray-300">انصراف</button>
                        <button type="submit" className="bg-parsa-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-parsa-orange-600">اعمال تغییرات</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BulkEditCourseModal;
