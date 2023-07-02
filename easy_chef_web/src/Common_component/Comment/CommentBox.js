import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Container, FloatingLabel} from "react-bootstrap";
import {Rating} from "@mui/material";
import "../../Common_css/button.css"



const CommentBox = (props) => {
    const [rating, setRating] = useState(0)

    useEffect(() => {
        setRating(props.CurrRating)
    }, [props.CurrRating])

    const Submit = () => {
        let formData = new FormData();
        formData.append('comment', document.getElementById('comment_content').value)
        if (rating) {formData.append('rating', rating)}
        else{formData.append('rating', 5)}
        formData.append('id', props.ID)
        let img_lst = []
        let vid_lst = []
        for (let f of document.getElementById('comment_input').files){
            if (f.type.includes('image')){
                img_lst.push(f)
            }
            else{
                vid_lst.push(f)
            }
        }
        for (let i = 0; i < vid_lst.length; i++){formData.append('videos[]', vid_lst[i])}
        for (let i = 0; i < img_lst.length; i++){formData.append('images[]', img_lst[i])}


        fetch('http://127.0.0.1:8000/recipe/review_add/', {
            method:"POST",
            headers: {
                "Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`
            },
            body: formData,
        }).then(response => {
            if (response.status === 200){
                props.SetPage(1);
                props.SetRefresh(props.Refresh ^ true)
            }
        })
    }

    return (
        <Container style={{borderColor:"whitesmoke", borderStyle:"solid", borderWidth:"5px", padding:"5%", borderRadius:"10px"}}>
            <Form>
                <Form.Group className="mb-3" controlId="comment_name">
                    <h2 style={{textDecoration:"underline"}}>Comment</h2>
                </Form.Group>
                <FloatingLabel controlId="comment_content" label="Type your thoughts">
                    <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        style={{ height: '300px' }}
                    />
                </FloatingLabel>
                <div style={{marginTop:"5%"}}/>
                <div className="text-center">
                    <h3>Rating:</h3>
                    <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        size="large"
                    />
                    <div>
                        <Button className="cool-btn" variant="dark" onClick={() => document.getElementById('comment_input').click()}>Upload photos/videos</Button>
                        <input multiple type="file" id="comment_input" accept="image/*, video/*" style={{display:"none"}} name="photos"/>
                    </div>
                    <div style={{marginTop:"2%"}}/>
                    <Button className="cool-btn" variant='dark' onClick={Submit}>Post</Button>
                </div>
            </Form>
        </Container>
    )
}

export default CommentBox