import { Configuration, OpenAIApi } from 'openai';
import { gerarPrompt } from '../../utils/geradorPrompt';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { estilo, cores, fundo } = req.body;

  if (!estilo || !cores || !fundo) {
    return res.status(400).json({ error: 'Estilo, cores e fundo são obrigatórios' });
  }

  console.log('Gerando prompt:', { estilo, cores, fundo });
  const prompt = gerarPrompt(estilo, cores, fundo);
  console.log('Prompt gerado:', prompt);

  try {
    const response = await openai.createImage({
      prompt,
      n: 4,
      size: '512x512',
    });
    console.log('Resposta da OpenAI:', response.data);
    const imagens = response.data.data.map((item) => item.url);
    res.status(200).json({ imagens });
  } catch (error) {
    console.error('Erro ao gerar imagens:', error.message);
    console.error('Detalhes do erro:', error.response?.data || error);
    res.status(500).json({ error: `Erro ao gerar imagens: ${error.message}` });
  }
}
