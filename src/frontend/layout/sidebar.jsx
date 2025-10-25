import Button from '@mui/material/Button';

export default function Sidebar({ children }) {
    return (

        <aside className="w-64 bg-[#F1FAEE] rounded-xl shadow-lg overflow-y-auto">
            <div className="">
                <div className="mb-8 text-[30px] font-[1000]   text-[#1D3557] p-6">Just do it.</div>
                <nav>
                    <Button variant="contained"
                        sx={{
                            width: '100%',
                            background: '#d97757'
                        }}

                    >My Tasks</Button>
                </nav>
            </div>
        </aside>

    );
}


