
import React, { useState, useEffect, useCallback } from 'react';
import { CLUB_PARTNERS } from '../constants';
import * as api from '../utils/api';

interface ClubModalProps {
    onClose: () => void;
}

type Tab = 'partners' | 'auth';
type AuthMode = 'register' | 'login' | 'verify';

const ClubModal: React.FC<ClubModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('partners');
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    
    // Form States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [code, setCode] = useState('');
    
    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [verifyResult, setVerifyResult] = useState<string | null>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            await api.registerClubUser({ first_name: firstName, last_name: lastName, mobile });
            setMessage({ type: 'success', text: 'ثبت‌نام با موفقیت انجام شد. اکنون می‌توانید کد تخفیف دریافت کنید.' });
            setTimeout(() => {
                setAuthMode('login');
                setMessage(null);
            }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: 'خطا در ثبت‌نام. ممکن است قبلاً ثبت‌نام کرده باشید.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            await api.requestClubCode(mobile);
            setAuthMode('verify');
            setMessage({ type: 'success', text: 'کد تایید برای شما پیامک شد.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'خطا در ارسال کد. لطفا شماره موبایل را بررسی کنید.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            const result = await api.verifyClubCode(mobile, code);
            setVerifyResult(result);
        } catch (error) {
            setMessage({ type: 'error', text: 'کد وارد شده اشتباه است یا منقضی شده.' });
        } finally {
            setIsLoading(false);
        }
    };

    const resetAuth = () => {
        setAuthMode('login');
        setMessage(null);
        setVerifyResult(null);
        setCode('');
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="bg-parsa-brown-800 text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-parsa-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            باشگاه زبان‌آموزان پارسا
                        </h2>
                        <p className="text-parsa-orange-200 text-sm mt-1 hidden md:block">تخفیف‌های ویژه برای اعضای خانواده پارسا</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button 
                        onClick={() => setActiveTab('partners')} 
                        className={`flex-1 py-4 font-semibold text-sm md:text-base transition-colors ${activeTab === 'partners' ? 'text-parsa-orange-600 border-b-2 border-parsa-orange-600 bg-orange-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        فروشگاه‌های طرف قرارداد
                    </button>
                    <button 
                        onClick={() => setActiveTab('auth')} 
                        className={`flex-1 py-4 font-semibold text-sm md:text-base transition-colors ${activeTab === 'auth' ? 'text-parsa-orange-600 border-b-2 border-parsa-orange-600 bg-orange-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        عضویت / دریافت کد
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-parsa-gray-50">
                    
                    {/* Tab: Partners */}
                    {activeTab === 'partners' && (
                        <div className="space-y-4">
                            <p className="text-parsa-gray-600 text-sm md:text-base text-center mb-4">
                                اعضای باشگاه زبان آموزان موسسه زبان پارسا میتوانند با ارائه کد تخفیف، از فروشگاه های زیر خرید کنند.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {CLUB_PARTNERS.map((partner, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-parsa-brown-800">{partner.name}</h3>
                                            <span className="bg-parsa-orange-100 text-parsa-orange-700 text-xs font-bold px-2 py-1 rounded-full">{partner.discount}</span>
                                        </div>
                                        {partner.address && (
                                            <p className="text-xs text-gray-500 flex items-start gap-1 mt-2">
                                                <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {partner.address}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <button onClick={() => setActiveTab('auth')} className="text-parsa-orange-600 hover:underline font-medium text-sm">
                                    برای دریافت کد تخفیف اینجا کلیک کنید
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab: Auth */}
                    {activeTab === 'auth' && (
                        <div className="max-w-sm mx-auto">
                            {message && (
                                <div className={`p-3 rounded-lg text-sm mb-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {message.text}
                                </div>
                            )}

                            {verifyResult ? (
                                <div className="text-center bg-white p-6 rounded-xl shadow-sm">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-parsa-brown-800 mb-2">نتیجه بررسی</h3>
                                    <p className="text-parsa-gray-800 font-medium mb-6 border-b border-dashed pb-4 border-gray-300">
                                        {verifyResult}
                                    </p>
                                    <button onClick={resetAuth} className="text-parsa-orange-600 hover:text-parsa-orange-800 font-medium">
                                        بازگشت و دریافت کد جدید
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Login / Get Code Mode */}
                                    {authMode === 'login' && (
                                        <form onSubmit={handleRequestCode} className="space-y-4">
                                            <div className="text-center mb-6">
                                                <p className="text-parsa-gray-600 text-sm">برای دریافت کد تخفیف، شماره موبایل خود را وارد کنید.</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-parsa-gray-700 mb-2">شماره موبایل</label>
                                                <input 
                                                    type="tel" 
                                                    value={mobile} 
                                                    onChange={e => setMobile(e.target.value)} 
                                                    className="w-full px-4 py-3 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 text-center text-lg tracking-wider"
                                                    placeholder="09xxxxxxxxx"
                                                    required
                                                />
                                            </div>
                                            <button type="submit" disabled={isLoading} className="w-full bg-parsa-orange-500 text-white py-3 rounded-lg font-bold hover:bg-parsa-orange-600 transition-colors disabled:opacity-50">
                                                {isLoading ? 'در حال ارسال...' : 'دریافت کد تخفیف'}
                                            </button>
                                            <div className="text-center pt-4 border-t border-gray-200">
                                                <span className="text-sm text-gray-500">عضو نیستید؟ </span>
                                                <button type="button" onClick={() => { setAuthMode('register'); setMessage(null); }} className="text-parsa-orange-600 font-medium text-sm hover:underline">ثبت‌نام در باشگاه</button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Register Mode */}
                                    {authMode === 'register' && (
                                        <form onSubmit={handleRegister} className="space-y-4">
                                            <div className="text-center mb-6">
                                                <p className="text-parsa-gray-600 text-sm">فرم ثبت‌نام در باشگاه زبان‌آموزان</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-parsa-gray-700 mb-1">نام</label>
                                                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full px-4 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-parsa-gray-700 mb-1">نام خانوادگی</label>
                                                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full px-4 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-parsa-gray-700 mb-1">شماره موبایل</label>
                                                <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} required placeholder="09xxxxxxxxx" className="w-full px-4 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                                            </div>
                                            <button type="submit" disabled={isLoading} className="w-full bg-parsa-brown-600 text-white py-3 rounded-lg font-bold hover:bg-parsa-brown-700 transition-colors disabled:opacity-50">
                                                {isLoading ? 'در حال ثبت...' : 'ثبت‌نام'}
                                            </button>
                                            <div className="text-center pt-2">
                                                <button type="button" onClick={() => { setAuthMode('login'); setMessage(null); }} className="text-parsa-gray-500 text-sm hover:text-parsa-gray-700">بازگشت به ورود</button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Verify Mode */}
                                    {authMode === 'verify' && (
                                        <form onSubmit={handleVerifyCode} className="space-y-4">
                                            <div className="text-center mb-4">
                                                <p className="text-parsa-gray-600 text-sm">کد ارسال شده به {mobile} را وارد کنید.</p>
                                            </div>
                                            <div>
                                                <input 
                                                    type="text" 
                                                    value={code} 
                                                    onChange={e => setCode(e.target.value)} 
                                                    className="w-full px-4 py-3 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 text-center text-2xl tracking-widest font-bold"
                                                    placeholder="- - - - -"
                                                    maxLength={6}
                                                    required
                                                />
                                            </div>
                                            <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50">
                                                {isLoading ? 'در حال بررسی...' : 'تایید کد'}
                                            </button>
                                            <div className="text-center pt-2">
                                                <button type="button" onClick={() => { setAuthMode('login'); setMessage(null); }} className="text-parsa-gray-500 text-sm hover:text-parsa-gray-700">تغییر شماره</button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClubModal;