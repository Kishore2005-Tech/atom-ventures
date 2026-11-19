import * as React from 'react'

const MOBILE_BREAKPOINT = 768


  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    
    
  }, [])

  return !!isMobile
}
