import React, {useContext, useEffect, useState} from "react";
import {Button, Container, FloatingLabel, Form} from "react-bootstrap";
import PageContext from "../../PageContext/PageContext";
import Nav_login from "../../Common_component/Nav_login/nav_login";
import "./Create.css"
import Ingredient from "../../Common_component/Ingredient/Ingredient";
import Steps from "../../Common_component/Steps/Steps";
import {useNavigate, useParams} from "react-router-dom";
import {Lightbox} from "yet-another-react-lightbox";
import {Video} from "yet-another-react-lightbox/plugins";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import GeneralAutoComplete from "../../Common_component/AutoComplete/GeneralAutoComplete";


const server_addr = "http://127.0.0.1:8000"

const EditRecipe = () => {
    const {id} = useParams()
    const {refresh, setRefresh} = useContext(PageContext)
    const [diets, setDiets] = useState([])
    const [cuisines, setCuisines] = useState([])
    const [i_index, setIIndex] = useState(3)
    const [s_index, setSIndex] = useState(3)
    const [clicked, setClicked] = useState(0)
    const [urls, setUrls] = useState([])

    const [open, setOpen] = useState(false);

    const [controls, setControls] = React.useState(true);
    const [playsInline, setPlaysInline] = React.useState(true);
    const [autoPlay, setAutoPlay] = React.useState(false);
    const [loop, setLoop] = React.useState(false);
    const [muted, setMuted] = React.useState(false);
    const [disablePictureInPicture, setDisablePictureInPicture] = React.useState(
        false
    );
    const [disableRemotePlayback, setDisableRemotePlayback] = React.useState(
        false
    );
    const [controlsList, setControlsList] = useState([]);
    const [crossOrigin, setCrossOrigin] = useState("");
    const [preload, setPreload] = useState("");


    const [ingredient, setIngredient] = useState([])
    const [selectedIngredient, setSelectedIngredient] = useState({})
    const [diet, setDiet] = useState([])
    const [selectedDiet, setSelectedDiet] = useState([])
    const [cuisine, setCuisine] = useState([])
    const [selectedCuisine, setSelectedCuisine] = useState([])
    const [image_size, setImageSize] = useState(0)
    const [step_data, setStepData] = useState([])
    const [time_data, setTimeData] = useState([])
    const [trigger, setTrigger] = useState(0)
    const [quantity, setQuantity] = useState({})
    const [startDiet, setStartDiet] = useState([])
    const [startCuisine, setStartCuisine] = useState([])

    const data_fetch = ()=> {
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
    }

    useEffect(() => {
        if(step_data.length >= 1 && time_data.length >= 1 && s_index === step_data[0].length && s_index === time_data[0].length){
            let form_steps = document.getElementsByClassName('steps')
            let form_times = document.getElementsByClassName('step_times')
            for (let i=0;i < s_index; i++){
                form_steps.item(i).value = step_data[0][i]
                if (time_data[0][i] !== 'NaN'){form_times.item(i).value = time_data[0][i]}
            }
        }
    }, [step_data, s_index, time_data])

    const navigate = useNavigate();

    const redirectTo = () => {
        // 👇️ redirect to /contacts
        navigate('/');
    };
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
        // let videos = document.getElementById('videos').files

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
            formData.append('recipe_id', id)
            formData.append('name', name)
            // for (let i = 0; i < videos.length; i++){formData.append('videos[]', videos[i])}
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
            fetch('http://127.0.0.1:8000/recipe/edit/', {
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

    const SetImage = (image_urls) => {
        let image_lst = []
        if (image_urls.length > 0){
            for (let i = 0; i < image_urls.length; i++){
                image_lst.push({src: server_addr + image_urls[i]})
            }
            setUrls(image_lst);
            setImageSize(image_urls.length)
        }
    }

    const SetVideo = (video_urls) => {
        let video_lst = []
        if (video_urls.length > 0){
            for (let i = 0; i < video_urls.length; i++){
                video_lst.push({src: server_addr + video_urls[i], type: 'video'})
            }
            setUrls([...urls, video_lst]);
        }
    }


    const SetSteps = (json_steps) => {
        let step_keys = Object.keys(json_steps)
        let result1 = []
        let result2 = []
        setSIndex(step_keys.length)
        for (let key in json_steps){
            let time = json_steps[key].match(/\([\d+|\s]+\s*[m][i][n]\)/)
            if (time){time = time[0]}
            let rest = json_steps[key].replace(time, '')
            if (time){time = time.match(/\d+/)}
            result1.push(time ? time : "NaN")
            result2.push(rest)
        }

        setStepData([...step_data, result2])
        setTimeData([...time_data, result1])
    }

    useEffect(() => {
        let keys = Object.keys(quantity)
        let values = Object.values(quantity)
        for (let i of keys){
            document.getElementById(`ing_quant_${i}`).value = values[i]
        }
    }, [i_index])

    const InitData = (data) => {
        let temp_diet = []
        setStartDiet(temp_diet)
        data.diet.map((e) => temp_diet.push({name: e}))
        let temp_cuisine = []
        data.cuisine.map((e) => temp_cuisine.push({name: e}))
        setStartCuisine(temp_cuisine)

        setSelectedDiet(data.diet)
        setSelectedCuisine(data.cuisine)

        let temp_ingredient = {}
        let quantities = {}
        let index = 0
        for (let key of Object.keys(data.ingredients)){
            temp_ingredient[index] = key
            quantities[index] = data.ingredients[key]
            index ++
        }
        setIIndex(index)
        setSelectedIngredient(temp_ingredient)
        setQuantity(quantities)

        setTrigger(trigger ^ true)
    }

    useEffect(() => {
        data_fetch()
        fetch(`http://127.0.0.1:8000/recipe/recipe_view/?id=${id}`, {
            method: "GET",
            headers:{"Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`}
        }).then(response => {
            if(response.status === 200){
                return response.json();
            }
            else{
                setRefresh(refresh ^ true)
                redirectTo();
            }
        }).then(json => {
            SetImage(json.images);
            document.getElementById('recipe_name').value = json.name
            document.getElementById('recipe_description').value = json.description
            document.getElementById('recipe_prep_time').value = json.prep_time
            document.getElementById('recipe_cook_time').value = json.cook_time
            document.getElementById('recipe_serving').value = json.serving
            SetSteps(json.steps)

            InitData(json)
        })
    },[open])


    return (
            <>
                <Nav_login SetRefresh={setRefresh} Refresh={refresh}/>
                <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    slides={urls}
                    plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                    video={{
                        controls,
                        playsInline,
                        autoPlay,
                        loop,
                        muted,
                        disablePictureInPicture,
                        disableRemotePlayback,
                        controlsList: controlsList.join(" "),
                        crossOrigin,
                        preload
                    }}
                />
                <Container className="recipe_create_form_container">
                    <Form className="recipe_create_form">
                        <h1 className="text-center">Edit Recipe</h1>
                        <div className="mb-3">
                            <Button
                                variant="dark"
                                onClick={() => {
                                    setOpen(true)
                                }}>Show current {image_size} images
                            </Button>
                        </div>
                        <div className="mb-3">
                            <Button
                                variant="dark"
                                onClick={() => document.getElementById('images').click()}>Upload images
                            </Button>
                            <input onChange={ImageUpload} type="file" id="images" accept="image/*" style={{display:"none"}} name="images" multiple/>
                            <label id="image_label" style={{marginLeft:"2%"}}></label>
                        </div>
                        <div className="mb-3">
                            {/*<Button*/}
                            {/*        variant="dark"*/}
                            {/*        onClick={() => document.getElementById('videos').click()}>Upload videos*/}
                            {/*</Button>*/}
                            {/*<input onChange={VideoUpload} type="file" id="videos" accept="video/*" style={{display:"none"}} name="videos" multiple/>*/}
                            {/*<label id="video_label" style={{marginLeft:"2%"}}></label>*/}
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
                            <GeneralAutoComplete Options={diet} InitList={selectedDiet} SetInitList={setSelectedDiet} StartList={startDiet} Name="Diet" Trigger={trigger}/>
                        </div>
                        <div className="mb-3">
                            <label id="cuisine_error" style={{color:"orangered", display:'none'}}>- Cuisine is required!</label>
                            <GeneralAutoComplete Options={cuisine} InitList={selectedCuisine} SetInitList={setSelectedCuisine} StartList={startCuisine} Name="Cuisine" Trigger={trigger}/>
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
                            {[...Array(i_index)].map((e, i) => <Ingredient key={"ingredient_key_"+i}
                                                                           Index={i} SetIndex={setIIndex}
                                                                           Options={ingredient}
                                                                           InitList={selectedIngredient}
                                                                           SetInitList={setSelectedIngredient}
                                                                           Trigger={trigger}
                            />)}
                        </div>

                        <div className="mb-3">
                            <Button variant="dark" onClick={() => setIIndex(i_index + 1)}>Add Ingredient</Button>
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
                            {[...Array(s_index)].map((e, j) => <Steps key={"step_key_"+j} Index={j} SetIndex={setSIndex}/>)}
                        </div>
                        <div className="mb-3">
                            <Button variant="dark" onClick={() => setSIndex(s_index+1)}>Add Step</Button>
                        </div>
                        <div className="mb-3">
                            <label id="warning" style={{color:"orangered", fontSize:"20px"}}></label>
                        </div>
                        <div className="mb-3" style={{marginTop:"5%"}}>
                            <Button variant="dark" onClick={SubmitRecipe}>Submit</Button>
                            <Button variant="dark" onClick={Cancel} style={{right:'0px', float:"right"}}>Cancel</Button>
                        </div>
                    </Form>
                </Container>
            </>
    )
}

export default EditRecipe;