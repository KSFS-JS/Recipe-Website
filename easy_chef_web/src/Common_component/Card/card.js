import React from "react";
import {Button, Card} from "react-bootstrap";
import StarRatings from 'react-star-ratings';
import './card.css'


const MyCard = (props) => {
    let card_url;
        if (window.sessionStorage.getItem('auth_token')){card_url = `/recipe/${props.Jid}`}
        else{card_url = '/login/'}


    return (
        <Card style={{ width: '18rem', background:"whitesmoke", borderStyle:"solid", borderColor:"black", borderWidth:"5px"}}>
            <Card.Img variant="top"
                      src={props.Jicon}
                      className={'card_img'}/>
            <Card.Body>
                <Card.Title>{props.Jname}</Card.Title>
                <Card.Text>
                    <span>
                        {props.Jtags.map((e, i) => e !== "" && i < 10 ? e+", ":null)
                        }
                    </span>
                    <span>...</span>
                </Card.Text>
            </Card.Body>
            <Card.Body>
                <StarRatings
                    rating={props.Jrating !== null ? props.Jrating : 0}
                    starDimension={`25px`}
                    starRatedColor={'orange'}/>
            </Card.Body>
            <Card.Body>
                <Button variant="dark" href={card_url}>To the recipe</Button>
            </Card.Body>
        </Card>
    );
}

export default  MyCard;