import Nav from '../layouts/Nav';
import Search from '../components/SearchContainer';
import Footer from '../components/Footer';
import { Gamepad2, MessageCircle, Wrench, ArrowUpRight, Sparkles } from 'lucide-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/apps.module.css';

const Home = memo(() => {
  const navigate = useNavigate();

  const quickLinks = [
    { title: 'Juegos', description: 'Colección local y web', icon: Gamepad2, route: '/docs', tone: 'violet' },
    { title: 'Chat IA', description: 'Ayuda para estudiar y crear', icon: MessageCircle, route: '/materials', tone: 'blue' },
    { title: 'Herramientas', description: 'Utilidades para tu día', icon: Wrench, route: '/materials', tone: 'green' },
  ];

  return (
    <div className={styles.homeShell}>
      <Nav />
      <main className={styles.homeDashboard}>
        <section className={styles.welcomePanel} aria-labelledby="welcome-title">
          <div>
            <span className={styles.eyebrow}><Sparkles size={15} /> BUSICOHUB</span>
            <h1 id="welcome-title">Tu espacio para jugar, aprender y crear</h1>
            <p>Todo lo que necesitas para tu día, reunido en un lugar rápido, privado y cómodo.</p>
            <div className={styles.welcomeLinks}>
              <button onClick={() => navigate('/docs')}>Explorar juegos <ArrowUpRight size={16} /></button>
              <button onClick={() => navigate('/materials')}>Abrir herramientas <ArrowUpRight size={16} /></button>
            </div>
          </div>
          <div className={styles.statusCard}>
            <span>Tu espacio está listo</span>
            <strong>Juega sin distracciones</strong>
            <small>Accede a juegos locales, web y utilidades desde el menú.</small>
          </div>
        </section>

        <section className={styles.quickLinksPanel} aria-labelledby="quick-links-title">
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>ACCESOS RÁPIDOS</span><h2 id="quick-links-title">¿Qué quieres hacer?</h2></div>
            <span className={styles.sectionHint}>Todo en un clic</span>
          </div>
          <div className={styles.quickLinksGrid}>
            {quickLinks.map(({ title, description, icon: Icon, route, tone }) => (
              <button key={title} className={`${styles.quickLinkCard} ${styles[tone]}`} onClick={() => navigate(route)}>
                <span className={styles.quickLinkIcon}><Icon size={22} /></span>
                <span><strong>{title}</strong><small>{description}</small></span>
                <ArrowUpRight className={styles.quickLinkArrow} size={18} />
              </button>
            ))}
          </div>
        </section>

        <section className={styles.legacySearch} aria-label="Accesos principales">
          <Search />
        </section>
      </main>
      <Footer />
    </div>
  );
});

Home.displayName = 'Home';
export default Home;
