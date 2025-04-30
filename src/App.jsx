import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';

function App() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-4 ">
      <h2 className="mb-4">Student Management System</h2>
      {/* <StudentForm selectedStudent={selectedStudent} onSuccess={() => setSelectedStudent(null)} /> */}
      <StudentList />
    </div>
  );
}

export default App;
