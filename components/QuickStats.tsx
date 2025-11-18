
import React from 'react';

interface QuickStatsProps {
    languageCount: number;
    courseCount: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({ languageCount, courseCount }) => {
    return (
        <section className="py-8 -mt-16 relative z-10">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="text-center">
                            <div className="text-xl md:text-3xl font-bold text-parsa-orange-600 mb-2">{languageCount}+</div>
                            <p className="text-xs md:text-sm text-parsa-gray-500">زبان زنده دنیا</p>
                        </div>
                        <div className="text-center">
                            <div className="text-xl md:text-3xl font-bold text-parsa-orange-600 mb-2">{courseCount}</div>
                            <p className="text-xs md:text-sm text-parsa-gray-500">دوره فعال</p>
                        </div>
                        <div className="text-center">
                            <div className="text-xl md:text-3xl font-bold text-parsa-orange-600 mb-2">۵۰+</div>
                            <p className="text-xs md:text-sm text-parsa-gray-500">استاد مجرب</p>
                        </div>
                        <div className="text-center">
                             <div className="text-xl md:text-3xl font-bold text-parsa-orange-600 mb-2">۵,۰۰۰+</div>
                            <p className="text-xs md:text-sm text-parsa-gray-500">زبان‌آموز موفق</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuickStats;