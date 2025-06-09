async function gerarPrompt(estilos, cores, fundo) {
  const estiloStr = Array.isArray(estilos)
    ? estilos.join(", ").replace(/,([^,]*)$/, " e $1")
    : estilos;
  const corStr = Array.isArray(cores)
    ? cores.join(", ").replace(/,([^,]*)$/, " e $1")
    : cores;
  const fundoStr = typeof fundo === "string" ? fundo : fundo.toString();

  // Prompt simplificado em português, com instruções específicas
  const prompt = `Uma estampa têxtil realista e tileável (padrão repetível sem bordas visíveis), contendo ${estiloStr}, nas cores ${corStr}, com fundo ${fundoStr}. Detalhes naturais e realistas de alta qualidade, pronta para impressão digital têxtil em alta resolução (300 DPI).`;

  console.log("Prompt gerado:", prompt); // Para depuração
  return prompt;
}

export default gerarPrompt;
