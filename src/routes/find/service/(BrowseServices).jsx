import { createAsync } from "@solidjs/router";
import { Header } from "~/Components/Header";
import { ServicesRenderer } from "./Components/ServicesRenderer";
import { createSignal, Show } from "solid-js";
import { ServiceFilters } from "./Components/Filters";
import { SortServices } from "./Components/SortServices";
import { ServicePagination } from "./Components/ServicePagination";
import { Footer } from "~/Components/Footer";

const BrowseServices = (props) => {
  const services = createAsync(async () => (await fetch(`http://localhost:3000/api/services/services${props?.location?.search}`)).json(), {deferStream: true})
  const [serviceOnMapContent, setServiceOnMapContent] = createSignal();

  /* 
    Do everything on server meaning: constructing the whole services object
    so it fits well withing the hydration target code
  */

  return (
    <div>
      <Header></Header>
      <div class="w-full flex">
        <Show when={services()}>
          <ServiceFilters
            services={services}
            currentSearchURL={services().query}
          ></ServiceFilters>
          <div class="flex flex-col w-full mt-4">
            <div class="flex border-b items-center justify-between px-4">
              <p class="font-[thin-font] text-xs font-bold">
                ნაჩვენებია 1–დან {services().total_count <= 16 ? <>
                {services().total_count}-მდე შედეგი 
                <span class="text-dark-green-hover">"{services().query_name_values.category}"</span>
                -ის ძებნისას
                </>
                : <>
                  16-მდე                  
                  სულ {services().total_count}-ზე მეტი შედეგი მოიძებნა 
                  <span class="text-dark-green-hover">"{services().query_name_values.category}"</span>
                  -ის ძებნისას
                </>
                };
              </p>
              <SortServices 
                currentSearchParams={services().query_name_values}
                currentSearchURL={services().query}
              ></SortServices>
            </div>
            <ServicesRenderer
              serviceOnMapContent={serviceOnMapContent}
              setServiceOnMapContent={setServiceOnMapContent}
              services={services().services}
            ></ServicesRenderer>
              <ServicePagination
                currentSearchParams={services().query_name_values}
                currentSearchURL={services().query}                 
                lastPageService={services().services[16]}
              ></ServicePagination>
          </div>
        </Show>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default BrowseServices;
