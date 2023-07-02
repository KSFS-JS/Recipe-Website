import {createFilterOptions} from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {useEffect, useState} from "react";


const filter = createFilterOptions();

const GeneralAutoComplete = (props) => {
    const [selected, setSelected] = useState([])

    useEffect(() => {
        if (props.StartList){
            setSelected(props.StartList)
        }
    }, [props.Trigger])
    return (
        <Autocomplete
            value={selected}
            multiple
            onChange={(event, newValue, reason, details) => {
                let valueList = [];
                if (!details){
                    setSelected([])
                }
                else{
                    setSelected(newValue)
                }
                for (let e of newValue){
                    if (e.name){valueList.push(e.name)}
                }
                props.SetInitList(valueList)

            }}
            filterSelectedOptions
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option.name);
                if (inputValue !== '' && !isExisting) {
                    filtered.push({
                        name: inputValue,
                        label: `Add "${inputValue}" to ${props.Name} List`,
                        create: true
                    });
                }

                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id={props.Name ? props.Name : (Math.random() + 1).toString(36).substring(7)}
            options={props.Options}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.label) {
                    return option.name;
                }
                // Regular option
                return option.name;
            }}
            renderOption={(props, option) => <li {...props}>{option.create ? option.label : option.name}</li>}
            freeSolo
            renderInput={(params) => (
                <TextField {...params} label={props.Name ? props.Name : "Place Holder"} />
            )}
        />
    );
}

export default GeneralAutoComplete;