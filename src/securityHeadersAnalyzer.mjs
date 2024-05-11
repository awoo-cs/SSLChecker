import axios from "axios";

async function analyzeSecurityHeaders(url) {
  try {
    const config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    };
    const response = await axios.get(url, config);
    const headers = response.headers;

    const securityHeaders = [
      {
        name: "Strict-Transport-Security",
        value: headers["strict-transport-security"],
        description: "Strict-Transport-Security",
      },
      {
        name: "Content-Security-Policy",
        value: headers["content-security-policy"],
        description: "Content-Security-Policy",
      },
      {
        name: "X-Frame-Options",
        value: headers["x-frame-options"],
        description: "X-Frame-Options",
      },
      {
        name: "X-XSS-Protection",
        value: headers["x-xss-protection"],
        description: "X-XSS-Protection",
      },
      {
        name: "X-Content-Type-Options",
        value: headers["x-content-type-options"],
        description: "X-Content-Type-Options",
      },
      {
        name: "Referrer-Policy",
        value: headers["referrer-policy"],
        description: "Referrer-Policy",
      },
      {
        name: "Permissions-Policy",
        value: headers["permissions-policy"],
        description: "Permissions-Policy",
      },
      {
        name: "Public-Key-Pins",
        value: headers["public-key-pins"],
        description: "Public-Key-Pins",
      },
    ];

    return { success: true, headers: securityHeaders };
  } catch (error) {
    console.error(
      "Error al analizar los encabezados de seguridad: ",
      error.message
    );
    return { success: false, error: error.message };
  }
}

export { analyzeSecurityHeaders };
