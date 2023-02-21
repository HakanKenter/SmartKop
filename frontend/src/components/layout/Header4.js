import React, { Fragment, useEffect, useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom'
// import '../../App.css'

import Search from './Search'

import { clearErrors, logout, updateUserCart } from '../../actions/userActions'
import { removeAllItemFromCart, addItemToCart } from '../../actions/cartActions';

const Header = () => {

    
    const alert= useAlert();
    const dispatch = useDispatch();

    let allCartItems = [];

    const { user, loading } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)
    const { error } = useSelector(state => state.user)

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, error, cartItems])


    const logoutHandler = (e) => {
        // e.preventDefault();

        if (cartItems) {

            if(cartItems && cartItems.length > 0) {
                cartItems.forEach(item => {
                    allCartItems.push({ product: item.product, quantity: item.quantity });
                })
            }

            const formData = new FormData();
            formData.append('allCartItems', JSON.stringify(allCartItems));
            dispatch(updateUserCart(formData))
        }

        dispatch(removeAllItemFromCart());
        dispatch(logout());

        alert.success('Déconnecté avec succès !');
    }
    
    return (
        <Fragment>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to="/" onClick={() => {window.location.href="/"}}>
                        </Link>
                    </div>
                </div>

                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Search />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    <Link to="/cart" style={{ textDecoration: 'none' }} >
                        <span id="cart" className="ml-3">Panier</span>
                        <span className="ml-1" id="cart_count">{cartItems.length}</span>
                    </Link>

                    {user ? (
                       
                        <Dropdown className="ml-4 d-inline dropdown-header-btn">
                            <Dropdown.Toggle className="dropdown-toggle text-white mr-4" id="dropdown-basic">
                                <figure className="avatar avatar-nav">
                                    <img
                                        src={user.avatar && user.avatar.url}
                                        alt={user && user.name}
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span>{user && user.name}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>

                                {user && user.role === 'admin' && (
                                    <Link className="dropdown-item" to="/dashboard">Tableau de bord</Link>
                                )}
                                <Link className="dropdown-item" to="/orders/me">Commande</Link>
                                <Link className="dropdown-item" to="/me">Profil</Link>
                                <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>Déconnexion</Link>
                            </Dropdown.Menu>
                        </Dropdown>
                        

                    ): !loading && <Link to="/login" className="btn ml-4" id="login_btn">Connexion</Link> }

                    
                </div>
            </nav>
        </Fragment>
    )
}

export default Header