// ==UserScript==
// @name         StartEdu Meal preview
// @namespace    cementownia.org
// @version      0.2
// @description  Just show me what my meal is going to look like
// @author       Bartłomiej Sacharski <bartlomiej@cementownia.org>
// @match        https://startedu.pl/*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";
  const intervalTimeout = 500;
  const hosting = "https://bsacharski.github.io/startedu-meals";
  const imageData = "https://bsacharski.github.io/startedu-meals";

  const init = () => {
    addSourceJson();
    addPreviewNode();
  };

  const addSourceJson = () => {
    const scriptElement = document.createElement("script");
    scriptElement.src = `${imageData}/previews.js`;
    scriptElement.id = "mealManifest";
    scriptElement.type = "text/javascript";
    document.body.appendChild(scriptElement);

    scriptElement.addEventListener("load", () => {
      window.setInterval(processMeals, intervalTimeout);
    });
  };

  const addPreviewNode = () => {
    const previewNode = document.createElement("img");
    previewNode.id = "meal-preview-img";

    previewNode.addEventListener("click", () => {
      previewNode.classList.remove("meal-preview-full");
    });

    document.body.append(previewNode);
  };

  const extraxtMealName = parentElement => {
    const textContent = parentElement.childNodes[0].textContent;
    const mealName = textContent.trim().toLowerCase();
    return mealName;
  };

  const processMeals = () => {
    const allergenInfoNodes = document.querySelectorAll(
      "div.allergen-info:not([preview-status])"
    );
    allergenInfoNodes.forEach(allergenInfo => {
      allergenInfo.setAttribute("preview-status", true);
      const parentElement = allergenInfo.parentElement;

      if (parentElement.classList.contains("allergens-legend")) {
        return;
      }

      if (parentElement.childNodes.length) {
        const mealName = extraxtMealName(parentElement);
        appendImageToNode(allergenInfo, mealName);
      }
    });
  };

  const getImages = mealName => {
    if (typeof window.mealData.meals[mealName] !== "undefined") {
      return window.mealData.meals[mealName];
    } else {
      return [];
    }
  };

  const appendImageToNode = (parentElement, mealName) => {
    getImages(mealName).forEach(mealImageData => {
      const { fullImage, thumb } = mealImageData;
      const img = document.createElement("img");

      img.addEventListener("click", () => {
        const imgPreviewNode = document.querySelector("#meal-preview-img");
        imgPreviewNode.src = `${hosting}/${fullImage}`;
        imgPreviewNode.classList.add("meal-preview-full");
      });

      img.addEventListener("error", () => {
        parentElement.removeChild(img);
      });

      img.classList.add("meal-preview");
      img.src = `${hosting}/${thumb}`;

      parentElement.appendChild(img);
    });
  };

  init();
})();
