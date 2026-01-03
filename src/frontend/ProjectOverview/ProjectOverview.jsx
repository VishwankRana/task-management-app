import Button from '@mui/material/Button';
import ProjectOverviewTile from "./projectOverviewTile"
import ArrowForwardButton from "../components/ArrowForwardButton"


export default function ProjectOverview() {
    return (
        <div className='bg-[#F2EBCA] h-[23em] w-[48em] flex flex-col rounded-xl border-2 border-black'>
            <div className='p-3 border-b-2 border-black flex justify-between items-center'>
                <h1 className='text-[20px]'>Project Overview</h1>
                <h1>View all projects <ArrowForwardButton/></h1>
            </div>

            <div className='w-full h-full p-3'>
                {/* <Button variant="contained"
                    sx={{ background: "#d97757" }}
                >
                    Create your first Project
                </Button> */}
                <ProjectOverviewTile/>
            </div>
        </div>

    )

}