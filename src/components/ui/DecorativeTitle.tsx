import { Fragment } from 'react'

interface DecorativeTitleProps {
  text?: string
  variant?: 'hero' | 'section'
}

interface HighlightPart {
  phrase: string
  className: string
}

const exactHighlights: Record<string, HighlightPart[]> = {
  'Where Culture, Creativity, and Community Take Root': [
    {
      phrase: 'Culture,',
      className: 'bg-gradient-to-r from-[#E9A907] to-yellow-300 bg-clip-text text-transparent',
    },
    {
      phrase: 'Creativity,',
      className: 'bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent',
    },
    {
      phrase: 'Take Root',
      className: 'relative inline-block after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-2 after:rounded-full after:bg-[#E9A907]',
    },
  ],
  'Preserving Heritage, Inspiring Unity': [
    {
      phrase: 'Heritage,',
      className: 'bg-gradient-to-r from-[#E9A907] to-yellow-300 bg-clip-text text-transparent',
    },
    {
      phrase: 'Unity',
      className: 'bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent',
    },
  ],
  'More Than a Foundation. A Global Movement.': [
    {
      phrase: 'Foundation.',
      className: 'bg-gradient-to-r from-[#E9A907] to-yellow-300 bg-clip-text text-transparent',
    },
    {
      phrase: 'Global Movement.',
      className: 'bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent',
    },
  ],
  'Together We Grow': [
    {
      phrase: 'Grow',
      className: 'bg-gradient-to-r from-green-500 to-lime-400 bg-clip-text text-transparent',
    },
  ],
  'Be the Rhythm.': [
    {
      phrase: 'Rhythm.',
      className: 'bg-gradient-to-r from-[#E9A907] to-lime-300 bg-clip-text text-transparent',
    },
  ],
  'Get in Touch': [
    {
      phrase: 'Touch',
      className: 'bg-gradient-to-r from-[#E9A907] to-lime-300 bg-clip-text text-transparent',
    },
  ],
  'Our Programs': [
    {
      phrase: 'Programs',
      className: 'bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent',
    },
  ],
  'Impact in Action': [
    {
      phrase: 'Action',
      className: 'bg-gradient-to-r from-[#E9A907] to-lime-300 bg-clip-text text-transparent',
    },
  ],
  'Stay Connected': [
    {
      phrase: 'Connected',
      className: 'bg-gradient-to-r from-[#E9A907] to-lime-300 bg-clip-text text-transparent',
    },
  ],
  'Our Impact in Numbers': [
    {
      phrase: 'Impact',
      className: 'bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent',
    },
  ],
  'Be Part of Our Story': [
    {
      phrase: 'Our Story',
      className: 'bg-gradient-to-r from-[#E9A907] to-lime-300 bg-clip-text text-transparent',
    },
  ],
}

const stopWords = new Set(['a', 'an', 'and', 'for', 'in', 'of', 'or', 'the', 'to', 'with'])

function renderExactHighlights(text: string, parts: HighlightPart[]) {
  const nodes: React.ReactNode[] = []
  let cursor = 0

  for (const [index, part] of parts.entries()) {
    const position = text.indexOf(part.phrase, cursor)

    if (position === -1) {
      return null
    }

    if (position > cursor) {
      nodes.push(<Fragment key={`text-${index}`}>{text.slice(cursor, position)}</Fragment>)
    }

    nodes.push(
      <span key={`highlight-${index}`} className={part.className}>
        {part.phrase}
      </span>
    )

    cursor = position + part.phrase.length
  }

  if (cursor < text.length) {
    nodes.push(<Fragment key="tail">{text.slice(cursor)}</Fragment>)
  }

  return nodes
}

function renderFallbackHighlight(text: string, variant: 'hero' | 'section') {
  const words = text.match(/\S+\s*/g)

  if (!words || words.length < 2) {
    return text
  }

  let highlightIndex = words.length - 1

  for (let index = words.length - 1; index >= 0; index -= 1) {
    const candidate = words[index].trim().replace(/[^a-zA-Z]/g, '').toLowerCase()

    if (candidate && !stopWords.has(candidate)) {
      highlightIndex = index
      break
    }
  }

  const highlightClass = variant === 'hero'
    ? 'bg-gradient-to-r from-[#E9A907] to-lime-300 bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent'

  return words.map((word, index) => (
    index === highlightIndex
      ? <span key={`fallback-${index}`} className={highlightClass}>{word}</span>
      : <Fragment key={`fallback-${index}`}>{word}</Fragment>
  ))
}

export default function DecorativeTitle({ text = '', variant = 'section' }: DecorativeTitleProps) {
  const exactMatch = exactHighlights[text]
  const content = exactMatch ? renderExactHighlights(text, exactMatch) : renderFallbackHighlight(text, variant)

  return <>{content}</>
}