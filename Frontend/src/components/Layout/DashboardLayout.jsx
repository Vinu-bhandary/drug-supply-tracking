import React from 'react';
import Sidebar from './Sidebar'
import Topbar from './Topbar';

export default function DashboardLayout({ children, dashboardTitle, dashboardSubtitle, userRole, userName }) {
    return (
        <div className="grid grid-cols-[1fr_5fr] min-h-screen">

            <Sidebar /> 


            <div className="flex-1 flex flex-col overflow-hidden">

                <Topbar 
                title={dashboardTitle} 
                subtitle={dashboardSubtitle}
                userRole={userRole}
                userName={userName}
                />

                <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
                {children}
                </main>
            </div>
        </div>
    );
}
