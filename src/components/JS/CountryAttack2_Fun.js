import { transition } from 'd3';
import $ from 'jquery';

let isHidden = true; // Tracks visibility of container-item
let isAnimating = false; // Prevents repeated animations during a single click

function getResponsiveMarginTopOFClassification() {
  if (window.innerWidth >= 1920) {
    return "-480px"; // สำหรับหน้าจอ 1920px
  } else if (window.innerWidth == 1440) {
    return "-320px"; // สำหรับหน้าจอ 1440px
  } else {
    return "-377px"; // ค่ามาตรฐานสำหรับหน้าจออื่นๆ
  }
}

export const setupCountryAttack2Animation = () => {
  $(".btn_hideShow2").click(function () {
    if (isAnimating) return; // Prevent additional clicks during animation
    isAnimating = true;

    const marginLeftValue = getResponsiveMarginTopOFClassification();

    if (isHidden) {
      // Hide container-item and move Classification down
      $(".rightsize").animate(
        {
          marginRight: "-377px",
        //   opacity: 1,
        },
        100,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
      $(".btn_hideShow2").css({
        outline: "1px solid white"
      });
      $(".btn_hideShow2").mouseenter(function () { 
        $(".Arrow2").css({
          display: "inline",
          transform: "rotate(-90deg)",
          opacity: "1",
          color: "#00bcd4"
        })
      });
      $(".btn_hideShow2").mouseleave(function () { 
        $(".Arrow2").css({
          display: "none",
          opacity: "0"
        })
      });
    } else {
      // Show container-item and move Classification up
      $(".rightsize").animate(
        {
            marginRight: "0px",
            // opacity: 1,
        },
        100,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
      $(".btn_hideShow2").css({
        outline: "1px solid #1c1c1c"
      });
      $(".btn_hideShow2").mouseenter(function () { 
        $(".Arrow2").css({
          display: "inline",
          transform: "rotate(90deg)",
          opacity: "1",
          color: "#00bcd4"
        })
      });
      $(".btn_hideShow2").mouseleave(function () { 
        $(".Arrow2").css({
          display: "none",
          opacity: "0"
        })
      });
    }

    isHidden = !isHidden; // Toggle visibility state
  });
  
  
};
