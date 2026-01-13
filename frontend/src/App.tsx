import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import TourMatch from './component/Home/matchs/TourMatchs';
import Login from './component/account/Login';
import Register from './component/account/register';
import { AuthProvider, useAuth } from './context/AuthContext';
import Accounts from './component/account/accounts';
import CreateTeams from './component/Home/bowler/createTeams';
import Delete from './component/Home/bowler/Delete';
import ViewTeams from './component/Home/teams/viewTeam';
import TeamDetail from './component/Home/teams/team';
import BowlersTable from './component/Home/bowler/BowlersTable';
import BowlerForm from './component/Home/bowler/BowlerForm';
import Logout from './component/account/Logout';
import AccountDetail from './component/account/AccountDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastProvider, useToast } from './context/ToastContext';

import TournamentList from './component/League/TournamentList';
import MatchList from './component/League/MatchList';
import TournamentDetail from './component/League/TournamentDetail';
import StandingsTable from './component/League/StandingsTable';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header title="LeaguePals" description="Professional Bowling Management" />
      <Routes>
        {/* Public League Routes */}
        <Route path="/" element={<TourMatch />} />
        <Route path="/tournaments" element={<TournamentList />} />
        <Route path="/tournaments/:id" element={<TournamentDetail />} />
        <Route path="/fixtures" element={<MatchList />} />
        <Route path="/standings" element={<StandingsTable />} />

        {/* Existing Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/view-accounts" element={<Accounts />} />
        <Route path="/create-team" element={<CreateTeams />} />
        <Route path="/delete/:id" element={<Delete />} />
        <Route path="/teams" element={<ViewTeams />} />
        <Route path="/view-teams" element={<ViewTeams />} />
        <Route path="/team/:id" element={<TeamDetail />} />
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/stats" element={<BowlersTable />} />
        <Route path="/bowlers" element={<BowlersTable />} />
        <Route path="/bowler/new" element={<BowlerForm />} />
        <Route path="/bowler/:id" element={<BowlerForm />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/account/:username" element={<AccountDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  );
}
