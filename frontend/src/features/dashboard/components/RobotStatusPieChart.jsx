// components/RobotStatusPieChart.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';

const RobotStatusPieChart = ({ data, colors }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, height: 350 }}>
      <Typography variant="h6" gutterBottom>
        Estado actual de los robots
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            paddingAngle={2}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[entry.raw]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RobotStatusPieChart;
