'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

interface InsightsProps {
    stats: {
        totalTickets: number;
        ticketsSold: number;
        revenue: number;
    }
}

export function InsightsPanel({ stats }: InsightsProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const remaining = stats.totalTickets > 0 ? stats.totalTickets - stats.ticketsSold : 100; // Mock 100 capacity fallback
    const sold = stats.ticketsSold > 0 ? stats.ticketsSold : 0;

    // Ensure we don't show an empty chart if no data
    const chartData = [
        { name: 'Sold', value: sold || 30 }, // Fallback for visual demo
        { name: 'Remaining', value: remaining || 70 },
    ];

    const COLORS = ['#D4AF37', '#27272a']; // Gold & Zinc-800

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Insights</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            {/* Performance Card */}
            <Card className="bg-zinc-900/50 border-white/5 rounded-[2rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold text-white/70">Performance</CardTitle>
                    <div className="flex items-center gap-1 text-[10px] uppercase font-black text-kenyan-green bg-kenyan-green/10 px-2 py-1 rounded-full">
                        <ArrowUpRight className="h-3 w-3" /> Trends
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Centered Percentage */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-white">
                                {Math.round((sold / (sold + remaining)) * 100)}%
                            </span>
                            <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Sold</span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl">
                            <div className="h-2 w-2 rounded-full bg-gold" />
                            <div>
                                <div className="text-[10px] text-white/40 uppercase font-bold">Completed</div>
                                <div className="text-sm font-black text-white">{sold} Sales</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl">
                            <div className="h-2 w-2 rounded-full bg-zinc-700" />
                            <div>
                                <div className="text-[10px] text-white/40 uppercase font-bold">Pending</div>
                                <div className="text-sm font-black text-white">{remaining} Left</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Calendar Widget */}
            <Card className="bg-zinc-900/50 border-white/5 rounded-[2rem] p-4 flex-grow">
                <div className="mb-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                        <CalendarIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-white/70">Schedule</span>
                </div>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-xl border-none w-full text-white"
                    classNames={{
                        day_selected: "bg-gold text-obsidian font-bold hover:bg-gold hover:text-obsidian focus:bg-gold focus:text-obsidian",
                        day_today: "bg-white/10 text-white font-bold",
                    }}
                />
            </Card>
        </div>
    );
}
