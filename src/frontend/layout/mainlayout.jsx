import { Outlet } from "react-router-dom";
import NewProjectModal from "./NewProjectModal";
import { useProject } from "../context/ProjectContext";

export default function MainLayout({ collapsed }) {
  const { openNewPrjModal, setOpenNewPrjModal } = useProject();

  return (
    <div
      className="min-h-screen w-full transition-all duration-300 ease-in-out bg-[#f9fafb] dark:bg-[#0f172a]"
      style={{ paddingLeft: collapsed ? "68px" : "256px" }}
    >
      <Outlet />
      <NewProjectModal
        openNewPrjModal={openNewPrjModal}
        setOpenNewPrjModal={setOpenNewPrjModal}
      />
    </div>
  );
}
