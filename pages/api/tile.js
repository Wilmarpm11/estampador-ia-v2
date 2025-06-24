import { PythonShell } from 'python-shell';
import { Buffer } from 'buffer';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Imagem base64 não fornecida' });
    }

    // Salva a imagem temporariamente
    const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');
    const tempFilePath = '/tmp/input.png';
    fs.writeFileSync(tempFilePath, buffer);

    // Script Python com Pillow para ajuste básico
    const options = {
      mode: 'text',
      pythonPath: '/usr/bin/python3', // Ajuste conforme o ambiente
      scriptPath: __dirname,
      args: [tempFilePath, '/tmp/output.png'],
    };

    const pythonScript = `
from PIL import Image
import sys

input_path = sys.argv[1]
output_path = sys.argv[2]

img = Image.open(input_path)
width, height = img.size

# Ajuste básico de bordas (sem espelhamento complexo)
left = img.crop((0, 0, 1, height))
right = img.crop((width - 1, 0, width, height))
if not left.tobytes() == right.tobytes():
    img.paste(left, (width - 1, 0))

top = img.crop((0, 0, width, 1))
bottom = img.crop((height - 1, 0, width, height))
if not top.tobytes() == bottom.tobytes():
    img.paste(top, (0, height - 1))

# Salva como PNG (CMYK será feito externamente)
img.save(output_path, 'PNG')
    `;

    const { stdout, stderr } = await new Promise((resolve, reject) => {
      PythonShell.runString(pythonScript, options, (err, results) => {
        if (err) reject(err);
        resolve({ stdout: results, stderr: '' });
      });
    });

    // Lê o arquivo e converte para base64
    const outputBuffer = fs.readFileSync('/tmp/output.png');
    const outBase64 = `data:image/png;base64,${outputBuffer.toString('base64')}`;

    // Remove arquivos temporários
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync('/tmp/output.png');

    res.status(200).json({ imageUrl: outBase64 });
  } catch (error) {
    console.error("Erro ao processar imagem:", error);
    res.status(500).json({ error: `Erro ao processar imagem: ${error.message}` });
  }
}
