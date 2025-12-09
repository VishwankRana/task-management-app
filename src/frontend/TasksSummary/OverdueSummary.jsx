export default function OverdueSummary() {
    return (
        <div>
            <div className="bg-[#F2EBCA] border-2 border-black w-[20em] h-[8em] rounded-xl">
                <div className="border-b-2 border-black">
                    <h1 className="pl-5" >Overdue</h1>
                </div>

                <div className="flex justify-center items-center h-[6em]">
                    <p>No Overdue</p>
                </div>

            </div>
        </div>
    );
}