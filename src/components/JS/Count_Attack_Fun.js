import { transition } from 'd3';
import $ from 'jquery';

let isHidden = true; // Tracks visibility of container-item
let isAnimating = false; // Prevents repeated animations during a single click

const btnShowHide = $(".btn-showhide");
const Arrow = $(".arrow");

let status = true;

export const setupCountAttackAnimation = () => {
  $(".btn-showhide").click(function () {
    if (isAnimating) return; // Prevent additional clicks during animation
    isAnimating = true;

    if (isHidden) {
      // Hide container-item and move Classification down
      $(".toleftsize").animate(
        {
          marginLeft: "-250px",
        //   opacity: 1,
        },
        100,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
      $(".btn-showhide").mouseenter(function () { 
        $(".arrow").css({
          display: "inline",
          transform: "rotate(-90deg)",
          opacity: "1",
          color: "#00bcd4"
        })
      });
      $(".btn-showhide").mouseleave(function () { 
        $(".arrow").css({
          display: "none",
          opacity: "0"
        })
      });
    } else {
      // Show container-item and move Classification up
      $(".toleftsize").animate(
        {
            marginLeft: "0px",
            // opacity: 1,
        },
        100,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
      $(".btn-showhide").mouseenter(function () { 
        $(".arrow").css({
          display: "inline",
          transform: "rotate(90deg)",
          opacity: "1",
          color: "#00bcd4"
        })
      });
      $(".btn-showhide").mouseleave(function () { 
        $(".arrow").css({
          display: "none",
          opacity: "0"
        })
      });
    }

    isHidden = !isHidden; // Toggle visibility state
  });
  
  
};
