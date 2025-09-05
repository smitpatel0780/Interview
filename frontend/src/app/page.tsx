"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ChevronDown } from "lucide-react"
import RecordsTable from '@/components/app/home/table'
import { fetchRegistrations, createRegistration, updateRegistration } from "@/lib/api"
import { Registration } from "@/types/registration"

const stateDistrictData: Record<string, string[]> = {
  Gujarat: ["Ahmedabad", "Surat", "Rajkot", "Vadodara"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
}

export default function Home() {
  const [districts, setDistricts] = useState<string[]>([])
  const [records, setRecords] = useState<Registration[]>([])
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editId, setEditId] = useState<number | null>(null)

  const [formData, setFormData] = useState<Registration>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    district: "",
    city: "",
    zip: "",
  })

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      const data = await fetchRegistrations()
      setRecords(data)
    } catch (err) {
      toast.error("Failed to fetch records")
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      state: "",
      district: "",
      city: "",
      zip: "",
    })
    setDistricts([])
    setEditIndex(null)
    setEditId(null)
  }

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value
    setDistricts(stateDistrictData[state] || [])
    setFormData({ ...formData, state, district: "" })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 10) value = value.slice(0, 10)

    let formatted = value
    if (value.length > 6) {
      formatted = `(${value.slice(0, 3)})-${value.slice(3, 6)}-${value.slice(6)}`
    } else if (value.length > 3) {
      formatted = `(${value.slice(0, 3)})-${value.slice(3)}`
    }

    setFormData({ ...formData, phone: formatted })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target
    if (id === "zip") {
      const zipValue = value.replace(/\D/g, "").slice(0, 6)
      setFormData({ ...formData, [id]: zipValue })
    } else {
      setFormData({ ...formData, [id]: value })
    }
  }

  const validateForm = () => {
    const { phone, email, zip } = formData

    const requiredFields: Record<string, string> = {
      firstName: "First name",
      lastName: "Last name",
      phone: "Phone number",
      email: "Email",
      address: "Address",
      state: "State",
      district: "District",
      city: "City",
      zip: "ZIP code",
    }

    for (const [key, label] of Object.entries(requiredFields)) {
      if (!formData[key as keyof Registration]) {
        toast.error(`${label} is required.`)
        return false
      }
    }

    const phoneDigits = phone.replace(/\D/g, "")
    if (phoneDigits.length !== 10) {
      toast.error("Phone number must be 10 digits.")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.")
      return false
    }

    if (zip.length !== 6) {
      toast.error("ZIP code must be 6 digits.")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      if (editId !== null) {
        await updateRegistration(editId, formData)
        toast.success("Record updated successfully!")
      } else {
        await createRegistration(formData)
        toast.success("Record added successfully!")
      }
      await loadRecords()
      resetForm()
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  const handleEdit = (row: Registration, index: number) => {
    setFormData(row)
    setDistricts(stateDistrictData[row.state] || [])
    setEditIndex(index)
    setEditId(row.id ?? null)
  }

  return (
    <div>
      <Card className="w-full">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 border-r p-2">
            <CardHeader className="pb-2">
              <CardTitle>{editIndex !== null ? "Edit Record" : "Add Record"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <FloatingInput id="firstName" label="First Name" type="text" value={formData.firstName} onChange={handleChange} />
                <FloatingInput id="lastName" label="Last Name" type="text" value={formData.lastName} onChange={handleChange} />
                <FloatingInput id="phone" label="Phone" type="text" value={formData.phone} onChange={handlePhoneChange} />
                <FloatingInput id="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
                <FloatingInput id="address" label="Address" type="text" value={formData.address} onChange={handleChange} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingSelect id="state" label="State" options={Object.keys(stateDistrictData)} value={formData.state} onChange={handleStateChange} />
                  <FloatingSelect id="district" label="District" options={districts} value={formData.district} onChange={handleChange} />
                  <FloatingInput id="city" label="City" type="text" value={formData.city} onChange={handleChange} />
                  <FloatingInput id="zip" label="Zip" type="text" value={formData.zip} onChange={handleChange} />
                </div>
              </form>
            </CardContent>
          </div>

          <div className="flex-1 border-b mx-3">
            <CardHeader className="text-center">
              <CardTitle>Show the List of records</CardTitle>
            </CardHeader>
            <CardContent>
              <RecordsTable data={records} onEdit={handleEdit} />
            </CardContent>
          </div>
        </div>
        <CardFooter className="flex justify-start gap-2">
          <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{editIndex !== null ? "Update" : "Submit"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}


function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-sm 
                   focus:border-gray-500 focus:ring-0 focus:outline-none"
        required
      />
      <label
        htmlFor={id}
        className="absolute left-3 -top-2 text-gray-500 text-xs px-1 bg-white transition-all
          peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600"
      >
        {label}
      </label>
    </div>
  )
}


function FloatingSelect({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string
  label: string
  options: string[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <div className="relative w-full">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 pr-10 text-sm leading-5
                   focus:border-gray-500 focus:ring-0 focus:outline-none appearance-none -translate-y-1/9"
        required
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <label
        htmlFor={id}
        className="absolute left-3 -top-2 text-gray-500 text-xs px-1 bg-white transition-all
          peer-placeholder-shown:top-4  peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600"
      >
        {label}
      </label>

      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        size={16}
      />
    </div>
  )
}