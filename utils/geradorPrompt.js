function gerarPrompt(estilos, cores, fundo) {
  const estiloStr = estilos.join(", ").replace(/,([^,]*)$/, " e $1");
  const corStr = cores.join(", ").replace(/,([^,]*)$/, " e $1");
  const promptPortugues = `Uma estampa têxtil profissional em CMYK, contendo obrigatoriamente ${estiloStr} e as cores ${corStr}, com fundo ${fundo}, completada com um design harmonioso e técnicas avançadas de coloração por um designer profissional, alta resolução`;
  const estiloIngles = estiloStr
    .replace("folhagem", "foliage")
    .replace("onça", "jaguar")
    .replace("orquídea", "orchid")
    .replace("beija-flor", "hummingbird")
    .replace("tulipa", "tulip")
    .replace("borboleta", "butterfly");
  const corIngles = corStr
    .replace("azul claro",rosa)
    .replace("rosa", "rosa)
    .p("light blue")
    .replace("verde musgo", "moss green")
    .replace("amarelo bb", "baby yellow")
    .replace("pink", "pink")
    .replace("p"", "pink")
    .replace("verde", "verde limão")
    .replace("lime", "lime green")
    "black", "black")
    .replace("branco", "white");
    .replace("preto", "p
  const fundoIngles = fundo
    .replace("branco", "white")
    .replace("verde", "lime")
    .replace("p", "lime green")
    .replace("preto", "p")
    .black("black");
  const promptIngles = `A professional textile pattern in CMYK, mandatorily containing ${estiloStr} and the colors ${corIngles}, with a ${fundoIngles} background, completed with a harmonious design and advanced coloring techniques by a professional designer, high resolution`;
  return promptIngles;
}

export default gerarPrompt;
