import { FileText, FileSpreadsheet, PlaySquare, Play, File, Image as ImageIcon, ExternalLink } from 'lucide-react';
export const getFileTypeName = (fileType) => {
    if (!fileType) return 'Document';
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return 'PDF Document';
    if (type.includes('xls') || type.includes('sheet') || type.includes('excel')) return 'Excel Spreadsheet';
    if (type.includes('video') || type.includes('mp4')) return 'Video File';
    if (type.includes('image')) return 'Image File';

    return 'Document';
};

export const getResourceConfig = (fileType) => {
    if (!fileType) return { icon: File, color: 'text-slate-500', bg: 'bg-slate-100', actionText: 'Open File', actionIcon: ExternalLink };
    const type = fileType.toLowerCase();

    if (type.includes('pdf')) {
        return { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50', actionText: 'Open PDF', actionIcon: ExternalLink };
    }
    if (type.includes('xls') || type.includes('sheet') || type.includes('excel')) {
        return { icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-50', actionText: 'Open File Excel', actionIcon: ExternalLink };
    }
    if (type.includes('video') || type.includes('mp4')) {
        return { icon: PlaySquare, color: 'text-sky-500', bg: 'bg-sky-50', actionText: 'Watch Video', actionIcon: Play };
    }
    if (type.includes('image')) {
        return { icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50', actionText: 'View Image', actionIcon: ExternalLink };
    }

    return { icon: File, color: 'text-slate-500', bg: 'bg-slate-100', actionText: 'Open File', actionIcon: ExternalLink };
};

export const getTypeBadgeStyle = (type) => {
    switch (type) {
        case 'GUIDE':
            return 'bg-[#89A8B2] text-white shadow-sm';
        case 'MATERIAL':
            return 'bg-[#2C3E50] text-white shadow-sm';
        case 'DOCUMENT':
            return 'bg-white text-[#2C3E50] shadow-sm';
        default:
            return 'bg-white text-slate-500 shadow-sm';
    }
};