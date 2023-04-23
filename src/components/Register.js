import { useState } from "react";
import { NotificationPopup } from './NotificationPopup.js';

/**
 * Component that allows a user to register a new account.
 * @param {*} props 
 * @returns 
 */
export function Register(props) {

    // Keeps track of the registering user's username and password.
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Keeps track of whether the server is still registering the new
    // user's account.
    const [isLoading, setIsLoading] = useState(false);

    // Keeps track of whether to show a popup notification.
    const [showPopup, setShowPopup] = useState(false);

    // Keeps of the popup message.
    const [popupMessage, setPopupMessage] = useState('');

    // Keeps track of what type of popup is displayed, i.e. Success or Error.
    const [popupType, setPopupType] = useState('');

    /**
     * Function that registers a new user to the server.
     */
    async function registerUser() {

        // If the user does not enter username, password and/or
        // confirm password field values or the password and confirm
        // password fields do not match, then a popup will display
        // with an error message.
        if(username === '' && password === '') {
            setShowPopup(true);
            setPopupMessage('Username and password cannot be blank!');
            setPopupType('Error');
        }
        else if(username === '') {
            setShowPopup(true);
            setPopupMessage('Username cannot be blank!');
            setPopupType('Error');
        }
        else if(password === '') {
            setShowPopup(true);
            setPopupMessage('Password cannot be blank!');
            setPopupType('Error');
        }
        else if(confirmPassword !== password) {
            setShowPopup(true);
            setPopupMessage('Passwords do not match!');
            setPopupType('Error');
        }
        else if(confirmPassword === password && username !== '' && password !== '') {

            // If the user enters username, password and confirm password values
            // and the password and confirm password fields match, then we proceed
            // with the user registration.

            // Sets the page's loading status to true. When true, a loading icon
            // is displayed on the page.
            setIsLoading(true);

            // Creates the body for the register POST request.
            let registerBody = {
                username: username,
                password: password
            };

            try {

                // Registers the new user to the server and stores a response.
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(registerBody)
                });

                // Converts the response to a JSON object.
                const registerResult = await response.json();

                // If the JSON object has a message key, then we
                // display a Success popup notification with the
                // message key's value.
                if(registerResult.hasOwnProperty('message')) {
                    setShowPopup(true);
                    setPopupMessage(registerResult.message);
                    setPopupType('Success');
                }
                else if(registerResult.hasOwnProperty('error')) {

                    // If the JSON object has an error key, then we
                    // display an Error popup notification with the
                    // error key's value.

                    setShowPopup(true);
                    setPopupMessage(registerResult.error);
                    setPopupType('Error');
                }
            }
            catch(error) {
                console.log(error);
                setShowPopup(true);
                setPopupMessage('Application error! Could not register!');
                setPopupType('Error');
            }
            finally {
                // The page's loading status is set to false, once the
                // registration request is complete.
                setIsLoading(false);
            }

        }
        
    }

    // If the page's loading status is set to true, we display
    // a loading icon.
    if(isLoading) {
        return(
            <div className='login-content'>
                <h1>Register</h1>
                
                <div className='loading-icon'></div>
                
            </div>
        );
    }
    else {

        // If the page's loading status is set to false, we display
        // the normal registration page.

        return(
            <div className='login-content'>
                <h1>Register</h1>

                {/* Component that displays the Success and Error popup notifications. */}
                <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />

                <div className='new-block'>Welcome! To create your new account on the Credential Manager, enter your details below:</div>
                
                {/* Text field that allows the user to enter a username. */}
                <div className='form-item'>
                    <label htmlFor='username' className='form-label-2'><span className='required-marker'>*&nbsp;</span>Username</label>
                    <input type='text' id='username' name='username' className='form-input-2' placeholder='(Required) Username...' onChange={(e) => {
                        setUsername(e.target.value);
                    }} />
                </div>
    
                {/* Password field that allows a user to enter a password. */}
                <div className='form-item'>
                    <label htmlFor='password' className='form-label-2'><span className='required-marker'>*&nbsp;</span>Password</label>
                    <input type='password' id='password' name='password' className='form-input-2' placeholder='(Required) Password...' onChange={(e) => {
                        setPassword(e.target.value);
                    }} />
                </div>
                
                {/* Password field that allows the user to confirm their password by retyping it. */}
                <div className='form-item'>
                    <label htmlFor='confirmPassword' className='form-label-2'><span className='required-marker'>*&nbsp;</span>Confirm Password</label>
                    <input type='password' id='confirmPassword' name='confirmPassword' className='form-input-2' placeholder='(Required) Confirm Password...' onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }} />
                </div>
    
                {/* Register button that allows the user to register their details onto the server. */}
                <div className='form-item'>
                    <div className='form-label-2'></div>
                    <div className='form-input-2'>
                        <button onClick={registerUser} className='custom-btn'>Register</button>
                    </div>
                </div>
                
            </div>
        );
    }

}