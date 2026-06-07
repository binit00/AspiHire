import Topic from '../models/Topic.js'

const defaultTopics = [
  ['react-hooks', 'Hooks', 'React'],
  ['react-context', 'Context', 'React'],
  ['react-reconciliation', 'Reconciliation', 'React'],
  ['react-performance', 'Performance', 'React'],
  ['react-suspense', 'Suspense', 'React'],
  ['react-portals', 'Portals', 'React'],
  ['react-error-boundaries', 'Error Boundaries', 'React'],
  ['react-usereducer', 'useReducer', 'React'],
  ['react-custom-hooks', 'Custom Hooks', 'React'],
  ['react-code-splitting', 'Code Splitting', 'React'],
  ['node-event-loop', 'Event Loop', 'Node.js'],
  ['node-streams', 'Streams', 'Node.js'],
  ['node-worker-threads', 'Worker Threads', 'Node.js'],
  ['node-cluster', 'Cluster', 'Node.js'],
  ['node-middleware', 'Middleware', 'Node.js'],
  ['node-jwt', 'JWT', 'Node.js'],
  ['node-rate-limiting', 'Rate Limiting', 'Node.js'],
  ['node-error-handling', 'Error Handling', 'Node.js'],
  ['node-memory-leaks', 'Memory Leaks', 'Node.js'],
  ['mongodb-aggregation', 'Aggregation Pipeline', 'MongoDB'],
  ['mongodb-indexes', 'Indexes', 'MongoDB'],
  ['mongodb-transactions', 'Transactions', 'MongoDB'],
  ['mongodb-atlas-search', 'Atlas Search', 'MongoDB'],
  ['mongodb-geonear', 'GeoNear', 'MongoDB'],
  ['mongodb-schema-design', 'Schema Design', 'MongoDB'],
  ['mongodb-replication', 'Replication', 'MongoDB'],
  ['dsa-arrays', 'Arrays', 'DSA'],
  ['dsa-strings', 'Strings', 'DSA'],
  ['dsa-hashmaps', 'Hashmaps', 'DSA'],
  ['dsa-trees', 'Trees', 'DSA'],
  ['dsa-graphs', 'Graphs', 'DSA'],
  ['dsa-dp', 'DP', 'DSA'],
  ['dsa-sliding-window', 'Sliding Window', 'DSA'],
  ['dsa-two-pointers', 'Two Pointers', 'DSA'],
  ['dsa-bfs-dfs', 'BFS/DFS', 'DSA'],
  ['dsa-heaps', 'Heaps', 'DSA'],
  ['system-design-cap', 'CAP Theorem', 'System Design'],
  ['system-design-load-balancing', 'Load Balancing', 'System Design'],
  ['system-design-caching', 'Caching Strategies', 'System Design'],
  ['system-design-sharding', 'Database Sharding', 'System Design'],
  ['system-design-api-design', 'API Design', 'System Design'],
  ['system-design-message-queues', 'Message Queues', 'System Design'],
  ['system-design-cdn', 'CDN', 'System Design'],
]

const toTopic = (topic) => ({
  id: topic._id.toString(),
  slug: topic.slug,
  name: topic.name,
  category: topic.category,
  status: topic.status,
  lastRevisedAt: topic.lastRevisedAt,
  resources: topic.resources,
  practiceQuestions: topic.practiceQuestions ?? [],
  linkedQuestionIds: topic.linkedQuestionIds?.map((id) => id.toString()) ?? [],
})

const seedTopics = async (userId) => {
  const count = await Topic.countDocuments({ user: userId })
  if (count > 0) return

  await Topic.insertMany(defaultTopics.map(([slug, name, category]) => ({
    user: userId,
    slug,
    name,
    category,
  })))
}

export const getTopics = async (req, res) => {
  try {
    await seedTopics(req.user.id)
    const topics = await Topic.find({ user: req.user.id }).sort({ category: 1, name: 1 })
    res.json({ success: true, data: topics.map(toTopic) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    )

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' })
    }

    res.json({ success: true, data: toTopic(topic) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const createTopic = async (req, res) => {
  try {
    const { name, category, practiceQuestions } = req.body
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Name and category are required' })
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    // Check if exists
    let topic = await Topic.findOne({ user: req.user.id, slug })
    if (topic) {
      return res.status(409).json({ success: false, message: 'Topic already exists' })
    }

    topic = await Topic.create({
      user: req.user.id,
      name,
      slug,
      category,
      practiceQuestions: practiceQuestions || []
    })

    res.status(201).json({ success: true, data: toTopic(topic) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const bulkImportTopics = async (req, res) => {
  try {
    const { topics } = req.body // array of { name, category, questions? }
    if (!Array.isArray(topics)) {
      return res.status(400).json({ success: false, message: 'topics array is required' })
    }

    const results = []
    for (const item of topics) {
      if (!item.name || !item.category) continue;
      
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      let topic = await Topic.findOne({ user: req.user.id, slug })
      if (!topic) {
        topic = await Topic.create({
          user: req.user.id,
          name: item.name,
          slug,
          category: item.category,
          practiceQuestions: Array.isArray(item.questions) ? item.questions : []
        })
      } else if (Array.isArray(item.questions) && item.questions.length > 0) {
        // Merge questions
        const newQs = item.questions.filter(q => !topic.practiceQuestions.includes(q))
        if (newQs.length > 0) {
          topic.practiceQuestions.push(...newQs)
          await topic.save()
        }
      }
      results.push(toTopic(topic))
    }

    res.status(201).json({ success: true, data: results })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
