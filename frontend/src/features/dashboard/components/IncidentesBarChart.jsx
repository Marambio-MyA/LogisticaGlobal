// components/IncidentesBarChart.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';

const IncidentesBarChart = ({ data, colors }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, height: 350,  }}>
      <Typography variant="h6" gutterBottom>
        Incidentes por estado (%)
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barSize={50}
          barCategoryGap="25%"
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="estado" />
          <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
          <Bar dataKey="percent" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={colors[entry.raw]} />
            ))}
            <LabelList
              dataKey="percent"
              position="top"
              formatter={(val) => `${val.toFixed(1)}%`}
              style={{ fontWeight: 'bold', fill: '#000' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IncidentesBarChart;
