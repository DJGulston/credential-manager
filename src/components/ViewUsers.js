import { useState } from "react";
import { Link } from "react-router-dom";
import { NotificationPopup } from './NotificationPopup.js';

/**
 * Component that displays a list of all users with their username, role
 * and organisational units and divisions. The user may also navigate to
 * the change role, assign division and unassign division pages.
 * @param {*} props 
 * @returns 
 */
export function ViewUsers(props) {

    // Keeps track of the page's loading status.
    const [isLoading, setIsLoading] = useState(false);

    // Keeps track of the popup notification's message,
    // type and whether to show the popup or not.
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    // Gets the user's token.
    const token = props.token;

    // Gets the list of all users.
    const users = props.users;

    // Gets the logged in user's details.
    const userDetails = props.userDetails;

    /**
     * Sets the list of all users.
     * @param {*} usersList 
     */
    function setUsers(usersList) {
        props.setUsers(usersList);
    }

    /**
     * Sets the selected user that the user wants to manipulate,
     * i.e. change role, assign division or unassign division.
     * @param {*} e 
     */
    function setSelectedUser(e) {

        let userJson = JSON.parse(e.target.getAttribute('data-user'));
        props.setSelectedUser(userJson);

    }

    /**
     * Sets the list of all users.
     */
    async function fetchUsers() {

        // If the user is not logged in, i.e. does not have a token, then
        // we set the list of users to an empty array.
        if(token === '') {
            setUsers([]);
        }
        else {

            // If the user is logged in, i.e. has a token, then
            // we proceed to retrieve the list of users.

            // Sets the page's loading status to true.
            setIsLoading(true);

            try {

                // Fetches the entire list of users via a POST request.
                const usersResponse = await fetch('/all-users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                // Converts the user list response to a JSON object.
                const usersList = await usersResponse.json();

                // If the user list JSON object has an error key, then
                // we display an Error popup notification and we set the
                // users list to an empty array.
                if(usersList.hasOwnProperty('error')) {
                    setShowPopup(true);
                    setPopupMessage(usersList.error);
                    setPopupType('Error');
                    setUsers([]);
                }
                else {

                    // If the user list JSON object does not have an error
                    // key, then we set the users list to an empty array.
                    setUsers(usersList);
                }
                
            }
            catch(error) {
                console.log(error);
                setShowPopup(true);
                setPopupMessage('Application error! Could not retrieve users.');
                setPopupType('Error');
            }
            finally {

                // Sets the page's loading status to false once the
                // fetch users POST request is complete.
                setIsLoading(false);
            }
        }

    }

    // If the page's loading status is set to true, then
    // we display the loading icon.
    if(isLoading) {
        return(
            <div className='users-content'>
                <h1>Users</h1>
                <div className='loading-icon'></div>
            </div>
        );
    }
    else {

        // If the page's loading status is set to false, then
        // we display the normal users list page.

        // If the user is not logged in, i.e. does not have a token,
        // then we display a 'not logged in' page.
        if(token === '') {
            return(
                <div className='users-content'>
                    <h1>Users</h1>
                    <p>You are not logged in, and thus do not have access to the contents of this page.</p>
                </div>
            );
        }
        else if(token !== '' && users.length <= 0) {

            // If the user is logged in, i.e. has a token, and the users list is empty,
            // then we display a page indicating that no users were found.

            return(
                <div className='users-content'>
                    <h1>Users</h1>

                    {/*
                        Component that displays a popup notification depending on whether
                        the users list could be successfully retrieved or not.
                    */}
                    <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />

                    {/* Button that allows the list of users to be retrieved. */}
                    <button onClick={fetchUsers} className='custom-btn'>Refresh Users</button>

                    <p className='new-block'>Welcome, {userDetails.username}!</p>
                    <p>Users list is empty. Click the refresh button to display the users.</p>
                </div>
            );
        }
        else if(token !== '' && users.length > 0) {

            // If the user is logged in, i.e. has a token, and the users list has at least
            // one user, then we display the list of users.

            const usersList = users.map((user) => {

                // If the user has no organisational units, then we return the user's username and role,
                // and a message indicating that they do not have any organisational units.
                // Also returns the links for that specific user that navigate to the change role, assign
                // division and unassign division pages.
                if(user.organisational_units.length <= 0) {
                    return(
                        <div key={user._id} className='user-block'>
                            <h3>{user.username}</h3>
                            <Link to='/change-role' className='update-cred-link' data-user={JSON.stringify(user)} onClick={setSelectedUser}>Change Role {'\u2192'}</Link>
                            <Link to='/assign-division' className='update-cred-link' data-user={JSON.stringify(user)} onClick={setSelectedUser}>Assign Division {'\u2192'}</Link>
                            <Link to='/unassign-division' className='update-cred-link' data-user={JSON.stringify(user)} onClick={setSelectedUser}>Unassign Division {'\u2192'}</Link>
                            <div><b>Role:</b> {user.role}</div>
                            <div><b>Organisational Units:</b></div>
                            <p>No organisational units assigned</p>
                        </div>
                    );
                }
                else {

                    // If the user has at least one organisational unit, then we return the user's username, role
                    // and organisational units and divisions.

                    const orgUnitsList = user.organisational_units.map((orgUnit) => {

                        const divisionsList = orgUnit.divisions.map((division) => {

                            // Returns the division as a list item.
                            return(
                                <li key={user._id + orgUnit._id + division}>{division}</li>
                            );
                        });
    
                        // Returns the organisational unit as a list item along with a
                        // list of all its divisions.
                        return(
                            <li key={user._id + orgUnit._id}>
                                <div>{orgUnit.name}</div>
                                <ul>{divisionsList}</ul>
                            </li>
                        );
                    });

                    // Returns a user's username, role and their list of organisational units
                    // and divisions.
                    return(
                        <div key={user._id} className='user-block'>
                            <h3>{user.username}</h3>
                            <Link to='/change-role' className='update-cred-link' data-user={JSON.stringify(user)} onClick={setSelectedUser}>Change Role {'\u2192'}</Link>
                            <Link to='/assign-division' className='update-cred-link' data-user={JSON.stringify(user)} onClick={setSelectedUser}>Assign Division {'\u2192'}</Link>
                            <Link to='/unassign-division' className='update-cred-link' data-user={JSON.stringify(user)} onClick={setSelectedUser}>Unassign Division {'\u2192'}</Link>
                            <div><b>Role:</b> {user.role}</div>
                            <div><b>Organisational Units:</b></div>
                            <ol>{orgUnitsList}</ol>
                        </div>
                    );
                }
                
            });
    
            return(
                <div className='users-content'>
                    <h1>Users</h1>

                    {/*
                        Component that displays a popup notification depending on whether
                        the users list could be successfully retrieved or not.
                    */}
                    <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />

                    {/* Button that allows the list of users to be retrieved. */}
                    <button onClick={fetchUsers} className='custom-btn'>Refresh Users</button>

                    {/* Displays the list of all users. */}
                    <div className='new-block'>Welcome, {userDetails.username}! Here is the list of all users below:</div>
                    <div className='users-grid'>{usersList}</div>
                </div>
            );
        }
    }
    
}