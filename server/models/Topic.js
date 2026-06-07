import mongoose from 'mongoose'

const TopicSchema = new mongoose.Schema(
  {
    user:              { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slug:              { type: String, required: true, trim: true },
    name:              { type: String, required: true, trim: true },
    category:          { type: String, required: true, trim: true },
    status:            { type: String, enum: ['not_started', 'in_progress', 'revised', 'confident', 'needs_revision'], default: 'not_started' },
    lastRevisedAt:     { type: String },
    resources:         [{ label: { type: String, trim: true }, url: { type: String, trim: true } }],
    practiceQuestions: [{ type: String, trim: true }],
    linkedQuestionIds: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true }
)

TopicSchema.index({ user: 1, slug: 1 }, { unique: true })

const Topic = mongoose.model('Topic', TopicSchema)
export default Topic
