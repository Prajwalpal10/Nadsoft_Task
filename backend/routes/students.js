
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

//create
router.post('/students', studentController.createStudent);

//read all records
router.get('/students', studentController.getAllStudents);

//update ID record
router.patch('/students/:id', studentController.updateStudent);

//delete Idreco
router.delete('/students/:id', studentController.deleteStudent);

module.exports = router;


