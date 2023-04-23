import { Link } from "react-router-dom";

/**
 * Component that displays the navigation menu links for the website.
 * @param {*} props 
 * @returns 
 */
export function NavMenu(props) {

    // Gets the currently selected link.
    const selectedNav = props.selectedNav;

    // Gets the user's token.
    const token = props.token;

    // Variables that can store the selectedLink CSS class name.
    // The selectedLink class underlines any link that it is
    // applied to.
    let homeClass = '';
    let logClass = '';
    let registerClass = '';
    let viewUsersClass = '';
    let viewCredentialsClass = '';
    let addCredentialClass = '';
    let accountClass = '';

    // Depending on which link is selected, the selectedLink CSS
    // class is set to that specific link.
    if(selectedNav === '/') {
        homeClass += 'selectedLink';
    }
    else if(selectedNav === '/log-user') {
        logClass += 'selectedLink';
    }
    else if(selectedNav === '/register') {
        registerClass += 'selectedLink';
    }
    else if(selectedNav === '/view-users') {
        viewUsersClass += 'selectedLink';
    }
    else if(selectedNav === '/view-credentials') {
        viewCredentialsClass += 'selectedLink';
    }
    else if(selectedNav === '/add-credential') {
        addCredentialClass += 'selectedLink';
    }
    else if(selectedNav === '/account') {
        accountClass += 'selectedLink';
    }

    /**
     * Sets the currently selected link to whichever link
     * was clicked on.
     * @param {*} e 
     */
    function setSelectedNav(e) {
        const location = e.target.getAttribute('data-navlink');
        props.setSelectedNav(location);
    }

    // If the user is not logged in, i.e. the user does not have a token,
    // then we only display the home, login and register links.
    if(token === '') {
        return(
            <nav className='header-item-2'>
                <Link to='/' data-navlink='/' className={homeClass} onClick={setSelectedNav}>Home</Link>
                <Link to='/log-user' data-navlink='/log-user' className={logClass} onClick={setSelectedNav}>Login</Link>
                <Link to='/register' data-navlink='/register' className={registerClass} onClick={setSelectedNav}>Register</Link>
            </nav>
        );
    }
    else {

        // If the user is logged in, i.e. the user has a token, then we display
        // the home, view users, view credentials, add credential, account and
        // logout links.

        return(
            <nav className='header-item-2'>
                <Link to='/' data-navlink='/' className={homeClass} onClick={setSelectedNav}>Home</Link>
                <Link to='/view-users' data-navlink='/view-users' className={viewUsersClass} onClick={setSelectedNav}>View Users</Link>
                <Link to='/view-credentials' data-navlink='/view-credentials' className={viewCredentialsClass} onClick={setSelectedNav}>View Credentials</Link>
                <Link to='/add-credential' data-navlink='/add-credential' className={addCredentialClass} onClick={setSelectedNav}>Add Credential</Link>
                <Link to='/account' data-navlink='/account' className={accountClass} onClick={setSelectedNav}>Account</Link>
                <Link to='/log-user' data-navlink='/log-user' className={logClass} onClick={setSelectedNav}>Logout</Link>
            </nav>
        );
    }
    
}