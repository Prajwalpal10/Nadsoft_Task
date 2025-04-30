import React, { useState } from 'react';

import StudentList from './components/StudentList';

function App() {
 

  return (
    <div className="container py-4 ">
      <h2 className="mb-4">Student Management System</h2>
      {/* <StudentForm selectedStudent={selectedStudent} onSuccess={() => setSelectedStudent(null)} /> */}
      <StudentList />
    </div>
  );
}

export default App;
