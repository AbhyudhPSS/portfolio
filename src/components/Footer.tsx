import { PERSON } from '../data/site'
import { useClock } from '../lib/hooks'
import { scrollToId } from '../lib/useLenis'
import './Footer.css'

export function Footer() {
  const clock = useClock(PERSON.timezone)
  const year = new Date().getFullYear()

  return (
    <footer className="footer" data-surface="void">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <p className="footer__name display">{PERSON.name}</p>
          <p className="footer__role mono">{PERSON.positioning}</p>
        </div>

        <dl className="footer__cols">
          <div>
            <dt className="mono">Local time</dt>
            <dd className="mono">
              {clock || '--:--:--'} {PERSON.tzLabel}
            </dd>
          </div>
        </dl>

        <div className="footer__base">
          <p className="mono">© {year} {PERSON.name}</p>
          <button
            type="button"
            className="footer__top mono hit-lg"
            onClick={() => scrollToId('top')}
            data-cursor="link"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
