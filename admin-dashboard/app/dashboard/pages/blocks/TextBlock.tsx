import { useState } from "react"
import { PageBlock } from "@/types"

interface Props {
  block: PageBlock
  onChange: (content: { title?: string; text: string }) => void
  onRemove: () => void
}

export default function TextBlock({
  block,
  onChange,
  onRemove,
}: Props) {

  const [title, setTitle] = useState(
    block.content?.title || ""
  )

  const [text, setText] = useState(
    block.content?.text || ""
  )

  return (
    <div className="bg-white p-2">

      <div className="flex justify-between mb-2">
        <strong>Text Block</strong>

        <button
          onClick={onRemove}
          className="text-red-600"
        >
          Remove
        </button>
      </div>

      <input
        className="w-full border p-1 mb-1 text-black"
        placeholder="Block title"
        value={title}
        onChange={e => {
          const v = e.target.value
          setTitle(v)
          onChange({ title: v, text })
        }}
      />

      <textarea
        className="w-full border p-2 text-black"
        placeholder="Block text"
        value={text}
        onChange={e => {
          const v = e.target.value
          setText(v)
          onChange({ title, text: v })
        }}
      />
    </div>
  )
}
