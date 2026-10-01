import { motion } from 'motion/react'
import { PERSON } from '../data/site'
import { useReducedMotion } from '../lib/hooks'
import './LedgeFigure.css'

/**
 * A real photo, not the ASCII treatment — a genuine cutout (true alpha
 * transparency, no baked-in background) perched on the section's own
 * divider rule, straddling the dark-to-paper transition. One deliberately
 * un-technical, human moment among all the schematic artwork.
 *
 * The positioning transform lives on a plain wrapper `div`, not the
 * `motion.img` itself — Motion writes its own `y`/`opacity` animation
 * straight to the element's inline `transform`, which would otherwise
 * silently overwrite the CSS transform that actually seats the figure on
 * the rule.
 */
export function LedgeFigure() {
  const reduce = useReducedMotion()

  return (
    <div className="ledge-figure">
      <motion.img
        src={PERSON.photos.ledge}
        alt={`${PERSON.name}, leaning back`}
        width={PERSON.photoSizes.ledge.width}
        height={PERSON.photoSizes.ledge.height}
        loading="lazy"
        decoding="async"
        initial={reduce ? undefined : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
