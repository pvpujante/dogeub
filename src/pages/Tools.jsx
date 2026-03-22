import Nav from '../layouts/Nav';
import { memo, useState, useCallback } from 'react';
import { 
  MessageCircle, 
  Calculator, 
  Clock, 
  Palette, 
  Dice5, 
  Music, 
  FileText,
  Zap,
  Sparkles,
  Timer,
  Keyboard,
  Volume2
} from 'lucide-react';
import clsx from 'clsx';

const tools = [
  {
    id: 'chat',
    name: 'Chat AI',
    desc: 'Habla con una IA',
    icon: MessageCircle,
    color: 'bg-purple-600',
  },
  {
    id: 'calculator',
    name: 'Calculadora',
    desc: 'Calculadora cientifica',
    icon: Calculator,
    color: 'bg-blue-600',
  },
  {
    id: 'timer',
    name: 'Temporizador',
    desc: 'Cuenta atras y cronometro',
    icon: Timer,
    color: 'bg-green-600',
  },
  {
    id: 'random',
    name: 'Aleatorio',
    desc: 'Numeros y decisiones',
    icon: Dice5,
    color: 'bg-orange-600',
  },
  {
    id: 'typing',
    name: 'Test de Escritura',
    desc: 'Mide tu velocidad',
    icon: Keyboard,
    color: 'bg-pink-600',
  },
  {
    id: 'notes',
    name: 'Notas',
    desc: 'Guarda tus notas',
    icon: FileText,
    color: 'bg-yellow-600',
  },
  {
    id: 'colors',
    name: 'Colores',
    desc: 'Selector de colores',
    icon: Palette,
    color: 'bg-red-600',
  },
  {
    id: 'soundboard',
    name: 'Sonidos',
    desc: 'Efectos de sonido',
    icon: Volume2,
    color: 'bg-cyan-600',
  },
];

// Chat AI Component
const ChatAI = memo(() => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola! Soy BusicoBot. Preguntame lo que quieras!' }
  ]);
  const [input, setInput] = useState('');

  const responses = [
    'Interesante pregunta! Dejame pensar...',
    'Eso es algo que me gusta discutir!',
    'Hmm, buena pregunta. Creo que...',
    'Ja! Me hiciste reir con eso.',
    'Esa es una perspectiva interesante.',
    'Nunca lo habia pensado asi!',
    'Totalmente de acuerdo contigo.',
    'Eso me recuerda a algo...',
    'Wow, que tema tan profundo!',
    'Me encanta hablar de eso!',
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    
    setTimeout(() => {
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={clsx(
              'max-w-[80%] px-4 py-2 rounded-2xl',
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#ffffff15]'
            )}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[#ffffff15]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-[#ffffff10] rounded-full px-4 py-2 outline-none"
          />
          <button onClick={handleSend} className="bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
});

// Calculator Component
const CalculatorTool = memo(() => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleClick = (val) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
    } else if (val === '=') {
      try {
        const result = eval(equation + display);
        setDisplay(String(result));
        setEquation('');
      } catch {
        setDisplay('Error');
      }
    } else if (['+', '-', '*', '/'].includes(val)) {
      setEquation(display + val);
      setDisplay('0');
    } else {
      setDisplay(display === '0' ? val : display + val);
    }
  };

  const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'];

  return (
    <div className="p-4">
      <div className="bg-[#ffffff10] p-4 rounded-xl mb-4 text-right">
        <div className="text-sm opacity-60">{equation}</div>
        <div className="text-3xl font-bold">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map(btn => (
          <button
            key={btn}
            onClick={() => handleClick(btn)}
            className={clsx(
              'p-4 rounded-xl text-xl font-bold transition-colors',
              btn === '=' ? 'bg-blue-600 hover:bg-blue-700' :
              ['+','-','*','/'].includes(btn) ? 'bg-orange-600 hover:bg-orange-700' :
              btn === 'C' ? 'bg-red-600 hover:bg-red-700' :
              'bg-[#ffffff15] hover:bg-[#ffffff25]'
            )}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
});

// Timer Component
const TimerTool = memo(() => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const start = () => {
    if (running) return;
    setRunning(true);
    const id = setInterval(() => setTime(t => t + 10), 10);
    setIntervalId(id);
  };

  const stop = () => {
    setRunning(false);
    if (intervalId) clearInterval(intervalId);
  };

  const reset = () => {
    stop();
    setTime(0);
  };

  const formatTime = (ms) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 text-center">
      <div className="text-6xl font-mono font-bold mb-8">{formatTime(time)}</div>
      <div className="flex gap-4 justify-center">
        <button onClick={start} className="bg-green-600 px-8 py-3 rounded-xl hover:bg-green-700">Iniciar</button>
        <button onClick={stop} className="bg-yellow-600 px-8 py-3 rounded-xl hover:bg-yellow-700">Pausar</button>
        <button onClick={reset} className="bg-red-600 px-8 py-3 rounded-xl hover:bg-red-700">Reiniciar</button>
      </div>
    </div>
  );
});

