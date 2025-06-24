// import { Footer } from "~/Components/Footer";
// import { Header } from "~/Components/Header";
// import { Jobs } from "./components/Jobs";
// import { SearchWork } from "./components/SearchWork";
// import { createSignal, onMount } from "solid-js";
// import { createAsync } from "@solidjs/router";
// import { get_jobs } from "../api/jobs";

// const Work = () => {
//     const jobs = createAsync(async () => JSON.parse(await get_jobs()))

//     return (
//         <>
//             <Header />
//             <div class="w-[90%] mx-auto">
//                 <SearchWork />
//                 <section class="h-[800px] overflow-hidden flex mt-3 border-2 rounded-l-[16px]">
//                     <Show when={jobs()}>
//                         <Jobs jobs={jobs} />
//                     </Show>
//                     <div class="h-[800px] w-[800px] m-0 relative" id="map">
//                     </div>
//                 </section>
//                 <Footer />
//             </div>
//         </>
//     );
// };

// export default Work;
