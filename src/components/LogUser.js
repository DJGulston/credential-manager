import { useState } from "react";
import { NotificationPopup } from './NotificationPopup.js';

/**
 * Component that allows the user to login and logout of the website.
 * @param {*} props 
 * @returns 
 */
export function LogUser(props) {

    // Keeps track of the user's username and password.
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Keeps track of the page's loading status.
    // When true, a loading icon is displayed.
    // When false, the normal page is displayed.
    const [isLoading, setIsLoading] = useState(false);

    // Keeps track of whether to display a popup notification.
    const [showPopup, setShowPopup] = useState(false);

    // Keeps track of the popup notification's message.
    const [popupMessage, setPopupMessage] = useState('');

    // Keeps track of the popup type, i.e. Success or Error.
    const [popupType, setPopupType] = useState('');

    // Gets the user's token.
    const token = props.token;

    // Gets the user's details.
    const userDetails = props.userDetails;

    /**
     * Sets the user's token.
     * @param {*} newToken 
     */
    function setToken(newToken) {
        props.setToken(newToken);
    }

    /**
     * Sets the user's details.
     * @param {*} userDetails 
     */
    function setUserDetails(userDetails) {
        props.setUserDetails(userDetails);
    }

    /**
     * Sets the total list of all registered users.
     * @param {*} usersList 
     */
    function setUsers(usersList) {
        props.setUsers(usersList);
    }

    /**
     * Sets the list of all available credentials available
     * to the logged in user.
     * @param {*} credentialsList 
     */
    function setCredentials(credentialsList) {
        props.setCredentials(credentialsList);
    }

    /**
     * Allows the user to login to the server.
     */
    async function loginUser() {

        try {

            // Sets the page's login status to true.
            setIsLoading(true);
        
            // Sets the body of the login POST request.
            const loginBody = {
                username: username,
                password: password
            };

            // Logs the user into the server and gets a response back.
            const loginResponse = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginBody)
            });

            // Converts the response into a JSON object.
            const loginResult = await loginResponse.json();

            // If the JSON object has an error key, an Error popup
            // notification is displayed with the error key's value.
            if(loginResult.hasOwnProperty('error')) {
                setShowPopup(true);
                setPopupMessage(loginResult.error);
                setPopupType('Error');
                setToken('');
            }
            else if(loginResult.hasOwnProperty('token')) {

                // If the JSON object has a token key, a Success popup
                // notification is displayed and the user's token is set.

                // Displays the popup.
                setShowPopup(true);
                setPopupMessage('You are logged in!');
                setPopupType('Success');

                // Sets the token.
                setToken(loginResult.token);
                
                // Once the user receives a token, we fetch the user's details.
                // These details include their username, role and organisational
                // units and divisions.
                const userDetailsResponse = await fetch('/orgs-and-divisions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginResult.token}`
                    }
                });

                // User details response is converted to a JSON object.
                const userDetailsResult = await userDetailsResponse.json();

                // If the user details JSON object has an error key, we set
                // the user details to an empty object.
                if(userDetailsResult.hasOwnProperty('error')) {
                    setUserDetails({});
                }
                else {

                    // If the user details JSON object does not have an error key,
                    // we set that JSON object as the user details.
                    setUserDetails(userDetailsResult);
                }

                // Next, we fetch all credentials that the user has access to.
                const credentialsResponse = await fetch('/view-credentials', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginResult.token}`
                    }
                });
    
                // Credentials response is converted to a JSON object.
                const credentialsResult = await credentialsResponse.json();
    
                // If the credentials JSON object has an error key,
                // we set the credentials to an empty array.
                if(credentialsResult.hasOwnProperty('error')) {
                    setCredentials([]);
                }
                else {

                    // If the credentials JSON object does not have an error key,
                    // we set that JSON object as the credentials.
                    setCredentials(credentialsResult);
                }

                // Finally, we fetch a list of all users from the server.
                const usersResponse = await fetch('/all-users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginResult.token}`
                    }
                });
    
                // Users list response is converted to a JSON object.
                const usersList = await usersResponse.json();

                // If the users list JSON object has an error key, we
                // set the users list to an empty array.
                if(usersList.hasOwnProperty('error')) {
                    setUsers([]);
                }
                else {

                    // If the users list JSON object does not have an error key, we
                    // set the users list to that JSON object.
                    setUsers(usersList);
                }

            }

        }
        catch(error) {
            console.log(error);
            setShowPopup(true);
            setPopupMessage('Application error! Could not login!');
            setPopupType('Error');
        }
        finally {

            // Page's loading status is set to false once we have completed
            // the login POST request.
            setIsLoading(false);
        }

    }

    /**
     * Logs the user out of the website. All details pertaining
     * to the logged in user are set back to their default values,
     * and a Success popup message is displayed.
     */
    function logoutUser() {

        // Sets the token back to blank.
        setToken('');

        // Users list is set back to an empty array.
        setUsers([]);

        // Credentials list is set back to an empty array.
        setCredentials([]);

        // User details are set back to an empty object.
        setUserDetails({});

        // Success popup notification is displayed upon logging the user out.
        setShowPopup(true);
        setPopupMessage('You are logged out!');
        setPopupType('Success');
    }

    // If the page's loading status is true, we display the loading icon.
    if(isLoading) {
        return(
            <div className='login-content'>
                <h1>Login</h1>
                
                <div className='loading-icon'></div>
                
            </div>
        );
    }
    else if(token === '' && JSON.stringify(userDetails) === '{}') {

        // If the loading status is false, and the token and user details are blank,
        // then we display the login page.

        return(
            <div className='login-content'>
                <h1>Login</h1>

                {/* 
                    Component that displays a popup notification when the successfully
                    logs out, or when they unsuccessfully login.
                */}
                <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />
                
                <div className='new-block'>Welcome! To log into your Credential Manager account, enter your details below:</div>

                {/* Text field that allows the user to enter their username. */}
                <div className='form-item'>
                    <label htmlFor='username' className='form-label-1'><span className='required-marker'>*&nbsp;</span>Username</label>
                    <input type='text' id='username' name='username' className='form-input-1' placeholder='(Required) Username...' onChange={(e) => {
                        setUsername(e.target.value);
                    }} />
                </div>
                
                {/* Password field that allows the user to enter their password. */}
                <div className='form-item'>
                    <label htmlFor='password' className='form-label-1'><span className='required-marker'>*&nbsp;</span>Password</label>
                    <input type='password' id='password' name='password' className='form-input-1' placeholder='(Required) Password...' onChange={(e) => {
                        setPassword(e.target.value);
                    }} />
                </div>
    
                {/* Button that allows the user to login. */}
                <div className='form-item'>
                    <div className='form-label-1'></div>
                    <div className='form-input-1'>
                        <button onClick={loginUser} className='custom-btn'>Login</button>
                    </div>
                </div>
                
            </div>
        );
    }
    else {
        return(
            <div className='login-content'>
                <h3>Welcome, {userDetails.username}! You are logged in!</h3>

                {/* 
                    Component that displays a popup notification when
                    user successfully logs in.
                */}
                <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />

                {/* Button that allows the user to logout. */}
                <button onClick={logoutUser} className='custom-btn'>Logout</button>
            </div>
        );
    }
    
}