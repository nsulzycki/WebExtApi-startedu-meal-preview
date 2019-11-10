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
  const hosting = "https://bsacharski.github.io/startedu-meal-preview";

  const init = () => {
      registerStyle();
      addSourceJson();
      addPreviewNode();
  };

  const addSourceJson = () => {
    const scriptElement = document.createElement("script");
    scriptElement.src = `${hosting}/previews.js`;
    scriptElement.id = "mealManifest";
    scriptElement.type = "text/javascript";
    document.body.append(scriptElement);

    scriptElement.addEventListener("load", () => {
      window.setInterval(processMeals, intervalTimeout);
    });


  };

  const addPreviewNode = () => {
    const previewNode = document.createElement("img");
    previewNode.id = "meal-preview-img";

    previewNode.addEventListener("dblclick", () => {
      previewNode.classList.remove("meal-preview-full");
    });

    document.body.append(previewNode);
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

      const mealName = parentElement.innerText.toLowerCase();
      appendImageToNode(allergenInfo, mealName);
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

      img.addEventListener("dblclick", () => {
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

  const registerStyle = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      #meal-preview-img {
        display: none;
      }

      .meal-preview-full {
        display: initial !important;
        left: 50%;
        position: fixed;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 50vw;
        z-index: 10000;
      }
    `;

    document.body.appendChild(style);
  };

  window.onload = init();
})();
