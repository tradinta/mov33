
'use client';
import React, { useState, useCallback } from 'react';

type CollapsibleContextType = {
    openSections: Record<string, boolean>;
    toggleSection: (id: string) => void;
};

const CollapsibleContext = React.createContext<CollapsibleContextType | null>(null);

export const useCollapsible = (id: string) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    const Sub = useCallback(({ children }: { children: React.ReactNode }) => {
        const firstChild = React.Children.toArray(children)[0];
        if (React.isValidElement(firstChild)) {
            const newChild = React.cloneElement(firstChild as React.ReactElement, {
                onClick: (e: React.MouseEvent) => {
                    e.preventDefault();
                    toggle();
                },
                'data-state': isOpen ? 'open' : 'closed',
            });

            return (
                <div className="group" data-state={isOpen ? 'open' : 'closed'}>
                    {newChild}
                    {children && React.Children.count(children) > 1 && (
                         <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{
                            height: isOpen ? 'auto' : '0',
                         }}>
                            {React.Children.toArray(children).slice(1)}
                         </div>
                    )}
                </div>
            );
        }
        return null;
    }, [isOpen, toggle]);

    return {
        isSubOpen: isOpen,
        Sub,
    };
};
