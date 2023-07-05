import { NodeExtensionSpec, NodeExtension, CommandFunction } from 'remirror';
import React, { ComponentType } from 'react';
import {ExtensionTag} from '@remirror/core';
import { NodeViewComponentProps } from '@remirror/react';

class SummaryExtension extends NodeExtension {
    get name() {
        return 'summary-card' as const;
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = ({ node, forwardRef }) => {
        return (  
            <div className='card' style={{ color: "#000" }}>
                <div style={{ color: "#000", }}>
                    <h1>Summary</h1>
                    <p ref={forwardRef} style={{
                        width: "100%",
                        maxWidth: "400px",
                        marginTop: "40px",
                        background: "#c2c8cc",
                    }} />
                </div>
            </div>
        );
    };
    
    createNodeSpec(): NodeExtensionSpec {
        return {
            /**
             * FIXME: Draggable is not working currently, needs investigation
             */
            draggable: true,
            selectable: true,
            /**
             * Atom is needed to create a boundary between the card and
             * others elements in the editor
             */
            atom: true,
            /**
             * isolating is needed to not allow cards to get merged
             * whend deleting lines
             */
            isolating: true,
            attrs: {
                id: { default: null },
                name: { default: '' },
                content: { default: "teste" }
            },
            content: 'block*',
            toDOM: (node) => {
                const attrs = {
                    'data-summary-id': node.attrs.id,
                    'data-summary-name': node.attrs.name,
                };
                return ['div', attrs, 0];
            },
            parseDOM: [{
                tag: 'div[data-summary-id]',
                getAttrs: (dom) => {
                    const node = dom as HTMLDivElement;
                    const id = node.getAttribute('data-summary-id');
                    const name = node.getAttribute('data-summary-name');
        
                    return {
                        id,
                        name,
                    };
                },
            }],
        };
    }

    createTags() {
        return [ExtensionTag.Block];
    }

    commands(): Record<string, CommandFunction> {
        return {
            delete: () => {
                return false; // Prevent deletion of the user card node
            },
        };
    }
}

export default SummaryExtension