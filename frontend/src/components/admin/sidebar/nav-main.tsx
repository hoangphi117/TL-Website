import { Link, useLocation } from "react-router-dom"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const isActive = pathname === item.url

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
                className="data-[active=true]:bg-blue-100
                          data-[active=true]:border-l-4
                          data-[active=true]:border-blue-600
                          data-[active=true]:text-blue-500
                          data-[active=true]:font-bold"

              >
                <Link to={item.url} className="flex items-center gap-2">
                  {item.icon && <item.icon className="!h-6 !w-6"/>}
                  <span className="text-lg data-[active=true]:text-blue-400">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
