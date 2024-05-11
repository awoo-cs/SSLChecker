import https from "https";
import { URL } from "url";

async function validateSslCertificate(urlString) {
  const url = new URL(urlString);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      agent: false,
      rejectUnauthorized: false,
      ciphers: "ALL",
    };

    const req = https.request(options, (res) => {
      const certificate = res.socket.getPeerCertificate();

      if (res.socket.authorized) {
        resolve({
          valid: true,
          issuer: certificate.issuer.CN,
          valid_from: certificate.valid_from,
          valid_to: certificate.valid_to,
        });
      } else if (certificate.subject) {
        resolve({
          valid: false,
          reason: "Certificado no válido.",
          issuer: certificate.issuer.CN,
          valid_from: certificate.valid_from,
          valid_to: certificate.valid_to,
        });
      } else {
        reject(new Error("No se pudo obtener el certificado SSL."));
      }
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.end();
  });
}

export { validateSslCertificate };
