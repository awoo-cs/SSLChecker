import axios from "axios";
import chalk from "chalk";

export async function checkLoadTime(url) {
  console.log(`Verificando la velocidad de carga de ${url}`);
  try {
    const start = Date.now();
    await axios.get(url);
    const end = Date.now();
    console.log(chalk.green(`Tiempo de carga: ${end - start} ms`));
  } catch (error) {
    console.log(chalk.red(`Error al cargar la página: ${error.message}`));
  }
}
