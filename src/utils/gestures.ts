export const gestures = {
  Alpha: {
    description: 'Closed fist',
    landmarks: {
      index: { '8.y': '> 6.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
      thumb: { '4.y': '> 2.y' },
    },
  },
  Beta: {
    description: 'Flat palm, all fingers extended',
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '< 10.y' },
      ring: { '16.y': '< 14.y' },
      pinky: { '20.y': '< 18.y' },
      thumb: { '4.y': '< 2.y' },
    },
  },
  Gamma: {
    description: "Hand in a 'C' shape",
    landmarks: {
      thumb: { '4.x': '≈ 8.x', '4.y': '≈ 8.y' },
      middle: { '12.y': '< 10.y' },
      ring: { '16.y': '< 14.y' },
      pinky: { '20.y': '< 18.y' },
    },
  },
  Delta: {
    description: 'Open hand with extended index and thumb',
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
      thumb: { '4.y': '< 2.y' },
    },
  },
  Epsilon: {
    description: 'Three fingers extended, thumb curled',
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '< 10.y' },
      ring: { '16.y': '< 14.y' },
      pinky: { '20.y': '> 18.y' },
      thumb: { '4.y': '> 2.y' },
    },
  },
  Zeta: {
    description: 'Peace sign',
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '< 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
      thumb: { '4.y': '< 2.y' },
    },
  },
  Eta: {
    description: 'Index and pinky extended, other fingers curled',
    landmarks: {
      index: { '8.y': '< 6.y' },
      pinky: { '20.y': '< 18.y' },
      thumb: { '4.y': '> 2.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
    },
  },
  Theta: {
    description: 'Hand in a fist, with thumb extending out sideways',
    landmarks: {
      thumb: { '4.y': '> 2.y', '4.x': '< 8.x' },
      index: { '8.y': '> 6.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
    },
  },
  Iota: {
    description: 'Straight finger with all others curled',
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
      thumb: { '4.y': '> 2.y' },
    },
  },
  Kappa: {
    description: 'K shape with thumb and index finger extended',
    landmarks: {
      index: { '8.y': '< 6.y' },
      thumb: { '4.y': '< 2.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
    },
  },
  Lambda: {
    description: "Hand in 'L' shape",
    landmarks: {
      index: { '8.y': '< 6.y' },
      thumb: { '4.y': '< 2.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
    },
  },
  Mu: {
    description: 'Index, middle, and ring extended (like three fingers in a fist)',
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '< 10.y' },
      ring: { '16.y': '< 14.y' },
      pinky: { '20.y': '> 18.y' },
      thumb: { '4.y': '> 2.y' },
    },
  },
  Nu: {
    description: 'Open palm with thumb extended',
    landmarks: {
      index: { '8.y': '< 6.y' },
      thumb: { '4.y': '< 2.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
    },
  },
  Xi: {
    description: 'Fingers curled with a slight open position',
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '< 10.y' },
      ring: { '16.y': '< 14.y' },
      pinky: { '20.y': '< 18.y' },
      thumb: { '4.y': '< 2.y' },
    },
  },
  Omicron: {
    description: 'Open hand with a slight curve',
    landmarks: {
      index: { '8.y': '> 6.y' },
      middle: { '12.y': '< 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '< 18.y' },
      thumb: { '4.y': '> 2.y' },
    },
  },
  Pi: {
    description: 'Closed fist with thumb extended',
    landmarks: {
      index: { '8.y': '> 6.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
      thumb: { '4.y': '< 2.y' },
    },
  },
  Rho: {
    description: 'Curled fist with index extended',
    landmarks: {
      index: { '8.y': '< 6.y' },
      thumb: { '4.y': '< 2.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
    },
  },
  Sigma: {
    description: 'All fingers extended in a circle shape',
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '< 10.y' },
      ring: { '16.y': '< 14.y' },
      pinky: { '20.y': '< 18.y' },
      thumb: { '4.y': '< 2.y' },
    },
  },
  Tau: {
    description: 'Open hand with index and thumb extended',
    landmarks: {
      index: { '8.y': '< 6.y' },
      thumb: { '4.y': '< 2.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
    },
  },
  Upsilon: {
    description: 'Hand in a V shape with thumb extended',
    landmarks: {
      index: { '8.y': '< 6.y' },
      thumb: { '4.y': '< 2.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
    },
  },
  Phi: {
    description: 'Closed fist with thumb extending sideways',
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '< 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
      thumb: { '4.y': '< 2.y' },
    },
  },
  Chi: {
    description: 'Crossed fingers gesture',
    landmarks: {
      index: { '8.y': '< 6.y' },
      thumb: { '4.y': '< 2.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '> 18.y' },
    },
  },
  Psi: {
    description: 'Sign language Y shape',
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '> 10.y' },
      ring: { '16.y': '> 14.y' },
      pinky: { '20.y': '< 18.y' },
      thumb: { '4.y': '< 2.y' },
    },
  },
  Omega: {
    description: "Open hand with finger positions in a wide 'O' shape",
    landmarks: {
      index: { '8.y': '< 6.y' },
      middle: { '12.y': '< 10.y' },
      ring: { '16.y': '< 14.y' },
      pinky: { '20.y': '< 18.y' },
      thumb: { '4.y': '< 2.y' },
    },
  },
}
