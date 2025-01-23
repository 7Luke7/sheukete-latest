import { A } from "@solidjs/router"
import { For } from "solid-js"

const Message = (props) => {
    const dummy = [
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"},
        {pfp_path: `http://localhost:5555/static/images/xelosani/profile/533535c8-d98d-40b7-9935-eabab6a16bb7.webp`, firstname: "ლუკა", lastname: "ჩიკვაიძე", message: "სალამი როგორ ხარ, შეიძლება სერვისის შესახებ ვისაუბროთ?", lastMessageDate: "11h"}
    ]
    const searchConvo = (e) => {
        
    }
    return <div class="flex">
        <section class="border-r px-2 w-[650px]">
            <div class="flex items-center px-2">
                <A href="/" class="font-[normal-font] text-dark-green text-xl">
                    შეუკეთე
                </A>
                <input onInput={(e) => searchConvo(e)} type="text" />
            </div>
            <div class="flex gap-y-4 mt-4 flex-col">
            <For each={dummy}>
                {(p, i) => {
                    return <A href="#" class="flex px-2 py-2 rounded-lg focus:bg-gray-200 hover:bg-gray-100 justify-between">
                        <div class="flex">
                            <img class="w-[55px] h-[55px] rounded-full" src={p.pfp_path}></img>
                            <div class="flex p-2 gap-y-1 flex-col">
                                <h1 class="font-bold text-sm font-[thin-font]">{p.firstname + " " + p.lastname}</h1>
                                <p class="font-bold break-all text-gr text-sm font-[thin-font]">{p.message.slice(0, 40)}...</p>
                            </div>
                        </div>
                        <p class="font-bold text-gr text-sm font-[thin-font]">{p.lastMessageDate}</p>
                    </A>                    
                }}
            </For>
            </div>
        </section>
        <main class="w-full"></main>
    </div>
}

export default Message