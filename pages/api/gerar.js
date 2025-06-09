import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { estilo, cores, fundo } = req.body;

  try {
    console.log("Inicializando API /api/gerar");
    console.log("Requisição recebida:", { estilo, cores, fundo });

    // Gerar prompt para o DALL-E
    const dallEPrompt = `Uma estampa têxtil realista com ${estilo}, usando cores ${cores}, fundo ${fundo}, estilo natural, pronta para ajuste de tileabilidade`;
    console.log("Prompt para DALL-E:", dallEPrompt);

    // Gerar imagem com DALL-E
    const dallEResponse = await openai.images.generate({
      prompt: dallEPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const base64Image = dallEResponse.data[0].b64_json;
    const dallEImageUrl = `data:image/png;base64,${base64Image}`;
    console.log("Imagem gerada pelo DALL-E:", dallEImageUrl);

    // Prompt para o Runway ML
    const runwayPrompt = `Ajuste esta imagem para ser perfeitamente tileável, preservando todos os elementos e cores originais, com bordas suaves e transições contínuas, pronta para impressão digital.`;

    // Chamada à API do Runway ML
    const runwayResponse = await axios.post(
      'https://api.runwayml.com/v1/images/generate',
      {
        prompt: runwayPrompt,
        reference_image_url: dallEImageUrl,
        model: 'gen4_image',
        seamless: true,
        output_format: 'png',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RUNWAYML_API_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const imageUrl = runwayResponse.data.result.url;
    console.log("Imagem ajustada pelo Runway:", imageUrl);
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    res.status(500).json({ error: `Erro na API: ${error.message}` });
  }
}
