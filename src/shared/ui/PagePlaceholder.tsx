type PagePlaceholderProps = {
  title: string
}

// Временная заглушка, пока экран не свёрстан по макету.
export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <main style={{ padding: 24 }}>
      <h1>{title}</h1>
      <p>Экран в разработке.</p>
    </main>
  )
}
