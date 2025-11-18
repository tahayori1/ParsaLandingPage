import React from 'react';
// FIX: Changed CarCondition to Course, as CarCondition is not an exported member of types.ts
import { Course } from '../types';
import { formatPrice } from '../utils/helpers';

interface RecentlyViewedProps {
    courses: Course[];
    onSelectCourse: (course: Course) => void;
}

const RecentlyViewedCourseCard: React.FC<{course: Course, onClick: () => void}> = ({ course, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white rounded-lg shadow p-3 flex items-center gap-3 cursor-pointer hover:shadow-lg transition-shadow"
    >
        <img 
            src={`/icons/lang/${encodeURIComponent(course.language)}.jpg`}
            alt={course.language}
            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
            loading="lazy"
            width="80"
            height="80"
        />
        <div className="overflow-hidden">
            <h4 className="font-bold text-sm truncate text-parsa-gray-800">{course.language} - {course.level}</h4>
            <p className="text-xs text-parsa-gray-600 truncate">{`${course.type} / ${course.format}`}</p>
            <p className="text-xs font-semibold text-parsa-teal-600 mt-1">{formatPrice(course.price)}</p>
        </div>
    </div>
);

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ courses, onSelectCourse }) => {
    return (
        <section className="py-16 bg-parsa-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 text-parsa-gray-800">بازدیدهای اخیر شما</h2>
                    <p className="text-base md:text-lg text-parsa-gray-600">دوره‌هایی که اخیراً مشاهده کرده‌اید</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {courses.map(course => (
                        <RecentlyViewedCourseCard 
                            key={course.id} 
                            course={course} 
                            onClick={() => onSelectCourse(course)} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default React.memo(RecentlyViewed);