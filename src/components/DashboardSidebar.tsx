import React from 'react';
import Link from 'next/link';
import { Users, Mic, Clock, Settings, TrendingUp, MessageSquare } from 'lucide-react';

interface SidebarProps {
    theme: string;
    currentPath: string;
    translations: {
        workspace: string;
        home: string;
        synthesis: string;
        voiceLab: string;
        history: string;
        apiSettings: string;
    };
}

export default function DashboardSidebar({ theme, currentPath, translations }: SidebarProps) {
    const borderClass = theme === 'light' ? 'border-neutral-300' : 'border-neutral-800';

    const isActive = (path: string) => currentPath === path;

    const SidebarItem = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => (
        <Link
            href={href}
            className={`w-full flex items-center gap-4 p-4 transition-colors ${isActive(href)
                ? (theme === 'light' ? 'bg-neutral-200 font-bold' : 'bg-neutral-800 font-bold')
                : 'hover:opacity-60'
                }`}
        >
            <Icon size={20} />
            <span className="font-mono text-xs tracking-wider uppercase hidden md:inline">{label}</span>
        </Link>
    );

    return (
        <aside className={`w-20 md:w-64 border-r ${borderClass} flex flex-col overflow-y-auto shrink-0 transition-colors duration-300`}>
            <div>
                <div className="p-6 hidden md:block">
                    <span className="text-xs font-mono opacity-40 uppercase">{translations.workspace}</span>
                </div>
                <nav className="flex flex-col">
                    <SidebarItem icon={TrendingUp} label={translations.home} href="/dashboard" />
                    <SidebarItem icon={Mic} label={translations.synthesis} href="/dashboard/synthesis" />
                    <SidebarItem icon={Users} label={translations.voiceLab} href="/dashboard/voices" />
                    <SidebarItem icon={MessageSquare} label="AI Chat" href="/dashboard/chat" />
                    <SidebarItem icon={Clock} label={translations.history} href="/dashboard/history" />
                    <SidebarItem icon={Settings} label={translations.apiSettings} href="/dashboard/settings" />
                </nav>
            </div>
        </aside>
    );
}
