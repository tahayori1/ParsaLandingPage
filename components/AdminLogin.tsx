import React, { useState } from 'react';

// FIX: Updated `onLogin` prop type to `Promise<boolean | string>` to fix type mismatch with `MainApp.tsx`.
interface AdminLoginProps {
    onLogin: (username: string, password: string) => Promise<boolean | string>;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // FIX: Updated `handleSubmit` to correctly handle a string return value from `onLogin` as an error message.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        const result = await onLogin(username, password);
        if (result !== true) {
            setError(typeof result === 'string' ? result : 'نام کاربری یا رمز عبور نامعتبر است.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-parsa-gray-100">
            <div className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-sm">
                <div className="text-center mb-6">
                    <img src="https://parsa-li.com/wp-content/uploads/sites/158/2024/04/logo.png" alt="Parsa Institute" className="h-20 w-auto mx-auto mb-4"/>
                    <h1 className="text-2xl font-bold text-parsa-brown-800">ورود به پنل مدیریت</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-parsa-gray-700 mb-2">نام کاربری</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-parsa-gray-700 mb-2">رمز عبور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-parsa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parsa-orange-500"
                            required
                        />
                    </div>
                    {error && <p className="text-danger text-sm text-center">{error}</p>}
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-parsa-orange-500 to-parsa-orange-600 hover:from-parsa-orange-600 hover:to-parsa-orange-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'در حال ورود...' : 'ورود'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;