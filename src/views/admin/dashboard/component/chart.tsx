import * as React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { Box, Card, Typography } from '@mui/material'
import Stack from '@mui/material/Stack';

export default function ChartsOverviewDemo() {
  return (
    <Card
    component={Stack}
    spacing={3}
    direction="row"
    sx={{
      px: 3,
      py: 5,
      borderRadius: 2
    }}
    >
      <Box flexGrow={1} width={1} >
        <Typography variant="body1">Sales Overview</Typography>
        <BarChart
        series={[
          { data: [35, 44, 24, 34] },
          { data: [51, 6, 49, 30] },
          { data: [15, 25, 30, 50] },
          { data: [60, 50, 15, 25] }
        ]}
        height={290}
        xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
        margin={{ top: 10, bottom: 50, left: 40, right: 10 }}
      />
      </Box>





    </Card>
  )
}
