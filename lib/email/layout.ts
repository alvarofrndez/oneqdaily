type LayoutOptions = {
  previewText?: string
  bodyHtml: string
}

export function renderEmailLayout({
  previewText = '',
  bodyHtml,
}: LayoutOptions): string {
  return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <title>One question daily</title>
        </head>

        <body
            style="
            margin:0;
            padding:0;
            background-color:#f6f6f6;
            font-family:Helvetica,Arial,sans-serif;
            "
        >
            <span
            style="
                display:none;
                max-height:0;
                overflow:hidden;
                opacity:0;
            "
            >
            ${previewText}
            </span>

            <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
                background-color:#f6f6f6;
                padding:32px 16px;
            "
            >
            <tr>
                <td align="center">
                <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                    max-width:480px;
                    background-color:#ffffff;
                    border-radius:8px;
                    "
                >
                    <tr>
                    <td style="padding:32px;">
                        <table
                        role="presentation"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        >
                        ${bodyHtml}
                        </table>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>
            </table>
        </body>
    </html>`
}