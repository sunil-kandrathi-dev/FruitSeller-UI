import { Component, type ErrorInfo, type ReactNode } from 'react'

type RouteErrorBoundaryProps = { children: ReactNode; routePath: string }
type RouteErrorBoundaryState = { error: Error | null }

export default class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Page rendering failed:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#F6F7F2] p-6">
          <section className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold text-[#173D2B]">This page could not be displayed</h1>
            <p className="mt-2 text-xs text-gray-500">Route: {this.props.routePath}</p>
            <p className="mt-3 text-sm text-red-700">{this.state.error.message}</p>
            <a href="/dashboard" className="mt-5 inline-block rounded-xl bg-[#173D2B] px-4 py-3 text-sm font-semibold text-white">
              Return to dashboard
            </a>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
