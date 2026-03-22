import clsx from 'clsx';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Wrench, MessageCircle } from 'lucide-react';
import { GlowWrapper } from '../utils/Glow';
import { useOptions } from '../utils/optionsContext';
import Logo from '../components/Logo';
import theme from '../styles/theming.module.css';
import 'movement.css';

const SearchContainer = memo(function SearchContainer({ logo = true, cls }) {
  const navigate = useNavigate();
  const { options } = useOptions();

  const shortcuts = [
    { 
      name: 'Juegos', 
      desc: 'Juega sin restricciones', 
      icon: Gamepad2, 
      color: 'bg-purple-600 hover:bg-purple-700',
      route: '/docs'
    },
    { 
      name: 'Herramientas', 
      desc: 'Chat IA, calculadora y mas', 
      icon: Wrench, 
      color: 'bg-blue-600 hover:bg-blue-700',
      route: '/materials'
    },
    { 
      name: 'Chat IA', 
      desc: 'Habla con BusicoBot', 
      icon: MessageCircle, 
      color: 'bg-green-600 hover:bg-green-700',
      route: '/materials'
    },
  ];

  return (
    <div
      className={clsx(
        !cls ? 'absolute w-full px-20 py-4 flex flex-col items-center mt-8 z-50' : cls,
      )}
      data-m={!cls && 'bounce-up'}
      data-m-duration={!cls && '0.8'}
    >
      {logo && <Logo options="w-[15.8rem] h-30" />}
      
      <div className="mt-8 text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Bienvenido a BusicoHub</h2>
        <p className="opacity-60">Tu espacio de entretenimiento sin limites</p>
      </div>

      <GlowWrapper
        glowOptions={{ color: options.glowWrapperColor || '255, 255, 255', size: 70, opacity: 0.2 }}
      >
        <div className="flex gap-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.name}
              onClick={() => navigate(shortcut.route)}
              className={clsx(
                'flex flex-col items-center p-6 rounded-2xl cursor-pointer transition-all duration-200',
                'hover:scale-105 hover:-translate-y-1',
                theme[`searchBarColor`],
                theme[`theme-${options.theme || 'default'}`],
              )}
              style={{ minWidth: '160px' }}
            >
              <div className={clsx('p-4 rounded-xl mb-3', shortcut.color)}>
                <shortcut.icon className="w-8 h-8 text-white" />
              </div>
              <span className="font-semibold text-lg">{shortcut.name}</span>
              <span className="text-sm opacity-60 text-center mt-1">{shortcut.desc}</span>
            </div>
          ))}
        </div>
      </GlowWrapper>

      <div className="mt-10 text-center opacity-50 text-sm">
        <p>Usa el filtro "Local" en Juegos para ver solo los que funcionan</p>
      </div>
    </div>
  );
});

export default SearchContainer;
