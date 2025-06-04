import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { imagens } = req.body;

  if (!imagens || !Array.isArray(imagens)) {
    return res.status(400).json({ error: 'Imagens são obrigatórias e devem ser um array' });
  }

  const bigjpgApiKey = process.env.BIGJPG_API_KEY;

  try {
    const highResUrls = [];

    for (const imageUrl of imagens) {
      const uploadRes = await fetch('https://bigjpg.com/api/task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': bigjpgApiKey,
        },
        body: JSON.stringify({
          url: imageUrl,
          scale: 4,
          style: 'art',
        }),
      });

      const uploadData = await uploadRes.json();
      const taskId = uploadData.tid;

      let status = 'processing';
      let highResUrl = null;

      while (status === 'processing') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const statusRes = await fetch(`https://bigjpg.com/api/task/${taskId}`, {
          headers: { 'X-API-KEY': bigjpgApiKey },
        });
        const statusData = await statusRes.json();
        status = statusData.status;
        if (status === 'success') {
          highResUrl = statusData.url;
        }
      }

      if (highResUrl) {
        highResUrls.push(highResUrl);
      } else {
        throw new Error('Falha ao aumentar a resolução da imagem');
      }
    }

    res.status(200).json({ highResUrls });
  } catch (error) {
    console.error('Erro ao aumentar resolução:', error);
    res.status(500).json({ error: 'Erro ao aumentar resolução das imagens' });
  }
}
