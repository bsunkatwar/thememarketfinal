const productDetails = [
  {
    id: 1,
    title: "Kalium - Creative Theme",
    price: 49,
    image: "assets/image/kalium.jpeg",
    previewUrl: "https://kalium.qodeinteractive.com/",
    demoUrl: "https://kalium-demo.qodeinteractive.com/",
    shortDescription: "A sleek, modern SaaS dashboard theme built for analytics-heavy applications. Clean data visualizations, dark/light mode support, and 40+ pre-built components.",
    fullDescription: "Kalium is a comprehensive SaaS dashboard theme engineered for teams that live inside their analytics tools. Every component has been stress-tested against real-world data scenarios — from sparse datasets to tables with thousands of rows.\n\nBuilt on Bootstrap 5 with a fully documented component library, Kalium ships with 40+ UI components, 8 complete page templates (overview, reports, user management, billing, settings, and more), and a powerful theming system driven by CSS custom properties.\n\nDark mode is a first-class citizen — not an afterthought. Toggle it system-wide or let users choose. Color contrast ratios meet WCAG AA across both themes.\n\nThe chart library integration (Chart.js + optional ApexCharts swap-in) is preconfigured with consistent color palettes, responsive breakpoints, and accessible tooltips. Drop in your data and get beautiful visuals immediately.\n\nKalium is actively maintained with quarterly updates, and every purchase includes lifetime access to future versions.",
    features: [
      "40+ production-ready UI components",
      "Dark & light mode with system preference detection",
      "8 complete page templates included",
      "Chart.js integration with accessible color palettes",
      "Responsive grid system for all screen sizes",
      "WCAG AA color contrast compliance",
      "Comprehensive CSS custom property theming",
      "RTL layout support out of the box",
      "Lifetime updates included with purchase",
      "Detailed documentation with live code examples"
    ]
  },
  {
    id: 2,
    title: "Avada - Business Theme",
    price: 35,
    image: "assets/image/avada.jpeg",
    previewUrl: "https://avada.theme-fusion.com/",
    demoUrl: "https://avada-demo.theme-fusion.com/",
    shortDescription: "A bold, editorial portfolio theme for designers and photographers. Fullscreen project showcases, smooth page transitions, and a minimal aesthetic that puts your work first.",
    fullDescription: "Avada is a portfolio theme built on one conviction: the work should be the hero. Every layout decision strips away decoration to create space that lets your projects breathe.\n\nThe fullscreen project gallery supports images, video embeds, Vimeo/YouTube autoplay, and mixed media grids. Lazy loading and next-gen image formats keep performance sharp even with large photography portfolios.\n\nPage transitions are handled by a lightweight custom router — no heavy libraries, just silky 300ms crossfades and slide animations that feel native. The result is a single-page-app feel with zero framework overhead.\n\nFolio ships with five distinct homepage layouts ranging from asymmetric editorial grids to clean minimal lists. Each is independently configurable through data attributes — no CSS overrides needed.\n\nTypography is set in a carefully selected editorial pairing with fluid type scaling via clamp(), so headlines look just as intentional on a 1440p monitor as on a 375px mobile screen.",
    features: [
      "5 homepage layout variants",
      "Fullscreen gallery with video support",
      "Smooth page transition system",
      "Fluid typography via CSS clamp()",
      "Lazy loading with blur-up placeholders",
      "Contact form with Formspree integration",
      "SEO-optimized semantic HTML structure",
      "Google Analytics 4 event tracking ready",
      "Customizable color palette via CSS variables",
      "Mobile-first responsive design"
    ]
  },
  {
    id: 3,
    title: "TheGem - Multi-Purpose",
    price: 69,
    image: "assets/image/2.png",
    previewUrl: "https://thegem.stylemixthemes.net/",
    demoUrl: "https://thegem-demo.stylemixthemes.net/",
    shortDescription: "A conversion-optimized eCommerce theme for modern online stores. Quick-view modals, smart filters, wishlist functionality, and a streamlined checkout flow — all frontend-ready.",
    fullDescription: "TheGem is a multi-purpose theme designed for a wide range of websites. It offers flexibility and ease of use with its extensive customization options and pre-built layouts.\n\nThe product listing page features a faceted filter system that updates results without page reload. It supports category, price range, rating, color swatch, and size filters simultaneously. Pagination is configurable between infinite scroll, load-more, and numbered pages via a single data attribute.\n\nProduct detail pages ship with a multi-image gallery with zoom-on-hover, variant selection (color + size with inventory-aware UI), sticky add-to-cart for long pages, and a related products carousel.\n\nThe cart experience lives in a slide-over drawer — no full page redirects. Quick checkout with address autocomplete (Google Places API ready), coupon code validation, and upsell slots.\n\nTheGem is backend-agnostic. All interactive features use vanilla JS with clearly defined data interfaces that connect cleanly to Shopify, WooCommerce, or custom APIs.",
    features: [
      "Faceted filter system with no-reload updates",
      "Product image gallery with zoom-on-hover",
      "Cart slide-over drawer",
      "Wishlist with localStorage persistence",
      "Quick-view product modal",
      "Sticky add-to-cart on scroll",
      "Size guide modal component",
      "Infinite scroll & paginated listing modes",
      "Backend-agnostic JS data interfaces",
      "Optimized for Core Web Vitals"
    ]
  },
  {
    id: 4,
    title: "Flatsome - eCommerce",
    price: 29,
    image: "assets/image/flats.jpeg",
    previewUrl: "https://flatsome.uxthemes.com/",
    demoUrl: "https://flatsome-demo.uxthemes.com/",
    shortDescription: "An editorial blog and magazine theme with a strong typographic voice. Multiple homepage layouts, reading progress indicator, estimated read time, and dark mode.",
    fullDescription: "Flatsome is a modern, responsive theme designed for e-commerce websites. It offers a clean, professional look with a focus on user experience and performance.\n\nThe homepage ships in three configurable layouts: a feature-lead layout with one hero story and a supporting grid, a magazine-style multi-column layout for high-volume publications, and a minimal chronological list for personal blogs.\n\nArticle pages include a reading progress indicator in the header, estimated read time, a floating table of contents for long pieces, syntax-highlighted code blocks, and pull quote styling. Social sharing uses the Web Share API with clipboard fallback.\n\nFlatsome integrates with any headless CMS through a documented JSON data schema. The sample data ships with 12 realistic articles across 4 categories, giving you a complete preview environment immediately after setup.",
    features: [
      "3 homepage layout configurations",
      "Reading progress indicator",
      "Estimated read time display",
      "Floating table of contents",
      "Syntax-highlighted code blocks",
      "Dark mode with smooth transition",
      "Web Share API social sharing",
      "Category & tag filtering system",
      "Newsletter signup component",
      "Headless CMS ready with JSON schema"
    ]
  },
  {
    id: 5,
    title: "Bridge - Business",
    price: 55,
    image: "assets/image/bridge.jpeg",
    previewUrl: "https://bridge.qodeinteractive.com/",
    demoUrl: "https://bridge-demo.qodeinteractive.com/",
    shortDescription: "A premium agency and studio theme with scroll-triggered animations, a project case study layout, and a refined aesthetic built to win enterprise clients.",
    fullDescription: "Bridge is a premium theme built for businesses, consultancies, and creative firms that need to make a strong first impression with enterprise clients. The visual language is refined and confident — not flashy, but unmistakably high-end.\n\nThe hero section uses a canvas-based particle system that responds to mouse movement, creating depth and interactivity without feeling gimmicky. Scroll-triggered animations are powered by IntersectionObserver — no GSAP dependency, no bundle bloat.\n\nThe services section supports icon-based cards, feature comparison tables, and a process timeline — all switchable via a layout prop. The case studies section has its own sub-template with a cover image, challenge/solution/outcome structure, and a metrics bar for highlighting KPIs.\n\nThe team section handles everything from solo founders to 50+ person firms with a responsive grid that reflows gracefully. Each team member card supports a bio overlay on hover.\n\nBridge ships with a fully functional contact form (Netlify Forms + Formspree compatible), a custom cursor, and smooth anchor-based navigation between sections.",
    features: [
      "Canvas particle hero with mouse interaction",
      "Scroll-triggered animations via IntersectionObserver",
      "Case study sub-template with metrics bar",
      "Services section with 3 layout modes",
      "Team grid with bio overlay on hover",
      "Custom cursor with magnetic buttons",
      "Smooth scroll anchor navigation",
      "Contact form (Netlify & Formspree ready)",
      "Project inquiry multi-step form",
      "Performance-first: no heavy animation libraries"
    ]
  
  },
  {
    id: 6,
    title: "Uncode - Creative",
    price: 39,
    image: "assets/image/theme5.jpeg",
    previewUrl: "https://uncode.undsgn.com/",
    demoUrl: "https://uncode-demo.undsgn.com/",
    shortDescription: "A high-converting startup landing page theme with A/B-ready hero variants, pricing tables, testimonial carousels, and an email capture flow optimized for growth.",
    fullDescription: "Uncode is a versatile creative theme designed for artists, designers, and creative professionals. It offers a clean, modern aesthetic with a focus on showcasing work effectively.\n\nThe theme includes a variety of layout options for displaying portfolios, galleries, and creative projects. The hero section is highly customizable, allowing for different visual approaches depending on the content.\n\nKey features include a responsive grid system, smooth animations, and seamless integration with popular plugins and services.",
    features: [
      "4 hero layout variants for A/B testing",
      "JS-configured pricing table with toggle",
      "Infinite logo ticker (CSS-only)",
      "Testimonial carousel with ratings",
      "Metrics/stats highlight bar",
      "Mailchimp & ConvertKit integration",
      "Multi-step onboarding flow component",
      "FAQ accordion with search",
      "Cookie consent banner component",
      "Optimized for Google PageSpeed 90+"
    ]
  },
  {
    id: 7,
    title: "Enfold - Multi-Purpose",
    price: 59,
    image: "assets/image/enfold.jpeg",
    previewUrl: "https://enfold.kriesi.de/",
    demoUrl: "https://enfold-demo.kriesi.de/",
    shortDescription: "A flexible multi-purpose theme with drag-and-drop builder for any type of website.",
    fullDescription: "Enfold is a flexible and versatile multi-purpose theme that can be used for any type of website. Built with a powerful drag-and-drop page builder, it allows you to create stunning layouts without any coding knowledge.\n\nThe theme comes with dozens of pre-built templates for various industries including business, portfolio, blog, eCommerce, and more. Each template can be imported with a single click and customized to match your brand.\n\nEnfold features a responsive design that looks great on all devices, from mobile phones to large desktop monitors. The theme is optimized for speed and performance, ensuring fast loading times and smooth user experience.\n\nWith extensive customization options, you can easily change colors, fonts, layouts, and more through the intuitive theme options panel. The built-in styling options give you complete control over every aspect of your site's appearance.",
    features: [
      "Drag-and-drop page builder included",
      "50+ pre-built website templates",
      "Fully responsive design",
      "Optimized for speed and performance",
      "Advanced theme options panel",
      "WooCommerce compatibility",
      "SEO optimized code structure",
      "Regular updates and improvements",
      "Premium support included",
      "Extensive documentation"
    ]
  },
  {
    id: 8,
    title: "Chen - Blog & Magazine",
    price: 49,
    image: "assets/image/chen.jpeg",
    previewUrl: "https://chen-demo.qodeinteractive.com/",
    demoUrl: "https://chen-demo.qodeinteractive.com/",
    shortDescription: "A modern blog theme with clean typography and excellent reading experience.",
    fullDescription: "Chen is a modern blog and magazine theme designed for content creators who value clean typography and excellent reading experiences. Built with bloggers, journalists, and magazine publishers in mind.\n\nThe theme features multiple homepage layouts including grid, list, and magazine-style presentations. Each layout is carefully designed to showcase your content in the best possible way.\n\nChen includes advanced post formats support for standard posts, galleries, videos, and audio. The theme handles media-rich content beautifully with built-in lightbox functionality and responsive embeds.\n\nTypography is at the heart of Chen's design. Carefully selected font pairings and optimal line spacing ensure your content is not just readable, but a pleasure to read. The theme supports both serif and sans-serif font options.",
    features: [
      "Multiple homepage layouts",
      "Advanced post formats support",
      "Clean, readable typography",
      "Built-in lightbox for galleries",
      "Responsive video and audio embeds",
      "Social sharing integration",
      "Newsletter subscription forms",
      "Related posts suggestions",
      "Author bio boxes",
      "SEO optimized structure"
    ]
  }
  
];
