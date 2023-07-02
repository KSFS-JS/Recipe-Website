import React, {useContext, useEffect, useState} from "react";
import {Button, Container, FloatingLabel, Form} from "react-bootstrap";
import PageContext from "../../PageContext/PageContext";
import Nav_login from "../../Common_component/Nav_login/nav_login";
import "./Create.css"
import Ingredient from "../../Common_component/Ingredient/Ingredient";
import Steps from "../../Common_component/Steps/Steps";
import {useNavigate} from "react-router-dom";
import GeneralAutoComplete from "../../Common_component/AutoComplete/GeneralAutoComplete";


const CreateRecipe = () => {
    const {refresh, setRefresh} = useContext(PageContext)
    const [i_index, setIIndex] = useState(3)
    const [s_index, setSIndex] = useState(3)
    const [clicked, setClicked] = useState(0)
    const [ingredient, setIngredient] = useState([])
    const [selectedIngredient, setSelectedIngredient] = useState({})
    const [diet, setDiet] = useState([])
    const [selectedDiet, setSelectedDiet] = useState([])
    const [cuisine, setCuisine] = useState([])
    const [selectedCuisine, setSelectedCuisine] = useState([])

    const navigate = useNavigate();

    const redirectTo = () => {
        // 👇️ redirect to /contacts
        navigate('/');
    };


    const AddIngredient = () => {
        setIIndex(i_index + 1)
    }

    const AddStep = () => {
        setSIndex(s_index + 1)
    }

    const Cancel = () => {
        if (clicked === 0){
            setClicked(clicked ^ 1)
            document.getElementById('warning').innerText = "Are you sure you want to leave? All progression will be lost!!!"
        }
        else{
            document.getElementById('warning').innerText = ''
            setClicked(clicked ^ 1)
            redirectTo()
        }
    }

    const ImageUpload = () => {
        document.getElementById('image_label').innerText = "-" + document.getElementById('images').files.length +" images selected"
    }

    const VideoUpload = () => {
        document.getElementById('video_label').innerText = "-" + document.getElementById('videos').files.length +" videos selected"
    }

    const SubmitPrep = (formData) => {
        let flag = true;

        let images = document.getElementById('images').files
        let videos = document.getElementById('videos').files

        let name = document.getElementById('recipe_name').value
        if (name === ''){document.getElementById('name_error').style.display='initial'; flag = false}

        else{document.getElementById('name_error').style.display='none';}


        if (selectedDiet.length < 1 || selectedDiet[0] === ''){document.getElementById('diet_error').style.display='initial'; flag=false}
        else{document.getElementById('diet_error').style.display='none'}

        for (let i = 0; i < selectedDiet; i++){
            selectedDiet[i] = selectedDiet[i].replace(' ','')
        }

        if (selectedCuisine.length < 1 || selectedCuisine[0] === ''){document.getElementById('cuisine_error').style.display='initial'; flag=false}
        else{document.getElementById('cuisine_error').style.display='none'}

        for (let i = 0; i < selectedCuisine; i++){
            selectedCuisine[i] = selectedCuisine[i].replace(' ','')
        }

        let description = document.getElementById('recipe_description').value

        let ingredient_dict = {};
        for (let key of Object.keys(selectedIngredient)){
            let name = selectedIngredient[key]
            if (name !== null){
                ingredient_dict[name] = document.getElementById(`ing_quant_${key}`).value
            }
        }

        let prep_time = document.getElementById('recipe_prep_time').value
        let cook_time = document.getElementById('recipe_cook_time').value

        let serving = document.getElementById('recipe_serving').value
        if (!serving || serving < 1){document.getElementById('serving_error').style.display='initial'; flag=false}
        else{document.getElementById('serving_error').style.display='none'}

        let step_list = document.getElementsByClassName('steps')
        let time_list = document.getElementsByClassName('step_times');
        let steps = {};
        for (let index = 0; index < step_list.length; index++){
            if(step_list.item(index).value !== ''){steps[index+1] = step_list.item(index).value + ` (${time_list.item(index).value} min)`}
        }

        if (Object.keys(steps).length === 0){document.getElementById('step_error').style.display='initial'; flag = false}
        else{document.getElementById('step_error').style.display='none'}

        if (flag === true){
            formData.append('name', name)
            for (let i = 0; i < videos.length; i++){formData.append('videos[]', videos[i])}
            for (let i = 0; i < images.length; i++){formData.append('images[]', images[i])}
            formData.append('diets', selectedDiet)
            formData.append('cuisines', selectedCuisine)
            formData.append('description', description)
            formData.append('ingredients', JSON.stringify(ingredient_dict))
            formData.append('prep_time', prep_time)
            formData.append('cook_time', cook_time)
            formData.append('serving', serving)
            formData.append('steps', JSON.stringify(steps))
        }

        return flag
    }

    const SubmitRecipe = () => {
        const formData = new FormData()
        if (SubmitPrep(formData)){
            fetch('http://127.0.0.1:8000/recipe/create/', {
                method: "POST",
                headers:{
                    'Authorization': `Token ${window.sessionStorage.getItem('auth_token')}`
                },
                body: formData,
            }).then(response => {
                if (response.status === 200){
                    setRefresh(refresh ^ true);
                    redirectTo();
                }
            })
        }
    }

    useEffect(()=>{
        fetch("http://127.0.0.1:8000/recipe/ingredient_autocomplete/", {method:"GET", headers:{'Authorization': `Token ${window.sessionStorage.getItem('auth_token')}`}})
            .then(response => {
                if (response.status === 200){return response.json()}
            })
            .then(json => {
                setIngredient(json.data)
            })
        fetch("http://127.0.0.1:8000/recipe/diet_autocomplete/", {method:"GET", headers:{'Authorization': `Token ${window.sessionStorage.getItem('auth_token')}`}})
            .then(response => {
                if (response.status === 200){return response.json()}
            })
            .then(json => {
                setDiet(json.data)
            })
        fetch("http://127.0.0.1:8000/recipe/cuisine_autocomplete/", {method:"GET", headers:{'Authorization': `Token ${window.sessionStorage.getItem('auth_token')}`}})
            .then(response => {
                if (response.status === 200){return response.json()}
            })
            .then(json => {
                setCuisine(json.data)
            })
    }, [])


    return (
            <>
                <Nav_login SetRefresh={setRefresh} Refresh={refresh}/>
                <Container className="recipe_create_form_container">
                    <Form className="recipe_create_form">
                        <h1 className="text-center">Create Recipe</h1>
                        <div className="mb-3">
                            <Button
                                variant="outline-dark"
                                onClick={() => document.getElementById('images').click()}>Upload images
                            </Button>
                            <input onChange={ImageUpload} type="file" id="images" accept="image/*" style={{display:"none"}} name="images" multiple/>
                            <label id="image_label" style={{marginLeft:"2%"}}></label>
                        </div>
                        <div className="mb-3">
                            <Button
                                    variant="outline-dark"
                                    onClick={() => document.getElementById('videos').click()}>Upload videos
                            </Button>
                            <input onChange={VideoUpload} type="file" id="videos" accept="video/*" style={{display:"none"}} name="videos" multiple/>
                            <label id="video_label" style={{marginLeft:"2%"}}></label>
                        </div>
                        <div className="mb-3">
                            <label id="name_error" style={{color:"orangered", display:'none'}}>- Recipe name is required!</label>
                            <FloatingLabel
                                controlId="recipe_name"
                                label="Recipe name"
                                className="mb-3"
                            >
                                <Form.Control type="text" placeholder="" />
                            </FloatingLabel>
                        </div>
                        <div className="mb-3">
                            <label id="diet_error" style={{color:"orangered", display:'none'}}>- Diet is required!</label>
                            <GeneralAutoComplete Options={diet} InitList={selectedDiet} SetInitList={setSelectedDiet} Name="Diet"/>
                        </div>
                        <div className="mb-3">
                            <label id="cuisine_error" style={{color:"orangered", display:'none'}}>- Cuisine is required!</label>
                            <GeneralAutoComplete Options={cuisine} InitList={selectedCuisine} SetInitList={setSelectedCuisine} Name="Cuisine"/>
                        </div>
                        <div className="mb-3">
                            <FloatingLabel controlId="recipe_description" label="Description">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Leave a comment here"
                                    style={{ height: '200px' }}
                                />
                            </FloatingLabel>
                        </div>
                        <div id="ingredient_div">
                            <label id="ingredient_error" style={{display:"none", color:"orangered"}}>- Require at least one ingredient!</label>
                            {[...Array(i_index)].map((e, i) =>
                                <Ingredient key={"ingredient_key_"+i}
                                            Index={i} SetIndex={setIIndex}
                                            Options={ingredient}
                                            InitList={selectedIngredient}
                                            SetInitList={setSelectedIngredient}/>)}
                        </div>

                        <div className="mb-3">
                            <Button variant="outline-dark" onClick={AddIngredient}>Add Ingredient</Button>
                        </div>
                        <div className="mb-3">
                            <FloatingLabel controlId="recipe_prep_time" label="Preparation time (min)">
                                <Form.Control type="text" placeholder="" />
                            </FloatingLabel>
                        </div>
                        <div className="mb-3">
                            <FloatingLabel controlId="recipe_cook_time" label="Cook time (min)">
                                <Form.Control type="text" placeholder="" />
                            </FloatingLabel>
                        </div>
                        <div className="mb-3">
                            <label id="serving_error" style={{color:"orangered", display:'none'}}>- Serving must be >= 1!</label>
                            <FloatingLabel controlId="recipe_serving" label="Serving">
                                <Form.Control type="text" placeholder="" />
                            </FloatingLabel>
                        </div>
                        <div id="step_div">
                            <label id="step_error" style={{display:"none", color:"orangered"}}>- Require at least one step!</label>
                            {[...Array(s_index)].map((e, i) => <Steps key={"step_key_"+i} Index={i} SetIndex={setSIndex}/>)}
                        </div>
                        <div className="mb-3">
                            <Button variant="outline-dark" onClick={AddStep}>Add Step</Button>
                        </div>
                        <div className="mb-3">
                            <label id="warning" style={{color:"orangered", fontSize:"20px"}}></label>
                        </div>
                        <div className="mb-3" style={{marginTop:"5%"}}>
                            <Button variant="outline-dark" onClick={SubmitRecipe}>Submit</Button>
                            <Button variant="outline-dark" onClick={Cancel} style={{right:'0px', float:"right"}}>Cancel</Button>
                        </div>
                    </Form>
                </Container>
            </>
    )
}

export default CreateRecipe;