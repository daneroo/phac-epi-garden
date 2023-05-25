import React from 'react'
import { type DocsThemeConfig } from 'nextra-theme-docs'
import Image from "next/image";

const logo = (
  <span style={{ display: 'flex', alignItems: 'center' }}>
    <Image
      style={{ marginRight: '0.4rem' }}
      src="/images/epi-logo.svg"
      alt="Epi-Logo"
      width={32}
      height={32}
    />
    <span>Epi Docs</span>
  </span>
)

const config: DocsThemeConfig = {
  logo,
  project: {
    link: 'https://github.com/daneroo/phac-epi-garden',
  },
  docsRepositoryBase: 'https://github.com/daneroo/phac-epi-garden/tree/main/apps/epi-docs',
  footer: {
    text: 'Epicenter Docs',
  },
}

export default config
