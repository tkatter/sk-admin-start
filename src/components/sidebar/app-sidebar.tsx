import * as React from "react";
import {
  CalendarClock,
  Contact,
  Database,
  GalleryVerticalEnd,
  ListChecks,
  WalletCards,
} from "lucide-react";

import CommandCenter from "~/components/sidebar/CommandCenter";
import { NavMain } from "~/components/sidebar/nav-main";
import { NavProjects } from "~/components/sidebar/nav-projects";
import { NavUser } from "~/components/sidebar/nav-user";
import { TeamSwitcher } from "~/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Thomas",
    email: "thomas@skcarpentry.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "SK Carpentry",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Schedule",
      url: "/schedule",
      icon: CalendarClock,
      isActive: true,
      items: [
        {
          title: "Upcoming",
          url: "/schedule",
        },
        {
          title: "Past",
          url: "/schedule/past",
        },
      ],
    },
    {
      title: "Bids",
      url: "/bids",
      icon: WalletCards,
      items: [
        {
          title: "In Progress",
          url: "/bids",
        },
        {
          title: "Submitted",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      icon: Database,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Plans",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Overhead",
          url: "#",
        },
      ],
    },
    {
      title: "Contacts",
      url: "#",
      icon: Contact,
      items: [
        {
          title: "Builders",
          url: "#",
        },
        {
          title: "Contractors",
          url: "#",
        },
        {
          title: "Subcontractors",
          url: "#",
        },
        {
          title: "Company",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Project 1",
      url: "#",
      icon: ListChecks,
    },
    {
      name: "Project 2",
      url: "#",
      icon: ListChecks,
    },
    {
      name: "Project 3",
      url: "#",
      icon: ListChecks,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <CommandCenter />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
