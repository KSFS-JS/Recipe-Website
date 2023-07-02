import {React} from "react";
import {Col, Container, Row} from "react-bootstrap";
import "./filterBar.css";
import FilterDropDown from "../FilterDropDown/filterDropDown";

const FilterBar = (props) => {

    return (
        <>
            <Container style={{marginTop:'10px'}}>
                <Row>
                    <Col xs={3} style={{display: "flex", justifyContent: "center"}}>
                        <FilterDropDown Name={"Cuisine"} SetRefresh={props.SetRefresh} Refresh={props.Refresh}/>
                    </Col>
                    <Col xs={3} style={{display: "flex", justifyContent: "center"}}>
                        <FilterDropDown Name={"Diet"} SetRefresh={props.SetRefresh} Refresh={props.Refresh}/>
                    </Col>
                    <Col xs={3} style={{display: "flex", justifyContent: "center"}}>
                        <FilterDropDown Name={"Cooking time"} SetRefresh={props.SetRefresh} Refresh={props.Refresh}/>
                    </Col>
                    <Col xs={3} style={{display: "flex", justifyContent: "center"}}>
                        <FilterDropDown Name={"Sort by"} SetRefresh={props.SetRefresh} Refresh={props.Refresh}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}


export default FilterBar;