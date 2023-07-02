import React, {useEffect, useState} from "react";
import Nav_raw from "../../Common_component/Nav_raw/nav_raw";
import CardList from "../../Common_component/Card_List/card_list";
import MyPagination from "../../Common_component/Pagination/pagination";
import FilterBar from "../../Common_component/FilterBar/filterBar";
import Nav_login from "../../Common_component/Nav_login/nav_login";
import PageContext, {usePageContext} from "../../PageContext/PageContext";

const Home = () =>{
    const [recipe, setRecipe] = useState([]);
    const [page, setPage] = useState(1);
    const [max_page, setMaxPage] = useState(1);
    const {refresh, setRefresh} = usePageContext(PageContext);


    function url_construction() {
        let url = `http://localhost:8000/recipe/search/?page=${page}&page_size=6`;

        // Search string
        let input = document.getElementById('Search_input')
        if (input) {url += `&input=${input.value}`}

        // Cuisine string
        let cuisines = document.getElementsByClassName('Cuisine-inputs')
        if (cuisines){
            let cuisine_string = '&cuisine='
            for (const ele of cuisines){
                if (ele.firstChild.checked){
                    cuisine_string += `${ele.lastChild.textContent},`
                }
            }
            url += cuisine_string
        }

        // Diet string
        let diet = document.getElementsByClassName('Diet-inputs')
        if (diet){
            let diet_string = '&diet='
            for (const ele of diet){
                if (ele.firstChild.checked){
                    diet_string += `${ele.lastChild.textContent},`
                }
            }
            url += diet_string
        }

        // Cook time string
        let min_time = document.getElementById('min_cooktime')
        let max_time = document.getElementById('max_cooktime')
        if (min_time){
            if (min_time.value) {
                url += `&cooktime_min=${min_time.value}`
            }
        }
        if (max_time){
            if (max_time.value){
                url += `&cooktime_max=${max_time.value}`
            }
        }

        // Sorting string
        let sort_inputs = document.getElementsByClassName('Sort-inputs')
        if (sort_inputs){
            if (sort_inputs.item(0) &&sort_inputs.item(0).firstChild.checked){
                url += `&sort_by_favorite=1`
            }
            if (sort_inputs.item(1) && sort_inputs.item(1).firstChild.checked){
                url+= `&sort_by_rating=1`
            }
        }
        return url;
    }

    useEffect(() => {
        fetch(url_construction())
            .then(response => {
                if (response.status === 200) {return response.json()}
                else {setRefresh(refresh ^ true)}
            })
            .then(json => {
                setRecipe(json.data);
                setMaxPage(json.max_page);
            })
    }, [page, refresh])

    return (
        <>
            {window.sessionStorage.getItem('auth_token') === null ? <Nav_raw  SetRefresh={setRefresh} Refresh={refresh}/> : <Nav_login  SetRefresh={setRefresh} Refresh={refresh}/>}
            <FilterBar SetRefresh={setRefresh} Refresh={refresh}/>
            <CardList Jdata={recipe}/>
            <MyPagination CurrPage={page} ChangePage={setPage} MaxPage={max_page}/>
        </>
    )
}

export default Home;