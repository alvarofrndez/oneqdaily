'use client';

import { useContext, useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';

import {
    RichTextEditor,
    Link,
    CodeBlock,
} from '@/components/editor';

import { UserContext } from '@/src/components/providers';

import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';

import styles from './AnswerInput.module.scss';

interface AnswerInputProps {
    value: string;
    onChange: (
        html: string,
        text: string
    ) => void;
    visibility:
        | 'public'
        | 'private';
    onVisibilityChange: (
        visibility:
            | 'public'
            | 'private'
    ) => void;
    disabled?: boolean;
    footerActions?: React.ReactNode;
}

export default function AnswerInput({
    value,
    onChange,
    visibility,
    onVisibilityChange,
    disabled = false,
    footerActions,
}: AnswerInputProps) {
    const t = useTranslations(
        'Questions.AnswerForm'
    );

    const user =
        useContext(UserContext);

    const isPrivate =
        visibility === 'private';

    const editor = useEditor({
        immediatelyRender: false,

        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                codeBlock: false,
            }),

            Link,
            Underline,
            TextStyle,

            Color.configure({
                types: ['textStyle'],
            }),

            Highlight.configure({
                multicolor: true,
            }),

            Subscript,
            Superscript,

            TextAlign.configure({
                types: [
                    'heading',
                    'paragraph',
                ],
            }),

            Placeholder.configure({
                placeholder:
                    t('placeholder'),
            }),

            CodeBlock,
        ],

        content: value,

        editable: !disabled,

        onUpdate: ({
            editor,
        }) => {
            onChange(
                editor.getHTML(),
                editor.getText()
            );
        },
    });

    useEffect(() => {
        if (!editor) return;

        const currentHtml =
            editor.getHTML();

        if (currentHtml !== value) {
            editor.commands.setContent(
                value || '',
                {
                    emitUpdate: false,
                }
            );
        }
    }, [editor, value]);

    useEffect(() => {
        if (!editor) return;

        editor.setEditable(
            !disabled
        );
    }, [editor, disabled]);

    const handleVisibilityChange = (
        checked: boolean
    ) => {
        onVisibilityChange(
            checked
                ? 'private'
                : 'public'
        );
    };

    return (
        <div
            className={
                styles.wrapper
            }
        >
            <RichTextEditor
                editor={editor}
                variant="default"
            >
                <RichTextEditor.Toolbar>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.Code />
                        <RichTextEditor.ClearFormatting />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignRight />
                        <RichTextEditor.AlignJustify />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Subscript />
                        <RichTextEditor.Superscript />
                        <RichTextEditor.CodeBlock />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Undo />
                        <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />

                <RichTextEditor.Footer>
                    <div
                        className={
                            styles.footer
                        }
                    >
                        <div
                            className={
                                styles.footerMeta
                            }
                        >
                            {!user ? (
                                <span
                                    className={
                                        styles.anonymous
                                    }
                                >
                                    {t(
                                        'postingAnonymous'
                                    )}
                                </span>
                            ) : (
                                <div
                                    className={
                                        styles.visibility
                                    }
                                >
                                    <Switch
                                        id="answer-visibility"
                                        size="sm"
                                        checked={
                                            isPrivate
                                        }
                                        onCheckedChange={
                                            handleVisibilityChange
                                        }
                                        disabled={
                                            disabled
                                        }
                                    />

                                    <Label
                                        htmlFor="answer-visibility"
                                        className={`
                                            ${
                                                styles.visibilityLabel
                                            }
                                            ${
                                                isPrivate
                                                    ? styles.active
                                                    : ''
                                            }
                                        `}
                                    >
                                        {t(
                                            'private'
                                        )}
                                    </Label>
                                </div>
                            )}
                        </div>

                        {footerActions ? (
                            <div
                                className={
                                    styles.footerActions
                                }
                            >
                                {
                                    footerActions
                                }
                            </div>
                        ) : null}
                    </div>
                </RichTextEditor.Footer>
            </RichTextEditor>
        </div>
    );
}