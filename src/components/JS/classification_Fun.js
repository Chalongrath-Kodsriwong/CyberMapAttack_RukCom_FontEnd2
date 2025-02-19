import $ from 'jquery';

let isHidden = true; // Tracks visibility of container-item
let isAnimating = false; // Prevents repeated animations during a single click

function getResponsiveMarginTopOFClassification() {
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

function getResponsiveColorOFClassification() {
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





export const setupClassificationAnimation = () => {
  $(".Classification").click(function (e) {
    // ตรวจสอบว่าคลิกที่ปุ่ม .btnOfSwitch หรือไม่
    if ($(e.target).hasClass("btnOfSwitch")) {
      return; // ไม่ทำงาน animation ถ้าคลิกที่ปุ่ม
    }

    if (isAnimating) return; // Prevent additional clicks during animation
    isAnimating = true;

    const marginTopValue = getResponsiveMarginTopOFClassification();

    const color_respon = getResponsiveColorOFClassification();

    if (isHidden) {
      // Hide container-item and move Classification down
      $(".Classification").css({
        outline: color_respon
      })
      $(".container-item").animate(
        {
          marginBottom: "-100px",
          opacity: 0,
        },
        100,
        () => {
          isAnimating = false;
        }
      );
      $(".Classification").animate(
        {
          marginTop: marginTopValue,
        },
        100
      );
      $(".Arrow1").css({
        transform: "rotate(-180deg)",
      });
    } else {
      $(".Classification").css({
        outline: color_respon
      })
      // Show container-item and move Classification up
      $(".container-item").animate(
        {
          marginBottom: "0px",
          opacity: 1,
        },
        10,
        () => {
          isAnimating = false;
        }
      );
      $(".Classification").animate(
        {
          marginTop: "0px",
        },
        100
      );
      $(".Arrow1").css({
        transform: "rotate(0deg)",
      });
    }

    isHidden = !isHidden; // Toggle visibility state
  });

  $(".Classification").mouseenter(function () {
    $(".Arrow1").css({ color: "#00bcd4" });
  });

  $(".Classification").mouseleave(function () {
    $(".Arrow1").css({ color: "" });
  });
};
