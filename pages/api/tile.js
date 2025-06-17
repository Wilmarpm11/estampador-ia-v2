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

    // Script Python com Pillow para tileabilidade e conversão para CMYK
    const options = {
      mode: 'text',
      pythonPath: '/usr/bin/python3', // Ajuste conforme o ambiente
      scriptPath: __dirname,
      args: [tempFilePath, '/tmp/output.psd'],
    };

    const pythonScript = `
from PIL import Image
import sys

input_path = sys.argv[1]
output_path = sys.argv[2]

img = Image.open(input_path)
width, height = img.size

# Cria uma nova imagem com bordas ajustadas
new_img = Image.new('RGBA', (width * 2, height * 2))

# Copia a imagem original para o centro
new_img.paste(img, (width // 2, height // 2))

# Ajusta bordas para tileabilidade
left = img.crop((0, 0, 1, height))
right = img.crop((width - 1, 0, width, height))
if not left.tobytes() == right.tobytes():
    new_img.paste(left, (0, height // 2))

top = img.crop((0, 0, width, 1))
bottom = img.crop((height - 1, 0, width, height))
if not top.tobytes() == bottom.tobytes():
    new_img.paste(top, (width // 2, 0))

# Recorta de volta ao tamanho original
final_img = new_img.crop((width // 2, height // 2, width * 1.5, height * 1.5))

# Converte para CMYK e salva como PSD
final_img = final_img.convert('CMYK')
final_img.save(output_path, format='PSD', quality=95, save_all=True)
    `;

    const { stdout, stderr } = await new Promise((resolve, reject) => {
      PythonShell.runString(pythonScript, options, (err, results) => {
        if (err) reject(err);
        resolve({ stdout: results, stderr: '' });
      });
    });

    // Lê o arquivo PSD e converte para base64 (se necessário)
    const outputBuffer = fs.readFileSync('/tmp/output.psd');
    const outBase64 = `data:application/psd;base64,${outputBuffer.toString('base64')}`;

    // Remove arquivos temporários
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync('/tmp/output.psd');

    res.status(200).json({ imageUrl: outBase64 });
  } catch (error) {
    console.error("Erro ao processar imagem:", error);
    res.status(500).json({ error: `Erro ao processar imagem: ${error.message}` });
  }
}
