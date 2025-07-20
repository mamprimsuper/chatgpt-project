"use client"

import * as React from "react"

const ThemeProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode
}) => {
  return <>{children}</>
}

export { ThemeProvider }