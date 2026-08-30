import React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const ChameleonIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon viewBox='0 0 24 24' {...props}>
      {/* 
        Full Chameleon Silhouette Icon (Facing Right)
        Includes iconic spiraled tail, arched back, casque head, turret eye, legs, and perch line.
      */}
      {/* Perch Branch */}
      <line x1='2' y1='19' x2='22' y2='19' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' opacity='0.5' />

      {/* Full Body Silhouette */}
      <path
        d='M 5.8 18 C 4.5 18 3.5 16.8 3.8 15.3 C 4.1 13.8 5.5 13 6.8 13.4 C 7.5 13.6 7.7 14.4 7.2 14.9 C 6.7 15.4 5.8 15.2 5.4 14.6 C 5.0 14 4.4 14.4 4.2 15.2 C 4.0 16.0 4.8 16.6 5.8 16.6 C 7.0 16.6 8.0 15.6 8.4 14 C 9.0 11.6 9.8 7.5 12.8 4.5 C 15.0 2.2 17.8 3.0 19.5 5.0 C 21.0 7.0 22.4 9.0 23.0 10.0 C 23.4 10.5 23.2 11.3 22.4 11.6 C 20.4 12.4 18.2 12.6 16.7 12.8 L 17.3 17.8 L 15.7 17.8 L 15.2 13 L 13.2 13.3 L 12.8 17.8 L 11.2 17.8 L 11.6 13.4 C 10.2 13.2 9.0 12.8 8.4 12.4 Z'
        fill='currentColor'
        fillRule='evenodd'
      />

      {/* Conical Eye Turret Ring */}
      <circle cx='16.5' cy='7' r='2.6' fill='#1A1D28' />
      {/* Eye Turret Iris */}
      <circle cx='16.5' cy='7' r='1.6' fill='currentColor' />
      {/* Eye Turret Pupil */}
      <circle cx='17.1' cy='6.8' r='0.7' fill='#1A1D28' />
    </SvgIcon>
  )
}

export default ChameleonIcon
