import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { addItem, updateItem, uploadImage } from '../services/firebaseService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function AddEditItemModal({ open, handleClose, item, userId, onItemAdded }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setQuantity(item.quantity || '');
      setExpiryDate(item.expiryDate || '');
      // Note: You might need to handle image differently if editing
    } else {
      setName('');
      setQuantity('');
      setExpiryDate('');
      setImage(null);
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = null;
    
    try {
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const newItem = {
        name,
        quantity: parseInt(quantity, 10),
        expiryDate,
        imageUrl,
      };

      let savedItem;
      if (item) {
        savedItem = await updateItem(item.id, newItem, userId);
      } else {
        savedItem = await addItem(newItem, userId);
      }

      onItemAdded(savedItem);
      handleClose();
    } catch (error) {
      console.error("Error saving item:", error);
      if (error.message) {
        console.error("Error message:", error.message);
      }
      if (error.code) {
        console.error("Error code:", error.code);
      }
      alert("Failed to save item. Please try again.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6">{item ? 'Edit Item' : 'Add New Item'}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Expiry Date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {item ? 'Update' : 'Add'} Item
          </Button>
        </form>
      </Box>
    </Modal>
  );
}