import {createContext, useState} from "react";


export const usePageContext = () => {
    const [refresh, setRefresh] = useState(false)
    return {
        refresh,
        setRefresh,
    }
}

const PageContext = createContext({
    refresh: null,
    setRefresh: () => {},
})

export default PageContext;