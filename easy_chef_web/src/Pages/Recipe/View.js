import React, {useContext, useEffect, useState} from "react";
import Nav_login from "../../Common_component/Nav_login/nav_login";
import PageContext from "../../PageContext/PageContext";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import "yet-another-react-lightbox/styles.css";
import {Lightbox} from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import {Video} from "yet-another-react-lightbox/plugins";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import MyCarousel from "../../Common_component/Carousel/carousel";
import './View.css'
import ShoppingCart from "../../Common_component/SVG/ShoppingCart";
import CommentBox from "../../Common_component/Comment/CommentBox";
import {Rating} from "@mui/material";
import CommentSection from "../../Common_component/Comment/CommentSection";
import MyPagination from "../../Common_component/Pagination/pagination";
import '../../Common_css/button.css'


const server_addr = "http://127.0.0.1:8000"

const View = () => {
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




    const {refresh, setRefresh} = useContext(PageContext)
    const {id} = useParams()
    const navigate = useNavigate();
    const [raw_urls, setRawUrls] = useState([])
    const [urls, setUrls] = useState([])
    const [imageCount, setImageCount] = useState(0);
    const [rating, setRating] = useState(0)
    const [reviewCount, setReviewCount] = useState(0)
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')
    const [favorite, setFavorite] = useState(0)
    const [preptime, setPreptime] = useState('')
    const [cooktime, setCooktime] = useState('')
    const [ingredient, setIngredient] = useState([])
    const [quantity, setQuantity] = useState([])
    const [cartquant, setCartquant] = useState(1)
    const [step, setStep] = useState([])
    const [time, setTime] = useState([])
    const [page, setPage] = useState(1)
    const [max_page, setMaxPage] = useState(0)
    const [total_fav, setTotalFav] = useState(0)
    const [page_data, setPageData] = useState([])
    const [curr_user_rating, setCurrUserRating] = useState(0)

    const redirectTo = () => {
        // 👇️ redirect to /contacts
        navigate('/');
    };

    const redirectCart = () => {
        navigate('/cart/');
    }


    const SetImage = (image_urls) => {
        let image_lst = []
        if (image_urls.length > 0){
            for (let i = 0; i < image_urls.length; i++){
                image_lst.push({src: server_addr + image_urls[i]})
            }
            setUrls(image_lst);
            setImageCount(image_urls.length)
        }
    }

    const Favorite = () => {
        let fav_url;
        if (favorite === 0){fav_url = `http://127.0.0.1:8000/recipe/favorite/add/`;}
        else{fav_url = `http://127.0.0.1:8000/recipe/favorite/delete/`;}
        let formData = new FormData()
        formData.append('id', id)
        fetch(fav_url, {method:"POST", headers:{"Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`}, body:formData})
            .then(response => {
                if (response.status === 200){
                    setFavorite(favorite ^ true)
                    setRefresh(refresh ^ true)
                }
            })

    }

    const AddToCart = () => {
        let formData = new FormData();
        formData.append('id', id)
        formData.append('amount', cartquant)
        fetch("http://127.0.0.1:8000/recipe/add_to_cart/", {
            method:"Post",
            headers:{"Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`},
            body: formData,
        }).then(response => {
            if (response.status !== 200){
                setRefresh(refresh ^ true)
                redirectTo();
            }
            else{
                setRefresh(refresh ^ true)
                redirectCart();
            }
        })
    }

    const SetStep = (json_steps) => {
        let result1 = []
        let result2 = []
        for (let key in json_steps){
            let time = json_steps[key].match(/\([\d+|\s]+\s*[m][i][n]\)/)
            if (time){time = time[0]}
            let rest = json_steps[key].replace(time, '')
            if (time){time = time.match(/\d+/)}
            result1.push(time ? time : '')
            result2.push(rest)
        }
        setStep(result2)
        setTime(result1)
    }




    useEffect(() => {
        fetch(`http://127.0.0.1:8000/recipe/recipe_view/?id=${id}`, {method:"GET", headers:{"Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`}})
            .then(response => {
                if (response.status === 200){
                    return response.json()
                }
                else{
                    setRefresh(refresh ^ true);
                    redirectTo();
                }
            })
            .then(json => {
                document.getElementById('recipe_name').innerText = json.name
                setRawUrls(json.images)
                SetImage(json.images)
                setRating(json.rating)
                setDescription(json.description)
                setTags((json.diet.concat(json.cuisine).join(', ')).slice(0, -1))
                setFavorite(json.curr_user_favorite && 1)
                setPreptime(json.prep_time)
                setCooktime(json.cook_time)
                setIngredient(Object.keys(json.ingredients))
                setQuantity(Object.values(json.ingredients))
                SetStep(json.steps)
                setTotalFav(json.favorite)
            })
        fetch(`http://127.0.0.1:8000/recipe/comment_view/?page=${page}&page_size=6&id=${id}`, {
            method: "GET",
            headers:{"Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`}
        }).then(response => {
            if (response.status === 200){
                return response.json()
            }
        }).then(json => {
            setCurrUserRating(json.curr_user_rating)
            setReviewCount(json.total_review);
            setMaxPage(json.total_page)
            setPageData(json.data)
        })
    }, [refresh])


    return (
        <>
            <Nav_login SetRefresh={setRefresh} Refresh={refresh}/>
            <Container style={{marginBottom:"10%"}}>
                <Row className="justify-content-center">
                    <Col md={12} className="text-center" style={{marginBottom:"10px"}}>
                        <h1 id="recipe_name"></h1>
                    </Col>
                    <Col md={{span:2, offset:2}} style={{borderColor:"black", borderRightWidth:"1px", borderRightStyle:"solid"}} className="text-center">
                        <Rating name="half-rating-read" value={rating} precision={0.1} size="large" /> {`(${rating ? rating.toFixed(1) : 0.0})`}
                    </Col>
                    <Col md={2} className="text-center" style={{borderColor:"black", borderRightWidth:"1px", borderRightStyle:"solid"}}>
                        <Button variant="dark" className="cool-btn" onClick={() => document.getElementById('comment_content').scrollIntoView()}>
                            {`Review (${reviewCount})`}
                        </Button>
                    </Col>
                    <Col md={2} className="text-center" style={{borderColor:"black", borderRightWidth:"1px", borderRightStyle:"solid"}}>
                        <Button variant="dark" onClick={() => {setOpen(true); console.log(urls)}} className="cool-btn">{`Photo (${imageCount})`}</Button>
                    </Col>
                    <Col md={2} className="text-center">
                        <Button variant="dark" className="cool-btn" onClick={Favorite} id="favorite_btn">Favorite ({total_fav})</Button>
                    </Col>
                    <Col md={2}/>
                    <Col md={12}  className="text-center" style={{marginTop:"2%"}}>
                        <MyCarousel ImageURL={raw_urls.slice(0, 5)}></MyCarousel>
                    </Col>
                    <Col md={12} className="text-center">
                        <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            slides={urls}
                            plugins={[Fullscreen, Slideshow, Thumbnails, Video, Zoom]}
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
                    </Col>
                    <Col md={{span:8, offset:2}} className="text-center" style={{marginTop:"2%", fontSize:"20px"}}>
                        <p>{description}</p>
                    </Col>
                    <Col md={2}/>
                    <Col md={{span:8, offset:2}} className="text-center" style={{marginTop:"2%"}}>
                        <p>Tags: {tags}</p>
                    </Col>
                    <Col md={2}/>
                    <Col md={12} style={{marginTop:"2%"}}/>
                    <Col md={{span:3, offset: 3}} className="text-center" style={{borderBottomWidth:'1px', borderBottomStyle:'solid'}}>
                        <span>Preparation time: {preptime} min(s)</span>
                    </Col>
                    <Col md={{span:3}} className="text-center" style={{borderBottomWidth:'1px', borderBottomStyle:'solid'}}>
                        <span>Cook time: {cooktime} min(s)</span>
                    </Col>
                    <Col md={3}/>
                    <Col md={{span:6, offset:3}} className="text-center" style={{marginTop:"2%", paddingTop:"1%"}}>
                        <Button variant="dark cool-btn"
                                style={{width:"10%", marginRight:"2%"}}
                                onClick={() => {
                                    if (cartquant - 1 > 0) {
                                        setCartquant(cartquant - 1)
                                        document.getElementById('cart_quantity').value = cartquant - 1
                                    }
                                }}
                        >-</Button>
                        <input type="text" defaultValue={1} id="cart_quantity" className="w-25" name="quant-input"
                               onChange={(e) => e.target.value >= 1 ? setCartquant(e.target.value):e.target.value=1}/>
                        <Button variant="dark cool-btn" style={{width:"10%", marginLeft:"2%"}} onClick={() => {
                            setCartquant(cartquant + 1);
                            document.getElementById('cart_quantity').value = cartquant + 1
                        }}>+</Button>
                        <Button variant="dark" style={{marginLeft:"15%"}} onClick={AddToCart}>
                            <ShoppingCart/>
                        </Button>
                    </Col>
                    <Col md={3}/>
                    <Col md={{span:6, offset:3}} className="text-center" style={{marginTop:"2%"}}>
                        <Table striped bordered hover size="sm">
                            <thead>
                            <tr>
                                <th>Ingredient</th>
                                <th>Quantity (g)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ingredient.map((e, i) => {
                                return (
                                    <tr key={`ingredient_table_row_${i}`}>
                                        <td>{ingredient[i]}</td>
                                        <td>{quantity[i]}</td>
                                    </tr>
                                    )
                            })}
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={3}/>
                    <Col md={{span:6, offset:3}} className="text-center" style={{marginTop:"2%"}}>
                        <Table striped bordered hover size="sm">
                            <thead>
                            <tr>
                                <th>Step #</th>
                                <th>Content</th>
                                <th>Time (min)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {step.map((e, i) => {
                                return (
                                    <tr key={`step_table_row_${i}`}>
                                        <td>{i+1}</td>
                                        <td>{step[i]}</td>
                                        <td>{time[i]}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={3}/>
                    <Col md={{span:8, offset:2}} style={{marginTop:"2%"}}>
                        <CommentBox
                            ID={id}
                            Page={page}
                            SetPage={setPage}
                            Refresh={refresh}
                            SetRefresh={setRefresh}
                            CurrRating={curr_user_rating}
                        />
                    </Col>
                    <Col md={2}/>
                    <Col md={{span:8, offset:2}} style={{marginTop:"2%"}}>
                        <CommentSection CommentData={page_data}/>
                        <MyPagination CurrPage={page} ChangePage={setPage} MaxPage={max_page}/>
                    </Col>
                    <Col md={2}/>
                </Row>
            </Container>
        </>
    )
}

export default View;