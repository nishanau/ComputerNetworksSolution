// src/components/ExportMenu.js
import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportMenu = ({ handleExport }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (format) => {
    handleExport(format);
    handleClose();
  };

  const exportToImage = async (format) => {
    const container = document.getElementById('network-mapping');
    const scale = 2; // Increase scale for better quality
    const canvas = await html2canvas(container, { scale });
    const link = document.createElement('a');
    link.download = `network-diagram.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  };

  const exportToPDF = async () => {
    const container = document.getElementById('network-mapping');
    const scale = 2; // Increase scale for better quality
    const canvas = await html2canvas(container, { scale });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('network-diagram.pdf');
  };

  const handleExportEvent = (event) => {
    const format = event.detail;
    if (format === 'pdf') {
      exportToPDF();
    } else {
      exportToImage(format);
    }
  };

  useEffect(() => {
    window.addEventListener('export', handleExportEvent);
    return () => {
      window.removeEventListener('export', handleExportEvent);
    };
  });

  return (
    <div>
      <Button
        aria-controls="export-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        color="primary"
        endIcon={<ArrowDropDownIcon />}
        sx={{ height: '100%' }}
      >
        Export
      </Button>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick('png')}>Export as PNG</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('jpg')}>Export as JPG</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('pdf')}>Export as PDF</MenuItem>
      </Menu>
    </div>
  );
};

export default ExportMenu;
