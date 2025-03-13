import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout'
import Public from './components/Public'
import Login from './Features/auth/Login'
import DashLayout from './components/Dash/DashLayout'
import Welcome from './Features/auth/Welcome'
import NotesList from './Features/notes/NotesList'
import UsersList from './Features/users/UsersList'
import EditUser from './Features/users/EditUser'
import NewUserForm from './Features/users/NewUserForm'
import EditNote from './Features/notes/EditNote'
import NewNote from './Features/notes/NewNote'
import Prefetch from './Features/auth/Prefetch'
import PersistLogin from './Features/auth/PersistLogin'
import RequireAuth from './Features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle'

function App() {
    useTitle('Dan D. Repairs')

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<Public />} />
                <Route path='login' element={<Login />} />

                {/* Protected Routes */}
                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                        <Route element={<Prefetch />}>
                            <Route path='dash' element={<DashLayout />}>

                                <Route index element={<Welcome />} />

                                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                                    <Route path='users'>
                                        <Route index element={<UsersList />} />
                                        <Route path=':id' element={<EditUser />} />
                                        <Route path='new' element={<NewUserForm />} />
                                    </Route>
                                </Route>

                                <Route path='notes'>
                                    <Route index element={<NotesList />} />
                                    <Route path=':id' element={<EditNote />} />
                                    <Route path='new' element={<NewNote />} />
                                </Route>

                            </Route> {/*end Dash */}
                        </Route>
                    </Route>
                </Route>
                {/* End Protected Routes */}

            </Route>
        </Routes>
    )
}

export default App
