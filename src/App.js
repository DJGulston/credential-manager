import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LogUser } from './components/LogUser.js';
import { Home } from './components/Home.js';
import { NavMenu } from './components/NavMenu.js';
import { Register } from './components/Register.js';
import { ViewUsers } from './components/ViewUsers.js';
import { ViewCredentials } from './components/ViewCredentials.js';
import { Account } from './components/Account.js';
import { AddCredential } from './components/AddCredential.js';
import { UpdateCredential } from './components/UpdateCredential.js';
import { ChangeRole } from './components/ChangeRole.js';
import { AssignDivision } from './components/AssignDivision.js';
import { UnassignDivision } from './components/UnassignDivision.js';

function App() {

  // Keeps track of the user's token. When the user
  // logs in, they obtain a token.
  const [token, setToken] = useState("");

  // Keeps track of the user's details. It stores the user's
  // username, role and organisational units and divisions.
  const [userDetails, setUserDetails] = useState({});

  // Keeps track of the currently selected navigation menu link.
  const [selectedNav, setSelectedNav] = useState(window.location.pathname);

  // Stores the list of all registered users.
  const [users, setUsers] = useState([]);

  // Stores the list of all credentials that the logged in user
  // has access to.
  const [credentials, setCredentials] = useState([]);

  // Keeps track of the currently selected credential to be updated.
  const [selectedCredential, setSelectedCredential] = useState({});

  // Keeps track of the currently selected user whose details will
  // be manipulated, i.e. change role, assign division or unassign
  // division.
  const [selectedUser, setSelectedUser] = useState({});

  return(
    
      <div>
        <BrowserRouter>
          <header className='page-header'>
            <span className='header-item-1'>Credential Manager</span>

            {/* Component that displays the navigation menu links for the website. */}
            <NavMenu token={token} selectedNav={selectedNav} setSelectedNav={setSelectedNav} />
          </header>

          <Routes>

            {/* Route that displays the home page of the website. */}
            <Route exact path='/' element={<Home token={token}
                                                 userDetails={userDetails} />} />

            {/* Route that allows the user to login and logout of the website. */}
            <Route exact path='/log-user' element={<LogUser token={token}
                                                            setToken={setToken}
                                                            userDetails={userDetails}
                                                            setUserDetails={setUserDetails}
                                                            setUsers={setUsers}
                                                            setCredentials={setCredentials} />} />

            {/* Route that allows a user to register a new account. */}
            <Route exact path='/register' element={<Register />} />

            {/*
              Route that displays a list of all users with their username, role
              and organisational units and divisions. The user may also navigate to
              the change role, assign division and unassign division pages.
            */}
            <Route exact path='/view-users' element={<ViewUsers token={token}
                                                                userDetails={userDetails}
                                                                users={users}
                                                                setUsers={setUsers}
                                                                setSelectedUser={setSelectedUser} />} />

            {/*
              Component that displays the list of all credentials that the logged in
              user has access to. It also allows the user to navigate to the update
              credential page.
            */}
            <Route exact path='/view-credentials' element={<ViewCredentials token={token}
                                                                            userDetails={userDetails}
                                                                            credentials={credentials}
                                                                            setCredentials={setCredentials}
                                                                            setSelectedCredential={setSelectedCredential} />} />

            {/* Route that displays the logged in user's details. */}
            <Route exact path='/account' element={<Account token={token}
                                                           userDetails={userDetails} />} />

            {/*
              Route that allows a logged in user to add a new credential
              to a selected organisational unit and division.
            */}
            <Route exact path='/add-credential' element={<AddCredential token={token}
                                                                        userDetails={userDetails}
                                                                        setCredentials={setCredentials} />} />
            
            {/*
              Route that allows the user to update the details of a specific
              account credential.
            */}
            <Route exact path='/update-credential' element={<UpdateCredential token={token}
                                                                              selectedCredential={selectedCredential}
                                                                              setCredentials={setCredentials} />} />
            
            {/*
              Route that allows the logged in user to change the
              role of any selected user to normal, management or admin.
            */}
            <Route exact path='/change-role' element={<ChangeRole token={token}
                                                                  selectedUser={selectedUser}
                                                                  setUsers={setUsers}
                                                                  setUserDetails={setUserDetails} />} />
            
            {/*
              Route that allows a logged in user to assign a selected user to
              a selected division.
            */}
            <Route exact path='/assign-division' element={<AssignDivision token={token}
                                                                          userDetails={userDetails}
                                                                          selectedUser={selectedUser}
                                                                          setUsers={setUsers} />} />
            
            {/*
              Route that allows a logged in user to unassign a selected user from
              a selected division.
            */}
            <Route exact path='/unassign-division' element={<UnassignDivision token={token}
                                                                              userDetails={userDetails}
                                                                              selectedUser={selectedUser}
                                                                              setUsers={setUsers}
                                                                              setUserDetails={setUserDetails} />} />
          </Routes>
        </BrowserRouter>
      </div>
    
  );

}

export default App;
