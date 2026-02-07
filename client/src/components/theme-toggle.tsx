import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  console.log('ThemeToggle rendered, current theme:', theme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => { console.log('Setting theme to light'); setTheme("light") }}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { console.log('Setting theme to dark'); setTheme("dark") }}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { console.log('Setting theme to system'); setTheme("system") }}>
          System
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { 
          console.log('Force setting to dark'); 
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add('dark');
        }}>
          Force Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}