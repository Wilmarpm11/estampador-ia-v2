import { useState } from 'react';

export default function Home() {
  const [estilo, setEstilo] = useState('');
  const [cores, setCores] = useState('');
  const [fundo, setFundo] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estilo, cores, fundo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar a imagem.');
      }

      if (!data.imageUrl) {
        throw new Error('Nenhuma imagem gerada pela API.');
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Estampador com IA</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Estilo da estampa (ex.: folhagem, onça pintada, orquídea-sapatinho, tulipa-amarela):
          <input
            type="text"
            value={estilo}
            onChange={(e) => setEstilo(e.target.value)}
          />
        </label>
        <br />
        <label>
          Cores (ex.: verde musgo, azul claro, marrom, rosa):
          <input
            type="text"
            value={cores}
            onChange={(e) => setCores(e.target.value)}
          />
        </label>
        <br />
        <label>
          Cor do fundo (ex.: branco):
          <input
            type="text"
            value={fundo}
            onChange={(e) => setFundo(e.target.value)}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar imagem com IA'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      {imageUrl && (
        <div>
          <h2>Imagem Gerada</h2>
          <img src={imageUrl} alt="Estampa gerada" style={{ maxWidth: '500px' }} />
          {/* Adicione aqui os botões de aprovação e download */}
        </div>
      )}
    </div>
  );
}
