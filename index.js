const express = require("express");
const path = require("path");
const app = express();
const jadwalMatkul = require("./jadwalMatkul");
const jadwalUts = require("./jadwalUts");
const response = require("./response");

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs");

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/matkul", async (req, res) => {
  const kelas = req.query.kelas;

  if (!kelas) {
    return response(400, "Parameter kelas Diperlukan!", "Error", res);
  }

  const url = `http://baak.gunadarma.ac.id/jadwal/cariJadKul?teks=${kelas}`;
  try {
    const fetchApi = await jadwalMatkul(url);

    if (!fetchApi || Object.keys(fetchApi).length === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan." });
    }

    response(200, fetchApi, "Success Get Data", res);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
  }
});

app.get("/uts", async (req, res) => {
  const kelas = req.query.kelas;

  if (!kelas) {
    return response(400, "Parameter kelas Diperlukan!", "Error", res);
  }

  const url = `http://baak.gunadarma.ac.id/jadwal/cariUts?teks=${kelas}`;

  try {
    const fetchApi = await jadwalUts(url);

    if (!fetchApi || Object.keys(fetchApi).length === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan." });
    }

    response(200, fetchApi, "Success Get Data", res);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
  }
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
