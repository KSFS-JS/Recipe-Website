import React from 'react';
import {Button, Form} from "react-bootstrap";

const FilterDropDownItem = (props) => {
    function clearAll(){
        if (props.Type === 'Cuisine'){
            const eles = document.body.getElementsByClassName('Cuisine-inputs')
            for (const div of eles){
                div.firstChild.checked = false
            }
        }
        else if(props.Type === "Diet"){
            const eles = document.body.getElementsByClassName('Diet-inputs')
            for (const div of eles){
                div.firstChild.checked = false
            }
        }
        else if(props.Type === "Sort"){
            const eles = document.body.getElementsByClassName('Sort-inputs')
            for (const div of eles){
                div.firstChild.checked = false
            }
        }
    }

    function refresh() {
        props.SetRefresh(true ^ props.Refresh)
    }

    return (
        <Form style={{margin:"5px"}}>
            {props.Data.map((d) =>(
                <div key={`cb_${d}`} className="mb-3">
                    <Form.Check
                    type={"checkbox"}
                    label={d}
                    className={`${props.Type}-inputs`}/>
                </div>
            ))}
            <Button variant="outline-dark" onClick={clearAll} className="filter_clear_button"> Clear </Button>
            <Button variant="outline-dark" style={{marginLeft:'23px'}} onClick={refresh}> Save </Button>
        </Form>
    )
}

export default  FilterDropDownItem;