import $ from 'jquery';

const marker = document.querySelector("#marker-circle");
const bg_text = document.querySelector("#bg_textLo");
const textLo = document.querySelector("#text_Lo");

export const setupMapAnimation = () => {
    // Apply hover effect on dynamically created elements
    $(document).on("mouseenter", ".bg_textLo", function () {
      $(this).css({
        border: "1px solid red",
      });
    });
  
    $(document).on("mouseleave", ".bg_textLo", function () {
      $(this).css({
        border: "none",
      });
    });
  };
  