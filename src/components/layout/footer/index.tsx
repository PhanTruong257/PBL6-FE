import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex w-full max-w-screen-2xl mx-auto items-center justify-center px-0 sm:px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © 2024 PBL6 Learning Platform. Made by PBL6 - Group 1.
        </p>
      </div>
    </footer>
  )
}