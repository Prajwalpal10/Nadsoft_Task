   
const pool = require('../db');


const createStudent = async (req, res) => {
  const { first_name, last_name, gender, email, phone, marks_obtained } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert student
    const studentResult = await client.query(
      `INSERT INTO Students (first_name, last_name, gender, email, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING student_id, first_name, last_name, gender, email, phone`,
      [first_name, last_name, gender, email, phone]
    );

    const student = studentResult.rows[0];

   
    if (marks_obtained !== undefined && marks_obtained !== null) {
      await client.query(
        `INSERT INTO Marks (student_id, marks_obtained)
         VALUES ($1, $2)`,
        [student.student_id, marks_obtained]
      );
      student.marks_obtained = marks_obtained;
    }

    await client.query('COMMIT');
    res.status(201).json(student);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting student and marks:', err);
    res.status(500).json({ error: 'Error adding student with marks' });
  } finally {
    client.release();
  }
};



const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 5, student_id } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, m.marks_obtained
      FROM students s
      LEFT JOIN marks m ON s.student_id = m.student_id 
    `;
    let countQuery = 'SELECT COUNT(*) FROM students';
    const params = [];
    const countParams = [];

    if (student_id) {
      query += ' WHERE s.student_id = $1';
      countQuery += ' WHERE student_id = $1';
      params.push(student_id);
      countParams.push(student_id);
    } else {
      query += ' ORDER BY s.student_id LIMIT $1 OFFSET $2';
      params.push(limit, offset);
    }

    const totalQuery = await pool.query(countQuery, countParams);
    const totalRecords = parseInt(totalQuery.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    const studentsQuery = await pool.query(query, params);

    res.json({
      data: studentsQuery.rows,
      metadata: {
        totalPages,
        totalRecords,
        currentPage: parseInt(page),
      },
    });
  } catch (err) {
    console.error('Error fetching students with marks:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const updateStudent = async (req, res) => {
  const studentId = req.params.id;
  const { first_name, last_name, gender, email, phone, marks_obtained } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update student details
    const studentResult = await client.query(
      `UPDATE Students
       SET first_name = $1,
           last_name = $2,
           gender = $3,
           email = $4,
           phone = $5
       WHERE student_id = $6
       RETURNING *`,
      [first_name, last_name, gender, email, phone, studentId]
    );

    if (studentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Student not found' });
    }

    // Handle marks
    const marksQuery = await client.query(
      'SELECT * FROM Marks WHERE student_id = $1',
      [studentId]
    );

    if (marksQuery.rows.length > 0) {
      // Update existing marks
      await client.query(
        `UPDATE Marks
         SET marks_obtained = $1
         WHERE student_id = $2`,
        [marks_obtained, studentId]
      );
    } else {
     
      await client.query(
        `INSERT INTO Marks (student_id, marks_obtained)
         VALUES ($1, $2)`,
        [studentId, marks_obtained]
      );
    }

    await client.query('COMMIT');

    const updatedStudent = studentResult.rows[0];
    updatedStudent.marks_obtained = marks_obtained;

    res.json(updatedStudent);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating student and marks:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};


// Delete a student
const deleteStudent = async (req, res) => {
    const studentId = req.params.id; // Get student ID from URL parameter
  
    try {
      // Attempt to delete the student
      const result = await pool.query(
        'DELETE FROM Students WHERE student_id = $1 RETURNING *',
        [studentId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' }); // If student not found
      }
  
      res.json({ message: 'Student deleted successfully' }); // Success response
    } catch (err) {
      console.error('Error deleting student:', err);
      res.status(500).json({ error: 'Internal Server Error' }); // Catch database errors
    }
  };
  

module.exports = {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
};
