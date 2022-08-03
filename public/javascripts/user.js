/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */

function padZero(str, len) {
  len = len || 2;
  const zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

function invertColor(hex, bw) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? "#000000"
      : "#FFFFFF";
  }
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);

  return `#${padZero(r)}${padZero(g)}${padZero(b)}`;
}

document.querySelectorAll("p.repoLang").forEach((e) => {
  if (!$(e).attr("data-color") || $(e).attr("data-color") == "null") {
    $(e).html("No lang").css({
      "background-color": "#1bd9b4",
      color: "#000",
    });
  } else {
    $(e).css({
      "background-color": $(e).attr("data-color") || "#1bd9b4",
      color: invertColor($(e).attr("data-color") || "#1bd9b4", true) || "#fff",
    });
  }
});

window.onresize = () => {
  (window.innerWidth <= 600) ? $(".contributionBox:lt(210)").hide() : $(".contributionBox:lt(180)").show();
};

window.onload = () => {
  (window.innerWidth <= 600) ? $(".contributionBox:lt(210)").hide() : $(".contributionBox:lt(180)").show();
};

$("img.langIcon").on("error", async function () {
  const codeSvg = `
    <svg class="langIcon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.759 3.975h1.783V5.76H5.759v4.458A1.783 1.783 0 0 1 3.975 12a1.783 1.783 0 0 1 1.784 1.783v4.459h1.783v1.783H5.759c-.954-.24-1.784-.803-1.784-1.783v-3.567a1.783 1.783 0 0 0-1.783-1.783H1.3v-1.783h.892a1.783 1.783 0 0 0 1.783-1.784V5.76A1.783 1.783 0 0 1 5.76 3.975m12.483 0a1.783 1.783 0 0 1 1.783 1.784v3.566a1.783 1.783 0 0 0 1.783 1.784h.892v1.783h-.892a1.783 1.783 0 0 0-1.783 1.783v3.567a1.783 1.783 0 0 1-1.783 1.783h-1.784v-1.783h1.784v-4.459A1.783 1.783 0 0 1 20.025 12a1.783 1.783 0 0 1-1.783-1.783V5.759h-1.784V3.975h1.784M12 14.675a.892.892 0 0 1 .892.892.892.892 0 0 1-.892.892.892.892 0 0 1-.891-.892.892.892 0 0 1 .891-.892m-3.566 0a.892.892 0 0 1 .891.892.892.892 0 0 1-.891.892.892.892 0 0 1-.892-.892.892.892 0 0 1 .892-.892m7.133 0a.892.892 0 0 1 .891.892.892.892 0 0 1-.891.892.892.892 0 0 1-.892-.892.892.892 0 0 1 .892-.892z" fill="#10ebe5"/></svg>`;
  $(this).replaceWith(codeSvg);
});

tippy(".contributionBox", {
  theme: "neon",
});

const statsSelector = $(".number");
const langSelector = $(".langPercent");

statsSelector.each((i) => {
  const value = $(statsSelector[i]).html();
  const countAnimation = new countUp.CountUp(statsSelector[i], value, {
    duration: 3,
    useGrouping: true,
  });
  countAnimation.start();
});

langSelector.each((i) => {
  const value = $(langSelector[i]).html();
  const countAnimation = new countUp.CountUp(langSelector[i], value, {
    duration: 3,
    useGrouping: false,
    decimalPlaces: 2,
  });
  countAnimation.start();
});
