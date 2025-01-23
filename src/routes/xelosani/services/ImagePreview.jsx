export const ImagePreview = (props) => {
  const closePopup = () => {
    props.setImageToPreviewUrl(null);
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 4,
          }}
        >
          <img
            src={props.imageToPreviewUrl()}
            alt="Preview"
            style={{
              width: "351px",
              height: "351px",
              objectFit: "cover",
              display: "block",
              margin: "0 auto",
            }}
          />

          <button
            onClick={closePopup}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "#f0f0f0",
              border: "none",
              padding: "5px 8px",
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
