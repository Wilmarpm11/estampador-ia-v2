const fetch = require('node-fetch');

async function testReplicate() {
  // COLE SEU TOKEN AQUI (substitua a linha abaixo)
  const token = 'COLE_SEU_TOKEN_REPLICATE_AQUI'; 
  
  try {
    console.log('🧪 Testando sua API Replicate...');
    
    const response = await fetch('https://api.replicate.com/v1/models', {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('✅ API Replicate funcionando perfeitamente!');
      console.log('🎯 Pronto para o próximo passo!');
    } else {
      console.log('❌ Problema com o token');
      console.log('Status:', response.status);
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testReplicate();
