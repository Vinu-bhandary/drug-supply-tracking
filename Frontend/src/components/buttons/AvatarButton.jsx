import { useState, useRef, useEffect } from 'react';

export default function AvatarButton() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

  // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

    return (
        <div className="relative inline-block text-center ml-auto mt-2 text-grey-100" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-grey-200 shadow-sm hover:bg-slate-50"
            >
                <img src="/src/assets/avatar.png" alt="Avatar" className="h-6 w-6 rounded-full" />
                <span className="text-xs">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
                <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-slate-200 shadow-lg">
                <ul className="py-1 text-sm text-grey-200">
                    <li>
                    <button className="block w-full px-3 py-2 text-left hover:bg-slate-50">
                        Name
                    </button>
                    </li>
                    <li>
                    <button className="block w-full px-3 py-2 text-left hover:bg-slate-50">
                        Designation
                    </button>
                    </li>
                    <li>
                    <button className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50">
                        Log Out
                    </button>
                    </li>
                </ul>
                </div>
            )}
            </div>
        );
}
