import { isUsingHttps } from "./httpsChecker.mjs";
import chalk from "chalk";

export async function checkProtocol(url) {
  console.log(`Verificando el protocolo de ${url}`);
  const httpsData = { usingHttps: isUsingHttps(url) };
  if (httpsData.usingHttps) {
    console.log(chalk.green("La URL está utilizando HTTPS."));
  } else {
    console.log(chalk.red("La URL no está utilizando HTTPS."));
  }
}
