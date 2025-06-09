import gerarPrompt from '../../utils/geradorPrompt';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  console.log("Inicializando API /api/gerar");
  console.log("Módulo OpenAI importado com sucesso");
  console.log("Cliente OpenAI inicializado");

  try {
    console.log("Requisição recebida em /api/gerar");
    const { estilo, cores, fundo } = req.body;
    console.log("Gerando prompt:", { estilo, cores, fundo });

    const estilosArray = Array.isArray(estilo)
      ? estilo
      : estilo
          .replace(/\./g, '')
          .split(',')
          .map(item => item.trim())
          .filter(Boolean);
    const coresArray = Array.isArray(cores)
      ? cores
      : cores
          .split(',')
          .map(item => item.trim())
          .filter(Boolean);
    const fundoStr = typeof fundo === 'string' ? fundo.trim() : fundo;

    const prompt = await gerarPrompt(estilosArray, coresArray, fundoStr);
    console.log("Prompt final:", prompt);

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024", // Resolução alta para melhor detalhe
      response_format: "b64_json",
    });

    const imageUrl = `data:image/png;base64,${response.data[0].b64_json}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    res.status(500).json({ error: `Erro na API: ${error.message}` });
  }
}
