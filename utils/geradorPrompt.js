async function gerarPrompt(estilos, cores, fundo) {
  const estiloStr = Array.isArray(estilos)
    ? estilos.join(", ").replace(/,([^,]*)$/, " e $1")
    : estilos;
  const corStr = Array.isArray(cores)
    ? cores.join(", ").replace(/,([^,]*)$/, " e $1")
    : cores;
  const fundoStr = typeof fundo === "string" ? fundo : fundo.toString();

  // Prompt refinado para evitar defeitos nas bordas
  const prompt = `Uma estampa têxtil realista e perfeitamente tileável (padrão repetível sem bordas visíveis ou sobreposições), com ${estiloStr} dispostos de forma simétrica e equilibrada, usando apenas as cores ${corStr}, com fundo ${fundoStr}. Elementos naturais (aves, flores, folhas) repetidos em um layout contínuo e simétrico, com bordas uniformes e transições suaves entre repetições, sem cortes ou desalinhamentos visíveis, detalhes realistas de alta qualidade, pronta para impressão digital têxtil em 300 DPI.`;

  console.log("Prompt gerado:", prompt); // Para depuração
  return prompt;
}

export default gerarPrompt;
