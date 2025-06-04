console.log('Inicializando API /api/gerar'); // Log inicial

import { OpenAI } from 'openai';
import { gerarPrompt } from '../../utils/geradorPrompt';

console.log('Módulo OpenAI importado com sucesso'); // Log após importação

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log('Cliente OpenAI inicializado'); // Log após inicialização

export default async function handler(req, res) {
  console.log('Requisição recebida em /api/gerar'); // Log ao receber requisição

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
    const response = await openai.images.generate({
      prompt,
      n: 4,
      size: '512x512',
    });
    console.log('Resposta da OpenAI:', response.data);
    const imagens = response.data.map((item) => item.url);
    res.status(200).json({ imagens });
  } catch (error) {
    console.error('Erro ao gerar imagens:', error.message);
    console.error('Detalhes do erro:', error.response?.data || error);
    res.status(500).json({ error: `Erro ao gerar imagens: ${error.message}` });
  }
}
