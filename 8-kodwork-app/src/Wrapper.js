import React from 'react';
import JobProvider from './Context/JobProvider';
import Router from './Router';

const Wrapper = () => {
  return (
    <JobProvider>
      <Router />
    </JobProvider>
  );
};

export default Wrapper;
