async function gerarPrompt(estilos, cores, fundo) {
  const estiloStr = Array.isArray(estilos)
    ? estilos.join(", ").replace(/,([^,]*)$/, " e $1")
    : estilos;
  const corStr = Array.isArray(cores)
    ? cores.join(", ").replace(/,([^,]*)$/, " e $1")
    : cores;
  const fundoStr = typeof fundo === "string" ? fundo : fundo.toString();

  const prompt = `Uma estampa têxtil seamless com padrão repetível, featuring ${estiloStr}, usando exclusivamente as cores ${corStr}, com fundo ${fundoStr}. Detalhes ultra-realistas, bordas perfeitamente alinhadas para repetição contínua, otimizada para impressão digital têxtil em alta resolução (300 DPI), com elementos naturais distribuídos uniformemente.`;

  console.log("Prompt gerado:", prompt);
  return prompt;
}

export default gerarPrompt;
