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

// Chat AI Component - IA Inteligente con memoria
const ChatAI = memo(() => {
  const [conversations, setConversations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('busicohub-chats') || '[]'); } catch { return []; }
  });
  const [currentConvId, setCurrentConvId] = useState(() => {
    const convs = JSON.parse(localStorage.getItem('busicohub-chats') || '[]');
    return convs.length > 0 ? convs[convs.length - 1].id : null;
  });
  const [messages, setMessages] = useState(() => {
    try {
      const convs = JSON.parse(localStorage.getItem('busicohub-chats') || '[]');
      if (convs.length > 0) {
        return convs[convs.length - 1].messages;
      }
      return [{ role: 'assistant', content: 'Hola! Soy BusicoBot, tu asistente inteligente. Puedo ayudarte con preguntas, matematicas, idiomas, curiosidades y mucho mas. Que quieres saber?' }];
    } catch { return [{ role: 'assistant', content: 'Hola! Soy BusicoBot. Preguntame lo que quieras!' }]; }
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Base de conocimiento para respuestas inteligentes
  const generateResponse = (userMsg) => {
    const msg = userMsg.toLowerCase().trim();
    
    // Saludos
    if (/^(hola|hey|buenas|saludos|hi|hello|que tal|como estas)/i.test(msg)) {
      const saludos = [
        'Hola! Como te va hoy? En que puedo ayudarte?',
        'Hey! Que alegria verte por aqui. Que necesitas?',
        'Buenas! Estoy listo para ayudarte con lo que sea.',
        'Hola! Cuentame, en que puedo echarte una mano?'
      ];
      return saludos[Math.floor(Math.random() * saludos.length)];
    }
    
    // Despedidas
    if (/^(adios|chao|bye|hasta luego|nos vemos|me voy)/i.test(msg)) {
      return 'Hasta luego! Fue un placer charlar contigo. Vuelve cuando quieras!';
    }
    
    // Matematicas basicas
    const mathMatch = msg.match(/(?:cuanto es|calcula|resuelve)?\s*(\d+)\s*([\+\-\*\/x])\s*(\d+)/i);
    if (mathMatch) {
      const a = parseFloat(mathMatch[1]);
      const op = mathMatch[2] === 'x' ? '*' : mathMatch[2];
      const b = parseFloat(mathMatch[3]);
      let result;
      switch(op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = b !== 0 ? a / b : 'Error: division por cero'; break;
        default: result = 'No entendi la operacion';
      }
      return `El resultado de ${a} ${op} ${b} = ${result}`;
    }
    
    // Raiz cuadrada
    if (/raiz cuadrada de (\d+)/i.test(msg)) {
      const num = parseFloat(msg.match(/raiz cuadrada de (\d+)/i)[1]);
      return `La raiz cuadrada de ${num} es ${Math.sqrt(num).toFixed(4)}`;
    }
    
    // Hora
    if (/que hora es|hora actual|dime la hora/i.test(msg)) {
      return `Son las ${new Date().toLocaleTimeString('es-ES')}`;
    }
    
    // Fecha
    if (/que dia es|fecha actual|que fecha/i.test(msg)) {
      return `Hoy es ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    }
    
    // Chistes
    if (/chiste|hazme reir|cuentame algo gracioso/i.test(msg)) {
      const chistes = [
        'Por que el libro de matematicas estaba triste? Porque tenia muchos problemas!',
        'Que le dice un jardinero a otro? Nos vemos cuando podamos!',
        'Como se dice pañuelo en japones? Saka-moko',
        'Que hace una abeja en el gimnasio? Zum-ba!',
        'Por que los pajaros no usan Facebook? Porque ya tienen Twitter!',
        'Que le dice una iguana a su hermana gemela? Somos iguanitas!',
        'Doctor, doctor, me siento como una baraja. Sientese, ya le atenderemos mas tarde.',
        'Cual es el colmo de un electricista? Que su esposa se llame Luz y sus hijos le sigan la corriente!'
      ];
      return chistes[Math.floor(Math.random() * chistes.length)];
    }
    
    // Datos curiosos
    if (/dato curioso|curiosidad|sabias que|dime algo interesante/i.test(msg)) {
      const datos = [
        'Sabias que los pulpos tienen tres corazones? Dos bombean sangre a las branquias y uno al resto del cuerpo.',
        'El miel nunca se echa a perder. Se ha encontrado miel comestible en tumbas egipcias de 3000 años!',
        'Los flamencos nacen blancos y se vuelven rosas por su dieta de camarones.',
        'Una persona promedio pasa 6 meses de su vida esperando que los semaforos cambien a verde.',
        'El cerebro humano puede almacenar aproximadamente 2.5 petabytes de informacion.',
        'Los delfines duermen con un ojo abierto para estar alerta ante depredadores.',
        'El corazon de un camaron esta ubicado en su cabeza.',
        'Las hormigas no duermen y no tienen pulmones.',
        'Un rayo es 5 veces mas caliente que la superficie del sol.'
      ];
      return datos[Math.floor(Math.random() * datos.length)];
    }
    
    // Traducciones simples
    if (/como se dice (.+) en ingles/i.test(msg)) {
      const palabra = msg.match(/como se dice (.+) en ingles/i)[1].trim();
      const traducciones = {
        'hola': 'Hello', 'adios': 'Goodbye', 'gracias': 'Thank you', 'perro': 'Dog',
        'gato': 'Cat', 'casa': 'House', 'amor': 'Love', 'amigo': 'Friend',
        'familia': 'Family', 'comida': 'Food', 'agua': 'Water', 'sol': 'Sun',
        'luna': 'Moon', 'estrella': 'Star', 'libro': 'Book', 'musica': 'Music'
      };
      return traducciones[palabra.toLowerCase()] 
        ? `"${palabra}" en ingles es "${traducciones[palabra.toLowerCase()]}"`
        : `No tengo la traduccion exacta de "${palabra}", pero sigue practicando!`;
    }
    
    // Consejos
    if (/consejo|ayuda|que hago|estoy aburrido/i.test(msg)) {
      const consejos = [
        'Un buen consejo: toma un descanso, estira un poco y bebe agua. Tu cuerpo te lo agradecera!',
        'Te sugiero probar algo nuevo hoy. Puede ser un juego, leer algo o aprender una habilidad.',
        'Recuerda: cada pequeño paso cuenta. No te rindas!',
        'Intenta escuchar tu musica favorita, siempre ayuda a mejorar el animo.',
        'Que tal si pruebas uno de los juegos aqui? Hay varios muy entretenidos!'
      ];
      return consejos[Math.floor(Math.random() * consejos.length)];
    }
    
    // Quien eres
    if (/quien eres|que eres|como te llamas|tu nombre/i.test(msg)) {
      return 'Soy BusicoBot, el asistente virtual de BusicoHub. Estoy aqui para ayudarte, entretenerte y responder tus preguntas. Puedo hacer calculos, contar chistes, darte datos curiosos y mucho mas!';
    }
    
    // Que puedes hacer
    if (/que puedes hacer|que sabes|ayudame|funciones|comandos/i.test(msg)) {
      return 'Puedo ayudarte con:\n- Calculos matematicos (ej: "cuanto es 25 * 4")\n- Decirte la hora o fecha\n- Contar chistes\n- Datos curiosos\n- Traducciones basicas al ingles\n- Darte consejos\n- Conversar contigo!\nPreguntame lo que quieras!';
    }
    
    // Piedra papel tijera
    if (/piedra|papel|tijera/i.test(msg)) {
      const opciones = ['piedra', 'papel', 'tijera'];
      const miEleccion = opciones[Math.floor(Math.random() * 3)];
      const tuEleccion = msg.match(/(piedra|papel|tijera)/i)[1].toLowerCase();
      
      if (tuEleccion === miEleccion) return `Yo elegi ${miEleccion}. Empate!`;
      if ((tuEleccion === 'piedra' && miEleccion === 'tijera') ||
          (tuEleccion === 'papel' && miEleccion === 'piedra') ||
          (tuEleccion === 'tijera' && miEleccion === 'papel')) {
        return `Yo elegi ${miEleccion}. Ganaste!`;
      }
      return `Yo elegi ${miEleccion}. Gane yo esta vez!`;
    }
    
    // Numero aleatorio
    if (/numero aleatorio|dame un numero|random/i.test(msg)) {
      return `Tu numero aleatorio es: ${Math.floor(Math.random() * 100) + 1}`;
    }
    
    // Clima (simulado)
    if (/clima|tiempo|temperatura|hace frio|hace calor/i.test(msg)) {
      const climas = ['soleado', 'nublado', 'lluvioso', 'ventoso'];
      const temp = Math.floor(Math.random() * 25) + 10;
      return `No puedo ver el clima real, pero te deseo un dia ${climas[Math.floor(Math.random() * climas.length)]} con unos ${temp} grados de buena vibra!`;
    }

    // Respuestas generales inteligentes basadas en palabras clave
    if (/triste|mal|deprimido|solo/i.test(msg)) {
      return 'Lamento que te sientas asi. Recuerda que los momentos dificiles pasan. Estoy aqui si quieres hablar o distraerte con algo.';
    }
    
    if (/feliz|bien|genial|increible|contento/i.test(msg)) {
      return 'Me alegra mucho saber eso! La felicidad es contagiosa, gracias por compartirla conmigo!';
    }
    
    if (/juego|jugar|gaming|videojuego/i.test(msg)) {
      return 'Te gustan los juegos? Aqui en BusicoHub tienes una seccion de Games con muchos juegos divertidos. Prueba los que tienen el icono verde, esos funcionan super bien!';
    }
    
    if (/musica|cancion|cantante|artista/i.test(msg)) {
      return 'La musica es increible! Cada persona tiene su estilo. Cual es tu genero favorito?';
    }
    
    if (/pelicula|serie|netflix|ver algo/i.test(msg)) {
      return 'Las peliculas y series son geniales para relajarse. Tienes algun genero favorito? Accion, comedia, terror...?';
    }

    // Respuestas variadas para cuando no entiende
    const respuestasGenerales = [
      'Mmm, interesante lo que dices. Cuentame mas sobre eso!',
      'No estoy seguro de entender completamente, pero me parece un tema interesante.',
      'Eso suena intrigante. Puedes explicarmelo de otra forma?',
      'Vaya, nunca habia pensado en eso asi. Que opinas tu?',
      'Es una perspectiva unica! Me gustaria saber mas.',
      'Hmm, dejame procesar eso... Tienes alguna pregunta especifica que pueda responder?',
      'Interesante! Aunque si tienes alguna pregunta concreta, con gusto te ayudo.',
      'Me encanta aprender cosas nuevas de las personas. Cuentame mas!'
    ];
    
    return respuestasGenerales[Math.floor(Math.random() * respuestasGenerales.length)];
  };

  const saveConversation = (msgs) => {
    let convs = [...conversations];
    const now = new Date();
    
    if (currentConvId) {
      convs = convs.map(c => c.id === currentConvId ? { ...c, messages: msgs, updatedAt: now.toISOString() } : c);
    } else {
      const newConv = {
        id: Date.now(),
        title: msgs.find(m => m.role === 'user')?.content.slice(0, 30) || 'Nueva conversacion',
        messages: msgs,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      convs.push(newConv);
      setCurrentConvId(newConv.id);
    }
    
    setConversations(convs);
    localStorage.setItem('busicohub-chats', JSON.stringify(convs));
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage = { role: 'assistant', content: response };
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      saveConversation(finalMessages);
      setIsTyping(false);
    }, 500 + Math.random() * 1000);
  };

  const startNewConversation = () => {
    setCurrentConvId(null);
    setMessages([{ role: 'assistant', content: 'Nueva conversacion iniciada! En que puedo ayudarte?' }]);
    setShowHistory(false);
  };

  const loadConversation = (conv) => {
    setCurrentConvId(conv.id);
    setMessages(conv.messages);
    setShowHistory(false);
  };

  const deleteConversation = (id, e) => {
    e.stopPropagation();
    const newConvs = conversations.filter(c => c.id !== id);
    setConversations(newConvs);
    localStorage.setItem('busicohub-chats', JSON.stringify(newConvs));
    if (currentConvId === id) {
      startNewConversation();
    }
  };

  return (
    <div className="flex flex-col h-[450px]">
      <div className="flex justify-between items-center p-3 border-b border-[#ffffff15]">
        <div className="flex gap-2">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="bg-[#ffffff10] hover:bg-[#ffffff20] px-3 py-1.5 rounded-lg text-sm"
          >
            Historial ({conversations.length})
          </button>
          <button 
            onClick={startNewConversation}
            className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg text-sm"
          >
            + Nueva
          </button>
        </div>
        <span className="text-xs opacity-50">Tus chats se guardan localmente</span>
      </div>
      
      {showHistory ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center opacity-50 py-10">No tienes conversaciones guardadas</div>
          ) : (
            conversations.slice().reverse().map(conv => (
              <div 
                key={conv.id}
                onClick={() => loadConversation(conv)}
                className={clsx(
                  'p-3 rounded-xl cursor-pointer flex justify-between items-center',
                  conv.id === currentConvId ? 'bg-blue-600/30' : 'bg-[#ffffff10] hover:bg-[#ffffff15]'
                )}
              >
                <div>
                  <div className="font-medium">{conv.title}...</div>
                  <div className="text-xs opacity-50">{new Date(conv.updatedAt).toLocaleDateString()}</div>
                </div>
                <button 
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="text-red-500 hover:text-red-400 px-2"
                >
                  x
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={clsx(
                  'max-w-[80%] px-4 py-2 rounded-2xl whitespace-pre-line',
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#ffffff15]'
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#ffffff15] px-4 py-2 rounded-2xl">
                  <span className="animate-pulse">Escribiendo...</span>
                </div>
              </div>
            )}
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
                disabled={isTyping}
              />
              <button 
                onClick={handleSend} 
                disabled={isTyping}
                className="bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </div>
        </>
      )}
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
