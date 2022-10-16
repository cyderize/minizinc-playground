import { parser } from './minizinc.grammar';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { createTheme } from 'thememirror';
import {
    LRLanguage,
    LanguageSupport,
    indentNodeProp,
    foldNodeProp,
    foldInside,
    delimitedIndent,
} from '@codemirror/language';
import { styleTags, tags as t } from '@lezer/highlight';

export const MiniZincLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            indentNodeProp.add({
                ParenthesisedExpression: delimitedIndent({
                    closing: ')',
                    align: false,
                }),
                Application: delimitedIndent({ closing: ')', align: false }),
                GeneratorCallGenerators: delimitedIndent({
                    closing: ')',
                    align: false,
                }),
                LetItems: delimitedIndent({ closing: '}', align: false }),
                ArrayLiteral: delimitedIndent({ closing: ']', align: false }),
                ArrayLiteral2d: delimitedIndent({
                    closing: '|]',
                    align: false,
                }),
                SetLiteral: delimitedIndent({ closing: '}', align: false }),
            }),
            foldNodeProp.add({
                ParenthesisedExpression: foldInside,
                Application: foldInside,
                GeneratorCallGenerators: foldInside,
                LetItems: foldInside,
                ArrayLiteral: foldInside,
                ArrayLiteral2d: foldInside,
                SetLiteral: foldInside,
            }),
            styleTags({
                Keyword: t.keyword,
                Identifier: t.variableName,
                QuotedIdentifier: t.variableName,
                Absent: t.null,
                Anonymous: t.null,
                BooleanLiteral: t.bool,
                Number: t.number,
                Infinity: t.number,
                StringLiteral: t.string,
                LineComment: t.comment,
                BlockComment: t.comment,
                '( )': t.paren,
                '{ }': t.paren,
                '[ ]': t.paren,
            }),
        ],
    }),
    languageData: {
        commentTokens: { line: '%' },
    },
});

export function MiniZinc() {
    return new LanguageSupport(MiniZincLanguage);
}

const theme = createTheme({
    variant: 'light',
    settings: {
        background: '#fff',
        foreground: '#000',
        caret: '#000',
        selection: '#036dd626',
        gutterBackground: '#fcfcfc',
        gutterForeground: '#999',
        lineHighlight: '#90909020',
    },
    styles: [
        {
            tag: t.comment,
            color: 'slategray',
        },
        {
            tag: t.string,
            color: '#690',
        },
        {
            tag: [t.number, t.bool, t.null],
            color: '#905',
        },
        {
            tag: t.variableName,
            color: '#000000',
        },
        {
            tag: [t.keyword],
            color: '#07a',
        },
    ],
});

export const MiniZincEditorExtensions = [
    basicSetup,
    keymap.of([indentWithTab]),
    theme,
    EditorView.theme({
        '&': { height: '100%' },
        '&.cm-editor.cm-focused': { outline: 'none' },
        '.cm-content, .cm-gutter': { minHeight: '100%' },
    }),
    MiniZinc(),
];
