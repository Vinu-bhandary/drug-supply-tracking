import SideBar from './SideBar';
import Topbar from './Topbar';
import EditButton from '../buttons/EditButton';
export default function DashboardLayout({ children , title , sideBarItems }) {
    return (
        <div className="grid grid-cols-[1fr_5fr] min-h-screen">
            <SideBar items={sideBarItems}/>
            <div className="flex flex-col min-h-screen">
                <Topbar title={title}/>
                <main className="flex flex-col p-6 bg-gray-100 min-h-screen gap-6">
                    <div className="flex flex-row p-6 bg-gray-100 min-h-screen gap-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
