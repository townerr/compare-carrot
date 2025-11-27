import { useState } from 'react'
import MonacoEditor  from '@monaco-editor/react'

const Editor = ({ file }: { file: string | null}) => {
    return (
        <div className="h-full w-full">
            <MonacoEditor
                height="100%"
                width="100%"
                value={file}
                language="c"
                theme="vs-dark"
                options={{
                    readOnly: false,
                    renderSideBySide: true,
                    renderIndicators: true,
                    minimap: {
                        enabled: false,
                    }
                }}
            />
        </div>
    )
}

export default Editor