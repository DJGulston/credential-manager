import { useState } from "react";
import { Link } from "react-router-dom";
import { NotificationPopup } from './NotificationPopup.js';

/**
 * Component that allows the user to update the details of a specific
 * account credential.
 * @param {*} props 
 * @returns 
 */
export function UpdateCredential(props) {

    // Keeps track of the new account credential details that
    // we would like tho update the account with.
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountUsername, setNewAccountUsername] = useState('');
    const [newAccountPassword, setNewAccountPassword] = useState('');
    const [newAccountConfirmPassword, setNewAccountConfirmPassword] = useState('');

    // Keeps track of the popup notification's message,
    // type and whether to show the popup or not.
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    // Gets the user's token.
    const token = props.token;

    // Gets the credential that the user selected for update.
    const selectedCredential = props.selectedCredential;

    /**
     * Sets the list of all credentials that the logged in user has
     * access to.
     * @param {*} credentials 
     */
    function setCredentials(credentials) {
        props.setCredentials(credentials);
    }

    /**
     * Updates the currently selected credential to the values specified
     * by the user.
     */
    async function updateCredential() {

        // Obtains the new values for the account name, username,
        // password and the confirmed password.
        let strNewAccountName = newAccountName;
        let strNewAccountUsername = newAccountUsername;
        let strNewAccountPassword = newAccountPassword;
        let strNewAccountConfirmPassword = newAccountConfirmPassword;

        // If the new account name is blank, we set it to the original
        // account name.
        if(strNewAccountName === '') {
            strNewAccountName = selectedCredential.account_name;
        }

        // If the new account username is blank, we set it to the original
        // account username.
        if(strNewAccountUsername === '') {
            strNewAccountUsername = selectedCredential.account_username;
        }

        // If the new account password is blank, we set it to the original
        // account password.
        if(strNewAccountPassword === '') {
            strNewAccountPassword = selectedCredential.account_password;
            strNewAccountConfirmPassword = selectedCredential.account_password;
        }

        // If the new account password and the confirm password do not match,
        // we return an Error popup notification.
        if(strNewAccountConfirmPassword !== strNewAccountPassword) {
            setShowPopup(true);
            setPopupMessage('Cannot update credential. Passwords do not match.');
            setPopupType('Error');
        }
        else {
            
            // Sets the body of the update credential PUT request.
            let updateCredBody = {
                organisational_unit: selectedCredential.organisational_unit,
                division: selectedCredential.division,
                old_name: selectedCredential.account_name,
                old_username: selectedCredential.account_username,
                old_password: selectedCredential.account_password,
                new_name: strNewAccountName,
                new_username: strNewAccountUsername,
                new_password: strNewAccountPassword
            };

            try {

                // Updates the selected credential and retrieves a response.
                const updateResponse = await fetch('/update-credential', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateCredBody)
                });

                // Converts the update credential response to a JSON object.
                const updateResult = await updateResponse.json();

                // If the update credential JSON object has an error key,
                // we display an Error notification popup.
                if(updateResult.hasOwnProperty('error')) {
                    setShowPopup(true);
                    setPopupMessage(updateResult.error);
                    setPopupType('Error');
                }
                else if(updateResult.hasOwnProperty('message')) {

                    // If the update credential JSON object has a message key,
                    // we display a Success notification popup.
                    setShowPopup(true);
                    setPopupMessage(updateResult.message);
                    setPopupType('Success');
                }

                // Once the credential is updated, we fetch list of credentials
                // to see the updated credential in the credentials list.
                const viewResponse = await fetch('/view-credentials', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                // Converts the credentials list response to a JSON object.
                const credentialsResult = await viewResponse.json();
    
                // If the credentials list JSON object has an error key, we
                // set the credentials list to an empty array.
                if(credentialsResult.hasOwnProperty('error')) {
                    setCredentials([]);
                }
                else {

                    // If the credentials list JSON object does not have an
                    // error key, we set the credentials list as that JSON
                    // object.
                    setCredentials(credentialsResult);
                }
            }
            catch(error) {
                console.log(error);
                setShowPopup(true);
                setPopupMessage('Application error! Cannot update credential.');
                setPopupType('Error');
            }
        }
    }

    if(token === '') {

        // If the user is not logged in, i.e. does not have a token, then a
        // 'not logged in' message is displayed.

        return(
            <div className='update-credentials-content'>
                <h1>Update Credential</h1>
                <div>You are not logged in, and thus are not authorized to update a credential.</div>
            </div>
        );
    }
    else if(JSON.stringify(selectedCredential) === '{}') {

        // If the user is logged in, i.e. has a token, and the selected credential is
        // empty, a 'no credential selected' message is displayed.

        return(
            <div className='update-credentials-content'>
                <h1>Update Credential</h1>

                {/* Link that allows the user to navigate back to the view credentials page. */}
                <Link to='/view-credentials' className='view-cred-link'>{'\u2190'} View Credentials</Link>

                <div>No credential has been selected for an update.</div>
            </div>
        );
    }
    else if(JSON.stringify(selectedCredential) !== '{}') {

        // If the user is logged in, i.e. has a token, and the selected credential is
        // not empty, the update credential page is displayed.

        return(
            <div className='update-credentials-content'>
                <h1>Update Credential</h1>

                {/*
                    Component that displays a popup notification when the credentials
                    cannot be updated.
                */}
                <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />

                {/* Link that allows the user to navigate back to the view credentials page. */}
                <Link to='/view-credentials' className='view-cred-link'>{'\u2190'} View Credentials</Link>

                <div className='new-block'>You are about to update the following credential:</div>

                {/* Displays the old/original credential. */}
                <div className='new-block'><b>Organisational Unit:</b> {selectedCredential.organisational_unit}</div>
                <div><b>Division:</b> {selectedCredential.division}</div>
                <div><b>Name:</b> {selectedCredential.account_name}</div>
                <div><b>Username:</b> {selectedCredential.account_username}</div>
                <div><b>Password:</b> {selectedCredential.account_password}</div>

                <div className='new-block'>Enter any new credential details that you wish to update below. Any fields that are left blank will not be updated and will remain the same as before.</div>

                <div><span className='required-marker'>**&nbsp;</span>Note that at least one field is required.</div>

                {/* Text field that allows the user to enter a new account name for the selected credential. */}
                <div className='form-item'>
                    <label htmlFor='account_name' className='form-label-3'>Account Name</label>
                    <input type='text' id='account_name' name='account_name' className='form-input-3' placeholder='(Optional) Account name...' onChange={(e) => {
                        setNewAccountName(e.target.value);
                    }} />
                </div>

                {/* Text field that allows the user to enter a new username for the selected credential. */}
                <div className='form-item'>
                    <label htmlFor='account_username' className='form-label-3'>Username</label>
                    <input type='text' id='account_username' name='account_username' className='form-input-3' placeholder='(Optional) Account username...' onChange={(e) => {
                        setNewAccountUsername(e.target.value);
                    }} />
                </div>

                {/* Password field that allows the user to enter a new password for the selected credential. */}
                <div className='form-item'>
                    <label htmlFor='account_password' className='form-label-3'>Password</label>
                    <input type='password' id='account_password' name='account_password' className='form-input-3' placeholder='(Optional) Account password...' onChange={(e) => {
                        setNewAccountPassword(e.target.value);
                    }} />
                </div>

                {/* Confirm password field for the credential password. */}
                <div className='form-item'>
                    <label htmlFor='account_confirm_password' className='form-label-3'>Confirm Password</label>
                    <input type='password' id='account_confirm_password' name='account_confirm_password' className='form-input-3' placeholder='(Optional) Confirm password...' onChange={(e) => {
                        setNewAccountConfirmPassword(e.target.value);
                    }} />
                </div>

                {/* Button that allows the user to update the credential. */}
                <div className='form-item'>
                    <div className='form-label-3'></div>
                    <div className='form-input-3'>
                        <button onClick={updateCredential} className='custom-btn'>Update Credential</button>
                    </div>
                </div>
            </div>
        );
    }
}