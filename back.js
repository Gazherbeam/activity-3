/*
	back.js
	Simple, easy-to-edit JS for:
	 - form validation (shows error messages, adds red border classes)
	 - tabs switching (updates the content area)

	Design notes:
	 - The script toggles Tailwind utility classes (e.g., 'border-red-500', 'ring-2', 'ring-red-200').
	 - To change visuals, edit classes in the HTML or modify the class names below.
*/

(function () {
  "use strict";

  // --------- Config / editable bits ---------
  const errorClasses = ["border-red-500", "ring-2", "ring-red-200"];
  const normalBorderClass = "border-gray-300";

  // Tab contents here — edit to add more content or rich HTML
  const tabData = {
    tab1: {
      title: "Tab 1",
      html: "<p>This is the default content for <strong>Tab 1</strong>. Edit <code>tabData</code> in <code>back.js</code> to change this.</p>",
    },
    tab2: {
      title: "Tab 2",
      html: "<p>Content for Tab 2. You can put any HTML here: lists, images, etc.</p>",
    },
    tab3: {
      title: "Tab 3",
      html: "<p>Content for Tab 3. Replace this text with your project info.</p>",
    },
  };
  // --------- End config ---------

  // Helper to add/remove classes array
  function addClasses(el, classes) {
    if (!el) return;
    classes.forEach((c) => el.classList.add(c));
  }
  function removeClasses(el, classes) {
    if (!el) return;
    classes.forEach((c) => el.classList.remove(c));
  }

  // Find elements
  const form = document.getElementById("contact-form");
  const successEl = document.getElementById("form-success");

  function getErrorEl(input) {
    return (
      document.querySelector(`.error-message[data-for="${input.id}"]`) ||
      document.querySelector(`[data-for="${input.id}"]`)
    );
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let hasError = false;
      const inputs = form.querySelectorAll("[data-required]");
      inputs.forEach((input) => {
        const errorEl = getErrorEl(input);
        const value = (input.value || "").trim();
        // clear previous
        removeClasses(input, errorClasses);
        if (errorEl) {
          errorEl.classList.add("hidden");
          errorEl.textContent = "";
        }

        if (!value) {
          hasError = true;
          addClasses(input, errorClasses);
          if (errorEl) {
            errorEl.textContent = "This field is required.";
            errorEl.classList.remove("hidden");
          }
          return;
        }

        // email check
        if (input.type === "email") {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(value)) {
            hasError = true;
            addClasses(input, errorClasses);
            if (errorEl) {
              errorEl.textContent = "Please enter a valid email address.";
              errorEl.classList.remove("hidden");
            }
          }
        }
      });

      if (!hasError) {
        // show success text briefly — easy to replace with other behavior
        if (successEl) {
          successEl.classList.remove("hidden");
          setTimeout(() => successEl.classList.add("hidden"), 2500);
        }
        form.reset();
      }
    });

    // remove error as user types
    form.addEventListener("input", function (e) {
      const target = e.target;
      if (!target || !target.matches("[data-required]")) return;
      const errorEl = getErrorEl(target);
      if (target.value.trim()) {
        removeClasses(target, errorClasses);
        if (errorEl) {
          this.scroll;
          errorEl.textContent = "";
          errorEl.classList.add("hidden");
        }
      }
    });
  }

  // Tabs
  const tabsContainer =
    document.querySelector(".tabs") ||
    document.querySelector('[role="tablist"]');
  const tabContent = document.getElementById("tab-content");
  const tabHeading = document.getElementById("tab-heading");
  const tabBody = document.getElementById("tab-body");

  function setActiveTab(key, btn) {
    if (!tabsContainer) return;
    const buttons = tabsContainer.querySelectorAll(".tab-btn");
    buttons.forEach((b) => {
      if (b === btn) {
        b.classList.remove("bg-gray-100", "text-gray-700");
        b.classList.add("bg-indigo-600", "text-white");
        b.setAttribute("aria-selected", "true");
      } else {
        b.classList.remove("bg-indigo-600", "text-white");
        b.classList.add("bg-gray-100", "text-gray-700");
        b.setAttribute("aria-selected", "false");
      }
    });

    const data = tabData[key] || {
      title: key,
      html: "<p>No content configured</p>",
    };
    if (tabHeading) tabHeading.textContent = data.title;
    if (tabBody) tabBody.innerHTML = data.html;
  }

  if (tabsContainer) {
    tabsContainer.addEventListener("click", function (e) {
      const btn = e.target.closest(".tab-btn");
      if (!btn) return;
      const key = btn.getAttribute("data-tab");
      setActiveTab(key, btn);
    });
  }

  // make a tiny global helper for DevTools
  window.backDebug = function () {
    console.log("back.js debug", { form: !!form, tabs: !!tabsContainer });
  };
})();
