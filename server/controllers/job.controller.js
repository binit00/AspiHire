import Job from '../models/Job.js'

const toJobCard = (doc) => ({
  id: doc._id.toString(),
  company: doc.company,
  title: doc.title,
  logoUrl: doc.logoUrl,
  website: doc.website,
  appliedDate: doc.appliedDate,
  nextActionDate: doc.nextActionDate,
  priority: doc.priority,
  status: doc.status,
  stageHistory: doc.stageHistory,
  jobUrl: doc.jobUrl,
  notes: doc.notes,
  recruiter: doc.recruiter,
  companyInfo: doc.companyInfo,
  interviewRounds: doc.interviewRounds?.map((round) => ({
    id: round._id.toString(),
    name: round.name,
    date: round.date,
    duration: round.duration,
    interviewers: round.interviewers,
    type: round.type,
    status: round.status,
    notes: round.notes,
    rating: round.rating,
    meetLink: round.meetLink,
    calendarLinked: round.calendarLinked,
  })) ?? [],
  questionsAskedToMe: doc.questionsAskedToMe?.map((question) => ({
    id: question._id.toString(),
    text: question.text,
    topicTags: question.topicTags,
    difficulty: question.difficulty,
    myAnswerQuality: question.myAnswerQuality,
    notes: question.notes,
    addedToRevision: question.addedToRevision,
  })) ?? [],
  questionsIAsked: doc.questionsIAsked?.map((question) => ({
    id: question._id.toString(),
    text: question.text,
    responseNotes: question.responseNotes,
  })) ?? [],
  offer: doc.offer,
  tags: doc.tags,
  createdAt: doc.createdAt?.toISOString(),
  updatedAt: doc.updatedAt?.toISOString(),
})

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json({ success: true, data: jobs.map(toJobCard) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getStats = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id })
    const byStatus = {}
    const byPriority = {}

    jobs.forEach((job) => {
      byStatus[job.status] = (byStatus[job.status] || 0) + 1
      byPriority[job.priority] = (byPriority[job.priority] || 0) + 1
    })

    res.json({
      success: true,
      data: {
        total: jobs.length,
        active: jobs.filter((job) => !['Offer', 'Rejected', 'Withdrawn'].includes(job.status)).length,
        offers: byStatus.Offer || 0,
        rejected: byStatus.Rejected || 0,
        byStatus,
        byPriority,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const createJob = async (req, res) => {
  try {
    const {
      company,
      title,
      logoUrl,
      website,
      appliedDate,
      nextActionDate,
      priority,
      status,
      jobUrl,
      notes,
      recruiter,
      companyInfo,
      interviewRounds,
      questionsAskedToMe,
      questionsIAsked,
      offer,
      tags,
    } = req.body

    if (!company || !title) {
      return res.status(400).json({ success: false, message: 'company and title are required' })
    }

    const initialStatus = status || 'Wishlist'
    const job = await Job.create({
      user: req.user.id,
      company,
      title,
      logoUrl,
      website,
      appliedDate: appliedDate || new Date().toISOString(),
      nextActionDate,
      priority,
      status: initialStatus,
      stageHistory: [{ stage: initialStatus, movedAt: new Date().toISOString() }],
      jobUrl,
      notes,
      recruiter,
      companyInfo,
      interviewRounds,
      questionsAskedToMe,
      questionsIAsked,
      offer,
      tags,
    })

    res.status(201).json({ success: true, data: toJobCard(job) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params
    const existingJob = await Job.findOne({ _id: id, user: req.user.id })

    if (!existingJob) {
      return res.status(404).json({ success: false, message: 'Job not found' })
    }

    const patch = { ...req.body }
    const update = { $set: patch }

    if (patch.status && patch.status !== existingJob.status) {
      update.$push = {
        stageHistory: {
          stage: patch.status,
          movedAt: new Date().toISOString(),
        },
      }
    }

    const job = await Job.findOneAndUpdate(
      { _id: id, user: req.user.id },
      update,
      { new: true, runValidators: true }
    )

    res.json({ success: true, data: toJobCard(job) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params
    const job = await Job.findOneAndDelete({ _id: id, user: req.user.id })

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' })
    }

    res.json({ success: true, data: { id } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
