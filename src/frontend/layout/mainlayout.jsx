import Sidebar from "./sidebar";

import TaskList from "../components/TaskList";
import Stack from '@mui/material/Stack';

export default function MainLayout({ children }) {
    return (
        <div className="flex h-screen p-5 gap-5 bg-gray-50">
            <Sidebar />

            <main className="flex-1 bg-[#F1FAEE] rounded-xl shadow-lg overflow-y-auto p-6">
                <Stack spacing={3}>
                    {children}
                    <TaskList />
                </Stack>

            </main>
        </div>
    );
}