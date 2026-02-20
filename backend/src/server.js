const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const { errorHandler } = require('./middleware/errorMiddleware');

const adminRoutes = require('./routes/adminRoutes');

const orderRoutes = require('./routes/orderRoutes');

const productRoutes = require('./routes/productRoutes');

const authRoutes = require('./routes/authRoutes');


require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 👇 CONNECT ROUTES HERE
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Global error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
