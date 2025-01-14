import { __experimentalText as Text } from "@wordpress/components";

export const SplitLongDescription = (description = "") => {
  if (!description) {
    return (
      <Text style={{ marginBottom: "10px", display: "block" }}>
        Geen beschrijving beschikbaar.
      </Text>
    );
  }

  const parts = description.split(/(✨|💡)/); // Split by emojis ✨ or 💡
  return parts.map((part, index) => {
    if (part === "✨" || part === "💡") {
      return (
        <Text
          key={index}
          style={{ fontWeight: "bold", marginTop: "10px", display: "block" }}
        >
          {part}
        </Text>
      );
    }
    return (
      <Text key={index} style={{ marginBottom: "10px", display: "block" }}>
        {part}
      </Text>
    );
  });
};
