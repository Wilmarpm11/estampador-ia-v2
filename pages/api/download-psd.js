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
    // Aqui você implementaria a lógica para converter a imagem em PSD
    // Como exemplo, vamos supor que você retorna uma URL simulada
    const psdUrl = `https://example.com/convert-to-psd?image=${encodeURIComponent(imageUrl)}`;
    res.status(200).json({ psdUrl });
  } catch (error) {
    console.error('Erro ao gerar PSD:', error.message);
    res.status(500).json({ error: `Erro ao gerar PSD: ${error.message}` });
  }
}
