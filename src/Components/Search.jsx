import searchIcon from "../svg-images/svgexport-5.svg"
import clear from "../svg-images/svgexport-12.svg"
import arrowDown from "../svg-images/svgexport-8.svg"
import { useNavigate } from "@solidjs/router"

export const Search = (props) => {

    const navigate = useNavigate()

    const searchHandler = (e) => {
        e.preventDefault()
        try {
            navigate(`/search?type=${props.chosenQuery()}&name=${props.value()}`)
        } catch (error) {
            alert(error)
        }
    }

    return <form id="formmodal" onSubmit={searchHandler} class="border font-[thin-font] rounded-[16px] px-3 py-1 border-[#6e6967] flex items-center">
        <button class="w-[25px] h-[20px]" type="submit">
            <img src={searchIcon}></img>
        </button>
        <input id="search_input" type="search" placeholder="მოძებნე" class="px-1 font-[thin-font] text-sm w-full outline-none"></input>
        <button type="button" id="search_query_options_button" onClick={() => props.setDisplay("searchops")} class="border-l flex items-center px-2 border-[#6e6967]">
            <span>{props.chosenQuery}</span>
            <img width={16} src={arrowDown}></img>
        </button>
    </form>
}