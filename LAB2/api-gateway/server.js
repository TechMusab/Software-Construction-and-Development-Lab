const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

app.use('/users', proxy('http://localhost:3001'));
app.use('/cars', proxy('http://localhost:3002'));
app.use('/bookings', proxy('http://localhost:3003'));
app.listen(3000, () => console.log('API Gateway running on port 3000'));
