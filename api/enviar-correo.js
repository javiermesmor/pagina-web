export default async function handler(req, res) {
  // Solo aceptamos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Preparamos los datos con tus variables de entorno secretas
  const data = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: req.body // Los datos del formulario que envíes desde el HTML
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
      res.status(500).json({ error: 'Fallo al enviar en EmailJS' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
}