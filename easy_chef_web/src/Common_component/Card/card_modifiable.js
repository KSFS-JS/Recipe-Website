import {React, useState} from "react";
import {Button, Card} from "react-bootstrap";
import StarRatings from "react-star-ratings";
import Modal from "react-bootstrap/Modal";


function MyModal(props) {
    const DeleteRecipe = () => {
        const formData = new FormData();
        formData.append('id', props.item_id);
        let url;
        if (props.curr_focus === 0){url = `http://127.0.0.1:8000/recipe/delete/`}
        else if (props.curr_focus === 1){url = `http://127.0.0.1:8000/recipe/favorite/delete/`}
        else {url = `http://127.0.0.1:8000/recipe/interacted/delete/`}
        fetch(url, {
            method: "POST",
            headers: {
                'Authorization': `Token ${window.sessionStorage.getItem('auth_token')}`,
                'Origin': '',
            },
            body: formData

        }).then(() => props.onHide())
    }


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    WARNING !!!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.curr_focus === 0 && <h4>Recipe will be lost forever!</h4>}
                {props.curr_focus === 1 && <h4>Are you sure you want to delete recipe from favorite?</h4>}
                {props.curr_focus === 2 && <h4>Are you sure you want to delete recipe from Interacted?</h4>}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={DeleteRecipe} variant="outline-dark">Yes</Button>
                <Button onClick={props.onHide} variant="outline-dark">No</Button>
            </Modal.Footer>
        </Modal>
    );
}

const Card_modifiable = (props) => {
    const [show, setShow] = useState(false);


    return (
        <Card style={{ width: '18rem', background:"whitesmoke", borderStyle:"solid", borderColor:"whitesmoke", borderWidth:"2px"}}>
            <Card.Img variant="top"
                      src={props.Jicon}
                      className={'card_img'} style={{width:"287px", height:'287px'}}/>
            <Card.Body>
                <Card.Title>{props.Jname}</Card.Title>
                <Card.Text>
                    <span>{props.Jtags.toString()}</span>
                    <span>,...</span>
                </Card.Text>
            </Card.Body>
            <Card.Body>
                <StarRatings
                    rating={props.Jrating !== null ? props.Jrating : 0}
                    starDimension={`25px`}
                    starRatedColor={'orange'}/>
            </Card.Body>
            <Card.Body>
                <Button variant="outline-dark" href={`/recipe/${props.Jid}`}>To the recipe</Button>
                {props.CurrFocus === 0 && <Button variant="outline-dark" href={`/edit_recipe/${props.Jid}`}>Edit</Button>}
                <Button variant="outline-dark" onClick={() => setShow(true)}>Delete</Button>
            </Card.Body>
            <MyModal
                show={show}
                onHide={() => {setShow(false);
                    props.SetRefresh(props.Refresh ^ true)}}
                item_id = {props.Jid}
                curr_focus = {props.CurrFocus}
            />
        </Card>
    );
}

export default  Card_modifiable;