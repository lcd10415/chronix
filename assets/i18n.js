(function (global) {
  var KEY = "chronix-lang";

  function detect() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === "zh" || saved === "en") return saved;
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || "zh").toLowerCase();
    return nav.indexOf("zh") === 0 ? "zh" : "en";
  }

  function get() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === "zh" || saved === "en") return saved;
    } catch (e) {}
    return detect();
  }

  function set(lang) {
    var next = lang === "en" ? "en" : "zh";
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
    return next;
  }

  function apply(dict, lang) {
    var pack = dict[lang] || dict.zh || {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (key && Object.prototype.hasOwnProperty.call(pack, key)) {
        el.textContent = pack[key];
      }
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-i18n-attr");
      if (!spec) return;
      spec.split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length < 2) return;
        var attr = parts[0].trim();
        var key = parts[1].trim();
        if (attr && key && Object.prototype.hasOwnProperty.call(pack, key)) {
          el.setAttribute(attr, pack[key]);
        }
      });
    });
    if (pack["meta.title"]) document.title = pack["meta.title"];
    var meta = document.querySelector('meta[name="description"]');
    if (meta && pack["meta.description"]) meta.setAttribute("content", pack["meta.description"]);
    document.documentElement.lang = lang === "en" ? "en" : "zh-Hans";
  }

  function bindToggle(root, onChange) {
    var scope = root || document;
    scope.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = set(btn.getAttribute("data-lang"));
        if (typeof onChange === "function") onChange(lang);
      });
    });
  }

  function syncToggle(lang, root) {
    var scope = root || document;
    scope.querySelectorAll("[data-lang]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", String(active));
      btn.classList.toggle("is-active", active);
    });
  }

  global.ChronixI18n = {
    key: KEY,
    detect: detect,
    get: get,
    set: set,
    apply: apply,
    bindToggle: bindToggle,
    syncToggle: syncToggle
  };
})(window);
