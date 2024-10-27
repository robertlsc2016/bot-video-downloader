const puppeteer = require("puppeteer");
const fs = require("fs");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { prefixBot } = require("../../settings/necessary-settings");
const { pathTo } = require("../../utils/path-orchestrator");
const logger = require("../../logger");

const eleicoes = async (messageBody) => {
  console.log(messageBody);
  console.log(messageBody.replace(`/bot eleições `, "").split(","));

  console.log(messageBody.replace(`/bot eleições `, "").split(",")[0]);
  console.log(messageBody.replace(`/bot eleições `, "").split(",")[1]);

  const cidade = messageBody.replace(`/bot eleições `, "").split(",")[0];
  const estado = messageBody.replace(`/bot eleições `, "").split(",")[1];

  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 300, height: 600 });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("CapacitorStorage.onboardingVisto", "1");
    localStorage.setItem("CapacitorStorage.termosDeUsoAceitos", "1");
  });

  const n_eleicao = await pegar_n_eleicao({ cidade, estado });

  if (!n_eleicao) {
    return;
  }

  const URL = `https://resultados.tse.jus.br/oficial/app/index.html#/m/eleicao;e=e620;uf=${estado};mu=${n_eleicao};ufbu=mt;mubu=${n_eleicao};tipo=3/resultados`;

  console.log(URL);

  const clip = {
    x: 0,
    y: 100,
    width: 300,
    height: 435,
  };
  // Acesse a URL desejada
  await page.goto(URL);
  setTimeout(async () => {
    await page.screenshot({ path: "medias\\images\\screenshot.jpg", clip });
    logger.info("arquivo salvo em medias\\images\\screenshot.jpg");
    await browser.close();
    return await genericSendMessageOrchestrator({
      type: "media",
      filePath: "medias\\images\\screenshot.jpg",
      textMedia: false,
      msg: "Eleições 2024! Globo a gente se liga em você!",
    });
  }, 800);
};

const pegar_n_eleicao = async ({ estado, cidade }) => {
  const data = fs.readFileSync("data\\cod-mu.json", "utf8");
  const jsonData = JSON.parse(data);

  const cidades_estado = jsonData.abr.filter(
    (state) => state.cd.toLowerCase() == estado.toLowerCase()
  );

  if (cidades_estado.length == 0) {
    await genericSendMessageOrchestrator({
      type: "text",
      msg: `Possívelmente, UF inválida!\nTente o comando assim:\n[Exemplo] ${prefixBot} eleições Cuiabá,MT`,
    });
    return false;
  }

  const selectCity = cidades_estado[0]?.mu?.filter((city) => {
    if (
      city.nm
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") ==
      cidade
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    ) {
      return city;
    }
  });

  if (selectCity.length == 0) {
    await genericSendMessageOrchestrator({
      type: "text",
      msg: `Possívelmente, Cidade inválida!\nTente o comando assim:\n[Exemplo] ${prefixBot} eleições Cuiabá,MT`,
    });
    return false;
  }

  return selectCity ? selectCity[0].cd : [];
};

module.exports = {
  eleicoes,
};
