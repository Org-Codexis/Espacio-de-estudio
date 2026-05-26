import './App.css'

import { useState } from 'react'

import MainLayout from './layouts/MainLayout'

import SidebarMenu from './components/SidebarMenu'

import UsersPage from './pages/UsersPage'
import SpacesPage from './pages/SpacesPage'
import ReservationsPage from './pages/ReservationsPage'
import ReportsPage from './pages/ReportsPage'

function App() {

  
  const [page, setPage] =
    useState('users')

  function renderContent() {

    switch (page) {

      case 'users':

        return <UsersPage />

      case 'spaces':

        return <SpacesPage />

      case 'reservations':

        return <ReservationsPage />

      case 'reports':

        return <ReportsPage />

      default:

        return <UsersPage />

    }

  }

  const sidebar = (

    <SidebarMenu
      current={page}
      onChange={setPage}
    />

  )

  return (

    <MainLayout
      sidebar={sidebar}
      content={renderContent()}
    />

  )

}

export default App