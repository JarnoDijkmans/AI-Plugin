import { useState } from "@wordpress/element";

const SliderComponent = ({ dataset }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const groupedSlides = dataset.map((group) => {
    return group.dataset.map((item) => {
      if (item.locationChecked) {
        // Summarize locations for locationChecked items
        item.changes.map((change) => change.to).join(", ");
        return `${item.numberPages}x locatie omgeving ${item.changes[0]?.from}`;
      } else {
        // Map individual changes for non-locationChecked items
        return item.changes
          .map((change) => {
            return `${change.from} → ${change.to}`;
          })
          .join(", ");
      }
    });
  });

  return (
    <div>
      <h4>Wat wordt er veranderd?</h4>
      <hr />
      <div>
        {/* Display all items in the current group */}
        {groupedSlides[currentSlide].map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>

      {/* Slider Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <div style={{ display: "flex", gap: "5px" }}>
          {groupedSlides.map((_, index) => (
            <div
              key={index}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: currentSlide === index ? "black" : "lightgray",
                cursor: "pointer",
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;
