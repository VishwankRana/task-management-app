import axios from 'axios';
import { useEffect, useState } from 'react';

export default function TaskTile({ task }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    };

    return (
        <div className="taskTileDiv">
            <div className="w-full bg-[#e7ede5] p-4 rounded-2xl">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center">
                    <h3 className="font-[Tahoma] font-semibold">Task</h3>
                    <h3 className="font-[Tahoma] font-semibold text-center">Due Date</h3>
                    <h3 className="font-[Tahoma] font-semibold text-center">Priority</h3>
                    <h3 className="font-[Tahoma] font-semibold text-center">Status</h3>
                </div>
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 mt-5 p-1 bg-[#f3df089f] rounded-[5px] items-center">
                    <div>
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                    </div>
                    <div className="text-center">
                        <p>{formatDate(task.dueDate)}</p>
                    </div>
                    <div className="text-center">
                        <p>{task.priority}</p>
                    </div>
                    <div className="text-center">
                        <p>{task.status}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}