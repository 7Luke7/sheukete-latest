import { createAsync } from "@solidjs/router";
import { For } from "solid-js";
import { Header } from "~/Components/Header";
import { get_all_user_skills } from "~/routes/api/xelosani/skills/get_all_skills";
import emptyStar from "../../../../svg-images/svgexport-24.svg"
import fullStar from "../../../../svg-images/svgexport-19.svg"

const AllSkills = (props) => {
    const all_user_skills = createAsync(() => get_all_user_skills(props.location.pathname.split("/")[2]), { deferStream: true });
    return  <>
    <Header></Header>
    <div class="w-[90%] flex flex-col mx-auto mt-10">
      <h1 class="font-[bolder-font] text-lg">ლუკა ჩიკვაიძე - სპეციალობა</h1>
      <div class="grid grid-cols-5 gap-2">
      <For each={all_user_skills()}>
      {(skill) => (
        <div>
          <div class="bg-white shadow-md rounded-lg flex flex-col p-4 h-full">
            <h2 class="font-[medium-font] text-md text-gray-800 font-bold">
              {skill.displaySkills}
            </h2>
            <div class="flex justify-between items-center mt-4">
              <div class="flex items-center">
                <Index each={new Array(skill.reviews)}>
                  {() => (
                    <img
                      loading="lazy"
                      src={fullStar}
                      width={28}
                      height={28}
                      alt="Full star"
                    />
                  )}
                </Index>
                <Index each={new Array(5 - skill.reviews)}>
                  {() => (
                    <img
                      loading="lazy"
                      src={emptyStar}
                      width={28}
                      height={28}
                      alt="Empty star"
                    />
                  )}
                </Index>
              </div>
              <div class="flex items-center">
                <p class="text-dark-green font-bold font-[normal-font]">
                  {skill.completedJobs} სამუშაო
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </For>
      </div>
    </div>
  </>
}

export default AllSkills