import {React} from "react";
import {Col, Container, Row} from "react-bootstrap";
import Card_modifiable from "../Card/card_modifiable";


const server_addr = 'http://127.0.0.1:8000'

function CardModifiableList (props){
    return (
        <Container>
            <Row >
                {props.Jdata.map((r) => {
                    return (
                        <Col xs={4} style={{marginTop: "10px", display: "flex", justifyContent: "center"}}  key={r.id} >
                            <Card_modifiable
                                    Jname={r.name}
                                    Jtags={r.tags}
                                    Jrating={r.average_rating}
                                    Jicon={r.icon ? server_addr + r.icon : null}
                                    Jid = {r.id}
                                    Refresh = {props.Refresh}
                                    SetRefresh = {props.SetRefresh}
                                    CurrFocus = {props.CurrFocus}
                            />
                        </Col>
                    )
                })}

            </Row>
        </Container>
    );

}

export default  CardModifiableList;