import React from 'react';
export default function DemoHome() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-slate-100">
            <h1 className="text-4xl font-bold mb-8 text-blue-500">Welcome to the Drug Supply Tracking System</h1>
            <p className="text-lg text-blue-300 mb-4">
                This is a demo home page. Use the navigation to explore different dashboards.
            </p>
            <button type="button" onClick={() => window.location.href = "/admin/dashboard"}>
                Go to Admin Dashboard
            </button>
            <button type="button" onClick={() => window.location.href = "/hospital/dashboard"}>
                Go to Hospital Dashboard
            </button>
            <button type="button" onClick={() => window.location.href = "/vendor/dashboard"}>
                Go to Vendor Dashboard
            </button>
        </div>
    );
}