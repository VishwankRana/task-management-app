import DeleteTaskBtn from "../components/deleteTaskBtn";
import EditTaskBtn from "../components/EditTaskBtn";


export default function TaskTile({ task }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    };

    return (
        <div className="taskTileDiv">
            <div className="w-full bg-[#e7ede5] rounded-2xl">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 mt-5 p-1 bg-[#d97757] rounded-[5px] items-center">
                    <div>
                        <p className="font-medium text-white">{task.title}</p>
                        {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                    </div>
                    <div className="text-center text-white">
                        <p>{formatDate(task.dueDate)}</p>
                    </div>
                    <div className="text-center text-white">
                        <p>{task.priority}</p>
                    </div>
                    <div className="text-center text-white">
                        <p>{task.status}</p>
                    </div>

                    <div>
                        <DeleteTaskBtn />
                    </div>

                    <div>
                        <EditTaskBtn />
                    </div>
                </div>
            </div>
        </div>
    )
}