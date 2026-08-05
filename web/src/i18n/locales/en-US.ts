export default {
  hero: {
    kicker: 'FFMPEG.WASM · LOCAL IN-BROWSER PROCESSING · NO SERVER UPLOAD',
    sub: 'Pick a classic cassette and give your digital audio a genuine analog character — tape hiss, wow & flutter, bandwidth limits and era-specific EQ coloring, all processed right inside your browser.',
  },
  engine: {
    loading: '⏳ Loading audio engine… (~30 MB on first visit)',
    ready: '● Audio engine ready',
    error: '⚠ Engine failed to load. Check your network and refresh.',
    retry: '↻ Retry',
  },
  steps: {
    upload: 'Upload Audio',
    tape: 'Choose a Tape',
    convert: 'Convert',
    result: 'Preview & Download',
  },
  upload: {
    title: 'Drag & drop audio here, or click to browse',
    hint: 'Supports MP3 / OGG / M4A / AAC, up to {{max}} MB',
    change: '{{size}} · Click to replace',
    ariaLabel: 'Upload audio file',
    badFormat: 'Unsupported format .{{ext}}, please upload a {{list}} file',
    tooLarge: 'File exceeds {{max}} MB. In-browser conversion may fail, please compress it first',
  },
  tape: {
    loaded: 'LOADED ▶',
    hiss: 'Hiss',
    coverAlt: '{{name}} cassette tape cover photo',
  },
  convert: {
    button: '⏺ Record to {{name}}',
    converting: 'Converting… {{pct}}%',
    hint: 'Please upload an audio file above first',
    failed: 'Conversion failed, please try again',
    failedReason: 'Conversion failed: {{reason}}',
  },
  player: {
    listening: 'Now listening',
    original: 'Original',
    converted: 'Tape FX',
    originalAudio: 'original audio',
    convertedAudio: 'tape effect',
    download: '⬇ Download MP3',
    play: 'Play',
    pause: 'Pause',
    seek: 'Seek',
    abToggle: 'A/B comparison',
  },
  share: {
    button: '🔗 Copy Share Link',
    copied: '✓ Link copied',
  },
  langSwitch: 'Switch language',
  nav: {
    home: 'Home',
    about: 'About',
    privacy: 'Privacy Policy',
    back: '← Back to home',
  },
  content: {
    howTitle: 'How Is the Cassette Sound Simulated?',
    howIntro:
      'This site does not rely on a generic "lo-fi filter". Each tape profile reconstructs the physical phenomena of the cassette playback chain with an ffmpeg filter graph, calibrated against the frequency response, noise floor and speed-stability characteristics of the real tape formulation and era.',
    how1Title: 'Tape Hiss',
    how1:
      'The random magnetization of magnetic particles produces a constant broadband hiss. We generate stereo white noise scaled to each tape\u2019s real signal-to-noise ratio and mix it with the music — the Soviet MK-60 hisses roughly 4\u00d7 louder than a Maxell UD, which is exactly the audible gap between budget and premium tape.',
    how2Title: 'Wow & Flutter',
    how2:
      'A tape transport never runs at a perfectly constant speed: capstan eccentricity causes slow pitch drift around 2 Hz (wow), while the pinch roller and tape guides add fast 13\u201316 Hz trembling (flutter). Two cascaded vibrato filters model these periodic pitch modulations, with depths matched to each model\u2019s measured flutter figures.',
    how3Title: 'Bandwidth Limits & EQ Coloring',
    how3:
      'Type I ferric tape rolls off between 9 and 15 kHz, and bass extension is limited by head geometry and tape speed. High-pass, low-pass and multi-band equalizers together form each tape\u2019s unique tonal fingerprint — the dark thickness of BASF, the late-era cleanliness of TDK, or the aggressive 9 kHz cut of the MK-60.',
    historyTitle: 'A Short Guide to the Compact Cassette',
    history1:
      'The Compact Cassette was introduced by Philips in 1963 and, thanks to free licensing, quickly became a worldwide standard — the dominant music medium of the 1970s through the 1990s. Tapes are grouped into four types by formulation: Type I (ferric oxide), Type II (chrome), Type III (ferrichrome) and Type IV (metal). All six tapes featured here are classic Type I models.',
    history2:
      'Different brands and eras sound remarkably different: German BASF is famous for its thick low-mids; Japan\u2019s Maxell UD and TDK D series represent the peak of ferric tape engineering; Sony\u2019s CHF was the everyday tape of the late 1970s; and the Soviet state-made MK-60, with its high hiss and heavy flutter, has become a cult favorite among today\u2019s Lo-Fi musicians. Pick a tape and hear what an era sounded like.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      {
        q: 'Is my audio file uploaded to a server?',
        a: 'No. This site is built on ffmpeg.wasm: decoding, filtering and encoding all happen locally in your browser. Your file never leaves your device and never passes through any server.',
      },
      {
        q: 'Which audio formats are supported? Is there a size limit?',
        a: 'MP3, OGG, M4A and AAC are supported, with a maximum file size of 100 MB. The converted result is always a 192 kbps MP3 file.',
      },
      {
        q: 'Why is the first page load slow?',
        a: 'On first visit the browser downloads the ~30 MB ffmpeg.wasm audio engine from a CDN. It is cached afterwards, so subsequent visits are much faster.',
      },
      {
        q: 'Where do the tape effect parameters come from?',
        a: 'Each tape\u2019s hiss level, wow & flutter rates, bandwidth limit and EQ curve are derived from published measurements of real cassettes and refined by ear, and they match the ffmpeg scripts of the open-source Audio-Cassette-Simulation project exactly.',
      },
      {
        q: 'How long does a conversion take?',
        a: 'It depends on your device. On a modern computer conversion typically runs at tens of times real-time speed (a 4-minute song takes seconds to tens of seconds); phones are somewhat slower.',
      },
      {
        q: 'Is this tool free?',
        a: 'Completely free, no registration required. This site is the web implementation of an open-source cassette simulation project, supported by display advertising.',
      },
    ],
    disclaimer:
      'This site is not affiliated with BASF, Maxell, Sony, TDK or any other brand mentioned. Brand names are used solely to describe the acoustic characteristics of the simulated tapes.',
  },
  about: {
    seoTitle: 'About · Cassette Simulator',
    seoDescription:
      'About Cassette Simulator: a free online tool built on ffmpeg.wasm that adds the authentic sound of 6 classic compact cassettes to your audio, entirely in your browser.',
    title: 'About This Site',
    p1: 'Cassette Simulator is the web implementation of the open-source Audio-Cassette-Simulation project. The original project simulates the acoustics of classic compact cassettes with Bash and ffmpeg scripts on the command line; this site ports the exact same filter parameters to the browser, so anyone can get an authentic tape character with one click.',
    p2: 'Six representative Type I tapes are included: the German BASF LH Extra C90, Japan\u2019s Maxell UD C90, the Sony CHF60 and CHF90 (1978), the late-era TDK D90 (1995\u20131997), and the Soviet state-produced MK-60. Hiss, wow & flutter, bandwidth and EQ coloring are modeled independently for each tape, matching the original ffmpeg scripts exactly.',
    p3: 'The site uses a pure front-end ffmpeg.wasm architecture: all audio processing happens locally in your browser. No files are uploaded and no audio data is collected — a technical choice that doubles as our privacy commitment.',
    contactTitle: 'Contact',
    contact: 'For questions, suggestions or collaboration, please open an issue on the GitHub project page.',
  },
  privacy: {
    seoTitle: 'Privacy Policy · Cassette Simulator',
    seoDescription:
      'Privacy policy of Cassette Simulator: audio files are processed entirely in your browser and never uploaded; details about cookies, local storage and Google AdSense advertising.',
    title: 'Privacy Policy',
    updated: 'Last updated: July 2026',
    intro:
      'This privacy policy explains how Cassette Simulator ("this site") handles your information. By using this site you agree to the practices described below.',
    sections: [
      {
        h: 'Audio File Processing',
        p: 'Audio files you select are processed only in your browser\u2019s memory by the locally running ffmpeg.wasm engine. They are never uploaded to our servers or any third-party server, and we cannot access, store or analyze your audio content. All data is released from memory when you close the page.',
      },
      {
        h: 'Cookies & Local Storage',
        p: 'This site uses the browser\u2019s localStorage to remember your language preference (Chinese/English); this data stays on your device. The site itself does not use cookies to track user behavior.',
      },
      {
        h: 'Advertising (Google AdSense)',
        p: 'This site displays ads served by Google AdSense. Google and its partners, as third-party vendors, use cookies (including the DART cookie) to serve personalized ads based on your prior visits to this and other websites. You may opt out of personalized advertising by visiting Google Ads Settings (adssettings.google.com), or visit www.aboutads.info to opt out of third-party vendors\u2019 use of cookies for personalized advertising.',
      },
      {
        h: 'Access Logs & Analytics',
        p: 'This site is hosted on Vercel and Cloudflare Pages. The hosting platforms may record anonymized access logs (such as IP address, access time and browser type) for security and operations. These logs are governed by the respective platforms\u2019 privacy policies; we deploy no additional behavioral analytics.',
      },
      {
        h: 'Third-Party Resources',
        p: 'The page loads the ffmpeg.wasm engine from CDNs (unpkg / jsDelivr) and fonts from Google Fonts. These requests expose standard HTTP information such as your IP address to the respective providers, whose privacy policies apply.',
      },
      {
        h: 'Children\u2019s Privacy',
        p: 'This site is intended for a general audience, is not directed at children under 13, and does not knowingly collect personal information from children.',
      },
      {
        h: 'Policy Updates',
        p: 'We may update this policy from time to time; the latest revision date is shown on this page. Significant changes will be announced prominently on the site.',
      },
      {
        h: 'Contact',
        p: 'If you have any questions about this privacy policy, please open an issue on the GitHub project page.',
      },
    ],
  },

  footer: {
    text: 'Tape profiles from the <0>Audio-Cassette-Simulation</0> ffmpeg project · Audio is processed entirely on your device and never uploaded',
  },
  seo: {
    title: 'Cassette Simulator · Online Cassette Tape Audio Effect (ffmpeg.wasm)',
    tapeTitle: '{{name}} Tape Sound Simulation · Cassette Simulator',
    description:
      'Free online cassette tape simulator: upload MP3/OGG/M4A/AAC audio, pick from 6 classic tapes (BASF, Maxell, Sony CHF, TDK, Soviet MK-60) and get authentic tape hiss, wow & flutter and vintage EQ coloring. Powered by ffmpeg.wasm — everything runs locally in your browser.',
    tapeDescription:
      'Simulate the {{name}} cassette sound online: {{desc}} Upload audio to render an authentic tape character locally in your browser, with A/B preview and MP3 download.',
    keywords:
      'cassette simulator,tape effect online,cassette tape sound,lo-fi effect,tape hiss,wow and flutter,ffmpeg.wasm,vintage audio,BASF,Maxell,Sony CHF60,TDK D90,MK-60',
  },
  tapes: {
    basf: {
      origin: 'Germany',
      description: 'German ferric tape with moderate hiss and mild flutter. Noticeable high-frequency roll-off gives a dark, thick sound.',
      hiss: 'Moderate',
      character: 'Dark · Thick',
    },
    maxell: {
      origin: 'Japan',
      description: 'Higher-grade ferric tape with the lowest hiss and widest frequency range of the set. Full bass, clean and transparent.',
      hiss: 'Very low',
      character: 'Clean · Full bass',
    },
    chf60: {
      origin: 'Japan',
      description: "Sony's mainstream Type I normal bias tape from the late 1970s. The 60-minute version uses a thicker substrate: warm low-mids and very stable pitch.",
      hiss: 'Moderate',
      character: 'Warm · Stable',
    },
    chf90: {
      origin: 'Japan',
      description: 'The 90-minute version uses a thinner substrate with slightly higher speed drift than the CHF60 — similar tone, a touch more flutter.',
      hiss: 'Moderate',
      character: 'Warm · Slight drift',
    },
    tdk: {
      origin: 'Japan',
      description: 'A late-era Type I tape. Clean and refined sound with only a subtle analog character remaining.',
      hiss: 'Low',
      character: 'Clean · Refined',
    },
    mk60: {
      origin: 'Soviet Union',
      description: 'Soviet state-produced tape: high hiss, heavy wow & flutter and an aggressive high-frequency cut. Maximum Lo-Fi.',
      hiss: 'Very high',
      character: 'Lo-Fi · Heavy flutter',
    },
  },
}
