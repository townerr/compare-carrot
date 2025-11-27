import { DiffEditor } from '@monaco-editor/react'

const DiffEditorComponent = ({ leftFile, rightFile }: { leftFile: string, rightFile: string }) => {
    return (
        <div className="w-full h-full">
            <DiffEditor
                height="100%"
                width="100%"
                original={leftFile}
                modified={rightFile}
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

export default DiffEditorComponent