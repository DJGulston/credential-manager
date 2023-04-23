/**
 * Component that displays the logged in user's details.
 * @param {*} props 
 * @returns 
 */
export function Account(props) {

    // Gets the user's details, i.e. username, role and assigned
    // organisational units and divisions.
    const userDetails = props.userDetails;

    // Gets the user's token.
    const token = props.token;

    // If the user's details and/or token are/is empty, we display
    // a 'not logged in' screen.
    if(JSON.stringify(userDetails) === '{}' || token === '') {
        return(
            <div className='login-content'>
                <h1>Account</h1>
                <p>You are not logged in. Nothing to display.</p>
            </div>
        );
    }
    else {

        // If the user details does not have any organisational units, we display
        // only the user's username and role, and indicate that no organisational
        // units were found.
        if(userDetails.organisational_units.length <= 0) {
            return(
                <div className='login-content'>
                    <h1>Account Details</h1>
                    <div>
                        <h3>{userDetails.username}</h3>
                        <p><b>Role:</b> {userDetails.role}</p>
                        <div><b>Organisational Units:</b></div>
                        <p>No organisational units assigned</p>
                    </div>
                </div>
            );
        }
        else {

            // If the user details have at least one organisational unit, we display
            // the user's username, role and organisational units.

            // Keeps track of the organisational unit index for the key.
            let orgIndex = 1;

            const orgUnitsList = userDetails.organisational_units.map((orgUnit) => {

                // Keeps track of the division index.
                let divisionIndex = 1;

                const divisionsList = orgUnit.divisions.map((division) => {

                    // Returns the division as a list item.
                    return(
                        <li key={userDetails._id + orgUnit._id + (orgIndex++) + division + (divisionIndex++)}>{division}</li>
                    );
                });

                // Returns the organisational unit as a list item.
                // Each list item contains a list of divisions.
                return(
                    <li key={userDetails._id + orgUnit._id + (orgIndex++)}>
                        <div>{orgUnit.name}</div>
                        <ul>{divisionsList}</ul>
                    </li>
                );
            });

            // Returns the user's username, role and organisational units with their divisions.
            return(
                <div className='login-content'>
                    <h1>Account Details</h1>
                    <div>
                        <h3>Username: {userDetails.username}</h3>
                        <div><b>Role:</b> {userDetails.role}</div>
                        <div><b>Organisational Units:</b></div>
                        <ol>{orgUnitsList}</ol>
                    </div>
                </div>
            );
        }
        
    }
}