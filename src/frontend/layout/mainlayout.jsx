import { Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";
import NewProjectModal from "./NewProjectModal";
import { useProject } from "../context/ProjectContext";  

export default function MainLayout() {
  const { openNewPrjModal, setOpenNewPrjModal } = useProject();

  return (
    <>
    <div className="pl-64 min-h-screen w-full">
      <Outlet />
      <NewProjectModal openNewPrjModal={openNewPrjModal} setOpenNewPrjModal={setOpenNewPrjModal}/>
    </div>
    </>
  );
}