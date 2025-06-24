async function gerarPrompt(estilos, cores, fundo) {
  const estiloStr = Array.isArray(estilos)
    ? estilos.join(", ")
    : estilos;
  const corStr = Array.isArray(cores)
    ? cores.join(", ")
    : cores;
  const fundoStr = typeof fundo === "string" ? fundo : fundo.toString();

  const prompt = `Uma estampa têxtil inspirada em ${estiloStr}, usando cores como ${corStr}, com fundo ${fundoStr}. Estilo tropical e natural, ideal para impressão têxtil, com liberdade criativa para elementos como pássaros, flores e folhas.`;

  console.log("Prompt gerado:", prompt);
  return prompt;
}

export default gerarPrompt;
