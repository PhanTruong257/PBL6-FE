import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-2xl px-4 py-6">
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2024 PBL6 Learning Platform. Made by PBL6 - Group 1.
          </p>
        </div>
      </div>
    </footer>
  )
}
