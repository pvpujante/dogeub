import Nav from '../layouts/Nav';
import Breadcrumb from '../components/player/Breadcrumb';
import Loader from '../components/player/Loader';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import { useOptions } from '/src/utils/optionsContext';
import appsData from '/src/data/apps.json';

const slugify = (value = '') => value.trim().toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');

const Player = () => {
  const location = useLocation();
  const { gameSlug } = useParams();
  const { options } = useOptions();
  const catalog = [
    ...(appsData.apps || []),
    ...Object.values(appsData.games || {}).flat(),
  ];
  const app = location.state?.app || catalog.find((item) => slugify(item.appName) === gameSlug);

  // Keep direct links and refreshed game pages playable instead of returning to the catalog.
  if (!app) {
    return <Navigate to="/docs" replace />;
  }

  return (
    <>
      <Nav />
      <main className="playerShell w-[min(1120px,calc(100%-32px))] mx-auto flex flex-col gap-2 mt-2 mb-4">
        <Breadcrumb theme={options.theme} name={app.appName} />
        <Loader theme={options.theme} app={app} />
      </main>
    </>
  );
};

export default Player;
