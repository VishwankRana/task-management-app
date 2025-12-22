import { Outlet } from "react-router-dom";
import NewProjectModal from "./NewProjectModal";
import { useProject } from "../context/ProjectContext";  

export default function MainLayout() {
  // Get modal state from context
  const { openNewPrjModal, setOpenNewPrjModal } = useProject();

  return (
    <>
      <main className="flex-1 bg-[#fbf8f5] rounded-xl shadow-lg overflow-y-auto p-10">
        <Outlet />
      </main>

      <NewProjectModal openNewPrjModal={openNewPrjModal} setOpenNewPrjModal={setOpenNewPrjModal}/>
    </>
  );
}