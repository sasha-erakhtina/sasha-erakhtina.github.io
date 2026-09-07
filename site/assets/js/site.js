/* Sticky bar, scroll-spy, email assembly. No dependencies. */

(function () {

  /* --- email: assembled in the browser so scrapers get nothing --- */
  var user = "aleksandra.erakhtina";
  var host = "uts.edu.au";
  var address = user + "@" + host;

  document.querySelectorAll("[data-mail]").forEach(function (el) {
    var a = document.createElement("a");
    a.href = "mailto:" + address;
    a.innerHTML = el.getAttribute("data-mail") === "icon" ? el.innerHTML : address;
    if (el.getAttribute("data-mail") === "icon") {
      a.setAttribute("aria-label", "Email");
      a.className = el.className;
    }
    el.replaceWith(a);
  });

  /* --- sticky bar appears once the masthead has scrolled past --- */
  var bar = document.querySelector(".topbar");
  var masthead = document.querySelector(".masthead");

  if (bar && masthead && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      bar.classList.toggle("is-visible", !entries[0].isIntersecting);
    }, { rootMargin: "-40px 0px 0px 0px" }).observe(masthead);
  }

  /* --- scroll-spy: mark the section you are reading --- */
  var sections = Array.prototype.slice.call(document.querySelectorAll(".section[id]"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));

  if (sections.length && links.length && "IntersectionObserver" in window) {
    var seen = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = null, bestRatio = 0;
      sections.forEach(function (s) {
        if ((seen[s.id] || 0) > bestRatio) { bestRatio = seen[s.id]; best = s.id; }
      });
      links.forEach(function (a) {
        a.classList.toggle("is-active", best !== null && a.getAttribute("href") === "#" + best);
      });
    }, { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] });

    sections.forEach(function (s) { spy.observe(s); });
  }

})();
