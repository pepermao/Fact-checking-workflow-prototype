import React, { ComponentType, useCallback, useEffect } from 'react';
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs';
import {
    NodeViewComponentProps,
    Remirror,
    ThemeProvider,
    useRemirror,
    useCommands,
    useRemirrorContext
} from '@remirror/react';
import {ExtensionTag} from '@remirror/core';
import FloatingLinkToolbar from './LinkToolBar/FloatingLinkToolbar';
import { DOMCompatibleAttributes, NodeExtensionSpec, NodeExtension, uniqueId, CommandFunction } from 'remirror';
import {
    AnnotationExtension,
    PlaceholderExtension,
    YjsExtension,
    LinkExtension
} from 'remirror/extensions';

const userAttrs = {
    id: 'randomId',
    name: 'John Doe',
    editable: false,
};

const UserCardContent = `
    <div data-user-id="${userAttrs.id}" data-user-name="${userAttrs.name}" contenteditable="${userAttrs.editable}">

    </div>`;


class UserCardExtension extends NodeExtension {
    get name() {
        return 'user-card' as const;
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = ({ node, forwardRef }) => {
        const { name, editable } = node.attrs;

        const handleDelete = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            // Prevent deletion if the component is protected
            if (!editable) {
                return;
            }
            // Handle delete logic here
            console.log('Deleting the component');
        }, [editable]);

        return (
            <div ref={forwardRef} className='card'>
                <h4>
                    <b>{name}</b>
                </h4>

                <span>Write user description below</span>
                <input />

                {!editable && (
                    <button onClick={handleDelete} disabled={!editable}>
                        Delete
                    </button>
                )}
            </div>
        );
    };

    createTags() {
        return [ExtensionTag.Block];
    }
    createNodeSpec(): NodeExtensionSpec {
        return {
            attrs: {
                id: { default: null },
                name: { default: '' },
                editable: { default: false },
            },
            content: 'block*',
            toDOM: (node) => {
                const attrs = {
                    'data-user-id': node.attrs.id,
                    'data-user-name': node.attrs.name,
                    'contenteditable': node.attrs.editable,
                };
                return ['div', attrs, 0];
            },
            parseDOM: [{
                tag: 'div[data-user-id]',
                getAttrs: (dom) => {
                    const node = dom as HTMLDivElement;
                    const id = node.getAttribute('data-user-id');
                    const name = node.getAttribute('data-user-name');
                    const editable = node.getAttribute('contenteditable');

                    return {
                        id,
                        name,
                        editable: editable === 'true',
                    };
                },
            }],
        };
    }
}

const ydoc = new Y.Doc();
// clients connected to the same room-name share document updates
const provider = new WebsocketProvider('wss://1234-pepermao-factcheckingwo-atzbzg2z7lb.ws-eu101.gitpod.io/', 'Aletheia', ydoc)

// All of our network providers implement the awareness crdt
const awareness = provider.awareness

// You can think of your own awareness information as a key-value store.
// We update our "user" field to propagate relevant user information.
awareness.setLocalStateField('user', {
    // Define a print name that should be displayed
    name: 'Emmanuelle Charpentier',
    // Define a color that should be associated to the user:
    color: '#ffb61e' // should be a hex color
})

const extensions = () => [
    new AnnotationExtension(),
    new PlaceholderExtension({ placeholder: 'Open second tab and start to type...' }),
    new LinkExtension({ autoLink: true }),
    new YjsExtension({ getProvider: () => provider }),
    new UserCardExtension({ disableExtraAttributes: true })
];

const Editor = () => {
    const { getRootProps } = useRemirrorContext({ autoUpdate: true });

    return (
        <div {...getRootProps()} />
    );
};

const Colaborating = () => {
    
    const { manager, state } = useRemirror({
        extensions,
        core: { excludeExtensions: ['history'] },
        content: UserCardContent,
        stringHandler: 'html',
    });

    return (
        <ThemeProvider>
            <Remirror
                manager={manager}
                initialContent={state}
                autoFocus
                autoRender='end'
            >
                <FloatingLinkToolbar />
                <Editor />
            </Remirror>
        </ThemeProvider>
    );
};

export default Colaborating;