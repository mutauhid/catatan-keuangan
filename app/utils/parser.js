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
  const amountMatch = cleanedText.match(amountRegex);
  console.log("🚀 ~ parseMessage ~ amountMatch:", amountMatch);

  if (!amountMatch) {
    return null;
  }

  let amountString = amountMatch[0];
  console.log("🚀 ~ parseMessage ~ amountString:", amountString);
  amountString = amountString.replace(/\./g, "").replace(/,/g, ".");
  const amount = parseFloat(amountString);
  console.log("🚀 ~ parseMessage ~ amount:", amount);

  if (isNaN(amount) || amount <= 0) {
    return null;
  }

  let remainingText = cleanedText.replace(amountMatch[0], "").trim();
  console.log("🚀 ~ parseMessage ~ remainingText:", remainingText);

  const sourceKeywords = ["mandiri", "bca", "bri", "gopay", "cash", "seabank"];
  const incomeKeywords = [
    "gaji",
    "bonus",
    "terima",
    "pendapatan",
    "transfer masuk",
    "jual",
  ];
  let source = "lain-lain";
  let type = "Pengeluaran";

  if (incomeKeywords.some((keyword) => text.toLowerCase().includes(keyword))) {
    type = "Pendapatan";
  }

  const sourcePattern = new RegExp(
    `(via|dari|pakai)\\s*(${sourceKeywords.join("|")})`,
    "i"
  );
  console.log("🚀 ~ parseMessage ~ sourcePattern:", sourcePattern);

  const sourceMatch = remainingText.match(sourcePattern);
  console.log("🚀 ~ parseMessage ~ sourceMatch:", sourceMatch);

  if (sourceMatch) {
    source = sourceMatch[2].toUpperCase();
    remainingText = remainingText.replace(sourceMatch[0], "").trim();
  } else {
    const directSourcePattern = new RegExp(
      `(${sourceKeywords.join("|")})`,
      "i"
    );
    console.log(
      "🚀 ~ parseMessage ~ directSourcePattern:",
      directSourcePattern
    );
    const directSourceMatch = remainingText.match(directSourcePattern);
    console.log("🚀 ~ parseMessage ~ directSourceMatch:", directSourceMatch);

    if (directSourceMatch) {
      source = directSourceMatch[0].toUpperCase();
      remainingText = remainingText.replace(directSourceMatch[0], "").trim();
    }
  }

  let description = remainingText;
  if (type === "Pendapatan") {
    const incomePattern = new RegExp(`(${incomeKeywords.join("|")})`, "i");
    console.log("🚀 ~ parseMessage ~ incomePattern:", incomePattern);
    description = remainingText.replace(incomePattern, "").trim();
    console.log("🚀 ~ parseMessage ~ description:", description);
  }
  description =
    description.length > 0
      ? capitalizeFirstLetter(remainingText)
      : "Transaksi tidak teridentifikasi";
  console.log("🚀 ~ parseMessage ~ description:", description);

  return {
    description: description,
    amount: amount,
    source: source,
    type: type,
  };

  function capitalizeFirstLetter(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}

module.exports = { parseMessage };
