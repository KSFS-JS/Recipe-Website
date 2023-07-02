import {React} from "react";
import {Col, Container, Row} from "react-bootstrap";
import MyCard from "../Card/card";


const server_addr = 'http://127.0.0.1:8000'
function CardList({Jdata}) {
    return (
        <Container>
            <Row >
                {Jdata.map((r) => {
                    return (
                        <Col xs={4} style={{marginTop: "10px", display: "flex", justifyContent: "center"}}  key={r.id} >
                            <MyCard Jname={r.name} Jtags={r.tags}
                                    Jrating={r.average_rating}
                                    Jicon={r.icon ? server_addr + r.icon : null}
                                    Jid = {r.id}/>
                        </Col>
                    )
                })}

            </Row>
        </Container>
    );
}

export default CardList;