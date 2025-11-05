import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import geminiHandler from './api/gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Ruta API usando el handler existente
app.post('/api/gemini', geminiHandler);

// Login mock (solo demo). En producción valida contra BD/hash.
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ ok: false, error: 'Faltan credenciales' });
        }
        // Demo: acepta cualquier email válido y pass de 6+ caracteres
        const emailOk = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
        const passOk = String(password).length >= 6;
        if (!emailOk || !passOk) {
            return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
        }
        return res.status(200).json({ ok: true });
    } catch (e) {
        return res.status(500).json({ ok: false, error: 'Error en login' });
    }
});

// Servir archivos estáticos (HTML/CSS/JS) desde la raíz del proyecto
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


