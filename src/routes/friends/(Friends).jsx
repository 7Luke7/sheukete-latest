import { createAsync } from "@solidjs/router";
import { Header } from "~/Components/Header";
import { get_all_friends } from "../api/friends/friends";

const Friends = () => {
    const friends = createAsync(() => get_all_friends())

    return <>
        <Header></Header>
        <section class="w-full flex">
            <div class="w-1/6 h-full left-0 top-[46px] sticky py-2 border-r">
                hello world
            </div>
            <div class="w-full">full width</div>
        </section>
    </>
}

export default Friends