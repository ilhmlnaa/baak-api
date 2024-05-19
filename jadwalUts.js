const axios = require('axios');
const cheerio = require('cheerio');

async function jadwalUts(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const jadwal = {};

    const tabelJadwal = $('table.table-custom');
    if (tabelJadwal.length) {
      const rows = tabelJadwal.find('tr').slice(1);

      rows.each((index, row) => {
        const kolom = $(row).find('td');
        const hari = $(kolom[0]).text().trim();
        const tanggal = $(kolom[1]).text().trim();
        const mataKuliah = $(kolom[2]).text().trim();
        const waktu = $(kolom[3]).text().trim();
        const ruang = $(kolom[4]).text().trim();
        const dosen = $(kolom[5]).text().trim();

        if (kolom.length < 5 || !kolom[0].children.length) {
            return;
          }
          
        if (!jadwal[hari]) {
          jadwal[hari] = [];
        }

        jadwal[hari].push({
          tanggal: tanggal,
          mataKuliah: mataKuliah,
          waktu: waktu,
          ruang: ruang,
          dosen: dosen
        });
      });
    }

    return jadwal;
  } catch (error) {
    console.error('Error while fetching data:', error);
    throw new Error('Failed to fetch data.');
  }
}

module.exports = jadwalUts;
