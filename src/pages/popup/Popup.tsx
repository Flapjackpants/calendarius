import React from 'react'
import { Button } from '../../components/ui/button'

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Calendarius</h1>
      <Button onClick={() => console.log('Screenshot logic here')}>Screenshot</Button>
    </div>
  )
}