// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DefaultPalette from 'src/@core/theme/palette';
import { Button } from '@mui/material';

// Import DefaultPalette function

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const ModeColor = () => {
  const [tencolor, setColors] = useState<string>('#F8D7DA');


  // Define state and functions
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  // Function to handle color change
  const handleColorChange = (color: string) => {
    setColors(color);
  }

  // Render ModeColor component
  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <ColorLensIcon />
      </IconButton>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <StyledMenuItem disableRipple>
          <Typography sx={{ fontWeight: 600 }}>Color</Typography>
        </StyledMenuItem>
        <StyledMenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Button variant='contained' sx={{ width: '100%', backgroundColor: '#F8D7DA' }} onClick={() => handleColorChange('#F8D7DA')}></Button>
          <Button variant='contained' sx={{ width: '100%', backgroundColor: '#F1DEEE' }} onClick={() => handleColorChange('#F1DEEE')}></Button>
          <Button variant='contained' sx={{ width: '100%', backgroundColor: '#B3DBD8' }} onClick={() => handleColorChange('#B3DBD8')}></Button>
          <Button variant='contained' sx={{ width: '100%', backgroundColor: '#F898A4' }} onClick={() => handleColorChange('#F898A4')}></Button>
          <Button variant='contained' sx={{ width: '100%', backgroundColor: '#E3EBFD' }} onClick={() => handleColorChange('#E3EBFD')}></Button>
        </StyledMenuItem>
      </StyledMenu>
    </Fragment>
  );
};

export default ModeColor;
