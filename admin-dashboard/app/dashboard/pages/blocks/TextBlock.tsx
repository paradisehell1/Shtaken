import { useState, useEffect } from "react"
import { PageBlock } from "@/types"

interface Props {
  block: PageBlock
  onChange: (content: { title?: string; text: string }) => void
  onRemove: () => void
}

export default function TextBlock({ block, onChange, onRemove }: Props) {
  const [title, setTitle] = useState(block.content?.title || "")
  const [text, setText] = useState(
    typeof block.content === "string" ? block.content : block.content?.text || ""
  )

  // синхронизация с родителем
  useEffect(() => {
    onChange({ title, text })
  }, [title, text])

  return (
    <div className="border p-2 rounded mb-2 bg-white">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Text Block</span>
        <button onClick={onRemove} className="text-red-500 font-bold">Remove</button>
      </div>
      <input
        className="w-full border p-1 rounded mb-1 text-black"
        placeholder="Block title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded text-black"
        placeholder="Block text"
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  )
}
