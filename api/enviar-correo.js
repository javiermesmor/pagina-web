const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // 1. Verificar configuración del servidor
  const {
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY
  } = process.env;

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.error('Faltan variables de entorno de EmailJS');
    return res.status(500).json({ error: 'Configuración del servidor incompleta' });
  }

  // 2. Parseo seguro del cuerpo
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Formato JSON inválido' });
    }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Cuerpo de petición inválido' });
  }

  // 3. Validación estricta y límites de longitud en backend
  const subject = String(body.subject || '').trim();
  const from_name = String(body.from_name || '').trim();
  const from_email = String(body.from_email || '').trim();
  const message = String(body.message || '').trim();

  if (!subject || !from_name || !from_email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  if (!EMAIL_REGEX.test(from_email)) {
    return res.status(400).json({ error: 'Correo electrónico inválido' });
  }

  if (from_name.length > 120 || subject.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'Uno o más campos superan la longitud permitida' });
  }

  const data = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    accessToken: EMAILJS_PRIVATE_KEY,
    template_params: {
      subject,
      from_name,
      from_email,
      message,
      reply_to: from_email
    }
  };

  try {
    // 4. Timeout nativo con AbortSignal.timeout (Baseline)
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return res.status(200).json({ mensaje: 'Correo enviado con éxito' });
    }

    const errorText = await response.text();
    console.error('EmailJS rechazó el envío:', response.status, errorText);
    return res.status(502).json({ error: 'No se pudo procesar el envío en este momento' });
  } catch (error) {
    const isTimeout = error?.name === 'TimeoutError';
    console.error('Error al contactar con EmailJS:', error);
    return res.status(isTimeout ? 504 : 500).json({
      error: isTimeout ? 'Tiempo de espera agotado al enviar el correo' : 'Error interno del servidor'
    });
  }
}