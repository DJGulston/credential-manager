import { Link } from "react-router-dom";
import { useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { NotificationPopup } from './NotificationPopup.js';

/**
 * Component that allows a logged in user to unassign a selected user from
 * a selected division.
 * @param {*} props 
 * @returns 
 */
export function UnassignDivision(props) {

    // Keeps track of the selected organisational unit and division for
    // the dropdown buttons.
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('<Organisational Unit>');
    const [selectedDivision, setSelectedDivision] = useState('<Division>');

    // Keeps track of the available divisions to choose from based on the
    // selected organisational unit.
    const [divisionDropdownOptions, setDivisionDropdownOptions] = useState([]);

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

    // Keeps track of the selected user that we want to assign to a division.
    const selectedUser = props.selectedUser;

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
     * Sets the list of all users.
     * @param {*} usersList 
     */
    function setUsers(usersList) {
        props.setUsers(usersList);
    }

    /**
     * Sets the user details for the logged in user.
     * @param {*} userDetails 
     */
    function setUserDetails(userDetails) {
        props.setUserDetails(userDetails);
    }

    /**
     * Unassigns a selected user from a specified division. The logged in user can only
     * unassign a selected user from a division that they themselves belong to.
     */
    async function unassignUserDivision() {

        // If the selected organisational unit or selected division is set to the default
        // value, then an Error popup notification is displayed.
        if(selectedOrgUnit === '<Organisational Unit>' || selectedDivision === '<Division>') {
            setShowPopup(true);
            setPopupMessage('Cannot unassign user division. Please select an organisational unit and division.');
            setPopupType('Error');
        }
        else {

            // If the selected organisational unit and selected division are not set to their
            // default values, then we proceed with the unassignment of the selected user from
            // a division.

            try {

                // Sets the body for the unassign division DELETE request.
                const deleteBody = {
                    user_id: selectedUser._id,
                    organisational_unit: selectedOrgUnit,
                    division: selectedDivision
                };

                // Unassigns the selected user from the selected division.
                const deleteResponse = await fetch('/unassign-division', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(deleteBody)
                });

                // The unassign division response is converted to a JSON object.
                const deleteResult = await deleteResponse.json();

                // If the unassign division JSON object has an error key, then
                // we display an Error popup notification.
                if(deleteResult.hasOwnProperty('error')) {
                    setShowPopup(true);
                    setPopupMessage(deleteResult.error);
                    setPopupType('Error');
                }
                else if(deleteResult.hasOwnProperty('message')) {
                    
                    // If the assign division JSON object has a message key, then
                    // we display a Success popup notification.
                    setShowPopup(true);
                    setPopupMessage(deleteResult.message);
                    setPopupType('Success');
                }

                // Fetches the list of all users after unassigning the selected
                // user from the selected division.
                const usersResponse = await fetch('/all-users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
        
                // Converts the users list response to a JSON object.
                const usersList = await usersResponse.json();
        
                // If the user list JSON object has an error key, then we
                // set the users list to an empty array.
                if(usersList.hasOwnProperty('error')) {
                    setUsers([]);
                }
                else {

                    // If the user list JSON object does not have an error
                    // key, then we set the users list to that JSON object.
                    setUsers(usersList);
                }

                // We fetch the user details of the logged in user
                // to account for the fact that the user may decide to remove
                // themselves from a division.
                const userDetailsResponse = await fetch('/orgs-and-divisions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Converts the user details response to a JSON object.
                const userDetailsResult = await userDetailsResponse.json();

                // If the user details JSON object has an error key, then
                // we set the user details to
                if(userDetailsResult.hasOwnProperty('error')) {
                    setUserDetails({});
                }
                else {

                    // If the user details JSON object does not have an error
                    // key, then we update the user details of the logged in user
                    // to account for the fact that the user may decide to remove
                    // themselves from a division.
                    setUserDetails(userDetailsResult);
                }

            }
            catch(error) {
                console.log(error);
                setShowPopup(true);
                setPopupMessage('Application error! Could not assign user division.');
                setPopupType('Error');
            }
        }
        
    }

    if(token === '') {

        // If the user is not logged in, i.e. does not have a token, then a
        // 'not logged in' message is displayed.

        return(
            <div className='change-role-content'>
                <h1>Unassign Division</h1>
                <p>You are not logged in, and thus you are not authorized to unassign user divisions.</p>
            </div>
        );
    }
    else {

        // If the user is logged in, i.e. has a token, then we display the
        // normal assign division page.

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
            <div className='change-role-content'>
                <h1>Unassign Division</h1>

                {/* Link that allows the user to navigate back to the view users page. */}
                <Link to='/view-users' className='view-cred-link'>{'\u2190'} View Users</Link>

                {/*
                    Component that displays a popup notification when the selected user
                    cannot be unassigned from the selected division.
                */}
                <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />

                {/* Displays the details of the selected user. */}
                <div className='new-block'>You are about to unassign the following user from a division:</div>
                <div><b>Username:</b> {selectedUser.username}</div>
                <div><b>Role:</b> {selectedUser.role}</div>

                <div className='new-block'>Choose the organisational unit and division from which you would like to unassign the user:</div>

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

                {/* Allows the user to unassign a selected user from a selected division. */}
                <button onClick={unassignUserDivision} className='custom-btn'>Unassign Division</button>
            </div>
        );
    }
}