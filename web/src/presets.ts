export interface TapePreset {
  id: string
  name: string
  era: string
  cover: string
  /** 低通截止频率（展示用） */
  lowpass: string
  /** 与仓库中 shell 脚本完全一致的 ffmpeg filter_complex 滤镜链 */
  filterComplex: string
}

/** 构建与 convert_cassette_*.sh 脚本一致的滤镜链 */
function buildFilter(noise: string, chain: string): string {
  return (
    'aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo[music];' +
    `aevalsrc=exprs='(random(0)-0.5)*${noise}|(random(1)-0.5)*${noise}':s=44100[static];` +
    '[music][static]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[mixed];' +
    `[mixed]${chain}[out]`
  )
}

/** 磁带产品名与滤镜参数；产地/描述/音色等可翻译文案位于 i18n 语言资源的 tapes 命名空间 */
export const TAPE_PRESETS: TapePreset[] = [
  {
    id: 'basf',
    name: 'BASF LH Extra C90',
    era: '1980s',
    cover: '/covers/basf.jpg',
    lowpass: '13 kHz',
    filterComplex: buildFilter(
      '0.009',
      'vibrato=f=2.3:d=0.022,vibrato=f=16.5:d=0.006,highpass=f=50,lowpass=f=13000,' +
        'equalizer=f=500:width_type=q:width=0.8:g=-1.2,equalizer=f=6000:width_type=q:width=0.7:g=-4'
    ),
  },
  {
    id: 'maxell',
    name: 'Maxell UD C90',
    era: '1970s-80s',
    cover: '/covers/maxell.jpg',
    lowpass: '15 kHz',
    filterComplex: buildFilter(
      '0.005',
      'vibrato=f=2.1:d=0.018,vibrato=f=13.5:d=0.004,highpass=f=35,lowpass=f=15000,' +
        'equalizer=f=150:width_type=q:width=1.0:g=2.5,equalizer=f=7000:width_type=q:width=0.8:g=-2.5'
    ),
  },
  {
    id: 'chf60',
    name: 'Sony CHF60 Type I Normal',
    era: '1978',
    cover: '/covers/chf60.jpg',
    lowpass: '13.5 kHz',
    filterComplex: buildFilter(
      '0.008',
      'vibrato=f=2.0:d=0.02,vibrato=f=14.0:d=0.005,highpass=f=45,lowpass=f=13500,' +
        'equalizer=f=250:width_type=q:width=1.0:g=1.5,equalizer=f=8000:width_type=q:width=0.7:g=-3'
    ),
  },
  {
    id: 'chf90',
    name: 'Sony CHF90',
    era: '1978',
    cover: '/covers/chf90.jpg',
    lowpass: '13.5 kHz',
    filterComplex: buildFilter(
      '0.008',
      'vibrato=f=2.0:d=0.025,vibrato=f=14.0:d=0.007,highpass=f=50,lowpass=f=13500,' +
        'equalizer=f=250:width_type=q:width=1.0:g=0.5,equalizer=f=8000:width_type=q:width=0.7:g=-3.5'
    ),
  },
  {
    id: 'tdk',
    name: 'TDK D90',
    era: '1995-1997',
    cover: '/covers/tdk.jpg',
    lowpass: '14.5 kHz',
    filterComplex: buildFilter(
      '0.006',
      'vibrato=f=1.8:d=0.015,vibrato=f=15.0:d=0.003,highpass=f=40,lowpass=f=14500,' +
        'equalizer=f=3000:width_type=q:width=0.5:g=1.5,equalizer=f=10000:width_type=q:width=0.7:g=-2'
    ),
  },
  {
    id: 'mk60',
    name: 'MK-60 (МК-60)',
    era: '1980s',
    cover: '/covers/mk60.jpg',
    lowpass: '9 kHz',
    filterComplex: buildFilter(
      '0.02',
      'vibrato=f=2.2:d=0.08,vibrato=f=16.0:d=0.02,highpass=f=75,lowpass=f=9000,' +
        'equalizer=f=400:width_type=q:width=1.0:g=4,equalizer=f=6000:width_type=q:width=0.8:g=-6'
    ),
  },
]
