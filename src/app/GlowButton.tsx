import React from 'react'
import './globals.css'

const GlowButton = () => {
  return (
    <button className="btn-101">
    Glow Button
    <svg>
    <defs>
      <filter id="glow">
        <feGaussianBlur result="coloredBlur" stdDeviation="5"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="coloredBlur"></feMergeNode>
          <feMergeNode in="coloredBlur"></feMergeNode>
          <feMergeNode in="coloredBlur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    </defs>
    <rect />
  </svg>
  </button>
  
  )
}

export default GlowButton