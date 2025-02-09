import { A, createAsync } from "@solidjs/router";
import { createSignal, Show, For, onMount } from "solid-js";
import { Header } from "~/Components/Header";
import { get_service } from "~/routes/api/services/service";
import ChevronLeftBlack from "../../../svg-images/ChevronLeftBlack.svg";
import ChevronRightBlack from "../../../svg-images/ChevronRightBlack.svg";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

const TAB = {
  EXTRAS: 0,
  AVAILABILITY: 1,
  DESCRIPTION: 2,
  REVIEWS: 3,
};

const Service = (props) => {
  const service = createAsync(() => get_service(props.params.id), {
    deferStream: true,
  });
  const [currentImageView, setCurrentImageView] = createSignal(null);
  let swiperGalleryEl, navigateRightGallery, navigateLeftGallery;
  const [activeTab, setActiveTab] = createSignal(TAB.EXTRAS);

  // Once mounted, initialize Swiper (client-only).
  onMount(() => {
    if (service() && service()) {
      new Swiper(swiperGalleryEl, {
        modules: [Navigation, Pagination],
        spaceBetween: 10,
        slidesPerView: 4,
        navigation: {
          nextEl: navigateRightGallery,
          prevEl: navigateLeftGallery,
        },
      });
    }
  });

  return (
    <>
      <Header />
      <Show when={service()} fallback={<div>Loading...</div>}>
        <div class="container mx-auto mt-[50px] max-w-[90%]">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-1/4 flex flex-col items-center">
              <div class="relative w-full max-w-[351px] h-[351px] mx-auto">
                <img
                  src={
                    currentImageView()
                      ? currentImageView().src
                      : `http://localhost:5555/static/images/xelosani/${
                          service().prof_id
                        }/services/${
                          service().public_id
                        }/thumbnail/thumbnail.webp`
                  }
                  alt={service().main_title}
                  class="object-cover w-full h-full rounded-lg border"
                  loading="lazy"
                />
                {service().place_name_ka && (
                  <span class="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full opacity-90 shadow">
                    {service().place_name_ka.slice(0, 50)}...
                  </span>
                )}
              </div>

              {/* Thumbnail Gallery with Swiper */}
              <section class="relative mt-4 w-full max-w-[351px] mx-auto">
                <div
                  ref={(el) => (swiperGalleryEl = el)}
                  class="swiper h-[60px]"
                >
                  <div
                    class="swiper-wrapper"
                    style={{ display: "flex", flexWrap: "wrap" }}
                  >
                    <img
                      class={`swiper-slide border ${
                        currentImageView() &&
                        currentImageView().index === 0 &&
                        "border-dark-green-hover"
                      } object-cover w-[75px] h-[75px] rounded-lg`}
                      src={`http://localhost:5555/static/images/xelosani/${
                        service().prof_id
                      }/services/${
                        service().public_id
                      }/thumbnail/thumbnail.webp`}
                      loading="lazy"
                      alt={service().main_title}
                      onClick={() =>
                        setCurrentImageView({
                          index: 0,
                          src: `http://localhost:5555/static/images/xelosani/${
                            service().prof_id
                          }/services/${
                            service().public_id
                          }/thumbnail/thumbnail.webp`,
                        })
                      }
                    ></img>
                    <For each={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}>
                      {(_, i) => (
                        <img
                          src={`http://localhost:5555/static/images/xelosani/${
                            service().prof_id
                          }/services/${
                            service().public_id
                          }/gallery/service-${i()}-gallery-image.webp`}
                          alt={service().main_title}
                          class={`swiper-slide border ${
                            currentImageView() &&
                            currentImageView().index === i() + 1 &&
                            "border-dark-green-hover"
                          } object-cover w-[75px] h-[75px] rounded-lg`}
                          loading="lazy"
                          onClick={() =>
                            setCurrentImageView({
                              index: i() + 1,
                              src: `http://localhost:5555/static/images/xelosani/${
                                service().prof_id
                              }/services/${
                                service().public_id
                              }/gallery/service-${i()}-gallery-image.webp`,
                            })
                          }
                        />
                      )}
                    </For>
                  </div>
                </div>

                {/* Swiper Navigation Buttons */}
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
              </section>

              {/* Professional Info */}
              <div class="mt-8 w-full">
                <h2 class="text-lg font-bold mb-2">
                  პროფესიონალური ინფორმაცია
                </h2>
                <A
                  href={`/xelosani/${service().prof_id}`}
                  class="flex items-center bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded shadow"
                >
                  <img
                    src={`http://localhost:5555/static/images/xelosani/profile/${
                      service().prof_id
                    }.webp`}
                    alt={`${service().firstname} ${service().lastname}`}
                    class="w-12 h-12 rounded-full object-cover mr-3"
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
                <div class="flex items-center justify-between">
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
          <div class="mt-10">
            {/* Tabs */}
            <div class="flex gap-4 border-b pb-1 mb-4">
            <button
                class={`pb-2 ${
                  activeTab() === TAB.EXTRAS
                    ? "border-b-2 border-green-600 text-green-700"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab(TAB.EXTRAS)}
              >
                დამატებითი სერვისები
              </button>
              <button
                class={`pb-2 ${
                  activeTab() === TAB.DESCRIPTION
                    ? "border-b-2 border-green-600 text-green-700"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab(TAB.DESCRIPTION)}
              >
                აღწერა
              </button>
              <button
                class={`pb-2 ${
                  activeTab() === TAB.AVAILABILITY
                    ? "border-b-2 border-green-600 text-green-700"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab(TAB.AVAILABILITY)}
              >
                ხელმისაწვდომობა
              </button>
              <button
                class={`pb-2 ${
                  activeTab() === TAB.REVIEWS
                    ? "border-b-2 border-green-600 text-green-700"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab(TAB.REVIEWS)}
              >
                შეფასებები
              </button>
            </div>

            {/* Tab Content */}
            <Show when={activeTab() === TAB.DESCRIPTION}>
              <div>
                <h2 class="text-lg font-semibold mb-2">დეტალური აღწერა</h2>
                <p class="text-sm text-gray-700 leading-relaxed">
                  {service().main_description}
                </p>
              </div>
            </Show>

            <Show when={activeTab() === TAB.AVAILABILITY}>
              <div>
                <h2 class="text-lg font-semibold mb-2">ხელმისაწვდომობა</h2>
                <Show
                  when={
                    service().availability && service().availability.length > 0
                  }
                  fallback={
                    <p class="text-gray-600">No availability info provided.</p>
                  }
                >
                  <ul class="mt-2 space-y-1">
                    <For each={service().availability}>
                      {(slot) => (
                        <li class="text-sm text-gray-600">
                          {slot.day}: {slot.startTime} - {slot.endTime}
                        </li>
                      )}
                    </For>
                  </ul>
                </Show>
              </div>
            </Show>

            <Show when={activeTab() === TAB.EXTRAS}>
              <div>
                <h2 class="text-lg font-semibold mb-2">დამატებითი სერვისები</h2>
                <Show
                  when={
                    service().child_services &&
                    service().child_services.length > 0
                  }
                  fallback={
                    <p class="text-gray-600">No additional services.</p>
                  }
                >
                  <div class="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <For each={service().child_services}>
                      {(child) => (
                        <div class="p-4 bg-gray-50 rounded shadow hover:shadow-md transition">
                          <h3 class="text-md font-bold">{child.title}</h3>
                          <p class="mt-1 text-xs text-gray-600">
                            {child.description}
                          </p>
                          <p class="mt-1 text-gray-800 font-bold">
                            Price: ₾{child.price}
                          </p>
                          <button class="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-xs">
                            შეუკვეთე
                          </button>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </Show>

            <Show when={activeTab() === TAB.REVIEWS}>
              <div>
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-semibold mb-2">გამოხმაურებები</h2>
                  <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow text-sm">
                    Write a Review
                  </button>
                </div>
                <Show
                  when={service().reviews && service().reviews.length > 0}
                  fallback={<p class="mt-4 text-gray-600">No reviews yet.</p>}
                >
                  <div class="mt-4 space-y-4">
                    <For each={service().reviews}>
                      {(review) => (
                        <div class="p-4 bg-gray-50 rounded shadow">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center">
                              <span class="font-bold text-gray-800">
                                {review.reviewer}
                              </span>
                              <div class="flex ml-3">
                                {Array(parseInt(review.rating))
                                  .fill(0)
                                  .map((_, i) => (
                                    <svg
                                      key={i}
                                      class="w-4 h-4 text-yellow-500"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.175 0l-3.37 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.98 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                                    </svg>
                                  ))}
                              </div>
                            </div>
                            <span class="text-xs text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p class="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Service;
