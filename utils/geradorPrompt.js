async function gerarPrompt(estilos, cores, fundo) {
  const estiloStr = Array.isArray(estilos)
    ? estilos.join(", ").replace(/,([^,]*)$/, " e $1")
    : estilos;
  const corStr = Array.isArray(cores)
    ? cores.join(", ").replace(/,([^,]*)$/, " e $1")
    : cores;
  const fundoStr = typeof fundo === "string" ? fundo : fundo.toString();

  const prompt = `Uma estampa têxtil realista com ${estiloStr}, usando apenas as cores ${corStr}, com fundo ${fundoStr}. Detalhes naturais de alta qualidade, pronta para edição em impressão digital.`;

  console.log("Prompt gerado:", prompt);
  return prompt;
}

export default gerarPrompt;
