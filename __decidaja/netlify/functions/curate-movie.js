// Using native global fetch

const CURATED_REVIEWS = {
  'gladiador': 'Vencedor de 5 Oscars, incluindo Melhor Filme, este clássico moderno equilibra perfeitamente um drama humano comovente com sequências de ação visceral e atuações brilhantes de Russell Crowe e Joaquin Phoenix. Uma escolha grandiosa e à prova de falhas para a sua noite de cinema.',
  'superbad: é hoje': 'Aclamado pela crítica por seu roteiro afiado e química impecável, este filme é amplamente considerado uma das melhores comédias adolescentes do século XXI. É a escolha perfeita para descontrair, rir alto e reviver a nostalgia juvenil sem nenhuma complicação.',
  'interestelar': 'Vencedor do Oscar de Melhores Efeitos Visuais, o épico espacial de Christopher Nolan é aclamado por sua precisão científica e narrativa emocionante sobre amor e sobrevivência. É uma experiência cinematográfica fascinante e visualmente hipnotizante, ideal para quem quer refletir.',
  'o auto da compadecida': 'Um dos maiores marcos do cinema brasileiro, a adaptação da obra de Ariano Suassuna é uma obra-prima de humor, sátira social e cultura popular. Com atuações lendárias de Matheus Nachtergaele e Selton Mello, garante diversão de altíssima qualidade do início ao fim.',
  'batman: o cavaleiro das trevas': 'Vencedor de 2 Oscars e considerado o melhor filme de super-herói de todos os tempos, este suspense policial tenso e realista conta com a performance icônica de Heath Ledger como Coringa. Um clássico moderno que prende a atenção do primeiro ao último minuto.',
  'matrix': 'Vencedor de 4 Oscars e revolucionário no uso de efeitos especiais, esta ficção científica é um marco cultural definitivo. Com ação primorosa e questionamentos existenciais cativantes, é uma obra-prima atemporal imperdível.',
  'clube da luta': 'Com direção impecável de David Fincher e performances lendárias de Brad Pitt e Edward Norton, este clássico dos anos 90 é um estudo fascinante sobre a psicologia moderna e a cultura do consumo. Um thriller psicológico essencial com um dos finais mais icônicos do cinema.',
  'um sonho de liberdade': 'Avaliado como o filme número 1 da história no IMDb por décadas, esta emocionante história de amizade e resiliência carcerária conquistou o público mundial com sua mensagem otimista e atuações primorosas de Tim Robbins e Morgan Freeman. Uma obra indispensável e profunda.',
  'titanic': 'Vencedor do recorde histórico de 11 Oscars, este drama épico de James Cameron combina um romance atemporal inesquecível com a grandiosidade técnica de um dos eventos mais conhecidos da história. Um filme emocionante que marcou gerações.',
  'como se fosse a primeira vez': 'Uma das comédias românticas mais adoradas dos anos 2000, traz a química perfeita de Adam Sandler e Drew Barrymore em um cenário havaiano acolhedor. Divertido, carismático e surpreendentemente tocante, é ideal para aquecer o coração sem esforço.',
  'la la land: cantando estações': 'Vencedor de 6 Oscars, esta obra-prima moderna de Damien Chazelle é uma carta de amor vibrante ao jazz, a Los Angeles e aos sonhadores. Visualmente deslumbrante e com uma trilha sonora memorável, oferece uma experiência melancólica e inspiradora na mesma medida.',
  'corra!': 'Vencedor do Oscar de Melhor Roteiro Original, este suspense de Jordan Peele revolucionou o terror contemporâneo com sua crítica social afiada e tensão psicológica crescente. Um filme inteligente, tenso e extremamente original do início ao fim.'
};

