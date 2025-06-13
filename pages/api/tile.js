import { Buffer } from 'buffer';
     import cv2 from 'opencv4nodejs'; // Note: Requires opencv4nodejs installed
     import { Readable } from 'stream';

     export default async function handler(req, res) {
       if (req.method !== 'POST') {
         return res.status(405).json({ error: 'Método não permitido' });
       }

       try {
         const { imageBase64 } = req.body;
         if (!imageBase64) {
           return res.status(400).json({ error: 'Imagem base64 não fornecida' });
         }

         // Converte base64 para buffer
         const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');

         // Carrega a imagem com OpenCV
         const img = cv2.imdecode(buffer, cv2.IMREAD_COLOR);
         const h = img.rows;
         const w = img.cols;

         // Ajusta bordas para tileabilidade
         const left = img.col(0);
         const right = img.col(w - 1);
         if (!left.equals(right)) {
           img.setCol(w - 1, left);
         }
         const top = img.row(0);
         const bottom = img.row(h - 1);
         if (!top.equals(bottom)) {
           img.setRow(h - 1, top);
         }

         // Converte de volta para base64
         const outBuffer = cv2.imencode('.png', img);
         const outBase64 = `data:image/png;base64,${outBuffer.toString('base64')}`;

         res.status(200).json({ imageUrl: outBase64 });
       } catch (error) {
         console.error("Erro ao processar imagem:", error);
         res.status(500).json({ error: `Erro ao processar imagem: ${error.message}` });
       }
     }
