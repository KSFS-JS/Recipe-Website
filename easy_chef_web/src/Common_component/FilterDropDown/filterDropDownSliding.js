import React from "react";
import Form from 'react-bootstrap/Form';
import {Button} from "react-bootstrap";


const FilterDropDownSliding = (props) => {
    function clearAll() {
        document.getElementById('min_cooktime').value = ''
        document.getElementById('max_cooktime').value = ''
    }

    function refresh() {
        props.SetRefresh(true ^ props.Refresh)
    }

    return (
        <Form style={{margin:"5px"}}>
            <Form.Label htmlFor="min_cooktime">Minimum (min)</Form.Label>
            <Form.Control
                type="text"
                id="min_cooktime"
            />
            <Form.Label htmlFor="min_cooktime">Maximum (max)</Form.Label>
            <Form.Control
                type="text"
                id="max_cooktime"
            />
            <Button variant="outline-dark" style={{marginTop:'5px'}} onClick={clearAll} className="filter_clear_button"> Clear </Button>
            <Button variant="outline-dark" style={{marginLeft:'33%', marginTop:'5px'}} onClick={refresh}> Save </Button>
        </Form>
    )
}

export default FilterDropDownSliding;