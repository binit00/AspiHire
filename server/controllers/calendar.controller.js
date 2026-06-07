import Job from '../models/Job.js'

export const getEvents = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id, 'interviewRounds.0': { $exists: true } })
    const events = jobs.flatMap((job) =>
      job.interviewRounds
        .filter((round) => round.date && round.status === 'Scheduled')
        .map((round) => ({
          id: round._id.toString(),
          applicationId: job._id.toString(),
          title: `${round.name} - ${job.company}`,
          company: job.company,
          interviewers: round.interviewers,
          date: round.date,
          description: round.notes,
          meetLink: round.meetLink,
          calendarLinked: round.calendarLinked,
        }))
    )

    res.json({ success: true, data: events })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const createEvent = async (req, res) => {
  try {
    const { applicationId, roundId } = req.body
    const job = await Job.findOne({ _id: applicationId, user: req.user.id })

    if (!job) {
      return res.status(404).json({ success: false, message: 'Application not found' })
    }

    const round = job.interviewRounds.id(roundId)
    if (!round) {
      return res.status(404).json({ success: false, message: 'Interview round not found' })
    }

    round.calendarLinked = true
    await job.save()

    res.status(201).json({
      success: true,
      data: {
        id: round._id.toString(),
        applicationId: job._id.toString(),
        title: `${round.name} - ${job.company}`,
        date: round.date,
        calendarLinked: round.calendarLinked,
      },
      message: 'Calendar event scaffolded. Add Google OAuth credentials to sync with Google Calendar.',
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
