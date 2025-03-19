export const ConvoHeader = (props) => {
    const {prof_id, firstname, lastname, role} = props
    return <header class="px-8 h-[85px] flex items-center border-b">
        <div class="flex gap-x-2">
            <img width={50} height={50} class="w-[50px] h-[50px] rounded-full" src={`http://localhost:5555/static/images/${role}/profile/small/${prof_id}.webp`}></img>
            <div class="block">
                <h2 class="font-[normal-font]">{firstname} {lastname}</h2>
                <p class="text-gr text-xs font-[thin-font] font-bold">ბოლოს ონლაინ გუშინ 15:29</p>
            </div>
        </div>
    </header>
}