
import React, { useState, useEffect } from 'react';
import { ClubMember } from '../types';

interface ClubMemberFormModalProps {
    initialData: ClubMember | null;
    onSave: (member: ClubMember) => Promise<void>;
    onClose: () => void;
}

const ClubMemberFormModal: React.FC<ClubMemberFormModalProps> = ({ initialData, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<ClubMember, 'id' | 'magic_number' | 'discount_code' | 'datetime' | 'created_at'>>({
        name: '',
        phone_number: '',
        status: '🟢فعال'
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                phone_number: initialData.phone_number,
                status: initialData.status
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // If initialData has ID, preserve it and other readonly fields for the API call
            const memberToSave: ClubMember = initialData 
                ? { ...initialData, ...formData } 
                : { ...formData };
            
            await onSave(memberToSave);
        } catch (error) {
            console.error(error);
            // Error handling is typically done in the parent or via alert
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="sticky top-0 bg-white border-b p-6 z-10">
                        <h3 className="text-xl font-bold text-parsa-brown-800">
                            {initialData ? 'ویرایش عضو باشگاه' : 'افزودن عضو جدید'}
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">نام و نام خانوادگی</label>
                            <input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">شماره تماس</label>
                            <input 
                                name="phone_number" 
                                type="tel"
                                value={formData.phone_number} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-parsa-gray-700 mb-1">وضعیت</label>
                            <select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange} 
                                className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white"
                            >
                                <option value="🟢فعال">🟢 فعال</option>
                                <option value="🔴غیرفعال">🔴 غیرفعال</option>
                            </select>
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

export default ClubMemberFormModal;
