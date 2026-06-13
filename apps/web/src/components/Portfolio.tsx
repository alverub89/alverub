import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Database, 
  Cpu, 
  Flame, 
  ExternalLink,
  Code, 
  Mail, 
  Github, 
  Linkedin,
  ArrowRight,
  Tv
} from 'lucide-react';

interface PortfolioProps {
  onNavigateToDecidiJa: () => void;
}

export default function Portfolio({ onNavigateToDecidiJa }: PortfolioProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* HERO SECTION */}
      <section style={{ textAlign: 'center', padding: '16px 0 8px' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 8, 
          background: 'rgba(0, 240, 255, 0.1)', 
          border: '1px solid rgba(0, 240, 255, 0.2)', 
          padding: '6px 12px', 
          borderRadius: 20,
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#00f0ff',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: 16
        }}>
          <Sparkles size={12} />
          Disponível para Projetos
        </div>
        <h2 style={{ 
          fontSize: '2.4rem', 
          fontWeight: 800, 
          letterSpacing: '-1.5px', 
          lineHeight: 1.1,
          color: '#ffffff',
          marginBottom: 12
        }}>
          Criando produtos que unificam <span style={{ color: '#00f0ff', textShadow: '0 0 10px rgba(0, 240, 255, 0.3)' }}>Design</span> & <span style={{ color: '#e50914', textShadow: '0 0 10px rgba(229, 9, 20, 0.3)' }}>Inteligência</span>.
        </h2>
        <p style={{ 
          fontSize: '1.05rem', 
          color: '#aaa', 
          lineHeight: 1.5,
          maxWidth: 400,
          margin: '0 auto'
        }}>
          Olá, sou <strong>Ruben</strong>. Desenvolvo experiências web imersivas de alta fidelidade e integrações serverless robustas.
        </p>
      </section>

      {/* FEATURED PRODUCT - DECIDIJA */}
      <section className="controls-card" style={{ 
        border: '1px solid rgba(0, 240, 255, 0.25)', 
        background: 'linear-gradient(135deg, #1e1e1e 0%, #151d24 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle top decoration */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: 'linear-gradient(90deg, #e50914 0%, #00f0ff 100%)'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            color: '#e50914', 
            background: 'rgba(229, 9, 20, 0.1)', 
            padding: '4px 8px', 
            borderRadius: 4,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Produto Principal
          </span>
          <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: 600 }}>v1.0.0</span>
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          DecidiJá 🎡
        </h3>
        
        <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: 1.45, marginBottom: 16 }}>
          Elimine a fadiga e a paralisia de escolha na hora do cinema. Um aplicativo mobile-first que cruza dados do TMDB com reviews analíticos gerados por Inteligência Artificial em tempo real.
        </p>

        {/* Mini Preview Graphic */}
        <div style={{ 
          background: '#0d0d0d', 
          border: '1px solid #2a2a2a', 
          borderRadius: 8, 
          padding: 16, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 16,
          marginBottom: 20
        }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            border: '3px solid #00f0ff',
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)',
            background: 'conic-gradient(#450608 0% 25%, #1f1f1f 25% 50%, #450608 50% 75%, #1f1f1f 75% 100%)',
            animation: 'spin 10s linear infinite'
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Roleta Inteligente + LLM</span>
            <span style={{ fontSize: '0.7rem', color: '#777' }}>Física Realista & Curadoria em 3s</span>
          </div>
        </div>

        <button 
          onClick={onNavigateToDecidiJa}
          className="spin-btn"
          style={{ 
            width: '100%', 
            margin: 0, 
            background: 'var(--color-accent)', 
            color: '#121212',
            boxShadow: '0 4px 15px rgba(0, 240, 255, 0.3)'
          }}
        >
          Experimentar DecidiJá
          <ArrowRight size={16} />
        </button>
      </section>

      {/* TECHNICAL STACK */}
      <section className="controls-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={16} style={{ color: '#00f0ff' }} />
          Stack Tecnológico
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ background: '#1c1c1c', padding: 8, borderRadius: 6, color: '#00f0ff' }}>
              <Code size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Frontend Imersivo</h4>
              <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: 2 }}>React, TypeScript, Vanilla CSS3 (Custom Tokens) e física de renderização SVG.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ background: '#1c1c1c', padding: 8, borderRadius: 6, color: '#e50914' }}>
              <Cpu size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Serverless & IA</h4>
              <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: 2 }}>Netlify Functions em Node.js integradas com APIs de LLM e TMDB com mascaramento de latência.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ background: '#1c1c1c', padding: 8, borderRadius: 6, color: '#ffb703' }}>
              <Database size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Persistência Robusta</h4>
              <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: 2 }}>PostgreSQL no Neon DB com Drizzle ORM estruturado em arquitetura Monorepo Workspaces.</p>
            </div>
          </div>

        </div>
      </section>

      {/* SOCIAL LINKS / CONTACT */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '8px 0 24px' }}>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer" 
          className="remove-btn"
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', padding: '10px 14px', background: '#181818', border: '1px solid #333', borderRadius: 20, color: '#ccc', textDecoration: 'none' }}
        >
          <Github size={14} />
          GitHub
        </a>
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noreferrer" 
          className="remove-btn"
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', padding: '10px 14px', background: '#181818', border: '1px solid #333', borderRadius: 20, color: '#ccc', textDecoration: 'none' }}
        >
          <Linkedin size={14} />
          LinkedIn
        </a>
      </section>

    </div>
  );
}
