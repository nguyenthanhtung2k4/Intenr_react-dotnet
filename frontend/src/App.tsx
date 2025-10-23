import React from 'react';
import './App.css';
import Header from './Header';
import BowlersTable from './component/Home/BowlersTable';
import { Routes, Route } from 'react-router-dom';
import Delete from './component/Home/Detele';
import Edit from './component/Home/Edit';
import Create from './component/Home/Create';
import Teams from './component/Home/teams';
function App() {
  // const Team = ['Marlins', 'Sharks', 'Terrapins', 'Barracudas', 'Dolphins'];
  return (
    <div className="App">
      <Header title="Tungnt" description="I am study  React HIHI :)| CRUD" />
      <br />
      {/* <BowlersTable displayTeams={['Marlins', 'Sharks']} /> */}
      <Routes>
        <Route
          path="/"
          element={<BowlersTable displayTeams={['tungnt', 'Sharks']} />}
        />
        <Route path="/create" element={<Create />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/delete/:id" element={<Delete />} />
      </Routes>
    </div>
  );
}

export default App;
