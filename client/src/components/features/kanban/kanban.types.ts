export const KanbanStatus = {
  Wishlist:        'Wishlist',
  Applied:         'Applied',
  OAAssignment:    'OA / Assignment',
  PhoneScreen:     'Phone Screen',
  TechnicalRound1: 'Technical Round 1',
  TechnicalRound2: 'Technical Round 2',
  HRRound:         'HR Round',
  Offer:           'Offer',
  Rejected:        'Rejected',
  Withdrawn:       'Withdrawn',
} as const

export type KanbanStatus = (typeof KanbanStatus)[keyof typeof KanbanStatus]

export const Priority = {
  High:   'High',
  Medium: 'Medium',
  Low:    'Low',
} as const

export type Priority = (typeof Priority)[keyof typeof Priority]

export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite'
export type RoleType = 'Full-time' | 'Contract'
export type RoundType = 'DSA' | 'System Design' | 'React' | 'Node' | 'HR' | 'Assignment'
export type RoundStatus = 'Scheduled' | 'Completed' | 'Cancelled'
export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard'
export type AnswerQuality = 'Good' | 'Partial' | 'Missed'
export type TopicCategory = string // allow custom strings
export type TopicStatus = 'not_started' | 'in_progress' | 'revised' | 'confident' | 'needs_revision'

export interface RecruiterInfo {
  name?: string
  email?: string
  linkedIn?: string
}

export interface CompanyInfo {
  website?: string
  linkedIn?: string
  industry?: string
  companySize?: string
  hqLocation?: string
  jobDescription?: string
  ctcOffered?: string
  noticePeriod?: string
  workMode?: WorkMode
  roleType?: RoleType
}

export interface InterviewRound {
  id: string
  name: string
  date?: string
  duration?: string
  interviewers?: string
  type: RoundType
  status: RoundStatus
  notes?: string
  rating?: number
  meetLink?: string
  calendarLinked?: boolean
}

export interface Question {
  id: string
  text: string
  topicTags: string[]
  difficulty: QuestionDifficulty
  myAnswerQuality: AnswerQuality
  notes?: string
  addedToRevision: boolean
}

export interface MyQuestion {
  id: string
  text: string
  responseNotes?: string
}

export interface JobOffer {
  baseSalary?: number
  signOnBonus?: number
  targetBonus?: number
  equityGrant?: number
  equityVestingYears?: number
  vestingSchedule?: '25% yearly' | '5/15/40/40' | '1-yr cliff then monthly' | 'other'
  expectedJoiningDate?: string
  offerLetterUrl?: string
  decisionStatus: 'Evaluating' | 'Accepted' | 'Declined'
  expiryDate?: string
  notes?: string
}

export interface Topic {
  id: string
  slug: string
  name: string
  category: TopicCategory
  status: TopicStatus
  lastRevisedAt?: string
  resources: { label?: string; url: string }[]
  practiceQuestions?: string[]
  linkedQuestionIds: string[]
}

export interface AppNotification {
  id: string
  type: 'interview' | 'reminder' | 'offer' | 'digest'
  title: string
  body: string
  relatedApplicationId?: string
  read: boolean
  scheduledFor: string
  createdAt?: string
}

export interface JobCard {
  id:          string
  company:     string
  title:       string
  logoUrl?:     string
  website?:     string
  appliedDate: string      // ISO string
  nextActionDate?: string
  priority:    Priority
  status:      KanbanStatus
  stageHistory?: { stage: KanbanStatus; movedAt: string }[]
  jobUrl?:     string      // link to job posting
  notes?:      string      // freeform notes
  recruiter?: RecruiterInfo
  companyInfo?: CompanyInfo
  interviewRounds?: InterviewRound[]
  questionsAskedToMe?: Question[]
  questionsIAsked?: MyQuestion[]
  offer?: JobOffer
  tags?: string[]
  createdAt?:  string
  updatedAt?:  string
}
