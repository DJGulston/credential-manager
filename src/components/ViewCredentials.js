import { useState } from "react";
import { Link } from "react-router-dom";
import { NotificationPopup } from './NotificationPopup.js';

/**
 * Component that displays the list of all credentials that the logged in
 * user has access to. It also allows the user to navigate to the update
 * credential page.
 * @param {*} props 
 * @returns 
 */
export function ViewCredentials(props) {

    // Keeps track of the page's loading status.
    const [isLoading, setIsLoading] = useState(false);

    // Keeps track of the popup notification's message,
    // type and whether to show the popup or not.
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    // Gets the user's token.
    const token = props.token;

    // Gets the list of all credentials that the logged in user
    // has access to.
    const credentials = props.credentials;

    // Gets the logged in user's details.
    const userDetails = props.userDetails;

    /**
     * Sets the list of all credentials that the user has access to.
     * @param {*} credentials 
     */
    function setCredentials(credentials) {
        props.setCredentials(credentials);
    }

    /**
     * Sets the selected credential that the user would like to update.
     * @param {*} e 
     */
    function setSelectedCredential(e) {

        let strCredData = e.target.getAttribute('data-cred_data');

        if(strCredData !== undefined) {
            let credData = JSON.parse(strCredData);
            props.setSelectedCredential(credData);
        }
        
    }

    /**
     * Sets the list of all credentials that the logged in user has access to.
     */
    async function fetchCredentials() {

        // If the user is not logged in, i.e. has no token, we set the credential
        // list to be an empty array.
        if(token === '') {
            setCredentials([]);
        }
        else {

            // If the user is logged in, i.e. has a token, we proceed to fetch
            // the list of credentials the user has access to.

            // We set the page's loading status to true.
            setIsLoading(true);

            try {

                // Fetches the list of all credentials that the logged in user
                // has access to.
                const response = await fetch('/view-credentials', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                // Converts the credentials list response to a JSON object.
                const credentialsResult = await response.json();
    
                // If the credentials list JSON object has an error key, then
                // we display an Error popup notification, and we set the credentials
                // list to an empty array.
                if(credentialsResult.hasOwnProperty('error')) {
                    setShowPopup(true);
                    setPopupMessage(credentialsResult.error);
                    setPopupType('Error');
                    setCredentials([]);
                }
                else {

                    // If the credentials list JSON object does not have an error
                    // key, then we set the credentials list to that JSON object.
                    setCredentials(credentialsResult);
                }
            }
            catch(error) {
                console.log(error);
                setShowPopup(true);
                setPopupMessage('Application error! Could not retrieve credentials!');
                setPopupType('Error');
            }
            finally {

                // Page's loading status is set to false once the fetch credentials
                // POST request is complete.
                setIsLoading(false);
            }
            
        }
    }

    // If the page's loading status is set to true, then we
    // display the loading icon.
    if(isLoading) {
        return(
            <div className='login-content'>
                <h1>Credentials</h1>
                <div className='loading-icon'></div>
            </div>
        );
    }
    else {

        // If the page's loading status is set to false, then we display the normal
        // credentials list page.

        // If the user is not logged in, i.e. does not have a token, then we display a
        // 'not logged in' page.
        if(token === '') {
            return(
                <div className='login-content'>
                    <h1>Credentials</h1>
                    <p>You are not logged in, and are thus not authorized to view any credentials!</p>
                </div>
            );
        }
        else if(token !== '' && credentials.length <= 0) {

            // If the user is logged, i.e. has a token, and the credentials list is empty,
            // then we display a message indicating that the credentials list is empty.

            return(
                <div className='login-content'>
                    <h1>Credentials</h1>

                    {/*
                        Component that displays a popup notification when the credentials
                        cannot be retrieved from the server.
                    */}
                    <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />

                    {/* Button that retrieves the list of credentials that the user has access to. */}
                    <button onClick={fetchCredentials} className='custom-btn'>Refresh Credentials</button>
                    <p className='new-block'>Welcome, {userDetails.username}!</p>
                    <p>Credentials list is empty. Click the refresh button to display the credentials.</p>
                </div>
            );
        }
        else if(token !== '' && credentials.length > 0) {

            // If the user is logged, i.e. has a token, and the credentials list has at least
            // one credential, then we display the credentials list.

            // Keeps track of the organisational unit index.
            let orgIndex = 1;

            const orgUnitsList = credentials.map((orgUnit) => {

                // Keeps track of the division index.
                let divisionIndex = 1;

                const divisionsList = orgUnit.divisions.map((division) => {

                    // Keeps track of the account index.
                    let accountIndex = 1;

                    const accountsList = division.accounts.map((account) => {

                        // Gets the account credential for a particular organisational
                        // unit and division.
                        const credData = {
                            organisational_unit: orgUnit.name,
                            division: division.name,
                            account_name: account.name,
                            account_username: account.username,
                            account_password: account.password
                        };

                        // Returns the account credential as a list item. Also returns the
                        // link that navigates to the update credential page for a specific
                        // account credential.
                        return(
                            <li key={orgUnit._id + division._id + account._id + accountIndex++}>
                                <div><b>{account.name}</b></div>
                                <div><b>Username:</b> {account.username}</div>
                                <div><b>Password:</b> {account.password}</div>
                                <Link to='/update-credential' className='update-cred-link' data-cred_data={JSON.stringify(credData)} onClick={setSelectedCredential}>Update Credential {'\u2192'}</Link>
                            </li>
                        );
                    });

                    // Returns the division with the list of account credentials.
                    return(
                        <li key={orgUnit._id + division._id + divisionIndex++}>
                            <div><b>{division.name}</b></div>
                            <ol>{accountsList}</ol>
                        </li>
                    );
                });

                // Returns the organisational unit with the list of divisions
                // and account credentials.
                return(
                    <div key={orgUnit._id + orgIndex++} className='user-block'>
                        <h3>{orgUnit.name}</h3>
                        <ul>{divisionsList}</ul>
                    </div>
                );
            });

            // Returns the list of credentials that the user has access to.
            return(
                <div className='users-content'>
                    <h1>Credentials</h1>

                    {/*
                        Component that displays a popup notification when the credentials
                        cannot be retrieved from the server.
                    */}
                    <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />

                    {/* Button that retrieves the list of credentials that the user has access to. */}
                    <button onClick={fetchCredentials} className='custom-btn'>Refresh Credentials</button>

                    {/* Displays the list of credentials that the user has access to. */}
                    <div className='new-block'>Welcome, {userDetails.username}! Here are your list of credentials below:</div>
                    <div className='credentials-grid'>{orgUnitsList}</div>
                </div>
            );
        }
    }
    
}