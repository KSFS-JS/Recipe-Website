import React from "react";
import {Button, Col, FloatingLabel, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import IngredientAutoComplete from "../AutoComplete/IngredientAutoComplete";

const Ingredient = (props) => {
    const DeleteSelf = () => {
        let parent = document.getElementById('ingredient_div_'+props.Index).parentElement
        document.getElementById("ingredient_div_"+props.Index).remove()


        let temp = props.InitList
        temp[Curr_index] = null
        props.SetInitList(temp)
    }
    const Curr_index = props.Index;

    return (
        <div className="mb-3" id={"ingredient_div_"+props.Index}>
            <Row style={{alignItems:"center"}}>
                <Col lg={6}>
                    <IngredientAutoComplete
                        InitList={props.InitList}
                        SetInitList={props.SetInitList}
                        Options={props.Options}
                        Name={"Ingredient"}
                        Index={Curr_index}
                        Trigger={props.Trigger}
                    />
                </Col>
                <Col lg={4}>
                    <FloatingLabel label={"Quantity (g)"} >
                        <Form.Control type="text" placeholder="" className="quantities" id={`ing_quant_${Curr_index}`}/>
                    </FloatingLabel>
                </Col>
                <Col lg={2}>
                    <Button variant="outline-dark" onClick={DeleteSelf}>X</Button>
                </Col>
            </Row>
        </div>
    )
}

export default Ingredient;