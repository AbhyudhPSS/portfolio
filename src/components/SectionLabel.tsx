import { Rule } from './Reveal'

/**
 * The rule + index + name that opens every section.
 *
 * `heading` promotes the name to an <h2> for sections whose main heading is
 * the label itself (Work, Log, Positions). Sections that already open with a
 * display <h2> leave it as a plain span so the document never gains two.
 */
export function SectionLabel({
  n,
  name,
  meta,
  heading = false,
}: {
  n: string
  name: string
  meta?: string
  heading?: boolean
}) {
  const Name = heading ? 'h2' : 'span'

  return (
    <div className="section-label-wrap">
      <Rule />
      <div className="section-label">
        <span className="section-label__n">[{n}]</span>
        <Name className="section-label__name">{name}</Name>
        {meta && <span className="section-label__meta">{meta}</span>}
      </div>
    </div>
  )
}
