export const ConvoHeader = (props) => {
    const {prof_id, firstname, lastname, role} = props
    return <header class="px-8 h-[55px] flex items-center border-b">
        <div class="flex gap-x-2 items-center">
            <img width={40} height={40} class="w-[40px] h-[40px] rounded-full" src={`http://localhost:5555/static/${role}/profile/small/${prof_id}.webp`}></img>
            <div class="block">
                <h2 class="font-[normal-font]">{firstname} {lastname}</h2>
                <p class="text-gr text-xs font-[thin-font] font-bold">ბოლოს ონლაინ გუშინ 15:29</p>
            </div>
        </div>
    </header>
}