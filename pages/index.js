import { useState } from 'react';
import EstampaPreview from '../components/EstampaPreview';

export default function Home() {
  const [estilo, setEstilo] = useState('');
  const [cores, setCores] = useState('');
  const [fundo, setFundo] = useState('');
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [psdUrl, setPsdUrl] = useState(null);
  const [highResUrls, setHighResUrls] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImagens([]);
    setPsdUrl(null);
    setHighResUrls([]);

    try {
      const res = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estilo, cores, fundo }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setImagens(data.imagens);

      const highResRes = await fetch('/api/highres-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagens: data.imagens }),
      });
      const highResData = await highResRes.json();
      if (highResData.error) throw new Error(highResData.error);
      setHighResUrls(highResData.highResUrls);

      const psdRes = await fetch('/api/download-psd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagens: highResData.highResUrls }),
      });
      const psdData = await psdRes.json();
      if (psdData.error) throw new Error(psdData.error);
      setPsdUrl(psdData.psdUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
              <EstampaPreview key={index} imageUrl={url} highResUrl={highResUrls[index]} />
            ))}
          </div>
          {psdUrl && (
            <div style={{ marginTop: '20px' }}>
              <a href={psdUrl} download="estampa.psd">
                <button style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>
                  Baixar PSD
                </button>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
