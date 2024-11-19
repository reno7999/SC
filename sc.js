const fs = require('fs');
const axios = require('axios');

async function downloadFile(url, outputPath) {
  console.log('Acessando a URL de download...');
  const writer = fs.createWriteStream(outputPath);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Erro durante o download:', error.message);
    throw error;
  }
}

(async () => {
  const url = 'https://download.scautomacoes.com/baixar/producao/client_creator_ig.zip';
  const outputPath = './client_creator_ig.zip';

  await downloadFile(url, outputPath);
  console.log('Download concluído!');

  // Aqui você pode adicionar a lógica para extrair o arquivo
  const extract = require('extract-zip');
  try {
    console.log('Extraindo o arquivo...');
    await extract(outputPath, { dir: __dirname });
    console.log('Extração concluída!');
  } catch (err) {
    console.error('Erro durante a extração:', err.message);
  }
})();
