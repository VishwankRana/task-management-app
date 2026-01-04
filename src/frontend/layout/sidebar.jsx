import Button from "@mui/material/Button";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import { useNavigate } from "react-router-dom";
export default function Sidebar() {
    const navigate = useNavigate();

    return (

        <aside className="w-64 border-black border-r-2 h-screen fixed top-0 left-0">
                <div className="mb-8 text-[30px] font-[1000] text-[#1D3557] p-6">Just do it.</div>
                <nav className='p-2'>
                    
                    <Button
          variant="contained"
          startIcon={<DashboardRoundedIcon />}
          onClick={() => navigate("/")}
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            gap: "8px",
            textTransform: "none",
            fontWeight: 700,
            backgroundColor: "#d97757",
            borderRadius: "10px",
            marginBottom: "10px",
            boxShadow: "0 4px 10px rgba(217,119,87,0.25)",
            "&:hover": {
              backgroundColor: "#c76546",
              boxShadow: "0 6px 14px rgba(217,119,87,0.35)",
            },
          }}
        >
          Dashboard
        </Button>

                    <Button
          variant="contained"
          startIcon={<FolderRoundedIcon />}
          onClick={() => navigate("/projects")}
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            gap: "8px",
            textTransform: "none",
            fontWeight: 700,
            backgroundColor: "#d97757",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(217,119,87,0.25)",
            "&:hover": {
              backgroundColor: "#c76546",
              boxShadow: "0 6px 14px rgba(217,119,87,0.35)",
            },
          }}
        >
          Projects
        </Button>
                </nav>
        </aside >

    );
}


