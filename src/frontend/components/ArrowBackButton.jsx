import Button from '@mui/material/Button';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from 'react-router-dom';

export default function ArrowBackButton() {

const navigate = useNavigate();

  return (
    <Button
      variant="text" onClick={() => navigate("/projects")} 
      sx={{
        minWidth: 0,          // removes default button width
        width: 25,
        height: 25,
        padding: 0,
        borderRadius: 1,      
        color: 'black',
        '&:hover': {
          backgroundColor: '#eeeee6',
        },
      }}
    >
      <ArrowBackRoundedIcon fontSize="small" 
          sx = {{
            width: 20,
            height: 20,
          }}
      />
    </Button>
  );
}