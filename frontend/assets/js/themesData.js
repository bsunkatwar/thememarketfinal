// Centralized Theme Data for ThemeMarket
// This file contains all theme data and works on any device without LocalStorage

const THEMES_DATA = [
    {
        id: 1,
        title: "Kalium - Creative Theme",
        category: "Creative & Portfolio",
        image: "assets/image/kalium.jpeg",
        price: 59,
        rating: 4.9,
        sales: 45000,
        badge: "Best Seller",
        previewUrl: "https://kalium.qodeinteractive.com/",
        description: "Creative portfolio theme with modern design and stunning visual effects",
        shortDescription: "A sleek, modern creative theme built for portfolios and agencies."
    },
    {
        id: 2,
        title: "Avada - Business Theme",
        category: "Business & Corporate",
        image: "assets/image/avada.jpeg",
        price: 69,
        rating: 4.8,
        sales: 38000,
        badge: "Trending",
        previewUrl: "https://avada.theme-fusion.com/",
        description: "Professional business theme for corporate websites",
        shortDescription: "A bold, professional theme for business and corporate websites."
    },
    {
        id: 3,
        title: "TheGem - Multi-Purpose",
        category: "Multi-Purpose",
        image: "assets/image/2.png",
        price: 59,
        rating: 4.9,
        sales: 42000,
        badge: "Popular",
        previewUrl: "https://thegem.stylemixthemes.net/",
        description: "Versatile multi-purpose theme for any type of website",
        shortDescription: "A conversion-optimized theme for modern online stores."
    },
    {
        id: 4,
        title: "Flatsome - eCommerce",
        category: "eCommerce",
        image: "assets/image/flats.jpeg",
        price: 79,
        rating: 4.9,
        sales: 52000,
        badge: "Best Seller",
        previewUrl: "https://flatsome.uxthemes.com/",
        description: "WooCommerce theme for online stores",
        shortDescription: "An editorial blog and magazine theme with strong typography."
    },
    {
        id: 5,
        title: "Bridge - Business",
        category: "Business & Corporate",
        image: "assets/image/bridge.jpeg",
        price: 59,
        rating: 4.7,
        sales: 41000,
        badge: "Popular",
        previewUrl: "https://bridge.qodeinteractive.com/",
        description: "Premium business theme with advanced customization",
        shortDescription: "A premium agency and studio theme with scroll animations."
    },
    {
        id: 6,
        title: "Uncode - Creative",
        category: "Creative & Portfolio",
        image: "assets/image/theme5.jpeg",
        price: 69,
        rating: 4.9,
        sales: 33000,
        badge: "Trending",
        previewUrl: "https://uncode.undsgn.com/",
        description: "Clean creative theme for showcasing your work",
        shortDescription: "A high-converting startup landing page theme."
    },
    {
        id: 7,
        title: "Enfold - Multi-Purpose",
        category: "Multi-Purpose",
        image: "assets/image/enfold.jpeg",
        price: 59,
        rating: 4.8,
        sales: 39000,
        badge: "Popular",
        previewUrl: "https://enfold.kriesi.de/",
        description: "Flexible multi-purpose theme with drag-and-drop builder",
        shortDescription: "A flexible theme with powerful customization options."
    },
    {
        id: 8,
        title: "Chen - Blog & Magazine",
        category: "Blog & Magazine",
        image: "assets/image/chen.jpeg",
        price: 49,
        rating: 4.6,
        sales: 28000,
        badge: "New",
        previewUrl: "https://chen-demo.qodeinteractive.com/",
        description: "Modern blog and magazine theme",
        shortDescription: "A modern blog theme with clean typography."
    }
];

// Helper function to get all themes
function getAllThemes() {
    return THEMES_DATA;
}

// Helper function to get theme by ID
function getThemeById(id) {
    return THEMES_DATA.find(theme => theme.id == id);
}

// Helper function to filter themes by category
function getThemesByCategory(category) {
    if (!category || category === 'all') {
        return THEMES_DATA;
    }
    return THEMES_DATA.filter(theme => 
        theme.category.toLowerCase().includes(category.toLowerCase())
    );
}

// Make available globally
window.THEMES_DATA = THEMES_DATA;
window.getAllThemes = getAllThemes;
window.getThemeById = getThemeById;
window.getThemesByCategory = getThemesByCategory;
