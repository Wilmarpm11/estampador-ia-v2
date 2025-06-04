export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { imagens } = req.body;

  if (!imagens || !Array.isArray(imagens) || imagens.length !== 1) {
    return res.status(400).json({ error: 'Uma única imagem é obrigatória' });
  }

  const imageUrl = imagens[0];

  try {
    const response = await fetch('https://bigjpg.com/api/task/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BIGJPG_API_KEY}` // Adicione se necessário
      },
      body: JSON.stringify({
        url: imageUrl,
        scale: 2 // Aumenta 2x
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro na API BigJPG: ${response.status} - ${text}`);
    }

    const data = await response.json();
    const highResUrl = data.outputUrl; // Ajuste conforme a resposta da API
    res.status(200).json({ highResUrls: [highResUrl] });
  } catch (error) {
    console.error('Erro ao aumentar resolução:', error.message);
    res.status(500).json({ error: `Erro ao aumentar resolução: ${error.message}` });
  }
}
