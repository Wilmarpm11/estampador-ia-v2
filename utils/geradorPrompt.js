async function gerarPrompt(estilos, cores, fundo) {
  const estiloStr = Array.isArray(estilos)
    ? estilos.join(", ")
    : estilos;
  const corStr = Array.isArray(cores)
    ? cores.join(", ")
    : cores;
  const fundoStr = typeof fundo === "string" ? fundo : fundo.toString();

  const prompt = `Uma imagem inspirada em ${estiloStr}, usando cores como ${corStr}, com fundo ${fundoStr}. Deixe a criatividade fluir livremente para criar algo único e visualmente interessante.`;

  console.log("Prompt gerado:", prompt);
  return prompt;
}

export default gerarPrompt;
