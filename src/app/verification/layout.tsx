
export default function VerificationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-muted/40 min-h-screen">
            {children}
        </div>
    );
}
