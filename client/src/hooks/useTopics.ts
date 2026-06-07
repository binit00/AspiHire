import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as topicService from '../services/topic.service'
import type { Topic } from '../components/features/kanban/kanban.types'

const QUERY_KEY = ['topics'] as const

export const useTopics = () => {
  const qc = useQueryClient()
  const query = useQuery<Topic[]>({
    queryKey: QUERY_KEY,
    queryFn: topicService.fetchTopics,
    staleTime: 1000 * 60,
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Topic> }) => topicService.updateTopic(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const create = useMutation({
    mutationFn: topicService.createTopic,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const bulkImport = useMutation({
    mutationFn: topicService.bulkImportTopics,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  return { ...query, update, create, bulkImport }
}

export default useTopics
