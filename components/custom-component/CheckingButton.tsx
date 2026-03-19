import React from 'react'
import { Check, Loader2 } from 'lucide-react'

interface CheckingButtonProps {
  isChecked?: boolean;
  isLoading?: boolean;
}

export default function CheckingButton({ isChecked = false, isLoading = false }: CheckingButtonProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-full pr-4 pl-4 py-2 bg-gray-50 border border-gray-300">
        <div className="flex gap-2 items-center">
          <div className="rounded-full w-5 h-5 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
          </div>
          <div className="text-gray-500">Processing...</div>
        </div>
      </div>
    );
  }

  // Checked state
  if (isChecked) {
    return (
      <div className="rounded-full pr-4 pl-4 py-2 bg-emerald-50 border border-emerald-200">
        <div className="flex gap-2 items-center">
          <div className="rounded-full bg-emerald-500 w-5 h-5 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </div>
          <div className="text-emerald-700 font-medium">Checked</div>
        </div>
      </div>
    );
  }

  // Unchecked state
  return (
    <div className="rounded-full pr-4 pl-4 border py-2 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex gap-2 items-center">
        <div className="rounded-full border w-5 h-5"></div>
        <div>Check</div>
      </div>
    </div>
  )
}
