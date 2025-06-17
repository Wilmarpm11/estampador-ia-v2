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

    // Script Python com Pillow para tileabilidade aprimorada (espelhamento)
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

# Cria uma nova imagem com bordas espelhadas
new_img = Image.new('RGBA', (width * 3, height * 3))

# Copia a imagem original para o centro
new_img.paste(img, (width, height))

# Espelhamento das bordas para tileabilidade
# Esquerda
left_mirror = img.crop((0, 0, width // 2, height)).transpose(Image.FLIP_LEFT_RIGHT)
new_img.paste(left_mirror, (0, height))
# Direita
right_mirror = img.crop((width // 2, 0, width, height)).transpose(Image.FLIP_LEFT_RIGHT)
new_img.paste(right_mirror, (width * 2, height))
# Topo
top_mirror = img.crop((0, 0, width, height // 2)).transpose(Image.FLIP_TOP_BOTTOM)
new_img.paste(top_mirror, (width, 0))
# Base
bottom_mirror = img.crop((0, height // 2, width, height)).transpose(Image.FLIP_TOP_BOTTOM)
new_img.paste(bottom_mirror, (width, height * 2))

# Recorta para o tamanho original com bordas ajustadas
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

    // Lê o arquivo PSD e converte para base64
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
