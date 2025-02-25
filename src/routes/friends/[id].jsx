import { Header } from "~/Components/Header";
import { get_xelosani } from "../api/user";
import { createAsync, useNavigate } from "@solidjs/router";
import checkedGreen from "../../svg-images/checkedGreen.svg"
import {
  Show,
  createEffect,
  Switch,
  Match,
  onCleanup,
  createSignal,
} from "solid-js";
import { ProfileLeft } from "../xelosani(details)/ProfileLeft";
import { ProfileRight } from "../xelosani(details)/ProfileRight";
import { navigateToStep } from "~/routes/api/xelosani/setup/step";
import { ModifyWorkSchedule } from "./modals/ModifyWorkSchedule";
import { ModifyAge } from "./modals/ModifyAge";
import { Base, Meta, MetaProvider, Title } from "@solidjs/meta";
import { ModifySkill } from "./modals/ModifySkills";
import { FireworkConfetti } from "~/Components/FireworkConfetti";
import airPlane from "../../svg-images/airplane.svg";
import closeIcon from "../../svg-images/svgexport-12.svg";
import exclamationWhite from "../../svg-images/exclamationWhite.svg";
import {ModifyAbout} from "./modals/ModifyAbout";

const Xelosani = (props) => {
  const user = createAsync(() => get_xelosani(props.params.id), {deferStream: true});

  return (
    <MetaProvider>
      <Title>
      {`Sheukete.ge: ${user()?.firstname} ${user()?.lastname}`}
    </Title>
    <Meta name="description" content={`Sheukete.ge: ${user()?.firstname} ${user()?.lastname} ხელოსანი`}></Meta>
    <Base target="_blank" href={`http://localhost:3000/service/${user()?.profId}`} />
        <Header />
      <div class="relative">
        <div class="w-[90%] mx-auto relative my-8">
          <Show when={user()}>
            <div
              class="flex items-start">
              <ProfileLeft
                user={user}
                url_prof_id={props.params.id}
              />
              <ProfileRight user={user} />
            </div>
          </Show>
        </div>
      </div>
    </MetaProvider>
  );
};

export default Xelosani;