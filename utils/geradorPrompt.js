async function gerarPrompt(estilos, cores, fundo) {
  const estiloStr = Array.isArray(estilos)
    ? estilos.join(", ").replace(/,([^,]*)$/, " e $1")
    : estilos;
  const corStr = Array.isArray(cores)
    ? cores.join(", ").replace(/,([^,]*)$/, " e $1")
    : cores;
  const fundoStr = typeof fundo === "string" ? fundo : fundo.toString();

  const prompt = `Uma estampa têxtil seamless com padrão repetível, destacando ${estiloStr} em um layout tropical equilibrado, usando exclusivamente as cores ${corStr}, com fundo ${fundoStr}. Inclua martim-pescador e tulipas como elementos principais, com folhagem como fundo, distribuídos uniformemente para repetição perfeita. Detalhes realistas, bordas suaves e alinhadas, otimizada para impressão digital têxtil em alta resolução (300 DPI).`;

  console.log("Prompt gerado:", prompt);
  return prompt;
}

export default gerarPrompt;
