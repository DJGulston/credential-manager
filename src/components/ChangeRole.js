import { DropdownButton, Dropdown } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { NotificationPopup } from './NotificationPopup.js';

/**
 * Component that allows the logged in user to change the
 * role of any selected user to normal, management or admin.
 * @param {*} props 
 * @returns 
 */
export function ChangeRole(props) {

    // Keeps track of the currently selected role in the dropdown
    // button.
    const [selectedRole, setSelectedRole] = useState('<Role>');

    // Keeps track of the popup notification's message,
    // type and whether to show the popup or not.
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    // Gets the user's token.
    const token = props.token;

    // Keeps track of the selected user that we want to assign to a division.
    const selectedUser = props.selectedUser;

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
     * Sets the selected role that was clicked on in the dropdown
     * button.
     * @param {*} e 
     */
    function setDropdownRole(e) {
        let dropdownRole = e.target.innerText;
        setSelectedRole(dropdownRole);
    }

    /**
     * Changes the selected user's role.
     */
    async function changeUserRole() {

        try {

            // If the selected role is the default dropdown button role,
            // then an error popup notification is displayed.
            if(selectedRole === '<Role>') {
                setShowPopup(true);
                setPopupMessage('Cannot update user role. Please select a valid role.');
                setPopupType('Error');
            }
            else {

                // Sets the selected role to lowercase to match the format
                // in the database.
                let newRole = selectedRole.toLowerCase();

                // Sets the body for the update role PUT request.
                const updateBody = {
                    user_id: selectedUser._id,
                    new_role: newRole
                };
                
                // Updates the role of the selected user.
                const updateResponse = await fetch('/update-role', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateBody)
                });
        
                // Converts the update role response to a JSON object.
                const updateResult = await updateResponse.json();
        
                // If the update role JSON object has an error key, then
                // an Error popup notification is displayed.
                if(updateResult.hasOwnProperty('error')) {
                    setShowPopup(true);
                    setPopupMessage(updateResult.error);
                    setPopupType('Error');
                }
                else if(updateResult.hasOwnProperty('message')) {

                    // If the update role JSON object has a message key, then
                    // a Success popup notification is displayed.
                    setShowPopup(true);
                    setPopupMessage(updateResult.message);
                    setPopupType('Success');
                }
        
                // Fetches the users list after updating the selected user's role
                // to display the selected user's new role in the view users page.
                const usersResponse = await fetch('/all-users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
        
                // Converts the users list response to a JSON object.
                const usersList = await usersResponse.json();
        
                // If the users list JSON object has error key, then we set
                // the users list to an empty array.
                if(usersList.hasOwnProperty('error')) {
                    setUsers([]);
                }
                else {

                    // If the users list JSON object does not have an error key,
                    // then we set the users list to that JSON object.
                    setUsers(usersList);
                }

                // Fetches the logged in user's details after updating the selected
                // user's role to account for the fact that the logged in user may
                // have decided to update their own role.
                const userDetailsResponse = await fetch('/orgs-and-divisions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Converts the user details response to a JSON object.
                const userDetailsResult = await userDetailsResponse.json();

                // If the user details JSON object has an error key, then we set
                // the user details to an empty object.
                if(userDetailsResult.hasOwnProperty('error')) {
                    setUserDetails({});
                }
                else {

                    // If the user details JSON object does not have an error key,
                    // then we set the user details to that JSON object.
                    setUserDetails(userDetailsResult);
                }

            }
    
        }
        catch(error) {
            console.log(error);
            setShowPopup(true);
            setPopupMessage('Application error! Cannot change user role!');
            setPopupType('Error');
        }

    }

    if(token === '') {

        // If the user is not logged in, i.e. does not have a token, then a
        // 'not logged in' message is displayed.

        return(
            <div className='change-role-content'>
                <h1>Change Role</h1>
                <p>You are not logged in, and thus you are not authorized to change user roles.</p>
            </div>
        );
    }
    else {
        return(
            <div className='change-role-content'>
                <h1>Change Role</h1>

                {/* Link that allows the user to navigate back to the view users page. */}
                <Link to='/view-users' className='view-cred-link'>{'\u2190'} View Users</Link>

                {/*
                    Component that displays a popup notification when the selected user's
                    role cannot be updated.
                */}
                <NotificationPopup showPopup={showPopup}
                                   setShowPopup={setShowPopup}
                                   popupMessage={popupMessage}
                                   setPopupMessage={setPopupMessage}
                                   popupType={popupType}
                                   setPopupType={setPopupType} />

                {/* Displays the details of the selected user. */}
                <div className='new-block'>You are about to update the role for the following user:</div>
                <div><b>Username:</b> {selectedUser.username}</div>
                <div><b>Role:</b> {selectedUser.role}</div>

                <div className='new-block'>Select the new role for your selected user:</div>

                {/*
                    Dropdown button that allows the user to select the role they would
                    like to update the selected user with.
                */}
                <DropdownButton title={selectedRole} className='dropdown-btn'>
                    <Dropdown.Item onClick={setDropdownRole}>{'<Role>'}</Dropdown.Item>
                    <Dropdown.Item onClick={setDropdownRole}>Normal</Dropdown.Item>
                    <Dropdown.Item onClick={setDropdownRole}>Management</Dropdown.Item>
                    <Dropdown.Item onClick={setDropdownRole}>Admin</Dropdown.Item>
                </DropdownButton>

                {/* Button that allows the user to update the selected user's role. */}
                <button onClick={changeUserRole} className='custom-btn'>Change Role</button>
            </div>
        );
    }
    
}