export default function EstampaPreview({ imageUrl, highResUrl }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <img src={imageUrl} alt="Estampa gerada" style={{ width: '100%', height: 'auto' }} />
      {highResUrl && (
        <a href={highResUrl} download="estampa-highres.png">
          <button style={{ marginTop: '10px', padding: '5px 10px', background: '#0070f3', color: 'white', border: 'none' }}>
            Baixar PNG (Alta Resolução)
          </button>
        </a>
      )}
    </div>
  );
}
