import PSD from 'psd.js';
import sharp from 'sharp';

export function createPSD(imageBuffers) {
  const width = 512;
  const height = 512;

  const psd = new PSD({
    width: width * imageBuffers.length,
    height,
  });

  const parentLayer = psd.tree();

  imageBuffers.forEach((buffer, index) => {
    sharp(buffer)
      .resize(width, height)
      .toBuffer()
      .then((resizedBuffer) => {
        const layer = parentLayer.addLayer(`Estampa ${index + 1}`);
        layer.image.setData(resizedBuffer, width, height);
        layer.image.x = index * width;
        layer.image.y = 0;
      })
      .catch((err) => {
        console.error('Erro ao redimensionar imagem para PSD:', err);
        throw err;
      });
  });

  return Buffer.from(psd.toPng());
}
