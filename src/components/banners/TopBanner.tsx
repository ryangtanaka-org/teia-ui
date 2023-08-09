import { useWindowScroll } from 'react-use'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import styles from '@style'
import type { WithChildren } from '@types'

export const TopBanner = ({
  children,
  color,
}: WithChildren<{ color?: string }>) => {
  const [visible, setVisible] = useState(true)
  const { y } = useWindowScroll()

  useEffect(() => {
    setVisible(y < 50)
  }, [y])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '40px', y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className={styles.banner}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
