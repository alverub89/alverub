import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Film, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Play, 
  HelpCircle,
  ExternalLink,
  X,
  History,
  ArrowLeft
} from 'lucide-react';
import { ApiClient, Movie } from '@decidaja/api-client';

const api = new ApiClient();

const GENRES = [
  { id: 'action', label: 'Ação' },
  { id: 'comedy', label: 'Comédia' },
  { id: 'drama', label: 'Drama' },
  { id: 'romance', label: 'Romance' },
  { id: 'horror', label: 'Terror' },
  { id: 'sci-fi', label: 'Ficção' }
];

interface DecidiJaProps {
  onBack: () => void;
}

export default function DecidiJa({ onBack }: DecidiJaProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'smart'>('manual');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const [manualOptions, setManualOptions] = useState<string[]>(() => {
    const saved = localStorage.getItem('decidaja_manual_options');
    return saved ? JSON.parse(saved) : ['Pipoca', 'Pizza', 'Hambúrguer', 'Sushi'];
  });
  const [newOption, setNewOption] = useState('');

  const [selectedGenre, setSelectedGenre] = useState<string>('action');
  const [safeClassics, setSafeClassics] = useState(false);
  const [smartMovies, setSmartMovies] = useState<Movie[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [rotationAngle, setRotationAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [flashWinner, setFlashWinner] = useState(false);

  const [winnerMovie, setWinnerMovie] = useState<{ title: string; movieObj?: Movie } | null>(null);
  const [curationText, setCurationText] = useState<string>('');
  const [loadingCuration, setLoadingCuration] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('decidaja_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('decidaja_manual_options', JSON.stringify(manualOptions));
  }, [manualOptions]);

  useEffect(() => {
    localStorage.setItem('decidaja_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (activeTab === 'smart') {
      fetchSmartSuggestions();
    }
  }, [selectedGenre, safeClassics, activeTab]);

  useEffect(() => {
    const audio = new Audio('/click.wav');
    audio.volume = 0.3;
    clickAudioRef.current = audio;
  }, []);

  const fetchSmartSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const movies = await api.suggestMovies(selectedGenre, safeClassics);
      setSmartMovies(movies);
    } catch (err) {
      console.error("Error loading movie suggestions:", err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const playTickSound = () => {
    if (!soundEnabled) return;
    
    let wavPlayed = false;
    if (clickAudioRef.current) {
      try {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current.play().then(() => {
          wavPlayed = true;
        }).catch(() => {
          playSynthesizedClick();
        });
      } catch (e) {
        playSynthesizedClick();
      }
    } else {
      playSynthesizedClick();
    }
  };

  const playSynthesizedClick = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
      // ignore silently
    }
  };

  const currentOptions = activeTab === 'manual' 
    ? manualOptions 
    : smartMovies.map(m => m.title);

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newOption.trim();
    if (!clean) return;
    if (manualOptions.length >= 12) {
      alert("A roleta aceita no máximo 12 opções!");
      return;
    }
    setManualOptions([...manualOptions, clean]);
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    if (manualOptions.length <= 2) {
      alert("A roleta precisa de pelo menos 2 opções!");
      return;
    }
    const updated = [...manualOptions];
    updated.splice(index, 1);
    setManualOptions(updated);
  };

  const handleSpin = async () => {
    if (isSpinning || currentOptions.length < 2) return;

    setIsSpinning(true);
    setFlashWinner(false);
    setShowWinnerModal(false);

    const winnerIdx = Math.floor(Math.random() * currentOptions.length);
    const winnerName = currentOptions[winnerIdx];

    let curationPromise: Promise<string> | null = null;
    const selectedMovieObj = activeTab === 'smart' ? smartMovies[winnerIdx] : undefined;
    
    if (activeTab === 'smart') {
      setLoadingCuration(true);
      setCurationText('');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3200);
      
      curationPromise = api.curateMovie(winnerName, selectedMovieObj?.overview || '', controller.signal)
        .then((text) => {
          clearTimeout(timeoutId);
          return text;
        })
        .catch((err) => {
          console.warn("Curation API failed or timed out:", err.message);
          return selectedMovieObj?.overview || "Sinopse não disponível para este filme.";
        });
    }

    const N = currentOptions.length;
    const sliceAngle = 360 / N;
    const winnerMidpoint = (winnerIdx + 0.5) * sliceAngle;
    const baseStopAngle = (270 - winnerMidpoint + 360) % 360;
    
    const totalSpins = 6 + Math.floor(Math.random() * 3);
    const targetAngle = totalSpins * 360 + baseStopAngle;

    const spinDuration = 3000;
    const startAngle = rotationAngle % 360;
    const startTime = performance.now();
    let lastTickAngle = 0;

    const animateWheel = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
      const currentVal = startAngle + (targetAngle - startAngle) * easeOut(progress);
      
      setRotationAngle(currentVal);

      const boundaryDiff = Math.floor(currentVal / sliceAngle) - Math.floor(lastTickAngle / sliceAngle);
      if (boundaryDiff > 0) {
        playTickSound();
      }
      lastTickAngle = currentVal;

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        setIsSpinning(false);
        setWinnerMovie({ title: winnerName, movieObj: selectedMovieObj });
        setFlashWinner(true);

        if (activeTab === 'smart' && curationPromise) {
          curationPromise.then((text) => {
            setCurationText(text);
            setLoadingCuration(false);
          });
        }

        const newHistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          winner: winnerName,
          options: currentOptions,
          is_custom: activeTab === 'manual',
          created_at: new Date().toISOString()
        };
        setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));

        api.saveDecision({
          winner: winnerName,
          options: currentOptions,
          is_custom: activeTab === 'manual'
        }).catch(err => console.warn(err));

        setTimeout(() => {
          setShowWinnerModal(true);
        }, 600);
      }
    };

    requestAnimationFrame(animateWheel);
  };

  const renderSlices = () => {
    const N = currentOptions.length;
    if (N === 0) return null;
    const sliceAngle = 360 / N;
    const radius = 150;
    const center = 160;

    return currentOptions.map((option, idx) => {
      const startAngleDeg = idx * sliceAngle;
      const endAngleDeg = (idx + 1) * sliceAngle;
      
      const startRad = (startAngleDeg * Math.PI) / 180;
      const endRad = (endAngleDeg * Math.PI) / 180;

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
      
      const isRed = idx % 2 === 0;
      const fillColor = isRed ? '#450608' : '#1f1f1f';
      const strokeColor = '#3a3a3a';

      const textAngle = startAngleDeg + (sliceAngle / 2);
      
      return (
        <g key={idx}>
          <path 
            d={pathData} 
            fill={fillColor} 
            stroke={strokeColor} 
            strokeWidth="1.5"
          />
          <text
            x={center + 55}
            y={center + 4}
            fill="#ffffff"
            fontSize={N > 8 ? "9px" : "11px"}
            fontWeight="700"
            textAnchor="start"
            transform={`rotate(${textAngle} ${center} ${center})`}
            style={{
              textShadow: '0px 1px 3px rgba(0,0,0,0.9)',
              letterSpacing: '0.5px'
            }}
          >
            {option.length > 15 ? option.substring(0, 13) + '..' : option}
          </text>
        </g>
      );
    });
  };

  const getCleanGenreName = (id: string) => {
    return GENRES.find(g => g.id === id)?.label || 'Ação';
  };

  return (
    <>
      {/* Back button to Portfolio */}
      <button 
        onClick={onBack}
        className="remove-btn"
        disabled={isSpinning}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          alignSelf: 'flex-start',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#aaa',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid #333',
          borderRadius: '16px',
          cursor: 'pointer',
          marginBottom: -8
        }}
      >
        <ArrowLeft size={14} />
        Voltar ao Portfólio
      </button>

      {/* HEADER */}
      <header>
        <h1>Decidi<span>Já</span> 🎡</h1>
        <p>Sua decisão de entretenimento em segundos, sem atrito.</p>
      </header>

      {/* TABS */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
          onClick={() => !isSpinning && setActiveTab('manual')}
          disabled={isSpinning}
        >
          <Plus size={16} />
          Minha Lista
        </button>
        <button 
          className={`tab-btn ${activeTab === 'smart' ? 'active' : ''}`}
          onClick={() => !isSpinning && setActiveTab('smart')}
          disabled={isSpinning}
        >
          <Sparkles size={16} />
          Sugestões do App
        </button>
      </div>

      {/* WHEEL SECTION */}
      <div className="wheel-section">
        <div className="needle-container">
          <div className="needle" />
        </div>

        <button 
          className="remove-btn" 
          style={{ position: 'absolute', top: 12, right: 12, padding: 8 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Mutar Som" : "Ativar Som"}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <div className={`wheel-wrapper ${flashWinner ? 'wheel-flashing' : ''}`}>
          <div className="wheel-center-pin" />
          <svg 
            className="wheel-svg-container"
            viewBox="0 0 320 320"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            {renderSlices()}
          </svg>
        </div>

        <button 
          className="spin-btn"
          disabled={isSpinning || currentOptions.length < 2 || (activeTab === 'smart' && loadingSuggestions)}
          onClick={handleSpin}
        >
          {isSpinning ? (
            <>
              <RotateCw size={18} className="spinner" />
              Sorteando...
            </>
          ) : (
            <>
              <Play size={18} />
              Decidir Já!
            </>
          )}
        </button>
      </div>

      {/* CONTROLS */}
      {activeTab === 'manual' ? (
        <div className="controls-card">
          <h2>
            <Plus size={18} style={{ color: '#e50914' }} />
            Opções do Sorteio
          </h2>
          <form onSubmit={handleAddOption} className="input-group">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ex: Interstellar, Pipoca, Duna..."
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              maxLength={40}
              disabled={isSpinning}
            />
            <button type="submit" className="add-btn" disabled={isSpinning}>
              <Plus size={20} />
            </button>
          </form>

          <div className="options-list">
            {manualOptions.map((opt, idx) => (
              <div className="option-item" key={idx}>
                <span className="option-text">{opt}</span>
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => handleRemoveOption(idx)}
                  disabled={isSpinning}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {manualOptions.length === 0 && (
              <div className="empty-state">
                <HelpCircle size={32} />
                Insira opções acima para começar o sorteio!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="controls-card">
          <h2>
            <Sparkles size={18} style={{ color: '#00f0ff' }} />
            Filtros do Cinema
          </h2>
          
          <div className="filters-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#aaa' }}>Gênero:</span>
              <div className="genre-buttons-container">
                {GENRES.map(g => (
                  <button
                    key={g.id}
                    className={`genre-btn ${selectedGenre === g.id ? 'active' : ''}`}
                    onClick={() => !isSpinning && setSelectedGenre(g.id)}
                    disabled={isSpinning}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="toggle-wrapper">
              <div className="toggle-info">
                <span className="toggle-title">Clássicos Seguros 🌟</span>
                <span className="toggle-subtitle">Nota &gt; 8.0 e mais de 5 anos de lançamento</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={safeClassics}
                  onChange={(e) => !isSpinning && setSafeClassics(e.target.checked)}
                  disabled={isSpinning}
                />
                <span className="slider" />
              </label>
            </div>

            {loadingSuggestions && (
              <div className="loading-box">
                <div className="spinner" />
                Carregando catálogo TMDB...
              </div>
            )}
          </div>
        </div>
      )}

      {/* HISTORY */}
      {history.length > 0 && (
        <div className="controls-card" style={{ opacity: isSpinning ? 0.4 : 1, transition: 'opacity 0.2s' }}>
          <h2 style={{ fontSize: '0.95rem', color: '#aaa', marginBottom: 12 }}>
            <History size={16} />
            Últimas Decisões
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.slice(0, 3).map((item, idx) => (
              <div 
                key={item.id || idx} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: '#151515',
                  padding: '8px 12px',
                  borderRadius: 6,
                  fontSize: '0.85rem',
                  border: '1px solid #222'
                }}
              >
                <span style={{ fontWeight: 600, color: '#fff' }}>{item.winner}</span>
                <span style={{ fontSize: '0.75rem', color: '#555' }}>
                  {item.is_custom ? 'Manual' : 'Smart'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer>
        <p>DecidiJá &copy; {new Date().getFullYear()} - Sala de Cinema Virtual</p>
      </footer>

      {/* WINNER REVEAL MODAL */}
      {showWinnerModal && winnerMovie && (
        <div className="reveal-backdrop" onClick={() => setShowWinnerModal(false)}>
          <div className="reveal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  color: activeTab === 'smart' ? '#00f0ff' : '#e50914', 
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {activeTab === 'smart' ? '🍿 Sugestão de Filme Sorteada!' : '🎯 Item Sorteado com Sucesso!'}
                </span>
                <h3>{winnerMovie.title}</h3>
              </div>
              <button className="close-btn" onClick={() => setShowWinnerModal(false)}>
                <X size={16} />
              </button>
            </div>

            {activeTab === 'smart' && winnerMovie.movieObj && (
              <div className="movie-content">
                <img 
                  src={winnerMovie.movieObj.poster_path} 
                  alt={winnerMovie.title} 
                  className="movie-poster"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/300x450/1e1e1e/ffffff?text=DecidiJa';
                  }}
                />
                <div className="movie-meta">
                  <div className="meta-badge-row">
                    {winnerMovie.movieObj.vote_average && (
                      <span className="meta-badge rating">
                        ★ {winnerMovie.movieObj.vote_average.toFixed(1)}
                      </span>
                    )}
                    {winnerMovie.movieObj.release_date && (
                      <span className="meta-badge year">
                        {winnerMovie.movieObj.release_date.split('-')[0]}
                      </span>
                    )}
                    <span className="meta-badge">
                      {getCleanGenreName(selectedGenre)}
                    </span>
                  </div>
                  <p className="movie-overview">
                    {winnerMovie.movieObj.overview || "Sinopse do catálogo do TMDB indisponível."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'smart' && (
              <div className="ai-curation-box">
                <div className="ai-curation-title">
                  <Sparkles size={14} />
                  Por que assistir? (Curadoria IA)
                </div>
                {loadingCuration ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#00f0ff', marginTop: 4 }}>
                    <RotateCw size={14} className="spinner" />
                    Buscando comentários críticos da IA...
                  </div>
                ) : (
                  <p className="ai-curation-text">{curationText}</p>
                )}
              </div>
            )}

            {activeTab === 'manual' && (
              <div style={{ padding: '8px 4px', fontSize: '0.95rem', color: '#ccc', lineHeight: '1.4' }}>
                <p>O universo decidiu! Sua opção manual sorteada foi <strong>{winnerMovie.title}</strong>.</p>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: 12 }}>
                  Opções no giro: {currentOptions.join(', ')}
                </p>
              </div>
            )}

            <div className="modal-actions">
              <button 
                className="action-btn watch-now"
                onClick={() => {
                  const url = `https://www.justwatch.com/br/busca?q=${encodeURIComponent(winnerMovie.title)}`;
                  window.open(url, '_blank');
                }}
              >
                <ExternalLink size={16} />
                Assistir agora
              </button>
              <button 
                className="action-btn spin-again"
                onClick={() => {
                  setShowWinnerModal(false);
                  handleSpin();
                }}
              >
                <RotateCw size={16} />
                Girar novamente
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
