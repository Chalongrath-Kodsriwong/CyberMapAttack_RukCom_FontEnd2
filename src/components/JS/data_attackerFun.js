import $ from 'jquery';

let isHiddens = true; // Tracks visibility of tableContainer
let isAnimatings = false; // Prevents repeated animations during a single click

function getResponsiveMarginTopOFDataAttack() {
  const width = window.innerWidth;

  if (width > 2560) {
    return "400px"; // สำหรับหน้าจอที่ใหญ่กว่า 2560px
  } else if (width > 2400 && width <= 2560) {
    return "365px"; // สำหรับหน้าจอ 2401px ถึง 2560px
  } else if (width > 2200 && width <= 2400) {
    return "330px"; // สำหรับหน้าจอ 2201px ถึง 2400px
  } else if (width > 1920 && width <= 2200) {
    return "280px"; // สำหรับหน้าจอ 1921px ถึง 2200px
  } else if (width >= 1800 && width < 1920) {
    return "230px"; // สำหรับหน้าจอ 1800px ถึง 1919px
  } else if (width >= 1700 && width < 1800) {
    return "235px"; // สำหรับหน้าจอ 1700px ถึง 1799px
  } else if (width >= 1600 && width < 1700) {
    return "200px"; // สำหรับหน้าจอ 1600px ถึง 1699px
  } else if (width >= 1440 && width < 1600) {
    return "200px"; // สำหรับหน้าจอ 1440px ถึง 1599px
  } else if (width >= 1024 && width < 1440) {
    return "100px"; // สำหรับหน้าจอ 1024px ถึง 1439px
  } else if (width >= 768 && width < 1024) {
    return "50px"; // สำหรับแท็บเล็ต 768px ถึง 1023px
  } else if (width >= 480 && width < 768) {
    return "30px"; // สำหรับหน้าจอมือถือขนาดกลาง 480px ถึง 767px
  } else {
    return "250px"; // สำหรับหน้าจอขนาดเล็กกว่า 480px
  }
}

function getResponsiveColorOFDataAttack() {
  const width = window.innerWidth;

  if (width > 2560) {
    return "1px solid purple"; // สำหรับหน้าจอที่ใหญ่กว่า 2560px
  } else if (width > 2400 && width <= 2560) {
    return "1px solid red"; // สำหรับหน้าจอ 2401px ถึง 2560px
  } else if (width > 2200 && width <= 2400) {
    return "1px solid yellow"; // สำหรับหน้าจอ 2201px ถึง 2400px
  } else if (width > 1920 && width <= 2200) {
    return "1px solid pink"; // สำหรับหน้าจอ 1921px ถึง 2200px
  } else if (width >= 1800 && width < 1920) {
    return "1px solid blue"; // สำหรับหน้าจอ 1800px ถึง 1919px
  } else if (width >= 1700 && width < 1800) {
    return "1px solid yellow"; // สำหรับหน้าจอ 1700px ถึง 1799px
  } else if (width >= 1600 && width < 1700) {
    return "1px solid green"; // สำหรับหน้าจอ 1600px ถึง 1699px
  } else if (width >= 1440 && width < 1600) {
    return "1px solid grey"; // สำหรับหน้าจอ 1440px ถึง 1599px
  } else if (width >= 1024 && width < 1440) {
    return "1px solid white"; // สำหรับหน้าจอ 1024px ถึง 1439px
  } else if (width >= 768 && width < 1024) {
    return "1px solid green"; // สำหรับแท็บเล็ต 768px ถึง 1023px
  } else if (width >= 480 && width < 768) {
    return "1px solid purple"; // สำหรับหน้าจอมือถือขนาดกลาง 480px ถึง 767px
  } else {
    return "1px solid green"; // สำหรับหน้าจอขนาดเล็กกว่า 480px
  }
}


export const setupDataAttackerAnimation = () => {
  $(".DataAttacker_log").css({
    "z-index": "999",
    
  })
  $(".DataAttacker_log").click(function () {
    if (isAnimatings) return; // Prevent additional clicks during animation
    isAnimatings = true;

    const marginTopValue2 = getResponsiveMarginTopOFDataAttack(); // ค่าที่ปรับตามขนาดหน้าจอ

    const color_respon = getResponsiveColorOFDataAttack();

    if (isHiddens) {
      $(".DataAttacker_log").css({
        outline: color_respon
      });
      // Hide tableContainer and move DataAttacker_log down
      $(".tableContainer").animate(
        {
          marginBottom: "-100px",
          opacity: 0,
        },
        100, // Duration of 500ms
        () => {
          isAnimatings = false; // Allow new animation after completion
        }
      );
      $(".DataAttacker_log").animate(
        {
          marginTop: "0px",
        },
        100
      );
      $(".DataAttacker_log").css({
        "z-index": "999"
      })
      $(".bottom_right").animate(
        {
          marginTop: marginTopValue2,
        },
        100
      );
      $(".Arrow2").css({
        transform: "rotate(-180deg)",
      });
    } else {
      $(".DataAttacker_log").css({
        outline: color_respon
      });
      // Show tableContainer and move DataAttacker_log up
      $(".tableContainer").animate(
        {
          marginBottom: "0px",
          opacity: 1,
        },
        10, // Duration of 500ms
        () => {
          isAnimatings = false; // Allow new animation after completion
        }
      );
      $(".DataAttacker_log").animate(
        {
          marginTop: "0px",
        },
        100
      );
      $(".bottom_right").animate(
        {
          marginTop: "0px",
        },
        100
      );
      // Change Arrow rotation for visible state
      $(".Arrow2").css({
        transform: "rotate(0deg)",
      });
    }

    isHiddens = !isHiddens; // Toggle visibility state
  });
  $(".DataAttacker_log").mouseenter(function () {
    $(".Arrow2").css({
      color: "#00bcd4", // Optional: Change color on hover
    });
  });

  $(".DataAttacker_log").mouseleave(function () {
    $(".Arrow2").css({
      color: "", // Reset color on mouse leave
    });
  });
};
