import React from "react";
import {Button, Col, FloatingLabel, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';

const Steps = (props) => {
    const DeleteSelf = () => {
        let parent = document.getElementById('step_div_'+props.Index).parentElement
        document.getElementById("step_div_"+props.Index).remove()
    }

    return (
        <div className="mb-3" id={"step_div_"+props.Index}>
            <Row style={{alignItems:"center"}}>
                <Col lg={6}>
                    <FloatingLabel label={"Step"} >
                        <Form.Control type="text" placeholder="" className="steps"/>
                    </FloatingLabel>
                </Col>
                <Col lg={4}>
                    <FloatingLabel label={"Time (min)"} >
                        <Form.Control type="text" placeholder="" className="step_times"/>
                    </FloatingLabel>
                </Col>
                <Col lg={2}>
                    <Button variant="outline-dark" onClick={DeleteSelf}>X</Button>
                </Col>
            </Row>
        </div>
    )
}

export default Steps;