import React, { useState, useEffect } from 'react';
import { Course, Language } from '../types';

interface CourseFormModalProps {
    initialData: Course | null;
    onSave: (course: Course) => void;
    onClose: () => void;
    availableLanguages: Language[]; // New prop for dynamic language list
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ initialData, onSave, onClose, availableLanguages }) => {
    const [formData, setFormData] = useState<Omit<Course, 'id' | 'slug'>>({
        language: '',
        level: '',
        type: 'گروهی',
        format: 'حضوری',
        schedule: '',
        price: 0,
        status: 'شروع به زودی',
        description: '',
        tags: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Set default language if available when adding a new course
            if (availableLanguages.length > 0) {
                setFormData(prev => ({ ...prev, language: availableLanguages[0].name }));
            }
        }
    }, [initialData, availableLanguages]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseInt(value, 10) || 0 : value
        }));
    };
    
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setFormData(prev => ({ ...prev, tags }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...initialData, ...formData });
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="sticky top-0 bg-white border-b p-6 z-10">
                        <h3 className="text-xl font-bold text-parsa-brown-800">
                            {initialData ? 'ویرایش دوره' : 'افزودن دوره جدید'}
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-parsa-gray-700 mb-1">زبان</label>
                                <select name="language" value={formData.language} onChange={handleChange} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white">
                                    <option value="" disabled>انتخاب کنید...</option>
                                    {availableLanguages.map(lang => (
                                        <option key={lang.id || lang.name} value={lang.name}>{lang.name}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-parsa-gray-700 mb-1">سطح</label>
                                <input name="level" value={formData.level} onChange={handleChange} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-parsa-gray-700 mb-1">نوع کلاس</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white">
                                    <option value="گروهی">گروهی</option>
                                    <option value="خصوصی">خصوصی</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-parsa-gray-700 mb-1">فرمت کلاس</label>
                                <select name="format" value={formData.format} onChange={handleChange} className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white">
                                    <option value="حضوری">حضوری</option>
                                    <option value="آنلاین">آنلاین</option>
                                </select>
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-parsa-gray-700 mb-1">برنامه کلاسی</label>
                                <input name="schedule" value={formData.schedule} onChange={handleChange} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-parsa-gray-700 mb-1">شهریه (تومان)</label>
                                <input name="price" type="number" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">وضعیت</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white">
                                <option value="در حال ثبت نام">در حال ثبت نام</option>
                                <option value="تکمیل ظرفیت">تکمیل ظرفیت</option>
                                <option value="شروع به زودی">شروع به زودی</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">توضیحات</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500"></textarea>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">تگ‌ها (با ویرگول جدا کنید)</label>
                            <input name="tags" value={formData.tags.join(', ')} onChange={handleTagsChange} className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                        </div>
                    </div>
                    <div className="sticky bottom-0 bg-parsa-gray-50 border-t p-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-parsa-gray-200 text-parsa-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-parsa-gray-300">انصراف</button>
                        <button type="submit" className="bg-parsa-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-parsa-orange-600">ذخیره تغییرات</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseFormModal;