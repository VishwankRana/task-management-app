import RecentActivityTile from "./RecentActivityTile"

export default function RecentActivity() {
    return (
        <div className='bg-[#F2EBCA] min-h-[23em] w-[48em] flex flex-col rounded-xl border-2 border-black mt-8'>
            <div className='p-3 border-b-2 border-black flex justify-between items-center'>
                <h1 className='text-[20px]'>Recent Activity</h1>
            </div>

            <div className='w-full h-full p-3'>
                <RecentActivityTile/>
            </div>
        </div>

    )

}