export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // 1. Verificación: Comprobamos si Vercel está leyendo las variables de entorno
  console.log("Estado de Variables:");
  console.log("- Service ID:", process.env.EMAILJS_SERVICE_ID ? "Cargado" : "Falta");
  console.log("- Template ID:", process.env.EMAILJS_TEMPLATE_ID ? "Cargado" : "Falta");
  console.log("- Public Key:", process.env.EMAILJS_PUBLIC_KEY ? "Cargado" : "Falta");

  const data = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: req.body
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      res.status(200).json({ mensaje: 'Correo enviado con éxito' });
    } else {
      // 2. Capturamos la respuesta exacta de EmailJS si falla
      const errorText = await response.text();
      console.error("Error devuelto por EmailJS:", errorText);
      res.status(500).json({ error: 'Fallo al enviar en EmailJS' });
    }
  } catch (error) {
    console.error("Error interno del servidor:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
}
