import React, { useCallback, useEffect } from 'react';
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs';
import {
    Remirror,
    ThemeProvider,
    useRemirror,
    useCommands,
    useHelpers,
} from '@remirror/react';
import FloatingLinkToolbar from './LinkToolBar/FloatingLinkToolbar';
import { uniqueId } from 'remirror';
import {
    AnnotationExtension,
    PlaceholderExtension,
    YjsExtension,
    LinkExtension
} from 'remirror/extensions';
import SummaryExtension from './SummaryExtension';
import QuestionsExtension from './QuestionsExtensions';

const summaryAttrs = {
    id: uniqueId(),
    name: 'summary',
};

const questionsAttrs = {
    id: uniqueId(),
    name: 'questions',
};

const contentTypes = ["questions-card", "summary-card"]

export const SummaryContent = () => `
    <div data-summary-id="${summaryAttrs.id}" data-summary-name="${summaryAttrs.name}">
        <p></p>
    </div>`;

export const QuestionsContent = () => `
    <div data-questions-id="${questionsAttrs.id}" data-questions-name="${questionsAttrs.name}">
        <p></p>
    </div>`;


const ydoc = new Y.Doc();

const provider = new WebsocketProvider('wss://1234-pepermao-factcheckingwo-atzbzg2z7lb.ws-eu101.gitpod.io/', 'Aletheia', ydoc)

const extensions = () => [
    new SummaryExtension({ disableExtraAttributes: true }),
    new QuestionsExtension({ disableExtraAttributes: true }),
    new AnnotationExtension(),
    new PlaceholderExtension({ placeholder: 'Open second tab and start to type...' }),
    new LinkExtension({ autoLink: true }),
    new YjsExtension({ getProvider: () => provider }),
];

const Form = () => {
    const commands = useCommands();
    const { getHTML } = useHelpers()
    console.log(getHTML())
    const HTML = getHTML();
    useEffect(() => {
        if(!HTML.includes(`data-summary-name="summary"`)) {
            console.log("nao tem summary")
            commands.insertHtml(
                SummaryContent(),
                {
                    selection: 0,
                }
            );
        }
        if(!HTML.includes(`data-questions-name="questions"`)) {
            console.log("não tem questions")
            commands.insertHtml(
                QuestionsContent(),
                {
                    selection: 0,
                }
            );
        }
    }, [commands]);

    return (
        <div />
    );
};

function SaveButton() {
    const { getJSON } = useHelpers();

    const handleClick = useCallback(() => {
        const JSONContent = getJSON();
        const formValues = JSONContent.content
            .filter((content) => contentTypes.includes(content.type))
            .map(({ attrs, content }) => {
                return {
                    [attrs.name as string]:
                        content
                            .map(({ content }) => content[0].text)
                            .reduce((a, b) => a + `\n ${b}`),
                };
            })
        console.log(formValues)
        window.localStorage.setItem("context", JSON.stringify(formValues))

    }, [getJSON]);

    return (
        <button onMouseDown={(event) => event.preventDefault()} onClick={handleClick}>
            Save
        </button>
    );
}

const Colaborating = () => {
    const { manager, state } = useRemirror({
        extensions,
        core: { excludeExtensions: ['history'] },
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
                <Form />
                <SaveButton />
            </Remirror>
        </ThemeProvider>
    );
};

export default Colaborating;