// src/App.js
import React, { useState } from 'react';
import { Grid, Typography, Box, AppBar, Toolbar, Button } from '@mui/material';
import NetworkForm from './components/NetworkForm';
import NetworkResult from './components/NetworkResult';
import NetworkMapping from './components/NetworkMapping';
import ExportMenu from './components/ExportMenu';

function App() {
  const [result, setResult] = useState({ subnetAllocations: [], departments: [] });
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] });
  const [alternativeView, setAlternativeView] = useState(false);

  const handleFormSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/api/network', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setResult(result);
      generateNetworkData(result, alternativeView);  // Generate network data for visualization
    } catch (error) {
      console.error('Error calculating network solution:', error);
    }
  };

  const generateNetworkData = (result, alternative) => {
    const nodes = [];
    const edges = [];

    if (!result.subnetAllocations || !Array.isArray(result.subnetAllocations)) {
      console.error('Invalid subnetAllocations data:', result.subnetAllocations);
      return;
    }

    const routerNode = { id: 'router', label: 'Router', group: 'router' };
    nodes.push(routerNode);

    result.subnetAllocations.forEach((allocation, index) => {
      const switchNode = { id: `switch-${index + 1}`, label: `Switch ${index + 1} (${allocation.switch_port_ip})`, group: 'switch' };
      nodes.push(switchNode);
      edges.push({ from: 'router', to: switchNode.id });

      const departmentNode = { id: `department-${allocation.department}`, label: `Department ${allocation.department}`, group: 'department' };
      nodes.push(departmentNode);
      edges.push({ from: switchNode.id, to: departmentNode.id });

      if (alternative) {
        const ipNode = { id: `${allocation.department}-users`, label: `${allocation.allocated_ips_count} Users`, group: 'users' };
        nodes.push(ipNode);
        edges.push({ from: departmentNode.id, to: ipNode.id });
      } else {
        allocation.allocated_ips.forEach((ip, ipIndex) => {
          const ipNode = { id: `${allocation.department}-${ipIndex}`, label: ip, group: 'ip' };
          nodes.push(ipNode);
          edges.push({ from: departmentNode.id, to: ipNode.id });
        });
      }
    });

    setNetworkData({ nodes, edges });
  };

  const toggleView = () => {
    if (result.subnetAllocations.length === 0) {
      alert('Please submit the network configuration first.');
      return;
    }
    setAlternativeView((prev) => !prev);
    generateNetworkData(result, !alternativeView);
  };

  const handleExport = (format) => {
    if (result.subnetAllocations.length === 0) {
      alert('Please submit the network configuration first.');
      return;
    }
    // Trigger the export function in ExportMenu component
    const event = new CustomEvent('export', { detail: format });
    window.dispatchEvent(event);
  };

  return (
    <Box sx={{ height: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 0 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Network Mapper
          </Typography>
          <Button variant="contained" color="secondary" onClick={toggleView} sx={{ height: '100%', marginRight: 2 }}>
            Toggle View
          </Button>
          <ExportMenu handleExport={handleExport} />
        </Toolbar>
      </AppBar>
      <Grid container spacing={4} sx={{ height: 'calc(100vh - 64px)' }}>
        {/* Input Form and Output Table - Takes 2/5 of the screen */}
        <Grid item xs={12} md={5} className="input-grid">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Network Configuration
            </Typography>
            <Box sx={{ overflowY: 'auto', flex: 1, padding: 1 }}>
              <NetworkForm onSubmit={handleFormSubmit} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                Network Optimization Result
              </Typography>
              <NetworkResult result={result} />
            </Box>
          </Box>
        </Grid>
        {/* Network Mapping - Takes 3/5 of the screen */}
        <Grid item xs={12} md={7} sx={{ height: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Network Mapping
          </Typography>
          <Box id="network-mapping" sx={{ height: '100%', overflow: 'hidden', border: '1px solid #ccc', position: 'relative' }}>
            <NetworkMapping data={networkData} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
