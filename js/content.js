/* =====================================================================
   PORTFOLIO CONTENT
   This is the only file you need to edit. Everything on the site is
   built from the object below. Save the file and refresh the page.

   Empty lists show a themed "empty" placeholder on the site, so you can
   fill sections in one at a time. Want to see the site fully populated
   first? Open it with  ?demo  on the end of the address.
   ===================================================================== */

window.PORTFOLIO = {

  /* ---------- Identity ---------- */
  name: "Sebstyn",

  // Optional: a logo image to use in the banner instead of the name.
  // e.g. "assets/logo.png"
  logo: "",

  // The two lines on the right of the banner.
  banner: {
    small: "Welcome to my",
    big: "Creative portfolio",
  },

  // The "About me" card at the top of the Home tab, plus optional skill tags.
  about: "Ello, I'm Sebstyn, a content specialist in the making. I love creating content and helping other creators make theirs even better. Got a project in mind? Message me any time.",
  skills: [],

  // The sentence under each section title.
  blurbs: {
    edits:      "Long-form videos and short-form cuts, kept in two separate bins.",
    thumbnails: "Packaging that earns the click.",
    minecraft:  "Mods, plugins, models and textures built for the game.",
    analytics:  "How the work performs, with long-form and Shorts side by side.",
  },

  /* ---------- Video edits ----------
     The videos play straight from files on the site, not from YouTube.
     Put each file in assets/edits/longform or assets/edits/shortform
     (MP4 is the safest format) and add a line:

     { title: "My best edit",
       file: "assets/edits/longform/my-best-edit.mp4",
       poster: "assets/edits/longform/my-best-edit.jpg",  // optional cover; without one the first frame shows
       client: "Channel name",                            // optional
       role: "Edit · Sound design",                       // optional
       views: "1.2M" },                                   // optional

     To play only part of a file, add  end: 30  (stop after 30 seconds)
     and, if it shouldn't begin at the start,  start: 12 .
     A card whose file is missing shows "Media offline" until the file is there.

     Two things keep the page fast, and both are worth having on every entry:
       poster   - the cover image. With one, no video is downloaded until
                  someone hovers or clicks the card.
       preview  - a small silent copy of the clip, played on hover instead
                  of the full file.
     "duration" is the label in the corner of the card.
  */
  edits: {
    longform: [
      { title: "I Survived Minecraft's 2 Week Phase!",
        file:    "assets/edits/longform/2-week-phase.mp4",
        preview: "assets/edits/longform/2-week-phase-preview.mp4",
        poster:  "assets/edits/longform/2-week-phase.jpg", end: 30 },
      { title: "I Took Over The Biggest Minecraft SMP",
        file:    "assets/edits/longform/biggest-minecraft-smp.mp4",
        preview: "assets/edits/longform/biggest-minecraft-smp-preview.mp4",
        poster:  "assets/edits/longform/biggest-minecraft-smp.jpg", end: 30 },
      { title: "The Most INSANE Start... ARC Raiders (Rags to Riches EP1)",
        file:    "assets/edits/longform/arc-raiders-ep1.mp4",
        preview: "assets/edits/longform/arc-raiders-ep1-preview.mp4",
        poster:  "assets/edits/longform/arc-raiders-ep1.jpg", end: 30 },
      { title: "100 Players Simulate a Pirate Minecraft Tournament!",
        file:    "assets/edits/longform/pirate-tournament.mp4",
        preview: "assets/edits/longform/pirate-tournament-preview.mp4",
        poster:  "assets/edits/longform/pirate-tournament.jpg", end: 30 },
    ],
    shortform: [
      { title: "Minecraft but it's an Extraction MMO?", duration: "0:15",
        file:    "assets/edits/shortform/extraction-mmo.mp4",
        preview: "assets/edits/shortform/extraction-mmo-preview.mp4",
        poster:  "assets/edits/shortform/extraction-mmo.jpg" },
      { title: "Minecraft But Its a Extraction Game!", duration: "0:18",
        file:    "assets/edits/shortform/extraction-game.mp4",
        preview: "assets/edits/shortform/extraction-game-preview.mp4",
        poster:  "assets/edits/shortform/extraction-game.jpg" },
      { title: "This Has Never Been Done In Minecraft!", duration: "0:21",
        file:    "assets/edits/shortform/never-been-done.mp4",
        preview: "assets/edits/shortform/never-been-done-preview.mp4",
        poster:  "assets/edits/shortform/never-been-done.jpg" },
      { title: "DO NOT do this in Minecraft!", duration: "0:16",
        file:    "assets/edits/shortform/do-not-do-this.mp4",
        preview: "assets/edits/shortform/do-not-do-this-preview.mp4",
        poster:  "assets/edits/shortform/do-not-do-this.jpg" },
    ],
  },

  /* ---------- Thumbnails ----------
     Put the image in assets/thumbnails/ and add a line:

     { src: "assets/thumbnails/my-thumbnail.png",
       title: "Video title",                      // optional
       client: "Channel name",                    // optional
       stat: "2.4M views · 11% CTR" },            // optional
  */
  thumbnails: [
    { src: "assets/thumbnails/pirate-minecraft-hardcore.webp",     title: "Pirate Minecraft Hardcore" },
    { src: "assets/thumbnails/squid-game-minecraft-hardcore.webp", title: "Squid Game Minecraft Hardcore" },
    { src: "assets/thumbnails/medieval-minecraft-hardcore.webp",   title: "Medieval Minecraft Hardcore" },
    { src: "assets/thumbnails/minecraft-hardcore.webp",            title: "Minecraft Hardcore" },
  ],

  /* ---------- Minecraft ----------
     mods / plugins:
     { name: "My Mod",
       icon: "assets/minecraft/icons/my-mod.png", // optional
       description: "What it does, in a sentence or two.",
       version: "1.0.0",                          // optional
       mc: "1.21.11",                             // optional
       loader: "Fabric",                          // Fabric, Paper, Forge...
       side: "Client",                            // Client, Server or Both
       links: { modrinth: "", curseforge: "", github: "", download: "" } },

     If the mod is on Modrinth, just give its link. The name, icon,
     description and a live download count are then pulled from Modrinth,
     and anything you also write here is used instead of Modrinth's version:
     { modrinth: "https://modrinth.com/mod/your-mod" },

     models:
     { src: "assets/minecraft/models/dragon.png", name: "Dragon", note: "Blockbench · 412 cubes" },

     textures (they go into the inventory grid):
     { src: "assets/minecraft/textures/sword.png", name: "Ember Sword", note: "16x" },
     Animated textures (a vertical strip of frames) play automatically if
     you say how many frames there are:
     { src: "assets/minecraft/textures/staff.png", name: "Storm Staff", frames: 12 },
  */
  minecraft: {
    mods: [
      { name: "Cobblemon PocketSMP Badges",
        modrinth: "https://modrinth.com/mod/cobblemon-pocketsmp-badges" },
    ],
    plugins: [],
    models: [],
    // The chest is 9 slots wide, so each line below is one row of it.
    textures: [
      { src: "assets/minecraft/textures/rod.png",                name: "Rod",                note: "Tool" },
      { src: "assets/minecraft/textures/pickaxe.png",            name: "Pickaxe",            note: "Tool" },
      { src: "assets/minecraft/textures/hoe.png",                name: "Hoe",                note: "Tool" },
      { src: "assets/minecraft/textures/axe.png",                name: "Axe",                note: "Tool" },
      { src: "assets/minecraft/textures/shovel.png",             name: "Shovel",             note: "Tool" },
      { src: "assets/minecraft/textures/starweaver.png",         name: "Starweaver",         note: "Weapon" },
      { src: "assets/minecraft/textures/voidcaller.png",         name: "Voidcaller",         note: "Weapon" },
      { src: "assets/minecraft/textures/tempest.png",            name: "Tempest",            note: "Weapon" },
      { src: "assets/minecraft/textures/galewing.png",           name: "Galewing",           note: "Weapon" },

      { src: "assets/minecraft/textures/runed-rod.png",          name: "Runed Rod",          note: "Tool" },
      { src: "assets/minecraft/textures/runed-pickaxe.png",      name: "Runed Pickaxe",      note: "Tool" },
      { src: "assets/minecraft/textures/runed-hoe.png",          name: "Runed Hoe",          note: "Tool" },
      { src: "assets/minecraft/textures/runed-axe.png",          name: "Runed Axe",          note: "Tool" },
      { src: "assets/minecraft/textures/runed-shovel.png",       name: "Runed Shovel",       note: "Tool" },
      { src: "assets/minecraft/textures/reapers-scythe.png",     name: "Reaper's Scythe",    note: "Weapon" },
      { src: "assets/minecraft/textures/wintersong.png",         name: "Wintersong",         note: "Weapon" },
      { src: "assets/minecraft/textures/scythe.png",             name: "Scythe",             note: "Weapon" },
      { src: "assets/minecraft/textures/starfall.png",           name: "Starfall",           note: "Weapon" },

      { src: "assets/minecraft/textures/verdant-rod.png",        name: "Verdant Rod",        note: "Tool" },
      { src: "assets/minecraft/textures/verdant-pickaxe.png",    name: "Verdant Pickaxe",    note: "Tool" },
      { src: "assets/minecraft/textures/verdant-hoe.png",        name: "Verdant Hoe",        note: "Tool" },
      { src: "assets/minecraft/textures/verdant-axe.png",        name: "Verdant Axe",        note: "Tool" },
      { src: "assets/minecraft/textures/verdant-shovel.png",     name: "Verdant Shovel",     note: "Tool" },
      { src: "assets/minecraft/textures/hollow-codex.png",       name: "Hollow Codex",       note: "Weapon" },
      { src: "assets/minecraft/textures/grave-tome.png",         name: "Grave Tome",         note: "Weapon" },
      { src: "assets/minecraft/textures/soulbound-grimoire.png", name: "Soulbound Grimoire", note: "Weapon" },
      { src: "assets/minecraft/textures/ironfists.png",          name: "Ironfists",          note: "Weapon" },

      { src: "assets/minecraft/textures/magma-knuckles.png",     name: "Magma Knuckles",     note: "Weapon" },
      { src: "assets/minecraft/textures/stormclaws.png",         name: "Stormclaws",         note: "Weapon" },
      { src: "assets/minecraft/textures/amethyst-choker.png",    name: "Amethyst Choker",    note: "Accessory" },
      { src: "assets/minecraft/textures/tideheart-amulet.png",   name: "Tideheart Amulet",   note: "Accessory" },
      { src: "assets/minecraft/textures/wayfarer-pendant.png",   name: "Wayfarer Pendant",   note: "Accessory" },
      { src: "assets/minecraft/textures/gilded-ring.png",        name: "Gilded Ring",        note: "Accessory" },
      { src: "assets/minecraft/textures/iron-band.png",          name: "Iron Band",          note: "Accessory" },
      { src: "assets/minecraft/textures/stormcall-signet.png",   name: "Stormcall Signet",   note: "Accessory" },
      { src: "assets/minecraft/textures/prismarine-cuff.png",    name: "Prismarine Cuff",    note: "Accessory" },

      { src: "assets/minecraft/textures/hide-wristwrap.png",     name: "Hide Wristwrap",     note: "Accessory" },
      { src: "assets/minecraft/textures/wingsuit.png",           name: "Wingsuit",           note: "Item" },
    ],

    // Tabs listed here just say "Coming soon...". Take a name out once
    // that tab has something in it.
    comingSoon: ["plugins", "models"],
  },

  /* ---------- YouTube analytics ----------
     Two ways to fill this in. Use either, or both.

     1) LIVE. Paste your channel and a free YouTube Data API v3 key. The
        site then pulls your latest long-form videos and Shorts by itself.
          channel: "@yourhandle"   (or a UC... channel ID)
          apiKey:  "AIza..."
        The key is visible to anyone who views the page source, so in the
        Google Cloud console restrict it to "YouTube Data API v3" and to
        your website's address.

     2) BY HAND. List the videos yourself:
          { title: "Video title", youtube: "https://youtu.be/VIDEO_ID",
            views: "1.2M", likes: 48000, comments: 1900, published: "2026-05-14" },
        With an apiKey set you only need the youtube link. The numbers are
        fetched live, which also works for videos on other people's
        channels (client work).

     "highlights" are extra tiles for numbers YouTube keeps private, e.g.
          { label: "Avg. view duration", value: "4:32", note: "last 28 days" },
  */
  analytics: {
    // While this is true the Analytics tab just says "Coming soon...".
    // Set it to false once the numbers below are filled in.
    comingSoon: true,

    channel: "",
    apiKey: "",
    maxVideos: 12,
    longform:  { videos: [], highlights: [] },
    shortform: { videos: [], highlights: [] },
  },

  /* ---------- Contact ----------
     Fill in what you use, leave the rest blank. Handles or full links
     both work. A Discord username shows a "copy" button instead of a link.
  */
  contact: {
    email: "",
    youtube: "",
    discord: "Sebstyn",
    twitter: "",
    tiktok: "",
    instagram: "",
    github: "",
    modrinth: "",
    links: [
      // { label: "My store", url: "https://example.com" },
    ],
  },
};
