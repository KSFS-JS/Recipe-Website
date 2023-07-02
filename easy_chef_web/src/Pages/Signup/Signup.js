import React from 'react';
import * as PropTypes from "prop-types";
import {Button, Container} from "react-bootstrap";
import "./signup.css"
import {useNavigate} from "react-router-dom";
import "../../Common_css/button.css"

function MDBSelect(props) {
    return null;
}

MDBSelect.propTypes = {
    size: PropTypes.string,
    data: PropTypes.any,
    className: PropTypes.string
};

// Reference: https://mdbootstrap.com/docs/react/extended/registration-form/


function Signup() {
    const navigate = useNavigate();

    const redirectTo = () => {
        // 👇️ redirect to /contacts
        navigate('/login/');
    };

    function SignupCheck(formData){
        let username = document.getElementById('username').value
        let password1 = document.getElementById('password1').value
        let password2 = document.getElementById('password2').value
        let email = document.getElementById('email').value
        let phone_num = document.getElementById('phone_num').value
        let avatar = document.getElementById('form-input').files[0]
        let first_name = document.getElementById('firstname').value
        let last_name = document.getElementById('lastname').value

        let flag = true;

        let error_lst = document.getElementsByClassName('signuperror')
        for (let e of error_lst) {e.innerText = ''}

        let phone_regex = /^\d\d\d-\d\d\d-\d\d\d\d$/;
        if (phone_num !== '' && !phone_regex.test(phone_num)){
            error_lst.item(0).innerText= "- Invalid Phone number"
        }

        let email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if(email !== '' && !email_regex.test(email)){
            error_lst.item(1).innerText = "- Invalid Email";
        }

        if (username === '' || /\s/g.test(username)){
            error_lst.item(2).innerText = "- Invalid Username (No white space)"
            flag = false;
        }

        if (password1 === '' || password2 === ''){
            error_lst.item(3).innerText = "- Missing password";
            flag = false;
        }
        if (password1 !== password2) {
            error_lst.item(4).innerText = "- Passwords mismatch";
            flag = false;
        }

        if (flag && formData){
            formData.append('username', username);
            formData.append('password1', password1);
            formData.append('password2', password2);
            formData.append('email', email);
            formData.append('avatar', avatar);
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);
            formData.append('phone_num', phone_num);
        }

        return flag;
    }

    function SignupSubmit() {
        const formData = new FormData();

        if (SignupCheck(formData)) {
            fetch("http://127.0.0.1:8000/account/signup/", {
                method: "POST",
                body: formData,
            })
                .then(response => {
                    if (response.status === 400){
                        return response.json()
                    }
                    else{
                        redirectTo();
                    }
                })
                .then(json => document.getElementsByClassName('signuperror').item(2).innerText="- User name Existed")
        }
    }

    function ChangeAvatar() {
        let f = document.getElementById('form-input')
        if (f){
            let avatar = document.getElementById('avatar')
            window.URL.revokeObjectURL(avatar.src)
            avatar.src = window.URL.createObjectURL(f.files[0]);
        }
    }


    return (
        <Container className="signupcontainer">
            <form className="signupForm" method="POST" id="signupForm">
                <h3 className="text-center">Sign Up</h3>
                <div className="mb-3">
                    <img src="http://ssl.gstatic.com/accounts/ui/avatar_2x.png" className="signupavatar d-block mx-auto" id="avatar" alt="Avatar"/>
                </div>
                <div className="mb-3 text-center edit-link">
                    <label htmlFor="form-input" className="custom-upload">Upload avatar</label>
                    <input type="file" id="form-input" accept="image/*" style={{display:"none"}} onChange={ChangeAvatar} name="avatar"/>
                </div>
                <div className="mb-3">
                    <label>First name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="First name (Opt)"
                        id = "firstname"
                        name= "first_name"
                    />
                </div>
                <div className="mb-3">
                    <label>Last name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Last name (Opt)"
                        id = "lastname"
                        name="last_name"
                    />
                </div>
                <div className="mb-3">
                    <p className="signuperror"></p>
                    <label>Phone number</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="xxx-xxx-xxxx (Opt)"
                        id = "phone_num"
                        name="phone_num"
                    />
                </div>
                <div className="mb-3">
                    <p className="signuperror"></p>
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email (Opt)"
                        id = "email"
                        name="email"
                    />
                </div>
                <div className="mb-3">
                    <p className="signuperror"></p>
                    <label>Username</label>
                    <input
                        type="username"
                        className="form-control"
                        placeholder="Enter username"
                        id = "username"
                        name="username"
                    />
                </div>
                <div className="mb-3">
                    <p className="signuperror"></p>
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        id = "password1"
                        name="password1"
                    />
                </div>
                <div className="mb-3">
                    <p className="signuperror"></p>
                    <label>Repeat Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        id = "password2"
                        name= "password2"
                    />
                </div>
                <div className="mb-3 text-center">
                    <Button variant="outline-success" onClick={SignupSubmit} className="cool-btn">
                        Sign Up
                    </Button>
                </div>
                <p className="forgot-password text-center" style={{marginTop:"10px"}}>
                    Already registered <a href="/login/">sign in?</a>
                </p>
            </form>
        </Container>
    );
}

export default Signup;