import React from 'react';
import {Button, Container, Form, Image, Nav, Navbar, NavDropdown} from "react-bootstrap";
import "./nav_login.css";
import logo from '../../Icon/icon.png'
import Search_svg from "../../Icon/search";
import {useLocation, useNavigate} from "react-router-dom";


const Nav_login = (props) => {
    const navigate = useNavigate();

    const redirectTo = () => {
        // 👇️ redirect to /contacts
        navigate('/');
    };

    const Logout = () => {
        if (window.sessionStorage.getItem('auth_token') !== null){
            fetch("http://127.0.0.1:8000/account/logout/", {
                method: "GET",
                headers: {
                    "Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`
                }
            })
                .then(() => {
                    window.sessionStorage.removeItem('auth_token');
                    for(let b of document.getElementsByClassName('filter_clear_button')) {b.click()}
                    props.SetRefresh(props.Refresh ^ true);
                    redirectTo();
                })
        }
    }


    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="black" variant="dark" sticky="top" >
                <Container fluid>
                    <Navbar.Brand href="#">
                        <Image src={logo} id={`Logo`}></Image>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="/" className={`Text`}> <span >Home</span></Nav.Link>
                            <NavDropdown title={<span > Account </span>} id="navbarScrollingDropdown" className={`Text`}>
                                <NavDropdown.Item href="/profile/">My profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/myrecipes/">My Recipes</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/create_recipe/">Create Recipe</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/cart/">Shopping list</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={Logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        {useLocation().pathname === "/" &&
                            <Form className="d-flex">
                            <Form.Control
                                id="Search_input"
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success" onClick={() => {
                                props.SetRefresh(props.Refresh ^ 1);
                            }}><Search_svg/></Button>
                        </Form>}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Nav_login;