/**
 * @param {string} text
 * @returns {object|null}
 */

function parseMessage(text) {
  if (!text || typeof text !== "string") {
    return null;
  }
  const cleanedText = text.toLowerCase().trim();
  console.log("🚀 ~ parseMessage ~ cleanedText:", cleanedText);

  const amountRegex = /\d+(?:[.,]\d{3})*(?:[.,]\d+)?/;
  console.log("🚀 ~ parseMessage ~ amountRegex:", amountRegex);
  const amountMatch = cleanedText.match(amountRegex);
  console.log("🚀 ~ parseMessage ~ amountMatch:", amountMatch);

  if (!amountMatch) {
    return null;
  }

  let amountString = amountMatch[0];
  amountString = amountString.replace(/\./g, "").replace(/,/g, ".");
  const amount = parseFloat(amountString);
  console.log("🚀 ~ parseMessage ~ amount:", amount);

  if (isNaN(amount) || amount <= 0) {
    return null;
  }

  let remainingText = cleanedText.replace(amountMatch[0], "").trim();
  console.log("🚀 ~ parseMessage ~ remainingText:", remainingText);

  const sourceKeywords = ["mandiri", "bca", "bri", "gopay", "cash"];
  let source = "lain-lain";

  const sourcePattern = new RegExp(
    `(via|dari|pakai)\\s*(${sourceKeywords.join("|")})`,
    "i"
  );
  console.log("🚀 ~ parseMessage ~ sourcePattern:", sourcePattern);
  const sourceMatch = remainingText.match(sourcePattern);

  if (sourceMatch) {
    source = sourceMatch[2].toUpperCase();
    remainingText = remainingText.replace(sourceMatch[0], "").trim();
  } else {
    const directSourcePattern = new RegExp(
      `(${sourceKeywords.join("|")})`,
      "i"
    );
    const directSourceMatch = remainingText.match(directSourcePattern);

    if (directSourceMatch) {
      source = directSourceMatch[0].toUpperCase();
      remainingText = remainingText.replace(directSourceMatch[0], "").trim();
    }
  }

  const description =
    remainingText.length > 0
      ? capitalizeFirstLetter(remainingText)
      : "Transaksi tidak teridentifikasi";

  return {
    description: description,
    amount: amount,
    source: source,
  };

  function capitalizeFirstLetter(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}

module.exports = { parseMessage };
