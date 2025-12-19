import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Header from './Header';
import TourMatch from './component/Home/matchs/TourMatchs';
import BowlersTable from './component/Home/bowler/BowlersTable';
import ViewTeams from './component/Home/teams/viewTeam';
import BowlerForm from './component/Home/bowler/BowlerForm';
import CreateTeams from './component/Home/bowler/createTeams';
import Delete from './component/Home/bowler/Delete';
import Login from './component/account/Login';
import Register from './component/account/register';
import ViewAccounts from './component/account/accounts';
import AccountDetails from './component/account/AccountDetail';
import { useAuth } from './context/AuthContext';
import MatchList from './component/League/MatchList';
import StandingsTable from './component/League/StandingsTable';
import Footer from './Footer';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div
      className="App min-h-screen"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <Header title="Bowling League" description="Official Tournament" />
      <Routes>
        {/* Public League Routes */}
        <Route path="/" element={<TourMatch />} />
        <Route path="/fixtures" element={<MatchList />} />
        <Route path="/standings" element={<StandingsTable />} />
        <Route
          path="/stats"
          element={<BowlersTable isAuth={isAuthenticated} />}
        />
        <Route path="/teams" element={<ViewTeams />} />
        <Route
          path="/team/:id"
          element={<BowlersTable isAuth={isAuthenticated} />}
        />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route
          path="/bowlers"
          element={
            isAuthenticated ? (
              <BowlersTable isAuth={true} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/view-teams" element={<ViewTeams />} />
        <Route
          path="/bowler/new"
          element={
            isAuthenticated ? <BowlerForm /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/bowler/:id"
          element={
            isAuthenticated ? <BowlerForm /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/create-team"
          element={
            isAuthenticated ? <CreateTeams /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/edit-team/:id"
          element={
            isAuthenticated ? <CreateTeams /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/delete/:id"
          element={isAuthenticated ? <Delete /> : <Navigate to="/login" />}
        />
        <Route
          path="/delete-team/:id"
          element={isAuthenticated ? <Delete /> : <Navigate to="/login" />}
        />

        <Route
          path="/view-accounts"
          element={
            isAuthenticated ? <ViewAccounts /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/accounts/details/:id"
          element={
            isAuthenticated ? <AccountDetails /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/account/edit/:id"
          element={isAuthenticated ? <Register /> : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
