export default {
  hero: {
    kicker: 'FFMPEG.WASM · 浏览器本地处理 · 无需上传服务器',
    sub: '选一盘经典磁带，为你的数字音频注入真实的模拟质感 —— 磁带底噪、抖晃（Wow & Flutter）、频宽限制与年代染色，全部在浏览器中完成。',
  },
  engine: {
    loading: '⏳ 音频引擎加载中…（首次约 30 MB，请稍候）',
    ready: '● 音频引擎就绪',
    error: '⚠ 引擎加载失败，请检查网络后刷新页面',
    retry: '↻ 重试',
  },
  steps: {
    upload: '上传音频',
    tape: '选择磁带',
    convert: '开始转换',
    result: '试听与下载',
  },
  upload: {
    title: '拖拽音频到此处，或点击选择文件',
    hint: '支持 MP3 / OGG / M4A / AAC，最大 {{max}} MB',
    change: '{{size}} · 点击可更换文件',
    ariaLabel: '上传音频文件',
    badFormat: '不支持的格式 .{{ext}}，请上传 {{list}} 文件',
    tooLarge: '文件超过 {{max}} MB，浏览器内转换可能失败，请压缩后重试',
  },
  tape: {
    loaded: '已装入 ▶',
    hiss: '底噪',
    coverAlt: '{{name}} 磁带实物封面照片',
  },
  convert: {
    button: '⏺ 录制到 {{name}}',
    converting: '转换中… {{pct}}%',
    hint: '请先在上方上传一个音频文件',
    failed: '转换失败，请重试',
    failedReason: '转换失败：{{reason}}',
    failedIncomplete:
      '这个文件的音频数据不完整：标签声称音频从第 {{start}} 字节开始，但文件只有 {{size}} 字节。请重新下载或重新导出该音频后再试。',
  },
  player: {
    listening: '正在试听',
    original: '原始',
    converted: '磁带效果',
    originalAudio: '原始音频',
    convertedAudio: '磁带效果',
    download: '⬇ 下载 MP3',
    play: '播放',
    pause: '暂停',
    seek: '播放进度',
    abToggle: '对比切换',
  },
  share: {
    button: '🔗 复制分享链接',
    copied: '✓ 链接已复制',
  },
  langSwitch: '切换语言',
  nav: {
    home: '首页',
    about: '关于本站',
    privacy: '隐私政策',
    back: '← 返回首页',
  },
  content: {
    howTitle: '磁带音效是如何模拟的？',
    howIntro:
      '本站不使用简单的"滤镜叠加"，而是基于对实体磁带的频响、底噪与抖晃特性测量，用 ffmpeg 滤镜链逐一还原卡式磁带回放链路中的物理现象。每种磁带的参数都独立校准，对应其真实的带基材质与年代工艺。',
    how1Title: '磁带底噪（Tape Hiss）',
    how1:
      '磁性颗粒的随机磁化会产生持续的宽频"嘶嘶"声。我们按各磁带的实际信噪比生成对应强度的立体声白噪声，与音乐混合——苏联 MK-60 的底噪强度约是 Maxell UD 的 4 倍，这正是廉价带与高级带最直观的差距。',
    how2Title: '抖晃（Wow & Flutter）',
    how2:
      '磁带机的转速永远不可能绝对恒定：主轴偏心带来约 2 Hz 的缓慢音高波动（Wow），压带轮与导带机构则产生 13–16 Hz 的快速颤动（Flutter）。我们用两级 vibrato 滤镜分别模拟这两种周期性音高调制，深度参数对应各型号的实测抖晃率。',
    how3Title: '频宽限制与 EQ 染色',
    how3:
      '普通位（Type I）磁带的高频响应在 9–15 kHz 之间衰减，低频下潜也受磁头与带速制约。高通、低通与多段均衡器共同构成每种磁带独有的"音色指纹"——比如 BASF 的暗厚、TDK 后期的干净、MK-60 激进的 9 kHz 高切。',
    historyTitle: '卡式磁带小百科',
    history1:
      '卡式磁带（Compact Cassette）由飞利浦于 1963 年发布，凭借开放授权迅速成为全球标准，在 1970–1990 年代成为最普及的音乐载体。磁带按带基材质分为四类：Type I（普通位/氧化铁）、Type II（铬带）、Type III（铁铬带）与 Type IV（金属带），本站收录的 6 款均为最常见的 Type I。',
    history2:
      '不同厂牌与年代的磁带有着截然不同的声音个性：德国 BASF 以厚重的中低频著称；日本 Maxell UD 与 TDK D 系列代表了普通位磁带的工艺巅峰；索尼 CHF 是 70 年代末的国民型号；而苏联国营工厂的 MK-60 则因高底噪与重抖晃，成为如今 Lo-Fi 音乐人追捧的"缺陷美学"代表。选一盘磁带，听听年代的声音。',
    faqTitle: '常见问题',
    faq: [
      {
        q: '我的音频文件会被上传到服务器吗？',
        a: '不会。本站基于 ffmpeg.wasm 技术，音频的解码、滤镜处理与编码全部在你的浏览器本地完成，文件从始至终不离开你的设备，也不经过任何服务器。',
      },
      {
        q: '支持哪些音频格式？文件大小有限制吗？',
        a: '支持 MP3、OGG、M4A、AAC 四种常见格式，单个文件最大 100 MB。转换结果统一输出为 192 kbps 的 MP3 文件。',
      },
      {
        q: '为什么第一次打开页面加载比较慢？',
        a: '首次访问需要下载约 30 MB 的 ffmpeg.wasm 音频引擎（从 CDN 加载）。浏览器会缓存该文件，之后再次访问会快很多。',
      },
      {
        q: '磁带效果的参数是怎么来的？',
        a: '每种磁带的底噪强度、抖晃频率与深度、频宽上限和均衡曲线，均参考实体磁带的公开测量数据与实际听感校准得出，并与开源项目 Audio-Cassette-Simulation 中的 ffmpeg 脚本参数保持一致。',
      },
      {
        q: '转换一首歌需要多长时间？',
        a: '取决于你的设备性能。在现代电脑上转换速度通常可达实际时长的几十倍（例如 4 分钟的歌曲约需几秒到几十秒）；手机上会稍慢一些。',
      },
      {
        q: '这个工具是免费的吗？',
        a: '完全免费，无需注册。本站是开源磁带模拟项目的网页版实现，通过展示广告维持运营。',
      },
    ],
    disclaimer:
      '本站与文中提及的 BASF、Maxell、Sony、TDK 等品牌无任何关联，品牌名称仅用于描述被模拟磁带的声学特征。',
  },
  about: {
    seoTitle: '关于本站 · Cassette Simulator 磁带模拟器',
    seoDescription:
      '了解 Cassette Simulator 磁带模拟器：一个基于 ffmpeg.wasm 的免费在线工具，在浏览器本地为音频添加 6 种经典卡式磁带的复古音效。',
    title: '关于本站',
    p1: 'Cassette Simulator 是开源项目 Audio-Cassette-Simulation 的网页版实现。原项目使用 Bash 与 ffmpeg 脚本在命令行中模拟经典卡式磁带的声学特性；本站将同一套滤镜参数移植到浏览器中，让不熟悉命令行的用户也能一键获得真实的磁带质感。',
    p2: '我们收录了 6 款具有代表性的 Type I 磁带：德国 BASF LH Extra C90、日本 Maxell UD C90、索尼 CHF60 与 CHF90（1978）、磁带末期的 TDK D90（1995–1997），以及苏联国营工厂的 MK-60。每款磁带的底噪、抖晃、频宽与均衡染色均独立建模，参数与原项目的 ffmpeg 脚本完全一致。',
    p3: '本站采用 ffmpeg.wasm 纯前端架构：音频的全部处理均在你的浏览器本地完成，不上传任何文件，不收集任何音频数据。这既是技术选择，也是我们对隐私的承诺。',
    contactTitle: '联系我们',
    contact: '如有问题、建议或合作意向，欢迎通过 GitHub 项目页面提交 Issue 与我们联系。',
  },
  privacy: {
    seoTitle: '隐私政策 · Cassette Simulator 磁带模拟器',
    seoDescription:
      'Cassette Simulator 磁带模拟器的隐私政策：音频文件全程浏览器本地处理、绝不上传；关于 Cookie、本地存储与 Google AdSense 广告的详细说明。',
    title: '隐私政策',
    updated: '最后更新：2026 年 7 月',
    intro:
      '本隐私政策说明 Cassette Simulator（以下简称"本站"）如何处理你的信息。使用本站即表示你同意本政策所述的做法。',
    sections: [
      {
        h: '音频文件的处理',
        p: '你上传的音频文件仅在你的浏览器内存中处理，全部转换由本地运行的 ffmpeg.wasm 引擎完成。音频文件不会被上传到本站服务器或任何第三方服务器，我们无法访问、存储或分析你的音频内容。关闭页面后，相关数据即从内存中释放。',
      },
      {
        h: 'Cookie 与本地存储',
        p: '本站使用浏览器的 localStorage 保存你的语言偏好（中文/英文），该数据仅存储在你的设备上。本站自身不使用 Cookie 追踪用户行为。',
      },
      {
        h: '广告服务（Google AdSense）',
        p: '本站使用 Google AdSense 展示广告。Google 及其合作供应商作为第三方供应商，会使用 Cookie（包括 DART Cookie）根据你先前对本站及其他网站的访问记录投放个性化广告。你可以访问 Google 广告设置（adssettings.google.com）停用个性化广告，或访问 www.aboutads.info 了解如何停用第三方供应商的个性化广告 Cookie。',
      },
      {
        h: '访问日志与统计',
        p: '本站托管于 Vercel 与 Cloudflare Pages。托管平台可能会为安全与运维目的记录匿名化的访问日志（如 IP 地址、访问时间、浏览器类型）。这些日志由托管平台按其各自的隐私政策管理，本站不额外部署行为分析工具。',
      },
      {
        h: '第三方资源',
        p: '页面会从 CDN（unpkg / jsDelivr）加载 ffmpeg.wasm 引擎文件，从 Google Fonts 加载字体。这些请求会向对应服务商暴露你的 IP 地址等标准 HTTP 信息，其处理方式受各服务商隐私政策约束。',
      },
      {
        h: '儿童隐私',
        p: '本站面向普通用户，不针对 13 岁以下儿童，也不会有意收集儿童的个人信息。',
      },
      {
        h: '政策更新',
        p: '我们可能不时更新本政策，更新后会在本页面标注最新修订日期。重大变更将在网站显著位置提示。',
      },
      {
        h: '联系方式',
        p: '如对本隐私政策有任何疑问，可通过 GitHub 项目页面提交 Issue 与我们联系。',
      },
    ],
  },

  footer: {
    text: '基于 <0>Audio-Cassette-Simulation</0> 项目的 ffmpeg 磁带参数 · 音频全程本地处理，不会上传到任何服务器',
  },
  seo: {
    title: 'Cassette Simulator 磁带模拟器 · 在线卡带音效转换（ffmpeg.wasm）',
    tapeTitle: '{{name}} 磁带音效模拟 · Cassette Simulator 磁带模拟器',
    description:
      '免费在线磁带模拟器：上传 MP3/OGG/M4A/AAC 音频，选择 BASF、Maxell、Sony CHF、TDK、苏联 MK-60 等 6 种经典磁带，一键生成带磁带底噪、抖晃与年代染色的复古音效。基于 ffmpeg.wasm 浏览器本地处理，无需上传服务器。',
    tapeDescription:
      '在线模拟 {{name}} 磁带音效：{{desc}}上传音频即可在浏览器本地生成复古磁带质感，支持试听对比与 MP3 下载。',
    keywords:
      '磁带模拟器,卡带音效,磁带音效在线,复古音效,Lo-Fi,磁带底噪,抖晃,wow flutter,ffmpeg.wasm,BASF,Maxell,Sony CHF60,TDK D90,MK-60',
  },
  tapes: {
    basf: {
      origin: '德国',
      description: '德系铁氧体磁带，中等底噪与轻微抖晃，高频衰减明显，声音偏暗且厚重。',
      hiss: '中等',
      character: '偏暗 · 厚重',
    },
    maxell: {
      origin: '日本',
      description: '高级铁氧体磁带，全系列中底噪最低、频响最宽，低频饱满，声音干净通透。',
      hiss: '很低',
      character: '干净 · 低频饱满',
    },
    chf60: {
      origin: '日本',
      description: '索尼 70 年代末主流普通位磁带，60 分钟版带基更厚，中低频温暖，音高稳定。',
      hiss: '中等',
      character: '温暖 · 稳定',
    },
    chf90: {
      origin: '日本',
      description: '90 分钟版带基更薄，转速漂移略大于 CHF60，音色相近但抖晃感稍重。',
      hiss: '中等',
      character: '温暖 · 微漂移',
    },
    tdk: {
      origin: '日本',
      description: '磁带末期的 Type I 产品，声音干净细腻，仅保留细微的模拟质感。',
      hiss: '低',
      character: '干净 · 细腻',
    },
    mk60: {
      origin: '苏联',
      description: '苏联国营磁带，高底噪、重抖晃、激进的高频切除，Lo-Fi 质感拉满。',
      hiss: '很高',
      character: 'Lo-Fi · 重抖晃',
    },
  },
}