// Random Generator
const RandomTool = memo(() => {
  const [result, setResult] = useState('?');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);

  const generate = () => {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(num);
  };

  const coinFlip = () => setResult(Math.random() > 0.5 ? 'Cara' : 'Cruz');
  const diceRoll = () => setResult(Math.floor(Math.random() * 6) + 1);

  return (
    <div className="p-6 text-center">
      <div className="text-6xl font-bold mb-8 bg-[#ffffff10] rounded-2xl py-8">{result}</div>
      <div className="flex gap-4 justify-center mb-6">
        <input type="number" value={min} onChange={e => setMin(+e.target.value)} className="w-20 bg-[#ffffff10] rounded-xl p-2 text-center" />
        <span className="self-center">a</span>
        <input type="number" value={max} onChange={e => setMax(+e.target.value)} className="w-20 bg-[#ffffff10] rounded-xl p-2 text-center" />
      </div>
      <div className="flex gap-4 justify-center flex-wrap">
        <button onClick={generate} className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700">Numero</button>
        <button onClick={coinFlip} className="bg-yellow-600 px-6 py-3 rounded-xl hover:bg-yellow-700">Moneda</button>
        <button onClick={diceRoll} className="bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-700">Dado</button>
      </div>
    </div>
  );
});

// Typing Test
const TypingTest = memo(() => {
  const [started, setStarted] = useState(false);
  const [text] = useState('El veloz murcielago hindu comia feliz cardillo y kiwi. La ciguena tocaba el saxofon detras del palenque de paja.');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
    setInput('');
    setWpm(0);
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    
    if (val === text) {
      const elapsed = (Date.now() - startTime) / 60000;
      const words = text.split(' ').length;
      setWpm(Math.round(words / elapsed));
      setStarted(false);
    }
  };

  return (
    <div className="p-6">
      {!started ? (
        <div className="text-center">
          {wpm > 0 && <div className="text-4xl font-bold mb-4">{wpm} PPM</div>}
          <button onClick={handleStart} className="bg-green-600 px-8 py-4 rounded-xl text-xl hover:bg-green-700">
            {wpm > 0 ? 'Intentar de nuevo' : 'Comenzar'}
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-[#ffffff10] p-4 rounded-xl mb-4 text-lg leading-relaxed">
            {text.split('').map((char, i) => (
              <span key={i} className={
                i < input.length 
                  ? input[i] === char ? 'text-green-500' : 'text-red-500 bg-red-500/20'
                  : ''
              }>{char}</span>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={handleInput}
            autoFocus
            className="w-full bg-[#ffffff10] rounded-xl p-4 outline-none text-lg"
            placeholder="Escribe aqui..."
          />
        </div>
      )}
    </div>
  );
});

// Notes
const NotesTool = memo(() => {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('busicohub-notes') || '[]'); } catch { return []; }
  });
  const [current, setCurrent] = useState('');

  const save = () => {
    if (!current.trim()) return;
    const newNotes = [...notes, { id: Date.now(), text: current, date: new Date().toLocaleDateString() }];
    setNotes(newNotes);
    localStorage.setItem('busicohub-notes', JSON.stringify(newNotes));
    setCurrent('');
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    localStorage.setItem('busicohub-notes', JSON.stringify(newNotes));
  };

  return (
    <div className="p-4 h-[400px] flex flex-col">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={current}
          onChange={e => setCurrent(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          placeholder="Nueva nota..."
          className="flex-1 bg-[#ffffff10] rounded-xl px-4 py-2 outline-none"
        />
        <button onClick={save} className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-700">Guardar</button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {notes.map(note => (
          <div key={note.id} className="bg-[#ffffff10] p-3 rounded-xl flex justify-between items-start">
            <div>
              <div>{note.text}</div>
              <div className="text-xs opacity-50 mt-1">{note.date}</div>
            </div>
            <button onClick={() => deleteNote(note.id)} className="text-red-500 hover:text-red-400">x</button>
          </div>
        ))}
      </div>
    </div>
  );
});

