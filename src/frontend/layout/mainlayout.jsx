import Sidebar from "./sidebar";
import NewTaskModal from "../components/modal";

export default function MainLayout({ children }) {
    return (
        <div className="flex h-screen p-5 gap-5 bg-gray-50">
            <Sidebar />
            <main className="flex-1 bg-[#F1FAEE] rounded-xl shadow-lg overflow-y-auto p-6">
                {children}
                <NewTaskModal />
            </main>
        </div>
    );
}