import { useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { NotificationPopup } from './NotificationPopup.js';

/**
 * Component that allows a logged in user to add a new credential
 * to a selected organisational unit and division.
 * @param {*} props 
 * @returns 
 */
export function AddCredential(props) {

    // Keeps track of the selected organisational unit and division for
    // the dropdown buttons.
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('<Organisational Unit>');
    const [selectedDivision, setSelectedDivision] = useState('<Division>');

    // Keeps track of the available divisions to choose from based on the
    // selected organisational unit.
    const [divisionDropdownOptions, setDivisionDropdownOptions] = useState([]);

    // Keeps track of the account name, username, password and confirm
    // password values for the new account credential.
    const [accountName, setAccountName] = useState('');
    const [accountUsername, setAccountUsername] = useState('');
    const [accountPassword, setAccountPassword] = useState('');
    const [accountConfirmPassword, setAccountConfirmPassword] = useState('');

    // Keeps track of the popup notification's message,
    // type and whether to show the popup or not.
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    // Gets the user's token.
    const token = props.token;

    // Gets the user's details, i.e. username, role and organisational
    // units and divisions.
    const userDetails = props.userDetails;

    /**
     * Sets the list of all credentials that the logged in user has
     * access to.
     * @param {*} credentials 
     */
    function setCredentials(credentials) {
        props.setCredentials(credentials);
    }

    /**
     * Sets the selected organisational unit that was clicked on in the first
     * dropdown button, and sets the list of divisions to choose from in the
     * second dropdown button based on the selected organisational unit.
     * @param {*} e 
     */
    function setOrgUnit(e) {

        let clickedOrgUnit = e.target.innerText;

        // If the user details has an organisational units key, then
        // we proceed to set the list of divisions.
        if(userDetails.hasOwnProperty('organisational_units')) {

            let divisions = [];

            // Iterates through the list of organisational units.
            for(let i = 0; i < userDetails.organisational_units.length; i++) {

                // If the selected organisational unit is equivalent to organisational
                // unit i, then we add the list of divisions to the divisions array.
                if(clickedOrgUnit === userDetails.organisational_units[i].name) {

                    // Iterates through the divisions for organisational unit i, and
                    // adds them to the divisions array.
                    for(let j = 0; j < userDetails.organisational_units[i].divisions.length; j++) {
                        let divisionName = userDetails.organisational_units[i].divisions[j];
                        divisions.push(divisionName);
                    }
                }
            }

            // Sets the list of divisions for the second dropdown button.
            setDivisionDropdownOptions(divisions);
        }

        // Sets the selected organisational unit.
        setSelectedOrgUnit(clickedOrgUnit);

        // Sets the selected division to a default value.
        setSelectedDivision('<Division>');
    }

    /**
     * Sets the selected division that was clicked on in the
     * second dropdown button.
     * @param {*} e 
     */
    function setDivision(e) {
        setSelectedDivision(e.target.innerText);
    }

    /**
     * Add the new account credential to the selected organisational
     * unit and division.
     */
    async function addCredential() {

        // If the selected organisational unit is set to the default
        // value, then an Error popup notification is displayed.
        if(selectedOrgUnit === '<Organisational Unit>') {
            setShowPopup(true);
            setPopupMessage('Cannot add credential. You have not selected an organisational unit and division.');
            setPopupType('Error');
        }
        else if(selectedDivision === '<Division>') {

            // If the selected division is set to the default value,
            // then an Error popup notification is displayed.
            setShowPopup(true);
            setPopupMessage('Cannot add credential. You have not selected a division.');
            setPopupType('Error');
        }
        else if(accountName === '' && accountUsername === '' && accountPassword === '') {

            // Displays an Error popup notification if the account
            // name, username and password fields are blank.
            setShowPopup(true);
            setPopupMessage('Cannot add credential. You have not entered an account name, username and password.');
            setPopupType('Error');
        }
        else if(accountName === '' && accountUsername !== '' && accountPassword !== '') {

            // Displays an Error popup notification if the account
            // name field is blank.
            setShowPopup(true);
            setPopupMessage('Cannot add credential. You have not entered an account name.');
            setPopupType('Error');
        }
        else if(accountName === '' && accountUsername !== '' && accountPassword === '') {

            // Displays an Error popup notification if the account
            // name and password fields are blank.
            setShowPopup(true);
            setPopupMessage('Cannot add credential. You have not entered an account name and password.');
            setPopupType('Error');
        }
        else if(accountName === '' && accountUsername === '' && accountPassword !== '') {

            // Displays an Error popup notification if the account
            // name and username fields are blank.
            setShowPopup(true);
            setPopupMessage('Cannot add credential. You have not entered an account name and username.');
            setPopupType('Error');
        }
        else if(accountName !== '' && accountUsername === '' && accountPassword === '') {

            // Displays an Error popup notification if the account
            // username and password fields are blank.
            setShowPopup(true);
            setPopupMessage('Cannot add credential. You have not entered an account username and password.');
            setPopupType('Error');
        }
        else if(accountName !== '' && accountUsername !== '' && accountPassword === '') {

            // Displays an Error popup notification if the account
            // password field is blank.
            setShowPopup(true);
            setPopupMessage('Cannot add credential. You have not entered an account password.');
            setPopupType('Error');
        }
        else if(accountName !== '' && accountUsername === '' && accountPassword !== '') {

            // Displays an Error popup notification if the account
            // username field is blank.
            setShowPopup(true);
            setPopupMessage('Cannot add credential. You have not entered an account username.');
            setPopupType('Error');
        }
        else if(accountPassword !== accountConfirmPassword) {

            // If the account password and confirm password fields do not match,
            // then an Error popup notification is displayed.
            setShowPopup(true);
            setPopupMessage('Cannot add credential. Passwords do not match.');
            setPopupType('Error');
        }
        else {

            // If all the fields are filled in, the account password and confirm
            // password fields match, and the organisational unit and division
            // dropdowns are selected, then we proceed with the addition of a new
            // credential.

            try {

                // Sets the body for the add credential POST request.
                const addCredBody = {
                    organisational_unit: selectedOrgUnit,
                    division: selectedDivision,
                    name: accountName,
                    username: accountUsername,
                    password: accountPassword
                };

                // Adds the new credential to the selected organisational unit
                // and division.
                let response = await fetch('/add-credential', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(addCredBody)
                });

                // Converts the add credential response to a JSON object.
                let addCredResult = await response.json();

                // If the add credentials JSON object has an error key, then
                // an Error popup message is dispayed.
                if(addCredResult.hasOwnProperty('error')) {
                    setShowPopup(true);
                    setPopupMessage(addCredResult.error);
                    setPopupType('Error');
                }
                else if(addCredResult.hasOwnProperty('message')) {

                    // If the add credentials JSON object has a message key, then
                    // a Success popup message is dispayed.
                    setShowPopup(true);
                    setPopupMessage(addCredResult.message);
                    setPopupType('Success');
                }

                // Fetches the list of credentials, that the logged in
                // user has access to, after adding a credential to the
                // selected organisational unit and division in order to
                // show the newly added credential.
                const viewResponse = await fetch('/view-credentials', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Converts the add credential response to a JSON object.
                const credentialsResult = await viewResponse.json();
    
                // If the add credential JSON object has an error key, then
                // we set the credentials list to be an empty array.
                if(credentialsResult.hasOwnProperty('error')) {
                    setCredentials([]);
                }
                else {

                    // If the add credential JSON object does not have an
                    // error key, then we set the credentials list to be
                    // that JSON object.
                    setCredentials(credentialsResult);
                }
            }
            catch(error) {
                console.log(error);
                setShowPopup(true);
                setPopupMessage('Application error! Could not add credential.');
                setPopupType('Error');
            }

        }
    }

    if(token === '') {

        // If the user is not logged in, i.e. does not have a token, then a
        // 'not logged in' message is displayed.

        return(
            <div className='add-credentials-content'>
                <h1>Add Credential</h1>
                <div>You are not logged in, and thus are not authorized to add a new credential.</div>
            </div>
        );
    }
    else {

        // If the user is logged in, i.e. has a token, then we display the normal add
        // credential page.

        let orgUnitDropdownList = userDetails.organisational_units.map((orgUnit) => {

            // Returns the list of organisational units as a dropdown item.
            return(
                <Dropdown.Item key={orgUnit.name} onClick={setOrgUnit}>{orgUnit.name}</Dropdown.Item>
            );
        });

        let divisionDropdownList = divisionDropdownOptions.map((division) => {

            // Returns the list of divisions as a dropdown item.
            return(
                <Dropdown.Item key={division} onClick={setDivision}>{division}</Dropdown.Item>
            );
        });

        return(
            <div className='add-credentials-content'>
                <h1>Add Credential</h1>

                {/*
                    Component that displays a popup notification when the credential
                    cannot be add to the selected organisational unit and division.
                */}
                <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />

                <div>Choose the organisational unit and division for which you would like to add a new credential:</div>
                
                {/* Displays organisational units dropdown button. */}
                <DropdownButton title={selectedOrgUnit} className='dropdown-btn'>
                    <Dropdown.Item onClick={setOrgUnit}>{'<Organisational Unit>'}</Dropdown.Item>
                    {orgUnitDropdownList}
                </DropdownButton>
                
                {/* Displays divisions dropdown button. */}
                <DropdownButton title={selectedDivision} className='dropdown-btn'>
                    <Dropdown.Item onClick={setDivision}>{'<Division>'}</Dropdown.Item>
                    {divisionDropdownList}
                </DropdownButton>

                <div>Enter the details for the new credential below:</div>

                {/* Allows the user to enter the new account name. */}
                <div className='form-item'>
                    <label htmlFor='account_name' className='form-label-3'><span className='required-marker'>*&nbsp;</span>Account Name</label>
                    <input type='text' id='account_name' name='account_name' className='form-input-3' placeholder='(Required) Account Name...' onChange={(e) => {
                        setAccountName(e.target.value);
                    }} />
                </div>

                {/* Allows the user to enter the new account username. */}
                <div className='form-item'>
                    <label htmlFor='account_username' className='form-label-3'><span className='required-marker'>*&nbsp;</span>Username</label>
                    <input type='text' id='account_username' name='account_username' className='form-input-3' placeholder='(Required) Account Username...' onChange={(e) => {
                        setAccountUsername(e.target.value);
                    }} />
                </div>

                {/* Allows the user to enter the new account password. */}
                <div className='form-item'>
                    <label htmlFor='account_password' className='form-label-3'><span className='required-marker'>*&nbsp;</span>Password</label>
                    <input type='password' id='account_password' name='account_password' className='form-input-3' placeholder='(Required) Account Password...' onChange={(e) => {
                        setAccountPassword(e.target.value);
                    }} />
                </div>

                {/* Allows the user to enter the new account confirm password. */}
                <div className='form-item'>
                    <label htmlFor='account_confirm_password' className='form-label-3'><span className='required-marker'>*&nbsp;</span>Confirm Password</label>
                    <input type='password' id='account_confirm_password' name='account_confirm_password' className='form-input-3' placeholder='(Required) Confirm Password...' onChange={(e) => {
                        setAccountConfirmPassword(e.target.value);
                    }} />
                </div>

                {/*
                    Allows the user to add the credential to the selected organisational
                    unit and division.
                */}
                <div className='form-item'>
                    <div className='form-label-3'></div>
                    <div className='form-input-3'>
                        <button onClick={addCredential} className='custom-btn'>Add Credential</button>
                    </div>
                </div>

            </div>
        );
    }
    
}