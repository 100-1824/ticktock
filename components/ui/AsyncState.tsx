interface AsyncStateProps {
  loading: boolean
  error: string
  onRetry: () => void
  children: React.ReactNode
}

export default function AsyncState({ loading, error, onRetry, children }: AsyncStateProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button type="button" onClick={onRetry} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Try again
        </button>
      </div>
    )
  }

  return <>{children}</>
}
