import Button from '@mui/material/Button';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function ArrowBackButton() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <Button
      variant="text"
      onClick={() => navigate("/projects")}
      sx={{
        minWidth: 0,
        width: 25,
        height: 25,
        padding: 0,
        borderRadius: 1,
        color: isDark ? 'white' : 'black',
        '&:hover': {
          backgroundColor: isDark ? '#334155' : '#eeeee6',
        },
      }}
    >
      <ArrowBackRoundedIcon fontSize="small" sx={{ width: 20, height: 20 }} />
    </Button>
  );
}
