import EditTaskModal from "../components/EditTaskModal";

export default function TaskTile({ onDelete, task, setTaskList }) {

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const priorityClass = () => {
        switch (task?.priority) {
            case 'Low':
                return 'bg-[#60a5fa] text-black border-2 border-black';
            case 'Medium':
                return 'bg-[#34d399] text-black border-2 border-black';
            case 'High':
                return 'bg-[#f9fc5d] text-black border-2 border-black';
            case 'Urgent':
                return 'bg-[#f87171] text-black border-2 border-black';
            default:
                return 'bg-transparent';
        }
    };

    return (
        <div className="taskTileDiv">
            <div className="w-full bg-[#e7ede5] rounded-2xl">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 mt-5 p-1 bg-[#d97757] rounded-[5px] items-center">
                    <div>
                        <p className="font-medium text-white">{task?.title}</p>
                        {task?.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                    </div>

                    <div className="text-center  flex justify-center">
                        <div className={`${priorityClass()} w-20 rounded-lg flex items-center justify-center`}>
                            <p>{task?.priority}</p>
                        </div>
                    </div>

                    <div className="text-center text-white">
                        <p>{task?.status}</p>
                    </div>

                    <div className="text-center text-white">
                        <p>{formatDate(task?.dueDate)}</p>
                    </div>


                        <div className="text-center text-white">
                            <p>{task?.type}</p>
                        </div>
                </div>
            </div>
        </div>
    );
}


{/* <div>
    <EditTaskModal task={task} setTaskList={setTaskList} />
</div> */}