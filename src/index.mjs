import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import { isValidUrl } from "./urlValidator.mjs";
import { isUsingHttps } from "./httpsChecker.mjs";
import { validateSslCertificate } from "./sslValidator.mjs";
import { analyzeSecurityHeaders } from "./securityHeadersAnalyzer.mjs";
import { presentSSLResults, presentHeaderResults } from "./resultPresenter.mjs";
import { checkLoadTime } from "./loadtimeChecker.mjs";
import { checkProtocol } from "./protocolChecker.mjs";

console.log(
  chalk.green(figlet.textSync("SSLChecker", { horizontalLayout: "full" }))
);

async function mainMenu() {
  try {
    const action = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "¿Qué te gustaría hacer?",
        choices: [
          "Validar URL",
          "Análisis de Encabezados de Seguridad",
          "Verificar Protocolo",
          "Verificar Tiempo de Carga",
          "Salir",
        ],
      },
    ]);

    switch (action.action) {
      case "Validar URL":
        await validateUrl();
        break;
      case "Análisis de Encabezados de Seguridad":
        await analyzeHeaders();
        break;
      case "Verificar Protocolo":
        const { url: urlProtocol } = await inquirer.prompt({
          type: "input",
          name: "url",
          message: "Ingresa la URL para verificar el protocolo:",
          validate: (input) =>
            isValidUrl(input) ? true : "Por favor ingresa una URL válida.",
        });
        await checkProtocol(urlProtocol);
        break;
      case "Verificar Tiempo de Carga":
        const { url: urlLoadTime } = await inquirer.prompt({
          type: "input",
          name: "url",
          message: "Ingresa la URL para verificar el tiempo de carga:",
          validate: (input) =>
            isValidUrl(input) ? true : "Por favor ingresa una URL válida.",
        });
        await checkLoadTime(urlLoadTime);
        break;
      case "Salir":
        console.log("Bye!");
        process.exit(0);
    }
  } catch (error) {
    console.error("Error en el menú principal: ", error);
  }
  await mainMenu();
}

async function validateUrl() {
  const { url } = await inquirer.prompt([
    {
      type: "input",
      name: "url",
      message: "Ingresa la URL que deseas validar:",
      validate: (input) =>
        isValidUrl(input) ? true : "Por favor ingresa una URL válida.",
    },
  ]);

  const httpsData = { usingHttps: isUsingHttps(url) };
  let sslData = { valid: false, reason: "No validado" };

  if (!httpsData.usingHttps) {
    console.log(chalk.red("La URL no utiliza HTTPS. No es segura."));
    presentSSLResults(url, httpsData, sslData, []);
  } else {
    try {
      sslData = await validateSslCertificate(url);
      console.log(
        chalk.green("La URL utiliza HTTPS y el certificado SSL es válido.")
      );
      presentSSLResults(url, httpsData, sslData, []);
    } catch (error) {
      console.log(
        chalk.red("Error al validar el certificado SSL: ", error.message)
      );
      sslData.reason = error.message;
      presentSSLResults(url, httpsData, sslData, []);
    }
  }
}

async function analyzeHeaders() {
  const { url } = await inquirer.prompt({
    type: "input",
    name: "url",
    message: "Ingresa la URL para analizar los encabezados de seguridad:",
    validate: (input) =>
      isValidUrl(input) ? true : "Por favor ingresa una URL válida.",
  });

  try {
    const headersData = await analyzeSecurityHeaders(url);
    if (headersData.success) {
      presentHeaderResults(url, headersData.headers);
    } else {
      console.error(
        chalk.red(
          "Error al analizar los encabezados de seguridad: ",
          headersData.error
        )
      );
      presentHeaderResults(url, []);
    }
  } catch (error) {
    console.error(
      chalk.red(
        "Error al analizar los encabezados de seguridad: ",
        error.message
      )
    );
    presentHeaderResults(url, []);
  }
}

mainMenu();
