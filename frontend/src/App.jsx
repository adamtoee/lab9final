// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const App = () => {
  const [puppies, setPuppies] = useState([]);
  const [newPuppy, setNewPuppy] = useState({ name: '', breed: '', age_est: '', current_kennel_number: '' });
  const [editPuppy, setEditPuppy] = useState(null);

  const apiUrl = 'http://localhost:8080/puppies'; // Adjust this URL to your backend's address

  // Fetch all puppies from the backend
  const fetchPuppies = async () => {
    try {
      const response = await axios.get(apiUrl);
      setPuppies(response.data);
    } catch (error) {
      console.error('Error fetching puppies:', error);
    }
  };

  // Add a new puppy
  const handleAddPuppy = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(apiUrl, newPuppy);
      setPuppies([...puppies, response.data]);
      setNewPuppy({ name: '', breed: '', age_est: '', current_kennel_number: '' });
    } catch (error) {
      console.error('Error adding puppy:', error);
    }
  };

  // Edit puppy details
  const handleEditPuppy = async (id) => {
    const puppy = puppies.find((pup) => pup.pet_id === id);
    setEditPuppy(puppy);
  };

  // Update puppy
  const handleUpdatePuppy = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/${editPuppy.pet_id}`, editPuppy);
      setPuppies(
        puppies.map((puppy) => (puppy.pet_id === editPuppy.pet_id ? response.data : puppy))
      );
      setEditPuppy(null);
    } catch (error) {
      console.error('Error updating puppy:', error);
    }
  };

  // Delete puppy
  const handleDeletePuppy = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setPuppies(puppies.filter((puppy) => puppy.pet_id !== id));
    } catch (error) {
      console.error('Error deleting puppy:', error);
    }
  };

  useEffect(() => {
    fetchPuppies();
  }, []);

  return (
    <div>
      <h1>Puppy Management</h1>

      {/* Add New Puppy Form */}
      <form onSubmit={handleAddPuppy}>
        <h2>Add Puppy</h2>
        <TextField
          label="Name"
          value={newPuppy.name}
          onChange={(e) => setNewPuppy({ ...newPuppy, name: e.target.value })}
          required
        />
        <TextField
          label="Breed"
          value={newPuppy.breed}
          onChange={(e) => setNewPuppy({ ...newPuppy, breed: e.target.value })}
        />
        <TextField
          label="Age"
          value={newPuppy.age_est}
          onChange={(e) => setNewPuppy({ ...newPuppy, age_est: e.target.value })}
        />
        <TextField
          label="Kennel Number"
          value={newPuppy.current_kennel_number}
          onChange={(e) => setNewPuppy({ ...newPuppy, current_kennel_number: e.target.value })}
        />
        <Button type="submit">Add Puppy</Button>
      </form>

      {/* Edit Puppy Form */}
      {editPuppy && (
        <form onSubmit={handleUpdatePuppy}>
          <h2>Edit Puppy</h2>
          <TextField
            label="Name"
            value={editPuppy.name}
            onChange={(e) => setEditPuppy({ ...editPuppy, name: e.target.value })}
            required
          />
          <TextField
            label="Breed"
            value={editPuppy.breed}
            onChange={(e) => setEditPuppy({ ...editPuppy, breed: e.target.value })}
          />
          <TextField
            label="Age"
            value={editPuppy.age_est}
            onChange={(e) => setEditPuppy({ ...editPuppy, age_est: e.target.value })}
          />
          <TextField
            label="Kennel Number"
            value={editPuppy.current_kennel_number}
            onChange={(e) => setEditPuppy({ ...editPuppy, current_kennel_number: e.target.value })}
          />
          <Button type="submit">Update Puppy</Button>
        </form>
      )}

      {/* Puppies Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Breed</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Kennel Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {puppies.map((puppy) => (
              <TableRow key={puppy.pet_id}>
                <TableCell>{puppy.name}</TableCell>
                <TableCell>{puppy.breed}</TableCell>
                <TableCell>{puppy.age_est}</TableCell>
                <TableCell>{puppy.current_kennel_number}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditPuppy(puppy.pet_id)}>Edit</Button>
                  <Button onClick={() => handleDeletePuppy(puppy.pet_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;
