particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 60,
            "density": {
                "enable": true,
                "value_area": 500
            }
        },
        "color": {
            "value": "#10ebe5"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 1,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 1,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 10,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": false,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {

        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);

    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

document.querySelectorAll("p.repoLang").forEach(e => {
    if (!$(e).attr("data-color") || $(e).attr("data-color") == "null") {
        $(e).html("No lang").css({
            "background-color": "#1bd9b4",
            color: "#000"
        })
    } else {
        $(e).css({
            "background-color": $(e).attr("data-color") || "#1bd9b4",
            color: invertColor($(e).attr("data-color") || "#1bd9b4", true) || "#fff"
        })
    }
});

function imgError(image) {
    image.onerror = "";
    image.src = "/images/noimage.gif";
    return true;
}

$("img.langIcon").on("error", async function () {
    var codeSvg = `
    <svg class="langIcon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.759 3.975h1.783V5.76H5.759v4.458A1.783 1.783 0 0 1 3.975 12a1.783 1.783 0 0 1 1.784 1.783v4.459h1.783v1.783H5.759c-.954-.24-1.784-.803-1.784-1.783v-3.567a1.783 1.783 0 0 0-1.783-1.783H1.3v-1.783h.892a1.783 1.783 0 0 0 1.783-1.784V5.76A1.783 1.783 0 0 1 5.76 3.975m12.483 0a1.783 1.783 0 0 1 1.783 1.784v3.566a1.783 1.783 0 0 0 1.783 1.784h.892v1.783h-.892a1.783 1.783 0 0 0-1.783 1.783v3.567a1.783 1.783 0 0 1-1.783 1.783h-1.784v-1.783h1.784v-4.459A1.783 1.783 0 0 1 20.025 12a1.783 1.783 0 0 1-1.783-1.783V5.759h-1.784V3.975h1.784M12 14.675a.892.892 0 0 1 .892.892.892.892 0 0 1-.892.892.892.892 0 0 1-.891-.892.892.892 0 0 1 .891-.892m-3.566 0a.892.892 0 0 1 .891.892.892.892 0 0 1-.891.892.892.892 0 0 1-.892-.892.892.892 0 0 1 .892-.892m7.133 0a.892.892 0 0 1 .891.892.892.892 0 0 1-.891.892.892.892 0 0 1-.892-.892.892.892 0 0 1 .892-.892z" fill="#10ebe5"/></svg>`;
    $(this).replaceWith(codeSvg)
    // var svg = await fetch("https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@main/icons/json.svg")
    // console.log(svg);
    // $(this).attr("src", "https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@main/icons/json.svg");
});