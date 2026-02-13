import { useState, useRef, useEffect } from 'react';

export default function AvatarButton() {
    const [open, setOpen] = useState(false);

    const ref = useRef(null);

    const userName = localStorage.getItem('username');
    const userRole = localStorage.getItem('role');


    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    }



    return (
        <div className="relative inline-block text-center ml-auto mt-2 text-grey-100" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-grey-200 shadow-sm hover:bg-slate-50"
            >
                {/* <img src="/src/assets/avatar.png" alt="Avatar" className="h-6 w-6 rounded-full" /> */}
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {userName?.substring(0, 2)?.toUpperCase()}
                </div>
                <div className="text-sm">
                    <p className="font-semibold text-gray-100">{userName}</p>
                    <p className="text-gray-200">{userRole}</p>
                </div>
                </div>
                <span className="text-xs">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
                <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-slate-200 shadow-lg">
                <ul className="py-1 text-sm text-grey-200">
                    <li>
                    <button className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50" onClick={() => handleLogout()}>
                        Log Out
                    </button>
                    </li>
                </ul>
                </div>
            )}

            </div>
        );
}
