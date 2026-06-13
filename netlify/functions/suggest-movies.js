// Using native global fetch

const GENRE_MAP = {
  'action': 28,
  'comedy': 35,
  'drama': 18,
  'romance': 10749,
  'horror': 27,
  'sci-fi': 878,
  'scifi': 878,
  'animation': 16,
  'thriller': 53,
  'adventure': 12
};

const MOCK_MOVIES = {
  'action': [
    { id: 1, title: 'Gladiador', vote_average: 8.2, release_date: '2000-05-01', overview: 'Um ex-general romano jura vingança contra o imperador corrupto que assassinou sua família e o condenou à escravidão.', poster_path: 'https://image.tmdb.org/t/p/w500/or0650hHzZSL31fe4c0pqzMsx47.jpg' },
    { id: 2, title: 'Batman: O Cavaleiro das Trevas', vote_average: 8.5, release_date: '2008-07-16', overview: 'Com a ajuda de Jim Gordon e Harvey Dent, Batman mantém a ordem em Gotham até que um gênio do crime conhecido como Coringa espalha o caos.', poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tWGBCg2mRZr3efg8tCjOclgg.jpg' },
    { id: 3, title: 'Mad Max: Estrada da Fúria', vote_average: 8.1, release_date: '2015-05-13', overview: 'Em um mundo pós-apocalíptico, Max ajuda uma mulher rebelde e um grupo de prisioneiras a escapar de um tirano implacável.', poster_path: 'https://image.tmdb.org/t/p/w500/8tZYtuWe245df7Lr4Z76u7gJ512.jpg' },
    { id: 4, title: 'Matrix', vote_average: 8.7, release_date: '1999-03-30', overview: 'Um programador descobre que a realidade em que vive é uma simulação criada por máquinas e se junta a uma rebelião para libertar a humanidade.', poster_path: 'https://image.tmdb.org/t/p/w500/lh4aUD818eeCLLil5U2mzzhkV6W.jpg' },
    { id: 5, title: 'Duro de Matar', vote_average: 8.0, release_date: '1988-07-15', overview: 'Um policial de Nova York tenta salvar sua esposa e outros reféns feitos por terroristas alemães durante uma festa de Natal em Los Angeles.', poster_path: 'https://image.tmdb.org/t/p/w500/mc75Q424g5j9jW51p34z7BffE67.jpg' },
    { id: 6, title: 'John Wick 4: Baba Yaga', vote_average: 7.8, release_date: '2023-03-22', overview: 'John Wick descobre um caminho para derrotar a Alta Cúpula, mas precisa enfrentar um novo e poderoso inimigo global.', poster_path: 'https://image.tmdb.org/t/p/w500/vZloFAK7nUE0TyLEBBv4wV6625n.jpg' },
    { id: 7, title: 'Top Gun: Maverick', vote_average: 8.3, release_date: '2022-05-24', overview: 'Após mais de trinta anos de serviço, Maverick continua ativo como piloto de testes, mas precisa treinar uma nova turma de graduados.', poster_path: 'https://image.tmdb.org/t/p/w500/w7nZqdFh91OI8z5z2n9Hoo54B5V.jpg' },
    { id: 8, title: 'O Exterminador do Futuro 2', vote_average: 8.1, release_date: '1991-07-03', overview: 'Um ciborgue idêntico ao que tentou matar Sarah Connor é enviado de volta no tempo para proteger seu filho adolescente de um modelo mais avançado.', poster_path: 'https://image.tmdb.org/t/p/w500/5y8oW05N91u0q8xQxNl5G52F94b.jpg' }
  ],
  'comedy': [
    { id: 11, title: 'Superbad: É Hoje', vote_average: 7.6, release_date: '2007-08-17', overview: 'Dois amigos adolescentes co-dependentes enfrentam a ansiedade da separação enquanto tentam comprar bebida para uma festa escolar.', poster_path: 'https://image.tmdb.org/t/p/w500/ek89m2l5yUuU7C6p8oUeXmJd20p.jpg' },
    { id: 12, title: 'Se Beber, Não Case!', vote_average: 7.7, release_date: '2009-06-02', overview: 'Três padrinhos de casamento acordam de uma despedida de solteiro em Las Vegas sem memória da noite anterior e sem sinal do noivo.', poster_path: 'https://image.tmdb.org/t/p/w500/7pEovZp2GZJj3k5zN9o4oK1rS2t.jpg' },
    { id: 13, title: 'O Auto da Compadecida', vote_average: 8.8, release_date: '2000-09-10', overview: 'As aventuras dos nordestinos João Grilo e Chicó, que vivem de golpes para sobreviver no sertão, enfrentando a morte e o julgamento final.', poster_path: 'https://image.tmdb.org/t/p/w500/m8JnXmQr9vXTmPvS1nuR3Z4o0rW.jpg' },
    { id: 14, title: 'As Branquelas', vote_average: 7.0, release_date: '2004-06-23', overview: 'Dois agentes do FBI caídos em desgraça disfarçam-se de herdeiras ricas para evitar sequestros e salvar seus empregos.', poster_path: 'https://image.tmdb.org/t/p/w500/8tZYtuWe245df7Lr4Z76u7gJ512.jpg' },
    { id: 15, title: 'Curtindo a Vida Adoidado', vote_average: 7.8, release_date: '1986-06-11', overview: 'Um estudante de ensino médio decide tirar um dia de folga da escola fingindo estar doente, embarcando em uma aventura em Chicago com seus amigos.', poster_path: 'https://image.tmdb.org/t/p/w500/9kC1e3e7fG3Q5k5J8H2o1K6rS2t.jpg' },
    { id: 16, title: 'Debi & Loide', vote_average: 7.3, release_date: '1994-12-16', overview: 'Dois amigos extremamente bem-intencionados, mas incrivelmente estúpidos, viajam pelo país para devolver uma maleta cheia de dinheiro.', poster_path: 'https://image.tmdb.org/t/p/w500/8kC1e3e7fG3Q5k5J8H2o1K6rS2t.jpg' }
  ],
  'drama': [
    { id: 21, title: 'Um Sonho de Liberdade', vote_average: 8.9, release_date: '1994-09-23', overview: 'Um banqueiro condenado injustamente por homicídio duplo faz amizade com um prisioneiro veterano e busca redenção na prisão de Shawshank.', poster_path: 'https://image.tmdb.org/t/p/w500/9O7gL65iEnS4sp4877kRcxbbgWi.jpg' },
    { id: 22, title: 'Forrest Gump: O Contador de Histórias', vote_average: 8.8, release_date: '1994-06-23', overview: 'A vida de um homem simples do Alabama com QI baixo que testemunha e influencia alguns dos principais eventos históricos dos EUA.', poster_path: 'https://image.tmdb.org/t/p/w500/arw2tUqwcS64n558clHcYqIfj7M.jpg' },
    { id: 23, title: 'Clube da Luta', vote_average: 8.8, release_date: '1999-10-15', overview: 'Um trabalhador de escritório insone e um fabricante de sabonetes excêntrico criam uma organização de luta clandestina.', poster_path: 'https://image.tmdb.org/t/p/w500/pB817wSHeGI7Au0tRN6ZgvK7tO1.jpg' },
    { id: 24, title: 'O Poderoso Chefão', vote_average: 9.2, release_date: '1972-03-14', overview: 'O patriarca de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante.', poster_path: 'https://image.tmdb.org/t/p/w500/3bhkrj6UGV6yy7gH2Bz2Nu41piC.jpg' },
    { id: 25, title: 'Cidade de Deus', vote_average: 8.6, release_date: '2002-08-30', overview: 'Nas favelas do Rio de Janeiro, dois rapazes seguem caminhos diferentes: um se torna fotógrafo e o outro vira traficante de drogas.', poster_path: 'https://image.tmdb.org/t/p/w500/8tZYtuWe245df7Lr4Z76u7gJ512.jpg' }
  ],
  'romance': [
    { id: 31, title: 'Titanic', vote_average: 7.9, release_date: '1997-11-18', overview: 'Um artista de classe baixa e uma aristocrata rica se apaixonam a bordo do luxuoso e trágico RMS Titanic.', poster_path: 'https://image.tmdb.org/t/p/w500/9Xw0175T7q5N1V9xZ8tCjOclgg.jpg' },
    { id: 32, title: 'Como Se Fosse a Primeira Vez', vote_average: 7.3, release_date: '2004-02-13', overview: 'Um biólogo marinho se apaixona por uma professora de arte que sofre de perda de memória de curto prazo e precisa conquistá-la todos os dias.', poster_path: 'https://image.tmdb.org/t/p/w500/8kC1e3e7fG3Q5k5J8H2o1K6rS2t.jpg' },
    { id: 33, title: 'La La Land: Cantando Estações', vote_average: 7.9, release_date: '2016-11-29', overview: 'Um pianista de jazz e uma aspirante a atriz se apaixonam em Los Angeles enquanto perseguem seus sonhos de sucesso profissional.', poster_path: 'https://image.tmdb.org/t/p/w500/l49lG27vSsdn19pX8tCjOclgg.jpg' },
    { id: 34, title: 'Questão de Tempo', vote_average: 7.8, release_date: '2013-09-04', overview: 'Ao completar 21 anos, Tim descobre que os homens de sua família têm a capacidade de viajar no tempo e tenta melhorar sua vida amorosa.', poster_path: 'https://image.tmdb.org/t/p/w500/6y7nZqdFh91OI8z5z2n9Hoo54B5V.jpg' }
  ],
  'horror': [
    { id: 41, title: 'O Iluminado', vote_average: 8.4, release_date: '1980-05-23', overview: 'Um escritor aceita um emprego de zelador de inverno em um hotel isolado, onde uma presença espiritual maligna o leva à loucura.', poster_path: 'https://image.tmdb.org/t/p/w500/x7nHJj3k5zN9o4oK1rS2t.jpg' },
    { id: 42, title: 'Invocação do Mal', vote_average: 7.5, release_date: '2013-07-17', overview: 'Investigadores paranormais trabalham para ajudar uma família aterrorizada por uma presença sombria em sua fazenda isolada.', poster_path: 'https://image.tmdb.org/t/p/w500/xG2tWGBCg2mRZr3efg8tCjOclgg.jpg' },
    { id: 43, title: 'Corra!', vote_average: 7.6, release_date: '2017-02-24', overview: 'Um jovem fotógrafo negro viaja para conhecer a família de sua namorada branca e descobre segredos sinistros por trás da recepção calorosa.', poster_path: 'https://image.tmdb.org/t/p/w500/fgZYtuWe245df7Lr4Z76u7gJ512.jpg' },
    { id: 44, title: 'Psicose', vote_average: 8.5, release_date: '1960-06-16', overview: 'Uma secretária foge após cometer um roubo e se hospeda em um motel isolado administrado por um jovem estranho sob domínio de sua mãe.', poster_path: 'https://image.tmdb.org/t/p/w500/5bhkrj6UGV6yy7gH2Bz2Nu41piC.jpg' }
  ],
  'sci-fi': [
    { id: 51, title: 'Interestelar', vote_average: 8.4, release_date: '2014-11-05', overview: 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.', poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QthJ2awJJoi7Z37r7t5Ijhf.jpg' },
    { id: 52, title: 'A Origem', vote_average: 8.3, release_date: '2010-07-14', overview: 'Um ladrão profissional especializado em roubar segredos corporativos de dentro do subconsciente humano recebe a tarefa de plantar uma ideia.', poster_path: 'https://image.tmdb.org/t/p/w500/edv5CZv0jSnL9O6YwLIY4vJURhT.jpg' },
    { id: 53, title: 'De Volta para o Futuro', vote_average: 8.5, release_date: '1985-07-03', overview: 'Um adolescente viaja acidentalmente trinta anos no tempo em uma máquina do tempo construída por um cientista excêntrico.', poster_path: 'https://image.tmdb.org/t/p/w500/3Bhkrj6UGV6yy7gH2Bz2Nu41piC.jpg' },
    { id: 54, title: 'Chegada', vote_average: 7.9, release_date: '2016-11-10', overview: 'Uma linguista é recrutada para se comunicar com alienígenas que chegaram à Terra, descobrindo segredos que podem mudar o rumo da humanidade.', poster_path: 'https://image.tmdb.org/t/p/w500/6Bhkrj6UGV6yy7gH2Bz2Nu41piC.jpg' }
  ]
};

exports.handler = async (event) => {
  try {
    const { genres = 'action', safeClassics = 'false' } = event.queryStringParameters || {};
    const isSafeClassics = safeClassics === 'true';
    const genreKeys = genres.toLowerCase().split(',');
    
    const tmdbKey = process.env.TMDB_API_KEY;
    let movies = [];

    if (tmdbKey) {
      // Fetch from TMDB
      try {
        const genreId = GENRE_MAP[genreKeys[0]] || 28; // fallback to action
        
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&language=pt-BR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}&vote_count.gte=150`;
        
        if (isSafeClassics) {
          // Look for classic movies: release date lte 5 years ago, and high score filter in JS
          const fiveYearsAgo = new Date().getFullYear() - 5;
          url += `&release_date.lte=${fiveYearsAgo}-12-31`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          let rawMovies = data.results || [];

          // Format results and extract necessary fields
          movies = rawMovies.map(m => ({
            id: m.id,
            title: m.title,
            vote_average: m.vote_average,
            release_date: m.release_date,
            overview: m.overview,
            poster_path: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://placehold.co/500x750/1e1e1e/ffffff?text=Sem+Poster'
          }));

          if (isSafeClassics) {
            // Filter: vote average >= 8.0 and launch > 5 years ago (handled by API filter but double-checked)
            movies = movies.filter(m => m.vote_average >= 8.0);
          }
        }
      } catch (err) {
        console.error("TMDB Fetch error, using mock data fallback:", err);
      }
    }

    // Fallback if no API key or API call resulted in fewer than 10 movies
    if (movies.length < 10) {
      const fallbackList = [];
      for (const key of genreKeys) {
        const list = MOCK_MOVIES[key] || MOCK_MOVIES['action'];
        fallbackList.push(...list);
      }
      
      let filteredFallback = fallbackList;
      if (isSafeClassics) {
        const fiveYearsAgoYear = new Date().getFullYear() - 5;
        filteredFallback = fallbackList.filter(m => {
          const year = parseInt(m.release_date.split('-')[0]);
          return m.vote_average >= 8.0 && year <= fiveYearsAgoYear;
        });
      }

      // Mix database items, deduplicate by title
      const uniqueMovies = [];
      const seenTitles = new Set();
      
      // First insert the successful API results
      for (const m of movies) {
        uniqueMovies.push(m);
        seenTitles.add(m.title.toLowerCase());
      }

      // Fill remaining spots from filtered fallback
      for (const m of filteredFallback) {
        if (!seenTitles.has(m.title.toLowerCase())) {
          uniqueMovies.push(m);
          seenTitles.add(m.title.toLowerCase());
        }
        if (uniqueMovies.length >= 12) break;
      }

      // Fallback fallback: if still empty, use all mock items
      if (uniqueMovies.length === 0) {
        for (const m of fallbackList) {
          if (!seenTitles.has(m.title.toLowerCase())) {
            uniqueMovies.push(m);
            seenTitles.add(m.title.toLowerCase());
          }
        }
      }

      movies = uniqueMovies;
    }

    // Limit to 10 movies for the roleta fatias
    movies = movies.slice(0, 10);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ movies })
    };
  } catch (error) {
    console.error("Endpoint suggest-movies error:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
