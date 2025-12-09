export default function InProgressSummary() {
    return (
        <div>
            <div className="bg-[#F2EBCA] border-2 border-black w-[20em] h-[8em] rounded-xl">
                <div className="border-b-2 border-black">
                    <h1 className="pl-5">In Progress</h1>
                </div>

                <div className="flex justify-center items-center h-[6em]">
                    <p>No In Progress</p>
                </div>

            </div>
        </div>
    );
}