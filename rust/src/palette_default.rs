// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — palette_default.rs
// The Semantic Indian CSS Framework
// Author: Barshan Sarkar · Malda, West Bengal, India
// Version: 1.4.0
// ═══════════════════════════════════════════════════════════════════
//
// Garur Native Palette — 31 families × 11 shades + black/white
// Original OKLCH-balanced ramp
// ═══════════════════════════════════════════════════════════════════

pub const DEFAULT_PALETTE: &[(&str, &str)] = &[
    // ═══════════ NEUTRALS ═══════════

    // void — cool blue-tinted dark
    ("void-50","#f5f7fa"),("void-100","#e8edf3"),("void-200","#d3dbe5"),
    ("void-300","#b0bdcc"),("void-400","#8494a9"),("void-500","#647490"),
    ("void-600","#4f5d76"),("void-700","#414b60"),("void-800","#384151"),
    ("void-900","#333a46"),("void-950","#1f242c"),

    // graphite — true neutral
    ("graphite-50","#f7f7f7"),("graphite-100","#eeeeee"),("graphite-200","#dddddd"),
    ("graphite-300","#c4c4c4"),("graphite-400","#9d9d9d"),("graphite-500","#7b7b7b"),
    ("graphite-600","#636363"),("graphite-700","#505050"),("graphite-800","#404040"),
    ("graphite-900","#363636"),("graphite-950","#1e1e1e"),

    // ash — cool neutral
    ("ash-50","#f6f7f8"),("ash-100","#eceef0"),("ash-200","#dadde1"),
    ("ash-300","#b9bec5"),("ash-400","#939aa3"),("ash-500","#6f7780"),
    ("ash-600","#565d66"),("ash-700","#454b54"),("ash-800","#393e46"),
    ("ash-900","#31353b"),("ash-950","#1c1f23"),

    // smoke — warm neutral
    ("smoke-50","#f8f6f4"),("smoke-100","#efebe7"),("smoke-200","#dcd5cd"),
    ("smoke-300","#c0b6aa"),("smoke-400","#9d9081"),("smoke-500","#7c7163"),
    ("smoke-600","#625a4e"),("smoke-700","#4e4840"),("smoke-800","#403c36"),
    ("smoke-900","#37332f"),("smoke-950","#1e1b18"),

    // sand — warm tan
    ("sand-50","#faf6ee"),("sand-100","#f4ecdb"),("sand-200","#e8d8b6"),
    ("sand-300","#d9be87"),("sand-400","#c9a058"),("sand-500","#b98a3c"),
    ("sand-600","#a36f31"),("sand-700","#86562b"),("sand-800","#6f4629"),
    ("sand-900","#5c3a25"),("sand-950","#341e12"),

    // bone — warm cream
    ("bone-50","#fbf9f3"),("bone-100","#f5f0e3"),("bone-200","#eadfc5"),
    ("bone-300","#dbc79b"),("bone-400","#c8a86e"),("bone-500","#b88d4d"),
    ("bone-600","#a3743e"),("bone-700","#875b36"),("bone-800","#704a32"),
    ("bone-900","#5d3f2c"),("bone-950","#342015"),

    // ═══════════ REDS / PINKS ═══════════

    // ruby — rich classic red
    ("ruby-50","#fef2f3"),("ruby-100","#fde3e5"),("ruby-200","#fbccd0"),
    ("ruby-300","#f7a8af"),("ruby-400","#f07582"),("ruby-500","#e54959"),
    ("ruby-600","#d12a3d"),("ruby-700","#b01e30"),("ruby-800","#921d2d"),
    ("ruby-900","#7c1d2b"),("ruby-950","#440a15"),

    // crimson — orange-red
    ("crimson-50","#fef4f2"),("crimson-100","#fee8e3"),("crimson-200","#fdd4ca"),
    ("crimson-300","#fab5a3"),("crimson-400","#f58a6c"),("crimson-500","#ee6240"),
    ("crimson-600","#da4521"),("crimson-700","#b83517"),("crimson-800","#982e19"),
    ("crimson-900","#7e2a1a"),("crimson-950","#44120b"),

    // coral — warm orange-pink
    ("coral-50","#fff5f1"),("coral-100","#ffe9e1"),("coral-200","#ffd3c5"),
    ("coral-300","#ffb39b"),("coral-400","#ff8862"),("coral-500","#fb6335"),
    ("coral-600","#ec4513"),("coral-700","#c6340e"),("coral-800","#9d2d13"),
    ("coral-900","#7e2916"),("coral-950","#441209"),

    // blush — soft pink
    ("blush-50","#fef5f7"),("blush-100","#fde9ee"),("blush-200","#fcd3dd"),
    ("blush-300","#f9afc2"),("blush-400","#f47f9d"),("blush-500","#ea5379"),
    ("blush-600","#d4315b"),("blush-700","#b3244a"),("blush-800","#962042"),
    ("blush-900","#801f3d"),("blush-950","#460c1e"),

    // rose — classic rose
    ("rose-50","#fff4f6"),("rose-100","#ffe7ec"),("rose-200","#ffd2db"),
    ("rose-300","#ffadc0"),("rose-400","#ff7c98"),("rose-500","#fb4c72"),
    ("rose-600","#e8275a"),("rose-700","#c4194b"),("rose-800","#a41846"),
    ("rose-900","#8b1841"),("rose-950","#4e0822"),

    // plum — purple-pink
    ("plum-50","#fdf4fb"),("plum-100","#fce8f7"),("plum-200","#fad1ee"),
    ("plum-300","#f7abdf"),("plum-400","#f177cb"),("plum-500","#e54cb5"),
    ("plum-600","#cd2c9a"),("plum-700","#ad1f7d"),("plum-800","#8e1c67"),
    ("plum-900","#761c56"),("plum-950","#490831"),

    // ═══════════ ORANGES / YELLOWS ═══════════

    // ember — deep orange
    ("ember-50","#fff8ed"),("ember-100","#ffedd1"),("ember-200","#ffd8a3"),
    ("ember-300","#ffbb69"),("ember-400","#ff9433"),("ember-500","#fd730c"),
    ("ember-600","#ee5503"),("ember-700","#c53d06"),("ember-800","#9c310e"),
    ("ember-900","#7e2a0f"),("ember-950","#441205"),

    // sunset — warm orange
    ("sunset-50","#fff9ed"),("sunset-100","#fff0d4"),("sunset-200","#ffdca8"),
    ("sunset-300","#ffc271"),("sunset-400","#ff9f38"),("sunset-500","#fd7f12"),
    ("sunset-600","#ee6008"),("sunset-700","#c54609"),("sunset-800","#9c380f"),
    ("sunset-900","#7e3010"),("sunset-950","#441606"),

    // honey — amber gold
    ("honey-50","#fffbea"),("honey-100","#fff3c4"),("honey-200","#ffe585"),
    ("honey-300","#ffd146"),("honey-400","#ffb918"),("honey-500","#f59e00"),
    ("honey-600","#d97c00"),("honey-700","#b45c02"),("honey-800","#92470a"),
    ("honey-900","#783a0c"),("honey-950","#451d02"),

    // gold — yellow-gold
    ("gold-50","#fefde8"),("gold-100","#fdf9c4"),("gold-200","#fcf28d"),
    ("gold-300","#fae44b"),("gold-400","#f7d01f"),("gold-500","#e7b30a"),
    ("gold-600","#c88c06"),("gold-700","#a06409"),("gold-800","#834f0f"),
    ("gold-900","#6f4112"),("gold-950","#412106"),

    // sunbeam — bright yellow
    ("sunbeam-50","#fefee7"),("sunbeam-100","#fdfbc3"),("sunbeam-200","#fcf68b"),
    ("sunbeam-300","#fae948"),("sunbeam-400","#f7d819"),("sunbeam-500","#e7bc08"),
    ("sunbeam-600","#c89405"),("sunbeam-700","#a06a08"),("sunbeam-800","#84530f"),
    ("sunbeam-900","#704413"),("sunbeam-950","#422306"),

    // ═══════════ GREENS ═══════════

    // citron — yellow-green
    ("citron-50","#f8fde8"),("citron-100","#effac4"),("citron-200","#e0f690"),
    ("citron-300","#caed52"),("citron-400","#b1df23"),("citron-500","#95c410"),
    ("citron-600","#739c09"),("citron-700","#57770c"),("citron-800","#475e10"),
    ("citron-900","#3d5012"),("citron-950","#1e2c05"),

    // lime — bright green
    ("lime-50","#f5fdea"),("lime-100","#e8fbcd"),("lime-200","#d1f6a1"),
    ("lime-300","#b0ed6a"),("lime-400","#90dd3e"),("lime-500","#72c21f"),
    ("lime-600","#579b16"),("lime-700","#437516"),("lime-800","#385e18"),
    ("lime-900","#314f19"),("lime-950","#172c08"),

    // mint — soft green
    ("mint-50","#f1fdf5"),("mint-100","#dffbe9"),("mint-200","#bff5d4"),
    ("mint-300","#8aeab3"),("mint-400","#4fd78c"),("mint-500","#2abd6c"),
    ("mint-600","#1c9a55"),("mint-700","#1a7a46"),("mint-800","#19613b"),
    ("mint-900","#175033"),("mint-950","#062d1a"),

    // forest — deep green
    ("forest-50","#effaf1"),("forest-100","#d7f2dc"),("forest-200","#b1e5bd"),
    ("forest-300","#7dd096"),("forest-400","#48b26b"),("forest-500","#26944c"),
    ("forest-600","#18763b"),("forest-700","#165e32"),("forest-800","#154b2a"),
    ("forest-900","#133e25"),("forest-950","#082318"),

    // jade — emerald blue-green
    ("jade-50","#effcf6"),("jade-100","#cbf7e5"),("jade-200","#98eecd"),
    ("jade-300","#5edeb0"),("jade-400","#2cc491"),("jade-500","#12a878"),
    ("jade-600","#0a8762"),("jade-700","#0a6c51"),("jade-800","#0c5642"),
    ("jade-900","#0d4738"),("jade-950","#032a22"),

    // ═══════════ TEALS / CYANS ═══════════

    // teal — classic teal
    ("teal-50","#effcfc"),("teal-100","#c8f6f6"),("teal-200","#91ecec"),
    ("teal-300","#52dcde"),("teal-400","#1ec3c7"),("teal-500","#09a5aa"),
    ("teal-600","#048389"),("teal-700","#07696e"),("teal-800","#0b5458"),
    ("teal-900","#0d4649"),("teal-950","#022a2c"),

    // aqua — cyan
    ("aqua-50","#effbfe"),("aqua-100","#c7f4fc"),("aqua-200","#8fe8f9"),
    ("aqua-300","#52d5f2"),("aqua-400","#1cb9e4"),("aqua-500","#099ac7"),
    ("aqua-600","#087aa4"),("aqua-700","#0c6286"),("aqua-800","#11516d"),
    ("aqua-900","#13445c"),("aqua-950","#082b3c"),

    // sky — sky blue
    ("sky-50","#f0f8ff"),("sky-100","#e0eefe"),("sky-200","#b9dffc"),
    ("sky-300","#7cc5f8"),("sky-400","#3ea8f1"),("sky-500","#1a8ade"),
    ("sky-600","#116dbc"),("sky-700","#135698"),("sky-800","#16497c"),
    ("sky-900","#173e66"),("sky-950","#0f2744"),

    // ═══════════ BLUES ═══════════

    // azure — vivid blue
    ("azure-50","#eff5ff"),("azure-100","#dbe9fe"),("azure-200","#bfd8fe"),
    ("azure-300","#93bdfd"),("azure-400","#6097fa"),("azure-500","#3b73f5"),
    ("azure-600","#2552ea"),("azure-700","#1d3fd7"),("azure-800","#1e35ae"),
    ("azure-900","#1e3189"),("azure-950","#171f53"),

    // cobalt — deep blue
    ("cobalt-50","#eef4ff"),("cobalt-100","#dde6ff"),("cobalt-200","#c2d1ff"),
    ("cobalt-300","#9cb4ff"),("cobalt-400","#748cfc"),("cobalt-500","#5566f5"),
    ("cobalt-600","#4044ea"),("cobalt-700","#3533cf"),("cobalt-800","#2e2da7"),
    ("cobalt-900","#2b2d84"),("cobalt-950","#1a1a4d"),

    // indigo — blue-violet
    ("indigo-50","#f2f2ff"),("indigo-100","#e7e5ff"),("indigo-200","#d1ceff"),
    ("indigo-300","#b2a8ff"),("indigo-400","#8f77ff"),("indigo-500","#724af9"),
    ("indigo-600","#6229ec"),("indigo-700","#5519d0"),("indigo-800","#4717a9"),
    ("indigo-900","#3c1a86"),("indigo-950","#230c51"),

    // ═══════════ PURPLES ═══════════

    // iris — blue-purple
    ("iris-50","#f5f3ff"),("iris-100","#ede9ff"),("iris-200","#ddd6ff"),
    ("iris-300","#c5b5fe"),("iris-400","#a585fc"),("iris-500","#8657f7"),
    ("iris-600","#7535ec"),("iris-700","#6624d1"),("iris-800","#5620aa"),
    ("iris-900","#481d88"),("iris-950","#2a0e53"),

    // violet — classic violet
    ("violet-50","#f9f4ff"),("violet-100","#f2e7ff"),("violet-200","#e7d3ff"),
    ("violet-300","#d4b0ff"),("violet-400","#bc7fff"),("violet-500","#a34ffb"),
    ("violet-600","#8c2cec"),("violet-700","#771cd0"),("violet-800","#651ca9"),
    ("violet-900","#541b88"),("violet-950","#330a53"),

    // orchid — pink-purple
    ("orchid-50","#fdf4ff"),("orchid-100","#fae5ff"),("orchid-200","#f6caff"),
    ("orchid-300","#f0a0ff"),("orchid-400","#e66dff"),("orchid-500","#d43df7"),
    ("orchid-600","#b91ddb"),("orchid-700","#9a14b5"),("orchid-800","#7e1594"),
    ("orchid-900","#681777"),("orchid-950","#44074f"),

    // ═══════════ SPECIALS ═══════════
    ("black","#000000"),
    ("white","#ffffff"),
];