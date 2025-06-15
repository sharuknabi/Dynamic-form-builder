const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

const DB_PATH = path.join(__dirname, "db.json");

// Middleware
app.use(cors());
app.use(express.json());

// Utility to read/write DB file
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// GET all forms
app.get("/api/forms", (req, res) => {
  const db = readDB();
  res.json(db.forms);
});

// GET form by ID
app.get("/api/forms/:id", (req, res) => {
  const db = readDB();
  const form = db.forms.find((f) => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: "Form not found" });
  res.json(form);
});

// POST new form
app.post("/api/forms", (req, res) => {
  const db = readDB();
  const newForm = req.body;
  if (!newForm || !newForm.id || !newForm.fields) {
    return res.status(400).json({ error: "Invalid form data" });
  }
  db.forms.push(newForm);
  writeDB(db);
  res.status(201).json({ message: "Form saved", form: newForm });
});

// POST form submission
app.post("/api/forms/:id/submit", (req, res) => {
  const db = readDB();
  const form = db.forms.find((f) => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: "Form not found" });

  const submission = req.body;
  if (!submission || typeof submission !== "object") {
    return res.status(400).json({ error: "Invalid submission data" });
  }

  db.submissions.push({ formId: req.params.id, data: submission });
  writeDB(db);
  res.json({ message: "Submission received" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ API Server running at http://localhost:${PORT}`);
});
