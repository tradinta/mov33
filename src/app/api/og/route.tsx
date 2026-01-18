import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Untitled Event';
    const date = searchParams.get('date') || '';
    const location = searchParams.get('location') || '';
    const price = searchParams.get('price') || 'FREE';
    const ticketsSold = searchParams.get('ticketsSold') || '0';
    const imageUrl = searchParams.get('image') || '';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#0a0a0a',
                    position: 'relative',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Background Image with Overlay */}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt=""
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.4,
                        }}
                    />
                )}

                {/* Gradient Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.8) 50%, rgba(10,10,10,0.4) 100%)',
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '60px',
                        height: '100%',
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    {/* Logo/Brand */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 40,
                            left: 60,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F5D061 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 900,
                                fontSize: 24,
                                color: '#0a0a0a',
                            }}
                        >
                            M
                        </div>
                        <span style={{ color: '#D4AF37', fontWeight: 800, fontSize: 24, letterSpacing: '-0.05em' }}>
                            MOV33
                        </span>
                    </div>

                    {/* Social Proof Badge */}
                    {parseInt(ticketsSold) > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 40,
                                right: 60,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                background: 'rgba(255,255,255,0.1)',
                                padding: '8px 16px',
                                borderRadius: 50,
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <div style={{ display: 'flex', marginRight: 4 }}>
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #D4AF37 0%, #F97316 100%)',
                                            marginLeft: i === 1 ? 0 : -8,
                                            border: '2px solid #0a0a0a',
                                        }}
                                    />
                                ))}
                            </div>
                            <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>
                                +{ticketsSold} going
                            </span>
                        </div>
                    )}

                    {/* Event Title */}
                    <h1
                        style={{
                            fontSize: 72,
                            fontWeight: 900,
                            color: 'white',
                            margin: 0,
                            lineHeight: 1,
                            textTransform: 'uppercase',
                            letterSpacing: '-0.03em',
                            maxWidth: '90%',
                        }}
                    >
                        {title}
                    </h1>

                    {/* Meta Info */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 24,
                            marginTop: 24,
                            alignItems: 'center',
                        }}
                    >
                        {date && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background: 'rgba(212, 175, 55, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#D4AF37',
                                        fontSize: 20,
                                    }}
                                >
                                    📅
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, fontWeight: 600 }}>
                                    {date}
                                </span>
                            </div>
                        )}
                        {location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background: 'rgba(212, 175, 55, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#D4AF37',
                                        fontSize: 20,
                                    }}
                                >
                                    📍
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, fontWeight: 600 }}>
                                    {location}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Price Tag */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            marginTop: 32,
                        }}
                    >
                        <div
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F5D061 100%)',
                                padding: '12px 24px',
                                borderRadius: 16,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <span style={{ fontSize: 28, fontWeight: 900, color: '#0a0a0a' }}>
                                {price === 'FREE' ? 'FREE' : `KES ${price}`}
                            </span>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: 600 }}>
                            Starting from
                        </span>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
