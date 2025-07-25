import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Mock jobs data for demo purposes (in real app this would be from MongoDB/Agenda)
let mockJobs = [
  {
    _id: '1',
    name: 'fetch_user_name',
    type: 'single',
    data: {},
    priority: 0,
    repeatInterval: '10 seconds',
    repeatTimezone: null,
    nextRunAt: new Date(Date.now() + 10000).toISOString(),
    lastModifiedBy: 'system',
    lastRunAt: new Date(Date.now() - 5000).toISOString(),
    lastFinishedAt: new Date(Date.now() - 4000).toISOString(),
    failedAt: null,
    failReason: null
  }
];

let jobIdCounter = 2;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// API Routes
app.get('/api/jobs', async (req, res) => {
    try {
        res.json(mockJobs);
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
        
        // Create mock job
        const newJob = {
            _id: (jobIdCounter++).toString(),
            name,
            type: 'single',
            data,
            priority: 0,
            repeatInterval: interval,
            repeatTimezone: null,
            nextRunAt: new Date(Date.now() + 30000).toISOString(), // 30 seconds from now
            lastModifiedBy: 'user',
            lastRunAt: null,
            lastFinishedAt: null,
            failedAt: null,
            failReason: null
        };
        
        mockJobs.push(newJob);
        console.log(`Created job: ${name} with interval: ${interval}`);
        
        res.json({ success: true, message: 'Job scheduled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const initialLength = mockJobs.length;
        mockJobs = mockJobs.filter(job => job._id !== id);
        
        if (mockJobs.length < initialLength) {
            console.log(`Deleted job with ID: ${id}`);
            res.json({ success: true, message: 'Job cancelled successfully' });
        } else {
            res.status(404).json({ error: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'running',
        agenda: 'connected', // Mock as connected for demo
        uptime: process.uptime()
    });
});

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start Server
async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📱 React app: http://localhost:${PORT}`);
            console.log(`🔌 API: http://localhost:${PORT}/api`);
            console.log(`⚡ Demo mode: MongoDB not required`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();