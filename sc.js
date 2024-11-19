const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const extract = require('extract-zip');

(async () => {
  // Diretório onde o vídeo e os arquivos baixados serão salvos
  const downloadDir = path.resolve(__dirname, 'downloads');
  if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

  // Inicializar o navegador com gravação de vídeo
  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext({
    recordVideo: { dir: path.resolve(__dirname, 'videos') }, // Pasta para salvar o vídeo
    acceptDownloads: true, // Permitir downloads
  });

  const page = await context.newPage();

  try {
    // Acessar a URL de download
    const downloadUrl = 'https://download.scautomacoes.com/baixar/producao/client_creator_ig.zip';
    console.log('Acessando a URL de download...');
    await page.goto(downloadUrl);

    // Esperar e capturar o download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('a'), // Ajuste conforme necessário para clicar no link de download
    ]);

    // Salvar o arquivo baixado
    const downloadPath = path.join(downloadDir, 'client_creator_ig.zip');
    console.log('Baixando arquivo...');
    await download.saveAs(downloadPath);
    console.log(`Arquivo baixado em: ${downloadPath}`);

    // Extrair o arquivo ZIP
    const extractPath = path.join(downloadDir, 'extracted');
    console.log('Extraindo arquivo...');
    await extract(downloadPath, { dir: extractPath });
    console.log(`Arquivos extraídos para: ${extractPath}`);
  } catch (error) {
    console.error('Erro durante o processo:', error);
  } finally {
    // Fechar o navegador
    await browser.close();
  }
})();
