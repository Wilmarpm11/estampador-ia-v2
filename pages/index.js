import { useState } from 'react';
import EstampaPreview from '../components/EstampaPreview';

export default function Home() {
  const [estilo, setEstilo] = useState('');
  const [cores, setCores] = useState('');
  const [fundo, setFundo] = useState('');
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPsd, setLoadingPsd] = useState({}); // Estado para rastrear loading por imagem

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImagens([]);

    try {
      const res = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estilo, cores, fundo }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro na API: ${res.status} - ${text}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setImagens(data.imagens);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPsd = async (imageUrl, index) => {
    setLoadingPsd((prev) => ({ ...prev, [index]: true }));
    try {
      // Primeiro, aumenta a resolução
      const highResRes = await fetch('/api/highres-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagens: [imageUrl] }), // Envia apenas a imagem selecionada
      });

      if (!highResRes.ok) {
        const text = await highResRes.text();
        throw new Error(`Erro na API de alta resolução: ${highResRes.status} - ${text}`);
      }

      const highResData = await highResRes.json();
      if (highResData.error) throw new Error(highResData.error);
      const highResUrl = highResData.highResUrls[0];

      // Depois, gera o PSD
      const psdRes = await fetch('/api/download-psd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagens: [highResUrl] }),
      });

      if (!psdRes.ok) {
        const text = await psdRes.text();
        throw new Error(`Erro na API de PSD: ${psdRes.status} - ${text}`);
      }

      const psdData = await psdRes.json();
      if (psdData.error) throw new Error(psdData.error);

      // Inicia o download do PSD
      const link = document.createElement('a');
      link.href = psdData.psdUrl;
      link.download = `estampa-${index + 1}.psd`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(`Erro ao baixar PSD: ${err.message}`);
    } finally {
      setLoadingPsd((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Estampador com IA</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Estilo da estampa (ex.: folhagem, onça pintada, orquídea-sapatinho, tulipa-amarela): </label>
          <input
            type="text"
            value={estilo}
            onChange={(e) => setEstilo(e.target.value)}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div>
          <label>Cores (ex.: verde musgo, azul claro, marrom, rosa): </label>
          <input
            type="text"
            value={cores}
            onChange={(e) => setCores(e.target.value)}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div>
          <label>Cor do fundo (ex.: branco): </label>
          <input
            type="text"
            value={fundo}
            onChange={(e) => setFundo(e.target.value)}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none' }}>
          {loading ? 'Gerando...' : 'Gerar imagem com IA'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      {imagens.length > 0 && (
        <div>
          <h2>Imagens Geradas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {imagens.map((url, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <EstampaPreview imageUrl={url} />
                <button
                  onClick={() => handleDownloadPsd(url, index)}
                  disabled={loadingPsd[index]}
                  style={{ marginTop: '10px', padding: '8px', background: '#28a745', color: 'white', border: 'none' }}
                >
                  {loadingPsd[index] ? 'Processando...' : 'Baixar PSD'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
