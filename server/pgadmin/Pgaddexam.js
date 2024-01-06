const express = require('express');
const router = express.Router();
const db = require('../pgdb');


router.get('/pg_departments', async (req, res) => {
   
    try {
      const [rows] = await db.query('SELECT * FROM pg_departments');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }); 

  router.post('/addnewdepartments', async (req, res) => {
    const { departmentName	 } = req.body;
  
    if (!departmentName	) {
      return res.status(400).json({ error: 'Subject name is required' });
    }
  
    try {
      // Insert the new subject into the database
      await db.query('INSERT INTO pg_departments (departmentName) VALUES (?)', [departmentName]);
  
      // Fetch all subjects after adding the new one
      const [rows] = await db.query('SELECT * FROM pg_departments');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/addexam', async (req, res) => {
    const { pg_examName, pg_startDate, pg_endDate, selectedDepartments } = req.body;
  
    try {
      // Insert into pg_exams table
      const [examResult] = await db.query(
        'INSERT INTO pg_exams (pg_examName, pg_startDate, pg_endDate) VALUES (?, ?, ?)',
        [pg_examName, pg_startDate, pg_endDate]
      );
  
      const insertedExamId = examResult.insertId;
  
      // Insert into pg_examdepartments table for each selected department
      for (const departmentId of selectedDepartments) {
        await db.query(
          'INSERT INTO pg_examdepartments (examSubjectsId, departmentId, pg_examId) VALUES (?, ?, ?)',
          [/* You need to replace examSubjectsId with the appropriate value, probably a unique identifier for this relationship */, departmentId, insertedExamId]
        );
      }
  
      res.json({ message: 'Exam created successfully', examId: insertedExamId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/getExamData', async (req, res) => {
    try {
      const  query = ` SELECT
      e.pg_examId,
      e.pg_examName,
      e.pg_startDate,
      e.pg_endDate,
      GROUP_CONCAT(d.departmentName) AS pg_departments
  FROM
      pg_exams e
   JOIN pg_examdepartments ed ON
      e.pg_examId = ed.pg_examId
   JOIN pg_departments d ON
      ed.departmentId = d.departmentId
  GROUP BY
      e.pg_examId`;
      const [rows] =await db.query(query);
      console.log('Fetched data:', query);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching exam data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;