export default async function handler(req, res) {
  const { text } = req.body;

  const voiceId = "TON_VOICE_ID_ELEVENLABS";
  const apiKey = process.env.ELEVEN_API_KEY;

  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch audio", details: await response.text() });
    }

    const audio = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename="voice.mp3"');
    return res.status(200).send(Buffer.from(audio));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
