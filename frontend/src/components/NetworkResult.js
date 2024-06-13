import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";

function NetworkResult({ result }) {
  // Display error messages if there are any
  if (result.errors) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Errors
        </Typography>
        <ul>
          {result.errors.map((error, index) => (
            <li key={index} style={{ color: "red" }}>
              {error.message}
            </li>
          ))}
        </ul>
      </Box>
    );
  }

  return (
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell>Network IP</TableCell>
                    <TableCell>Subnet Mask</TableCell>
                    <TableCell>Wildcard Mask</TableCell>
                    <TableCell>Number of usable IPs </TableCell>
                    <TableCell>IP Range</TableCell>
                    <TableCell>Switch Port IP</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {result.subnetAllocations.map((allocation, index) => (
                    <TableRow key={index}>
                        <TableCell>{allocation.department}</TableCell>
                        <TableCell>{allocation.subnet}</TableCell>
                        <TableCell>{allocation.subnet_mask}</TableCell>
                        <TableCell>{allocation.wildcard_mask}</TableCell>
                        <TableCell>{allocation.allocated_ips_count}</TableCell>
                        <TableCell>{allocation.ip_range}</TableCell>
                        <TableCell>{allocation.switch_port_ip}</TableCell>
                    </TableRow>
                ))}
                {result.switchRouterSubnet && (
                    <TableRow>
                        <TableCell colSpan={8}>
                            <strong>Switch-Router Subnet:</strong> {result.switchRouterSubnet}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
);
}

export default NetworkResult;
