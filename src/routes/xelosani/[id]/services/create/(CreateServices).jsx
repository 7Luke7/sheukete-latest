import {
  createSignal,
  Switch,
  Match,
  batch,
  onCleanup,
  Show,
  onMount,
  createEffect,
} from "solid-js";
import { createAsync, useNavigate } from "@solidjs/router";
import { NotAuthorized } from "~/Components/NotAuthorized";
import closeIcon from "../../../../../svg-images/svgexport-12.svg";
import uploadIcon from "../../../../../svg-images/uploadIcon.svg";
import jobs from "../../../../../Components/header-comps/jobs_list.json";
import dropdownSVG from "../../../../../svg-images/svgexport-8.svg";
import { ServicesModal } from "./ServicesModal";
import { ServiceSchedule } from "./ServiceSchedule";
import { makeAbortable } from "@solid-primitives/resource";
import spinner from "../../../../../svg-images/spinner.svg";
import { Toast } from "~/Components/ToastComponent";
import { get_user_service } from "~/routes/api/xelosani/service/service";
import eyeFillSVG from "../../../../../svg-images/eye-fill.svg";
import ImagePreview from "./ImagePreview";
import { MapRenderer } from "../../../../map/MapRenderer";
import { Link, MetaProvider } from "@solidjs/meta";
/*

  ასევე აჩვენე შეუძლია თუ არა მომხმარებელს ახლა სერვისის შესრულება schedule გაქვს სერვისის ამიტომ მარტივი იქნება

  ---

  I Believe after user marks location we should have a pop up
  Which will show the information: city, distinct, street, etc.
  But while showing it will allow users to modify the data
  so we can get more information out of it.

*/

