import { A } from "@solidjs/router";
import { Match, Switch, Suspense, Show, startTransition } from "solid-js";
import { Services } from "../xelosani(details)/Services";
import { SkillCarousel } from "../xelosani(details)/SkillCarousel";
import pen from "../../svg-images/pen.svg";
  
export const ProfileRight = (props) => {
  return (
    <div class="flex flex-1 flex-col border-r px-3">
      <Show when={props.user()}>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-x-1">
          <h2 class="font-[bolder-font] font-bold text-gray-900 text-lg">
            ჩემს შესახებ
          </h2>
        </div>
        
        <p class="text-xs font-[thin-font] font-bold">
          შემოუერთდა {props.user().creationDateDisplayable}
        </p>
      </div>
      <Switch>
        <Match when={props.user().about}>
          <p class="text-sm mt-2 font-[thin-font] break-all text-gr font-bold">
          {props.user().about}
        </p>
        </Match>
        <Match when={!props.user().about && props.user().status !== 200}>
          <p class="text-sm mt-2 font-[thin-font] break-all text-gr font-bold">აღწერა არ არის დამატებული.</p>
        </Match>
      </Switch>
      
      <div class="flex items-end justify-between">
        <div class="flex items-center gap-x-1 mt-5">
          <h2 class="font-[bolder-font] font-bold text-gray-900 text-lg">
            ხელობა/სპეციალობა
          </h2>
        </div>
        <A href="skills" class="underline text-blue-500 font-[thin-font] font-bold text-xs">ნახე ყველა</A>
      </div>

      <Switch>
        <Match when={props.user().skillset.skills}>
        <div class="mt-2">
          <section class="gap-2 grid grid-cols-4">
            <SkillCarousel skills={props.user().skillset.skills}></SkillCarousel>
          </section>
        </div>
        </Match>
        <Match when={!props.user().skillset.length && props.user().status !== 200}>
          <p class="text-sm mt-2 font-[thin-font] break-all text-gr font-bold">სპეციალობა არ არის დამატებული.</p>
        </Match>
      </Switch>
      
      <div class="flex items-end justify-between gap-x-1 mt-5">
        <h2 class="font-[bolder-font] font-bold text-gray-900 text-lg">
          სერვისები
        </h2>
        <A href="services" class="underline text-blue-500 font-[thin-font] font-bold text-xs">ნახე ყველა</A>
      </div>
      <div class="mt-2">
        <Suspense fallback={<div>Loading Services...</div>}>
          <Switch>
            <Match when={props.user().services.length > 0}>
              <Services
                services={props.user().services}
                profId={props.user().profId}
                setEditingServiceTarget={props.setEditingServiceTarget}
                setModal={props.setModal}
                status={props.user().status}
              ></Services>
            </Match>
            <Match when={props.user().status === 401}>
              <p class="text-gr text-xs font-[thin-font] font-bold">
                მომხმარებელს ინფორმაცია არ აქვს დამატებული.
              </p>
            </Match>
          </Switch>
        </Suspense>
      </div>
      </Show>
    </div>
  );
};
