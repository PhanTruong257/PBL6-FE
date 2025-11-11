import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  MoreHorizontal, 
  Share2, 
  Link, 
  Download, 
  Filter,
  SortAsc,
  Search,
  Folder,
  FileText,
  File
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { mockClassInfo, mockUser } from '../mock-data'
import { type Material, type Material_full_info, FileType } from '@/types/material'
import { fetchUserProfileFromIds, useMaterialsDetail } from '../hooks/use-class-detail'
import type { User } from '@/types'


interface MaterialsViewProps {
  materials: Material_full_info[]
}


// Mock data for demonstration
const mockMaterials: MaterialsViewProps = {
    materials:[
    {
        material_id: 1,
        title :'material 1',
        file_url: '',
        uploaded_by: mockUser,
        uploaded_at: new Date(),
        type: FileType.document,
        file_size: 23,
    },
    {
        material_id: 2,
        title :'material 2',
        file_url: '',
        uploaded_by: mockUser,
        uploaded_at: new Date(),
        type: FileType.document,
        file_size: 23,
    },
    {
        material_id: 3,
        title :'material 3',
        file_url: '',
        uploaded_by: mockUser,
        uploaded_at: new Date(),
        type: FileType.document,
        file_size: 23,
    },
]}

const defaultUser = mockUser;



export function MaterialsView({ materials }: MaterialsViewProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

    const user = mockUser;
    const classInfo = mockClassInfo;

    

    

    const uploadFileToServer = async (): Promise<string> => {
        const formData = new FormData()
        for (let file of uploadedFiles) formData.append('files', file);
        formData.append('uploader_id', user.user_id.toString());
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/classes/${classInfo.class_id}/upload-files`, {
                method: 'POST',
                body: formData,
            })
            
            if (!response.ok) {
                throw new Error('Upload failed')
            }
            
            const result = await response.json()
            return result.url || result.path
        } catch (error) {
            console.error('File upload error:', error)
            throw error
        }
    }

    const handleOpenFileModal = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return

        for (const file of Array.from(files)) {
            // Add file to state with uploading status
            setUploadedFiles(prev => [...prev, file])

        }

        // Reset input
        if (event.target) {
            event.target.value = ''
        }
    }
    
    
    const filteredMaterials = materials.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getFileIcon = (file_type:FileType) => {
        
        switch (file_type) {
        case FileType.audio:
            return <FileText className="h-6 w-6 text-red-600" />
        case FileType.video:
            return <FileText className="h-6 w-6 text-blue-600" />
        case FileType.image:
            return <File className="h-6 w-6 text-green-600" />
        case FileType.document:
            return <File className="h-6 w-6 text-yellow-600" />
        default:
            return <File className="h-6 w-6 text-gray-600" />
        }
    }

    return (
    <div className="flex-1 bg-white">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
                {/* Left side actions */}
                <div className="flex items-center space-x-3">
                    <Button variant="outline" onClick={handleOpenFileModal}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                    </Button>

                    <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                    </Button>

                    <Button variant="outline">
                    <Link className="h-4 w-4 mr-2" />
                    Copy link
                    </Button>

                    <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                    </Button>

                </div>
            </div>
        
            {/* Hidden File Input */}
            <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            onSubmit={uploadFileToServer}
            accept="*/*"
            />

            {/* Search and filters */}
            <div className="flex items-center space-x-3">
                <div className="flex-1 relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    />
                </div>
                <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                </Button>
                <Button variant="ghost" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
                </Button>
            </div>
        </div>

        {/* Column headers for list view */}
        
        <div className="px-6 py-2 border-b border-gray-100 bg-gray-50">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-5">Name</div>
                <div className="col-span-2">Upload at</div>
                <div className="col-span-3">Upload by</div>
                <div className="col-span-2">Size</div>
            </div>
        </div>
        {/* Content */}
        <div className="px-6 py-4">
            <div className="space-y-1">
            {filteredMaterials.map((item) => (
                <div 
                key={item.material_id} 
                className="grid grid-cols-12 gap-4 p-2 hover:bg-gray-50 rounded-md cursor-pointer group"
                >
                <div className="col-span-5 flex items-center space-x-3">
                    {getFileIcon(item.type)}
                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {item.title}
                    </span>
                </div>
                <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-600">{item.uploaded_at.toISOString()}</span>
                </div>
                <div className="col-span-3 flex items-center">
                    <span className="text-sm text-gray-600">{item.uploaded_by.full_name}</span>
                </div>
                <div className="col-span-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.file_size || '-'}</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Open</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
                </div>
            ))}
            </div>
        

            {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <File className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
                <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms' : 'Upload files or create folders to get started'}
                </p>
            </div>
            )}
        </div>
    </div>
    )
}