import React from 'react';
import Hero from './Hero';
import Services from './Services';
import Process from './Process';
import Contact from './Contact';
import Layout from '../Layout/Layout';

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <Services />
      <Process />
      <Contact />
    </Layout>
  );
};

export default HomePage;
