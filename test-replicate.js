const fetch = require('node-fetch');

async function testReplicate() {
  // COLE SEU TOKEN AQUI (substitua a linha abaixo)
  const token = 'r8_N4v3vvzvHRXq1f9Mqrg1szko90NjDTB0Q3J1S' ; 
  
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
