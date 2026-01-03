import Button from '@mui/material/Button';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate } from 'react-router-dom';

export default function ArrowForwardButton() {

const navigate = useNavigate();

  return (
    <Button
      variant="text" onClick={() => navigate("/projects")} 
      sx={{
        minWidth: 0,          
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
      <ArrowForwardRoundedIcon fontSize="small" 
          sx = {{
            width: 20,
            height: 20,
          }}
      />
    </Button>
  );
}