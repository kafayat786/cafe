import React from 'react';
import './topbar.scss';
import ProfileDropdown from '../DropDown/Profile/ProfileDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '@redux/theme/theme_slice.js';
const Topbar = () => {
    const dispatch = useDispatch();

    const logoutHandler = () => {
        // handle logout
    };

    return (
        <div className="top-nav">
            <div className="nav-left-items">
                <button onClick={() => dispatch(toggleSidebar())} className="menu-toggler" type="button">
                    <FontAwesomeIcon icon={faBarsStaggered} />
                </button>
            </div>
            <div className="nav-right-items">
                <ProfileDropdown handler={logoutHandler} />
            </div>
        </div>
    );
};
export default Topbar;
