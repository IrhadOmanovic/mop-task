import React from 'react'
import Image from 'next/image'

import styles from '../footer/Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a
        href='https://www.linkedin.com/in/irhad-omanovi%C4%87-62a310180/'
        target='_blank'
        rel='noopener noreferrer'
      >
        Made by Irhad omanović
        <span className={styles.logo}>
          <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
        </span>
      </a>
    </footer>
  )
}

export default Footer
