const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Fetch all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.status(200).json(
      students.map((student) => ({
        ...student,
        dateJoined: student.dateJoined.toISOString(),
        lastLogin: student.lastLogin.toISOString(),
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Add a new student
app.post('/api/students', async (req, res) => {
  const { name, cohort, courses, dateJoined, lastLogin, status } = req.body;
  try {
    const newStudent = await prisma.student.create({
      data: {
        name,
        cohort,
        courses,
        dateJoined: dateJoined ? new Date(dateJoined) : new Date(),
        lastLogin: lastLogin ? new Date(lastLogin) : new Date(),
        status,
      },
    });
    res.status(201).json({
      ...newStudent,
      dateJoined: newStudent.dateJoined.toISOString(),
      lastLogin: newStudent.lastLogin.toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update a student
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, cohort, courses, lastLogin, status } = req.body;
  try {
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        name,
        cohort,
        courses,
        lastLogin: lastLogin ? new Date(lastLogin) : undefined,
        status,
      },
    });
    res.status(200).json({
      ...updatedStudent,
      dateJoined: updatedStudent.dateJoined.toISOString(),
      lastLogin: updatedStudent.lastLogin.toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete a student
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.student.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
