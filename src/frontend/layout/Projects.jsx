import NewProjectBtn from "../components/NewProjectBtn"
import Stack from "@mui/material/Stack";
import NewProjectModal from "./NewProjectModal"

export default function ProjectLayout() {
    return (
      <Stack spacing={3} alignItems="flex-start">

            <h1 className="text-[30px] font-[1000]   text-[#1D3557]">Projects</h1>
            <NewProjectBtn />
    </Stack>
    )
}