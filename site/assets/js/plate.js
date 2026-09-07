/* Pan-and-zoom viewer for the archival plate. No dependencies. */

(function () {
  var trigger = document.querySelector("[data-plate-open]");
  if (!trigger) return;

  var viewer, img, scaleLabel;
  var scale = 1, minScale = 1, maxScale = 8;
  var tx = 0, ty = 0;
  var dragging = false, lastX = 0, lastY = 0;
  var lastFocus = null;

  function build() {
    viewer = document.createElement("div");
    viewer.className = "viewer";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "The City of Sydney, 1888 — full plate");
    viewer.innerHTML =
      '<img class="viewer__img" alt="Bird\'s-eye lithograph of Sydney, 1888, shown at full size" src="' +
      trigger.getAttribute("data-plate-src") + '">' +
      '<button class="viewer__btn viewer__close" type="button" data-act="close">Close</button>' +
      '<div class="viewer__bar">' +
        '<span>M. S. Hill, <em>The City of Sydney</em>, 1888 &nbsp;·&nbsp; drag to pan, scroll to zoom</span>' +
        '<span class="viewer__controls">' +
          '<button class="viewer__btn" type="button" data-act="out">&minus;</button>' +
          '<button class="viewer__btn" type="button" data-act="fit">Fit</button>' +
          '<button class="viewer__btn" type="button" data-act="in">+</button>' +
          '<span class="viewer__btn" data-scale>100%</span>' +
        '</span>' +
      '</div>';
    document.body.appendChild(viewer);
    img = viewer.querySelector(".viewer__img");
    scaleLabel = viewer.querySelector("[data-scale]");
    wire();
  }

  function apply() {
    img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
    scaleLabel.textContent = Math.round((scale / minScale) * 100) + "%";
  }

  function fit() {
    var w = img.naturalWidth, h = img.naturalHeight;
    if (!w) return;
    minScale = Math.min(window.innerWidth / w, (window.innerHeight - 60) / h);
    scale = minScale;
    tx = (window.innerWidth - w * scale) / 2;
    ty = (window.innerHeight - 60 - h * scale) / 2;
    apply();
  }

  function zoomAt(factor, cx, cy) {
    var next = Math.min(maxScale * minScale, Math.max(minScale, scale * factor));
    if (next === scale) return;
    tx = cx - (cx - tx) * (next / scale);
    ty = cy - (cy - ty) * (next / scale);
    scale = next;
    apply();
  }

  function open() {
    lastFocus = document.activeElement;
    if (!viewer) build();
    viewer.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (img.complete) fit(); else img.onload = fit;
    viewer.querySelector('[data-act="close"]').focus();
  }

  function close() {
    viewer.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  function wire() {
    viewer.addEventListener("click", function (e) {
      var act = e.target.getAttribute && e.target.getAttribute("data-act");
      if (act === "close") close();
      if (act === "fit") fit();
      if (act === "in") zoomAt(1.4, window.innerWidth / 2, window.innerHeight / 2);
      if (act === "out") zoomAt(1 / 1.4, window.innerWidth / 2, window.innerHeight / 2);
    });

    viewer.addEventListener("wheel", function (e) {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
    }, { passive: false });

    viewer.addEventListener("pointerdown", function (e) {
      if (e.target.tagName === "BUTTON") return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      viewer.classList.add("is-dragging");
      viewer.setPointerCapture(e.pointerId);
    });

    viewer.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      tx += e.clientX - lastX;
      ty += e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      apply();
    });

    ["pointerup", "pointercancel"].forEach(function (ev) {
      viewer.addEventListener(ev, function () {
        dragging = false;
        viewer.classList.remove("is-dragging");
      });
    });

    viewer.addEventListener("dblclick", function (e) {
      zoomAt(1.8, e.clientX, e.clientY);
    });

    window.addEventListener("resize", function () {
      if (viewer.classList.contains("is-open")) fit();
    });

    document.addEventListener("keydown", function (e) {
      if (!viewer.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") zoomAt(1.4, window.innerWidth / 2, window.innerHeight / 2);
      if (e.key === "-") zoomAt(1 / 1.4, window.innerWidth / 2, window.innerHeight / 2);
      if (e.key === "0") fit();
    });
  }

  trigger.addEventListener("click", function (e) {
    e.preventDefault();
    open();
  });
})();
