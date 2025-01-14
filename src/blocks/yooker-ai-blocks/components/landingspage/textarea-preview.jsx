const TextareaPreview = ({ text, handleSelection }) => (
  <textarea
    value={text}
    onMouseUp={handleSelection}
    readOnly
    rows={10}
    style={{
      width: "100%",
      minHeight: "250px",
      height: "100%",
      padding: "10px",
      border: "1px solid #ccc",
    }}
  />
);

export default TextareaPreview;
