'use client';

import React, { useState, useCallback } from 'react';

export const useCollapsible = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    const Sub = useCallback(
        ({ children }: { children: React.ReactNode }) => {
            const childrenArray = React.Children.toArray(children);
            const firstChild = childrenArray[0];

            if (React.isValidElement(firstChild)) {
                const trigger = React.cloneElement(firstChild as React.ReactElement<any>, {
                    onClick: (e: React.MouseEvent) => {
                        e.preventDefault();
                        toggle();
                    },
                    'data-state': isOpen ? 'open' : 'closed',
                });

                return (
                    <div className="group" data-state={isOpen ? 'open' : 'closed'}>
                        {trigger}
                        {isOpen && childrenArray.length > 1 && (
                            <div className="overflow-hidden transition-all duration-300 ease-in-out">
                                {childrenArray.slice(1)}
                            </div>
                        )}
                    </div>
                );
            }
            return null;
        },
        [isOpen, toggle]
    );

    return {
        isSubOpen: isOpen,
        Sub,
    };
};
