export const ImagePreview = (props) => {
  const closePopup = () => {
    props.setImageToPreviewUrl(null);
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div class="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <button
          onClick={closePopup}
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <svg
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 
              1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 
              1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 
              10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <img
          src={props.imageToPreviewUrl()}
          alt="Preview"
          class="w-full h-auto p-2 object-cover rounded"
        />
      </div>
    </div>
  );
};

export default ImagePreview;
