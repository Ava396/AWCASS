$(document).ready(function () {

    /* ==============================================
                    NAVBAR SCROLL
    ============================================== */
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 80) {
            $(".smart-navbar").css({
                "padding": "10px 0",
                "box-shadow": "0 5px 25px rgba(0,0,0,.09)"
            });
        } else {
            $(".smart-navbar").css({
                "padding": "16px 0",
                "box-shadow": "0 3px 20px rgba(0,0,0,.06)"
            });
        }
    });

    /* ==============================================
                  ACTIVE NAVIGATION
    ============================================== */
    function updateActiveNav() {
        let scroll = $(window).scrollTop();
        $("section").each(function () {
            let top = $(this).offset().top - 160;
            let bottom = top + $(this).outerHeight();
            if (scroll >= top && scroll <= bottom) {
                let id = $(this).attr("id");
                $(".nav-link").removeClass("active");
                $('.nav-link[href="#' + id + '"]').addClass("active");
            }
        });
    }

    $(window).on("scroll", updateActiveNav);
    updateActiveNav();

    /* ==============================================
                   SMOOTH SCROLL
    ============================================== */
    $(".nav-link, .contact-btn, .btn-main, .btn-outline").on("click", function (e) {
        let target = $(this).attr("href");
        if (target && target.startsWith("#") && $(target).length) {
            e.preventDefault();
            $("html, body").animate({
                scrollTop: $(target).offset().top - 70
            }, 700);
            $(".navbar-collapse").removeClass("show");
        }
    });

    /* ==============================================
              IMPACT COUNTER ANIMATION
    ============================================== */
    let countersStarted = false;

    function animateImpactNumbers() {
        if (countersStarted || !$("#impact").length) return;

        let impactTop = $("#impact").offset().top;
        let scroll = $(window).scrollTop();
        let winHeight = $(window).height();

        if (scroll + winHeight > impactTop + 120) {
            countersStarted = true;

            $(".impact-card strong").each(function () {
                let text = $(this).text().trim();
                let isPercent = text.includes("%");
                let isPlus = text.includes("+");
                let endVal = parseInt(text.replace(/[^0-9]/g, ""));
                let $el = $(this);

                $({ count: 0 }).animate({ count: endVal }, {
                    duration: 1800,
                    easing: "swing",
                    step: function () {
                        let current = Math.floor(this.count);
                        if (isPercent) $el.text(current + "%");
                        else if (isPlus) $el.text(current + "+");
                        else $el.text(current);
                    },
                    complete: function () {
                        if (isPercent) $el.text(endVal + "%");
                        else if (isPlus) $el.text(endVal + "+");
                        else $el.text(endVal);
                    }
                });
            });
        }
    }

    $(window).on("scroll", animateImpactNumbers);
    animateImpactNumbers();

    /* ==============================================
                    BACK TO TOP
    ============================================== */
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 500) {
            $("#backTop").addClass("show");
        } else {
            $("#backTop").removeClass("show");
        }
    });

    $("#backTop").click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
    });

    /* ==============================================
                    CONTACT FORM
    ============================================== */
    $("#contactForm").on("submit", function (e) {
        e.preventDefault();
        let button = $(this).find(".send-button");
        let originalText = button.html();

        button.html('<i class="bi bi-check-circle"></i> Message Sent!');
        button.css({ "background": "#198754" });

        setTimeout(function () {
            button.html(originalText);
            button.css({ "background": "" });
        }, 3000);

        this.reset();
    });

});

/* =========================================================
   PURE FRONTEND INTERACTIVE BIN CLICK FEEDBACK
========================================================= */
function triggerBinAnimation(binType) {
    const bin = document.querySelector('.waste-bin.' + binType);
    if (!bin) return;

    bin.style.transform = 'translateY(-16px) scale(1.12)';
    bin.style.filter = 'brightness(1.3) drop-shadow(0 10px 15px rgba(37,199,111,0.4))';

    setTimeout(() => {
        bin.style.transform = '';
        bin.style.filter = '';
    }, 450);
}

/* =========================================================
   SMARTWASTE — COMPARISON GRAPHS
========================================================= */
(function () {

    function createChartCanvas(card) {
        let container = card.querySelector(".graph-container");
        if (!container) {
            container = document.createElement("div");
            container.className = "graph-container";
            const note = card.querySelector(".graph-note");
            if (note) {
                card.insertBefore(container, note);
            } else {
                card.appendChild(container);
            }
        }

        let canvas = container.querySelector("canvas");
        if (!canvas) {
            canvas = document.createElement("canvas");
            container.appendChild(canvas);
        }
        return canvas;
    }

    function buildCharts() {
        if (typeof Chart === "undefined") {
            console.warn("Chart.js is not loaded.");
            return;
        }

        const cards = Array.from(document.querySelectorAll(".graph-card"));
        if (!cards.length) return;

        /* GRAPH 1 — SEGREGATION EFFICIENCY */
        const card1 = cards.find(card => card.innerText.includes("Segregation Efficiency"));
        if (card1) {
            const canvas = createChartCanvas(card1);
            new Chart(canvas, {
                type: "line",
                data: {
                    labels: ["Past", "Present", "Future"],
                    datasets: [{
                        label: "Segregation Efficiency (%)",
                        data: [42, 68, 92],
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        backgroundColor: "rgba(37,199,111,0.12)",
                        borderColor: "#25c76f",
                        pointBackgroundColor: "#198754",
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { callback: value => value + "%" }
                        }
                    }
                }
            });
        }

        /* GRAPH 2 — MANUAL EFFORT */
        const card2 = cards.find(card => card.innerText.includes("Manual Effort Reduction"));
        if (card2) {
            const canvas = createChartCanvas(card2);
            new Chart(canvas, {
                type: "bar",
                data: {
                    labels: ["Past", "Present", "Future"],
                    datasets: [{
                        label: "Manual Effort",
                        data: [100, 65, 25],
                        borderRadius: 10,
                        backgroundColor: ["#c9b8a4", "#70a9d8", "#25c76f"]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { callback: value => value + "%" }
                        }
                    }
                }
            });
        }

        /* GRAPH 3 — RECYCLING POTENTIAL */
        const card3 = cards.find(card => card.innerText.includes("Recycling Potential"));
        if (card3) {
            const canvas = createChartCanvas(card3);
            new Chart(canvas, {
                type: "doughnut",
                data: {
                    labels: ["Recoverable", "Non-recoverable"],
                    datasets: [{
                        data: [78, 22],
                        backgroundColor: ["#25c76f", "#e8dfce"],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "68%",
                    plugins: {
                        legend: { position: "bottom" }
                    }
                }
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildCharts);
    } else {
        buildCharts();
    }

})();
