import Dropdown from 'react-bootstrap/Dropdown';
import {useEffect, useState} from "react";
import FilterDropDownItem from "./filterDropDownItem";
import FilterDropDownSliding from "./filterDropDownSliding";

function FilterDropDown(props) {
    const [cuisine, setCuisine] = useState([])
    const [diet, setDiet] = useState([])


    useEffect(()=>{
        if (props.Name === "Cuisine") {
            fetch("http://127.0.0.1:8000/recipe/cuisines/")
                .then(response => response.json())
                .then(json => setCuisine(json.data))
        }
        else if (props.Name === "Diet") {
            fetch("http://127.0.0.1:8000/recipe/diets/")
                .then(response => response.json())
                .then(json => setDiet(json.data))
        }
    }, [])

    return (
        <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic" style={{width:"200px"}}>
                {props.Name}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {props.Name === "Cuisine" && <FilterDropDownItem Data={cuisine} Type={"Cuisine"} SetRefresh={props.SetRefresh} Refresh={props.Refresh}/>}
                {props.Name === "Diet" && <FilterDropDownItem Data={diet} Type={"Diet"} SetRefresh={props.SetRefresh} Refresh={props.Refresh}/>}
                {props.Name === "Cooking time" && <FilterDropDownSliding SetRefresh={props.SetRefresh} Refresh={props.Refresh}/>}
                {props.Name === "Sort by" && <FilterDropDownItem Data={['rating', 'favorite']} Type={"Sort"} SetRefresh={props.SetRefresh} Refresh={props.Refresh}/>}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default FilterDropDown;