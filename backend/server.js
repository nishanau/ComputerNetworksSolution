const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const networkRoutes = require('./routes/networkRoutes');

const app = express();
const port = 3005;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use('/api/network', networkRoutes);

app.get('/api/*', (req, res) => {
  res.redirect('https://nishanau.github.io/ComputerNetworksSolution');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