const CreateServices = (props) => {
  const response = createAsync(
    () => get_user_service(props?.location?.search, props?.location?.pathname.split("/")[2]),
    { deferStream: true }
  );
  const [image, setImage] = createSignal([]);
  const [markedLocation, setMarkedLocation] = createSignal();
  const [error, setError] = createSignal(null);
  const [isExiting, setIsExiting] = createSignal(false);
  const [input, setInput] = createSignal("");
  const [title, setTitle] = createSignal("");
  const [totalSize, setTotalSize] = createSignal(0);
  const [activeParentIndex, setActiveParentIndex] = createSignal();
  const [activeChildIndex, setActiveChildIndex] = createSignal(null);
  const [childChecked, setChildChecked] = createSignal([]);
  const [parentChecked, setParentChecked] = createSignal();
  const [mainChecked, setMainChecked] = createSignal();
  const [showCategoryModal, setShowCategoryModal] = createSignal(false);
  const [currentStep, setCurrentStep] = createSignal("thumbnail");
  const [thumbNail, setThumbnail] = createSignal();
  const [toast, setToast] = createSignal(null);
  const [service, setService] = createSignal([]);
  const [showSchedule, setShowSchedule] = createSignal();
  const [schedule, setSchedule] = createSignal();
  const [signal, abort, filterErrors] = makeAbortable({
    timeout: 0,
    noAutoAbort: true,
  });
  const [isSendingRequest, setIsSendingRequest] = createSignal(false);
  const [isEditing, setIsEditing] = createSignal(false);
  const [imageToPreviewUrl, setImageToPreviewUrl] = createSignal();

  const navigate = useNavigate();

  const MAX_SINGLE_FILE_SIZE = 2 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 15 * 1024 * 1024;

  onMount(() => {
    if (response() && response()?.status === 200 && response().isEditing) {
      document.getElementById("price").value = Number(response().main_price);
      batch(() => {
        setIsEditing(true);
        setMarkedLocation([response().longitude, response().latitude]);
        setToast({ type: true, message: "თქვენ ანახლებთ სერვისს." });
        setTitle(response().main_title);
        setInput(response().main_description);
        setMainChecked(response().main_category);
        setParentChecked(
          response().categories[response().categories.length - 1]
        );
        setService(response().child_services);
        setChildChecked([
          ...response().categories.filter((a) => {
            return (
              response().categories[response().categories.length - 1] !== a &&
              response().main_category !== a
            );
          }),
        ]);
        setActiveParentIndex(
          jobs
            .flatMap((obj) => Object.keys(obj))
            .findIndex((a) => a === response().main_category)
        );
        setActiveChildIndex(
          jobs[0][response().main_category].findIndex(
            (a) =>
              a["კატეგორია"] ===
              response().categories[response().categories.length - 1]
          )
        );
        console.log(response().gallery, response().thumbnail);
        setImage(response().gallery || []);
        setThumbnail(response().thumbnail);
        setCurrentStep("thumbnail");
      });
    }
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return setToast({
          type: false,
          message: "გთხოვთ აირჩიოთ ფაილი ფოტო ფორმატით.",
        });
      }

      const file_existence =
        image() && image().some((a) => a.name === file.name);
      if (file_existence && currentStep() !== "thumbnail") {
        return setToast({
          type: false,
          message: `${file.name} უკვე დამატებული გაქვთ.`,
        });
      }

      if (file.size > MAX_SINGLE_FILE_SIZE) {
        return setToast({
          type: false,
          message: `${file.name}, ფაილის ზომა აჭარბებს 2მბ ლიმიტს.`,
        });
      } else {
        setTotalSize((a) => (a += file.size));
      }
      file["is_user_added"] = true;
    }

    if (totalSize() > MAX_TOTAL_SIZE) {
      return setToast({
        type: false,
        message: "ფაილების ჯამური ზომა აჭარბებს 15მბ ერთობლივ ლიმიტს.",
      });
    }

    if (currentStep() === "thumbnail") {
      if (!image() || !image().length) {
        setThumbnail(files[0]);
        return setCurrentStep("gallery");
      } else {
        setThumbnail(files[0]);
      }
    } else {
      setImage([...image(), ...files]);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const fd = new FormData(e.target);

      if (!childChecked().length) {
        setToast({ type: false, message: "გთხოვთ აირჩიოთ სპეციალობა." });
        return;
      }

      const title = fd.get("title");
      if (title.length < 5) {
        setToast({
          type: false,
          message: "სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს.",
        });
        setError([
          { field: "title", message: "სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს." },
        ]);
        return;
      }
      if (title.length > 60) {
        setToast({
          type: false,
          message: "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.",
        });
        setError([
          {
            field: "title",
            message: "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.",
          },
        ]);
        return;
      }

      const description = fd.get("description");
      if (description.length < 20) {
        setToast({
          type: false,
          message: "მიმოხილვა უნდა შეიცავდეს მინიმუმ 20 ასოს.",
        });
        setError([
          {
            field: "description",
            message: "მიმოხილვა უნდა შეიცავდეს მინიმუმ 20 ასოს.",
          },
        ]);
        return;
      }
      if (description.length > 300) {
        setToast({
          type: false,
          message: "მიმოხილვა უნდა შეიცავდეს მაქსიმუმ 300 ასოს.",
        });
        setError([
          {
            field: "description",
            message: "მიმოხილვა უნდა შეიცავდეს მაქსიმუმ 300 ასოს.",
          },
        ]);
        return;
      }

      if (!fd.get("price")) {
        setToast({ type: false, message: "ფასი სავალდებულოა." });
        setError([{ field: "price", message: "ფასი სავალდებულოა." }]);
        return;
      }

      if (service() && service().length) {
        const error = service().find((service, index) => {
          if (service.title.length < 5) {
            setToast({
              type: false,
              message: `${
                index + 1
              } ქვესერვისის სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს.`,
            });
            setError([
              {
                field: `service.${index}.title`,
                message: "ქვესერვისის სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს.",
              },
            ]);
            return true;
          }
          if (service.title.length > 60) {
            setToast({
              type: false,
              message: `${
                index + 1
              } ქვესერვისის სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.`,
            });
            setError([
              {
                field: `service.${index}.title`,
                message: "ქვესერვისის სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.",
              },
            ]);
            return true;
          }
          if (service.description.length < 20) {
            setToast({
              type: false,
              message: `${
                index + 1
              } ქვესერვისის აღწერა სავალდებულოა უნდა შეიცავდეს მინიმუმ 20 ასოს.`,
            });
            setError([
              {
                field: `service.${index}.description`,
                message:
                  "ქვესერვისის აღწერა სავალდებულოა უნდა შეიცავდეს მინიმუმ 20 ასოს.",
              },
            ]);
            return true;
          }
          if (!service.price) {
            setToast({
              type: false,
              message: `${index + 1} ქვესერვისის ფასი სავალდებულოა.`,
            });
            setError([
              {
                field: `service.${index}.price`,
                message: "ქვესერვისის ფასი სავალდებულოა.",
              },
            ]);
            return true;
          }
        });

        if (error) return;
      }

      if (!thumbNail()) {
        setToast({ type: false, message: "თამბნეილი სავალდებულოა." });
        return;
      }

      if (!image().length) {
        setToast({ type: false, message: "გალერეა სავალდებულოა." });
        return;
      }

      fd.append("location", JSON.stringify(markedLocation()));
      fd.append("thumbnail", thumbNail());
      fd.append("mainCategory", mainChecked());
      fd.append("parentCategory", parentChecked());
      fd.append("childCategory", JSON.stringify(childChecked()));
      fd.append("service", JSON.stringify(service()));
      fd.append("galleryLength", image().length);

      if (schedule()) {
        fd.append("schedule", JSON.stringify(schedule()));
      }

      for (let i = 0; i < image().length; i++) {
        fd.append(`service-${i}-gallery-image`, image()[i]);
      }
      if (isEditing()) {
        const sp = new URLSearchParams(props?.location?.search);
        fd.append("public_id", sp.get("id", sp.get("public_id")));
      }
      setIsSendingRequest(true);
      const url = isEditing()
        ? "/api/xelosani/service/edit_service"
        : "/api/xelosani/service/add_service";
      const response = await fetch(url, {
        method: "POST",
        body: fd,
        credentials: "include",
        signal: signal(),
      });

      if (!response.ok) {
        return props.setToast({
          message: "სერვისი გამოქვეყნება ვერ მოხერხდა.",
          type: false,
        });
      }

      if (response.status === 500) {
        setToast({
          type: false,
          message: "დაფიქსირდა სერვერული შეცდომა, სცადეთ მოგვიანებით.",
        });
      } else if (response.status === 400) {
        const data = await response.json();
        setToast({ typle: false, message: data.errors[0].message });
        setError(data.errors);
      } else {
        if (isEditing()) {
          return setToast({
            type: true,
            message: "სერვისი წარმატებით განახლდა.",
          });
        }
        document.getElementById("price").value = null;

        batch(() => {
          setToast({
            type: true,
            message: isEditing()
              ? "სერვისი წარმატებით განახლდა."
              : "სერვისი წარმატებით აიტვირთა.",
          });
          setImage([]);
          setTitle("");
          setInput("");
          setMainChecked();
          setParentChecked();
          setService([]);
          setThumbnail(null);
          setChildChecked([]);
          setCurrentStep("thumbnail");
        });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        filterErrors(error);
      }
    } finally {
      setIsSendingRequest(false);
    }
  };

  createEffect(() => {
    if (!toast()) return;
    let toastErrorTimeout;
    let toastExitTimeout;
    toastErrorTimeout = setTimeout(() => {
      setIsExiting(true);
      toastExitTimeout = setTimeout(() => {
        setIsExiting(false);
        setToast(null);
      }, 500);
    }, 5000);

    onCleanup(() => {
      if (toastErrorTimeout) clearTimeout(toastErrorTimeout);
      if (toastExitTimeout) clearTimeout(toastExitTimeout);
    });
  });

  const toggleParentAccordion = (index) => {
    if (activeParentIndex() === index) {
      batch(() => {
        setActiveParentIndex(null);
        setActiveChildIndex(null);
      });
    } else {
      batch(() => {
        setActiveParentIndex(index);
        setActiveChildIndex(null);
      });
    }
  };

  const toggleChildAccordion = (index) => {
    if (activeChildIndex() === index) {
      setActiveChildIndex(null);
    } else {
      setActiveChildIndex(index);
    }
  };

  const handleParentChange = (
    isChecked,
    currentCategory,
    childCategories,
    index,
    m
  ) => {
    if (isChecked) {
      toggleChildAccordion(index);
      const structured_services = childCategories.map((cc, i) => {
        return { id: i, title: "", category: cc, description: "", price: null };
      });
      setService(structured_services);
      batch(() => {
        setMainChecked(m);
        setChildChecked(childCategories);
        setParentChecked(currentCategory);
      });
    } else {
      batch(() => {
        setService([]);
        setChildChecked((prev) => {
          const filt = prev.filter((p) => !childCategories.includes(p));
          return filt;
        });
        setMainChecked(null);
        setParentChecked(null);
      });
    }
  };

  const handleGrandChange = (j, i, isChecked, parentCategory, allChild, m) => {
    if (isChecked) {
      if (parentChecked() !== parentCategory) {
        setParentChecked(parentCategory);

        setChildChecked([]);
        setService([]);
        setMainChecked(m);
      }
      setChildChecked((prev) => {
        if (parentChecked() && parentChecked() !== parentCategory) {
          return [prev];
        }

        return [...prev, j];
      });
      setService((prev) => {
        return [
          ...prev,
          { id: i(), title: "", category: j, description: "", price: null },
        ];
      });
    } else {
      setService((prev) => {
        if (prev) return prev.filter((_, index) => index !== i());
      });
      setChildChecked((prev) => {
        const filt = prev.filter((p) => p !== j);
        return filt;
      });
      if (!allChild.some((a) => childChecked().includes(a))) {
        setParentChecked(null);
        setMainChecked(null);
      }
    }
  };

  const removeService = (index) => {
    setService((prev) => {
      if (prev.length === 1) {
        setParentChecked(false);
      }
      return prev.filter((_, i) => i !== index);
    });
    setChildChecked((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const handle_file_delete = async (prop, filename, is_user_added, index) => {
    if (is_user_added) {
      if (prop === "thumbnail/medium") {
        setThumbnail(null);
      } else {
        return setImage(image().filter((a, i) => i !== index));
      }
      return;
    }
    try {
      const delete_response = await fetch(
        "http://localhost:5555/delete_service_image",
        {
          method: "DELETE",
          body: JSON.stringify({
            filename,
            prop,
            xelosaniProfId: response().profId,
            serviceId: response().serviceId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      // Deleting thumbnail doesnt update the ui just send back the prop: "gallery" || "thumbnail"
      if (delete_response.status === 200) {
        return setImage(image().filter((a, i) => i !== index));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MetaProvider>
      <Link
        href="https://cdn.maptiler.com/maptiler-sdk-js/v3.0.1/maptiler-sdk.css"
        rel="stylesheet"
      />
      <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.0.1/maptiler-sdk.umd.min.js"></script>
      <section class="min-h-screen">
        <Switch>
          <Match when={response() && response() === 401}>
            <NotAuthorized />
          </Match>
          <Match when={response() && response() !== 401}>
            <Show when={imageToPreviewUrl()}>
              <ImagePreview
                setImageToPreviewUrl={setImageToPreviewUrl}
                imageToPreviewUrl={imageToPreviewUrl}
              />
            </Show>

            <h1 class="text-center font-bold text-2xl text-gray-800">
              {isEditing() ? "გაანახლე სერვისი" : "დაამატე სერვისი"}
            </h1>

            <div class="flex w-full justify-center">
              <div class="flex flex-col md:flex-row w-[90%] mt-2 space-y-4 md:space-y-0 md:space-x-6">
                {/* Left Side – Form and Modals */}
                <div class="flex-1">
                  <Show when={jobs && showCategoryModal()}>
                    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[500]">
                      <div class="bg-white rounded-lg p-8 w-[950px] max-h-[480px] overflow-auto">
                        <div class="flex items-center justify-between mb-4">
                          <h3 class="font-bold text-xl">აირჩიე სპეციალობა</h3>
                          <img
                            src={closeIcon}
                            alt="close"
                            class="cursor-pointer"
                            onClick={() => setShowCategoryModal(false)}
                          />
                        </div>
                        <div class="grid grid-cols-2 gap-x-5">
                          <For each={jobs.flatMap((obj) => Object.keys(obj))}>
                            {(m, Parentindex) => (
                              <div class="mb-4">
                                <div
                                  onClick={() =>
                                    toggleParentAccordion(Parentindex())
                                  }
                                  class="flex justify-between items-center py-5 text-slate-800 cursor-pointer"
                                >
                                  <span class="text-md font-bold">{m}</span>
                                  <span
                                    class={`transition-transform duration-300 ${
                                      activeParentIndex() === Parentindex()
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  >
                                    <img
                                      src={dropdownSVG}
                                      alt="dropdown icon"
                                      class="transform transition-transform duration-300"
                                    />
                                  </span>
                                </div>
                                <div
                                  class={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    activeParentIndex() === Parentindex()
                                      ? "max-h-screen"
                                      : "max-h-0"
                                  }`}
                                >
                                  <Show
                                    when={activeParentIndex() === Parentindex()}
                                  >
                                    <For each={jobs[0][m]}>
                                      {(child, index) => (
                                        <div>
                                          <div class="flex justify-between items-center py-1 px-2 text-slate-800">
                                            <span class="text-sm font-bold">
                                              {child["კატეგორია"]}
                                            </span>
                                            <div class="flex items-center gap-x-2">
                                              <input
                                                type="checkbox"
                                                checked={
                                                  parentChecked() ===
                                                  child["კატეგორია"]
                                                }
                                                onChange={(e) =>
                                                  handleParentChange(
                                                    e.target.checked,
                                                    child["კატეგორია"],
                                                    child["სამუშაოები"],
                                                    index(),
                                                    m
                                                  )
                                                }
                                                class="accent-green-600"
                                              />
                                              <span
                                                onClick={() =>
                                                  toggleChildAccordion(index())
                                                }
                                                class={`transition-transform duration-300 cursor-pointer ${
                                                  activeChildIndex() === index()
                                                    ? "rotate-180"
                                                    : ""
                                                }`}
                                              >
                                                <img
                                                  src={dropdownSVG}
                                                  alt="dropdown icon"
                                                  class="transform transition-transform duration-300"
                                                />
                                              </span>
                                            </div>
                                          </div>
                                          <div
                                            class={`overflow-hidden px-4 transition-all duration-300 ease-in-out ${
                                              activeChildIndex() === index()
                                                ? "max-h-screen"
                                                : "max-h-0"
                                            }`}
                                          >
                                            <For each={child["სამუშაოები"]}>
                                              {(j, i) => (
                                                <div class="flex items-center justify-between text-xs text-slate-800 py-1">
                                                  <p class="font-bold">{j}</p>
                                                  <input
                                                    type="checkbox"
                                                    checked={childChecked().includes(
                                                      j
                                                    )}
                                                    class="accent-green-600"
                                                    onChange={(e) =>
                                                      handleGrandChange(
                                                        j,
                                                        i,
                                                        e.target.checked,
                                                        child["კატეგორია"],
                                                        child["სამუშაოები"],
                                                        m
                                                      )
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </For>
                                          </div>
                                        </div>
                                      )}
                                    </For>
                                  </Show>
                                </div>
                              </div>
                            )}
                          </For>
                        </div>
                        <button
                          onClick={() => {
                            setShowCategoryModal(false);
                            navigate(
                              `${
                                props.location.pathname + props.location.search
                              }#serviceWrapper`
                            );
                          }}
                          class="mt-4 w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition"
                        >
                          დადასტურება
                        </button>
                      </div>
                    </div>
                  </Show>

                  <form
                    onSubmit={createPost}
                    class="mx-auto flex flex-col text-gray-800 p-6 bg-white rounded-lg shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(true)}
                      class="bg-green-600 text-white font-bold px-4 py-2 mb-4 rounded-lg hover:bg-green-700 transition"
                    >
                      დაამატე სპეციალობა
                    </button>

                    <input
                      class="bg-gray-50 p-2 mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="სათაური"
                      onInput={(e) => setTitle(e.target.value)}
                      id="title"
                      value={title()}
                      maxLength={60}
                      name="title"
                      type="text"
                    />
                    <Show when={error()?.some((a) => a.field === "title")}>
                      <p class="text-xs text-red-500 font-bold mb-2">
                        {error().find((a) => a.field === "title").message}
                      </p>
                    </Show>

                    <textarea
                      class="bg-gray-50 p-3 h-60 mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      spellcheck="false"
                      name="description"
                      value={input()}
                      onInput={(e) => setInput(e.target.value)}
                      maxlength={300}
                      id="desc"
                      placeholder="თქვენი სერვისის მიმოხილვა"
                    ></textarea>
                    <Show
                      when={error()?.some((a) => a.field === "description")}
                    >
                      <p class="text-xs text-red-500 font-bold mb-2">
                        {error().find((a) => a.field === "description").message}
                      </p>
                    </Show>

                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-end gap-x-1">
                        <input
                          class="bg-gray-50 p-2 w-3/4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="ფასი"
                          min={1}
                          id="price"
                          name="price"
                          type="number"
                        />
                        <span class="text-2xl font-[normal-font] font-bold">₾</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSchedule(true)}
                        class="bg-green-600 text-white px-4 py-2 font-bold text-xs rounded-lg hover:bg-green-700 transition"
                      >
                        დაამატე განრიგი (სურვილისამებრ)
                      </button>
                    </div>
                    <Show when={error()?.some((a) => a.field === "price")}>
                      <p class="text-xs text-red-500 font-bold mb-2">
                        {error().find((a) => a.field === "price").message}
                      </p>
                    </Show>

                    <ul class="flex flex-col md:flex-row gap-2 mt-4">
                      <li class="flex-1">
                        <button
                          onClick={() => setCurrentStep("thumbnail")}
                          type="button"
                          class={`w-full p-4 text-left rounded-lg ${
                            currentStep() === "thumbnail"
                              ? "bg-green-50 border border-green-600"
                              : "bg-gray-50"
                          }`}
                        >
                          <span class="block text-sm font-bold text-gray-800">
                            თამბნეილი
                          </span>
                          <p class="text-sm text-gray-500">
                            სურათი გამოჩნდება წინა გვერდზე.
                          </p>
                        </button>
                      </li>
                      <li class="flex-1">
                        <button
                          onClick={() => setCurrentStep("gallery")}
                          type="button"
                          class={`w-full p-4 text-left rounded-lg ${
                            currentStep() === "gallery"
                              ? "bg-green-50 border border-green-600"
                              : "bg-gray-50"
                          }`}
                        >
                          <span class="block text-sm font-bold text-gray-800">
                            გალერეა
                          </span>
                          <p class="text-sm text-gray-500">
                            სხვადასხვა ფოტოები.
                          </p>
                        </button>
                      </li>
                    </ul>

                    <div class="flex flex-col items-center mt-4">
                      <label
                        htmlFor="dropzone-file"
                        class="flex flex-col items-center justify-center w-full h-64 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
                      >
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <img src={uploadIcon} alt="upload" class="mb-2" />
                          <p class="mb-2 text-sm text-gray-500">
                            <span class="font-bold">ასატვირთად დააჭირე</span>
                          </p>
                          <p class="text-xs text-gray-500">
                            PNG, JPEG, WEBP. (მაქს. 5MB)
                          </p>
                        </div>
                        <input
                          onChange={(e) => handleFileChange(e)}
                          name="files[]"
                          multiple={
                            currentStep() === "thumbnail" ? false : true
                          }
                          accept="image/jpeg, image/png, image/webp, image/avif"
                          id="dropzone-file"
                          type="file"
                          class="hidden"
                        />
                      </label>
                    </div>

                    <Show when={thumbNail()}>
                      <div class="mt-4">
                        <p class="font-bold mb-2">თამბნეილი</p>
                        <div class="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                          <span class="truncate text-base font-medium text-gray-800">
                            {thumbNail().name}
                          </span>
                          <div class="flex items-center gap-x-2">
                            <Show
                              when={isEditing() && !thumbNail().is_user_added}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setImageToPreviewUrl(
                                    `http://localhost:5555/static/images/xelosani/${
                                      response().profId
                                    }/services/${
                                      response().serviceId
                                    }/thumbnail/medium/${thumbNail().name}`
                                  )
                                }
                              >
                                <img
                                  src={eyeFillSVG}
                                  width={18}
                                  height={18}
                                  alt="preview"
                                />
                              </button>
                            </Show>
                            <button
                              type="button"
                              onClick={() =>
                                handle_file_delete(
                                  "thumbnail/medium",
                                  thumbNail().name,
                                  thumbNail().is_user_added
                                )
                              }
                              class="text-gray-800"
                            >
                              <img
                                src={closeIcon}
                                width={18}
                                height={18}
                                alt="delete"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Show>

                    <Show when={image() && image().length}>
                      <div class="flex flex-col gap-y-2 mt-4">
                        <p class="font-bold mb-2">გალერეა</p>
                        <For each={image()}>
                          {(l, index) => (
                            <>
                            <div class="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                              <span class="truncate text-base font-medium text-gray-800">
                                {l.name}
                              </span>
                              <div class="flex items-center gap-x-2">
                                <Show when={isEditing() && !l.is_user_added}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setImageToPreviewUrl(
                                        `http://localhost:5555/static/images/xelosani/${
                                          response().profId
                                        }/services/${
                                          response().serviceId
                                        }/gallery/medium/${l.name}`
                                      )
                                    }
                                  >
                                    <img
                                      src={eyeFillSVG}
                                      width={18}
                                      height={18}
                                      alt="preview"
                                    />
                                  </button>
                                </Show>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handle_file_delete(
                                      "gallery/medium",
                                      l.name,
                                      l.is_user_added,
                                      index()
                                    )
                                  }
                                  class="text-gray-800"
                                >
                                  <img
                                    src={closeIcon}
                                    width={18}
                                    height={18}
                                    alt="delete"
                                  />
                                </button>
                              </div>
                            </div>
                            </>
                          )}
                        </For>
                      </div>
                    </Show>

                    <div class="flex items-center justify-between mt-4">
                      {isSendingRequest() ? (
                        <button
                          type="button"
                          onClick={() => abort()}
                          class="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition"
                        >
                          <img
                            src={spinner}
                            class="animate-spin mr-2"
                            alt="იტვირთება..."
                          />
                          <span>გაუქმება</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          სერვისის {isEditing() ? "განახლება" : "გამოქვეყნება"}
                        </button>
                      )}
                    </div>
                    <Show when={service() && service().length}>
                      <ServicesModal
                        error={error}
                        removeService={removeService}
                        service={service}
                        setService={setService}
                      />
                    </Show>
                    <Show when={showSchedule()}>
                      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div class="bg-white rounded-lg p-6 shadow-lg">
                          <ServiceSchedule
                            setSchedule={setSchedule}
                            schedule={schedule}
                            setToast={setToast}
                            setShowSchedule={setShowSchedule}
                          />
                        </div>
                      </div>
                    </Show>
                  </form>
                </div>

                {/* Right Side – Map */}
                <div class="flex-shrink-0">
                  <MapRenderer
                    markedLocation={markedLocation}
                    setMarkedLocation={setMarkedLocation}
                    longitude={response().longitude}
                    latitude={response().latitude}
                    center={response().center}
                    place_name_ka={response().place_name_ka}
                    height={"100%"}
                    width={"800px"}
                  />
                </div>
              </div>
            </div>
          </Match>
        </Switch>

        <Show when={toast()}>
          <Toast
            toast={toast}
            setToast={setToast}
            isExiting={isExiting}
            setIsExiting={setIsExiting}
          />
        </Show>
      </section>
    </MetaProvider>
  );
};

export default CreateServices;
