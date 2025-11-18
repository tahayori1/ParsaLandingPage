
import React from 'react';
import type { Course } from '../types';
import { formatPrice } from '../utils/helpers';

interface ClassCardProps {
    course: Course;
    onSelectCourse: (course: Course) => void;
    onRequestConsultation: (course: Course) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ course, onSelectCourse, onRequestConsultation }) => {
    const isUrgent = course.status === 'در حال ثبت نام';

    const statusColors = {
        'در حال ثبت نام': 'bg-green-100 text-green-800 border-green-200',
        'شروع به زودی': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'تکمیل ظرفیت': 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <div className="flex flex-col bg-white rounded-xl shadow-lg p-4 relative transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-2xl animate-fade-in">
            {/* Reorganized top section for status, title, and type/format */}
            <div className="flex flex-col mb-4">
                <div className={`self-start px-2 py-1 rounded-full text-xs font-medium border mb-2 ${statusColors[course.status]}`}>
                    {course.status}
                </div>
                <h3 className="text-lg font-bold text-parsa-brown-800 mb-2 truncate">{course.language} - {course.level}</h3>
                <div className="flex items-center gap-2 text-xs text-parsa-gray-500">
                    <span className="bg-parsa-brown-100 text-parsa-brown-700 px-2 py-0.5 rounded-full">{course.type}</span>
                    <span className="bg-parsa-orange-100 text-parsa-orange-700 px-2 py-0.5 rounded-full">{course.format}</span>
                </div>
            </div>

            <div className="space-y-2 text-sm text-parsa-gray-600 mb-4 flex-grow">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-parsa-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>{course.schedule}</span>
                </div>
                 <div className="flex items-center gap-2">
                     <svg className="w-4 h-4 text-parsa-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>
                    <span>شهریه: <strong>{formatPrice(course.price)}</strong></span>
                </div>
            </div>

            <div>
                <button
                    onClick={() => onRequestConsultation(course)}
                    className={`w-full text-white py-2.5 rounded-lg font-medium hover:shadow-lg transition-all text-sm block text-center ${
                        isUrgent ? 'bg-gradient-to-r from-parsa-orange-500 to-parsa-orange-600 hover:from-parsa-orange-600 hover:to-parsa-orange-700' : 'bg-gradient-to-r from-parsa-brown-600 to-parsa-brown-700 hover:from-parsa-brown-700 hover:to-parsa-brown-800'
                    }`}
                    disabled={course.status === 'تکمیل ظرفیت'}
                >
                    {course.status === 'تکمیل ظرفیت' ? 'ظرفیت تکمیل' : 'مشاوره و ثبت‌نام'}
                </button>
                <button
                    onClick={() => onSelectCourse(course)}
                    className="w-full text-center mt-3 text-parsa-brown-600 hover:text-parsa-brown-700 font-medium text-sm transition-colors"
                >
                    مشاهده جزئیات
                </button>
            </div>
        </div>
    );
};

export default ClassCard;
