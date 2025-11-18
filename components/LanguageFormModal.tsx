
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageFormModalProps {
    initialData: Language | null;
    onSave: (language: Language) => Promise<void>;
    onClose: () => void;
}

const LanguageFormModal: React.FC<LanguageFormModalProps> = ({ initialData, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Language, 'id' | 'courseCount'>>({
        name: '',
        description: '',
        image: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave({ ...initialData, ...formData });
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="sticky top-0 bg-white border-b p-6 z-10">
                        <h3 className="text-xl font-bold text-parsa-brown-800">
                            {initialData ? 'ویرایش زبان' : 'افزودن زبان جدید'}
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">نام زبان</label>
                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">توضیحات کوتاه (برای کارت)</label>
                            <input name="description" value={formData.description} onChange={handleChange} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">آدرس URL تصویر</label>
                            <input name="image" value={formData.image} onChange={handleChange} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                        </div>
                    </div>
                    <div className="sticky bottom-0 bg-parsa-gray-50 border-t p-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-parsa-gray-200 text-parsa-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-parsa-gray-300">انصراف</button>
                        <button type="submit" disabled={isSaving} className="bg-parsa-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-parsa-orange-600 disabled:opacity-50">
                            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LanguageFormModal;