// Color Picker
const ColorTool = memo(() => {
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const randomColor = () => {
    setColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
  };

  return (
    <div className="p-6 text-center">
      <div 
        className="w-48 h-48 rounded-2xl mx-auto mb-6 cursor-pointer border-4 border-white/20"
        style={{ backgroundColor: color }}
        onClick={copy}
      />
      <input
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
        className="w-full h-12 rounded-xl cursor-pointer mb-4"
      />
      <div className="text-2xl font-mono mb-4">{color.toUpperCase()}</div>
      <div className="flex gap-4 justify-center">
        <button onClick={copy} className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-700">
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
        <button onClick={randomColor} className="bg-purple-600 px-6 py-2 rounded-xl hover:bg-purple-700">
          Aleatorio
        </button>
      </div>
    </div>
  );
});

// Soundboard
const SoundboardTool = memo(() => {
  const sounds = [
    { name: 'Aplausos', emoji: '👏' },
    { name: 'Risa', emoji: '😂' },
    { name: 'Wow', emoji: '😮' },
    { name: 'Triste', emoji: '😢' },
    { name: 'Victoria', emoji: '🎉' },
    { name: 'Error', emoji: '❌' },
    { name: 'Campana', emoji: '🔔' },
    { name: 'Explosion', emoji: '💥' },
  ];

  const playSound = (name) => {
    // Usar Web Audio API para generar sonidos simples
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const freqs = {
      'Aplausos': [200, 300, 400],
      'Risa': [400, 500, 300, 600],
      'Wow': [300, 600],
      'Triste': [400, 300, 200],
      'Victoria': [523, 659, 784],
      'Error': [200, 100],
      'Campana': [800, 600, 800],
      'Explosion': [100, 80, 60],
    };
    
    const freq = freqs[name] || [440];
    let time = ctx.currentTime;
    
    freq.forEach((f, i) => {
      osc.frequency.setValueAtTime(f, time + i * 0.1);
    });
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4">
        {sounds.map(sound => (
          <button
            key={sound.name}
            onClick={() => playSound(sound.name)}
            className="bg-[#ffffff15] hover:bg-[#ffffff25] p-6 rounded-2xl flex flex-col items-center gap-2 transition-transform hover:scale-105"
          >
            <span className="text-4xl">{sound.emoji}</span>
            <span className="text-sm">{sound.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

const ToolCard = memo(({ tool, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={clsx(
      'p-4 rounded-2xl cursor-pointer transition-all',
      isActive ? 'bg-[#ffffff25] ring-2 ring-white/50' : 'bg-[#ffffff10] hover:bg-[#ffffff15]'
    )}
  >
    <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center mb-3', tool.color)}>
      <tool.icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-semibold">{tool.name}</h3>
    <p className="text-sm opacity-60">{tool.desc}</p>
  </div>
));

const Tools = memo(() => {
  const [activeTool, setActiveTool] = useState('chat');

  const renderTool = () => {
    switch (activeTool) {
      case 'chat': return <ChatAI />;
      case 'calculator': return <CalculatorTool />;
      case 'timer': return <TimerTool />;
      case 'random': return <RandomTool />;
      case 'typing': return <TypingTest />;
      case 'notes': return <NotesTool />;
      case 'colors': return <ColorTool />;
      case 'soundboard': return <SoundboardTool />;
      default: return <ChatAI />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Nav />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Herramientas</h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            {tools.map(tool => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                onClick={() => setActiveTool(tool.id)}
                isActive={activeTool === tool.id}
              />
            ))}
          </div>
          
          <div className="bg-[#ffffff08] rounded-2xl border border-[#ffffff10] min-h-[400px]">
            {renderTool()}
          </div>
        </div>
      </div>
    </div>
  );
});

Tools.displayName = 'Tools';
export default Tools;
