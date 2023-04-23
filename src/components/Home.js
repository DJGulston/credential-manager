/**
 * Component that displays the home page of the website.
 * @param {*} props 
 * @returns 
 */
export function Home(props) {

    // Gets the details of the user currently logged in.
    const userDetails = props.userDetails;

    // Gets the user's token.
    const token = props.token;

    // If the user is not logged in, i.e. does not have a token, then
    // we display this home page content.
    if(token === '') {
        return(
            <div className='home-content'>
                <h1>Welcome to the Credential Manager!</h1>
    
                <p>If you have an account already, you may login at the top right corner of the page.</p>
    
                <p>If you do not have an account, you may register a new user account at the top right corner of the page.</p>

                <p>
                    Note that new users will not have access to any credentials upon registration and will 
                    have limited capabilities. To gain access to certain credentials, contact an admin to 
                    grant you access to the credential necessary credentials. If you need more capabilities,
                    contact an admin to change your role from normal to a management or admin role.
                </p>

            </div>
        );
    }
    else {

        // If the user is logged in, i.e. has a token, then we display
        // this home page content along with their username.

        return(
            <div className='home-content'>
                <h1>Welcome to the Credential Manager, {userDetails.username}!</h1>
    
                <p>You can view your credentials by navigating to the View Credentials page.</p>
    
                <p>You can also view all users and change their settings in the View Users page.</p>

                <p>To take a look at your account details, navigate to the Account page.</p>

                <p>
                    To add a new credential to your assigned division, navigate to the Add Credential 
                    page and enter the details.
                </p>

                <p>
                    Note that new users will not have access to any credentials upon registration and will 
                    have limited capabilities. To gain access to certain credentials, contact an admin to 
                    grant you access to the credential necessary credentials. If you need more capabilities,
                    contact an admin to change your role from normal to a management or admin role.
                </p>
            </div>
        );
    }
    
}

    