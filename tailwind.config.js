/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "purple-gradient":
          "linear-gradient(to top right, #140B37 0%, #260B42 53%, #74189D 100%)",
        "light-purple-gradient":
          "linear-gradient(to right, #6D2BE1 0%,  #9F5DE9 100%)",
        "auth-bg-purple":
          "linear-gradient(to bottom left, #0F1329 0%, #0F1329 20%, #1D174D 100%)",
        "pink-gradient": "linear-gradient(to right, #6D2BE1 0%,  #9F5DE9 100%)",
        "pink-gradient-vertical":
          "linear-gradient(to bottom, #6D2BE1 0%,  #9F5DE9 100%)",
      },
      backgroundColor: {
        "bluish-gray": "#F8FAFF",
        "light-blue": "#F1F6FD",
        "light-gray": "#F4F4F4",
        "dark-gray": "#3F4141",
        "light-purple": "#E4D7F9",
        "light-gray-10": "#EAECF4",
        "light-gray-20": "#F7F9FF",
        disabled: "#F1F1F1",
        "table-header": "#F2F4FC",
        "detail-circle": "#F6F8FC",
        "chip-red": "#FEDBDB",
        "chip-green": "#f2f7f4",
        "chip-blue": "#f2f4f7",
      },
      borderColor: {
        purple: "#3D1554",
        "purple-100": "rgba(119, 53, 227, 1)",
        gray: "#9D9D9D",
        "light-gray": "#D9D9D9",
        "light-purple": "#D2D2EB",
        "error-dark": "#B00020",
        "placeholder-gray": "#BEBEBE",
        "table-gray": "#DCDCE3",
      },
      borderRadius: {
        large: "12px",
        medium: "8px",
        small: "4px",
      },
      fontFamily: {
        sans: ["Barlow", "sans-serif"],
      },
      fontSize: {
        h1: ["48px", "1.2"],
        h2: ["36px", "1.2"],
        h3: ["32px", "1.2"],
        "h3.5": ["28px", "1.2"],
        h4: ["26px", "1.2"],
        h5: ["24px", "1.2"],
        p120: ["20px", "1.5"],
        p16: ["16px", "1.5"],
        caption: ["14px", "1.5"],
        subtitle: ["12px", "1.2"],
        button: ["18px", "1.5"],
        input: ["15px", "1.2"],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        7: "28px",
        8: "32px",
        9: "36px",
        10: "40px",
        12: "48px",
        14: "56px",
        16: "64px",
        20: "80px",
        24: "96px",
        28: "112px",
        32: "128px",
      },
      boxShadow: {
        "shadow-1": "0 1px 2px 0 rgba(0, 0, 0, 0.07)",
        "shadow-2":
          "0 1px 3px 0 rgba(0, 0, 0, 0.1) , 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "shadow-3":
          "0 2px 5px 0 rgba(0, 0, 0, 0.06) ,0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        "shadow-4":
          "0 4px 6px -2px rgba(0, 0, 0, 0.06),0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        "shadow-5":
          "0 10px 10px -5px rgba(0, 0, 0, 0.06),0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        "shadow-6":
          "0 4px 6px -2px rgba(0, 0, 0, 0.06),0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "shadow-inner": "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
      },

      colors: {
        purple: {
          10: "rgba(119, 53, 227, 0.1)", // 10% opacity
          20: "rgba(119, 53, 227, 0.2)", // 20% opacity
          30: "rgba(119, 53, 227, 0.3)", // 30% opacity
          40: "rgba(119, 53, 227, 0.4)", // 40% opacity
          50: "rgba(119, 53, 227, 0.5)", // 50% opacity
          60: "rgba(119, 53, 227, 0.6)", // 60% opacity
          70: "rgba(119, 53, 227, 0.7)", // 70% opacity
          80: "rgba(119, 53, 227, 0.8)", // 80% opacity
          90: "rgba(119, 53, 227, 0.9)", // 90% opacity
          100: "rgba(119, 53, 227, 1)", // 100% opacity (fully opaque)
        },
        green: {
          10: "rgba(54, 187, 145, 0.1)",
          20: "rgba(54, 187, 145, 0.2)",
          30: "rgba(54, 187, 145, 0.3)",
          40: "rgba(54, 187, 145, 0.4)",
          50: "rgba(54, 187, 145, 0.5)",
          60: "rgba(54, 187, 145, 0.6)",
          70: "rgba(54, 187, 145, 0.7)",
          80: "rgba(54, 187, 145, 0.8)",
          90: "rgba(54, 187, 145, 0.9)",
          100: "rgba(54, 187, 145, 1)",
        },
        black: {
          10: "rgba(31, 36, 59, 0.1)",
          20: "rgba(31, 36, 59, 0.2)",
          30: "rgba(31, 36, 59, 0.3)",
          40: "rgba(31, 36, 59, 0.4)",
          50: "rgba(31, 36, 59, 0.5)",
          60: "rgba(31, 36, 59, 0.6)",
          70: "rgba(31, 36, 59, 0.7)",
          80: "rgba(31, 36, 59, 0.8)",
          90: "rgba(31, 36, 59, 0.9)",
          100: "rgba(31, 36, 59, 1)",
        },
        blackGrey: {
          10: "#FAFAFA",
          20: "#F5F5F5",
          30: "#EEEEEE",
          40: "#E0E0E0",
          50: "#BDBDBD",
          60: "#9E9E9E",
          70: "#757575",
          80: "#616161",
          90: "#424242",
          100: "#212121",
          icon: "#A9A9A9",
          "filled-input": "#F9F9F9",
          placeholder: "#BEBEBE",
        },
        red: {
          "error-dark": "#B00020",
          chip: "#AC0606",
        },
        yellow: {
          "light": "#AC8B06",
          "dull": "#8E7200",
          "chip-dull": "#f8f7f0",
          "chip-light": "#FFFCF1",
        },
        green: {
          chip: "#29824C",
        },
        blue: {
          label: "#01579B",
          info: "#0172F5",
          chip: "#294A82",
        },
        custom: {
          "caption-gray": "#959595",
          "title-gray": "#555659",
        },
      },
    },
    screens: {
      xs: "480px", // Custom extra small breakpoint
      sm: "640px", // Small breakpoint (default)
      md: "768px", // Medium breakpoint (default)
      lg: "1050px", // Large breakpoint (default)
      xl: "1280px", // Extra large breakpoint (default)
      "2xl": "1324px", // 2x large breakpoint (default)
      "3xl": "1536px", // 2x large breakpoint (default)
      "4xl": "1920px", // Custom extra large breakpoint
    },
  },
  plugins: [require("tailwindcss-animate")],
};
