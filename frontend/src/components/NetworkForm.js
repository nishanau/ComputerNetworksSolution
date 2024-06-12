import React, { useState } from 'react';
import { Button, TextField, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function NetworkForm({ onSubmit }) {
  const [networkIp, setNetworkIp] = useState('192.168.1.0/24');
  const [departments, setDepartments] = useState([
    { users: '12' },
    { users: '32' },
    { users: '20' }
  ]);
  const [errors, setErrors] = useState({ networkIp: '', departments: [] });

  const handleDepartmentChange = (index, value) => {
    const newDepartments = [...departments];
    newDepartments[index].users = value;
    setDepartments(newDepartments);
  };

  const handleAddDepartment = () => {
    setDepartments([...departments, { users: '' }]);
  };

  const validateNetworkIp = (ip) => {
    const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/;
    return ipRegex.test(ip);
  };

  const validateDepartmentUsers = (users) => {
    return !isNaN(users) && Number(users) > 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    let newErrors = { networkIp: '', departments: [] };

    if (!validateNetworkIp(networkIp)) {
      newErrors.networkIp = 'Please enter a valid network IP in the format x.x.x.x/subnetMask';
      valid = false;
    }

    newErrors.departments = departments.map((department, index) => {
      if (!validateDepartmentUsers(department.users)) {
        valid = false;
        return 'Please enter a valid number of users';
      }
      return '';
    });

    setErrors(newErrors);

    if (valid) {
      onSubmit({ networkIp, departments });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} width="100%">
      <TextField
        label="Network IP Address"
        value={networkIp}
        onChange={(e) => setNetworkIp(e.target.value)}
        fullWidth
        required
        error={!!errors.networkIp}
        helperText={errors.networkIp}
        margin="normal"
      />
      {departments.map((department, index) => (
        <TextField
          key={index}
          label={`Number of Users in Department ${index + 1}`}
          type="number"
          value={department.users}
          onChange={(e) => handleDepartmentChange(index, e.target.value)}
          fullWidth
          required
          error={!!errors.departments[index]}
          helperText={errors.departments[index]}
          margin="normal"
        />
      ))}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <IconButton onClick={handleAddDepartment} color="primary">
          <AddIcon />
        </IconButton>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default NetworkForm;
