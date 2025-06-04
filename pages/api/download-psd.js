import fetch from 'node-fetch';
import { createPSD } from '../../utils/psdGenerator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { imagens } = req.body;

  if (!imagens || !Array.isArray(imagens)) {
    return res.status(400).json({ error: 'Imagens são obrigatórias e devem ser um array' });
  }

  try {
    const imageBuffers = [];

    for (const url of imagens) {
      const response = await fetch(url);
      const buffer = await response.buffer();
      imageBuffers.push(buffer);
    }

    const psdBuffer = createPSD(imageBuffers);

    const psdUrl = `data:application/octet-stream;base64,${psdBuffer.toString('base64')}`;
    res.status(200).json({ psdUrl });
  } catch (error) {
    console.error('Erro ao gerar PSD:', error);
    res.status(500).json({ error: 'Erro ao gerar arquivo PSD' });
  }
}
