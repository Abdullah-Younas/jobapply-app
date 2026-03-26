import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react'

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize, active }) {
  const ref = useRef(null)
  const isHovered = useMotionValue(0)

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize }
    return val - rect.x - baseItemSize / 2
  })

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize])
  const size = useSpring(targetSize, spring)

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-xl cursor-pointer outline-none border transition-colors duration-150 ${
        active
          ? 'bg-[#0e1f12] border-[#6a9e78]'
          : 'bg-[#0a0a0a] border-[#1a2e1e] hover:border-[#2e4e38]'
      } ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child => cloneElement(child, { isHovered }))}
    </motion.div>
  )
}

function DockLabel({ children, className = '', ...rest }) {
  const { isHovered } = rest
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = isHovered.on('change', latest => setIsVisible(latest === 1))
    return () => unsubscribe()
  }, [isHovered])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.15 }}
          className={`absolute top-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-pre rounded-md border border-[#1a2e1e] bg-[#0d160f] px-2 py-0.5 text-xs text-[#c9dcc8] font-mono z-50 ${className}`}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DockIcon({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-center text-[#6a9e78] ${className}`}>
      {children}
    </div>
  )
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
}) {
  const mouseX = useMotionValue(Infinity)
  const isHovered = useMotionValue(0)

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  )

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight])
  const height = useSpring(heightRow, spring)

  return (
    <motion.div
      style={{ height }}
      className="fixed bottom-0 left-0 right-0 flex items-end justify-center pb-2 z-50 pointer-events-none"
    >
      <motion.div
        onMouseMove={({ pageX }) => { isHovered.set(1); mouseX.set(pageX) }}
        onMouseLeave={() => { isHovered.set(0); mouseX.set(Infinity) }}
        className={`pointer-events-auto flex items-end gap-3 rounded-2xl border border-[#1a2e1e] bg-[#080808]/95 backdrop-blur-xl px-3 pb-2 shadow-2xl ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Navigation dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            active={item.active}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  )
}