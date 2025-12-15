import Button from '@mui/material/Button';
import { useProject } from '../context/ProjectContext';


export default function NewProjectBtn({openNewPrjModal}) {


    const { setOpenNewPrjModal } = useProject();

    return (
        <Button variant="contained"
                 onClick={() => setOpenNewPrjModal(true)}
            sx={{
                background: "#d97757",
            }}


        > New Project</Button >
    );
}