import axios from 'axios';
import OpenAI from 'openai';
import FormData from 'form-data';

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
    console.log("Imagem gerada pelo DALL-E (base64):", base64Image.substring(0, 100) + "...");

    // Converter base64 para buffer e fazer upload para Imgur
    const buffer = Buffer.from(base64Image, 'base64');
    const formData = new FormData();
    formData.append('image', buffer, { filename: 'temp_image.png' });

    const imgurResponse = await axios.post(
      'https://api.imgur.com/3/upload',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      }
    );

    const dallEImageUrl = imgurResponse.data.data.link;
    console.log("Imagem hospedada no Imgur:", dallEImageUrl);

    // Preparar requisição para Runway ML
    const runwayFormData = new FormData();
    runwayFormData.append('image', dallEImageUrl); // URL pública como referência
    runwayFormData.append('prompt', `Ajuste esta imagem para ser perfeitamente tileável, preservando todos os elementos e cores originais, com bordas suaves e transições contínuas, pronta para impressão digital.`);
    runwayFormData.append('model', 'gen4_image');
    runwayFormData.append('seamless', 'true');
    runwayFormData.append('output_format', 'png');

    // Chamada à API do Runway ML
    const runwayResponse = await axios.post(
      'https://api.runwayml.com/v1/images/generate', // Endpoint inicial; confirme no portal
      runwayFormData,
      {
        headers: {
          ...runwayFormData.getHeaders(),
          Authorization: `Bearer ${process.env.RUNWAYML_API_SECRET}`,
          'X-Runway-Version': '2024-11-06', // Ajuste conforme a versão atual
        },
      }
    );

    const imageUrl = runwayResponse.data.result.url;
    console.log("Imagem ajustada pelo Runway:", imageUrl);
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error.response?.data || error.message);
    res.status(500).json({ error: `Erro na API: ${error.response?.data?.error || error.message}` });
  }
}
