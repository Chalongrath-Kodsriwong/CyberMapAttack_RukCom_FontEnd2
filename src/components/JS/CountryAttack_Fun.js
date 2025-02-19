import { transition } from 'd3';
import $ from 'jquery';

let isHidden = true; // Tracks visibility of container-item
let isAnimating = false; // Prevents repeated animations during a single click

function getResponsiveMarginTopOFClassification() {
  if (window.innerWidth >= 1920) {
    return "-380px"; // สำหรับหน้าจอ 1920px
  } else if (window.innerWidth == 1440) {
    return "-320px"; // สำหรับหน้าจอ 1440px
  } else {
    return "-380px"; // ค่ามาตรฐานสำหรับหน้าจออื่นๆ
  }
}

export const setupCountryAttackAnimation = () => {
  $(".btn_hideShow").click(function () {
    if (isAnimating) return; // Prevent additional clicks during animation
    isAnimating = true;

    const marginLeftValue = getResponsiveMarginTopOFClassification();

    if (isHidden) {
      // Hide container-item and move Classification down
      $(".leftsize").animate(
        {
          marginLeft: marginLeftValue,
        //   opacity: 1,
        },
        100,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
      $(".btn_hideShow").css({
        outline: "1px solid white"
      });
      $(".btn_hideShow").mouseenter(function () { 
        $(".Arrow3").css({
          display: "inline",
          transform: "rotate(-90deg)",
          opacity: "1",
          color: "#00bcd4"
        })
      });
      $(".btn_hideShow").mouseleave(function () { 
        $(".Arrow3").css({
          display: "none",
          opacity: "0"
        })
      });
    } else {
      // Show container-item and move Classification up
      $(".leftsize").animate(
        {
            marginLeft: "0px",
            // opacity: 1,
        },
        100,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
      $(".btn_hideShow").css({
        outline: "1px solid #1c1c1c"
      });
      $(".btn_hideShow").mouseenter(function () { 
        $(".Arrow3").css({
          display: "inline",
          transform: "rotate(90deg)",
          opacity: "1",
          color: "#00bcd4"
        })
      });
      $(".btn_hideShow").mouseleave(function () { 
        $(".Arrow3").css({
          display: "none",
          opacity: "0"
        })
      });
    }

    isHidden = !isHidden; // Toggle visibility state
  });
  
  
};
