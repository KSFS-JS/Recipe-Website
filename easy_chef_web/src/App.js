import './App.css';
import Home from "./Pages/Home/home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signup from "./Pages/Signup/Signup";
import Login from "./Pages/Login/Login";
import MyRecipes from "./Pages/MyRecipes/MyRecipes";
import Profile from "./Pages/Profile/Profile";
import PageContext, {usePageContext} from "./PageContext/PageContext";
import ProfileEdit from "./Pages/Profile/ProfileEdit";
import CreateRecipe from "./Pages/Recipe/Create";
import EditRecipe from "./Pages/Recipe/Edit";
import Test from "./Pages/Test/Test";
import View from "./Pages/Recipe/View";
import Cart from "./Pages/Cart/Cart";


function App() {
    const home = (
        <PageContext.Provider value={usePageContext()}>
            <Home/>
        </PageContext.Provider>
    )
    const signup = (
        <PageContext.Provider value={usePageContext()}>
            <Signup/>
        </PageContext.Provider>
    )
    const login = (
        <PageContext.Provider value={usePageContext()}>
            <Login/>
        </PageContext.Provider>
    )
    const myrecipe = (
        <PageContext.Provider value={usePageContext()}>
            <MyRecipes/>
        </PageContext.Provider>
    )
    const profile = (
        <PageContext.Provider value={usePageContext()}>
            <Profile/>
        </PageContext.Provider>
    )
    const profile_edit = (
        <PageContext.Provider value={usePageContext()}>
            <ProfileEdit/>
        </PageContext.Provider>
    )
    const create_recipe = (
        <PageContext.Provider value={usePageContext()}>
            <CreateRecipe/>
        </PageContext.Provider>
    )
    const edit_recipe = (
        <PageContext.Provider value={usePageContext()}>
            <EditRecipe/>
        </PageContext.Provider>
    )
    const test = (
        <PageContext.Provider value={usePageContext()}>
            <Test/>
        </PageContext.Provider>
    )
    const recipe_view = (
        <PageContext.Provider value={usePageContext()}>
            <View/>
        </PageContext.Provider>
    )
    const cart = (
        <PageContext.Provider value={usePageContext()}>
            <Cart/>
        </PageContext.Provider>
    )
  return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={home}></Route>
                <Route path="signup/" element={signup}/>
                <Route path="login/" element={login}/>
                <Route path="myrecipes/" element={myrecipe}/>
                <Route path="profile/" element={profile}/>
                <Route path="profile/edit" element={profile_edit}/>
                <Route path="create_recipe/" element={create_recipe}/>
                <Route path="edit_recipe/:id" element={edit_recipe}/>
                <Route path="test/" element={test}></Route>
                <Route path="recipe/:id" element={recipe_view}/>
                <Route path="cart/" element={cart}/>
            </Routes>
        </BrowserRouter>
  );
}

export default App;
