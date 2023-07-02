import React, {useContext, useEffect} from "react";
import {Button, Container} from "react-bootstrap";
import PageContext from "../../PageContext/PageContext";
import {useNavigate} from "react-router-dom";
import './ProfileEdit.css'

const server_addr = "http://127.0.0.1:8000"

const ProfileEdit = (props) => {
    const {refresh, setRefresh} = useContext(PageContext);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/account/profile/", {
            method: "GET",
            headers: {
                'Authorization': `Token ${window.sessionStorage.getItem('auth_token')}`
            }
        })
            .then(response => {
                if (response.status === 200){
                    return response.json()
                }
                else{
                    setRefresh(refresh ^ true);
                    redirectTo();
                }
            })
            .then(json => {
                document.getElementById('avatar').src = server_addr + json.avatar;
                document.getElementById('firstname').value = json.first_name;
                document.getElementById('lastname').value = json.last_name;
                document.getElementById('phone_num').value = json.phone_num
                document.getElementById('email').value = json.email;
            })
    }, [])

    const navigate = useNavigate();

    const redirectTo = () => {
        // 👇️ redirect to /contacts
        navigate('/profile/');
    };

    function ProfileEditCheck(formData){
        let email = document.getElementById('email').value
        let phone_num = document.getElementById('phone_num').value
        let avatar = document.getElementById('form-input').files[0]
        let first_name = document.getElementById('firstname').value
        let last_name = document.getElementById('lastname').value

        let flag = true;

        let error_lst = document.getElementsByClassName('profile_edit_error')
        for (let e of error_lst) {e.innerText = ''}

        let phone_regex = /^\d\d\d-\d\d\d-\d\d\d\d$/;
        if (phone_num !== '' && !phone_regex.test(phone_num)){
            error_lst.item(0).innerText= "- Invalid Phone number"
        }

        let email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if(email !== '' && !email_regex.test(email)){
            error_lst.item(1).innerText = "- Invalid Email";
        }

        if (flag && formData){
            formData.append('email', email);
            if(avatar) {formData.append('avatar', avatar)};
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);
            formData.append('phone_num', phone_num);
        }

        return flag;
    }

    function ProfileSubmit(){
        const formData = new FormData();
        if (ProfileEditCheck(formData)){
            fetch("http://127.0.0.1:8000/account/profile_edit", {
                method: "POST",
                headers: {
                    'Authorization': `Token ${window.sessionStorage.getItem('auth_token')}`
                },
                body: formData,
            }).then(response => {
                setRefresh(refresh ^ true);
                redirectTo();
            })
        }
    }

    function ProfileCancel() {
        setRefresh(refresh ^ true);
        redirectTo();
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
        <Container className="profile_edit_container">
            <form className="profile_edit_Form" method="POST" id="profile_edit_Form">
                <h3 className="text-center">Profile Edit</h3>
                <div className="mb-3">
                    <img src="http://ssl.gstatic.com/accounts/ui/avatar_2x.png" className="profile_edit_avatar d-block mx-auto" id="avatar" alt="Avatar"/>
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
                    <p className="profile_edit_error"></p>
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
                    <p className="profile_edit_error"></p>
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email (Opt)"
                        id = "email"
                        name="email"
                    />
                </div>
                <div className="mb-3 text-center">
                    <Button variant="outline-success" onClick={ProfileSubmit}>
                        Save
                    </Button>
                    <Button variant="outline-success" onClick={ProfileCancel} style={{marginLeft:"5%"}}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Container>
    );
}

export default  ProfileEdit;
