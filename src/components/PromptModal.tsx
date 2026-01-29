import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PROMPT_CONTENT } from '../utils/constants'

interface PromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PromptModal({ isOpen, onClose }: PromptModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-testid="modal-backdrop"
        className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>El Prompt</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
            {PROMPT_CONTENT}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}
