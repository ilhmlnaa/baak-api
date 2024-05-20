const axios = require('axios');
const cheerio = require('cheerio');

async function jadwalMatkul(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const jadwal = {};

    const tabelJadwal = $('table.table-custom');
    if (tabelJadwal.length) {
      const rows = tabelJadwal.find('tr').slice(1); // Skip header row

      rows.each((index, row) => {
        const kolom = $(row).find('td');
        if (kolom.length < 5) return; // Ensure there are enough columns

        const hari = $(kolom[1]).text().trim();
        const mataKuliah = $(kolom[2]).text().trim();
        const waktu = $(kolom[3]).text().trim();
        const ruang = $(kolom[4]).text().trim();
        const dosen = $(kolom[5]).text().trim();

        const mataKuliahObj = {
          mataKuliah: mataKuliah,
          waktu: waktu,
          ruang: ruang,
          dosen: dosen
        };

        if (!jadwal[hari]) {
          jadwal[hari] = [];
        }

        // Check if the entry already exists
        const exists = jadwal[hari].some(item =>
          item.mataKuliah === mataKuliahObj.mataKuliah &&
          item.waktu === mataKuliahObj.waktu &&
          item.ruang === mataKuliahObj.ruang &&
          item.dosen === mataKuliahObj.dosen
        );

        if (!exists) {
          jadwal[hari].push(mataKuliahObj);
        }
      });
    }

    return jadwal;
  } catch (error) {
    console.error(error);
    throw new Error('Gagal mengambil data.');
  }
}

module.exports = jadwalMatkul;
