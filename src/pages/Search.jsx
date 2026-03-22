import Tabs from '/src/components/loader/Tabs';
import Omnibox from '/src/components/loader/Omnibox';
import Viewer from '/src/components/loader/Viewer';
import Menu from '/src/components/loader/Menu';
import loaderStore from '/src/utils/hooks/loader/useLoaderStore';
import { process } from '/src/utils/hooks/loader/utils';
import { useOptions } from '../utils/optionsContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Loader({ config = {} }) {
  const location = useLocation();
  const { ui = true, zoom, alerts = false } = config;
  const { options } = useOptions();
  const tabs = loaderStore((state) => state.tabs);
  const updateUrl = loaderStore((state) => state.updateUrl);
  
  // Get URL from navigation state OR from config
  const url = location.state?.url || config.url;
  
  const barStyle = {
    backgroundColor: options.barColor || '#09121e',
  };

  useEffect(() => {
    if (url && tabs.length > 0) {
      //only 1 tab on initial load so tabs[0]
      const tab = tabs[0];
      const processedUrl = process(url, false, options.prType || 'auto', options.engine || null);
      if (processedUrl && tab.url !== processedUrl) {
        updateUrl(tab.id, processedUrl);
      }
    }
  }, [url, tabs, updateUrl, options.prType, options.engine]);

  useEffect(() => {
    loaderStore.getState().clearStore({ showTb: options.showTb ?? true });
  }, []);

  return (
    <div className="flex flex-col w-full h-screen">
      {ui && (
        <>
          <div 
            className="flex flex-col w-full" 
            style={barStyle}
            onClick={() => loaderStore.getState().showMenu && loaderStore.getState().toggleMenu()}
          >
            <Tabs />
            <Omnibox />
          </div>
          <Menu />
        </>
      )}
      <div 
        className="flex-1 w-full"
        onClick={() => loaderStore.getState().showMenu && loaderStore.getState().toggleMenu()}
      >
        <Viewer conf={{ zoom: zoom, alerts: alerts }} />
      </div>
    </div>
  );
}
