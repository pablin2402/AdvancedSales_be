const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const router = express.Router();

const pdfSchema = new Schema({
  name: String,
  path: String,
});

const Pdf = mongoose.model("Pdf", pdfSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname);
  },
});
const upload = multer({ storage });

router.post("/upload-pdf", upload.single("Pdf"), async (req, res) => {
    console.log(req)
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha proporcionado ningún archivo PDF' });
  }
  
  // Crear un nuevo documento PDF en la base de datosx
  const newPdf = new Pdf({
    name: req.file.originalname,
    path: req.file.path,
  });

  try {
    // Guardar el documento PDF en la base de datos
    const savedPdf = await newPdf.save();
    
    // Construir la URL del archivo PDF
    const pdfUrl = `https://tu-servidor.com/uploads/${savedPdf._id}`;
    
    res.status(200).json({ message: 'PDF subido correctamente', pdfUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el PDF en la base de datos' });
  }
});

module.exports = router;
