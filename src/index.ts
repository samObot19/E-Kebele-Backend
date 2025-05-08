import express from 'express';
import userRoutes from './interfaces/routes/userRoutes';
import serviceRequestRoutes from './interfaces/routes/serviceRequestRoutes';
import queueRoutes from './interfaces/routes/queueRoutes';
import publicEventRoutes from './interfaces/routes/publicEventRoutes';
import notificationRoutes from './interfaces/routes/notificationRoutes';
import documentRoutes from './interfaces/routes/documentRoutes';
import supportRoutes from './interfaces/routes/supportRoutes';
import { json } from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

app.use('/api/users', userRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/public-events', publicEventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/support', supportRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});