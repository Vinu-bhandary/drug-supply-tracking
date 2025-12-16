// src/pages/Login.jsx
import { useState } from 'react';

const API = 'http://127.0.0.1:8000/api';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        role: 'hospital',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
        const response = await fetch(API+'/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (!response.ok) {
            throw new Error('Login failed. Please try again.');
        }

        const res = await response.json();
        const data = res.data;
        console.log('Login successful:', data);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('role', data.role);
        localStorage.setItem('location_id', data.location_id);
        console.log(data.role);
        if (data.role === form.role) {
            if (form.role === 'hospital') {
                window.location.href = '/hospital/dashboard';
            } else if (form.role === 'vendor') {
                window.location.href = '/vendor/dashboard';
            } else {
                window.location.href = '/admin/dashboard';
            }
        } else {
            throw new Error('Selected role does not match user role.');
        }
        
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">

            <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white text-2xl">
                💊
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Drug Supply Portal</h1>
            <p className="mt-1 text-sm text-slate-500">
                Sign in to access your dashboard
            </p>
            </div>


            {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
            </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-4">

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                Login as
                </label>
                <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                <option value="hospital">Hospital</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
                </select>
            </div>


            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
                </label>
                <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                placeholder="you@example.com"
                />
            </div>

            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
                </label>
                <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
                />
            </div>


            <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600">
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
                </label>
                <button
                type="button"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => console.log('forgot password')}
                >
                Forgot password?
                </button>
            </div>

            
            <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? 'Signing in…' : 'Sign in'}
            </button>
            </form>

            
            <p className="mt-4 text-center text-xs text-slate-400">
            Access is restricted to approved users. Contact admin for accounts.
            </p>
        </div>
        </div>
    );
}