const RANDOM_CRITIQUES = [
  'Este aclamado filme se destaca pela direção artística impecável e atuações marcantes. Com uma narrativa envolvente e ritmo primoroso, conquistou elogios em festivais mundiais e é uma recomendação segura e reconfortante para quem quer entretenimento de alta qualidade hoje.',
  'Com roteiro inteligente e excelente ritmo, esta produção consolidou-se como uma favorita do público. A crítica elogia a capacidade do longa de prender a atenção do início ao fim, tornando-o a escolha perfeita para descontrair na sua noite de lazer no sofá.',
  'Um marco contemporâneo em seu gênero, o filme reúne uma atmosfera cativante com diálogos inspirados. É amplamente aclamado como uma escolha irresistível que equilibra relevância crítica com alto teor de diversão, ideal para reduzir a indecisão pós-trabalho.',
  'Uma das obras mais comentadas do seu ano de lançamento, este filme oferece uma experiência visual primorosa aliada a uma trilha marcante. Sua aceitação unânime o qualifica como uma sugestão livre de arrependimentos para assistir agora mesmo.'
];

function getLocalCritique(title) {
  const cleanTitle = title.trim().toLowerCase();
  
  // Try direct match
  if (CURATED_REVIEWS[cleanTitle]) {
    return CURATED_REVIEWS[cleanTitle];
  }
  
  // Try substring match
  for (const key of Object.keys(CURATED_REVIEWS)) {
    if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
      return CURATED_REVIEWS[key];
    }
  }

  // Generate generic based on title string hash to keep it deterministic per title
  let hash = 0;
  for (let i = 0; i < cleanTitle.length; i++) {
    hash += cleanTitle.charCodeAt(i);
  }
  const index = hash % RANDOM_CRITIQUES.length;
  return RANDOM_CRITIQUES[index];
}

exports.handler = async (event) => {
  const { title = '', synopsis = '' } = event.queryStringParameters || {};
  
  if (!title) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Title query parameter is required' })
    };
  }

  const llmUrl = process.env.RUBEN_LLM_API_URL;
  const llmKey = process.env.RUBEN_LLM_API_KEY;

  if (llmUrl && llmKey) {
    try {
      // Set up a promise that times out after 3.0 seconds (leaving 0.2s padding for total 3.2s cutoff)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('LLM API Timeout')), 3000);
      });

      // Call Ruben's LLM
      const apiCallPromise = (async () => {
        const prompt = `Você é um crítico de cinema profissional. Escreva um parágrafo curto de justificativa (até 3 linhas) explicando por que o filme "${title}" é a escolha perfeita para assistir hoje à noite. Use prova social (críticas, prêmios ou impacto cultural) para mitigar a indecisão do espectador. Seja convincente e escreva em Português.`;
        
        let response;
        if (llmUrl.includes('openai.com') || llmUrl.includes('/v1/')) {
          // OpenAI compatible call
          response = await fetch(llmUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${llmKey}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 150,
              temperature: 0.7
            })
          });
        } else {
          // Generic LLM endpoint call
          response = await fetch(llmUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': llmKey
            },
            body: JSON.stringify({ prompt, title, synopsis })
          });
        }

        if (!response.ok) {
          throw new Error(`LLM API responded with status ${response.status}`);
        }

        const data = await response.json();
        
        // Try parsing different API layouts
        let curationText = '';
        if (data.choices && data.choices[0] && data.choices[0].message) {
          curationText = data.choices[0].message.content;
        } else if (data.curation) {
          curationText = data.curation;
        } else if (data.text) {
          curationText = data.text;
        } else if (typeof data === 'string') {
          curationText = data;
        }
        
        if (!curationText || curationText.trim().length === 0) {
          throw new Error('LLM returned empty response');
        }

        return curationText.trim();
      })();

      // Race API call with timeout
      const result = await Promise.race([apiCallPromise, timeoutPromise]);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ curation: result })
      };

    } catch (err) {
      console.warn(`LLM failed or timed out: ${err.message}. Falling back to local reviewer generator.`);
    }
  }

  // Fallback to local review engine
  const localCritique = getLocalCritique(title);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ curation: localCritique })
  };
};
