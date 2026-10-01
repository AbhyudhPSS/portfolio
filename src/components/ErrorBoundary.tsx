import { Component, type ErrorInfo, type ReactNode } from 'react'
import { LINKS } from '../data/site'

const emailHref = LINKS.find((l) => l.label === 'Email')?.href ?? 'mailto:'

type Props = { children: ReactNode }
type State = { hasError: boolean }

/**
 * Last resort for a runtime throw in the tree below — without this, React
 * unmounts the whole app and the visitor is left looking at a blank page.
 * Deliberately styled inline rather than via a stylesheet: if a bundling or
 * CSS-loading fault is what triggered the crash, this still has to render.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error in render tree:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        role="alert"
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          background: '#131211',
          color: '#f1ede5',
          fontFamily:
            'ui-monospace, "SF Mono", Menlo, monospace',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '1.1rem' }}>Something broke loading this page.</p>
        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
          Try reloading — if it keeps happening, the fastest way to reach me is{' '}
          <a href={emailHref} style={{ color: '#c8f751' }}>
            email
          </a>
          .
        </p>
      </div>
    )
  }
}
