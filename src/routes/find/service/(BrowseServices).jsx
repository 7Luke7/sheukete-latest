import { createAsync } from "@solidjs/router";
import { Header } from "~/Components/Header";
import { ServicesRenderer } from "./Components/ServicesRenderer";
import { Show } from "solid-js";
import { ServiceFilters } from "./Components/Filters";
import { SortServices } from "./Components/SortServices";
import { ServicePagination } from "./Components/ServicePagination";
import { Footer } from "~/Components/Footer";

const BrowseServices = (props) => {
  const services = createAsync(async () => (await fetch(`http://localhost:3000/api/services/services${props?.location?.search}`)).json(), {deferStream: true})

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
            parent={services().parent}
            main={services().main}
            currentSearchURL={services().query}
            category={services().category}
            displayCategories={services().displayCategories}
            priceFrom={services().priceFrom}
            priceTo={services().priceTo}
            city={services().city}
            sort={services().sort}
            region={services().region}
            min_price_filter={services().min_price_filter}
            max_price_filter={services().max_price_filter}
          ></ServiceFilters>
          <div class="flex flex-col w-full">
            <div class="flex sticky top-[46px] py-2 bg-white z-[10] border-b items-center justify-between px-4">
              <p class="font-[thin-font] text-xs font-bold">
                ნაჩვენებია 1–დან {services().total_count <= 16 ? <>
                {services().total_count}-მდე შედეგი 
                <span class="text-dark-green-hover">"{services().category}"</span>
                -ის ძებნისას
                </>
                : <>
                  16-მდე                  
                  სულ {services().total_count}-ზე მეტი შედეგი მოიძებნა 
                  <span class="text-dark-green-hover">"{services().category}"</span>
                  -ის ძებნისას
                </>
                };
              </p>
              <SortServices 
                currentSearchParams={services().sort}
                currentSearchURL={services().query}
                sort={services().sort}
              ></SortServices>
            </div>
            <ServicesRenderer
              services={services().services}
            ></ServicesRenderer>
              <ServicePagination
                links={services().links}
                pageCount={services().pageCount}    
                right_btn_link={services().last_btn_link}        
                left_btn_link={services().first_btn_link}        
              ></ServicePagination>
          </div>
        </Show>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default BrowseServices;
