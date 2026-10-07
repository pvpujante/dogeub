import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  Cloud,
  HardDrive,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useLocalGmLoader } from '/src/utils/hooks/player/useLocalGmLoader';
import Control from './Controls';
import InfoCard from './InfoCard';
import theming from '/src/styles/theming.module.css';
import clsx from 'clsx';
import Tooltip from '@mui/material/Tooltip';
import loaderStore from '/src/utils/hooks/loader/useLoaderStore';
import DoomFrame from './DoomFrame';

const Loader = ({ theme, app }) => {
  const nav = useNavigate();
  const gmRef = useRef(null);
  const [zoom, setZoom] = useState(1.25);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const { gmUrl, loading, downloading } = useLocalGmLoader(app);
  const isLocal = app?.local;
  const activeFrameRef = loaderStore((state) => state.activeFrameRef);

  const handlePointerMove = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: Math.round(((event.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((event.clientY - rect.top) / rect.height) * 100),
    });
  }, []);

  const fs = useCallback(() => {
    if (gmRef.current) {
      gmRef.current?.requestFullscreen?.();
    } else if (activeFrameRef?.current) {
      //browser restricts fullscreen w/o some sort of user interaction
      //using boolean to decide fs wont work so we directly use frame reference
      activeFrameRef.current?.requestFullscreen?.();
    }
  }, [activeFrameRef]);

  const handleZoom = useCallback((direction) => {
    setZoom((prev) => {
      const newZoom = direction === 'in' ? Math.min(prev + 0.1, 2) : Math.max(prev - 0.1, 0.5);
      if (gmRef.current) gmRef.current.style.zoom = newZoom;
      return newZoom;
    });
  }, []);

  return (
      <div
        className={clsx(
          'playerLoader flex flex-col h-[calc(100vh-94px)] w-full rounded-2xl',
          theming.appItemColor,
          theming[`theme-${theme || 'default'}`],
        )}
        style={{ '--pointer-x': `${pointer.x}%`, '--pointer-y': `${pointer.y}%` }}
        onMouseMove={handlePointerMove}
        onMouseLeave={() => setPointer({ x: 50, y: 50 })}
      >
      <div className="gameTopbar">
        <div className="gameIdentity">
          <InfoCard app={app} theme={theme} />
          <span className="gameSourceBadge">
            {isLocal ? <HardDrive size={13} /> : <Cloud size={13} />}
            {isLocal ? 'Local' : 'Web'}
          </span>
        </div>
        <div className="gameActions">
          <Tooltip title="El juego está aislado dentro de la página" arrow placement="top">
            <span className="gameSecureBadge"><ShieldCheck size={14} /> Seguro</span>
          </Tooltip>
          {!isLocal && (
            <Tooltip title="Abrir en una pestaña nueva" arrow placement="top">
              <button className="gameIconButton" type="button" onClick={() => window.open(app?.url, '_blank', 'noopener,noreferrer')} aria-label="Abrir juego en nueva pestaña">
                <ExternalLink size={15} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {loading ? (
        <div className="w-full flex-grow flex items-center justify-center">
          {downloading ? 'Downloading...' : 'Loading...'}
        </div>
      ) : app?.doom ? (
        <DoomFrame />
      ) : (
        <div className="relative flex-grow min-h-0 overflow-hidden bg-black">
          <iframe
            key={isLocal ? gmUrl : app?.url}
            src={isLocal ? gmUrl : app?.url}
            ref={gmRef}
            title={`${app?.appName || 'Juego'} integrado`}
            onContextMenu={(e) => e.preventDefault()}
            className={clsx('gameFrame', !isLocal && 'gameFrameWeb')}
            style={isLocal ? { zoom } : undefined}
            loading="eager"
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-pointer-lock"
            allow="fullscreen; autoplay; gamepad"
          />
        </div>
      )}

      <div className="p-2.5 flex gap-2 border-t">
        <Tooltip title="El juego se mantiene dentro de esta página" arrow placement="top">
          <div className="flex items-center px-2 text-xs opacity-60">
            Modo integrado
          </div>
        </Tooltip>

        <div className="ml-auto" />
        <Control icon={ZoomIn} fn={() => handleZoom('in')} />
        <Control icon={ZoomOut} fn={() => handleZoom('out')} />
        <Control icon={Maximize2} fn={fs} />
      </div>
    </div>
  );
};

export default Loader;
