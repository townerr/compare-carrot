import { FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OpenFileDialog, ReadFileContents } from '../../wailsjs/go/main/App'

const FileButton = ({ setSelectedFile }: { setSelectedFile: (file: string) => void }) => {
  //TODO: add file type dectection and pass to editor component to auto select language
  
  const handleOpenFile = async () => {
    const filePath = await OpenFileDialog();
    if (filePath && filePath.length > 0) {
      try {
        const fileContents = await ReadFileContents(filePath);
        setSelectedFile(fileContents);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  }

  return (
    <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow active:bg-neutral-200 w-1/3 text-center cursor-pointer" onClick={() => handleOpenFile()}>
        <FileIcon className="w-4 h-4" />
        <span>Select File</span>
    </Button>
  )
}

export default FileButton