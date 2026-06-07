import mongoose from 'mongoose'

const KanbanStages = [
  'Wishlist',
  'Applied',
  'OA / Assignment',
  'Phone Screen',
  'Technical Round 1',
  'Technical Round 2',
  'HR Round',
  'Offer',
  'Rejected',
  'Withdrawn',
]

const RecruiterSchema = new mongoose.Schema({
  name:     { type: String, trim: true },
  email:    { type: String, trim: true },
  linkedIn: { type: String, trim: true },
}, { _id: false })

const CompanyInfoSchema = new mongoose.Schema({
  website:        { type: String, trim: true },
  linkedIn:       { type: String, trim: true },
  industry:       { type: String, trim: true },
  companySize:    { type: String, trim: true },
  hqLocation:     { type: String, trim: true },
  jobDescription: { type: String, trim: true },
  ctcOffered:     { type: String, trim: true },
  noticePeriod:   { type: String, trim: true },
  workMode:       { type: String, enum: ['Remote', 'Hybrid', 'Onsite'] },
  roleType:       { type: String, enum: ['Full-time', 'Contract'] },
}, { _id: false })

const InterviewRoundSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  date:           { type: String },
  duration:       { type: String, trim: true },
  interviewers:   { type: String, trim: true },
  type:           { type: String, enum: ['DSA', 'System Design', 'React', 'Node', 'HR', 'Assignment'], default: 'React' },
  status:         { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  notes:          { type: String, trim: true },
  rating:         { type: Number, min: 1, max: 5 },
  meetLink:       { type: String, trim: true },
  calendarLinked: { type: Boolean, default: false },
}, { timestamps: true })

const QuestionSchema = new mongoose.Schema({
  text:             { type: String, required: true, trim: true },
  topicTags:        [{ type: String, trim: true }],
  difficulty:       { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  myAnswerQuality:  { type: String, enum: ['Good', 'Partial', 'Missed'], default: 'Partial' },
  notes:            { type: String, trim: true },
  addedToRevision:  { type: Boolean, default: false },
}, { timestamps: true })

const MyQuestionSchema = new mongoose.Schema({
  text:          { type: String, required: true, trim: true },
  responseNotes: { type: String, trim: true },
}, { timestamps: true })

const OfferSchema = new mongoose.Schema({
  baseSalary:          { type: Number },
  signOnBonus:         { type: Number },
  targetBonus:         { type: Number },
  equityGrant:         { type: Number },
  equityVestingYears:  { type: Number, default: 4 },
  vestingSchedule:     { type: String, enum: ['25% yearly', '5/15/40/40', '1-yr cliff then monthly', 'other'], default: '25% yearly' },
  expectedJoiningDate: { type: String },
  offerLetterUrl:      { type: String, trim: true },
  decisionStatus:      { type: String, enum: ['Evaluating', 'Accepted', 'Declined'], default: 'Evaluating' },
  expiryDate:          { type: String },
  notes:               { type: String, trim: true },
}, { _id: false })

const JobSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company:     { type: String, required: true, trim: true },
    title:       { type: String, required: true, trim: true },
    logoUrl:     { type: String, trim: true },
    website:     { type: String, trim: true },
    appliedDate: { type: String, required: true },   // ISO string from client
    nextActionDate: { type: String },
    priority:    { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    status: {
      type:    String,
      enum:    KanbanStages,
      default: 'Wishlist',
    },
    stageHistory: [{
      stage:   { type: String, enum: KanbanStages },
      movedAt: { type: String, default: () => new Date().toISOString() },
    }],
    jobUrl: { type: String, trim: true },
    notes:  { type: String, trim: true },
    recruiter:            { type: RecruiterSchema, default: {} },
    companyInfo:          { type: CompanyInfoSchema, default: {} },
    interviewRounds:      { type: [InterviewRoundSchema], default: [] },
    questionsAskedToMe:   { type: [QuestionSchema], default: [] },
    questionsIAsked:      { type: [MyQuestionSchema], default: [] },
    offer:                { type: OfferSchema, default: undefined },
    tags:                 [{ type: String, trim: true }],
  },
  { timestamps: true }
)

const Job = mongoose.model('Job', JobSchema)
export default Job
