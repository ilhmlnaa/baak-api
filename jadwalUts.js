const axios = require("axios");
const cheerio = require("cheerio");

async function jadwalUts(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const jadwal = {};

    const tabelJadwal = $("table.table-custom");
    if (tabelJadwal.length) {
      const rows = tabelJadwal.find("tr").slice(1); 

      rows.each((index, row) => {
        const kolom = $(row).find("td");
        if (kolom.length < 5) return; 

        const hari = $(kolom[0]).text().trim();
        const tanggal = $(kolom[1]).text().trim();
        const mataKuliah = $(kolom[2]).text().trim();
        const waktu = $(kolom[3]).text().trim();
        const ruang = $(kolom[4]).text().trim();
        const dosen = $(kolom[5]).text().trim();

        const mataKuliahObj = {
          tanggal: tanggal,
          mataKuliah: mataKuliah,
          waktu: waktu,
          ruang: ruang,
          dosen: dosen,
        };

        if (!jadwal[hari]) {
          jadwal[hari] = [];
        }

        
        const exists = jadwal[hari].some(
          (item) =>
            item.tanggal === mataKuliahObj.tanggal &&
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
    console.error("Error while fetching data:", error);
    throw new Error("Failed to fetch data.");
  }
}

module.exports = jadwalUts;
