
import React, { useState, useEffect } from 'react';
import api from '../api';
import Swal from 'sweetalert2';

function StudentForm({ selectedStudent, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: 'Male',
    email: '',
    phone: '',
    marks_obtained: '' 
  });

  useEffect(() => {
    if (selectedStudent) {
      
      setFormData({
        ...selectedStudent,
        marks_obtained: selectedStudent.marks_obtained || ''
      });
    }
  }, [selectedStudent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStudent) {
        await api.patch(`/students/${selectedStudent.student_id}`, formData);
        Swal.fire('Updated!', 'Student updated successfully.', 'success');
      } else {
        await api.post('/students', formData);
        Swal.fire('Created!', 'Student added successfully.', 'success');
      }
      onSuccess();
      setFormData({
        first_name: '',
        last_name: '',
        gender: 'Male',
        email: '',
        phone: '',
        marks_obtained: ''
      });
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'Something went wrong!', 'error');
    }
  };

  return (
    <form className="p-3 border rounded bg-light mb-4" onSubmit={handleSubmit}>
      <h4>{selectedStudent ? 'Edit Student' : 'Add New Student'}</h4>
      <div className="row">
        <div className="col-md-6 mb-2">
          <input className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
        </div>
        <div className="col-md-6 mb-2">
          <input className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-2">
          <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div className="col-md-6 mb-2">
          <input type="number"step="0.01"className="form-control" name="marks_obtained"
            value={formData.marks_obtained}
            onChange={handleChange}
            placeholder="Marks Obtained"
          />
        </div>
      </div>
      <input className="form-control mb-2" type='email' name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input className="form-control mb-2" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
      <button className="btn btn-primary w-100">{selectedStudent ? 'Update' : 'Create'}</button>
    </form>
  );
}

export default StudentForm;
