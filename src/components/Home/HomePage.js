import React from 'react';
import Hero from './Hero';
import Services from './Services';
import Process from './Process';
import About from './About';
import TechStack from './TechStack';
import Contact from './Contact';
import Layout from '../Layout/Layout';

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <Services />
      <Process />
      <About />
      <TechStack />
      <Contact />
    </Layout>
  );
};

export default HomePage;
