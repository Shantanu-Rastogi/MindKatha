/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "tertiary-fixed-dim": "#b4cad6",
        "secondary": "#266293",
        "on-primary": "#ffffff",
        "tertiary-fixed": "#d0e6f2",
        "surface-variant": "#dde4e7",
        "on-primary-container": "#95d7fb",
        "primary-container": "#085f7e",
        "on-surface": "#161d1f",
        "surface-bright": "#f4fafe",
        "on-primary-fixed-variant": "#004d67",
        "on-background": "#161d1f",
        "on-secondary-fixed": "#001d34",
        "secondary-fixed": "#cfe5ff",
        "surface-dim": "#d4dbdf",
        "on-secondary-container": "#105484",
        "on-error-container": "#93000a",
        "secondary-container": "#93c8ff",
        "primary": "#00465f",
        "on-secondary": "#ffffff",
        "on-tertiary-container": "#bcd2de",
        "error": "#ba1a1a",
        "surface-container-low": "#eef5f8",
        "inverse-surface": "#2a3134",
        "inverse-on-surface": "#ebf2f5",
        "outline": "#70787e",
        "surface-container-lowest": "#ffffff",
        "on-error": "#ffffff",
        "primary-fixed": "#c1e8ff",
        "inverse-primary": "#8dcff2",
        "error-container": "#ffdad6",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed-variant": "#004a78",
        "outline-variant": "#bfc8ce",
        "surface-container": "#e8eff3",
        "on-primary-fixed": "#001e2b",
        "background": "#f4fafe",
        "surface-container-highest": "#dde4e7",
        "surface-tint": "#166585",
        "on-tertiary-fixed-variant": "#354a54",
        "on-tertiary-fixed": "#081e27",
        "on-surface-variant": "#40484d",
        "tertiary": "#2f434d",
        "surface": "#f4fafe",
        "primary-fixed-dim": "#8dcff2",
        "surface-container-high": "#e2e9ed",
        "tertiary-container": "#465b65",
        "secondary-fixed-dim": "#99cbff"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "24px",
        "baseline": "4px",
        "margin-desktop": "64px",
        "margin-mobile": "16px",
        "container-max": "1200px"
      },
      fontFamily: {
        "headline-lg": ["Outfit"],
        "body-lg": ["Outfit"],
        "label-md": ["Outfit"],
        "label-sm": ["Outfit"],
        "body-md": ["Outfit"],
        "headline-lg-mobile": ["Outfit"],
        "headline-xl": ["Outfit"],
        "headline-md": ["Outfit"]
      },
      fontSize: {
        "headline-lg": ["32px", { "lineHeight": "1.25", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-md": ["14px", { "lineHeight": "1.4", "letterSpacing": "0.01em", "fontWeight": "500" }],
        "label-sm": ["12px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "headline-xl": ["40px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
        "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "500" }]
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center"
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center"
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
