import Nav from '../layouts/Nav';
import Search from '../components/SearchContainer';
import Footer from '../components/Footer';
import { memo } from 'react';

const Home = memo(() => {
  return (
    <>
      <Nav />
      <Search />
      <Footer />
    </>
  );
});

Home.displayName = 'Home';
export default Home;
