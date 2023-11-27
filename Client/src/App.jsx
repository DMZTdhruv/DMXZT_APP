import { Route, Routes } from "react-router-dom"
import { Login } from "./Components/Login"
import { Home } from "./Layout/Home"
import { GoogleOAuthProvider } from "@react-oauth/google"
import UserProfile from "./Layout/UserProfile"
import UserPage from "./Components/User/UserPage"

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path={`/user-profile/:userId`} element={<UserProfile />} />
        <Route path={`/user-page/:userId`} element={<UserPage />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App
