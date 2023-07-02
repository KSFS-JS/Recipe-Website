import React, {useContext, useEffect, useState} from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBTypography,
    MDBIcon
} from 'mdb-react-ui-kit';
import './Profile.css'
import Nav_login from "../../Common_component/Nav_login/nav_login";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import PageContext from "../../PageContext/PageContext";

export default function Profile() {
    const server_addr = 'http://127.0.0.1:8000'

    const [FN, setFN] = useState('')
    const [LN, setLN] = useState('')
    const [phone, setPhone] = useState('')
    const [avatar, setAvatar] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')

    const {refresh, setRefresh} = useContext(PageContext);

    const navigate = useNavigate();

    const redirectTo = () => {
        // 👇️ redirect to /contacts
        navigate('/');
    };

    useEffect(() => {
        fetch("http://127.0.0.1:8000/account/profile/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`
            }
        })
            .then(response => {
                if (response.status === 200) {return response.json()}
                else{setRefresh(refresh ^ true); redirectTo()}
            })
            .then(json => {
                setFN(json.first_name);
                setLN(json.last_name);
                setPhone(json.phone_num);
                setAvatar(server_addr+ json.avatar);
                setUsername(json.username);
                setEmail(json.email);
            })
    }, [])

    // Reference: https://mdbootstrap.com/docs/react/extended/profiles/
    return (
        <section className="vh-100 profile_background">
            <Nav_login SetRefresh={setRefresh} Refresh={refresh}/>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="6" className="mb-4 mb-lg-0">
                        <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                            <MDBRow className="g-0">
                                <MDBCol md="4" className="gradient-custom text-center text-white"
                                        style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                    <MDBCardImage src={avatar}
                                                  alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                                    <MDBTypography tag="h5">{FN} {LN}</MDBTypography>
                                    <MDBCardText>{username}</MDBCardText>
                                    <MDBIcon far icon="edit mb-5" />
                                </MDBCol>
                                <MDBCol md="8">
                                    <MDBCardBody className="p-4">
                                        <MDBTypography tag="h6">Information</MDBTypography>
                                        <hr className="mt-0 mb-4" />
                                        <MDBRow className="pt-1">
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Email</MDBTypography>
                                                <MDBCardText className="text-muted">{email}</MDBCardText>
                                            </MDBCol>
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Phone</MDBTypography>
                                                <MDBCardText className="text-muted">{phone}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>
                                        <hr className="mt-0 mb-4" />
                                        <MDBRow className="pt-1">
                                            <MDBCol size="3" className="mb-3">
                                                <Button variant="outline-secondary" href="/profile/edit/">Edit</Button>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCardBody>
                                </MDBCol>
                            </MDBRow>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}