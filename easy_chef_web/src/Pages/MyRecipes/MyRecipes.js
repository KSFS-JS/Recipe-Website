import {React, useContext, useEffect, useState} from "react";
import Nav_login from "../../Common_component/Nav_login/nav_login";
import {Button, Col, Container, Row} from "react-bootstrap";
import './Myrecipes.css'
import CardModifiableList from "../../Common_component/Card_List/card_modifiable_list";
import MyPagination from "../../Common_component/Pagination/pagination";
import PageContext from "../../PageContext/PageContext";

const MyRecipes = () => {
    const [focus, setFocus] = useState(0)
    const [recipe, setRecipe] = useState([]);
    const [page, setPage] = useState(1);
    const [max_page, setMaxPage] = useState(1);
    const {refresh, setRefresh} = useContext(PageContext);

    useEffect(() => {
        let url
        if (focus === 0){url = `http://127.0.0.1:8000/recipe/user_list/?type=owned&page=${page}&page_size=6`;}
        else if(focus === 1){url = `http://127.0.0.1:8000/recipe/user_list/?type=favorite&page=${page}&page_size=6`}
        else{url = `http://127.0.0.1:8000/recipe/user_list/?type=interacted&page=${page}&page_size=6`}

        fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Token ${window.sessionStorage.getItem('auth_token')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': '',}
        }).then(response => {
            if (response.status === 200) {return response.json()}
            else{setRefresh(refresh ^ true)}
        })
            .then(json => {
                setRecipe(json.data);
                setMaxPage(json.max_page);
            })

    }, [focus, page, refresh])


    return (
        <>
            <Nav_login SetRefresh={setRefresh} Refresh={refresh}/>
            <Container>
                <Row style={{marginBottom:'10%'}}>
                    <Col xm={4}>
                        <Button
                            variant="dark"
                            className="myrecipe_top_btns"
                            onClick={() => setFocus(0)}
                        >My Recipe</Button>
                    </Col>
                    <Col xm={4}>
                        <Button
                            variant="dark"
                            className="myrecipe_top_btns"
                            onClick={() => setFocus(1)}
                        >Favorite Recipe</Button>
                    </Col>
                    <Col xm={4}>
                        <Button
                            variant="dark"
                            className="myrecipe_top_btns"
                            onClick={() => setFocus(2)}
                        >Interacted Recipe</Button>
                    </Col>
                </Row>
                <CardModifiableList Jdata={recipe} Refresh={refresh} SetRefresh={setRefresh} CurrFocus={focus}/>
                <MyPagination CurrPage={page} ChangePage={setPage} MaxPage={max_page}/>
            </Container>
        </>
    )
}



export default MyRecipes;