import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function traduzirPrompt(promptPortugues) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Você é um tradutor especializado em português para inglês no contexto de design têxtil. Traduza o texto fornecido com precisão, substituindo todos os termos em português (estilos, cores, fundos) por seus equivalentes em inglês. Substitua 'e' por 'and' e garanta que o texto final seja 100% em inglês, sem deixar nenhuma palavra em português.",
        },
        { role: "user", content: `Traduza para o inglês: "${promptPortugues}"` },
      ],
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Erro ao traduzir prompt:", error);
    throw new Error("Falha na tradução do prompt para o inglês.");
  }
}

async function gerarPrompt(estilos, cores, fundo) {
  const estiloStr = Array.isArray(estilos)
    ? estilos.join(", ").replace(/,([^,]*)$/, " e $1")
    : estilos;
  const corStr = Array.isArray(cores)
    ? cores.join(", ").replace(/,([^,]*)$/, " e $1")
    : cores;
  const fundoStr = typeof fundo === "string" ? fundo : fundo.toString();

  const promptPortugues = `Uma estampa têxtil profissional em CMYK, contendo obrigatoriamente ${estiloStr} e as cores ${corStr}, com fundo ${fundoStr}, completada com um design harmonioso e técnicas avançadas de coloração por um designer profissional, alta resolução`;

  const promptIngles = await traduzirPrompt(promptPortugues);
  console.log("Prompt traduzido:", promptIngles); // Para depuração

  return promptIngles;
}

export default gerarPrompt;
