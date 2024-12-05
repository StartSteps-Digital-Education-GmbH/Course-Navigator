import express from 'express';
import bodyParser from 'body-parser';
import flatRoutes from './routes/flatRoutes';

const app = express();
app.use(bodyParser.json()); // or express.json()

app.use('/api', flatRoutes);

app.listen(3000, () => console.log('Server is running on port 3000'));

