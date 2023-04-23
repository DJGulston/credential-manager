
/**
 * Component that displays Success and Error popup notifications.
 * @param {*} props 
 * @returns 
 */
export function NotificationPopup(props) {

    // Determines whether we should show the popup or not.
    const showPopup = props.showPopup;

    // Stores the popup's message.
    const popupMessage = props.popupMessage;

    // Keeps track of what type of popup it is,
    // i.e. Success or Error.
    const popupType = props.popupType;

    // Keeps track of what CSS class name to apply to the
    // popup's heading.
    let popupClass = '';

    // Sets the popup heading's CSS class name depending
    // on whether it is a Success or Error popup type.
    if(popupType === 'Success') {
        popupClass = 'popup-success';
    }
    else if(popupType === 'Error') {
        popupClass = 'popup-error';
    }

    // Sets the popup's display status to false, and sets the
    // message and type to blank.
    function closePopup() {
        props.setShowPopup(false);
        props.setPopupMessage('');
        props.setPopupType('');
    }

    // If the popup's display status is true, we display the popup.
    if(showPopup) {
        return(
            <div className='popup'>
                <div className='popup-header'>
                    <span className={popupClass}>{popupType}</span>

                    {/* X symbol that allows us to close the popup when clicked on. */}
                    <span onClick={closePopup}>{'\u2715'}</span>
                </div>
                
                <hr />

                <p>{popupMessage}</p>
            </div>
        );
    }
}