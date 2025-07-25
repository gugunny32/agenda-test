import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Agenda } from '@hokify/agenda';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string
const mongoConnectionString = "mongodb://127.0.0.1:27017/agenda-test";

// Initialize Agenda
const agenda = new Agenda({ 
  db: { 
    address: mongoConnectionString, 
    collection: "agenda" 
  } 
});

// Define the job (same as in index.js)
agenda.define('fetch_user_name', async job => {
    try {
        const response = await fetch("https://reqres.in/api/users/2", { method: "GET" });
        const data = await response.json();
        const user = data.data;
        console.log(`Fetched user: ${user.first_name} ${user.last_name}`);
        return { success: true, user };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: error.message };
    }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// API Routes
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await agenda.jobs({});
        res.json(jobs.map(job => ({
            _id: job.attrs._id,
            name: job.attrs.name,
            type: job.attrs.type,
            data: job.attrs.data,
            priority: job.attrs.priority,
            repeatInterval: job.attrs.repeatInterval,
            repeatTimezone: job.attrs.repeatTimezone,
            nextRunAt: job.attrs.nextRunAt,
            lastModifiedBy: job.attrs.lastModifiedBy,
            lastRunAt: job.attrs.lastRunAt,
            lastFinishedAt: job.attrs.lastFinishedAt,
            failedAt: job.attrs.failedAt,
            failReason: job.attrs.failReason
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/jobs', async (req, res) => {
    try {
        const { name, interval, data = {} } = req.body;
        if (!name || !interval) {
            return res.status(400).json({ error: 'Name and interval are required' });
        }
        
        await agenda.every(interval, name, data);
        res.json({ success: true, message: 'Job scheduled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await agenda.cancel({ _id: id });
        res.json({ success: true, message: 'Job cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'running',
        agenda: agenda._ready ? 'connected' : 'disconnected',
        uptime: process.uptime()
    });
});

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start Agenda and Server
async function startServer() {
    try {
        agenda
            .on('ready', () => console.log("Agenda started!"))
            .on('error', (error) => console.log("Agenda connection error!", error));
        
        await agenda.start();
        
        // Schedule the default job
        await agenda.every("10 seconds", "fetch_user_name");
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`React app will be served at http://localhost:${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();