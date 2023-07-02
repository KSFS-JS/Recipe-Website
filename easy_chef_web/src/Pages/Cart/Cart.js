import React, {useContext, useEffect, useState} from "react";
import PageContext from "../../PageContext/PageContext";
import {useNavigate} from "react-router-dom";
import Nav_login from "../../Common_component/Nav_login/nav_login";
import {Button, Container, Table, Form} from "react-bootstrap";
import "./Cart.css"

const Cart = () => {
    const {refresh, setRefresh} = useContext(PageContext)
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [change, setChange] = useState(0)
    const [paired_ingredient, setPairedIngredient] = useState({})
    const [ingredient, setIngredient] = useState([])
    const [amount, setAmount] = useState([])
    const [to_delete, setToDelete] = useState(-1)
    const SetPairedIngredient = (json_data) => {
        let dicts = {}
        for (let r of Object.values(json_data)){
            for (let i=0; i < r.ingredients.length; i++){
                let temp_1 = r.ingredients[i];
                let temp_2 = r.ingredient_amount[i].replace("g",'')
                if (temp_1 in dicts){
                    dicts[temp_1] += parseFloat(temp_2)
                }
                else{
                    dicts[temp_1] = parseFloat(temp_2)
                }
            }
        }
        setPairedIngredient(dicts)
    }

    useEffect(() => {
        if (to_delete >= 0){
            let formData = new FormData();
            formData.append('id', data[to_delete].id)
            formData.append('amount', -1)
            fetch("http://127.0.0.1:8000/recipe/edit_cart/", {
                method: "POST",
                headers: {
                    "Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`
                },
                body: formData,
            })
                .then(response => {
                    if (response.status === 200){
                        setToDelete(-1)
                        setRefresh(refresh ^ true)
                    }
                })
        }
    }, [to_delete])

    useEffect(()=>{
        fetch("http://127.0.0.1:8000/recipe/cart/", {method:"GET", headers:{"Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`}})
            .then(response => {
                if (response.status === 200){
                    return response.json()
                }
            })
            .then(json => {
                setData(json.data)
                SetPairedIngredient(json.data)
                setChange(change ^ true)
            })
    }, [refresh])

    useEffect(() => {
        let selected_lst = []
        let checks = document.getElementsByClassName('selects')
        for (let i=0; i < checks.length; i++){
            if (checks.item(i).firstElementChild.checked){
                selected_lst.push(data[i])
            }
        }
        let dicts = {}

        for (let r of selected_lst){
            for (let i=0; i < r.ingredients.length; i++){
                let temp_1 = r.ingredients[i];
                let temp_2 = r.ingredient_amount[i].replace("g",'')
                if (temp_1 in dicts){
                    dicts[temp_1] += parseFloat(temp_2) * r.quant
                }
                else{
                    dicts[temp_1] = parseFloat(temp_2) * r.quant
                }
            }
        }

        setIngredient(Object.keys(dicts))
        setAmount(Object.values(dicts))

        let inputs = document.getElementsByClassName('quantities')
        for (let i = 0; i < inputs.length;i++){
            inputs[i].value = data[i].quant;
        }
    }, [change])


    const ChangeQuantSubmit = (quant, id) => {
        let formData = new FormData();
        formData.append('id', id)
        formData.append('amount', quant);
        fetch("http://127.0.0.1:8000/recipe/edit_cart/", {
            method: "POST",
            headers:{"Authorization": `Token ${window.sessionStorage.getItem('auth_token')}`},
            body: formData,
        }).then (response => {
            if(response.status === 200){
                setRefresh(refresh ^ true)
                setChange(change ^ true)
            }
        })
    }




    return (
        <>
            <Nav_login Refresh={refresh} SetRefresh={setRefresh}/>
            <Container>
                <Table striped bordered hover>
                    <thead>
                    <tr className="cart-row">
                        <th className='select-col'></th>
                        <th className="name-col text-center">Recipe name</th>
                        <th className="quantity-col">Quantity</th>
                        <th className="add-col"></th>
                        <th className="min-col"></th>
                        <th className="ingredient-col">Ingredients</th>
                        <th className="amount-col">Amount (g)</th>
                        <th className="delete-col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((e, i) => {
                        return (
                            <tr key={i} className="cart-row">
                                <th className='select-col text-center'><Form.Check className="selects" onChange={() => setChange(change ^ true)}/></th>
                                <th className="name-col text-center">{data[i].name}</th>
                                <th className="quantity-col"><input className="quantities" defaultValue={data[i].quant}/></th>
                                <th className="add-col"><Button variant='dark' className='cart-btn' onClick={() => {
                                    ChangeQuantSubmit(parseFloat(document.getElementsByClassName('quantities')[i].value) + 1, data[i].id)
                                }}>+</Button></th>
                                <th className="min-col"><Button variant='dark' className='cart-btn' onClick={() => {
                                    ChangeQuantSubmit(Math.max(parseFloat(document.getElementsByClassName('quantities')[i].value) - 1, 1), data[i].id)
                                }}>-</Button></th>
                                <th className="ingredient-col">{ingredient[i]}</th>
                                <th className="amount-col">{amount[i]}</th>
                                <th className="delete-col">
                                    <Button variant='dark' className='cart-btn' onClick={() => {
                                        setToDelete(i)
                                        setChange(change ^ true)
                                    }}>X</Button>
                                </th>
                            </tr>
                        )
                    })}
                    {Object.keys(paired_ingredient).map((e, i) => {
                            return (
                                <tr key={data.length + i} className="cart-row">
                                    <th className='select-col'></th>
                                    <th className="name-col text-center"></th>
                                    <th className="quantity-col"></th>
                                    <th className="add-col"></th>
                                    <th className="min-col"></th>
                                    <th className="ingredient-col">{i+data.length < ingredient.length ? ingredient[i+data.length] : null}</th>
                                    <th className="amount-col">{i+data.length < amount.length ? amount[i+data.length] : null}</th>
                                    <th className="delete-col"></th>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export  default  Cart;