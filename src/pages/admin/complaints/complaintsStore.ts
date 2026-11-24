import { COMPLAINTS, type ComplaintStatus } from '../adminData'
import { createStore } from '../createStore'

const store = createStore(COMPLAINTS)

export const useComplaints = store.use

export const setComplaintStatus = (id: string, status: ComplaintStatus) =>
  store.set((list) => list.map((complaint) => (complaint.id === id ? { ...complaint, status } : complaint)))
