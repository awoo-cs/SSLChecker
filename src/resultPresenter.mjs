import chalk from "chalk";

function presentSSLResults(url, httpsData, sslData, vulnerabilities) {
  console.log(
    chalk.bold(`Resultados del análisis SSL para: ${chalk.underline(url)}\n`)
  );
  let generalStatus = "Seguro";

  if (!httpsData.usingHttps) {
    generalStatus = "Inseguro";
    console.log(
      chalk.bgRed.black(" ADVERTENCIA ") +
        ` ${chalk.red("El sitio no utiliza HTTPS.")}`
    );
  }

  if (!sslData.valid) {
    generalStatus = "Potencialmente inseguro";
    console.log(
      chalk.bgYellow.black(" PRECAUCIÓN ") +
        ` ${chalk.yellow(`Certificado SSL inválido: ${sslData.reason}`)}`
    );
  }

  console.log(`\n${chalk.bold("Detalles del SSL:")}`);
  console.log(`* HTTPS: ${httpsData.usingHttps ? "Sí" : "No"}`);
  console.log(`* Certificado SSL válido: ${sslData.valid ? "Sí" : "No"}`);
  console.log(`* Emisor del certificado: ${sslData.issuer || "No disponible"}`);
  console.log(
    `* Validez del certificado: Desde ${sslData.valid_from || "N/A"} hasta ${
      sslData.valid_to || "N/A"
    }`
  );

  printRecommendations(generalStatus);
}

function presentHeaderResults(url, headers) {
  console.log(
    chalk.bold(
      `Análisis de Encabezados de Seguridad para: ${chalk.underline(url)}\n`
    )
  );
  headers.forEach((header) => {
    const status = header.value
      ? chalk.bgGreen.black(" PRESENTE ")
      : chalk.bgRed.black(" AUSENTE ");
    console.log(
      `${status} ${chalk.yellow(
        `${header.name}: ${header.value || "No establecido"}`
      )}`
    );
  });

  printRecommendations("Seguro");
}

function printRecommendations(status) {
  console.log(`\n${chalk.bold("Recomendaciones:")}`);
  if (status === "Seguro") {
    console.log(chalk.green("No se requieren acciones inmediatas."));
  } else {
    console.log(
      chalk.red(
        "Revisa y ajusta los encabezados de seguridad según sea necesario."
      )
    );
  }
}

export { presentSSLResults, presentHeaderResults };
