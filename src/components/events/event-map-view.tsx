'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Calendar, Users, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Event } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface EventMapViewProps {
    events: Event[];
    onEventSelect?: (event: Event) => void;
}

// Kenya counties with approximate coordinates
const KENYA_COUNTIES: Record<string, { lat: number; lng: number }> = {
    'Nairobi': { lat: -1.2921, lng: 36.8219 },
    'Mombasa': { lat: -4.0435, lng: 39.6682 },
    'Kisumu': { lat: -0.1022, lng: 34.7617 },
    'Nakuru': { lat: -0.3031, lng: 36.0800 },
    'Eldoret': { lat: 0.5143, lng: 35.2698 },
    'Naivasha': { lat: -0.7172, lng: 36.4320 },
    'Nyeri': { lat: -0.4197, lng: 36.9553 },
    'Malindi': { lat: -3.2192, lng: 40.1169 },
    'Diani': { lat: -4.2767, lng: 39.5880 },
    'Machakos': { lat: -1.5177, lng: 37.2634 },
    'Thika': { lat: -1.0334, lng: 37.0690 },
    'Kiambu': { lat: -1.1714, lng: 36.8356 },
    'Lamu': { lat: -2.2686, lng: 40.9020 },
    'Nanyuki': { lat: 0.0065, lng: 37.0722 },
    'Kericho': { lat: -0.3689, lng: 35.2863 },
};

export function EventMapView({ events, onEventSelect }: EventMapViewProps) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);

    // Group events by location
    const eventsByLocation = events.reduce((acc, event) => {
        const location = event.location || 'Unknown';
        if (!acc[location]) {
            acc[location] = [];
        }
        acc[location].push(event);
        return acc;
    }, {} as Record<string, Event[]>);

    const getMarkerPosition = (location: string) => {
        // Try to find county coordinates
        for (const [county, coords] of Object.entries(KENYA_COUNTIES)) {
            if (location.toLowerCase().includes(county.toLowerCase())) {
                return coords;
            }
        }
        // Default to Nairobi if not found
        return KENYA_COUNTIES['Nairobi'];
    };

    const handleMarkerClick = (event: Event) => {
        setSelectedEvent(event);
        onEventSelect?.(event);
    };

    return (
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'rounded-3xl overflow-hidden'}`}>
            {/* Map Container */}
            <div
                ref={mapRef}
                className={`relative bg-gradient-to-br from-obsidian via-zinc-900 to-obsidian ${isFullscreen ? 'h-screen' : 'h-[500px]'
                    }`}
            >
                {/* Map Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Kenya Outline (Simplified) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <svg viewBox="0 0 400 400" className="w-full h-full max-w-[600px] max-h-[500px]">
                        <path
                            d="M200,50 L280,80 L320,150 L350,220 L320,300 L250,350 L150,350 L80,300 L50,220 L80,150 L120,80 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gold"
                        />
                    </svg>
                </div>

                {/* Event Markers */}
                {Object.entries(eventsByLocation).map(([location, locationEvents]) => {
                    const coords = getMarkerPosition(location);
                    // Convert coordinates to percentage position on the map
                    // This is a simplified projection for Kenya's approximate bounding box
                    const x = ((coords.lng - 33.5) / (42 - 33.5)) * 100;
                    const y = ((5 - coords.lat) / (5 - (-5))) * 100;

                    return (
                        <motion.div
                            key={location}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute cursor-pointer group"
                            style={{ left: `${x}%`, top: `${y}%` }}
                            onClick={() => handleMarkerClick(locationEvents[0])}
                        >
                            {/* Pulse Ring */}
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -inset-4 bg-gold/20 rounded-full"
                            />

                            {/* Marker */}
                            <div className="relative">
                                <div className="h-8 w-8 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/30 border-2 border-white/20 group-hover:scale-110 transition-transform">
                                    <MapPin className="h-4 w-4 text-obsidian" />
                                </div>

                                {/* Event Count Badge */}
                                {locationEvents.length > 1 && (
                                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-kenyan-green rounded-full flex items-center justify-center text-[10px] font-black text-white border border-white/20">
                                        {locationEvents.length}
                                    </div>
                                )}

                                {/* Location Label */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-obsidian/80 px-2 py-1 rounded-full">
                                        {location}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Fullscreen Toggle */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="absolute top-4 right-4 h-10 w-10 rounded-xl bg-obsidian/80 border-white/10 text-white hover:bg-white/10"
                >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-obsidian/80 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Events on Map</div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-gold rounded-full" />
                            <span className="text-xs text-white/60">{events.length} Events</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-kenyan-green rounded-full" />
                            <span className="text-xs text-white/60">{Object.keys(eventsByLocation).length} Locations</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Preview Card */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`absolute ${isFullscreen ? 'bottom-8 left-8 right-8 max-w-md' : 'bottom-4 left-4 right-4'}`}
                    >
                        <Card className="bg-obsidian/95 backdrop-blur-xl border-white/10 p-4 flex gap-4">
                            {/* Event Image */}
                            <div className="relative h-24 w-24 rounded-xl overflow-hidden flex-shrink-0">
                                <Image
                                    src={selectedEvent.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                                    alt={selectedEvent.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Event Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-black text-sm uppercase italic tracking-tight text-white truncate">
                                        {selectedEvent.title}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedEvent(null)}
                                        className="h-6 w-6 rounded-full text-white/40 hover:text-white hover:bg-white/10 flex-shrink-0"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-3 mt-2 text-white/60">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3 text-gold" />
                                        <span className="text-[10px] font-medium">
                                            {format(selectedEvent.date?.toDate ? selectedEvent.date.toDate() : new Date(), 'MMM d')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-gold" />
                                        <span className="text-[10px] font-medium truncate">{selectedEvent.location}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    <span className="font-black text-gold italic">
                                        {selectedEvent.price === 0 ? 'FREE' : `KES ${selectedEvent.price.toLocaleString()}`}
                                    </span>
                                    <Link href={`/events/${selectedEvent.slug || selectedEvent.id}`}>
                                        <Button size="sm" className="h-8 bg-gold text-obsidian font-black uppercase text-[10px] tracking-widest rounded-lg px-4">
                                            View <ChevronRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
