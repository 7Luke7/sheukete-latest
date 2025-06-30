import { A, createAsync } from "@solidjs/router";
import { createSignal, Show, For, onMount } from "solid-js";
import { Header } from "~/Components/Header";
import { get_service } from "~/routes/api/services/service";
import ChevronLeftBlack from "../../../svg-images/ChevronLeftBlack.svg";
import ChevronRightBlack from "../../../svg-images/ChevronRightBlack.svg";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Base, Meta, MetaProvider, Title } from "@solidjs/meta";
import { AdditionalAttributes } from "./Сomponents/AdditionalAttributes";

const Service = (props) => {
  const service = createAsync(() => get_service(props.params.id), {
    deferStream: true,
  });
  const [currentImageView, setCurrentImageView] = createSignal(null);
  const [showCarousel, setShowCarousel] = createSignal(false)
  let swiperGalleryEl, navigateRightGallery, navigateLeftGallery;
  
  onMount(() => {
    new Swiper(swiperGalleryEl, {
      modules: [Navigation, Pagination],
      spaceBetween: 10,
      slidesPerView: 5,
      navigation: {
        nextEl: navigateRightGallery,
        prevEl: navigateLeftGallery,
      },
      on: {
        init: () => setShowCarousel(true),
      }
    });
  });

  return (
    <MetaProvider>
    <Meta name="title" content={`Sheukete.ge: ${service()?.main_title} : ${service()?.categories[service()?.categories.length - 1]}`}></Meta>
      <Title>
      {`Sheukete.ge: ${service()?.main_title} : ${service()?.categories[service()?.categories.length - 1]}`}
    </Title>
    <Meta name="description" content={`Sheukete.ge: ${service()?.main_title} : ${service()?.categories[service()?.categories.length - 1]}`}></Meta>
    <Base target="_blank" href={`http://localhost:3000/service/${service()?.public_id}`} />
    <Header />
      <Show when={service()} fallback={<div>Loading...</div>}>
        <div class="container mx-auto mt-[50px] max-w-[90%]">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-[460px] flex flex-col">
              <div class="relative h-[460px] w-[460px] flex mx-auto">
                <img
                  src={
                    currentImageView()
                      ? currentImageView().src
                      : `http://localhost:5555/static/images/xelosani/${
                          service().prof_id
                        }/services/${
                          service().public_id
                        }/thumbnail/medium/thumbnail.webp`
                  }
                  alt={service().main_title}
                  class="h-[460px] w-[460px] rounded-lg border"
                  fetchpriority="high"
                  width={460}
                  height={460}
                />
              </div>

              <section class="relative mt-4 max-w-[460px]">
                <div
                  ref={(el) => (swiperGalleryEl = el)}
                  class="swiper h-[60px] flex max-w-[460px]"
                    classList={{ invisible: !showCarousel() }}

                >
                  <div
                    class="swiper-wrapper max-w-[460px]"
                    style={{ display: "flex", flexWrap: "wrap" }}
                  >
                    <img
                      class={`swiper-slide border ${!currentImageView() || currentImageView().index === 0 && 'border-dark-green-hover'} rounded-lg`}
                      src={`http://localhost:5555/static/images/xelosani/${
                        service().prof_id
                      }/services/${
                        service().public_id
                      }/thumbnail/small/thumbnail.webp`}
                      loading="lazy"
                      width={60}
                      height={60}
                      alt={service().main_title}
                      onClick={() =>
                        setCurrentImageView({
                          index: 0,
                          src: `http://localhost:5555/static/images/xelosani/${
                            service().prof_id
                          }/services/${
                            service().public_id
                          }/thumbnail/medium/thumbnail.webp`,
                        })
                      }
                    ></img>
                    <For each={new Array(service().gallery_count)}>
                      {(_, i) => (
                        <img
                          src={`http://localhost:5555/static/images/xelosani/${
                            service().prof_id
                          }/services/${
                            service().public_id
                          }/gallery/small/service-${i()}-gallery-image.webp`}
                          alt={service().main_title}
                          class={`swiper-slide border ${
                            currentImageView() &&
                            currentImageView().index === i() + 1 &&
                            "border-dark-green-hover"
                          }   rounded-lg`}
                          loading="lazy"
                          width={60}
                          height={60}
                          onClick={() =>
                            setCurrentImageView({
                              index: i() + 1,
                              src: `http://localhost:5555/static/images/xelosani/${
                                service().prof_id
                              }/services/${
                                service().public_id
                              }/gallery/medium/service-${i()}-gallery-image.webp`,
                            })
                          }
                        />
                      )}
                    </For>
                  </div>
                </div>

                <Show when={service().gallery_count > 6}>
                  <div class="absolute top-1/2 left-2 -translate-y-1/2 z-[10]">
                  <button
                    ref={(el) => (navigateLeftGallery = el)}
                    class="cursor-pointer bg-white rounded-full shadow hover:bg-gray-200 transition"
                  >
                    <img
                      loading="lazy"
                      src={ChevronLeftBlack}
                      width={24}
                      alt="Previous slide"
                    />
                  </button>
                </div>
                <div class="absolute top-1/2 right-2 -translate-y-1/2 z-[10]">
                  <button
                    ref={(el) => (navigateRightGallery = el)}
                    class="cursor-pointer bg-white rounded-full shadow hover:bg-gray-200 transition"
                  >
                    <img
                      loading="lazy"
                      src={ChevronRightBlack}
                      width={24}
                      alt="Next slide"
                    />
                  </button>
                </div>
                </Show>
              </section>

              {/* Professional Info */}
              <div class="mt-8 w-full">
                <h2 class="text-lg font-bold mb-2">
                  მომხმარებლის პროფილი
                </h2>
                <A
                  href={`/xelosani/${service().prof_id}`}
                  class="flex items-center bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded shadow"
                >
                  <img
                    src={`http://localhost:5555/static/images/xelosani/profile/browse/${
                      service().prof_id
                    }.webp`}
                    alt={`${service().firstname} ${service().lastname}`}
                    class="w-12 h-12 rounded-full mr-3"
                  />
                  <div class="flex flex-col">
                    <p class="text-sm font-semibold">
                      {service().firstname} {service().lastname}
                    </p>
                    <p class="text-xs">შეფასებები: {service().user_avg_rating}</p>
                    <p class="text-xs">შესრულებული სამუშაოები: {service().user_avg_rating}</p>
                  </div>
                </A>
              </div>
            </div>

            {/* Right: Basic Service Info & Immediate CTA */}
            <div class="w-full">
              {/* Title, Date, Short Description */}
              <div class="flex flex-col gap-2">
                <div class="flex items-start justify-between">
                  <h1 class="text-2xl md:text-3xl font-[normal-font] font-bold text-gray-800">
                    {service().main_title}
                  </h1>
                  <span class="text-gray-500 text-xs font-[normal-font] md:text-sm">
                    {new Date(service().created_at).toLocaleDateString()}
                  </span>
                </div>
                <p class="text-gray-600 text-sm font-[thin-font] font-semibold md:text-base">
                  {service().main_description}
                </p>
              </div>

              {/* Price & Category */}
              <div class="mt-4">
                <p class="text-xl md:text-2xl font-bold font-[normal-font] text-gray-900">
                  ფასი: ₾{service().main_price}
                </p>
                <p class="text-sm text-gray-700 mt-1 font-[normal-font] font-bold">
                  კატეგორია: {service().main_category}
                </p>
              </div>

              {/* Categories (tags) */}
              <div class="mt-4 flex flex-wrap gap-2">
                <For each={service().categories}>
                  {(cat) => (
                    <span class="bg-gray-200 font-[thin-font] text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {cat}
                    </span>
                  )}
                </For>
              </div>

              {/* Quick Stats: Completed / Average Rating */}
              <div class="mt-6 flex gap-4">
                <div class="flex items-center p-3 bg-green-50 rounded-lg shadow">
                  <span class="text-green-700 font-bold text-lg mr-2">
                    {service().service_completed_count || 0}
                  </span>
                  <span class="text-green-700 text-sm">შესრულებული</span>
                </div>
                <div class="flex items-center p-3 bg-yellow-50 rounded-lg shadow">
                  <span class="text-yellow-700 font-bold text-lg mr-2">
                    {service().ratings ? service().ratings.toFixed(1) : "0.0"}
                  </span>
                  <span class="text-yellow-700 text-sm">საშუალო შეფასება</span>
                </div>
              </div>

              {/* Primary Call to Action */}
              <div class="mt-6">
                <button class="bg-dark-green hover:bg-dark-green-hover text-white px-6 py-3 rounded-2xl shadow transition">
                  შეუკვეთე სერვისი
                </button>
              </div>
            </div>
          </div>

          {/* SECOND SECTION: TABBED CONTENT for Detailed Info */}
          <AdditionalAttributes
            child_services={service().child_services}
            schedule={service().schedule}
          ></AdditionalAttributes>
        </div>
      </Show>
    </MetaProvider>
  );
};

export default Service;
