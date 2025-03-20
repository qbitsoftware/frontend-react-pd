import { createFileRoute } from '@tanstack/react-router'
import ErrorPage from '../../../components/error'
import {
  formatDateString,
} from '@/lib/utils'
import { useTournament } from './-components/tournament-provider'
import Editor from '@/routes/admin/-components/yooptaeditor'
import { useState, useMemo } from 'react'
import { YooptaContentValue } from '@yoopta/editor'
import { useTranslation } from 'react-i18next'

interface YooptaEditorNode {
  id?: string;
  type?: string;
  text?: string;
  children?: YooptaEditorNode[];
  value?: YooptaEditorNode[];
  [key: string]: any;
}

export const Route = createFileRoute('/voistlused/$tournamentid/')({
  errorComponent: () => {
    return <ErrorPage />
  },
  component: RouteComponent,
})

function RouteComponent() {
  const tournament = useTournament()
  const { t } = useTranslation()
  const [value, setValue] = useState<YooptaContentValue | undefined>(
    tournament.information ? JSON.parse(tournament.information) : undefined
  )

  const hasContent = useMemo(() => {
    if (!value) return false
    
    const hasNonEmptyText = (obj: unknown): boolean => {
      if (!obj) return false
      
      if (Array.isArray(obj)) {
        return obj.some((item) => hasNonEmptyText(item))
      }
      
      if (typeof obj === 'object' && obj !== null) {
        const node = obj as YooptaEditorNode
        
        if (node.text && typeof node.text === 'string' && node.text.trim() !== '') {
          return true
        }
        
        if (node.children) {
          return hasNonEmptyText(node.children)
        }
        
        if (node.value) {
          return hasNonEmptyText(node.value)
        }
        
        return Object.values(node).some((val) => hasNonEmptyText(val))
      }
      
      return false
    }
    
    return hasNonEmptyText(value)
  }, [value])

  return (
    <div className="px-2 md:px-12 py-4 md:py-8">
      <h5 className="font-bold mb-4 md:mb-8 text-center md:text-left">Info</h5>
      <div className={`pb-8 overflow-y-auto flex flex-col items-start ${hasContent ? 'justify-center' : 'justify-start'}' md:flex-row md:space-x-12`}>
        {tournament ? (
          <>
            {tournament.information && hasContent && (
              <div className="w-full md:w-2/3">
                <Editor value={value} setValue={setValue} readOnly />
              </div>
            )}
            <div className="w-full md:w-1/3 flex flex-col space-y-1 p-3 md:p-6 bg-[#EBEFF5]/20 border-2 border-[#eee] rounded-[10px] mb-4 md:mb-0">
              <p>
                {t('competitions.category')}: <strong>{tournament.category}</strong>
              </p>
              <p>
                {t('competitions.dates')}:{' '}
                <strong>
                  {formatDateString(tournament.start_date)} -{' '}
                  {formatDateString(tournament.end_date)}
                </strong>
              </p>
              <p>
                {t('competitions.location')}: <strong>{tournament.location}</strong>
              </p>
              <p>
                {t('competitions.tables')}: <strong>{tournament.total_tables}</strong>
              </p>
            </div>
          </>
        ) : (
          <div>{t('competitions.errors.info_missing')}</div>
        )}
      </div>
    </div>
  )
}