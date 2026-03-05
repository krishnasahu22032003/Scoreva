export interface Commentary {
  id: number
  matchId: number

  minute: number | null
  sequence: number | null
  period: string | null

  eventType: string | null
  actor: string | null
  team: string | null

  message: string

  tags: string[]
  metadata: any

  createdAt: string
}