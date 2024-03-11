import React, { useState, useEffect } from 'react';
import { Container, Nav } from 'react-bootstrap';
import './sidebar.scss';
import { useNavigate } from 'react-router-dom';
import logoImg from '@images/ropstam.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import SidebarItem from './SidebarItem';
import SidebarItemCollapse from './SidebarItemCollapse';
import { collapseSidebar } from '@redux/theme/theme_slice.js';
// import all static icons
import homeLight from '@icons/home-light.svg';
import homeDark from '@icons/home-dark.svg';
import groupLight from '@icons/group-light.svg';
import groupDark from '@icons/group-dark.svg';
import productLight from '@icons/product-light.svg';
import productDark from '@icons/product-dark.svg';
import monitor from '@icons/monitor (1).png';
import monitorlight from '@icons/monitor.png';

const Sidebar = () => {
    const dispatch = useDispatch();
    const collapsed = useSelector((state) => state.theme.collapsed);
    const autoCollapsed = useSelector((state) => state.theme.autoCollapsed);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedSelectedItem = localStorage.getItem('activeItem');
        // persist selected item on page refresh
        selectActiveItem(parseInt(storedSelectedItem, 10));
        // navigate to selected item route
        activateRouter(selectedItemId);
    }, []);

    const selectActiveItem = (storedItem) => {
        if (storedItem) {
            setSelectedItemId(storedItem);
            return;
        }
        setSelectedItemId(1);
    };

    const sideBarItems = [
        {
            id: 1,
            name: 'POS',
            iconLight: homeLight,
            iconDark: homeDark,
            linkTo: '/'
        },
        // {
        //     id: 2,
        //     name: 'POS',
        //     iconLight: productLight,
        //     iconDark: productDark,
        //     linkTo: '/'
        // },

        {
            id: 2,
            name: 'Employees',
            iconLight: groupLight,
            iconDark: groupDark,
            linkTo: '/employees'
        },
        {
            id: 3,
            name: 'Products',
            iconLight: productLight,
            iconDark: productDark,
            linkTo: '/products'
        },
        {
            id: 4,
            name: 'Ledgers',
            iconLight: groupLight,
            iconDark: groupDark,
            linkTo: '/ledgers'
        },
        {
            id: 5,
            name: 'Reports',
            iconLight: monitor,
            iconDark: monitorlight,
            linkTo: '/reports'
        }
    ];

    const activateRouter = (selectedItemId) => {
        const selectedItem = sideBarItems.filter((item) => {
            let foundItem;
            if (item.child) {
                foundItem = item.child.filter((childItem) => childItem.id === selectedItemId);
            }
            if (item.id === selectedItemId) {
                foundItem = item;
            }
            return foundItem;
        });
        navigate(selectedItem.linkTo);
    };

    const handleSideBarClick = (itemId) => {
        setSelectedItemId(itemId);
        localStorage.setItem('activeItem', itemId);
    };

    return (
        <div className={`sidebar ${collapsed ? 'hide-sidebar' : ''}`}>
            {autoCollapsed ? (
                <button type="button" onClick={() => dispatch(collapseSidebar(true))} className="btn-collapse-sidebar">
                    <FontAwesomeIcon className="collapse-icon" icon={faCircleXmark} />
                </button>
            ) : (
                <></>
            )}

            <Container>
                <div className="brand-logo">
                    <img src={logoImg} alt="brand-logo" />
                </div>
                <div className="side-nav-wrapper">
                    <Nav defaultActiveKey="/" className="sidebar-nav-items">
                        {sideBarItems.map((item) =>
                            item.child ? (
                                <SidebarItemCollapse key={item.id} item={item} selectedItemId={selectedItemId} handleSideBarClick={handleSideBarClick} />
                            ) : (
                                <SidebarItem key={item.id} item={item} selectedItemId={selectedItemId} handleSideBarClick={handleSideBarClick} />
                            )
                        )}
                    </Nav>
                </div>
            </Container>
        </div>
    );
};
export default Sidebar;
