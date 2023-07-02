import {React} from "react";
import {Button, Container} from "react-bootstrap";
import "./login.css"
import {useNavigate} from "react-router-dom";
import "../../Common_css/button.css"


const Login = () => {
    const navigate = useNavigate();

    const redirectTo = () => {
        // 👇️ redirect to /contacts
        navigate('/');
    };

    function LoginRequest(){

        const formData = new FormData();
        formData.append('username', document.getElementById('username').value)
        formData.append('password', document.getElementById('password').value)


        fetch("http://127.0.0.1:8000/account/login/", {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.status !== 200){
                    document.getElementById('login_error').innerText = "- Incorrect username/password"
                }
                else{
                    document.getElementById('login_error').innerText = ''
                    return response.json()}
            })
            .then(json => {
                window.sessionStorage.setItem('auth_token', json.token);
                redirectTo();
            })

    }


    return (
        <Container className="logincontainer">
            <form className="loginForm" method="POST" action="http://127.0.0.1:8000/account/login/" id="loginForm">
                <h3 className="text-center">Log in</h3>
                <div className="mb-3">
                    <p id='login_error' style={{color:'red'}}></p>
                    <label>Username</label>
                    <input
                        type="username"
                        className="form-control"
                        placeholder="Enter username"
                        id="username"
                        name="username"
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        id="password"
                        name="password"
                    />
                </div>
                <div className="mb-3 text-center">
                    <Button variant="dark" onClick={LoginRequest} className="cool-btn">
                        Log in
                    </Button>
                </div>
                <p className="forgot-password text-center" style={{marginTop:"10px"}}>
                    Don't have an account? <a href="/signup/">sign up?</a>
                </p>
            </form>
        </Container>
    )
}

export default Login;