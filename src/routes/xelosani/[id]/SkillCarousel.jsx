import { For, Index } from "solid-js";
import emptyStar from "../../../svg-images/svgexport-24.svg";
import fullStar from "../../../svg-images/svgexport-19.svg";

export const SkillCarousel = (props) => {
  return (
    <For each={props.skills.filter((_, i) => i < 8)}>
      {(skill) => (
        <div class="swiper-slide">
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
  );
};
