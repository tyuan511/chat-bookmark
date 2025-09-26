import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Root() {
  const [count, setCount] = useState(0)

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">WXT + React111</h1>

      <Button type="button" onClick={() => setCount(count => count + 1)}>
        count is
        {' '}
        {count}
      </Button>

      <p>
        Edit
        {' '}
        <code>src/App.tsx</code>
        {' '}
        and save to test HMR
      </p>

      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
    </div>
  )
}
