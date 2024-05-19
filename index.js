const express = require('express');
const path = require('path')
const jadwalMatkul = require("./jadwalMatkul");
const jadwalUts = require('./jadwalUts');
const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/matkul:data', async (req, res) => { 
  const data = req.params.data; 
  
  if (!data) {
    return res.status(400).json({ error: 'Parameter data diperlukan.' });
  }
  
  const url = `https://baak.gunadarma.ac.id/jadwal/cariJadKul?teks=${data}`;
  try {
    const fetchApi = await jadwalMatkul(url); 

    if (!fetchApi || Object.keys(fetchApi).length === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan.' });
    }

    res.json(fetchApi);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data.' });
  }
});

app.get('/uts:data', async (req, res) => { 
  const data = req.params.data; 
  
  if (!data) {
    return res.status(400).json({ error: 'Parameter data diperlukan.' });
  }
  
  const url = `https://baak.gunadarma.ac.id/jadwal/cariUts?teks=${data}`;
  
  try {
    const fetchApi = await jadwalUts(url); 

    if (!fetchApi || Object.keys(fetchApi).length === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan.' });
    }

    res.json(fetchApi);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data.' });
  }
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})