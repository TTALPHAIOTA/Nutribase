"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowRight } from "lucide-react"

export default function HomePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
  }

  return (
    <div className="min-h-screen bg-[#2D1B69] text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="mt-8 mb-12">
          <h1 className="text-3xl font-bold leading-tight">Welcome to food tracking, made simple.</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Marcus Mendoza"
              className="w-full px-4 py-3 bg-[#3D2A7D] rounded-lg border border-[#4D3A8D] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+1 562-458-9002"
              className="w-full px-4 py-3 bg-[#3D2A7D] rounded-lg border border-[#4D3A8D] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••"
                className="w-full px-4 py-3 bg-[#3D2A7D] rounded-lg border border-[#4D3A8D] focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#8A6AE6] hover:bg-[#7859D4] text-white font-medium py-3 px-4 rounded-lg transition duration-200 mt-8"
          >
            Continue
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-400">Already have an account?</p>
          <div className="flex items-center">
            <a href="#" className="text-xl font-semibold">
              Log In
            </a>
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  )
}
