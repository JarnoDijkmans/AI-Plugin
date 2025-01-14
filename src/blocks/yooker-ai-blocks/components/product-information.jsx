import React, { useEffect, useState } from "react";

const ProductInformation = ({ productId, setAggregatedContent }) => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sale, setSale] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState("");
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const titleInput = document.querySelector("#title");
    const shortDescriptionInput = document.querySelector("#excerpt");
    const priceInput = document.querySelector("#_regular_price");
    const saleInput = document.querySelector("#_sale_price");
    const longDescriptionInput = document.querySelector("#content");
    const categoryInputs = document.querySelectorAll(
      'input[name="tax_input[product_cat][]"]:checked'
    );
    const tagsInput = document.querySelector("#new-tag-product_tag");

    // Set initial values
    setTitle(titleInput.value);
    setShortDescription(shortDescriptionInput.value);
    setPrice(priceInput.value);
    setSale(saleInput.value);
    setLongDescription(longDescriptionInput.value);
    setTags(tagsInput.value);

    const selectedCategories = Array.from(categoryInputs).map((cat) =>
      cat.nextSibling.textContent.trim()
    );
    setCategories(selectedCategories);

    // Add event listeners to track changes
    titleInput.addEventListener("input", (e) => setTitle(e.target.value));
    shortDescriptionInput.addEventListener("input", (e) =>
      setShortDescription(e.target.value)
    );
    priceInput.addEventListener("input", (e) => setPrice(e.target.value));
    saleInput.addEventListener("input", (e) => setSale(e.target.value));
    longDescriptionInput.addEventListener("input", (e) =>
      setLongDescription(e.target.value)
    );
    tagsInput.addEventListener("input", (e) => setTags(e.target.value));

    // Watch for category changes
    document
      .querySelectorAll('input[name="tax_input[product_cat][]"]')
      .forEach((input) => {
        input.addEventListener("change", (e) => {
          const updatedCategories = Array.from(
            document.querySelectorAll(
              'input[name="tax_input[product_cat][]"]:checked'
            )
          ).map((cat) => cat.nextSibling.textContent.trim());
          setCategories(updatedCategories);
        });
      });

    // Cleanup event listeners on unmount
    return () => {
      titleInput.removeEventListener("input", (e) => setTitle(e.target.value));
      shortDescriptionInput.removeEventListener("input", (e) =>
        setShortDescription(e.target.value)
      );
      priceInput.removeEventListener("input", (e) => setPrice(e.target.value));
      saleInput.removeEventListener("input", (e) => setSale(e.target.value));
      longDescriptionInput.removeEventListener("input", (e) =>
        setLongDescription(e.target.value)
      );
      tagsInput.removeEventListener("input", (e) => setTags(e.target.value));

      document
        .querySelectorAll('input[name="tax_input[product_cat][]"]')
        .forEach((input) => {
          input.removeEventListener("change", () => {});
        });
    };
  }, [productId, setAggregatedContent]);

  useEffect(() => {
    const updateAttributes = () => {
      const attributeNameInputs = document.querySelectorAll(
        'input[name^="attribute_names"]'
      );
      const attributeValuesInputs = document.querySelectorAll(
        'textarea[name^="attribute_values"]'
      );

      const attributes = [];

      // Loop over each name input and grab its corresponding value input
      attributeNameInputs.forEach((nameInput, index) => {
        const attributeName = nameInput.value.trim();
        const valuesInput = attributeValuesInputs[index];

        if (valuesInput && attributeName) {
          const rawValues = valuesInput.value.trim();

          // Only proceed if there is a non-empty value
          if (rawValues) {
            const parsedValues = rawValues
              .split("|")
              .map((value) => value.trim())
              .join(", ");
            const attributeString = `${attributeName}: ${parsedValues}`;
            attributes.push(attributeString);
          }
        }
      });

      const allAttributesString = attributes.join(" | ");
      setAttributes(allAttributesString);
    };

    updateAttributes();

    const saveButton = document.querySelector(".save_attributes");
    if (saveButton) {
      saveButton.addEventListener("click", updateAttributes);
    }

    return () => {
      if (saveButton) {
        saveButton.removeEventListener("click", updateAttributes);
      }
    };
  }, [productId]);

  useEffect(() => {
    const aggregatedData = {
      title,
      longDescription,
      price,
      sale,
      categories: categories.join(", "),
      tags,
      attributes,
    };
    // Remove any undefined or empty values
    Object.keys(aggregatedData).forEach((key) => {
      if (!aggregatedData[key]) {
        delete aggregatedData[key];
      }
    });

    setAggregatedContent(aggregatedData);
  }, [
    title,
    shortDescription,
    price,
    sale,
    categories,
    tags,
    longDescription,
    attributes,
  ]);
};

export default ProductInformation;
