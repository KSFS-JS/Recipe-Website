import React from 'react';
import {Button, Container, Form, Image, Nav, Navbar, NavDropdown} from "react-bootstrap";
import "./nav_raw.css";
import logo from '../../Icon/icon.png'
import Search_svg from "../../Icon/search";
import {useLocation} from "react-router-dom";
const Nav_raw = (props) => {
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="black" variant="dark" sticky="top">
                <Container fluid>
                    <Navbar.Brand href="/">
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
                                <NavDropdown.Item href="login/">Login</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="signup/">
                                    Sign Up
                                </NavDropdown.Item>
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
                                <Button variant="outline-success" onClick={() => props.SetRefresh(props.Refresh ^ 1)}><Search_svg/></Button>
                            </Form>}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Nav_raw;