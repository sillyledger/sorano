import { createClient } from '@supabase/supabase-js'
import BoardClient from './BoardClient'

export async function generateMetadata({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: board } = await supabase
    .from('boards')
    .select('name, slug, description')
    .eq('slug', params.slug)
    .single()

  const name = board?.name || 'Sorano board'
  const slug = board?.slug || params.slug
  const description = board?.description || 'Public roadmap & changelog'

  return {
    title: `${name} — Sorano`,
    description,
    openGraph: {
      title: name,
      description,
      url: `https://sorano.space/${slug}`,
      siteName: 'Sorano',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
    },
  }
}

export default function BoardPage({ params }) {
  return <BoardClient params={params} />
}
