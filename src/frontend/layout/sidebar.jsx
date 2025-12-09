import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom"

export default function Sidebar() {
    const navigate = useNavigate();

    return (

        <aside className="w-64 bg-[#F1FAEE] rounded-xl shadow-lg overflow-y-auto">
            <div className="">
                <div className="mb-8 text-[30px] font-[1000]   text-[#1D3557] p-6">Just do it.</div>
                <nav className='p-2'>
                    <Button variant="contained"
                    onClick={() => navigate("/")}
                        sx={{
                            width: '100%',
                            background: '#d97757',
                            marginBottom: '10px'
                        }}

                    >Dashboard</Button>

                    <Button variant="contained"
                        onClick={() => navigate("/projects")}
                        sx={{
                            width: '100%',
                            background: '#d97757'
                        }}

                    >Projects</Button>
                </nav>
            </div>
        </aside >

    );
}


