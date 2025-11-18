import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { UserInfo, ChatMessage } from '../types';
import { cities, languages } from '../constants';

interface ChatbotProps {
    userInfo: UserInfo | null;
    onUpdateUserInfo: (info: UserInfo) => Promise<void>;
}

const Chatbot: React.FC<ChatbotProps> = ({ userInfo, onUpdateUserInfo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    // Form state for when userInfo is not present
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState(cities[0]);
    const [courseOfInterest, setCourseOfInterest] = useState('');
    const [formError, setFormError] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isTyping]);
    
    useEffect(() => {
        if (isOpen && !userInfo) {
            setMessages([]);
        } else if (isOpen && userInfo && messages.length === 0) {
             const welcomeText = userInfo.courseOfInterest
                ? `سلام ${userInfo.name} عزیز! در خصوص دوره‌های زبان ${userInfo.courseOfInterest} در خدمتم. چه سوالی دارید؟`
                : `سلام ${userInfo.name} عزیز! چطور میتونم کمکتون کنم؟`;
            setMessages([{ sender: 'bot', text: welcomeText, timestamp: Date.now() }]);
        }
    }, [isOpen, userInfo, messages.length]);


    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !city || !courseOfInterest) {
            setFormError('لطفا تمام فیلدها را پر کنید.');
            return;
        }
        setFormError('');
        const newUserInfo: UserInfo = { name, phone, city, courseOfInterest };
        try {
            await onUpdateUserInfo(newUserInfo);
            setMessages([
                { sender: 'bot', text: `سلام ${name} عزیز! در خصوص دوره‌های ${courseOfInterest} در خدمتم. چه سوالی دارید؟`, timestamp: Date.now() }
            ]);
        } catch (error) {
            setFormError('خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.');
        }
    };
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem('message') as HTMLInputElement;
        const text = input.value.trim();
        if (!text || !userInfo) return;

        const newMessage: ChatMessage = { sender: 'user', text, timestamp: Date.now() };
        setMessages(prev => [...prev, newMessage]);
        input.value = '';
        setIsTyping(true);

        // Simulate API call to a mock backend
        setTimeout(() => {
            const botReply: ChatMessage = { 
                sender: 'bot', 
                text: 'از پیام شما متشکریم. یکی از کارشناسان ما به زودی پاسخ شما را خواهد داد. برای اطلاعات فوری در مورد شهریه و زمانبندی کلاس‌ها، لطفا با شماره موسسه تماس بگیرید.', 
                timestamp: Date.now() 
            };
            setMessages(prev => [...prev, botReply]);
            setIsTyping(false);
        }, 1500);
    };
    
    const chatbotUI = (
        <>
            <div className="fixed bottom-4 right-4 z-[120]">
                 <button onClick={() => setIsOpen(!isOpen)} className="bg-gradient-to-r from-parsa-orange-500 to-parsa-orange-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                     {isOpen ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                     ) : (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                     )}
                </button>
            </div>
            <div className={`fixed bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-[350px] h-[65vh] sm:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col origin-bottom-right z-[120] transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-parsa-brown-800 text-white rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <img src="https://parsa-li.com/wp-content/uploads/sites/158/2024/04/logo.png" alt="Logo" className="w-10 h-10 bg-white p-1 rounded-md" />
                        <div>
                            <h3 className="font-bold">مشاور آنلاین پارسا</h3>
                            <p className="text-xs opacity-80">معمولا سریع پاسخ می‌دهیم</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Body */}
                {userInfo ? (
                    <>
                        <div className="flex-1 p-4 overflow-y-auto bg-parsa-gray-50">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'user' ? (
                                        <div className="max-w-[80%] p-3 rounded-2xl text-sm break-words bg-parsa-orange-500 text-white rounded-br-none">
                                            {msg.text}
                                        </div>
                                    ) : (
                                        <div 
                                            className="max-w-[80%] p-3 rounded-2xl text-sm break-words bg-parsa-gray-200 text-parsa-gray-800 rounded-bl-none chat-bubble-bot"
                                            dangerouslySetInnerHTML={{ __html: msg.text }}
                                        />
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="p-3 rounded-2xl bg-parsa-gray-200 rounded-bl-none">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-parsa-gray-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                                            <span className="w-2 h-2 bg-parsa-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                            <span className="w-2 h-2 bg-parsa-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-parsa-gray-200 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <input name="message" type="text" placeholder="پیام خود را بنویسید..." className="flex-1 px-4 py-2 border border-parsa-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                                <button type="submit" className="bg-parsa-orange-500 text-white p-3 rounded-full hover:bg-parsa-orange-600 transition-colors flex-shrink-0">
                                    <svg className="w-5 h-5 -rotate-45" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="p-6 overflow-y-auto">
                        <h4 className="font-bold text-center mb-1">فرم اطلاعات</h4>
                        <p className="text-center text-sm text-parsa-gray-500 mb-4">برای شروع گفتگو، لطفا اطلاعات زیر را تکمیل کنید.</p>
                        <form onSubmit={handleFormSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-parsa-gray-700 mb-1">نام و نام خانوادگی</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-parsa-gray-700 mb-1">شماره تماس</label>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500" placeholder="09123456789" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-parsa-gray-700 mb-1">زبان مورد علاقه</label>
                                <select value={courseOfInterest} onChange={(e) => setCourseOfInterest(e.target.value)} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white">
                                    <option value="" disabled>انتخاب کنید...</option>
                                    {languages.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-parsa-gray-700 mb-1">شهر</label>
                                <select value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-3 py-2 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500 bg-white">
                                    <option value="" disabled>انتخاب کنید...</option>
                                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            {formError && <p className="text-danger text-xs text-center">{formError}</p>}
                            <button type="submit" className="w-full bg-gradient-to-r from-parsa-orange-500 to-parsa-orange-600 text-white py-3 rounded-lg font-medium">
                                شروع گفتگو
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );

    return createPortal(chatbotUI, document.body);
};

export default React.memo(Chatbot);