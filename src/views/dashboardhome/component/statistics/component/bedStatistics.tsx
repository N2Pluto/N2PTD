import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import { useSpring, animated } from '@react-spring/web';

const CardBedStatistics = () => {
  const [bed, setBed] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const response = await fetch('/api/statistics/bed', {
          method: 'GET',
        });
        const data = await response.json();
        setBed(data);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching round profile:', error);
      }
    };
    fetchUserdata();
  }, []);

  const bedFree = bed.filter((b: any) => b.bed_status === true).length;
  const bedOccupied = bed.filter((b: any) => b.bed_status === false).length;

  const fadeIn = useSpring({
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
  });

  return (
    <animated.div style={fadeIn}>
      <Card
        sx={{
          border: 0,
          boxShadow: 0,
          color: 'common.white',
          backgroundColor: 'pink',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CardContent
          sx={{
            padding: (theme) => `${theme.spacing(3.25, 5, 4.5)} !important`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant='h5'
            sx={{ display: 'flex', marginBottom: 2, alignItems: 'center', color: 'common.white' }}
          >
            <LocalHotelIcon sx={{ fontSize: '4.5rem' }} />
          </Typography>
          <Typography
            variant='h6'
            sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
          >
            BED
          </Typography>
          <Typography variant='body1' sx={{ marginBottom: 3, color: 'common.white' }}>
            vacant : {bedFree} | unavailable : {bedOccupied}
          </Typography>
        </CardContent>
      </Card>
    </animated.div>
  );
};

export default CardBedStatistics;
