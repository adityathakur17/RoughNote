import { getCollections } from '@/actions/collection';
import { getJournalEntries } from '@/actions/journal';
import React from 'react'

const Dashboard = async() => {
  const collections = await getCollections()
  const entriesDats = await getJournalEntries()



  return (
    <div>dashboard</div>
  )
}

export default Dashboard;