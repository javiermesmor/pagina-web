export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Protección adicional: asegura que los datos sean un objeto JSON válido
  const parametros = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  const data = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY, // Autenticación estricta de backend
    template_params: parametros
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
      const errorText = await response.text();
      console.error("EmailJS rechazó el envío:", errorText);
      res.status(500).json({ error: 'Fallo al enviar', detalles: errorText });
    }
  } catch (error) {
    console.error("Error interno:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
}
