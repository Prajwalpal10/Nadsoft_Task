

import React, { useState, useEffect } from 'react';
import api from '../api'; // Your axios instance
import Swal from 'sweetalert2';
import Pagination from './Pagination';
import StudentForm from './StudentForm'; // Importing existing StudentForm
import { Modal, Button } from 'react-bootstrap';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1, totalRecords: 0 });
  const [page, setPage] = useState(1);
  const [searchId, setSearchId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null); // To handle selected student for editing
  const [showForm, setShowForm] = useState(false); 
  const limit = 5;

  const fetchStudents = async (pageToFetch = page) => {
    try {
      let url = `/students?page=${pageToFetch}&limit=${limit}`;
      if (searchId) url += `&student_id=${searchId}`;
      const res = await api.get(url);
      setStudents(res.data?.data || []);
      setMeta(res.data?.metadata || { totalPages: 1, totalRecords: 0 });
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    }
  };
  

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const deleteStudent = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/students/${id}`);
        Swal.fire('Deleted!', 'Student has been deleted.', 'success');
        fetchStudents();
      } catch (err) {
        Swal.fire('Error!', 'Could not delete student.', 'error');
      }
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null); // To add new student
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student); // Set the student data to be edited
    setShowForm(true);
  };

  const handleModalClose = () => {
    setShowForm(false);
  };

  const handleSuccess = () => {
    fetchStudents();
    setShowForm(false);
  };

  return (
    <div className="container mt-4 w-75 ">
      <h2 className="mb-4">Student List</h2>

      <div className="d-flex justify-content-between mb-3">
        <div>
          <strong>Total Records:</strong> {meta.totalRecords}
        </div>
        <div className="d-flex align-items-center mb-2">
  <input
    type="number"
    placeholder="Search by Student ID"
    className="form-control me-2"
    style={{ width: '250px' }}
    value={searchId}
    onChange={(e) => setSearchId(e.target.value)}
  />
  <button className="btn btn-secondary" onClick={() => fetchStudents(1)}>
    Search
  </button>
</div>


        <button className="btn btn-success" onClick={handleAddStudent}>
          Add New Student
        </button>
      </div>

      {/* Add/Edit Student Form Modal */}
      <Modal show={showForm} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedStudent ? 'Edit Student' : 'Add New Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StudentForm
            selectedStudent={selectedStudent}
            onSuccess={handleSuccess}
          />
        </Modal.Body>
      </Modal>

      {/* Student Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
        <tr>
  <th>ID</th>
  <th>Full Name</th>
  <th>Email</th>
  <th>Marks</th>
  <th>Actions</th>
</tr>

        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.student_id}>
              <td>{student.student_id}</td>
              <td>{student.first_name} {student.last_name}</td>
              <td>{student.email}</td>
              <td>{student.marks_obtained ?? 'N/A'}</td>
              <td>
                <button className="btn btn-info btn-sm" onClick={() => handleEditStudent(student)}>Edit</button>
                <button className="btn btn-danger btn-sm ms-2" onClick={() => deleteStudent(student.student_id)}>Delete</button>
              </td>
            </tr>
            
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
  currentPage={page}
  totalPages={meta?.totalPages || 1}
  onPageChange={(newPage) => {
    setPage(newPage);
    fetchStudents(newPage);
  }}
/>

    </div>
  );
};

export default StudentList;
