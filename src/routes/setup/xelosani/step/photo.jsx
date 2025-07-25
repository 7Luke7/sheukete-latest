import { A, createAsync, useNavigate } from "@solidjs/router";
import CameraSVG from "../../../../svg-images/camera.svg";
import spinnerSVG from "../../../../svg-images/spinner.svg";
import { Match, Suspense, Switch, batch, createSignal } from "solid-js";
import { makeAbortable } from "@solid-primitives/resource";
import { get_profile_photo } from "~/routes/api/xelosani/setup/step";
import { Toast } from "~/Components/ToastComponent";

const ProfilePictureStep = () => {
  const userImage = createAsync(get_profile_photo)
  const [imageLoading, setImageLoading] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);
  const [file, setFile] = createSignal();
  const [imageUrl, setImageUrl] = createSignal();
  const [signal, abort, filterErrors] = makeAbortable({
    timeout: 0,
    noAutoAbort: true,
  });
  const [toast, setToast] = createSignal()
  const navigate = useNavigate();

  const handleProfileImageChange = async () => {
    setImageLoading(true);
    const formData = new FormData();
    formData.append("profile_image", file());

    try {
      const response = await fetch(
        `http://localhost:5555/profile_picture/${userImage().profId}`,
        {
          method: "POST",
          body: formData,
          signal: signal(),
          credentials: "include"
        }
      );

      if (!response.ok) {
        return alert("პროფილის ფოტო ვერ განახლდა, სცადეთ თავიდან.");
      }

      const data = await response.json();

      if (data.stepPercent === 100) {
        return navigate(`/xelosani/${data.profId}`);
      }

      batch(() => {
        setImageLoading(false)
        setFile(null);
        setSubmitted(true);
      });
    } catch (error) {
      if (error.name === "AbortError") {
        filterErrors(error);
      }
    } finally {
      setImageLoading(false);
    }
  };

  const handleFilePreview = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      return setToast({
        type: false,
        message: "ფაილის ზომა აღემატება 5მბ ლიმიტს."
      })
    }
    setImageLoading(true);
    try {
      batch(() => {
        setFile(URL.createObjectURL(file));
        setImageLoading(false);
        setImageUrl(URL.createObjectURL(file));
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Switch>
      <Match when={!userImage()?.url && !submitted()}>
        <div class="flex p-10 flex-col items-center mb-4">
          <Show when={toast()}>
            <Toast toast={toast} setToast={setToast}></Toast>
          </Show>
          <Switch>
            <Match when={!imageLoading()}>
              <label
                for="profilePic"
                class="hover:opacity-[0.7] cursor-pointer"
              >
                <div class="relative">
                  <Suspense
                    fallback={
                      <div class="w-[200px] h-[200px] rounded-full mb-4 bg-[#E5E7EB]"></div>
                    }
                  >
                    <img
                      id="setup_image"
                      src={imageUrl() ? imageUrl() : `http://localhost:5555/static/xelosani/profile/${userImage()?.profId}.webp`}
                      alt="Profile"
                      class="w-[180px] border-2 h-[180px] rounded-full mb-4"
                    />
                  </Suspense>
                  <img
                    src={CameraSVG}
                    alt="camera"
                    class="absolute transform opacity-50 -translate-x-1/2 -translate-y-1/2 absolute top-[50%] left-[50%]"
                  />
                </div>
              </label>
              <input
                type="file"
                onChange={(e) => handleFilePreview(e.target.files[0])}
                class="hidden"
                accept="image/webp, image/png, image/jpeg, image/avif, image/jpg"
                id="profilePic"
              />
            </Match>
            <Match when={imageLoading()}>
              <div class="w-[180px] flex flex-col justify-center mb-4 items-center h-[180px] rounded-[50%] bg-[#E5E7EB]">
                <img
                  class="animate-spin"
                  src={spinnerSVG}
                  width={40}
                  height={40}
                />
                <p class="text-dark-green font-[thin-font] text-xs font-bold">
                  იტვირთება...
                </p>
              </div>
            </Match>
          </Switch>
          <Show when={file() && !imageLoading()}>
            <button
              onClick={handleProfileImageChange}
              class="mb-2 bg-dark-green hover:bg-dark-green-hover text-white py-1 px-4  rounded-[16px] text-sm font-bold transition-all duration-300"
            >
              პროფილზე დაყენება
            </button>
          </Show>
          <Show when={imageLoading()}>
            <button
              onClick={() => abort()}
              class="mb-2 bg-gray-600 hover:bg-gray-500 w-[150px] text-white py-1 px-4  rounded-[16px] text-sm font-bold transition-all duration-300"
            >
              გაუქმება
            </button>
          </Show>
        </div>
      </Match>
      <Match
        when={
          userImage() && userImage().url ||
          submitted()
        }
      >
        <div class="p-10 flex flex-col items-center">
          <p class="text-sm font-[normal-font] font-bold text-gray-700">
            პროფილის ფოტო უკვე დამატებულია გთხოვთ განაგრძოთ.
          </p>
          <A
            className="py-2 mt-3 text-center w-1/2 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover"
            href="/setup/xelosani/step/contact"
          >
            გაგრძელება
          </A>
        </div>
      </Match>
    </Switch>
  );
};

export default ProfilePictureStep;
