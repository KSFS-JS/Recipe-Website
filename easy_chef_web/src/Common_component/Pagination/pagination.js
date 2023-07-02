import {React} from "react";
import {Col, Container, Row} from "react-bootstrap";
import { PaginationControl } from 'react-bootstrap-pagination-control';

const MyPagination = (props) => {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col style={{marginTop:'20px',display: "flex", justifyContent: "center"}}>
                    <PaginationControl
                        page={props.CurrPage}
                        between={4}
                        total={props.MaxPage* 6}
                        limit={6}
                        ellipsis={2}
                        changePage={(page) => {
                            props.ChangePage(page)
                        }}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default MyPagination;