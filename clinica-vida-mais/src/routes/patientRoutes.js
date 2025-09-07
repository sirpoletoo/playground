/**
 * Rotas dos Pacientes
 * Define as rotas HTTP para operações relacionadas aos pacientes
 */
const express = require("express");
const PatientController = require("../controllers/PatientController");

// Criar instância do router
const router = express.Router();

// Criar instância do controller
const patientController = new PatientController();

// Rotas dos pacientes
/**
 * POST /api/patients
 * Cadastra um novo paciente
 */
router.post("/", async (req, res) => {
  await patientController.createPatient(req, res);
});

/**
 * GET /api/patients/:id
 * Busca um paciente específico por ID
 */
router.get("/:id", async (req, res) => {
  await patientController.getPatientById(req, res);
});

/**
 * GET /api/patients
 * Lista todos os pacientes com paginação
 */
router.get("/", async (req, res) => {
  await patientController.listPatients(req, res);
});

/**
 * GET /api/patients/search
 * Busca pacientes por nome
 */
router.get("/search", async (req, res) => {
  await patientController.searchPatientsByName(req, res);
});

module.exports = router;
